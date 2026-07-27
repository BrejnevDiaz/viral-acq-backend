-- ═══════════════════════════════════════════════════════════════════════════
-- MARKETPLACE VIDÉO — Favoris, panier, messagerie et commandes (Chantier #18)
-- ═══════════════════════════════════════════════════════════════════════════
-- À exécuter dans le SQL Editor de Supabase. Idempotent.
--
-- Contexte : `marketplace_videos` (vidéos publiées par les créateurs) existe
-- déjà. Ce script ajoute la couche commerciale : une marque peut mettre une
-- vidéo en favori, la placer au panier, envoyer une commande, et discuter avec
-- le créateur.
--
-- ⚠️ SÉCURITÉ — MODÈLE D'ÉCRITURE, à comprendre avant toute modification.
-- La clé anon Supabase est publique (elle est dans le bundle front) : tout
-- utilisateur connecté peut appeler l'API REST directement. Une règle métier
-- écrite uniquement dans server.js n'est donc PAS une protection, juste une
-- convention que le client peut ignorer.
-- D'où deux régimes distincts :
--
--   • favoris / panier  → écriture directe autorisée. Aucune règle métier :
--     « la ligne m'appartient » suffit, et `auth.uid() = user_id` l'exprime
--     parfaitement en RLS.
--
--   • fils, messages, commandes → écriture INTERDITE au client. Aucune policy
--     INSERT ni UPDATE n'existe pour eux : la RLS bloque donc tout écrit venu
--     du front, y compris forgé. Seul le backend écrit, avec la clé service,
--     après avoir vérifié les invariants (prix relus en base, créateur déduit
--     de la vidéo, transitions de statut autorisées).
--     Les policies SELECT restent nécessaires pour que le front puisse lire.
--
-- Ne JAMAIS ajouter de policy INSERT/UPDATE sur ces trois tables sans rendre
-- les invariants exprimables en SQL : sinon un client pourrait se commander une
-- vidéo à 0,01 €, s'attribuer la commande d'un autre, ou se greffer sur un fil
-- existant pour en lire tout l'historique.

-- ─── 1. Favoris ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS marketplace_favorites (
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id   uuid NOT NULL REFERENCES marketplace_videos(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, video_id)
);

ALTER TABLE marketplace_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mp_fav_all_own" ON marketplace_favorites;
CREATE POLICY "mp_fav_all_own" ON marketplace_favorites
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ─── 1 bis. Likes ────────────────────────────────────────────────────────────
-- Le « like » et le « favori » sont deux gestes DIFFÉRENTS, comme sur TikTok :
--   • like   → signal public d'appréciation, avec un compteur visible de tous ;
--   • favori → marque-page privé, pour retrouver une vidéo plus tard.
-- Les mélanger revenait à afficher un compteur public sur une action privée.
CREATE TABLE IF NOT EXISTS marketplace_likes (
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id   uuid NOT NULL REFERENCES marketplace_videos(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, video_id)
);

ALTER TABLE marketplace_likes ENABLE ROW LEVEL SECURITY;

-- Chacun gère ses propres likes…
DROP POLICY IF EXISTS "mp_likes_write_own" ON marketplace_likes;
CREATE POLICY "mp_likes_write_own" ON marketplace_likes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- …mais tout le monde peut les LIRE : sans cela, le compteur affiché serait
-- toujours celui de l'utilisateur courant (0 ou 1) au lieu du total réel.
DROP POLICY IF EXISTS "mp_likes_read_all" ON marketplace_likes;
CREATE POLICY "mp_likes_read_all" ON marketplace_likes
  FOR SELECT USING (auth.role() = 'authenticated');

-- Compteur dénormalisé sur la vidéo : compter les lignes à chaque affichage du
-- feed coûterait une requête d'agrégation par vidéo. Le trigger le maintient.
ALTER TABLE marketplace_videos
  ADD COLUMN IF NOT EXISTS likes_count integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION mp_sync_likes_count() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE marketplace_videos SET likes_count = likes_count + 1 WHERE id = NEW.video_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- GREATEST protège d'un compteur négatif si une ligne est supprimée deux fois.
    UPDATE marketplace_videos SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.video_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS mp_likes_count_trigger ON marketplace_likes;
CREATE TRIGGER mp_likes_count_trigger
  AFTER INSERT OR DELETE ON marketplace_likes
  FOR EACH ROW EXECUTE FUNCTION mp_sync_likes_count();

-- ─── 1 ter. Commentaires ─────────────────────────────────────────────────────
-- Fil public sous chaque vidéo, comme sur TikTok.
-- ⚠️ `author_label` est DÉNORMALISÉ à l'écriture (calculé côté serveur à partir
-- de l'email, partie avant @). Sans lui, afficher l'auteur imposerait de lire
-- `profiles`, dont la policy `users_read_own` interdit — à raison — de voir le
-- profil d'autrui. Ouvrir cette table exposerait l'email de tous les
-- commentateurs ; on stocke donc un libellé public, jamais l'adresse.
CREATE TABLE IF NOT EXISTS marketplace_comments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id     uuid NOT NULL REFERENCES marketplace_videos(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_label text NOT NULL DEFAULT 'membre',
  body         text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1000),
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mp_comments_video_idx ON marketplace_comments (video_id, created_at DESC);

ALTER TABLE marketplace_comments ENABLE ROW LEVEL SECURITY;

-- Lecture publique (entre membres connectés) : c'est le principe d'un fil de
-- commentaires.
DROP POLICY IF EXISTS "mp_comments_read_all" ON marketplace_comments;
CREATE POLICY "mp_comments_read_all" ON marketplace_comments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Écriture réservée au backend : c'est lui qui calcule `author_label` depuis le
-- JWT. En écriture directe, n'importe qui pourrait se donner le libellé d'un
-- autre et usurper son identité dans le fil.
DROP POLICY IF EXISTS "mp_comments_insert_own" ON marketplace_comments;

-- Suppression : son propre commentaire, ou n'importe lequel sur SA vidéo
-- (modération légitime du créateur sur son contenu).
DROP POLICY IF EXISTS "mp_comments_delete_own_or_owner" ON marketplace_comments;
CREATE POLICY "mp_comments_delete_own_or_owner" ON marketplace_comments
  FOR DELETE USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM marketplace_videos v WHERE v.id = video_id AND v.user_id = auth.uid())
  );

