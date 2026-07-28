-- ═══════════════════════════════════════════════════════════════════════════
-- MARKETPLACE — publication de vidéos par les créateurs (correctif 28/07/2026)
-- ═══════════════════════════════════════════════════════════════════════════
-- Symptôme : « new row violates row-level security policy » au clic sur
-- « Publier la vidéo ». Un créateur ne pouvait donc PAS alimenter le
-- Marketplace — ce qui explique qu'il soit resté vide (0 vidéo mesurée).
--
-- La publication fait DEUX écritures, et l'une ou l'autre pouvait être refusée :
--   1. le fichier dans le bucket `marketplace-videos` (table storage.objects) ;
--   2. la ligne dans la table `marketplace_videos`.
-- Ce script couvre les deux. Idempotent : sans effet si les policies existent.

-- ─── 1. Table marketplace_videos ─────────────────────────────────────────────
ALTER TABLE public.marketplace_videos ENABLE ROW LEVEL SECURITY;

-- Lecture : tout le monde voit les vidéos actives — c'est une vitrine, les
-- marques doivent pouvoir parcourir le catalogue.
DROP POLICY IF EXISTS "mp_videos_read_active" ON public.marketplace_videos;
CREATE POLICY "mp_videos_read_active" ON public.marketplace_videos
  FOR SELECT USING (status = 'active' OR auth.uid() = user_id);

-- Publication : uniquement en son propre nom. `WITH CHECK` est ce qui manquait
-- (ou la policy entière) — sans lui, l'INSERT est refusé par la RLS.
DROP POLICY IF EXISTS "mp_videos_insert_own" ON public.marketplace_videos;
CREATE POLICY "mp_videos_insert_own" ON public.marketplace_videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Un créateur modifie et retire SES vidéos, jamais celles des autres.
DROP POLICY IF EXISTS "mp_videos_update_own" ON public.marketplace_videos;
CREATE POLICY "mp_videos_update_own" ON public.marketplace_videos
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "mp_videos_delete_own" ON public.marketplace_videos;
CREATE POLICY "mp_videos_delete_own" ON public.marketplace_videos
  FOR DELETE USING (auth.uid() = user_id);

-- ⚠️ `likes_count` et `comments_count` sont maintenus par des triggers en
-- SECURITY DEFINER : ils s'exécutent avec les droits du propriétaire de la
-- fonction et ne sont donc pas bloqués par la policy UPDATE ci-dessus, qui
-- exigerait `auth.uid() = user_id` (or celui qui like n'est pas l'auteur).

-- ─── 2. Bucket de stockage `marketplace-videos` ─────────────────────────────
-- Public en lecture : les vidéos sont lues via getPublicUrl() dans le feed.
-- Le contenu n'est pas confidentiel — c'est un catalogue de vente.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'marketplace-videos', 'marketplace-videos', true,
  52428800, -- 50 Mo, cohérent avec le libellé du formulaire
  ARRAY['video/mp4','video/quicktime','video/webm']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Le code écrit sous `${userId}/…` (VideoMarketplaceTab.handlePublishVideo) :
-- chacun n'écrit donc que dans son propre dossier.
DROP POLICY IF EXISTS "mp_videos_storage_insert_own" ON storage.objects;
CREATE POLICY "mp_videos_storage_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'marketplace-videos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "mp_videos_storage_read_all" ON storage.objects;
CREATE POLICY "mp_videos_storage_read_all" ON storage.objects
  FOR SELECT USING (bucket_id = 'marketplace-videos');

DROP POLICY IF EXISTS "mp_videos_storage_delete_own" ON storage.objects;
CREATE POLICY "mp_videos_storage_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'marketplace-videos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
