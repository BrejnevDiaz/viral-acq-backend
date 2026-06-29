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

export const campaignState = {
  isRunning: false,
  logs: [],
  phase: "",
  stats: { total: 0, byPlatform: {}, byNiche: {} },
  results: []
};

const addLog = (msg, type = "info") => {
  const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  campaignState.logs.push({ msg, type, time });
  if (campaignState.logs.length > 100) campaignState.logs.shift(); // keep max 100
};

export const startCampaign = async (params) => {
  if (campaignState.isRunning) {
    addLog("Une campagne est déjà en cours", "warning");
    return;
  }
  
  const { selTarget = "brands", selPlatforms = [], selNiches = [], selRegions = [], customKw = "", emailInput } = params;
  
  campaignState.isRunning = true;
  campaignState.logs = [];
  campaignState.results = [];
  campaignState.stats = { total: 0, byPlatform: {}, byNiche: {} };
  
  const queries = buildQueries(selTarget, selPlatforms, selNiches, selRegions, customKw);
  addLog(`🚀 Campagne démarrée — ${queries.length} requêtes planifiées`, "success");
  
  const seen = new Set();
  
  for (let i = 0; i < queries.length; i++) {
    const q = queries[i];
    campaignState.phase = `${i + 1}/${queries.length}`;
    addLog(`[${q.platform}] "${q.query.slice(0, 55)}..."`, "info");
    
    try {
      // 1. Google Search
      const gRes = await fetch("http://localhost:3001/api/google-search", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q.query, num: 8, platform: q.platform }),
      });
      if (!gRes.ok) { 
        const e = await gRes.json(); 
        addLog(`⚠️ ${e.error?.slice(0, 60)}`, "error"); 
        continue; 
      }
      const { items } = await gRes.json();
      if (!items?.length) { addLog("📭 Aucun résultat", "warning"); continue; }
      addLog(`📋 ${items.length} résultats → analyse...`, "info");

      // 2. Traitement des résultats
      for (const item of items.slice(0, 4)) {
        let brand = parseGoogleResult(item, q.niche, q.platform, q.region, q.emailLang, q.targetType);
        const key = brand.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (key.length < 3 || seen.has(key)) continue;
        if ((brand.url || "").match(/wikipedia|youtube\.com\/watch|google\.|amazon\.com\/s\?|ebay\.(com|it)\/sch/)) continue;
        
        try {
          // Score et enrichissement Apollo (déjà sur le serveur)
          const sRes = await fetch("http://localhost:3001/api/score-brand", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ brand }),
          });
          const scored = await sRes.json();
          brand = { ...brand, ...scored };
          brand.emailTo = brand.contact !== "À rechercher" ? brand.contact : "";
        } catch (e) { console.error(e.message); }
        
        if (brand.score < 65) continue;
        
        seen.add(key);
        campaignState.results.unshift(brand);
        campaignState.stats.total++;
        campaignState.stats.byPlatform[q.platform] = (campaignState.stats.byPlatform[q.platform] || 0) + 1;
        campaignState.stats.byNiche[q.niche] = (campaignState.stats.byNiche[q.niche] || 0) + 1;
        
        addLog(`✅ ${brand.name} (${brand.score}/100) — ${brand.contact !== "À rechercher" ? "📧" : "🔍"}`, "success");
        
        // On sauvegarde directement en base (CRM Backend)
        if (emailInput) {
          await saveLead(brand);
        }
      }
    } catch (err) {
      addLog(`⚠️ ${err.message}`, "error");
    }
    
    // Attendre un peu entre chaque requête
    if (i < queries.length - 1) await new Promise(r => setTimeout(r, 800));
  }
  
  addLog(`🏁 Campagne terminée — ${campaignState.results.length} prospects qualifiés`, "success");
  campaignState.phase = "";
  campaignState.isRunning = false;
};