-- Compteur dénormalisé, même principe que les likes.
ALTER TABLE marketplace_videos
  ADD COLUMN IF NOT EXISTS comments_count integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION mp_sync_comments_count() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE marketplace_videos SET comments_count = comments_count + 1 WHERE id = NEW.video_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE marketplace_videos SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.video_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS mp_comments_count_trigger ON marketplace_comments;
CREATE TRIGGER mp_comments_count_trigger
  AFTER INSERT OR DELETE ON marketplace_comments
  FOR EACH ROW EXECUTE FUNCTION mp_sync_comments_count();

-- ─── 2. Panier ───────────────────────────────────────────────────────────────
-- Une ligne par vidéo : un contenu UGC est une pièce unique, pas de quantité.
CREATE TABLE IF NOT EXISTS marketplace_cart (
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id   uuid NOT NULL REFERENCES marketplace_videos(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, video_id)
);

ALTER TABLE marketplace_cart ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mp_cart_all_own" ON marketplace_cart;
CREATE POLICY "mp_cart_all_own" ON marketplace_cart
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ─── 3. Fils de discussion marque ↔ créateur ────────────────────────────────
-- Un fil par couple (marque, vidéo) : les échanges portent toujours sur un
-- contenu précis, ce qui évite les conversations fourre-tout.
CREATE TABLE IF NOT EXISTS marketplace_threads (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id        uuid NOT NULL REFERENCES marketplace_videos(id) ON DELETE CASCADE,
  brand_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  -- Dernière notification email envoyée à CHAQUE partie : sert à ne pas
  -- spammer si dix messages partent d'affilée. Deux colonnes distinctes, sinon
  -- la réponse du créateur dans l'heure empêcherait la marque d'être prévenue.
  last_notified_at       timestamptz, -- vers le créateur
  last_notified_brand_at timestamptz, -- vers la marque
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (video_id, brand_id)
);

