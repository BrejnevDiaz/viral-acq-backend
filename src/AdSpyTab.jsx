import React, { useState, useMemo } from 'react';

// Pre-loaded high-quality demo creatives inspired by Minea
const BASE_MOCK_ADS = [
  {
    id: "spy_1",
    brand: "GlowSkin Co.",
    creator: "@sophia_beauty",
    platform: "tiktok",
    thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-applying-skincare-cream-on-face-41584-large.mp4",
    title: "Ce siero all'acido ialuronico ha cambiato la mia pelle! 🤯✨ #skincareroutine",
    niche: "beauty",
    region: "it",
    likes: 48200,
    comments: 890,
    shares: 1200,
    views: 890000,
    engagementRate: "5.5%",
    cta: "Shop Now",
    daysActive: 14,
    trend: [10, 25, 45, 75, 95],
    relevance: 92,
    contact: "collabs@glowskinco.com"
  },
  {
    id: "spy_2",
    brand: "FitBurn Nutrition",
    creator: "@marco_fitlife",
    platform: "instagram",
    thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-exercising-with-battle-ropes-in-gym-23007-large.mp4",
    title: "Le proteine veg più buone che io abbia mai provato! Codice MARCO10 per il -10%. 💪🌱",
    niche: "food",
    region: "it",
    likes: 12400,
    comments: 420,
    shares: 340,
    views: 180000,
    engagementRate: "7.1%",
    cta: "Learn More",
    daysActive: 8,
    trend: [5, 12, 28, 50, 72],
    relevance: 74,
    contact: "partners@fitburn.it"
  },
  {
    id: "spy_3",
    brand: "PureMatcha",
    creator: "@chloe_wellness",
    platform: "tiktok",
    thumbnail: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-whipping-green-tea-matcha-powder-with-whisk-43346-large.mp4",
    title: "My morning ritual for extreme focus & high energy! No coffee crashes anymore. 🍵🧘‍♀️",
    niche: "food",
    region: "eu",
    likes: 31200,
    comments: 650,
    shares: 980,
    views: 450000,
    engagementRate: "7.0%",
    cta: "Get Offer",
    daysActive: 22,
    trend: [30, 40, 52, 60, 68],
    relevance: 80,
    contact: "hello@purematcha.com"
  },
  {
    id: "spy_4",
    brand: "Velvet Cosmetics",
    creator: "@elisa_makeup",
    platform: "instagram",
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-makeup-artist-applying-eyeshadow-on-a-woman-40082-large.mp4",
    title: "Questo rossetto no-transfer resiste letteralmente a TUTTO. Test live su 24h! 💄👄",
    niche: "beauty",
    region: "it",
    likes: 54100,
    comments: 1100,
    shares: 2300,
    views: 1200000,
    engagementRate: "4.6%",
    cta: "Shop Now",
    daysActive: 30,
    trend: [80, 85, 90, 93, 97],
    relevance: 89,
    contact: "influencers@velvetcosmetics.com"
  },
  {
    id: "spy_5",
    brand: "Aura Activewear",
    creator: "@julia_yogi",
    platform: "tiktok",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-poses-on-a-mat-28956-large.large.mp4",
    title: "The squattest-proof leggings I have ever owned. High-waist luxury for half the price! 🧘‍♀️🍑",
    niche: "fitness",
    region: "eu",
    likes: 8900,
    comments: 180,
    shares: 95,
    views: 110000,
    engagementRate: "8.2%",
    cta: "Shop Now",
    daysActive: 5,
    trend: [2, 10, 30, 60, 85],
    relevance: 96,
    contact: "collab@aurawear.com"
  },
  {
    id: "spy_6",
    brand: "EcoGlow Skincare",
    creator: "@serena_green",
    platform: "instagram",
    thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-dripping-oil-on-her-face-from-a-dropper-40915-large.mp4",
    title: "Rutina natural para piel radiante sin químicos. Hecho con ingredientes 100% orgánicos! 🌿✨",
    niche: "beauty",
    region: "eu",
    likes: 19800,
    comments: 310,
    shares: 512,
    views: 320000,
    engagementRate: "6.3%",
    cta: "Apply Code",
    daysActive: 12,
    trend: [15, 22, 35, 48, 62],
    relevance: 68,
    contact: "info@ecoglow.com"
  },
  {
    id: "spy_7",
    brand: "HomeNest Design",
    creator: "@deco_lifestyle",
    platform: "tiktok",
    thumbnail: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-makeup-artist-applying-eyeshadow-on-a-woman-40082-large.mp4",
    title: "This magnetic spice rack changed my kitchen organization! Highly satisfying 🧂😍",
    niche: "beauty",
    region: "us",
    likes: 25000,
    comments: 450,
    shares: 110,
    views: 320000,
    engagementRate: "8.1%",
    cta: "Shop Now",
    daysActive: 19,
    trend: [40, 50, 65, 80, 95],
    relevance: 88,
    contact: "deco@homenest.com"
  },
  {
    id: "spy_8",
    brand: "HairLuxe Pro",
    creator: "@giulia_hairstyles",
    platform: "instagram",
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-applying-skincare-cream-on-face-41584-large.mp4",
    title: "Il segreto per onde perfette senza calore! Funziona al 100%! 💇‍♀️✨ #hairgoals",
    niche: "beauty",
    region: "it",
    likes: 45000,
    comments: 980,
    shares: 1200,
    views: 980000,
    engagementRate: "4.7%",
    cta: "Shop Now",
    daysActive: 25,
    trend: [60, 70, 85, 92, 98],
    relevance: 95,
    contact: "collabs@hairluxepro.it"
  },
  {
    id: "spy_9",
    brand: "Veloce Coffee",
    creator: "@coffee_lover_it",
    platform: "tiktok",
    thumbnail: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-whipping-green-tea-matcha-powder-with-whisk-43346-large.mp4",
    title: "Il mio espresso portatile ricaricabile, pronto in 2 minuti ovunque! ☕🚗",
    niche: "food",
    region: "it",
    likes: 18000,
    comments: 230,
    shares: 450,
    views: 240000,
    engagementRate: "7.6%",
    cta: "Get Offer",
    daysActive: 9,
    trend: [10, 25, 40, 62, 85],
    relevance: 78,
    contact: "hello@velocecoffee.it"
  },
  {
    id: "spy_10",
    brand: "Flexfit Band",
    creator: "@john_fitness",
    platform: "instagram",
    thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-exercising-with-battle-ropes-in-gym-23007-large.mp4",
    title: "The only resistance bands you need for an intense home workout. Durable and premium. 💪",
    niche: "fitness",
    region: "eu",
    likes: 22000,
    comments: 390,
    shares: 150,
    views: 300000,
    engagementRate: "7.3%",
    cta: "Shop Now",
    daysActive: 6,
    trend: [5, 20, 48, 70, 90],
    relevance: 82,
    contact: "info@flexfitband.com"
  },
  {
    id: "spy_11",
    brand: "CleanSpatula",
    creator: "@laura_aesthetic",
    platform: "tiktok",
    thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-dripping-oil-on-her-face-from-a-dropper-40915-large.mp4",
    title: "Scrub viso ad ultrasuoni a casa come in centro estetico! Pori puliti all'istante ✨🧴",
    niche: "beauty",
    region: "eu",
    likes: 37000,
    comments: 810,
    shares: 640,
    views: 600000,
    engagementRate: "6.3%",
    cta: "Shop Now",
    daysActive: 16,
    trend: [20, 35, 55, 78, 92],
    relevance: 91,
    contact: "collab@cleanspatula.com"
  },
  {
    id: "spy_12",
    brand: "LumiLamp",
    creator: "@lucas_tech",
    platform: "instagram",
    thumbnail: "https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=400&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-exercising-with-battle-ropes-in-gym-23007-large.mp4",
    title: "This levitating lamp with wireless charging base is absolute magic. 🌌💡",
    niche: "fitness",
    region: "us",
    likes: 29000,
    comments: 750,
    shares: 180,
    views: 400000,
    engagementRate: "7.4%",
    cta: "Shop Now",
    daysActive: 11,
    trend: [10, 30, 50, 75, 88],
    relevance: 85,
    contact: "support@lumilamp.com"
  }
];

