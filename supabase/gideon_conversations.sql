-- ═══════════════════════════════════════════════════════════════════════════
-- GIDEON — Multi-conversations (panneau façon ChatGPT)
-- ═══════════════════════════════════════════════════════════════════════════
-- À exécuter dans le SQL Editor de Supabase (après gideon_messages.sql).
-- Chaque conversation a un titre (auto-généré depuis la 1re question) et
-- regroupe ses messages via gideon_messages.conversation_id.
-- NB : les messages de test existants (conversation_id NULL) ne seront plus
-- affichés — c'était des données de test, pas de migration nécessaire.

CREATE TABLE IF NOT EXISTS gideon_conversations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text NOT NULL DEFAULT 'Nouvelle conversation',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS gideon_conversations_user_idx
  ON gideon_conversations (user_id, updated_at DESC);

ALTER TABLE gideon_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gideon_conversations_select_own" ON gideon_conversations;
CREATE POLICY "gideon_conversations_select_own" ON gideon_conversations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "gideon_conversations_insert_own" ON gideon_conversations;
CREATE POLICY "gideon_conversations_insert_own" ON gideon_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "gideon_conversations_update_own" ON gideon_conversations;
CREATE POLICY "gideon_conversations_update_own" ON gideon_conversations
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "gideon_conversations_delete_own" ON gideon_conversations;
CREATE POLICY "gideon_conversations_delete_own" ON gideon_conversations
  FOR DELETE USING (auth.uid() = user_id);

-- Rattachement des messages à leur conversation (cascade à la suppression)
ALTER TABLE gideon_messages
  ADD COLUMN IF NOT EXISTS conversation_id uuid REFERENCES gideon_conversations(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS gideon_messages_conv_idx
  ON gideon_messages (conversation_id, created_at);
