-- ═══════════════════════════════════════════════════════════════════════════
-- RESSOURCES VIP — blog et sessions de coaching (Chantier #20)
-- ═══════════════════════════════════════════════════════════════════════════
-- À exécuter dans le SQL Editor de Supabase. Idempotent.
--
-- Remplace les tableaux écrits en dur dans src/ResourcesTab.jsx (4 sessions de
-- coaching et des articles fictifs) par du contenu réel, publiable depuis
-- l'application sans redéploiement.
--
-- MODÈLE D'ÉCRITURE : identique au Marketplace — aucune policy INSERT/UPDATE
-- pour le client. La publication passe par le backend, qui vérifie le rôle
-- admin. La clé anon étant publique, une policy d'écriture permettrait à
-- n'importe quel abonné de publier sur le blog de la plateforme.

-- ─── 1. Articles du blog VIP ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resource_articles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL CHECK (char_length(title) BETWEEN 3 AND 200),
  excerpt      text NOT NULL DEFAULT '',
  body         text NOT NULL DEFAULT '',
  category     text NOT NULL DEFAULT 'strategie',
  cover_url    text,
  -- Palier minimum requis pour lire l'article en entier. L'extrait reste
  -- visible de tous : c'est lui qui donne envie de s'abonner.
  min_tier     text NOT NULL DEFAULT 'vip_pro'
               CHECK (min_tier IN ('free', 'standard', 'plus', 'vip_pro', 'vip_elite')),
  published    boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS resource_articles_published_idx
  ON resource_articles (published, published_at DESC);

ALTER TABLE resource_articles ENABLE ROW LEVEL SECURITY;

-- Lecture : tous les membres connectés voient les articles PUBLIÉS. Le
-- contrôle du palier se fait côté serveur, qui renvoie l'extrait ou le corps
-- complet selon le plan — la RLS ne sait pas exprimer « selon le plan de
-- l'appelant » sans une jointure coûteuse sur profiles.
DROP POLICY IF EXISTS "resource_articles_read_published" ON resource_articles;
CREATE POLICY "resource_articles_read_published" ON resource_articles
  FOR SELECT USING (published = true AND auth.role() = 'authenticated');

-- Aucune policy d'écriture : publication réservée au backend (rôle admin).
DROP POLICY IF EXISTS "resource_articles_write_admin" ON resource_articles;

-- ─── 2. Sessions de coaching ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coaching_sessions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL CHECK (char_length(title) BETWEEN 3 AND 200),
  description   text NOT NULL DEFAULT '',
  -- 'live' : session programmée avec lien de visio.
  -- 'replay' : enregistrement disponible à la demande.
  kind          text NOT NULL DEFAULT 'live' CHECK (kind IN ('live', 'replay')),
  starts_at     timestamptz,           -- null pour un replay
  duration_min  integer,
  -- ⚠️ Le lien de visio n'est JAMAIS renvoyé aux non-abonnés : le backend le
  -- retire de la réponse. Le stocker ici est sans risque puisqu'aucune policy
  -- ne permet au client de lire cette table directement (voir plus bas).
  meeting_url   text,
  replay_url    text,
  min_tier      text NOT NULL DEFAULT 'vip_pro'
                CHECK (min_tier IN ('free', 'standard', 'plus', 'vip_pro', 'vip_elite')),
  published     boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS coaching_sessions_schedule_idx
  ON coaching_sessions (published, starts_at DESC);

ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;

-- ⚠️ AUCUNE policy de lecture : la table contient les liens de visio, qui ne
-- doivent jamais transiter vers un non-abonné. Tout passe par le backend, qui
-- filtre les champs selon le plan de l'appelant. Une policy SELECT ouverte
-- exposerait `meeting_url` à quiconque interroge l'API REST avec la clé anon.

-- ─── 3. Inscriptions aux sessions ────────────────────────────────────────────
-- Sert au rappel avant la session et à mesurer l'intérêt réel.
CREATE TABLE IF NOT EXISTS coaching_signups (
  session_id uuid NOT NULL REFERENCES coaching_sessions(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (session_id, user_id)
);

ALTER TABLE coaching_signups ENABLE ROW LEVEL SECURITY;

-- Ici l'écriture directe est sans danger : aucune règle métier, « la ligne
-- m'appartient » suffit et s'exprime parfaitement en RLS.
DROP POLICY IF EXISTS "coaching_signups_own" ON coaching_signups;
CREATE POLICY "coaching_signups_own" ON coaching_signups
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