const MOCK_ADS = [...BASE_MOCK_ADS];

const brandTemplates = [
  { brand: "PureSilky Co.", niche: "beauty", contact: "collab@puresilky.com" },
  { brand: "FitShaker Nutrition", niche: "food", contact: "info@fitshaker.it" },
  { brand: "AuraJade Skin", niche: "beauty", contact: "hello@aurajade.com" },
  { brand: "KetoBites Snacks", niche: "food", contact: "partners@ketobites.eu" },
  { brand: "ActiveStrap Gear", niche: "fitness", contact: "collabs@activestrap.com" },
  { brand: "LuxeBrow Cosmetics", niche: "beauty", contact: "partners@luxebrow.it" },
  { brand: "EcoZen Essentials", niche: "lifestyle", contact: "hello@ecozen.com" }
];

const creatorTemplates = [
  "@emma_glow", "@davide_fit", "@clara_wellness", "@luca_lifestyle",
  "@sophie_cosmetics", "@giovanni_trainer", "@sara_organic", "@matteo_shred"
];

const titleTemplates = {
  fr: [
    "Incroyable ! Ce produit a littéralement changé ma routine quotidienne. 😍✨",
    "Le secret pour brûler les graisses rapidement sans frustration ! 💪🥑",
    "J'ai testé cette astuce virale pendant une semaine entière, regardez ça !",
    "La meilleure alternative bio et naturelle du marché. Approuvé à 100% ! 🌿",
    "Déballage et avis honnête de ce gadget révolutionnaire. 🤯📦"
  ],
  en: [
    "Honestly, this product completely transformed my morning routine! 😍✨",
    "The ultimate secret to boost energy and stay lean! 💪🥑",
    "I tested this viral hack for a full week, here is what happened!",
    "The best organic and natural alternative out there. 100% approved! 🌿",
    "Honest unboxing and review of this revolutionary tool. 🤯📦"
  ],
  it: [
    "Onestamente, questo prodotto ha completamente rivoluzionato la mia routine! 😍✨",
    "Il segreto definitivo per rimanere in forma e pieni di energia! 💪🥑",
    "Ho testato questo trucco virale per una settimana intera, ecco i risultati!",
    "La migliore alternativa biologica e naturale in commercio. Approvato! 🌿",
    "Unboxing e recensione onesta di questo gadget rivoluzionario. 🤯📦"
  ]
};

const videoTemplates = [
  "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-applying-skincare-cream-on-face-41584-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-man-exercising-with-battle-ropes-in-gym-23007-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-whipping-green-tea-matcha-powder-with-whisk-43346-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-hands-of-makeup-artist-applying-eyeshadow-on-a-woman-40082-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-dripping-oil-on-her-face-from-a-dropper-40915-large.mp4"
];

