-- ═══════════════════════════════════════════════════════════════════════════
-- CORRECTIF 28/07/2026 — deux chantiers indépendants dans un seul script
--   A. Fermer l'octroi automatique du rôle admin par adresse e-mail
--   B. Créer la table `api_cache`, qui n'a jamais existé
-- ═══════════════════════════════════════════════════════════════════════════
-- Idempotent : ré-exécutable sans effet de bord.
--
-- ⚠️ ORDRE D'EXÉCUTION IMPORTANT
-- Exécuter ce script AVANT de déployer le nouveau backend. Le middleware ne
-- lit plus les e-mails codés en dur : si votre profil n'a pas role='admin'
-- en base au moment du déploiement, vous perdez l'accès administrateur.
-- La partie A3 ci-dessous vous le redonne — ne sautez pas cette étape.


-- ═══════════════════════════════════════════════════════════════════════════
-- A. PRIVILÈGES — supprimer la promotion automatique par e-mail
-- ═══════════════════════════════════════════════════════════════════════════
-- Problème : `handle_new_user()` promouvait automatiquement
-- brejnevdiaz@gmail.com en admin + elite à l'inscription. Or la confirmation
-- d'e-mail est désactivée dans ce projet Supabase : n'importe qui pouvait donc
-- s'inscrire AVEC cette adresse, sans jamais y avoir accès, et obtenir les
-- pleins pouvoirs. Une adresse e-mail non vérifiée ne prouve rien.
--
-- Corollaire : corriger authMiddleware.js seul n'aurait rien réglé. Le
-- middleware lit `profiles.role` ; c'est le trigger qui y écrivait 'admin'.

-- ─── A1. Le trigger n'accorde plus aucun privilège ──────────────────────────
-- ⚠️ La colonne `profiles.email` n'existe PAS en production (erreur 42703
-- constatée le 27/07/2026) alors que supabase_schema.sql l'insère : le fichier
-- de schéma a divergé de la base réelle. On construit donc l'INSERT
-- dynamiquement selon les colonnes réellement présentes, pour que ce script
-- fonctionne quel que soit l'état de votre base.
DO $do$
DECLARE
  has_email boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'email'
  ) INTO has_email;

  IF has_email THEN
    EXECUTE $fn$
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger AS $body$
      BEGIN
        -- Tout nouveau compte démarre au niveau le moins privilégié, sans
        -- exception. La promotion en admin est un acte manuel et tracé (A3).
        INSERT INTO public.profiles (id, email, role, plan)
        VALUES (NEW.id, NEW.email, 'user', 'free')
        ON CONFLICT (id) DO NOTHING;
        RETURN NEW;
      END;
      $body$ LANGUAGE plpgsql SECURITY DEFINER;
    $fn$;
    RAISE NOTICE 'handle_new_user() recréée AVEC la colonne email.';
  ELSE
    EXECUTE $fn$
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger AS $body$
      BEGIN
        INSERT INTO public.profiles (id, role, plan)
        VALUES (NEW.id, 'user', 'free')
        ON CONFLICT (id) DO NOTHING;
        RETURN NEW;
      END;
      $body$ LANGUAGE plpgsql SECURITY DEFINER;
    $fn$;
    RAISE NOTICE 'handle_new_user() recréée SANS la colonne email (absente).';
  END IF;
END
$do$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ─── A2. Constat : qui est admin aujourd'hui ? ──────────────────────────────
-- Lancez ceci et LISEZ le résultat. Si un compte que vous ne reconnaissez pas
-- y figure, quelqu'un a déjà exploité la faille.
--   SELECT p.id, p.role, p.plan, u.email, u.created_at, u.last_sign_in_at
--   FROM public.profiles p
--   JOIN auth.users u ON u.id = p.id
--   WHERE p.role = 'admin' OR p.plan IN ('elite', 'vip_elite')
--   ORDER BY u.created_at;

