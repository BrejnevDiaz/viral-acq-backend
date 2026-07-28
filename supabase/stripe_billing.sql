-- ═══════════════════════════════════════════════════════════════════════════
-- FACTURATION STRIPE + verrouillage des colonnes sensibles (Chantier #19)
-- ═══════════════════════════════════════════════════════════════════════════
-- À exécuter dans le SQL Editor de Supabase. Idempotent.
--
-- ⚠️⚠️ LA PARTIE 1 CORRIGE UNE FAILLE CRITIQUE — à exécuter même si tu
-- reportes Stripe.

-- ─── 1. Verrouillage de `plan` et `role` ─────────────────────────────────────
-- LE PROBLÈME : la policy `users_update_own` autorise un utilisateur à mettre à
-- jour SON profil — sans restreindre les colonnes. Comme la clé anon est
-- publique et que le front écrivait `profiles.plan` directement
-- (RoleContext.jsx), n'importe qui pouvait exécuter depuis la console :
--
--     supabase.from("profiles").update({ plan: "elite", role: "admin" })
--
-- …et s'offrir le plan à 299 €/mois PLUS les droits administrateur, puisque
-- `requireAdmin` (authMiddleware.js) fait autorité sur cette colonne.
--
-- LA CORRECTION : un trigger qui rétablit silencieusement les anciennes valeurs
-- de `plan` et `role` dès que la modification ne vient pas de la clé service.
-- Le webhook Stripe (clé service) reste seul habilité à changer un plan, et
-- l'attribution d'un rôle admin ne peut plus se faire que côté serveur ou
-- depuis le tableau de bord Supabase.
CREATE OR REPLACE FUNCTION protect_profile_privileges() RETURNS trigger AS $$
BEGIN
  -- ⚠️ On bloque explicitement les rôles CLIENT (`anon`, `authenticated`), au
  -- lieu de n'autoriser que `service_role` : cette première formulation
  -- annulait aussi les écritures faites depuis le SQL Editor (rôle `postgres`),
  -- donc l'administrateur ne pouvait plus attribuer un plan à la main — et
  -- l'UPDATE échouait EN SILENCE (« Success » affiché, rien de modifié).
  --
  -- ⚠️ Le `coalesce` est INDISPENSABLE : hors contexte JWT (éditeur SQL,
  -- migrations, tâches de maintenance), `auth.role()` vaut NULL. Or en SQL
  -- trivalué, `NULL NOT IN (...)` vaut NULL — pas TRUE. Sans coalesce, la
  -- condition n'était jamais satisfaite et la protection s'appliquait même à
  -- l'administrateur. Piège vérifié en production le 28/07/2026.
  IF coalesce(auth.role(), '') NOT IN ('anon', 'authenticated') THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    -- Un profil créé depuis le front ne peut jamais naître privilégié : sans
    -- cette branche, il suffirait de supprimer son profil et de le recréer avec
    -- plan='vip_elite'. Aujourd'hui aucune policy INSERT n'existe sur profiles,
    -- mais compter là-dessus serait fragile : le jour où quelqu'un en ajoute
    -- une, la faille rouvrirait en silence.
    NEW.plan := 'free';
    IF NEW.role = 'admin' THEN NEW.role := 'user'; END IF;
    RETURN NEW;
  END IF;

  -- UPDATE : le plan est figé (seul Stripe le change) ; le rôle métier
  -- (creator ↔ brand) reste modifiable par l'utilisateur, mais jamais vers
  -- 'admin' — sans quoi le changement de rôle légitime du produit serait
  -- silencieusement cassé.
  NEW.plan := OLD.plan;
  IF NEW.role = 'admin' AND OLD.role <> 'admin' THEN
    NEW.role := OLD.role;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS protect_profile_privileges_trigger ON public.profiles;
CREATE TRIGGER protect_profile_privileges_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION protect_profile_privileges();

-- ─── 1 bis. Élargir la contrainte sur `plan` ────────────────────────────────
-- ⚠️ BLOQUANT SANS CETTE LIGNE : `profiles.plan` n'acceptait que
-- ('free','standard','pro','elite'), alors que le paywall vend 'plus',
-- 'vip_pro' et 'vip_elite'. Chaque écriture du webhook aurait échoué sur une
-- violation de contrainte — donc AUCUN client payant n'aurait reçu son accès,
-- de façon systématique et silencieuse côté utilisateur.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_plan_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_plan_check
  CHECK (plan IN ('free', 'standard', 'plus', 'pro', 'vip_pro', 'elite', 'vip_elite'));

-- Même problème sur `role` : le code écrit 'brand' (PaywallModal, signup) alors
-- que la contrainte ne connaît que user/creator/admin, et `requireBrand`
-- (authMiddleware.js) attend précisément ce rôle — il était donc inatteignable.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('user', 'creator', 'brand', 'admin'));

-- ─── 2. Colonnes de facturation ──────────────────────────────────────────────
-- Rattachent un profil à son client et à son abonnement Stripe. Écrites
-- exclusivement par le webhook (clé service).
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id     text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  -- Reflet du statut Stripe : active, trialing, past_due, canceled…
  ADD COLUMN IF NOT EXISTS subscription_status    text,
  -- Fin de la période payée : sert à laisser l'accès jusqu'au terme quand un
  -- client annule (il a payé le mois, il doit en profiter).
  ADD COLUMN IF NOT EXISTS current_period_end     timestamptz;

CREATE INDEX IF NOT EXISTS profiles_stripe_customer_idx
  ON public.profiles (stripe_customer_id);

-- ─── 3. Journal des événements Stripe ────────────────────────────────────────
-- Stripe REJOUE ses webhooks en cas d'échec ou de doute : sans garde-fou, un
-- même événement pourrait être traité plusieurs fois. On enregistre chaque id
-- traité ; la clé primaire rend le second traitement impossible.
CREATE TABLE IF NOT EXISTS stripe_events (
  id           text PRIMARY KEY,          -- id de l'événement Stripe (evt_...)
  type         text NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;
-- Aucune policy : table strictement serveur, invisible et inaccessible au front.
