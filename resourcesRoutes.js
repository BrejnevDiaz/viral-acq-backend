// ─── Ressources VIP : blog, coaching, statistiques réelles (Chantier #20) ────
// Remplace les contenus écrits en dur dans src/ResourcesTab.jsx.
//
// ⚠️ POURQUOI LES STATISTIQUES SONT CALCULÉES ICI
// La page affichait « +150k boutiques analysées », « 12M créatifs indexés »,
// « 98,8 % de taux de sourcing » et « +320 % de ROAS moyen de nos clients » —
// quatre chiffres écrits en dur, sans aucune mesure derrière, alors que la
// plateforme n'avait pas encore de client payant. Des allégations chiffrées
// invérifiables engagent l'éditeur ; on ne publie donc plus que ce qu'on sait
// compter. Les chiffres sont modestes au début, mais ils sont vrais.
//
// ⚠️ ACCÈS AU CONTENU : le filtrage par palier se fait ICI, pas dans la RLS.
// `coaching_sessions` n'a AUCUNE policy de lecture parce qu'elle contient les
// liens de visio : les exposer via l'API REST reviendrait à offrir le coaching
// à tout le monde. Ce fichier retire ces champs pour les non-abonnés.

import { createClient } from "@supabase/supabase-js";
import { supabase as serviceClient } from "./supabaseClient.js";

const scopedClient = (token) => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey || !token) return null;
  return createClient(url, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
};

// Hiérarchie des paliers, alignée sur src/tierConfig.js.
const TIER_RANK = { free: 0, standard: 1, plus: 2, pro: 3, vip_pro: 3, elite: 4, vip_elite: 4, admin: 99 };
const rankOf = (tier) => TIER_RANK[tier] ?? 0;
const meetsTier = (userPlan, userRole, minTier) =>
  userRole === "admin" || rankOf(userPlan) >= rankOf(minTier);

// Les statistiques changent lentement : un cache mémoire de 10 minutes évite
// de recompter à chaque affichage de la page.
let statsCache = { at: 0, data: null };
const STATS_TTL_MS = 10 * 60 * 1000;

