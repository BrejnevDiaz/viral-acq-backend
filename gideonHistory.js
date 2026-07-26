// ─── Gideon — Persistance de l'historique et des conversations ────────────────
// Tables Supabase : gideon_conversations (titres, façon ChatGPT) et
// gideon_messages (rattachés via conversation_id). Voir supabase/*.sql.
// Tous les accès passent par un client scoped au token JWT de l'utilisateur →
// la RLS s'applique, chacun ne touche que ses propres données.
// Cas dégradés gérés silencieusement (le chat fonctionne sans persistance) :
// - pas de token (bypass local ALLOW_DEV_AUTH) → no-op
// - Supabase absent ou migration non exécutée → log serveur, jamais d'erreur
//   remontée au front
import { createClient } from "@supabase/supabase-js";
import { removeGideonAttachments, pathsFromMessageRows } from "./gideonUploads.js";

/**
 * Récupère les chemins des pièces jointes des messages ciblés puis les
 * supprime du bucket. Appelé AVANT tout DELETE en base : sans ça, supprimer
 * une conversation laisserait les fichiers stockés (facturés, et jamais
 * effacés alors que l'utilisateur croit avoir supprimé ses données).
 * Best-effort : un échec de purge ne doit pas empêcher la suppression en base.
 */
async function purgeAttachments(client, user, conversationId = null) {
  try {
    let q = client.from("gideon_messages").select("attachments").eq("user_id", user.id);
    if (conversationId) q = q.eq("conversation_id", conversationId);
    const { data, error } = await q;
    if (error) {
      // Colonne absente (migration gideon_uploads.sql non jouée) → rien à purger
      if (!/attachments/i.test(error.message || "")) {
        console.error("⚠️ Gideon attachments purge lookup error:", error.message);
      }
      return;
    }
    await removeGideonAttachments(pathsFromMessageRows(data));
  } catch (err) {
    console.error("⚠️ Gideon attachments purge error:", err.message);
  }
}

const scopedClient = (token) => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey || !token) return null;
  return createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
};

// ─── Conversations ────────────────────────────────────────────────────────────

/** Liste des conversations de l'utilisateur, la plus récente d'abord. */
export async function listConversations(user, limit = 30) {
  const client = scopedClient(user?.token);
  if (!client) return [];
  const { data, error } = await client
    .from("gideon_conversations")
    .select("id, title, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("⚠️ Gideon conversations list error:", error.message);
    return [];
  }
  return data || [];
}

/** Crée une conversation (titre tronqué à 80 caractères). */
export async function createConversation(user, title = "Nouvelle conversation") {
  const client = scopedClient(user?.token);
  if (!client) return null;
  const { data, error } = await client
    .from("gideon_conversations")
    .insert({ user_id: user.id, title: String(title).slice(0, 80) })
    .select("id, title, updated_at")
    .single();
  if (error) {
    console.error("⚠️ Gideon conversation create error:", error.message);
    return null;
  }
  return data;
}

/** Supprime une conversation (ses messages suivent par CASCADE). */
export async function deleteConversation(user, conversationId) {
  const client = scopedClient(user?.token);
  if (!client || !conversationId) return;
  await purgeAttachments(client, user, conversationId); // fichiers avant lignes
  const { error } = await client
    .from("gideon_conversations")
    .delete()
    .eq("id", conversationId)
    .eq("user_id", user.id);
  if (error) console.error("⚠️ Gideon conversation delete error:", error.message);
}

/**
 * Garantit une conversation cible avant sauvegarde : si aucun id fourni, en
 * crée une avec le début de la question comme titre. Retourne l'id (ou null
 * si persistance impossible — bypass local, migration absente...).
 */
export async function ensureConversation(user, conversationId, question) {
  if (conversationId) return conversationId;
  const conv = await createConversation(user, (question || "Nouvelle conversation").slice(0, 60));
  return conv?.id || null;
}

// ─── Messages ─────────────────────────────────────────────────────────────────

/**
 * Messages d'une conversation, du plus ancien au plus récent.
 * Sans conversationId → la conversation la plus récente de l'utilisateur.
 * @returns {Promise<{conversationId: string|null, messages: Object[]}>}
 */
