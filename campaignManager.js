import { saveLead } from "./db.js";
import { buildQueries, PLATFORMS } from "./src/utils/queryBuilder.js";

function parseGoogleResult(item, niche, platform, region, emailLang, targetType) {
  const platLabel = PLATFORMS.find(p => p.id === platform)?.label || platform;
  const name = (item.title || "").split(" | ")[0].split(" - ")[0].split(" – ")[0].trim().slice(0, 50);
  const emailMatch = (item.snippet || "").match(/[\w.-]+@[\w.-]+\.\w{2,}/g);
  const email = emailMatch?.[0] || null;
  
  let score = 0;
  let reason = [];
  if (email) { score += 40; reason.push("Email trouvée"); }
  
  // Specific checks for influencers
  if (targetType === "influencers") {
    if (item.link?.includes("instagram.com") || item.link?.includes("tiktok.com")) { score += 30; reason.push("Profil Social Actif"); }
    if ((item.snippet||"").toLowerCase().includes("collab") || (item.snippet||"").toLowerCase().includes("pr")) { score += 20; reason.push("Ouvert aux collabs"); }
  } else {
    if (item.link?.includes("myshopify") || (item.snippet||"").toLowerCase().includes("shop")) { score += 20; reason.push("E-commerce (Shopify/Store)"); }
    if ((item.snippet||"").toLowerCase().includes("founder") || (item.snippet||"").toLowerCase().includes("ceo")) { score += 10; reason.push("Contact Décideur"); }
  }

  return {
    id: Date.now() + Math.random().toString(36).substr(2, 5),
    name,
    emailTo: email || "",
    url: item.url || item.link,
    description: item.snippet || "",
    niche,
    platform: platLabel,
    region,
    emailLang: emailLang || "it",
    score: Math.min(score, 99),
    reason: (targetType === "influencers" ? "INFLUENCER | " : "") + reason.join(", "),
    emailStatus: "none",
    generatedEmail: null
  };
}

// ─── État de campagne PAR UTILISATEUR (isolation multi-tenant) ───────────────
// Ancien singleton global remplacé par une Map indexée par userId.
const campaignStates = new Map();

export const getCampaignState = (userId) => {
  if (!campaignStates.has(userId)) {
    campaignStates.set(userId, {
      isRunning: false,
      logs: [],
      phase: "",
      stats: { total: 0, byPlatform: {}, byNiche: {} },
      results: []
    });
  }
  return campaignStates.get(userId);
};

const addLog = (state, msg, type = "info") => {
  const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  state.logs.push({ msg, type, time });
  if (state.logs.length > 100) state.logs.shift(); // keep max 100
};

export const startCampaign = async (params, userId, token) => {
  const state = getCampaignState(userId);
  if (state.isRunning) {
    addLog(state, "Une campagne est déjà en cours", "warning");
    return;
  }

  const { selTarget = "brands", selPlatforms = [], selNiches = [], selRegions = [], customKw = "", emailInput } = params;

  state.isRunning = true;
  state.logs = [];
  state.results = [];
  state.stats = { total: 0, byPlatform: {}, byNiche: {} };

  const queries = buildQueries(selTarget, selPlatforms, selNiches, selRegions, customKw);
  addLog(state, `🚀 Campagne démarrée — ${queries.length} requêtes planifiées`, "success");

  const seen = new Set();
  // Appels HTTP internes (server → server) : les routes /api/google-search et
  // /api/score-brand sont désormais protégées — on transmet le token du user.
  const internalHeaders = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };

  for (let i = 0; i < queries.length; i++) {
    const q = queries[i];
    state.phase = `${i + 1}/${queries.length}`;
    addLog(state, `[${q.platform}] "${q.query.slice(0, 55)}..."`, "info");

    try {
      // 1. Google Search
      const gRes = await fetch("http://localhost:3001/api/google-search", {
        method: "POST", headers: internalHeaders,
        body: JSON.stringify({ query: q.query, num: 8, platform: q.platform }),
      });
      if (!gRes.ok) {
        const e = await gRes.json();
        addLog(state, `⚠️ ${e.error?.slice(0, 60)}`, "error");
        continue;
      }
      const { items } = await gRes.json();
      if (!items?.length) { addLog(state, "📭 Aucun résultat", "warning"); continue; }
      addLog(state, `📋 ${items.length} résultats → analyse...`, "info");

      // 2. Traitement des résultats
      for (const item of items.slice(0, 4)) {
        let brand = parseGoogleResult(item, q.niche, q.platform, q.region, q.emailLang, q.targetType);
        const key = brand.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (key.length < 3 || seen.has(key)) continue;
        if ((brand.url || "").match(/wikipedia|youtube\.com\/watch|google\.|amazon\.com\/s\?|ebay\.(com|it)\/sch/)) continue;
        
        try {
          // Score et enrichissement Apollo (déjà sur le serveur)
          const sRes = await fetch("http://localhost:3001/api/score-brand", {
            method: "POST", headers: internalHeaders,
            body: JSON.stringify({ brand }),
          });
          const scored = await sRes.json();
          brand = { ...brand, ...scored };
          brand.emailTo = brand.contact !== "À rechercher" ? brand.contact : "";
        } catch (e) { console.error(e.message); }

        if (brand.score < 65) continue;

        seen.add(key);
        state.results.unshift(brand);
        state.stats.total++;
        state.stats.byPlatform[q.platform] = (state.stats.byPlatform[q.platform] || 0) + 1;
        state.stats.byNiche[q.niche] = (state.stats.byNiche[q.niche] || 0) + 1;

        addLog(state, `✅ ${brand.name} (${brand.score}/100) — ${brand.contact !== "À rechercher" ? "📧" : "🔍"}`, "success");

        // On sauvegarde directement en base (CRM Backend) — taguée ownerId
        if (emailInput) {
          await saveLead(userId, brand);
        }
      }
    } catch (err) {
      addLog(state, `⚠️ ${err.message}`, "error");
    }

    // Attendre un peu entre chaque requête
    if (i < queries.length - 1) await new Promise(r => setTimeout(r, 800));
  }

  addLog(state, `🏁 Campagne terminée — ${state.results.length} prospects qualifiés`, "success");
  state.phase = "";
  state.isRunning = false;
};
