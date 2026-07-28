-- ═══════════════════════════════════════════════════════════════════════════
-- MARKETPLACE — carrousels photo (28/07/2026)
-- ═══════════════════════════════════════════════════════════════════════════
-- Les créateurs ne pouvaient publier que des vidéos. On autorise désormais
-- aussi des séries de photos façon carrousel Instagram, dans le MÊME feed et
-- avec le MÊME parcours d'achat : une publication reste une publication,
-- seule sa forme change.
--
-- Idempotent : ré-exécutable sans effet de bord.
--
-- ⚠️ La table garde son nom `marketplace_videos`. Le renommer casserait les
-- policies RLS, les triggers de compteurs (likes_count, comments_count) et les
-- clés étrangères des tables commentaires/favoris/panier. Le coût d'un nom
-- devenu imprécis est très inférieur à celui d'une migration de ce périmètre.

-- ⚠️ À LANCER D'ABORD — une contrainte CHECK valide TOUTES les lignes déjà
-- présentes. S'il existe une publication sans `video_url` (import manuel,
-- écriture partielle), l'ajout de la contrainte échouera avec un message peu
-- parlant. Cette requête vous le dit avant :
--   SELECT count(*) AS lignes_sans_url FROM public.marketplace_videos
--   WHERE video_url IS NULL;
--   -- attendu : 0. Sinon, corrigez ou supprimez ces lignes avant de continuer.

-- ─── 1. Colonnes ────────────────────────────────────────────────────────────
-- `media_type` distingue les deux formes. Défaut 'video' : toutes les lignes
-- existantes restent valides sans migration de données.
ALTER TABLE public.marketplace_videos
  ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'video';

-- `media_urls` porte les images d'un carrousel, dans l'ordre d'affichage.
-- Reste NULL pour une vidéo, qui continue d'utiliser `video_url`.
ALTER TABLE public.marketplace_videos
  ADD COLUMN IF NOT EXISTS media_urls jsonb;

ALTER TABLE public.marketplace_videos DROP CONSTRAINT IF EXISTS marketplace_media_type_check;
ALTER TABLE public.marketplace_videos ADD CONSTRAINT marketplace_media_type_check
  CHECK (media_type IN ('video', 'carousel'));

-- ⚠️ Contrainte de cohérence : sans elle, on pouvait enregistrer un carrousel
-- sans aucune image, ou une vidéo sans URL. Le feed affichait alors une carte
-- vide et l'utilisateur ne comprenait pas pourquoi. Mieux vaut refuser
-- l'écriture que produire une publication invisible.
ALTER TABLE public.marketplace_videos DROP CONSTRAINT IF EXISTS marketplace_media_coherence_check;
ALTER TABLE public.marketplace_videos ADD CONSTRAINT marketplace_media_coherence_check
  CHECK (
    (media_type = 'video'    AND video_url IS NOT NULL)
    OR
    (media_type = 'carousel' AND media_urls IS NOT NULL
                             AND jsonb_typeof(media_urls) = 'array'
                             AND jsonb_array_length(media_urls) BETWEEN 1 AND 10)
  );

-- ─── 2. Bucket : accepter aussi les images ──────────────────────────────────
-- Le bucket n'autorisait que des types vidéo : tout envoi d'image était rejeté
-- par le stockage, avant même d'atteindre la table.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'marketplace-videos', 'marketplace-videos', true,
  52428800, -- 50 Mo
  ARRAY[
    'video/mp4','video/quicktime','video/webm',
    'image/jpeg','image/png','image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Les policies de storage (écriture dans son propre dossier, lecture publique)
-- sont posées par marketplace_videos_policies.sql et restent valables : elles
-- portent sur le bucket, pas sur le type de fichier.

-- ─── 3. Index de tri du feed ────────────────────────────────────────────────
-- Le feed lit toujours `status='active'` trié par date. Sans index, ce tri
-- devient un balayage complet dès que le catalogue grossit.
CREATE INDEX IF NOT EXISTS marketplace_videos_active_recent_idx
  ON public.marketplace_videos (created_at DESC)
  WHERE status = 'active';


-- ═══════════════════════════════════════════════════════════════════════════
-- VÉRIFICATION — à lancer après le script
-- ═══════════════════════════════════════════════════════════════════════════
-- SELECT
--   (SELECT count(*) FROM information_schema.columns
--      WHERE table_name='marketplace_videos' AND column_name='media_type')  AS col_media_type,
--   (SELECT count(*) FROM information_schema.columns
--      WHERE table_name='marketplace_videos' AND column_name='media_urls')  AS col_media_urls,
--   (SELECT count(*) FROM pg_constraint
--      WHERE conname='marketplace_media_coherence_check')                   AS contrainte_coherence,
--   (SELECT count(*) FROM storage.buckets
--      WHERE id='marketplace-videos' AND 'image/jpeg' = ANY(allowed_mime_types)) AS images_autorisees,
--   (SELECT count(*) FROM public.marketplace_videos WHERE media_type='video')    AS videos_existantes;
-- attendu : 1 | 1 | 1 | 1 | (nombre de vidéos déjà publiées, inchangé)
