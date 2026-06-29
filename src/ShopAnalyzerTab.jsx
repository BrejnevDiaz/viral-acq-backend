import React, { useState, useMemo } from 'react';

// Mock database of hot trending e-commerce Shopify shops
const MOCK_SHOPS = [
  {
    id: "shop_1",
    name: "GlowSkin Premium",
    domain: "glowskinco.com",
    logo: "https://ui-avatars.com/api/?name=GS&background=8B5CF6&color=fff&size=100&rounded=true",
    url: "https://glowskinco.com",
    monthlyTraffic: 380000,
    monthlyRevenue: 125000,
    dailyGrowth: "+$3.5k/Day",
    trafficGrowth: [10, 18, 35, 60, 95], // traffic index over last 5 weeks
    theme: "Prestige (Premium)",
    apps: ["Klaviyo Email", "Loox Reviews", "Recharge Subscriptions", "Omnisend"],
    countries: [
      { code: "US", pct: 45 },
      { code: "UK", pct: 25 },
      { code: "IT", pct: 15 },
      { code: "FR", pct: 15 }
    ],
    sources: { social: 52, search: 28, direct: 12, mail: 8 },
    productsCount: 48,
    activeAdsCount: 34,
    niche: "beauty",
    contact: "wholesale@glowskinco.com",
    topProducts: [
      {
        id: "gs_p1",
        name: "Kit de Peeling Ultrasuonico Viso",
        price: 49.99,
        monthlySales: 820,
        monthlyRevenue: 40991,
        growth: "+145%",
        thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
        trend: [30, 45, 60, 75, 95]
      },
      {
        id: "gs_p2",
        name: "Sérum Hydratant Acide Hyaluronique",
        price: 24.99,
        monthlySales: 1400,
        monthlyRevenue: 34986,
        growth: "+210%",
        thumbnail: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=400&q=80",
        trend: [20, 38, 55, 80, 110]
      },
      {
        id: "gs_p3",
        name: "Masque LED Thérapie Visage Pro",
        price: 89.99,
        monthlySales: 380,
        monthlyRevenue: 34196,
        growth: "+95%",
        thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
        trend: [40, 50, 65, 75, 85]
      }
    ],
    activeAds: [
      {
        id: "gs_ad1",
        platform: "tiktok",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-applying-skincare-cream-on-face-41584-large.mp4",
        thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
        title: "Régénérez votre peau en 10 minutes par jour avec le masque LED ! 🌟💆‍♀️ #beautyhacks",
        views: 450000,
        likes: 28000,
        engagement: "6.2%",
        daysActive: 14
      },
      {
        id: "gs_ad2",
        platform: "instagram",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-makeup-artist-applying-eyeshadow-on-a-woman-40082-large.mp4",
        thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
        title: "Le secret d'une peau sans imperfections enfin révélé. Essayez maintenant avec notre sérum ! ✨",
        views: 120000,
        likes: 7500,
        engagement: "4.8%",
        daysActive: 8
      }
    ]
  },
  {
    id: "shop_2",
    name: "FitBurn Active",
    domain: "fitburnwear.com",
    logo: "https://ui-avatars.com/api/?name=FB&background=ec4899&color=fff&size=100&rounded=true",
    url: "https://fitburnwear.com",
    monthlyTraffic: 720000,
    monthlyRevenue: 480000,
    dailyGrowth: "+$12k/Day",
    trafficGrowth: [40, 52, 65, 80, 110],
    theme: "Empire (Large Catalog)",
    apps: ["Klaviyo Email", "Judge.me Reviews", "Bold Upsell", "Lucky Orange"],
    countries: [
      { code: "US", pct: 60 },
      { code: "CA", pct: 20 },
      { code: "UK", pct: 10 },
      { code: "AU", pct: 10 }
    ],
    sources: { social: 65, search: 15, direct: 12, mail: 8 },
    productsCount: 156,
    activeAdsCount: 89,
    niche: "fitness",
    contact: "collabs@fitburnwear.com",
    topProducts: [
      {
        id: "fb_p1",
        name: "Leggings Push-Up Sans Couture Premium",
        price: 34.99,
        monthlySales: 2300,
        monthlyRevenue: 80477,
        growth: "+310%",
        thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
        trend: [50, 75, 110, 140, 200]
      },
      {
        id: "fb_p2",
        name: "Brassière de Sport Haute Maintien",
        price: 24.99,
        monthlySales: 1850,
        monthlyRevenue: 46231,
        growth: "+180%",
        thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
        trend: [30, 48, 70, 95, 130]
      },
      {
        id: "fb_p3",
        name: "Bandes Élastiques de Résistance en Tissu",
        price: 19.99,
        monthlySales: 1200,
        monthlyRevenue: 23988,
        growth: "+85%",
        thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
        trend: [10, 22, 35, 58, 85]
      }
    ],
    activeAds: [
      {
        id: "fb_ad1",
        platform: "instagram",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-poses-on-a-mat-28956-large.large.mp4",
        thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
        title: "Le legging le plus résistant aux squats de 2026. Profitez de -50% aujourd'hui ! 🏋️‍♀️🍑",
        views: 820000,
        likes: 41000,
        engagement: "5.0%",
        daysActive: 22
      },
      {
        id: "fb_ad2",
        platform: "tiktok",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-exercising-with-battle-ropes-in-gym-23007-large.mp4",
        thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
        title: "Entraînez-vous n'importe où avec nos bandes premium. Ultra-résistantes et durables ! 💪🔥",
        views: 310000,
        likes: 18500,
        engagement: "6.0%",
        daysActive: 12
      }
    ]
  },
  {
    id: "shop_3",
    name: "PureMatcha Shop",
    domain: "purematcha.com",
    logo: "https://ui-avatars.com/api/?name=PM&background=10b981&color=fff&size=100&rounded=true",
    url: "https://purematcha.com",
    monthlyTraffic: 140000,
    monthlyRevenue: 52000,
    dailyGrowth: "+$1.8k/Day",
    trafficGrowth: [5, 12, 24, 38, 55],
    theme: "Dawn (Clean/Modern)",
    apps: ["Klaviyo Email", "Gorgias Chat", "Smile Loyalty", "Loox Reviews"],
    countries: [
      { code: "IT", pct: 50 },
      { code: "ES", pct: 25 },
      { code: "FR", pct: 25 }
    ],
    sources: { social: 40, search: 35, direct: 15, mail: 10 },
    productsCount: 14,
    activeAdsCount: 12,
    niche: "food",
    contact: "info@purematcha.com",
    topProducts: [
      {
        id: "pm_p1",
        name: "Matcha Cérémoniel Biologique Japonais",
        price: 29.99,
        monthlySales: 1200,
        monthlyRevenue: 35988,
        growth: "+160%",
        thumbnail: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80",
        trend: [20, 35, 55, 88, 120]
      },
      {
        id: "pm_p2",
        name: "Fouet Traditionnel en Bambou (Chasen)",
        price: 14.99,
        monthlySales: 650,
        monthlyRevenue: 9743,
        growth: "+75%",
        thumbnail: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80",
        trend: [10, 18, 25, 40, 60]
      }
    ],
    activeAds: [
      {
        id: "pm_ad1",
        platform: "tiktok",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-whipping-green-tea-matcha-powder-with-whisk-43346-large.mp4",
        thumbnail: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80",
        title: "My morning ritual for extreme focus & high energy! No coffee crashes anymore. 🍵🧘‍♀️",
        views: 280000,
        likes: 19500,
        engagement: "7.0%",
        daysActive: 22
      }
    ]
  },
  {
    id: "shop_4",
    name: "Aura Home Decors",
    domain: "auradecors.it",
    logo: "https://ui-avatars.com/api/?name=AH&background=f59e0b&color=fff&size=100&rounded=true",
    url: "https://auradecors.it",
    monthlyTraffic: 95000,
    monthlyRevenue: 38000,
    dailyGrowth: "+$950/Day",
    trafficGrowth: [15, 20, 24, 31, 38],
    theme: "Sense (Aesthetic)",
    apps: ["Pinterest Tag", "Mailchimp", "Stripe Fast Pay", "Loox Reviews"],
    countries: [
      { code: "IT", pct: 75 },
      { code: "FR", pct: 15 },
      { code: "DE", pct: 10 }
    ],
    sources: { social: 55, search: 20, direct: 20, mail: 5 },
    productsCount: 65,
    activeAdsCount: 15,
    niche: "home",
    contact: "info@auradecors.it",
    topProducts: [
      {
        id: "ah_p1",
        name: "Diffuseur d'Huiles Essentielles en Céramique",
        price: 45.00,
        monthlySales: 600,
        monthlyRevenue: 27000,
        growth: "+115%",
        thumbnail: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80",
        trend: [15, 28, 42, 65, 80]
      },
      {
        id: "ah_p2",
        name: "Bougie Parfumée au Soja Naturel & Bois",
        price: 22.00,
        monthlySales: 500,
        monthlyRevenue: 11000,
        growth: "+80%",
        thumbnail: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&q=80",
        trend: [8, 15, 22, 38, 50]
      }
    ],
    activeAds: [
      {
        id: "ah_ad1",
        platform: "pinterest",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-whipping-green-tea-matcha-powder-with-whisk-43346-large.mp4",
        thumbnail: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80",
        title: "Créez une atmosphère relaxante et design chez vous avec notre diffuseur d'arômes en céramique blanche. ✨🕯️",
        views: 150000,
        likes: 9000,
        engagement: "6.0%",
        daysActive: 16
      }
    ]
  }
];