export async function fetchHistory(user, conversationId = null, limit = 50) {
  const client = scopedClient(user?.token);
  if (!client) return { conversationId: null, messages: [] };

  let convId = conversationId;
  if (!convId) {
    const convs = await listConversations(user, 1);
    convId = convs[0]?.id || null;
    if (!convId) return { conversationId: null, messages: [] };
  }

  const fetchRows = (withAttachments) => client
    .from("gideon_messages")
    .select(withAttachments ? "role, content, sources, attachments, created_at" : "role, content, sources, created_at")
    .eq("user_id", user.id)
    .eq("conversation_id", convId)
    // Tri secondaire sur role : question + réponse partagent le même
    // created_at (même transaction). En DESC, "assistant" sort d'abord pour
    // qu'après reverse() la question précède la réponse.
    .order("created_at", { ascending: false })
    .order("role", { ascending: true })
    .limit(limit);

  let { data, error } = await fetchRows(true);
  // Migration gideon_uploads.sql pas encore exécutée → colonne absente : on
  // recharge sans elle pour ne pas casser l'historique existant.
  if (error && /attachments/i.test(error.message || "")) {
    console.warn("⚠️ Colonne gideon_messages.attachments absente — exécute supabase/gideon_uploads.sql");
    ({ data, error } = await fetchRows(false));
  }
  if (error) {
    console.error("⚠️ Gideon history fetch error:", error.message);
    return { conversationId: convId, messages: [] };
  }
  return { conversationId: convId, messages: (data || []).reverse() };
}

/**
 * Sauvegarde une paire question/réponse dans une conversation, puis remonte
 * la conversation en tête de liste (updated_at). Fire-and-forget côté route.
 */
export async function saveExchange(user, conversationId, question, answer, sources = [], attachments = []) {
  const client = scopedClient(user?.token);
  if (!client || !question || !answer) return;
  // IMPORTANT : les deux lignes doivent avoir les MÊMES colonnes — en insert
  // multiple, supabase-js envoie null pour toute clé manquante (au lieu de
  // laisser le DEFAULT s'appliquer), ce qui violerait le NOT NULL de sources.
  // attachments : métadonnées [{path,name,mime,size}] sur la ligne "user"
  // (chantier #16) — nécessite la migration supabase/gideon_uploads.sql.
  const rows = [
    { user_id: user.id, role: "user", content: question, sources: [], attachments: attachments || [] },
    { user_id: user.id, role: "assistant", content: answer, sources: sources || [], attachments: [] },
  ];
  if (conversationId) rows.forEach((r) => { r.conversation_id = conversationId; });
  let { error } = await client.from("gideon_messages").insert(rows);
  // Migration gideon_uploads.sql pas encore exécutée → on sauvegarde sans les
  // métadonnées de pièces jointes plutôt que de perdre l'échange.
  if (error && /attachments/i.test(error.message || "")) {
    console.warn("⚠️ Colonne gideon_messages.attachments absente — exécute supabase/gideon_uploads.sql");
    rows.forEach((r) => { delete r.attachments; });
    ({ error } = await client.from("gideon_messages").insert(rows));
  }
  if (error) {
    console.error("⚠️ Gideon history save error:", error.message);
    return;
  }
  if (conversationId) {
    await client
      .from("gideon_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId)
      .eq("user_id", user.id);
  }
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

/** Efface TOUT l'historique de l'utilisateur (toutes conversations). */
export async function clearHistory(user) {
  const client = scopedClient(user?.token);
  if (!client) return;
  await purgeAttachments(client, user); // toutes conversations confondues
  const { error: convErr } = await client.from("gideon_conversations").delete().eq("user_id", user.id);
  if (convErr) console.error("⚠️ Gideon history clear error:", convErr.message);
  // Filet de sécurité pour d'éventuels messages orphelins (pré-migration)
  const { error } = await client.from("gideon_messages").delete().eq("user_id", user.id);
  if (error) console.error("⚠️ Gideon history clear error:", error.message);
}