export default function registerResourcesRoutes(app, requireAnyUser, requireAdmin) {
  // ─── GET /api/resources/stats — chiffres réellement mesurés ───────────────
  app.get("/api/resources/stats", async (req, res) => {
    if (statsCache.data && Date.now() - statsCache.at < STATS_TTL_MS) {
      return res.json({ stats: statsCache.data, cached: true });
    }
    if (!serviceClient) return res.json({ stats: null });

    try {
      // `head: true` + `count: exact` : on ne rapatrie aucune ligne, seulement
      // le compte — indispensable pour que ça reste rapide en grandissant.
      const countOf = async (table, filter) => {
        let q = serviceClient.from(table).select("id", { count: "exact", head: true });
        if (filter) q = filter(q);
        const { count, error } = await q;
        if (error) {
          // Une table absente ne doit pas faire tomber toute la page.
          console.warn(`⚠️ [Ressources] comptage ${table} impossible:`, error.message);
          return null;
        }
        return count ?? 0;
      };

      const [creators, videos, brands, knowledge] = await Promise.all([
        countOf("profiles", (q) => q.eq("role", "creator")),
        countOf("marketplace_videos", (q) => q.eq("status", "active")),
        countOf("profiles", (q) => q.in("role", ["user", "brand"])),
        countOf("knowledge_chunks"),
      ]);

      const stats = { creators, videos, brands, knowledgeChunks: knowledge };
      statsCache = { at: Date.now(), data: stats };
      res.json({ stats });
    } catch (err) {
      console.error("❌ [Ressources] statistiques:", err.message);
      res.status(500).json({ error: "Statistiques indisponibles." });
    }
  });

  // ─── GET /api/resources/articles — blog VIP ───────────────────────────────
  // Renvoie toujours titre et extrait ; le corps complet seulement si le plan
  // de l'appelant le permet. C'est l'extrait qui donne envie de s'abonner.
  app.get("/api/resources/articles", ...requireAnyUser, async (req, res) => {
    const db = scopedClient(req.user?.token) || serviceClient;
    if (!db) return res.json({ articles: [] });
    try {
      const { data, error } = await db
        .from("resource_articles")
        .select("id, title, excerpt, body, category, cover_url, min_tier, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(60);
      if (error) throw error;

      const articles = (data || []).map((a) => {
        const allowed = meetsTier(req.user?.plan, req.user?.role, a.min_tier);
        return {
          id: a.id,
          title: a.title,
          excerpt: a.excerpt,
          category: a.category,
          coverUrl: a.cover_url,
          minTier: a.min_tier,
          publishedAt: a.published_at,
          locked: !allowed,
          // Le corps n'est JAMAIS envoyé à qui n'y a pas droit : le masquer
          // seulement à l'affichage laisserait le texte lisible dans la
          // réponse réseau.
          body: allowed ? a.body : null,
        };
      });
      res.json({ articles });
    } catch (err) {
      console.error("❌ [Ressources] articles:", err.message);
      res.status(500).json({ error: "Impossible de charger les articles." });
    }
  });

  // ─── GET /api/resources/coaching — sessions ───────────────────────────────
  app.get("/api/resources/coaching", ...requireAnyUser, async (req, res) => {
    // Lecture avec la clé service : la table n'a volontairement aucune policy
    // de lecture, puisqu'elle contient les liens de visio.
    if (!serviceClient) return res.json({ sessions: [] });
    try {
      const { data, error } = await serviceClient
        .from("coaching_sessions")
        .select("id, title, description, kind, starts_at, duration_min, meeting_url, replay_url, min_tier")
        .eq("published", true)
        .order("starts_at", { ascending: false, nullsFirst: false })
        .limit(50);
      if (error) throw error;

      const { data: signups } = await serviceClient
        .from("coaching_signups").select("session_id").eq("user_id", req.user.id);
      const registered = new Set((signups || []).map((s) => s.session_id));

      const sessions = (data || []).map((s) => {
        const allowed = meetsTier(req.user?.plan, req.user?.role, s.min_tier);
        return {
          id: s.id,
          title: s.title,
          description: s.description,
          kind: s.kind,
          startsAt: s.starts_at,
          durationMin: s.duration_min,
          minTier: s.min_tier,
          locked: !allowed,
          registered: registered.has(s.id),
          // Liens retirés pour les non-abonnés — c'est le cœur de la
          // protection : sans cela, l'accès au coaching serait gratuit.
          meetingUrl: allowed ? s.meeting_url : null,
          replayUrl: allowed ? s.replay_url : null,
        };
      });
      res.json({ sessions });
    } catch (err) {
      console.error("❌ [Ressources] coaching:", err.message);
      res.status(500).json({ error: "Impossible de charger les sessions." });
    }
  });

  // ─── POST /api/resources/coaching/:id/signup — s'inscrire / se désinscrire ─
  app.post("/api/resources/coaching/:id/signup", ...requireAnyUser, async (req, res) => {
    const db = scopedClient(req.user?.token);
    if (!db) return res.status(503).json({ error: "Inscription indisponible." });
    try {
      const wantsIn = req.body?.attending !== false;
      const query = wantsIn
        ? db.from("coaching_signups").upsert({ session_id: req.params.id, user_id: req.user.id })
        : db.from("coaching_signups").delete().eq("session_id", req.params.id).eq("user_id", req.user.id);
      const { error } = await query;
      if (error) throw error;
      res.json({ ok: true, attending: wantsIn });
    } catch (err) {
      console.error("❌ [Ressources] inscription:", err.message);
      res.status(500).json({ error: "Inscription impossible. Réessaie." });
    }
  });

  // ─── Administration : publier articles et sessions ────────────────────────
  // `requireAdmin` garantit que seul le propriétaire publie. Écriture avec la
  // clé service, ces tables n'ayant aucune policy d'écriture.
  app.post("/api/resources/articles", ...requireAdmin, async (req, res) => {
    if (!serviceClient) return res.status(503).json({ error: "Publication indisponible." });
    const { title, excerpt = "", body = "", category = "strategie", coverUrl = null,
            minTier = "vip_pro", published = false, id = null } = req.body || {};
    if (!String(title || "").trim()) return res.status(400).json({ error: "Titre requis." });

    try {
      const payload = {
        title: String(title).trim().slice(0, 200),
        excerpt: String(excerpt).slice(0, 2000),
        body: String(body),
        category, cover_url: coverUrl, min_tier: minTier, published,
        published_at: published ? new Date().toISOString() : null,
      };
      const query = id
        ? serviceClient.from("resource_articles").update(payload).eq("id", id).select("id").single()
        : serviceClient.from("resource_articles").insert(payload).select("id").single();
      const { data, error } = await query;
      if (error) throw error;
      res.json({ article: data });
    } catch (err) {
      console.error("❌ [Ressources] publication article:", err.message);
      res.status(500).json({ error: "L'article n'a pas pu être enregistré." });
    }
  });

  app.post("/api/resources/coaching", ...requireAdmin, async (req, res) => {
    if (!serviceClient) return res.status(503).json({ error: "Publication indisponible." });
    const { title, description = "", kind = "live", startsAt = null, durationMin = null,
            meetingUrl = null, replayUrl = null, minTier = "vip_pro", published = false, id = null } = req.body || {};
    if (!String(title || "").trim()) return res.status(400).json({ error: "Titre requis." });

    try {
      const payload = {
        title: String(title).trim().slice(0, 200),
        description: String(description).slice(0, 4000),
        kind, starts_at: startsAt, duration_min: durationMin,
        meeting_url: meetingUrl, replay_url: replayUrl, min_tier: minTier, published,
      };
      const query = id
        ? serviceClient.from("coaching_sessions").update(payload).eq("id", id).select("id").single()
        : serviceClient.from("coaching_sessions").insert(payload).select("id").single();
      const { data, error } = await query;
      if (error) throw error;
      res.json({ session: data });
    } catch (err) {
      console.error("❌ [Ressources] publication session:", err.message);
      res.status(500).json({ error: "La session n'a pas pu être enregistrée." });
    }
  });

  app.delete("/api/resources/articles/:id", ...requireAdmin, async (req, res) => {
    if (!serviceClient) return res.status(503).json({ error: "Suppression indisponible." });
    const { error } = await serviceClient.from("resource_articles").delete().eq("id", req.params.id);
    if (error) {
      console.error("❌ [Ressources] suppression article:", error.message);
      return res.status(500).json({ error: "Suppression impossible." });
    }
    res.json({ ok: true });
  });

  app.delete("/api/resources/coaching/:id", ...requireAdmin, async (req, res) => {
    if (!serviceClient) return res.status(503).json({ error: "Suppression indisponible." });
    const { error } = await serviceClient.from("coaching_sessions").delete().eq("id", req.params.id);
    if (error) {
      console.error("❌ [Ressources] suppression session:", error.message);
      return res.status(500).json({ error: "Suppression impossible." });
    }
    res.json({ ok: true });
  });
}
