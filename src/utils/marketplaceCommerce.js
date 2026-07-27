// ─── Marketplace Vidéo — favoris, panier, commandes (Chantier #18) ───────────
// Favoris et panier passent EN DIRECT par Supabase : aucune logique métier, et
// la RLS garantit qu'on ne touche que ses propres lignes (voir
// supabase/marketplace_commerce.sql). Les commandes et la messagerie passent
// par le backend, qui doit envoyer des emails et arbitrer les statuts.
import { supabase } from "../supabaseClient";
import { apiFetch } from "./apiClient";

// Les vidéos de démonstration n'ont pas de créateur inscrit : on peut les
// mettre en favori ou au panier localement, mais écrire à leur auteur ou leur
// passer commande n'aurait aucun destinataire. `isDemoVideo` sert à désactiver
// ces actions avec un message honnête plutôt que de laisser l'utilisateur
// parler dans le vide.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isDemoVideo = (video) => !UUID_RE.test(String(video?.id || ""));

/** Prix affiché ("34,90 €") → nombre. Tolère les formats FR et EN. */
export const parsePrice = (price) => {
  if (typeof price === "number") return price;
  const n = parseFloat(String(price).replace(/[^\d,.-]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

export const formatPrice = (value) =>
  `${Number(value || 0).toFixed(2).replace(".", ",")} €`;

// ─── Likes ───────────────────────────────────────────────────────────────────
// Geste PUBLIC, distinct du favori : compteur visible de tous, maintenu en base
// par un trigger sur `marketplace_videos.likes_count`.

export async function fetchLikes(userId) {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase
    .from("marketplace_likes").select("video_id").eq("user_id", userId);
  if (error) {
    console.warn("⚠️ Likes illisibles:", error.message);
    return [];
  }
  return (data || []).map((r) => r.video_id);
}

export async function toggleLike(userId, videoId, currentlyActive) {
  if (!supabase || !userId) return { ok: false, error: "Connectez-vous pour aimer une vidéo." };
  const query = currentlyActive
    ? supabase.from("marketplace_likes").delete().eq("user_id", userId).eq("video_id", videoId)
    : supabase.from("marketplace_likes").insert({ user_id: userId, video_id: videoId });
  const { error } = await query;
  if (error) {
    console.error("❌ Like:", error.message);
    return { ok: false, error: "Impossible d'enregistrer votre like." };
  }
  return { ok: true, active: !currentlyActive };
}

/** Compteur lisible : 1 240 → « 1.2k ». */
export const formatCount = (n = 0) => {
  const v = Number(n) || 0;
  if (v >= 1000000) return `${(v / 1000000).toFixed(1).replace(".0", "")}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1).replace(".0", "")}k`;
  return String(v);
};

// ─── Commentaires ────────────────────────────────────────────────────────────
// Lecture directe (fil public entre membres) ; écriture par le serveur, qui
// seul peut établir un libellé d'auteur fiable à partir du JWT.

export async function fetchComments(videoId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("marketplace_comments")
    .select("id, user_id, author_label, body, created_at")
    .eq("video_id", videoId)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error("Impossible de charger les commentaires.");
  return data || [];
}

export async function postComment(API_URL, videoId, body) {
  const res = await apiFetch(`${API_URL}/api/marketplace/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId, body }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Votre commentaire n'a pas pu être publié.");
  return data.comment;
}

/** Suppression : son propre commentaire, ou tout commentaire sur sa vidéo. */
export async function deleteComment(commentId) {
  if (!supabase) return { ok: false, error: "Suppression indisponible." };
  const { error } = await supabase.from("marketplace_comments").delete().eq("id", commentId);
  if (error) {
    console.error("❌ Suppression commentaire:", error.message);
    return { ok: false, error: "Ce commentaire n'a pas pu être supprimé." };
  }
  return { ok: true };
}

// ─── Favoris ─────────────────────────────────────────────────────────────────
// Geste PRIVÉ : un marque-page pour retrouver une vidéo, sans compteur public.

export async function fetchFavorites(userId) {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase
    .from("marketplace_favorites").select("video_id").eq("user_id", userId);
  if (error) {
    console.warn("⚠️ Favoris illisibles:", error.message);
    return [];
  }
  return (data || []).map((r) => r.video_id);
}

/**
 * Ajoute ou retire un favori.
 * @returns {Promise<{ok: boolean, active?: boolean, error?: string}>}
 */
export async function toggleFavorite(userId, videoId, currentlyActive) {
  if (!supabase || !userId) return { ok: false, error: "Connectez-vous pour utiliser les favoris." };
  const query = currentlyActive
    ? supabase.from("marketplace_favorites").delete().eq("user_id", userId).eq("video_id", videoId)
    : supabase.from("marketplace_favorites").insert({ user_id: userId, video_id: videoId });
  const { error } = await query;
  if (error) {
    console.error("❌ Favori:", error.message);
    return { ok: false, error: "Impossible de mettre à jour vos favoris." };
  }
  return { ok: true, active: !currentlyActive };
}

// ─── Panier ──────────────────────────────────────────────────────────────────

export async function fetchCart(userId) {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase
    .from("marketplace_cart").select("video_id").eq("user_id", userId);
  if (error) {
    console.warn("⚠️ Panier illisible:", error.message);
    return [];
  }
  return (data || []).map((r) => r.video_id);
}

export async function toggleCart(userId, videoId, currentlyIn) {
  if (!supabase || !userId) return { ok: false, error: "Connectez-vous pour utiliser le panier." };
  const query = currentlyIn
    ? supabase.from("marketplace_cart").delete().eq("user_id", userId).eq("video_id", videoId)
    : supabase.from("marketplace_cart").insert({ user_id: userId, video_id: videoId });
  const { error } = await query;
  if (error) {
    console.error("❌ Panier:", error.message);
    return { ok: false, error: "Impossible de mettre à jour votre panier." };
  }
  return { ok: true, active: !currentlyIn };
}

// ─── Commande ────────────────────────────────────────────────────────────────

/**
 * Envoie le panier sous forme de commandes (une par créateur concerné).
 * @returns {Promise<{ok: boolean, message?: string, error?: string}>}
 */
export async function submitOrder(API_URL, videoIds) {
  try {
    const res = await apiFetch(`${API_URL}/api/marketplace/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoIds }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, error: data?.error || "La commande n'a pas pu être envoyée." };
    return { ok: true, message: data?.message, orders: data?.orders || [], orderedIds: data?.orderedIds };
  } catch (err) {
    console.error("❌ Commande:", err);
    return { ok: false, error: "Serveur injoignable. Réessayez dans un instant." };
  }
}

// ─── Messagerie ──────────────────────────────────────────────────────────────

export async function fetchThreadMessages(API_URL, threadId) {
  const res = await apiFetch(`${API_URL}/api/marketplace/threads/${threadId}/messages`);
  if (!res.ok) throw new Error("Conversation illisible");
  return (await res.json())?.messages || [];
}

/** Toutes les conversations de l'utilisateur (marque ET créateur confondus). */
export async function fetchThreads(API_URL) {
  const res = await apiFetch(`${API_URL}/api/marketplace/threads`);
  if (!res.ok) throw new Error("Impossible de charger vos conversations.");
  return (await res.json())?.threads || [];
}

/** Retrouve le fil existant entre l'utilisateur et une vidéo, s'il y en a un. */
export async function findThreadForVideo(API_URL, videoId) {
  try {
    const threads = await fetchThreads(API_URL);
    return threads.find((t) => t.video_id === videoId) || null;
  } catch {
    return null;
  }
}

export async function sendMarketplaceMessage(API_URL, { videoId, threadId, body }) {
  const res = await apiFetch(`${API_URL}/api/marketplace/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId, threadId, body }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Votre message n'a pas pu être envoyé.");
  return data; // { thread: {id}, message }
}