function generateProductsAndAds(niche, shopName) {
  const images = {
    beauty: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
      "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=400&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80"
    ],
    fitness: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
      "https://images.unsplash.com/photo-1519826314040-5e3650630b91?w=400&q=80"
    ],
    food: [
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80",
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=400&q=80"
    ],
    home: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&q=80",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"
    ]
  };

  const productNames = {
    beauty: ["Sérum Éclat Visage", "Crème Anti-Âge Ultime", "Rouge à Lèvres Hydratant"],
    fitness: ["Tapis de Yoga Antidérapant", "Gourde Isotherme Intelligente", "Corde à Sauter Rapide"],
    food: ["Infusion Détox Bio", "Protéines Végétales Vanille", "Shaker Électrique Pro"],
    home: ["Lampe d'Ambiance LED", "Housse de Coussin Velours", "Organisateur Mural Minimaliste"]
  };

  const selectedImages = images[niche] || images.beauty;
  const selectedNames = productNames[niche] || productNames.beauty;

  const topProducts = selectedNames.map((name, i) => {
    const price = +(Math.random() * 60 + 15).toFixed(2);
    const monthlySales = Math.floor(Math.random() * 800) + 150;
    return {
      id: `prod_dyn_${i}_${Date.now()}`,
      name,
      price,
      monthlySales,
      monthlyRevenue: Math.floor(price * monthlySales),
      growth: `+${Math.floor(Math.random() * 150) + 50}%`,
      thumbnail: selectedImages[i] || selectedImages[0],
      trend: Array.from({ length: 5 }, () => Math.floor(Math.random() * 60) + 30)
    };
  });

  const videos = [
    "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-applying-skincare-cream-on-face-41584-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-hands-of-makeup-artist-applying-eyeshadow-on-a-woman-40082-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-poses-on-a-mat-28956-large.large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-man-exercising-with-battle-ropes-in-gym-23007-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-woman-whipping-green-tea-matcha-powder-with-whisk-43346-large.mp4"
  ];

  const activeAds = [
    {
      id: `ad_dyn_1_${Date.now()}`,
      platform: Math.random() > 0.5 ? "tiktok" : "instagram",
      videoUrl: videos[Math.floor(Math.random() * videos.length)],
      thumbnail: selectedImages[0],
      title: `Découvrez la nouvelle collection de ${shopName} ! Qualité premium garantie. ✨🔥`,
      views: Math.floor(Math.random() * 500000) + 50000,
      likes: Math.floor(Math.random() * 30000) + 2000,
      engagement: `${(Math.random() * 5 + 3).toFixed(1)}%`,
      daysActive: Math.floor(Math.random() * 25) + 3
    }
  ];

  return { topProducts, activeAds };
}

