import { saveLead } from "./db.js";

// --- Données statiques recopiées depuis le frontend ---
const NICHES = [
  { id: "beauty", keywords: ["skincare italiano", "beauty brand Italia", "cosmetici artigianali italiani", "crema viso italiana", "siero viso brand italiano", "make up brand Italia"] },
  { id: "food",   keywords: ["integratori italiani", "food brand italiano", "superfood Italia shop", "snack proteico italiano", "nutrition brand Italia", "organic food italiano"] },
  { id: "fitness",keywords: ["activewear italiano", "sportswear brand Italia", "yoga brand italiano", "fitness brand Italia", "abbigliamento sportivo italiano", "wellness brand Italia"] },
];
const PLATFORMS = [
  { id: "web",       label: "Web / Google",  siteFilter: "" },
  { id: "instagram", label: "Instagram",     siteFilter: "site:instagram.com" },
  { id: "tiktok",    label: "TikTok",        siteFilter: "site:tiktok.com" },
  { id: "facebook",  label: "Facebook",      siteFilter: "site:facebook.com" },
  { id: "pinterest", label: "Pinterest",     siteFilter: "site:pinterest.com" },
  { id: "amazon",    label: "Amazon",        siteFilter: "site:amazon.it" },
  { id: "etsy",      label: "Etsy",          siteFilter: "site:etsy.com" },
  { id: "ebay",      label: "eBay",          siteFilter: "site:ebay.it" },
];
const REGIONS = [
  { id: "it", term: "Italia italiano \"made in Italy\"", emailLang: "it" },
  { id: "eu", term: "Europe European brand",             emailLang: "en" },
  { id: "us", term: "US brand UK brand",                 emailLang: "en" },
];

function buildQueries(selPlatforms, selNiches, selRegions, customKw) {
  const queries = [];
  for (const pid of selPlatforms) {
    const plat = PLATFORMS.find(p => p.id === pid);
    const siteQ = plat?.siteFilter ? `${plat.siteFilter} ` : "";
    for (const nid of selNiches) {
      const niche = NICHES.find(n => n.id === nid);
      const kw = niche.keywords[Math.floor(Math.random() * niche.keywords.length)];
      for (const rid of selRegions) {
        const region = REGIONS.find(r => r.id === rid);
        queries.push({ query: `${siteQ}${kw} ${region.term} ecommerce brand`, niche: nid, platform: pid, region: rid, emailLang: region.emailLang });
        if (pid === "web") {
          queries.push({ query: `${kw} ${region.term} piccolo brand collaborazione influencer`, niche: nid, platform: pid, region: rid, emailLang: region.emailLang });
        }
      }
    }
  }
  if (customKw && customKw.trim()) {
    queries.unshift({ query: customKw.trim(), niche: "custom", platform: "web", region: "it", emailLang: "it" });
  }
  return queries.sort(() => Math.random() - 0.5).slice(0, 12);
}

function parseGoogleResult(item, niche, platform, region, emailLang) {
  const platLabel = PLATFORMS.find(p => p.id === platform)?.label || platform;
  const name = (item.title || "").split(" | ")[0].split(" - ")[0].split(" – ")[0].trim().slice(0, 50);
  const emailMatch = (item.snippet || "").match(/[\w.-]+@[\w.-]+\.\w{2,}/g);
  const email = emailMatch?.[0] || null;
  const igMatch = ((item.snippet||"") + (item.title||"")).match(/@[\w_.]{3,30}/g);
  return {
    name, url: item.link, displayUrl: item.displayLink,
    description: item.snippet || "", niche, platform: platLabel, platformId: platform,
    region, emailLang: emailLang || "it",
    contact: email || "À rechercher", instagram: igMatch?.[0] || null, socials: {},
    score: 75, size: "Emerging", reasoning: "",
    emailStatus: "idle", generatedEmail: null,
    emailTo: email || "",
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
  
  const { selPlatforms = [], selNiches = [], selRegions = [], customKw = "", emailInput } = params;
  
  campaignState.isRunning = true;
  campaignState.logs = [];
  campaignState.results = [];
  campaignState.stats = { total: 0, byPlatform: {}, byNiche: {} };
  
  const queries = buildQueries(selPlatforms, selNiches, selRegions, customKw);
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
        let brand = parseGoogleResult(item, q.niche, q.platform, q.region, q.emailLang);
        const key = brand.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (key.length < 3 || seen.has(key)) continue;
        if (brand.url.match(/wikipedia|youtube\.com\/watch|google\.|amazon\.com\/s\?|ebay\.(com|it)\/sch/)) continue;
        
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