-- ─── A3. Vous redonner le rôle admin, sur l'UUID et non sur l'e-mail ────────
-- ⚠️ ÉTAPE OBLIGATOIRE avant de déployer le backend.
-- Décommentez et remplacez l'UUID par le vôtre (visible via la requête A2, ou
-- dans Supabase → Authentication → Users). On cible l'UUID parce qu'il est
-- attribué par Supabase et infalsifiable, contrairement à une adresse e-mail
-- non vérifiée.
--
--   UPDATE public.profiles
--   SET role = 'admin', plan = 'elite'
--   WHERE id = 'COLLEZ-ICI-VOTRE-UUID';
--
-- Note : cet UPDATE passe depuis le SQL Editor car le trigger
-- `protect_profile_privileges` (chantier #24) laisse passer les sessions dont
-- auth.role() n'est ni 'anon' ni 'authenticated'. Il resterait bloqué depuis
-- le front, ce qui est exactement l'effet recherché.


-- ═══════════════════════════════════════════════════════════════════════════
-- B. CACHE — créer la table `api_cache`
-- ═══════════════════════════════════════════════════════════════════════════
-- Problème : server.js appelle getCached()/setCached() sur `api_cache` depuis
-- le début, mais la table n'a jamais été créée. Les deux helpers avalent
-- l'erreur dans un `catch` muet : le cache n'a donc JAMAIS fonctionné, en
-- silence, et chaque ouverture d'onglet (AdSpy, Product Finder, Shop Analyzer)
-- consomme des crédits Tavily pour des résultats déjà payés.

CREATE TABLE IF NOT EXISTS public.api_cache (
  cache_key   text PRIMARY KEY,
  data        jsonb       NOT NULL,
  expires_at  timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Le balayage des entrées expirées se fait sur expires_at.
CREATE INDEX IF NOT EXISTS api_cache_expires_at_idx
  ON public.api_cache (expires_at);

ALTER TABLE public.api_cache ENABLE ROW LEVEL SECURITY;

-- ⚠️ AUCUNE policy pour `anon` ni `authenticated`, volontairement.
-- Cette table contient des résultats d'API payantes (Tavily, analyses de
-- boutiques concurrentes). Exposée en lecture, elle permettrait à n'importe
-- quel visiteur de récupérer gratuitement des données que vous facturez.
-- La clé `service_role` utilisée par le backend ignore la RLS : le serveur
-- garde donc un accès complet sans qu'aucune policy ne soit nécessaire.
--
-- Conséquence à connaître : si SUPABASE_KEY est la clé *anon* et non la clé
-- *service_role*, les écritures échoueront. Le code backend le signale
-- désormais explicitement au démarrage au lieu de rester muet.

DROP POLICY IF EXISTS "api_cache_no_public_access" ON public.api_cache;

-- ─── B2. Purge des entrées expirées ─────────────────────────────────────────
-- Sans ménage, la table grossit indéfiniment : chaque requête distincte laisse
-- une ligne, même longtemps périmée.
CREATE OR REPLACE FUNCTION public.purge_expired_api_cache()
RETURNS integer AS $$
DECLARE
  deleted integer;
BEGIN
  DELETE FROM public.api_cache WHERE expires_at < now();
  GET DIAGNOSTICS deleted = ROW_COUNT;
  RETURN deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- À lancer de temps en temps, ou via pg_cron si vous l'activez :
--   SELECT public.purge_expired_api_cache();


-- ═══════════════════════════════════════════════════════════════════════════
-- VÉRIFICATION — à lancer après le script
-- ═══════════════════════════════════════════════════════════════════════════
-- 1. La table existe et est protégée :
--   SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'api_cache';
--   -- attendu : api_cache | true
--
-- 2. Aucune policy publique dessus :
--   SELECT policyname FROM pg_policies WHERE tablename = 'api_cache';
--   -- attendu : aucune ligne
--
-- 3. Le trigger ne promeut plus personne :
--   SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user';
--   -- attendu : plus aucune mention de 'admin' ni d'une adresse e-mail
--
-- 4. Vous êtes bien admin (après avoir lancé A3) :
--   SELECT role, plan FROM public.profiles WHERE id = 'VOTRE-UUID';
--   -- attendu : admin | elite
