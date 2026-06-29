// ─── queryBuilder.js — source de vérité unique pour la construction des requêtes
// Importé par : campaignManager.js (backend Node.js) et App.jsx (frontend Vite)

export const NICHES = [
  {
    id: "beauty",
    keywords: ["skincare italiano", "beauty brand Italia", "cosmetici artigianali italiani", "crema viso italiana", "siero viso brand italiano", "make up brand Italia"],
  },
  {
    id: "food",
    keywords: ["integratori italiani", "food brand italiano", "superfood Italia shop", "snack proteico italiano", "nutrition brand Italia", "organic food italiano"],
  },
  {
    id: "fitness",
    keywords: ["activewear italiano", "sportswear brand Italia", "yoga brand italiano", "fitness brand Italia", "abbigliamento sportivo italiano", "wellness brand Italia"],
  },
];

export const PLATFORMS = [
  { id: "web",       label: "Web / Google", siteFilter: "" },
  { id: "instagram", label: "Instagram",    siteFilter: "site:instagram.com" },
  { id: "tiktok",    label: "TikTok",       siteFilter: "site:tiktok.com" },
  { id: "facebook",  label: "Facebook",     siteFilter: "site:facebook.com" },
  { id: "pinterest", label: "Pinterest",    siteFilter: "site:pinterest.com" },
  { id: "amazon",    label: "Amazon",       siteFilter: "site:amazon.it" },
  { id: "etsy",      label: "Etsy",         siteFilter: "site:etsy.com" },
  { id: "ebay",      label: "eBay",         siteFilter: "site:ebay.it" },
];

export const REGIONS = [
  { id: "it", term: 'Italia italiano "made in Italy"', emailLang: "it" },
  { id: "eu", term: "Europe European brand",           emailLang: "en" },
  { id: "us", term: "US brand UK brand",               emailLang: "en" },
];

/**
 * Génère jusqu'à 12 requêtes de recherche aléatoires selon les filtres.
 * @param {string}   selTarget    "brands" | "influencers"
 * @param {string[]} selPlatforms IDs de plateformes sélectionnées
 * @param {string[]} selNiches    IDs de niches sélectionnées
 * @param {string[]} selRegions   IDs de régions sélectionnées
 * @param {string}   customKw    Mot-clé personnalisé libre (peut être vide)
 */
export function buildQueries(selTarget, selPlatforms, selNiches, selRegions, customKw) {
  const queries = [];

  for (const pid of selPlatforms) {
    const plat = PLATFORMS.find(p => p.id === pid);
    const siteQ = plat?.siteFilter ? `${plat.siteFilter} ` : "";

    for (const nid of selNiches) {
      const niche = NICHES.find(n => n.id === nid);
      if (!niche) continue;

      let kw = niche.keywords[Math.floor(Math.random() * niche.keywords.length)];
      if (selTarget === "influencers") kw = kw.replace(/ brand/gi, "");

      for (const rid of selRegions) {
        const region = REGIONS.find(r => r.id === rid);
        if (!region) continue;

        if (selTarget === "influencers") {
          const cleanKw = kw.replace(/ italiano| italiana| italia| brand/gi, "").trim();
          const rName   = rid === "it" ? "Italia" : (rid === "eu" ? "Europe" : "USA");
          let dorks = "";
          if (pid === "instagram") dorks = " -inurl:p -inurl:reel";
          if (pid === "tiktok")    dorks = " inurl:@";

          queries.push({
            query: `${siteQ}"${cleanKw}" "influencer" OR "creator" "${rName}" ("@gmail.com" OR "linktr.ee" OR "beacons.ai" OR "msha.ke")${dorks}`,
            niche: nid, platform: pid, region: rid, emailLang: region.emailLang, targetType: "influencers",
          });
        } else {
          queries.push({
            query: `${siteQ}${kw} ${region.term} ecommerce brand`,
            niche: nid, platform: pid, region: rid, emailLang: region.emailLang, targetType: "brands",
          });
          if (pid === "web") {
            queries.push({
              query: `${kw} ${region.term} piccolo brand collaborazione influencer`,
              niche: nid, platform: pid, region: rid, emailLang: region.emailLang, targetType: "brands",
            });
          }
        }
      }
    }
  }

  if (customKw && customKw.trim()) {
    queries.unshift({
      query: customKw.trim(), niche: "custom", platform: "web",
      region: "it", emailLang: "it", targetType: selTarget || "brands",
    });
  }

  return queries.sort(() => Math.random() - 0.5).slice(0, 12);
}
