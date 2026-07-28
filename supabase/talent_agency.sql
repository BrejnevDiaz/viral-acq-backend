-- ═══════════════════════════════════════════════════════════════════════════
-- TALENTS & GIGS — passage d'une maquette à un vrai produit multi-utilisateur
-- ═══════════════════════════════════════════════════════════════════════════
-- Jusqu'ici : les missions étaient écrites en dur dans le bundle (MOCK_GIGS) et
-- le roster vivait dans le localStorage du navigateur (« agency_talents_v2 »).
-- Conséquences concrètes :
--   • une mission publiée disparaissait au rechargement de la page ;
--   • deux personnes de la même agence ne voyaient jamais le même roster ;
--   • vider le cache du navigateur effaçait tout le portefeuille de talents ;
--   • un créateur ne pouvait pas voir les missions d'une marque, et
--     réciproquement — la mise en relation, cœur du métier, n'existait pas.
-- Aucune agence ne paie un abonnement mensuel pour des données qu'un nettoyage
-- de navigateur efface.
--
-- Idempotent : ré-exécutable sans effet de bord.

-- ═══════════════════════════════════════════════════════════════════════════
-- 1. ROSTER DE TALENTS
-- ═══════════════════════════════════════════════════════════════════════════
-- Chaque agence a SON portefeuille. `owner_id` n'est pas décoratif : c'est lui
-- qui garantit qu'une agence ne voit jamais le vivier d'une autre — ce serait
-- lui offrir des mois de sourcing.
CREATE TABLE IF NOT EXISTS public.agency_talents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username    text NOT NULL,
  niche       text NOT NULL DEFAULT 'beauty',
  followers   integer NOT NULL DEFAULT 0,
  engagement  text,
  platform    text NOT NULL DEFAULT 'instagram',
  profile_url text,
  avatar      text,
  email       text,
  region      text,
  status      text NOT NULL DEFAULT 'pending',
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agency_talents DROP CONSTRAINT IF EXISTS agency_talents_status_check;
ALTER TABLE public.agency_talents ADD CONSTRAINT agency_talents_status_check
  CHECK (status IN ('active', 'pending'));

-- Un même créateur ne peut pas figurer deux fois dans le même portefeuille :
-- sans cela, chaque re-import créait des doublons silencieux.
CREATE UNIQUE INDEX IF NOT EXISTS agency_talents_owner_username_idx
  ON public.agency_talents (owner_id, lower(username));

ALTER TABLE public.agency_talents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "talents_owner_all" ON public.agency_talents;
CREATE POLICY "talents_owner_all" ON public.agency_talents
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);


-- ═══════════════════════════════════════════════════════════════════════════
-- 2. MISSIONS (GIGS)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.agency_gigs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand        text NOT NULL,
  title        text NOT NULL,
  niche        text NOT NULL DEFAULT 'beauty',
  budget       text,
  requirements text,
  description  text,
  logo         text,
  status       text NOT NULL DEFAULT 'open',
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agency_gigs DROP CONSTRAINT IF EXISTS agency_gigs_status_check;
ALTER TABLE public.agency_gigs ADD CONSTRAINT agency_gigs_status_check
  CHECK (status IN ('open', 'filled'));

CREATE INDEX IF NOT EXISTS agency_gigs_open_recent_idx
  ON public.agency_gigs (created_at DESC) WHERE status = 'open';

ALTER TABLE public.agency_gigs ENABLE ROW LEVEL SECURITY;

-- ⚠️ Lecture VOLONTAIREMENT ouverte à tout utilisateur connecté.
-- C'est la seule table du lot où c'est le cas, et c'est le cœur du produit :
-- une mission qu'aucun créateur ne peut voir ne sert à rien. Une mission est
-- une annonce, pas une donnée confidentielle. Le budget et la marque sont
-- précisément ce qu'on veut montrer.
DROP POLICY IF EXISTS "gigs_read_open" ON public.agency_gigs;
CREATE POLICY "gigs_read_open" ON public.agency_gigs
  FOR SELECT TO authenticated
  USING (status = 'open' OR auth.uid() = owner_id);

DROP POLICY IF EXISTS "gigs_insert_own" ON public.agency_gigs;
CREATE POLICY "gigs_insert_own" ON public.agency_gigs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

-- ⚠️ `WITH CHECK` explicite : sans lui, Postgres réutilise la clause `USING`
-- comme condition d'écriture. Ici les deux coïncident, mais l'omettre est le
-- piège qui a déjà coûté une itération sur les policies du Marketplace.
DROP POLICY IF EXISTS "gigs_update_own" ON public.agency_gigs;
CREATE POLICY "gigs_update_own" ON public.agency_gigs
  FOR UPDATE USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "gigs_delete_own" ON public.agency_gigs;
CREATE POLICY "gigs_delete_own" ON public.agency_gigs
  FOR DELETE USING (auth.uid() = owner_id);


