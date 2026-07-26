-- ═══════════════════════════════════════════════════════════════════════════
-- GIDEON — Historique des conversations du Coach IA
-- ═══════════════════════════════════════════════════════════════════════════
-- À exécuter dans le SQL Editor de Supabase.
-- Chaque message (utilisateur ou assistant) est une ligne. La RLS garantit
-- qu'un utilisateur ne lit/écrit/supprime QUE ses propres messages — le
-- backend utilise un client scoped au token JWT de l'appelant, jamais la
-- service key, donc ces policies sont la vraie barrière de sécurité.

CREATE TABLE IF NOT EXISTS gideon_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text NOT NULL CHECK (role IN ('user', 'assistant')),
  content     text NOT NULL,
  sources     jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index pour le chargement de l'historique (par utilisateur, chronologique)
CREATE INDEX IF NOT EXISTS gideon_messages_user_created_idx
  ON gideon_messages (user_id, created_at DESC);

ALTER TABLE gideon_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gideon_messages_select_own" ON gideon_messages;
CREATE POLICY "gideon_messages_select_own" ON gideon_messages
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "gideon_messages_insert_own" ON gideon_messages;
CREATE POLICY "gideon_messages_insert_own" ON gideon_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "gideon_messages_delete_own" ON gideon_messages;
CREATE POLICY "gideon_messages_delete_own" ON gideon_messages
  FOR DELETE USING (auth.uid() = user_id);