const thumbnails = [
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
  "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80"
];

const platforms = ["tiktok", "instagram", "facebook", "pinterest"];
const regions = ["it", "fr", "eu", "us"];
const ctas = ["Shop Now", "Get Offer", "Learn More", "Subscribe"];

for (let i = 13; i <= 100; i++) {
  const brandObj = brandTemplates[i % brandTemplates.length];
  const creator = creatorTemplates[i % creatorTemplates.length];
  const platform = platforms[i % platforms.length];
  const region = regions[i % regions.length];
  const cta = ctas[i % ctas.length];
  const videoUrl = videoTemplates[i % videoTemplates.length];
  const thumbnail = thumbnails[i % thumbnails.length];
  
  const langKey = region === "it" ? "it" : (region === "fr" ? "fr" : "en");
  const titles = titleTemplates[langKey] || titleTemplates.en;
  const titleText = titles[i % titles.length] + ` #${brandObj.brand.toLowerCase().replace(/\s/g, '')}`;
  
  const views = 45000 + (i * 14813) % 1200000;
  const likes = Math.floor(views * 0.06);
  const comments = Math.floor(likes * 0.03);
  const shares = Math.floor(likes * 0.04);
  const relevance = 25 + (i * 11) % 76;
  
  MOCK_ADS.push({
    id: `spy_${i}`,
    brand: brandObj.brand,
    creator: creator,
    platform: platform,
    thumbnail: thumbnail,
    videoUrl: videoUrl,
    title: titleText,
    niche: brandObj.niche,
    region: region,
    likes: likes,
    comments: comments,
    shares: shares,
    views: views,
    engagementRate: ((likes / views) * 100).toFixed(1) + "%",
    cta: cta,
    daysActive: 4 + (i * 3) % 40,
    trend: [12, 22 + i % 8, 44 + i % 18, 66 + i % 28, 88 + i % 18],
    relevance: relevance,
    contact: brandObj.contact
  });
}