-- ═══════════════════════════════════════════════════════════════════════════
-- 3. CANDIDATURES
-- ═══════════════════════════════════════════════════════════════════════════
-- C'est la table qui rend la mise en relation réelle : jusqu'ici une
-- candidature n'était qu'une entrée dans le localStorage du candidat. La marque
-- ne la recevait jamais.
CREATE TABLE IF NOT EXISTS public.gig_applications (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id       uuid NOT NULL REFERENCES public.agency_gigs(id) ON DELETE CASCADE,
  applicant_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  handle       text,
  message      text,
  status       text NOT NULL DEFAULT 'pending',
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (gig_id, applicant_id)
);

ALTER TABLE public.gig_applications DROP CONSTRAINT IF EXISTS gig_applications_status_check;
ALTER TABLE public.gig_applications ADD CONSTRAINT gig_applications_status_check
  CHECK (status IN ('pending', 'accepted', 'declined'));

CREATE INDEX IF NOT EXISTS gig_applications_gig_idx ON public.gig_applications (gig_id);

ALTER TABLE public.gig_applications ENABLE ROW LEVEL SECURITY;

-- Le candidat voit les siennes ; la marque voit celles reçues sur SES missions.
-- Personne d'autre : la liste des candidats d'une mission est une information
-- concurrentielle.
DROP POLICY IF EXISTS "applications_read_involved" ON public.gig_applications;
CREATE POLICY "applications_read_involved" ON public.gig_applications
  FOR SELECT TO authenticated
  USING (
    auth.uid() = applicant_id
    OR EXISTS (SELECT 1 FROM public.agency_gigs g WHERE g.id = gig_id AND g.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "applications_insert_own" ON public.gig_applications;
CREATE POLICY "applications_insert_own" ON public.gig_applications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = applicant_id);

-- Seule la marque arbitre : un candidat ne s'accepte pas lui-même.
DROP POLICY IF EXISTS "applications_update_by_gig_owner" ON public.gig_applications;
CREATE POLICY "applications_update_by_gig_owner" ON public.gig_applications
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.agency_gigs g WHERE g.id = gig_id AND g.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.agency_gigs g WHERE g.id = gig_id AND g.owner_id = auth.uid()));

-- Un candidat peut retirer sa candidature.
DROP POLICY IF EXISTS "applications_delete_own" ON public.gig_applications;
CREATE POLICY "applications_delete_own" ON public.gig_applications
  FOR DELETE USING (auth.uid() = applicant_id);


-- ═══════════════════════════════════════════════════════════════════════════
-- 4. CONTRATS
-- ═══════════════════════════════════════════════════════════════════════════
-- Le suivi de livraison : c'est ce que l'agence regarde tous les jours.
CREATE TABLE IF NOT EXISTS public.agency_contracts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gig_id      uuid REFERENCES public.agency_gigs(id) ON DELETE SET NULL,
  talent_id   uuid REFERENCES public.agency_talents(id) ON DELETE SET NULL,
  talent_name text NOT NULL,
  brand_name  text NOT NULL,
  title       text,
  budget      text,
  status      text NOT NULL DEFAULT 'signature',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Les quatre étapes du pipeline, telles qu'affichées dans l'interface.
ALTER TABLE public.agency_contracts DROP CONSTRAINT IF EXISTS agency_contracts_status_check;
ALTER TABLE public.agency_contracts ADD CONSTRAINT agency_contracts_status_check
  CHECK (status IN ('signature', 'produit_envoye', 'contenu_cree', 'live'));

CREATE INDEX IF NOT EXISTS agency_contracts_owner_idx
  ON public.agency_contracts (owner_id, created_at DESC);

ALTER TABLE public.agency_contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contracts_owner_all" ON public.agency_contracts;
CREATE POLICY "contracts_owner_all" ON public.agency_contracts
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);


-- ═══════════════════════════════════════════════════════════════════════════
-- VÉRIFICATION — à lancer après le script
-- ═══════════════════════════════════════════════════════════════════════════
-- SELECT
--   (SELECT count(*) FROM pg_class WHERE relname='agency_talents'   AND relrowsecurity) AS talents_rls,
--   (SELECT count(*) FROM pg_class WHERE relname='agency_gigs'      AND relrowsecurity) AS gigs_rls,
--   (SELECT count(*) FROM pg_class WHERE relname='gig_applications' AND relrowsecurity) AS candidatures_rls,
--   (SELECT count(*) FROM pg_class WHERE relname='agency_contracts' AND relrowsecurity) AS contrats_rls,
--   (SELECT count(*) FROM pg_policies WHERE tablename IN
--      ('agency_talents','agency_gigs','gig_applications','agency_contracts'))          AS nb_policies;
-- attendu : 1 | 1 | 1 | 1 | 10
