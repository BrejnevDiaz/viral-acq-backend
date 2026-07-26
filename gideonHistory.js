// ─── Gideon — Persistance de l'historique des conversations ──────────────────
// Lit/écrit dans la table Supabase gideon_messages (voir supabase/gideon_messages.sql)
// via un client scoped au token JWT de l'utilisateur → la RLS s'applique, un
// utilisateur ne touche que ses propres messages.
// Cas dégradés gérés silencieusement (le chat fonctionne sans persistance) :
// - pas de token (bypass local ALLOW_DEV_AUTH) → no-op
// - Supabase non configuré → no-op
// - erreur d'insertion/lecture → log serveur, jamais d'erreur remontée au front
import { createClient } from "@supabase/supabase-js";

const scopedClient = (token) => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey || !token) return null;
  return createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
};

/**
 * Derniers messages de l'utilisateur, du plus ancien au plus récent.
 * @returns {Promise<{role: string, content: string, sources: Object[], created_at: string}[]>}
 */
export async function fetchHistory(user, limit = 50) {
  const client = scopedClient(user?.token);
  if (!client) return [];
  const { data, error } = await client
    .from("gideon_messages")
    .select("role, content, sources, created_at")
    .eq("user_id", user.id)
    // Tri secondaire sur role : question + réponse sont insérées dans la même
    // transaction → created_at identique. En DESC, "assistant" < "user" doit
    // sortir la réponse d'abord pour qu'après reverse() la question précède.
    .order("created_at", { ascending: false })
    .order("role", { ascending: true })
    .limit(limit);
  if (error) {
    console.error("⚠️ Gideon history fetch error:", error.message);
    return [];
  }
  return (data || []).reverse(); // chronologique pour l'affichage
}

/**
 * Sauvegarde une paire question/réponse. Fire-and-forget côté route :
 * ne bloque jamais la réponse au client.
 */
export async function saveExchange(user, question, answer, sources = []) {
  const client = scopedClient(user?.token);
  if (!client || !question || !answer) return;
  // IMPORTANT : les deux lignes doivent avoir les MÊMES colonnes — en insert
  // multiple, supabase-js envoie null pour toute clé manquante (au lieu de
  // laisser le DEFAULT s'appliquer), ce qui violerait le NOT NULL de sources.
  const { error } = await client.from("gideon_messages").insert([
    { user_id: user.id, role: "user", content: question, sources: [] },
    { user_id: user.id, role: "assistant", content: answer, sources: sources || [] },
  ]);
  if (error) console.error("⚠️ Gideon history save error:", error.message);
}

/**
 * Nombre de questions posées par l'utilisateur aujourd'hui (UTC) — sert au
 * quota journalier par plan. Retourne null si le comptage est impossible
 * (bypass local sans token, Supabase absent) → l'appelant traite null comme
 * "pas de quota applicable".
 */
export async function countToday(user) {
  const client = scopedClient(user?.token);
  if (!client) return null;
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const { count, error } = await client
    .from("gideon_messages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("role", "user")
    .gte("created_at", startOfDay.toISOString());
  if (error) {
    console.error("⚠️ Gideon quota count error:", error.message);
    return null;
  }
  return count ?? 0;
}

/** Efface tout l'historique de l'utilisateur (bouton "Nouvelle conversation"). */
export async function clearHistory(user) {
  const client = scopedClient(user?.token);
  if (!client) return;
  const { error } = await client.from("gideon_messages").delete().eq("user_id", user.id);
  if (error) console.error("⚠️ Gideon history clear error:", error.message);
}