export default function AdSpyTab({ c, mono, API_URL, onImportLead, uiLang, setCurrentTab, setRedirectShop, userTier = "free" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [hoveredAd, setHoveredAd] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [creatives, setCreatives] = useState(MOCK_ADS);
  const [loading, setLoading] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState("overview"); // overview | transcript | suppliers

  const maskString = (str) => {
    if (userTier === "admin") return str;
    if (!str) return "";
    if (str.length <= 3) return str[0] + "*".repeat(str.length - 1);
    return str.slice(0, 2) + "*".repeat(str.length - 4) + str.slice(-2);
  };

  const maskCreator = (str) => {
    if (userTier === "admin") return str;
    if (!str) return "";
    if (str.startsWith("@")) {
      const handle = str.slice(1);
      if (handle.length <= 4) return "@" + handle[0] + "*".repeat(handle.length - 1);
      return "@" + handle.slice(0, 2) + "*".repeat(handle.length - 4) + handle.slice(-2);
    }
    if (str.length <= 3) return str[0] + "*".repeat(str.length - 1);
    return str.slice(0, 2) + "*".repeat(str.length - 4) + str.slice(-2);
  };

  const t = {
    fr: {
      title: "🔥 AdSpy & Créatifs Viraux",
      desc: "Espionnez les publicités et les placements d'influenceurs les plus performants du marché. Inspirez-vous et prospectez les marques ou créateurs en 1 clic.",
      ph: "Rechercher une marque, un mot-clé ou un créateur (ex: 'skincare', 'fitness')...",
      searchBtn: "🔍 Rechercher",
      niche: "Niche",
      platform: "Réseau",
      sort: "Trier par",
      relevance: "Pertinence (Par défaut)",
      views: "Vues",
      likes: "Likes",
      eng: "Taux d'Engagement",
      outreach: "🚀 Prospecter direct",
      ctaBtn: "Voir l'original",
      trendLabel: "Index de Tendance",
      all: "Tous",
      activeDays: (n) => `Actif depuis ${n} jours`,
      statsHeading: "Statistiques Clés",
      realSearchTip: "💡 Mode Réel : Saisissez un mot-clé et cliquez sur Rechercher pour extraire de VRAIS créatifs en temps réel de TikTok/Instagram !",
      loadingText: "⚡ Extraction de vrais créatifs en temps réel...",
      emptyText: "Aucun créatif trouvé. Essayez une recherche en mode réel avec un autre mot-clé !"
    },
    en: {
      title: "🔥 AdSpy & Viral Creatives",
      desc: "Spy on the best-performing social media ads and influencer placements. Get inspired and outreach to brands or creators in 1 click.",
      ph: "Search brand, keyword, or creator (e.g. 'skincare', 'fitness')...",
      searchBtn: "🔍 Search",
      niche: "Niche",
      platform: "Platform",
      sort: "Sort by",
      relevance: "Relevance (Default)",
      views: "Views",
      likes: "Likes",
      eng: "Engagement Rate",
      outreach: "🚀 Fast Outreach",
      ctaBtn: "View Original",
      trendLabel: "Trend Index",
      all: "All",
      activeDays: (n) => `Active for ${n} days`,
      statsHeading: "Key Statistics",
      realSearchTip: "💡 Live Search: Type any keyword and click Search to fetch REAL live creatives in real-time from TikTok/Instagram!",
      loadingText: "⚡ Extracting real creatives in real-time...",
      emptyText: "No creatives found. Try a live search with a different keyword!"
    },
    it: {
      title: "🔥 AdSpy & Creatività Virali",
      desc: "Spia le inserzioni e i posizionamenti degli influencer più performanti sul mercato. Lasciati ispirare e avvia la prospezione a marchi o creatori in 1 clic.",
      ph: "Cerca marchio, parola chiave o creator (es: 'skincare', 'fitness')...",
      searchBtn: "🔍 Cerca",
      niche: "Nicchia",
      platform: "Social Network",
      sort: "Ordina per",
      relevance: "Pertinenza (Default)",
      views: "Visualizzazioni",
      likes: "Likes",
      eng: "Tasso d'Engagement",
      outreach: "🚀 Prospezione diretta",
      ctaBtn: "Vedi Originale",
      trendLabel: "Indice di Trend",
      all: "Tutti",
      activeDays: (n) => `Attivo da ${n} giorni`,
      statsHeading: "Statistiche Chiave",
      realSearchTip: "💡 Ricerca Live: Inserisci una parola chiave e clicca su Cerca per estrarre VERE inserzioni in tempo reale da TikTok/Instagram!",
      loadingText: "⚡ Estrazione di creatività reali in tempo reale...",
      emptyText: "Nessuna creatività trovata. Prova una ricerca live con un'altra parola chiave!"
    }
  }[uiLang] || {
    title: "🔥 AdSpy & Créatifs Viraux",
    desc: "Espionnez les publicités et les placements d'influenceurs les plus performants du marché. Inspirez-vous et prospectez les marques ou créateurs en 1 clic.",
    ph: "Rechercher une marque, un mot-clé ou un créateur...",
    searchBtn: "🔍 Rechercher",
    niche: "Niche",
    platform: "Réseau",
    sort: "Trier par",
    relevance: "Pertinence",
    views: "Vues",
    likes: "Likes",
    eng: "Taux d'Engagement",
    outreach: "🚀 Prospecter direct",
    ctaBtn: "Voir l'original",
    trendLabel: "Index de Tendance",
    all: "Tous",
    activeDays: (n) => `Actif depuis ${n} jours`,
    statsHeading: "Statistiques Clés",
    realSearchTip: "💡 Mode Réel : Saisissez un mot-clé et cliquez sur Rechercher pour extraire de VRAIS créatifs en temps réel de TikTok/Instagram !",
    loadingText: "⚡ Extraction de vrais créatifs en temps réel...",
    emptyText: "Aucun créatif trouvé."
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/adspy/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchTerm, niche: selectedNiche, platform: selectedPlatform })
      });
      const data = await response.json();
      if (data.creatives && data.creatives.length > 0) {
        setCreatives(data.creatives);
      } else {
        alert(uiLang === "fr" ? "Aucun créatif réel trouvé pour cette recherche." : "Nessuna creatività reale trovata per questa ricerca.");
      }
    } catch (err) {
      console.error(err);
      alert(uiLang === "fr" ? "Erreur de connexion au backend. Assurez-vous que node server.js est lancé." : "Errore del server.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAds = useMemo(() => {
    return creatives.filter(ad => {
      // Local client-side filter if search input is changed but not submitted, or to filter local demo items
      const matchNiche = selectedNiche === "all" || ad.niche === selectedNiche;
      const matchPlatform = selectedPlatform === "all" || ad.platform === selectedPlatform;
      return matchNiche && matchPlatform;
    }).sort((a, b) => {
      if (sortBy === "relevance") return (b.relevance || 0) - (a.relevance || 0);
      if (sortBy === "views") return b.views - a.views;
      if (sortBy === "likes") return b.likes - a.likes;
      if (sortBy === "engagement") return parseFloat(b.engagementRate) - parseFloat(a.engagementRate);
      return 0;
    });
  }, [creatives, selectedNiche, selectedPlatform, sortBy]);

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out", position: "relative" }}>
      
      {/* Hero section */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: c.text, margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>{t.title}</h2>
        <p style={{ color: c.textMuted, margin: 0, fontSize: 14, lineHeight: 1.5, maxWidth: 700 }}>{t.desc}</p>
      </div>

      {/* Tip Banner */}
      <div style={{ background: c.accentSoft, border: `1.5px dashed ${c.accent}`, padding: "12px 16px", borderRadius: 12, marginBottom: 20, color: c.text, fontSize: 13, display: "flex", alignItems: "center", gap: 10 }}>
        <span>{t.realSearchTip}</span>
      </div>

      {/* Filter panel */}
      <form onSubmit={handleSearch} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 18, marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        
        {/* Search Input */}
        <div style={{ flex: "1 1 280px", display: "flex", gap: 8 }}>
          <input 
            type="text" 
            placeholder={t.ph}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ flex: 1, padding: "11px 14px", borderRadius: 9, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, fontSize: 13, outline: "none" }}
          />
          <button type="submit" style={{ padding: "11px 18px", borderRadius: 9, border: "none", background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: mono, boxShadow: `0 4px 16px ${c.accentGlow}` }}>
            {t.searchBtn}
          </button>
        </div>

        {/* Niche select */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontFamily: mono, color: c.textDim, textTransform: "uppercase" }}>{t.niche}</span>
          <select 
            value={selectedNiche}
            onChange={e => setSelectedNiche(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: 9, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13, cursor: "pointer" }}
          >
            <option value="all">{t.all}</option>
            <option value="beauty">Beauty</option>
            <option value="food">Food & Nutrition</option>
            <option value="fitness">Fitness</option>
          </select>
        </div>

        {/* Platform select */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontFamily: mono, color: c.textDim, textTransform: "uppercase" }}>{t.platform}</span>
          <select 
            value={selectedPlatform}
            onChange={e => setSelectedPlatform(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: 9, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13, cursor: "pointer" }}
          >
            <option value="all">{t.all}</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>

        {/* Sort select */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <span style={{ fontSize: 11, fontFamily: mono, color: c.textDim, textTransform: "uppercase" }}>{t.sort}</span>
          <select 
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: 9, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13, cursor: "pointer" }}
          >
            <option value="relevance">{t.relevance}</option>
            <option value="views">{t.views}</option>
            <option value="likes">{t.likes}</option>
            <option value="engagement">{t.eng}</option>
          </select>
        </div>
      </form>

      {/* Loading Overlay */}
      {loading && (
        <div style={{ position: "absolute", top: 120, left: 0, right: 0, bottom: 0, background: "rgba(8,8,16,0.7)", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, zIndex: 50, borderRadius: 14 }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", border: `3px solid ${c.accent}22`, borderTopColor: c.accent, animation: "spin 1s linear infinite", marginBottom: 16 }}></div>
          <p style={{ fontSize: 14, fontWeight: 700, color: c.text, fontFamily: mono }}>{t.loadingText}</p>
        </div>
      )}

      {/* Grid creative results */}
      {filteredAds.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", color: c.textDim }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <p>{t.emptyText}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {filteredAds.map((ad) => (
            <div 
              key={ad.id}
              onMouseEnter={() => setHoveredAd(ad.id)}
              onMouseLeave={() => setHoveredAd(null)}
              style={{ 
                background: c.card, 
                border: `1.5px solid ${hoveredAd === ad.id ? c.borderActive : c.border}`, 
                borderRadius: 16, 
                overflow: "hidden", 
                boxShadow: hoveredAd === ad.id ? `0 12px 32px ${c.accentGlow}` : "none",
                transform: hoveredAd === ad.id ? "translateY(-4px)" : "none",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              
              {/* Visual Thumbnail / Video Wrapper */}
              <div style={{ height: 260, position: "relative", cursor: "pointer", background: "#000" }} onClick={() => setActiveVideo(ad)}>
                <img 
                  src={ad.thumbnail} 
                  alt="Ad cover" 
                  style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85, transition: "transform 0.3s" }}
                />
                
                {/* Play Badge */}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 56, height: 56, borderRadius: "50%", background: "rgba(139, 92, 246, 0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)", transition: "all 0.2s" }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff" style={{ marginLeft: 3 }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>

                {/* Niche & Platform Badges */}
                <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
                  <span style={{ background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 8px", borderRadius: 6, backdropFilter: "blur(4px)", textTransform: "uppercase" }}>
                    {ad.niche}
                  </span>
                  <span style={{ background: ad.platform === 'tiktok' ? '#000' : 'rgba(225,48,108,0.85)', color: '#fff', fontSize: 10, fontWeight: 700, padding: "4px 8px", borderRadius: 6, backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: 4 }}>
                    <img src={`https://cdn.simpleicons.org/${ad.platform}/ffffff`} width={10} height={10} alt="" />
                    {ad.platform.toUpperCase()}
                  </span>
                </div>

                {/* Engagement Rate overlay */}
                <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(16,185,129,0.9)", color: "#06060b", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
                  🔥 {ad.engagementRate} Er
                </div>

                {/* Days Active Overlay */}
                <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 10.5, fontWeight: 550, padding: "4px 8px", borderRadius: 6, backdropFilter: "blur(4px)", fontFamily: mono }}>
                  {t.activeDays(ad.daysActive)}
                </div>
              </div>

              {/* Ad text & info */}
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: c.text }}>{maskString(ad.brand)}</span>
                  <span style={{ fontSize: 12, color: c.textMuted, fontFamily: mono }}>{maskCreator(ad.creator)}</span>
                </div>

                <p style={{ fontSize: 12, color: c.textMuted, height: 40, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.4, margin: "0 0 14px 0" }}>
                  {ad.title}
                </p>

                {/* Engagement Stats Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, background: c.bg, padding: 8, borderRadius: 10, border: `1px solid ${c.border}`, marginBottom: 14 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9.5, color: c.textDim, fontFamily: mono }}>VIEWS</div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: c.text }}>
                      {ad.views >= 1000000 ? `${(ad.views / 1000000).toFixed(1)}M` : ad.views >= 1000 ? `${(ad.views / 1000).toFixed(0)}k` : ad.views}
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9.5, color: c.textDim, fontFamily: mono }}>LIKES</div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: c.text }}>
                      {ad.likes >= 1000 ? `${(ad.likes / 1000).toFixed(1)}k` : ad.likes}
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9.5, color: c.textDim, fontFamily: mono }}>ENG.</div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: c.success }}>{ad.engagementRate}</div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button 
                    onClick={() => onImportLead({
                      name: ad.brand,
                      url: ad.platform === "tiktok" ? `https://tiktok.com/${ad.creator}` : `https://instagram.com/${ad.creator.replace("@", "")}`,
                      platform: ad.platform === "tiktok" ? "TikTok" : "Instagram",
                      platformId: ad.platform,
                      niche: ad.niche,
                      region: ad.region,
                      contact: ad.contact,
                      instagram: ad.platform === "instagram" ? ad.creator : null,
                      socials: {
                        instagram: ad.platform === "instagram" ? `https://instagram.com/${ad.creator.replace("@", "")}` : null,
                        tiktok: ad.platform === "tiktok" ? `https://tiktok.com/${ad.creator}` : null,
                      },
                      score: 85,
                      size: "Startup",
                      reasoning: "Minea Spy Live"
                    })}
                    style={{ 
                      flex: 1, 
                      padding: "10px 14px", 
                      borderRadius: 9, 
                      border: "none", 
                      background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, 
                      color: "#fff", 
                      fontSize: 12, 
                      fontWeight: 700, 
                      fontFamily: mono, 
                      cursor: "pointer", 
                      boxShadow: `0 4px 16px ${c.accentGlow}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6
                    }}
                  >
                    {t.outreach}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIDEO MODAL PLAYER & SPY ANALYTICS */}
      {activeVideo && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 20, width: "100%", maxWidth: 880, maxHeight: "90vh", overflowY: "auto", position: "relative", boxShadow: "0 25px 50px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column" }}>
            
            {/* Close Button */}
            <button onClick={() => setActiveVideo(null)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.6)", border: "none", width: 36, height: 36, borderRadius: "50%", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, zIndex: 10 }}>✖</button>
            
            <div style={{ display: "flex", flexWrap: "wrap", minHeight: 480 }}>
              
              {/* Left Side: Video Player (Real iframe Embed support!) */}
              <div style={{ flex: "1 1 400px", background: "#000", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: 480 }}>
                {activeVideo.videoUrl.includes("embed") ? (
                  <iframe
                    src={activeVideo.videoUrl}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  />
                ) : (
                  <video 
                    src={activeVideo.videoUrl} 
                    controls 
                    autoPlay 
                    loop
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                )}
              </div>

              {/* Right Side: Ad Spy Details & Analytics */}
              <div style={{ flex: "1 1 360px", padding: 24, display: "flex", flexDirection: "column", maxHeight: 480, overflowY: "auto" }}>
                
                {/* Header branding */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  {/* Real Brand Logo */}
                  <div style={{ width: 40, height: 40, borderRadius: 8, border: `1.5px solid ${c.border}`, background: `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                    <img 
                      src={`https://logo.clearbit.com/${activeVideo.brand.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com"}`} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeVideo.brand)}&background=8B5CF6&color=fff&size=100&rounded=false`;
                      }} 
                      alt="" 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{ margin: "0 0 2px 0", fontSize: 17, fontWeight: 800, color: c.text }}>{maskString(activeVideo.brand)}</h3>
                    <p style={{ fontSize: 11.5, color: c.textMuted, fontFamily: mono, margin: 0 }}>Placement par {maskCreator(activeVideo.creator)}</p>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    <span style={{ background: c.accentSoft, color: c.accent, fontSize: 9.5, fontWeight: 700, padding: "3px 6px", borderRadius: 5, textTransform: "uppercase" }}>{activeVideo.niche}</span>
                    <span style={{ background: "#000", color: "#fff", fontSize: 9.5, fontWeight: 700, padding: "3px 6px", borderRadius: 5, display: "flex", alignItems: "center", gap: 3 }}>
                      <img src={`https://cdn.simpleicons.org/${activeVideo.platform}/ffffff`} width={9} height={9} alt="" />
                      {activeVideo.platform.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Minea-inspired Sub-tabs inside Modal */}
                <div style={{ display: "flex", borderBottom: `1.5px solid ${c.border}`, marginBottom: 16, gap: 10 }}>
                  {["overview", "transcript", "suppliers"].map(tabId => (
                    <button 
                      key={tabId}
                      type="button"
                      onClick={() => setActiveModalTab(tabId)}
                      style={{
                        flex: 1,
                        padding: "8px 0",
                        border: "none",
                        background: "transparent",
                        borderBottom: `2.5px solid ${activeModalTab === tabId ? c.accent : "transparent"}`,
                        color: activeModalTab === tabId ? c.text : c.textDim,
                        fontWeight: 700,
                        fontSize: 12,
                        fontFamily: mono,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {tabId === "overview" ? "Aperçu 📊" : tabId === "transcript" ? "Script & Hooks 📝" : "Fournisseurs 🛍️"}
                    </button>
                  ))}
                </div>

                {/* Sub-tab Content Router */}
                {activeModalTab === "overview" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeIn 0.2s ease-out" }}>
                    
                    {/* Mini metrics cards grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                      <div style={{ background: c.bg, border: `1px solid ${c.border}`, padding: "8px 4px", borderRadius: 8, textAlign: "center" }}>
                        <div style={{ fontSize: 8, color: c.textDim, fontFamily: mono }}>DAYS ACTIVE</div>
                        <div style={{ fontSize: 11.5, fontWeight: 800, color: c.warning }}>{activeVideo.daysActive}d</div>
                      </div>
                      <div style={{ background: c.bg, border: `1px solid ${c.border}`, padding: "8px 4px", borderRadius: 8, textAlign: "center" }}>
                        <div style={{ fontSize: 8, color: c.textDim, fontFamily: mono }}>DUPLICATION</div>
                        <div style={{ fontSize: 11.5, fontWeight: 800, color: c.accent }}>{Math.floor(activeVideo.views * 0.00003) + 3}</div>
                      </div>
                      <div style={{ background: c.bg, border: `1px solid ${c.border}`, padding: "8px 4px", borderRadius: 8, textAlign: "center" }}>
                        <div style={{ fontSize: 8, color: c.textDim, fontFamily: mono }}>SPEND</div>
                        <div style={{ fontSize: 11.5, fontWeight: 800, color: c.accent2 }}>{((activeVideo.views * 0.0003) / 1.2).toFixed(1)}k€</div>
                      </div>
                      <div style={{ background: c.bg, border: `1px solid ${c.border}`, padding: "8px 4px", borderRadius: 8, textAlign: "center" }}>
                        <div style={{ fontSize: 8, color: c.textDim, fontFamily: mono }}>IMPRESSIONS</div>
                        <div style={{ fontSize: 11.5, fontWeight: 800, color: c.success }}>{(activeVideo.views / 1000).toFixed(0)}k</div>
                      </div>
                    </div>

                    {/* Brand details container */}
                    <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, padding: 12, borderRadius: 12 }}>
                      <div style={{ fontSize: 9.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 8, display: "flex", justify: "space-between" }}>
                        <span>Détails Page de la Marque</span>
                        <span style={{ color: c.success }}>{Math.floor(activeVideo.views * 0.0001) + 24} Active Ads</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        {/* Circle Progress Bar */}
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: `conic-gradient(${c.accent} 72%, rgba(255,255,255,0.05) 0)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.card, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: c.text }}>72%</div>
                        </div>
                        <div style={{ flex: 1, fontSize: 11.5, color: c.textMuted, lineHeight: 1.4 }}>
                          Créée le : <span style={{ color: c.text, fontWeight: 700 }}>Jan 8, 2020</span><br />
                          Dépenses totales de la page : <span style={{ color: c.success, fontWeight: 700 }}>$72k+</span><br />
                          Audience ciblée : <span style={{ color: c.text, fontWeight: 700 }}>3.4 M</span>
                        </div>
                      </div>
                    </div>

                    {/* Shopify shop details */}
                    <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, padding: 12, borderRadius: 12 }}>
                      <div style={{ fontSize: 9.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 10 }}>Détails Boutique Shopify (Spy)</div>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 8.5, color: c.textDim }}>VISITES / MOIS</div>
                          <div style={{ fontSize: 12, fontWeight: 800, color: c.text }}>72,000 <span style={{ color: c.success, fontSize: 9 }}>+3M</span></div>
                        </div>
                        <div>
                          <div style={{ fontSize: 8.5, color: c.textDim }}>PRODUITS LISTÉS</div>
                          <div style={{ fontSize: 12, fontWeight: 800, color: c.text }}>48</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 8.5, color: c.textDim }}>REVENU ESTIMÉ</div>
                          <div style={{ fontSize: 12, fontWeight: 800, color: c.success }}>$1.2K / Jour</div>
                        </div>
                      </div>

                      {/* Geographic split progress bars */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", justify: "space-between", fontSize: 11 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>🇬🇧 UK</span>
                          <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 3, margin: "0 8px", overflow: "hidden" }}>
                            <div style={{ width: "70%", height: "100%", background: c.accent, borderRadius: 3 }} />
                          </div>
                          <span style={{ color: c.textMuted }}>70%</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justify: "space-between", fontSize: 11 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>🇫🇷 FR</span>
                          <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 3, margin: "0 8px", overflow: "hidden" }}>
                            <div style={{ width: "30%", height: "100%", background: c.accent2, borderRadius: 3 }} />
                          </div>
                          <span style={{ color: c.textMuted }}>30%</span>
                        </div>
                      </div>

                      {/* Shop Analysis Redirect Button */}
                      <button 
                        type="button"
                        onClick={() => {
                          const shopData = {
                            id: `shop_redirect_${activeVideo.brand}`,
                            name: activeVideo.brand,
                            domain: activeVideo.brand.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com",
                            logo: activeVideo.thumbnail,
                            url: "https://" + activeVideo.brand.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com",
                            monthlyTraffic: 72000,
                            monthlyRevenue: 36000,
                            dailyGrowth: "+$1.2k/Day",
                            trafficGrowth: [30, 42, 55, 68, 85],
                            theme: activeVideo.niche === "beauty" ? "Prestige (Premium)" : "Dawn (Modern Clean)",
                            apps: ["Klaviyo Email", "Loox Reviews", "Recharge Subscriptions"],
                            countries: [
                              { code: "US", pct: 60 },
                              { code: "FR", pct: 25 },
                              { code: "IT", pct: 15 }
                            ],
                            sources: { social: 70, search: 18, direct: 10, mail: 2 },
                            productsCount: 48,
                            activeAdsCount: 34,
                            niche: activeVideo.niche,
                            contact: activeVideo.contact
                          };
                          setRedirectShop(shopData);
                          setCurrentTab("shopanalyzer");
                          setActiveVideo(null);
                        }}
                        style={{
                          width: "100%", padding: "10px", borderRadius: 8, border: "none",
                          background: `linear-gradient(135deg, ${c.accent}20, ${c.accent2}20)`,
                          border: `1.5px solid ${c.border}`, color: c.text,
                          fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: mono,
                          transition: "all 0.2s"
                        }}
                      >
                        🛍️ Analyser la Boutique dans Shop Analyzer
                      </button>
                    </div>

                    {/* Sourcing CTA */}
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <button 
                        type="button"
                        onClick={() => {
                          onImportLead({
                            name: activeVideo.brand,
                            url: activeVideo.platform === "tiktok" ? `https://tiktok.com/${activeVideo.creator}` : `https://instagram.com/${activeVideo.creator.replace("@", "")}`,
                            platform: activeVideo.platform === "tiktok" ? "TikTok" : "Instagram",
                            platformId: activeVideo.platform,
                            niche: activeVideo.niche,
                            region: activeVideo.region,
                            contact: activeVideo.contact,
                            instagram: activeVideo.platform === "instagram" ? activeVideo.creator : null,
                            socials: {
                              instagram: activeVideo.platform === "instagram" ? `https://instagram.com/${activeVideo.creator.replace("@", "")}` : null,
                              tiktok: activeVideo.platform === "tiktok" ? `https://tiktok.com/${activeVideo.creator}` : null,
                            },
                            score: 90,
                            size: "Medium",
                            reasoning: "Minea AdSpy Live"
                          });
                          setActiveVideo(null);
                        }}
                        style={{ flex: 1, padding: "13px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: mono, cursor: "pointer", boxShadow: `0 4px 16px ${c.accentGlow}` }}
                      >
                        🚀 {t.outreach}
                      </button>
                    </div>
                  </div>
                )}

                {activeModalTab === "transcript" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeIn 0.2s ease-out" }}>
                    
                    {/* Transcript Card */}
                    <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, padding: 14, borderRadius: 12 }}>
                      <div style={{ fontSize: 9.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 8 }}>Transcription Vocale (Speech-to-Text)</div>
                      <p style={{ fontSize: 12.5, color: c.text, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                        "<span style={{ background: `linear-gradient(120deg, ${c.accent}33, ${c.accent}22)`, padding: "2px 4px", borderRadius: 4, fontWeight: 650 }}>Oh mon Dieu, regardez ça ! J'avais des pores dilatés et des points noirs sur tout le nez depuis des années... Mais ce produit a littéralement sauvé ma peau en moins de deux semaines !</span> C'est le secret le mieux gardé des esthéticiennes. Vous appliquez simplement la spatule à ultrasons après votre douche, et vous regardez la saleté s'extraire comme par magie ! Ne dépensez plus des centaines d'euros en instituts. Cliquez ci-dessous pour profiter de la promo à -50% !"
                      </p>
                    </div>

                    {/* AI Hook Card */}
                    <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, padding: 14, borderRadius: 12 }}>
                      <div style={{ display: "flex", justify: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 9.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase" }}>Analyse IA du Hook (Accroche)</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: c.success }}>🔥 9.4/10 (Excellent)</span>
                      </div>
                      <div style={{ fontSize: 12, color: c.textMuted, lineHeight: 1.5 }}>
                        <strong style={{ color: c.text }}>Type d'accroche :</strong> Choc visuel + empathie sur le problème esthétique (pain point).<br />
                        <strong style={{ color: c.text }}>Rétention moyenne :</strong> 5.8 secondes (moyenne marché : 2.4s).<br />
                        <strong style={{ color: c.accent, display: "block", marginTop: 8 }}>💡 Conseil d'optimisation IA :</strong>
                        Ajoutez un effet sonore de zoom ultra-rapide (swish) sur l'extraction dès la première seconde pour augmenter le CTR de 15%.
                      </div>
                    </div>
                  </div>
                )}

                {activeModalTab === "suppliers" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeIn 0.2s ease-out" }}>
                    
                    {/* Financial Estimator Card */}
                    <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, padding: 14, borderRadius: 12 }}>
                      <div style={{ fontSize: 9.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 10 }}>Calculateur de Marges E-commerce</div>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                        <div style={{ background: c.card, padding: 8, borderRadius: 8, border: `1px solid ${c.border}` }}>
                          <div style={{ fontSize: 8.5, color: c.textDim }}>PRIX DE VENTE (EST.)</div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: c.text }}>$39.99</div>
                        </div>
                        <div style={{ background: c.card, padding: 8, borderRadius: 8, border: `1px solid ${c.border}` }}>
                          <div style={{ fontSize: 8.5, color: c.textDim }}>COÛT D'ACHAT (COGS)</div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: c.text }}>$9.50</div>
                        </div>
                        <div style={{ background: c.card, padding: 8, borderRadius: 8, border: `1px solid ${c.border}` }}>
                          <div style={{ fontSize: 8.5, color: c.textDim }}>BÉNÉFICE / UNITÉ</div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: c.success }}>+$30.49</div>
                        </div>
                        <div style={{ background: c.card, padding: 8, borderRadius: 8, border: `1px solid ${c.border}` }}>
                          <div style={{ fontSize: 8.5, color: c.textDim }}>MARGE NETTE</div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: c.success }}>76%</div>
                        </div>
                      </div>
                    </div>

                    {/* Sourcing channels links */}
                    <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, padding: 14, borderRadius: 12 }}>
                      <div style={{ fontSize: 9.5, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 10 }}>Sourcing Direct & Agent Dropshipping</div>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <a 
                          href={`https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(activeVideo.brand)}`} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{
                            display: "block", textDecoration: "none", background: "#e05c2b14", border: "1.5px solid #e05c2b",
                            color: "#e05c2b", padding: "10px", borderRadius: 8, textAlign: "center", fontSize: 12, fontWeight: 700, fontFamily: mono
                          }}
                        >
                          🔍 Trouver le fournisseur sur AliExpress
                        </a>
                        <a 
                          href={`https://cjdropshipping.com/search/${encodeURIComponent(activeVideo.brand)}.html`} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{
                            display: "block", textDecoration: "none", background: "#febb0214", border: "1.5px solid #febb02",
                            color: "#febb02", padding: "10px", borderRadius: 8, textAlign: "center", fontSize: 12, fontWeight: 700, fontFamily: mono
                          }}
                        >
                          📦 Sourcer sur CJ Dropshipping
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
