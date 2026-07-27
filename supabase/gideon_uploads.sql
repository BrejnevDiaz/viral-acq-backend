-- ═══════════════════════════════════════════════════════════════════════════
-- GIDEON — Pièces jointes multimodales (Chantier #16)
-- ═══════════════════════════════════════════════════════════════════════════
-- À exécuter dans le SQL Editor de Supabase (prod). Idempotent.
--
-- 1. Bucket privé "gideon-uploads" : les fichiers joints aux messages du Coach.
--    Aucun accès public — le backend lit/écrit avec la clé service, et les
--    policies ci-dessous permettent en plus à un utilisateur authentifié de ne
--    toucher QUE son propre dossier (préfixe = son uuid), en défense en
--    profondeur si un jour le front parle directement au Storage.
-- 2. Colonne gideon_messages.attachments : métadonnées [{path,name,mime,size}]
--    des fichiers joints à un message utilisateur (jsonb, jamais le contenu).

-- ─── 1. Bucket privé ─────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gideon-uploads',
  'gideon-uploads',
  false,
  -- 60 Mo : plafond vidéo (Elite, ~90 s de créative). Les images et PDF
  -- restent bornés bien en dessous par les limites de plan côté serveur.
  62914560,
  -- Pas de GIF : accepté par le navigateur mais refusé par l'inline Gemini.
  -- Vidéos ajoutées au chantier #17 (analysées via la Files API Gemini).
  -- Seulement des conteneurs ISO-BMFF : le serveur y lit la durée pour borner
  -- le coût, ce qu'il ne sait pas faire sur WebM ou AVI.
  ARRAY['image/jpeg','image/png','image/webp','application/pdf',
        'video/mp4','video/quicktime','video/3gpp']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ─── Policies : chacun ne touche que son dossier `${auth.uid()}/…` ──────────
DROP POLICY IF EXISTS "gideon_uploads_select_own" ON storage.objects;
CREATE POLICY "gideon_uploads_select_own" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'gideon-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "gideon_uploads_insert_own" ON storage.objects;
CREATE POLICY "gideon_uploads_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gideon-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "gideon_uploads_delete_own" ON storage.objects;
CREATE POLICY "gideon_uploads_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'gideon-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ─── 2. Métadonnées des pièces jointes sur les messages ─────────────────────
ALTER TABLE gideon_messages
  ADD COLUMN IF NOT EXISTS attachments jsonb NOT NULL DEFAULT '[]'::jsonb;