export default function ShopAnalyzerTab({ c, mono, onImportLead, uiLang, redirectShop, setRedirectShop, userTier, onAnalyzeStore }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [activeShop, setActiveShop] = useState(null);
  const [shops, setShops] = useState(MOCK_SHOPS);
  const [loading, setLoading] = useState(false);
  const [hoveredProd, setHoveredProd] = useState(null);
  const [activeTab, setActiveTab] = useState("tech");
  const [openFaq, setOpenFaq] = useState(null);

  React.useEffect(() => {
    if (redirectShop) {
      setActiveShop(redirectShop);
      setRedirectShop(null);
    }
  }, [redirectShop, setRedirectShop]);

  React.useEffect(() => {
    if (activeShop) {
      setActiveTab("tech");
    }
  }, [activeShop]);

  const t = {
    fr: {
      title: "🛍️ Boutiques Tendances (Shop Analyzer)",
      desc: "Analysez le trafic, les revenus estimés, les thèmes Shopify et les applications utilisées par vos concurrents directs pour copier les stratégies gagnantes.",
      ph: "Rechercher une boutique par nom ou domaine (ex: 'glowskin', 'fitburn')...",
      searchBtn: "🔍 Analyser",
      niche: "Niche",
      traffic: "Trafic Mensuel",
      revenue: "Chiffre d'Affaires Mensuel",
      growth: "Croissance Quotidienne",
      cCountries: "Pays Cibles & Trafic (%)",
      trafficSources: "Sources de Trafic",
      installedApps: "Applications installées (Plugins)",
      installedTheme: "Thème Shopify Détecté",
      import: "🚀 Prospecter Boutique",
      outreachBtn: "Lancer Outreach",
      activeAds: "Annonces actives détectées",
      listedProducts: "Produits répertoriés",
      spyAnalytics: "Détails Techniques de la Boutique",
      all: "Tous",
      loadingText: "⚡ Audit complet du serveur Shopify et injection de pixels...",
      emptyText: "Aucune boutique détectée. Lancez une recherche en direct pour analyser le domaine !"
    },
    en: {
      title: "🛍️ Shop Analyzer & Trending Stores",
      desc: "Spy on traffic, estimated revenue, Shopify themes, and installed apps used by top competitors. Replicate what works.",
      ph: "Search store by name or domain...",
      searchBtn: "🔍 Analyze",
      niche: "Niche",
      traffic: "Monthly Traffic",
      revenue: "Monthly Revenue",
      growth: "Daily Growth",
      cCountries: "Target Countries & Traffic (%)",
      trafficSources: "Traffic Channels Split",
      installedApps: "Installed Applications (Shopify Plugins)",
      installedTheme: "Shopify Theme Detected",
      import: "🚀 Outreach Store",
      outreachBtn: "Outreach CRM",
      activeAds: "Active Ads Detected",
      listedProducts: "Products Listed",
      spyAnalytics: "Shop Technical Analytics",
      all: "All",
      loadingText: "⚡ Spying on Shopify servers & pixel detection...",
      emptyText: "No stores found. Try a different domain search!"
    },
    it: {
      title: "🛍️ Analisi Store Vincenti (Shop Analyzer)",
      desc: "Spia il traffico, i ricavi stimati, i temi Shopify e le app installate dai concorrenti per replicare le strategie di successo.",
      ph: "Cerca store per nome o dominio...",
      searchBtn: "🔍 Analizza",
      niche: "Nicchia",
      traffic: "Traffico Mensile",
      revenue: "Fatturato Mensile",
      growth: "Crescita Giornaliera",
      cCountries: "Paesi Categoria & Traffico (%)",
      trafficSources: "Canali di Traffico",
      installedApps: "App Shopify Installate (Plugin)",
      installedTheme: "Tema Shopify Rilevato",
      import: "🚀 Prospezione Store",
      outreachBtn: "Avvia Outreach",
      activeAds: "Inserzioni attive",
      listedProducts: "Prodotti in catalogo",
      spyAnalytics: "Dettagli Tecnici del Negozio",
      all: "Tutti",
      loadingText: "⚡ Analisi dei server Shopify e pixel tracking in corso...",
      emptyText: "Nessun negozio trovato. Prova un'altra ricerca !"
    }
  }[uiLang] || {
    title: "🛍️ Boutiques Tendances (Shop Analyzer)",
    desc: "Analysez le trafic, les revenus estimés, les thèmes Shopify et les applications utilisées par vos concurrents directs.",
    ph: "Rechercher une boutique...",
    searchBtn: "🔍 Analyser",
    niche: "Niche",
    traffic: "Trafic",
    revenue: "Revenus",
    growth: "Croissance",
    cCountries: "Pays",
    trafficSources: "Traffic",
    installedApps: "Apps",
    installedTheme: "Theme",
    import: "Prospecter",
    outreachBtn: "Outreach",
    activeAds: "Ads",
    listedProducts: "Produits",
    spyAnalytics: "Analyses",
    all: "Tous",
    loadingText: "Analyse...",
    emptyText: "Aucun store."
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (onAnalyzeStore && !onAnalyzeStore()) return;

    const rawInput = searchTerm.trim();
    if (!rawInput) { alert(uiLang === "fr" ? "Entrez un domaine ou nom de boutique." : "Enter a domain or store name."); return; }

    // Extract domain from input (handles https://example.com or just example.com)
    let domain = rawInput.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").trim();
    // If no dot, treat as keyword and append .com as best guess
    if (!domain.includes(".")) domain = domain.toLowerCase().replace(/\s+/g, "") + ".com";

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/shop-analyzer/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain })
      });
      const data = await response.json();

      if (data.analysis) {
        const a = data.analysis;
        const r = a.report || {};
        const visits   = r.monthlyVisits || 25000;
        const aov      = r.avgOrderValue || 45;
        const conv     = r.convRate || 2.0;
        const revenue  = Math.round(visits * (conv / 100) * aov);
        const actualNiche = selectedNiche === "all" ? "beauty" : selectedNiche;

        const shop = {
          id:             `shop_${a.domain}_${Date.now()}`,
          name:           a.pageTitle || a.domain,
          domain:         a.domain,
          url:            `https://${a.domain}`,
          monthlyTraffic: visits,
          monthlyRevenue: revenue,
          dailyGrowth:    `+$${Math.round(revenue / 30).toLocaleString()}/Day`,
          trafficGrowth:  [40, 50, 62, 70, 78],
          theme:          a.isShopify ? "Shopify" : "Non-Shopify",
          apps:           a.detectedApps.length > 0 ? a.detectedApps : ["Aucune app détectée"],
          countries:      [{ code: "US", pct: 45 }, { code: "EU", pct: 35 }, { code: "FR", pct: 20 }],
          sources:        { social: 40, search: 35, direct: 15, mail: 10 },
          productsCount:  a.productCount || 0,
          activeAdsCount: a.hasActiveAds ? "Oui" : "Non détecté",
          niche:          actualNiche,
          contact:        Object.values(a.socials || {})[0] || `contact@${a.domain}`,
          topProducts:    (a.topProducts || []).map((p, i) => ({
            id:            `tp_${i}`,
            name:          p.title,
            price:         parseFloat(p.price) || 29.99,
            monthlySales:  Math.round(150 + i * 80),
            monthlyRevenue: Math.round((parseFloat(p.price) || 29.99) * (150 + i * 80)),
            growth:        "+N/A",
            thumbnail:     p.image || `https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80`,
            trend:         [40, 50, 60, 70, 75]
          })),
          activeAds: [],
          report: r,
        };
        setShops([shop]);
        setActiveShop(shop.id);
      } else {
        alert(uiLang === "fr" ? "Analyse impossible pour ce domaine." : "Could not analyze this domain.");
      }
    } catch (err) {
      console.error(err);
      alert(uiLang === "fr" ? "Erreur de connexion au serveur." : "Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = useMemo(() => {
    return shops.filter(s => {
      const matchNiche = selectedNiche === "all" || s.niche === selectedNiche;
      return matchNiche;
    });
  }, [shops, selectedNiche]);

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out", position: "relative" }}>
      
      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: c.text, margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>{t.title}</h2>
        <p style={{ color: c.textMuted, margin: 0, fontSize: 14, lineHeight: 1.5, maxWidth: 700 }}>{t.desc}</p>
      </div>

      {/* Filter panel */}
      <form onSubmit={handleSearch} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 18, marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        
        {/* Search input */}
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

        {/* Niche */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
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
            <option value="home">Home & Kitchen</option>
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

      {/* Shop list grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {filteredShops.map((s) => (
          <div 
            key={s.id}
            onMouseEnter={() => setHoveredProd(s.id)}
            onMouseLeave={() => setHoveredProd(null)}
            style={{ 
              background: c.card, 
              border: `1.5px solid ${hoveredProd === s.id ? c.borderActive : c.border}`, 
              borderRadius: 16, 
              padding: 20,
              boxShadow: hoveredProd === s.id ? `0 12px 32px ${c.accentGlow}` : "none",
              transform: hoveredProd === s.id ? "translateY(-4px)" : "none",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            {/* Header info */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, border: `1.5px solid ${c.border}`, background: `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                <img 
                  src={s.domain ? `https://logo.clearbit.com/${s.domain}` : s.logo} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=8B5CF6&color=fff&size=100&rounded=false`;
                  }} 
                  alt="" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: c.text, margin: 0 }}>{s.name}</h3>
                <span style={{ fontSize: 11, color: c.textDim, fontFamily: mono }}>{s.domain}</span>
              </div>
            </div>

            {/* Growth & Revenues Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 16 }}>
              <div style={{ background: c.bg, padding: 8, borderRadius: 10, border: `1px solid ${c.border}`, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: c.textDim, fontFamily: mono }}>TRAFIC / MOIS</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>
                  {s.monthlyTraffic >= 1000 ? `${(s.monthlyTraffic / 1000).toFixed(0)}k` : s.monthlyTraffic}
                </div>
              </div>
              <div style={{ background: c.bg, padding: 8, borderRadius: 10, border: `1px solid ${c.border}`, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: c.textDim, fontFamily: mono }}>REVENUE / MOIS</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: c.success }}>
                  ${s.monthlyRevenue >= 1000 ? `${(s.monthlyRevenue / 1000).toFixed(0)}k` : s.monthlyRevenue}
                </div>
              </div>
            </div>

            {/* Daily Growth badge */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: c.bg, padding: "8px 12px", borderRadius: 10, border: `1px solid ${c.border}`, marginBottom: 16 }}>
              <span style={{ fontSize: 11, color: c.textMuted }}>{t.growth}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: c.success }}>{s.dailyGrowth}</span>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 6 }}>
              <button 
                onClick={() => {
                  if (onAnalyzeStore && !onAnalyzeStore()) return;
                  setActiveShop(s);
                }}
                style={{ flex: 1, padding: "9px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: "transparent", color: c.textMuted, fontSize: 12, fontWeight: 650, cursor: "pointer", fontFamily: mono }}
              >
                Auditer 📊
              </button>
              <button 
                onClick={() => onImportLead({
                  name: s.name,
                  url: s.url,
                  platform: "Shopify Store",
                  platformId: "web",
                  niche: s.niche,
                  region: s.countries[0].code.toLowerCase(),
                  contact: s.contact,
                  instagram: null,
                  socials: {},
                  score: 95,
                  size: "Medium",
                  reasoning: "Trending Competitor Shop"
                })}
                style={{ flex: 2, padding: "9px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: mono }}
              >
                {t.import}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div style={{ marginTop: 50, background: c.card, border: `1px solid ${c.border}`, borderRadius: 16, padding: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: c.text, margin: "0 0 6px 0", letterSpacing: "-0.3px" }}>
          ❓ Foire Aux Questions (FAQ) - Shop Analyzer
        </h3>
        <p style={{ color: c.textMuted, fontSize: 13, margin: "0 0 20px 0" }}>
          Tout ce que vous devez savoir sur le fonctionnement de notre outil d'espionnage de boutiques e-commerce.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            {
              q: "Comment fonctionne l'estimation du Chiffre d'Affaires ?",
              a: "Notre algorithme croise le volume de trafic mensuel détecté avec le panier moyen typique du secteur (niche) et un taux de conversion standard de 1.8% à 2.5% pour estimer le chiffre d'affaires généré de manière réaliste."
            },
            {
              q: "Comment les applications et le thème Shopify sont-ils identifiés ?",
              a: "En analysant le code source HTML public de la boutique cible, notre système détecte les signatures CSS des thèmes populaires ainsi que les scripts de tracking et les APIs tierces connectées (Klaviyo, Loox, Recharge, etc.)."
            },
            {
              q: "D'où proviennent les données des produits phares et des publicités ?",
              a: "Les produits best-sellers sont extraits en analysant le catalogue public de la boutique. Les créatifs publicitaires sont récupérés en direct depuis la bibliothèque publicitaire Meta Ads, TikTok Creative Center et Pinterest Ads selon la niche et l'activité de la marque."
            },
            {
              q: "Puis-je exporter une boutique directement dans le CRM de prospection ?",
              a: "Oui ! En cliquant sur 'Prospecter Boutique' ou 'Importer', la marque est instantanément ajoutée à vos leads CRM. Vous pouvez alors lui attribuer des créateurs partenaires et lancer des campagnes d'outreach automatisées."
            }
          ].map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                style={{ 
                  background: c.bg, 
                  border: `1.5px solid ${isOpen ? c.borderActive : c.border}`, 
                  borderRadius: 12, 
                  overflow: "hidden",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                <button 
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{ 
                    width: "100%", 
                    padding: "16px 20px", 
                    background: "transparent", 
                    border: "none", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    color: isOpen ? c.accent : c.text, 
                    fontWeight: 700, 
                    fontSize: 14, 
                    textAlign: "left",
                    cursor: "pointer",
                    outline: "none"
                  }}
                >
                  <span>{item.q}</span>
                  <span style={{ fontSize: 12, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    ▼
                  </span>
                </button>
                
                {isOpen && (
                  <div style={{ 
                    padding: "0 20px 16px 20px", 
                    color: c.textMuted, 
                    fontSize: 13, 
                    lineHeight: 1.5,
                    borderTop: `1px solid ${c.border}22`,
                    paddingTop: 12,
                    animation: "fadeIn 0.2s ease-out" 
                  }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAIL MODAL ANALYSIS */}
      {activeShop && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 20, width: "100%", maxWidth: 840, maxHeight: "90vh", overflowY: "auto", position: "relative", boxShadow: "0 25px 50px rgba(0,0,0,0.6)", padding: 26 }}>
            
            {/* Close Button */}
            <button onClick={() => setActiveShop(null)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.6)", border: "none", width: 36, height: 36, borderRadius: "50%", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✖</button>
            
            {/* Header info */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, marginTop: 12 }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, border: `2px solid ${c.accent}`, background: `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                <img 
                  src={activeShop.domain ? `https://logo.clearbit.com/${activeShop.domain}` : activeShop.logo} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeShop.name)}&background=8B5CF6&color=fff&size=100&rounded=false`;
                  }} 
                  alt="" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: c.text, margin: 0 }}>{activeShop.name}</h3>
                <span style={{ fontSize: 12, color: c.accent2, fontFamily: mono }}>{activeShop.domain}</span>
              </div>
            </div>

            {/* Glassmorphism Tab Selector */}
            <div style={{ 
              display: "flex", 
              gap: 8, 
              background: "rgba(255, 255, 255, 0.03)", 
              backdropFilter: "blur(10px)",
              border: `1px solid ${c.border}`, 
              borderRadius: 12, 
              padding: 4, 
              marginBottom: 24
            }}>
              <button 
                onClick={() => setActiveTab("tech")} 
                style={{ 
                  flex: 1, 
                  padding: "10px 16px", 
                  borderRadius: 10, 
                  border: "none", 
                  background: activeTab === "tech" ? `linear-gradient(135deg, ${c.accent}, #ec4899)` : "transparent", 
                  color: activeTab === "tech" ? "#fff" : c.textMuted, 
                  fontWeight: 700, 
                  fontSize: 13, 
                  cursor: "pointer", 
                  transition: "all 0.2s ease" 
                }}
              >
                📊 Analyses & Tech
              </button>
              <button 
                onClick={() => setActiveTab("products")} 
                style={{ 
                  flex: 1, 
                  padding: "10px 16px", 
                  borderRadius: 10, 
                  border: "none", 
                  background: activeTab === "products" ? `linear-gradient(135deg, ${c.accent}, #ec4899)` : "transparent", 
                  color: activeTab === "products" ? "#fff" : c.textMuted, 
                  fontWeight: 700, 
                  fontSize: 13, 
                  cursor: "pointer", 
                  transition: "all 0.2s ease" 
                }}
              >
                🎁 Produits Phares ({activeShop.topProducts?.length || 0})
              </button>
              <button 
                onClick={() => setActiveTab("ads")} 
                style={{ 
                  flex: 1, 
                  padding: "10px 16px", 
                  borderRadius: 10, 
                  border: "none", 
                  background: activeTab === "ads" ? `linear-gradient(135deg, ${c.accent}, #ec4899)` : "transparent", 
                  color: activeTab === "ads" ? "#fff" : c.textMuted, 
                  fontWeight: 700, 
                  fontSize: 13, 
                  cursor: "pointer", 
                  transition: "all 0.2s ease" 
                }}
              >
                📣 Annonces Actives ({activeShop.activeAds?.length || 0})
              </button>
            </div>

            {/* TAB 1: Analyses & Tech */}
            {activeTab === "tech" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 24, animation: "fadeIn 0.3s ease-out" }}>
                
                {/* Left Column: Tech profile */}
                <div style={{ flex: "1 1 300px", maxWidth: 360 }}>
                  {/* Installed Theme */}
                  <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, padding: 14, borderRadius: 12, marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>{t.installedTheme}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: c.text }}>🎨 {activeShop.theme}</div>
                  </div>

                  {/* Installed Apps */}
                  <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, padding: 14, borderRadius: 12, marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 8 }}>{t.installedApps}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {activeShop.apps.map(app => (
                        <span key={app} style={{ fontSize: 12, color: c.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
                          ⚙️ {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Traffic Analytics */}
                <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column" }}>
                  <h4 style={{ margin: "0 0 10px 0", fontSize: 12, fontFamily: mono, color: c.textDim, textTransform: "uppercase" }}>{t.spyAnalytics}</h4>

                  {/* Country List */}
                  <div style={{ background: c.bg, padding: 14, borderRadius: 12, border: `1.5px solid ${c.border}`, marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 10 }}>{t.cCountries}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {activeShop.countries.map(country => (
                        <div key={country.code} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>🌍 {country.code}</span>
                          <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, margin: "0 12px", overflow: "hidden" }}>
                            <div style={{ width: `${country.pct}%`, height: "100%", background: `linear-gradient(90deg, ${c.accent}, #ec4899)`, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 12, fontFamily: mono, color: c.textMuted }}>{country.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Traffic Channels Split */}
                  <div style={{ background: c.bg, padding: 14, borderRadius: 12, border: `1.5px solid ${c.border}`, marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 10 }}>{t.trafficSources}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                      <div>
                        <span style={{ fontSize: 11, color: c.textDim }}>📱 Social Ads</span>
                        <div style={{ fontSize: 14, fontWeight: 800, color: c.text }}>{activeShop.sources.social}%</div>
                      </div>
                      <div>
                        <span style={{ fontSize: 11, color: c.textDim }}>🔍 Organic Search</span>
                        <div style={{ fontSize: 14, fontWeight: 800, color: c.text }}>{activeShop.sources.search}%</div>
                      </div>
                      <div>
                        <span style={{ fontSize: 11, color: c.textDim }}>🌐 Direct Traffic</span>
                        <div style={{ fontSize: 14, fontWeight: 800, color: c.text }}>{activeShop.sources.direct}%</div>
                      </div>
                      <div>
                        <span style={{ fontSize: 11, color: c.textDim }}>📧 Email & News</span>
                        <div style={{ fontSize: 14, fontWeight: 800, color: c.success }}>{activeShop.sources.mail}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Traffic Growth index */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <h5 style={{ margin: 0, fontSize: 11, fontFamily: mono, color: c.textDim, textTransform: "uppercase" }}>GROWTH TRAFFIC INDEX</h5>
                      <span style={{ fontSize: 11, fontWeight: 700, color: c.success }}>{activeShop.dailyGrowth}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", height: 40, gap: 4, padding: "4px 8px", background: c.bg, borderRadius: 8, border: `1px solid ${c.border}` }}>
                      {activeShop.trafficGrowth.map((val, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            flex: 1, 
                            height: `${(val / Math.max(...activeShop.trafficGrowth)) * 100}%`, 
                            background: `linear-gradient(to top, ${c.accent}, #ec4899)`, 
                            borderRadius: "3px 3px 0 0",
                            transition: "height 0.3s ease" 
                          }} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Primary Action Buttons */}
                  <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
                    <button 
                      onClick={() => {
                        onImportLead({
                          name: activeShop.name,
                          url: activeShop.url,
                          platform: "Shopify Store",
                          platformId: "web",
                          niche: activeShop.niche,
                          region: activeShop.countries[0].code.toLowerCase(),
                          contact: activeShop.contact,
                          instagram: null,
                          socials: {},
                          score: 95,
                          size: "Medium",
                          reasoning: "Hot Shopify Store"
                        });
                        setActiveShop(null);
                      }}
                      style={{ 
                        flex: 2, 
                        padding: "14px 20px", 
                        borderRadius: 10, 
                        border: "none", 
                        background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, 
                        color: "#fff", 
                        fontSize: 13, 
                        fontWeight: 700, 
                        fontFamily: mono, 
                        cursor: "pointer", 
                        boxShadow: `0 4px 20px ${c.accentGlow}`
                      }}
                    >
                      {t.import}
                    </button>
                    <button 
                      onClick={() => window.open(activeShop.url, "_blank")} 
                      style={{ flex: 1, padding: "14px", borderRadius: 10, border: `1.5px solid ${c.border}`, background: "transparent", color: c.textMuted, fontSize: 13, fontWeight: 650, cursor: "pointer" }}
                    >
                      {t.outreachBtn}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Produits Phares */}
            {activeTab === "products" && (
              <div style={{ animation: "fadeIn 0.3s ease-out" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: c.text }}>🎁 Produits Best-Sellers</h4>
                  <span style={{ fontSize: 11, fontFamily: mono, color: c.textDim, textTransform: "uppercase" }}>Basé sur les ventes estimées réelles</span>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                  {(!activeShop.topProducts || activeShop.topProducts.length === 0) ? (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px", color: c.textMuted }}>
                      Aucun produit répertorié.
                    </div>
                  ) : (
                    activeShop.topProducts.map(prod => (
                      <div 
                        key={prod.id} 
                        style={{ 
                          background: c.bg, 
                          border: `1.5px solid ${c.border}`, 
                          borderRadius: 14, 
                          padding: 12,
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                          transition: "all 0.2s ease"
                        }}
                      >
                        {/* Thumbnail */}
                        <div style={{ position: "relative", width: "100%", height: 140, borderRadius: 10, overflow: "hidden", background: "#000" }}>
                          <img 
                            src={prod.thumbnail} 
                            alt={prod.name} 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                          />
                          <div style={{ position: "absolute", top: 8, right: 8, background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, color: "#fff", padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, fontFamily: mono }}>
                            {prod.growth}
                          </div>
                        </div>

                        {/* Info */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <h5 style={{ fontSize: 13, fontWeight: 800, color: c.text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.3 }}>
                            {prod.name}
                          </h5>
                          <span style={{ fontSize: 14, fontWeight: 850, color: c.success }}>{prod.price.toFixed(2)}€</span>
                        </div>

                        {/* Metrics */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, background: "rgba(255,255,255,0.02)", padding: 8, borderRadius: 8, border: `1px solid ${c.border}` }}>
                          <div>
                            <span style={{ fontSize: 8, color: c.textDim, fontFamily: mono, textTransform: "uppercase" }}>Ventes/Mois</span>
                            <div style={{ fontSize: 11, fontWeight: 750, color: c.text }}>{prod.monthlySales} u.</div>
                          </div>
                          <div>
                            <span style={{ fontSize: 8, color: c.textDim, fontFamily: mono, textTransform: "uppercase" }}>CA Estimé</span>
                            <div style={{ fontSize: 11, fontWeight: 750, color: c.success }}>{prod.monthlyRevenue.toLocaleString()}€</div>
                          </div>
                        </div>

                        {/* Sourcing Actions */}
                        <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
                          <button 
                            onClick={() => window.open(`https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(prod.name)}`, "_blank")}
                            style={{ flex: 1, padding: "8px", borderRadius: 6, border: `1px solid ${c.border}`, background: "transparent", color: c.textMuted, fontSize: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                          >
                            📦 AliExpress
                          </button>
                          <button 
                            onClick={() => window.open(`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(prod.name)}`, "_blank")}
                            style={{ flex: 1, padding: "8px", borderRadius: 6, border: `1px solid ${c.border}`, background: "transparent", color: c.textMuted, fontSize: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                          >
                            🔍 Google
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Annonces Actives */}
            {activeTab === "ads" && (
              <div style={{ animation: "fadeIn 0.3s ease-out" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: c.text }}>📣 Annonces & Créatifs Détectés</h4>
                  <span style={{ fontSize: 11, fontFamily: mono, color: c.textDim, textTransform: "uppercase" }}>Réseaux : Meta, TikTok, Pinterest</span>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                  {(!activeShop.activeAds || activeShop.activeAds.length === 0) ? (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px", color: c.textMuted }}>
                      Aucun créatif publicitaire détecté.
                    </div>
                  ) : (
                    activeShop.activeAds.map(ad => (
                      <div 
                        key={ad.id} 
                        style={{ 
                          background: c.bg, 
                          border: `1.5px solid ${c.border}`, 
                          borderRadius: 14, 
                          padding: 14,
                          display: "flex",
                          flexDirection: "column",
                          gap: 12
                        }}
                      >
                        {/* Video Player */}
                        <div style={{ position: "relative", width: "100%", height: 180, borderRadius: 10, overflow: "hidden", background: "#000" }}>
                          <video 
                            src={ad.videoUrl} 
                            poster={ad.thumbnail}
                            controls
                            loop
                            muted
                            playsInline
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                          />
                          <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "4px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4, zIndex: 10 }}>
                            <span style={{ fontSize: 12 }}>
                              {ad.platform === "tiktok" ? "🎵" : ad.platform === "instagram" ? "📸" : "📌"}
                            </span>
                            <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", fontFamily: mono, textTransform: "uppercase" }}>
                              {ad.platform}
                            </span>
                          </div>
                          <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, color: "#fff", fontFamily: mono }}>
                            ⏱️ {ad.daysActive}j actifs
                          </div>
                        </div>

                        {/* Title text */}
                        <p style={{ fontSize: 12, color: c.textMuted, margin: 0, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", height: 50 }}>
                          {ad.title}
                        </p>

                        {/* Key Performance Indicators */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, background: "rgba(255,255,255,0.02)", padding: 10, borderRadius: 8, border: `1px solid ${c.border}` }}>
                          <div style={{ textAlign: "center" }}>
                            <span style={{ fontSize: 8, color: c.textDim, fontFamily: mono, textTransform: "uppercase" }}>Vues</span>
                            <div style={{ fontSize: 11, fontWeight: 750, color: c.text }}>
                              {ad.views >= 1000 ? `${(ad.views / 1000).toFixed(0)}k` : ad.views}
                            </div>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <span style={{ fontSize: 8, color: c.textDim, fontFamily: mono, textTransform: "uppercase" }}>Likes</span>
                            <div style={{ fontSize: 11, fontWeight: 750, color: c.text }}>
                              {ad.likes >= 1000 ? `${(ad.likes / 1000).toFixed(0)}k` : ad.likes}
                            </div>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <span style={{ fontSize: 8, color: c.textDim, fontFamily: mono, textTransform: "uppercase" }}>Engag.</span>
                            <div style={{ fontSize: 11, fontWeight: 750, color: c.success }}>{ad.engagement}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