CREATE INDEX IF NOT EXISTS mp_threads_brand_idx   ON marketplace_threads (brand_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS mp_threads_creator_idx ON marketplace_threads (creator_id, last_message_at DESC);

ALTER TABLE marketplace_threads ENABLE ROW LEVEL SECURITY;

-- LECTURE SEULE pour le client : seules les deux parties voient le fil.
DROP POLICY IF EXISTS "mp_threads_select_party" ON marketplace_threads;
CREATE POLICY "mp_threads_select_party" ON marketplace_threads
  FOR SELECT USING (auth.uid() = brand_id OR auth.uid() = creator_id);

-- Écriture réservée au backend (clé service). Les anciennes policies sont
-- supprimées explicitement : avec un simple USING sans WITH CHECK, un créateur
-- pouvait réécrire le brand_id d'un fil et donner à un tiers l'accès à tout
-- l'historique de la conversation.
DROP POLICY IF EXISTS "mp_threads_insert_brand" ON marketplace_threads;
DROP POLICY IF EXISTS "mp_threads_update_party" ON marketplace_threads;

-- ─── 4. Messages ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS marketplace_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id  uuid NOT NULL REFERENCES marketplace_threads(id) ON DELETE CASCADE,
  sender_id  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body       text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mp_messages_thread_idx ON marketplace_messages (thread_id, created_at);

ALTER TABLE marketplace_messages ENABLE ROW LEVEL SECURITY;

-- Lecture réservée aux deux parties du fil.
DROP POLICY IF EXISTS "mp_messages_select_party" ON marketplace_messages;
CREATE POLICY "mp_messages_select_party" ON marketplace_messages
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM marketplace_threads t
    WHERE t.id = thread_id AND (auth.uid() = t.brand_id OR auth.uid() = t.creator_id)
  ));

-- Écriture réservée au backend : c'est lui qui vérifie l'appartenance au fil et
-- déclenche la notification. Un INSERT direct permettrait d'écrire sans que le
-- destinataire soit prévenu, et de contourner les limites de longueur.
DROP POLICY IF EXISTS "mp_messages_insert_party" ON marketplace_messages;

-- ─── 5. Commandes ────────────────────────────────────────────────────────────
-- Pas de paiement à ce stade : la commande est une demande ferme adressée au
-- créateur, qui l'accepte ou la refuse. Le règlement se convient entre les
-- parties (voir CLAUDE_HANDOVER.md — une caisse Stripe reste à faire).
CREATE TABLE IF NOT EXISTS marketplace_orders (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id  uuid REFERENCES marketplace_threads(id) ON DELETE SET NULL,
  -- Copie figée des lignes au moment de la commande : si le créateur change
  -- son prix ou retire la vidéo, la commande garde ses conditions d'origine.
  items      jsonb NOT NULL DEFAULT '[]'::jsonb,
  total      numeric(10,2) NOT NULL DEFAULT 0,
  status     text NOT NULL DEFAULT 'pending'
             CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mp_orders_brand_idx   ON marketplace_orders (brand_id, created_at DESC);
CREATE INDEX IF NOT EXISTS mp_orders_creator_idx ON marketplace_orders (creator_id, created_at DESC);

ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mp_orders_select_party" ON marketplace_orders;
CREATE POLICY "mp_orders_select_party" ON marketplace_orders
  FOR SELECT USING (auth.uid() = brand_id OR auth.uid() = creator_id);

-- Écriture réservée au backend. Sans cette restriction, `total`, `items` et
-- `creator_id` étaient entièrement pilotés par le client : une marque pouvait
-- commander une vidéo à 500 € en inscrivant 0,01 €, ou s'auto-accepter une
-- commande. Le recalcul serveur ne protège que ceux qui passent par lui.
DROP POLICY IF EXISTS "mp_orders_insert_brand" ON marketplace_orders;
DROP POLICY IF EXISTS "mp_orders_update_party" ON marketplace_orders;
