import React, { useState, useMemo } from 'react';

// Pre-loaded high-converting winning dropshipping products
const BASE_MOCK_PRODUCTS = [
  {
    id: "prod_1",
    name: "Spatola ad Ultrasuoni per Scrub Viso",
    niche: "beauty",
    source: "meta", // meta | tiktok_shop | amazon | ebay | etsy | pinterest
    thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
    url: "https://www.facebook.com/ads/library/?active_status=active&media_type=all&q=ultrasonic%20skin%20scrubber",
    price: 39.99,
    cogs: 9.50, // Cost of goods sold
    monthlyRevenue: 68500,
    monthlySales: 1710,
    growthRate: "+185%",
    description: "Spatola ad ultrasuoni per la pulizia profonda dei pori, rimozione dei punti neri e scrub viso. Prodotto best seller su Meta Ads.",
    countries: ["IT", "FR", "ES"],
    supplierUrl: "https://www.aliexpress.com/wholesale?SearchText=ultrasonic+skin+scrubber",
    trend: [40, 55, 70, 85, 100],
    relevance: 92,
    contact: "support@ultraglowskin.com"
  },
  {
    id: "prod_2",
    name: "Frullatore Portatile USB-C Ricaricabile",
    niche: "food",
    source: "tiktok_shop",
    thumbnail: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=400&q=80",
    url: "https://www.tiktok.com/market/discover?q=portable%20blender",
    price: 29.99,
    cogs: 6.80,
    monthlyRevenue: 94000,
    monthlySales: 3130,
    growthRate: "+240%",
    description: "Mini frullatore portatile ricaricabile per smoothie proteici e frullati di frutta in palestra o in ufficio. Trend virale su TikTok Shop.",
    countries: ["US", "UK", "IT"],
    supplierUrl: "https://www.aliexpress.com/wholesale?SearchText=portable+blender+usb+rechargeable",
    trend: [20, 45, 68, 88, 120],
    relevance: 95,
    contact: "collabs@blendgo.co"
  },
  {
    id: "prod_3",
    name: "Lampada di Ricarica Wireless Levitante",
    niche: "tech",
    source: "pinterest",
    thumbnail: "https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=400&q=80",
    url: "https://pinterest.com/search/pins/?q=levitating%20lamp",
    price: 79.99,
    cogs: 22.00,
    monthlyRevenue: 42000,
    monthlySales: 525,
    growthRate: "+98%",
    description: "Lampada di design a levitazione magnetica con caricatore wireless rapido per smartphone incorporato nella base. Altamente virale su Pinterest.",
    countries: ["DE", "IT", "UK"],
    supplierUrl: "https://www.aliexpress.com/wholesale?SearchText=levitating+magnetic+lamp+wireless+charger",
    trend: [30, 38, 55, 62, 75],
    relevance: 78,
    contact: "info@levitatelamps.com"
  },
  {
    id: "prod_4",
    name: "Massaggiatore Cervicale Intelligente TENS",
    niche: "fitness",
    source: "amazon",
    thumbnail: "https://images.unsplash.com/photo-1519826314040-5e3650630b91?w=400&q=80",
    url: "https://www.amazon.it/s?k=massaggiatore+cervicale+tens",
    price: 49.99,
    cogs: 11.20,
    monthlyRevenue: 125000,
    monthlySales: 2500,
    growthRate: "+155%",
    description: "Dispositivo di massaggio cervicale a impulsi elettromagnetici TENS. Ideale per alleviare lo stress e i dolori muscolari del collo.",
    countries: ["IT", "DE", "FR"],
    supplierUrl: "https://www.aliexpress.com/wholesale?SearchText=neck+massager+tens+smart",
    trend: [75, 80, 84, 91, 95],
    relevance: 82,
    contact: "b2b@neckrelax.it"
  },
  {
    id: "prod_5",
    name: "Organizzatore di Spezie Magnetico per Frigo",
    niche: "home",
    source: "etsy",
    thumbnail: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
    url: "https://www.etsy.com/search?q=magnetic%20spice%20rack",
    price: 24.99,
    cogs: 4.50,
    monthlyRevenue: 31000,
    monthlySales: 1240,
    growthRate: "+110%",
    description: "Mensola portaspezie magnetica ad alta tenuta da posizionare sul frigorifero o su superfici metalliche. Altissimo trend estetico Etsy.",
    countries: ["US", "IT", "FR"],
    supplierUrl: "https://www.aliexpress.com/wholesale?SearchText=magnetic+fridge+spice+organizer",
    trend: [10, 22, 40, 68, 80],
    relevance: 73,
    contact: "wholesale@ecokitchen.com"
  },
  {
    id: "prod_6",
    name: "Rullo di Pulizia Peli Lavabile ed Infinito",
    niche: "home",
    source: "ebay",
    thumbnail: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80",
    url: "https://www.ebay.it/sch/i.html?_nkw=sticky+lint+roller+washable",
    price: 19.99,
    cogs: 2.10,
    monthlyRevenue: 58000,
    monthlySales: 2900,
    growthRate: "+320%",
    description: "Rullo adesivo lavabile in silicone per rimuovere peli di animali e polvere dai vestiti. Si sciacqua con acqua calda ed è riutilizzabile all'infinito.",
    countries: ["IT", "ES", "EU"],
    supplierUrl: "https://www.aliexpress.com/wholesale?SearchText=sticky+silicone+washable+lint+roller",
    trend: [15, 38, 70, 110, 145],
    relevance: 85,
    contact: "suppliers@petclean.com"
  },
  {
    id: "prod_7",
    name: "Mini Proiettore Portatile HD Smart LED",
    niche: "tech",
    source: "amazon",
    thumbnail: "https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=400&q=80",
    url: "https://www.amazon.it/s?k=mini+proiettore+hd",
    price: 119.99,
    cogs: 35.00,
    monthlyRevenue: 154000,
    monthlySales: 1280,
    growthRate: "+165%",
    description: "Mini proiettore tascabile Smart LED con WiFi, altoparlanti e supporto 4K per serate cinema immersive ovunque.",
    countries: ["IT", "FR", "DE"],
    supplierUrl: "https://www.aliexpress.com/wholesale?SearchText=mini+projector+led+smart",
    trend: [40, 50, 68, 85, 110],
    relevance: 94,
    contact: "sales@lumiports.com"
  },
  {
    id: "prod_8",
    name: "Tappetino per Yoga in Sughero Naturale",
    niche: "fitness",
    source: "pinterest",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
    url: "https://pinterest.com/search/pins/?q=cork%20yoga%20mat",
    price: 45.00,
    cogs: 12.50,
    monthlyRevenue: 34000,
    monthlySales: 750,
    growthRate: "+120%",
    description: "Tappetino yoga ecologico in sughero naturale antiscivolo con linee guida di allineamento incise a laser.",
    countries: ["DE", "IT", "NL"],
    supplierUrl: "https://www.aliexpress.com/wholesale?SearchText=cork+natural+yoga+mat",
    trend: [10, 25, 45, 68, 85],
    relevance: 81,
    contact: "wholesale@corkyogi.com"
  },
  {
    id: "prod_9",
    name: "Diffusore di Aromi con Effetto Fiamma LED",
    niche: "home",
    source: "meta",
    thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
    url: "https://www.facebook.com/ads/library/?active_status=active&q=flame%20air%20diffuser",
    price: 34.99,
    cogs: 8.20,
    monthlyRevenue: 78000,
    monthlySales: 2230,
    growthRate: "+210%",
    description: "Umidificatore ultrasonico e diffusore di oli essenziali con luci LED che creano un effetto fiamma calda ultra-rilassante.",
    countries: ["IT", "ES", "FR"],
    supplierUrl: "https://www.aliexpress.com/wholesale?SearchText=ultrasonic+flame+air+diffuser",
    trend: [30, 48, 65, 82, 105],
    relevance: 89,
    contact: "support@flamediffusers.com"
  },
  {
    id: "prod_10",
    name: "Macchina per Espresso Portatile da Auto",
    niche: "food",
    source: "tiktok_shop",
    thumbnail: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=400&q=80",
    url: "https://www.tiktok.com/market/discover?q=portable%20espresso%20car",
    price: 59.99,
    cogs: 15.00,
    monthlyRevenue: 89000,
    monthlySales: 1480,
    growthRate: "+195%",
    description: "Macchinetta espresso elettrica da viaggio compatibile con capsule o polvere, ideale per auto e outdoor.",
    countries: ["IT", "UK", "DE"],
    supplierUrl: "https://www.aliexpress.com/wholesale?SearchText=portable+espresso+machine+car",
    trend: [15, 30, 52, 70, 95],
    relevance: 76,
    contact: "b2b@travelcoffee.co"
  },
  {
    id: "prod_11",
    name: "Kit di Sbiancamento Dentale Professionale",
    niche: "beauty",
    source: "meta",
    thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
    url: "https://www.facebook.com/ads/library/?active_status=active&q=teeth%20whitening%20kit",
    price: 49.99,
    cogs: 11.50,
    monthlyRevenue: 112000,
    monthlySales: 2240,
    growthRate: "+225%",
    description: "Kit sbiancante domiciliare con tecnologia LED acceleratrice blu e gel ipoallergenico a base naturale.",
    countries: ["US", "IT", "FR"],
    supplierUrl: "https://www.aliexpress.com/wholesale?SearchText=teeth+whitening+led+kit",
    trend: [50, 65, 80, 92, 108],
    relevance: 90,
    contact: "partners@brightsmile.com"
  },
  {
    id: "prod_12",
    name: "Organizer Cosmetici Girevole 360°",
    niche: "beauty",
    source: "etsy",
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
    url: "https://www.etsy.com/search?q=makeup%20organizer%20360",
    price: 29.99,
    cogs: 6.20,
    monthlyRevenue: 52000,
    monthlySales: 1730,
    growthRate: "+145%",
    description: "Portatrucchi rotante in acrilico trasparente con scomparti regolabili ad alta capacità, salvaspazio ed estetico.",
    countries: ["IT", "FR", "ES"],
    supplierUrl: "https://www.aliexpress.com/wholesale?SearchText=acrylic+rotating+makeup+organizer",
    trend: [20, 40, 58, 75, 92],
    relevance: 86,
    contact: "sales@makeuporganizers.co"
  }
];

const MOCK_PRODUCTS = [...BASE_MOCK_PRODUCTS];

const productTemplates = [
  { name: "Plaque de Cuisson Induction Portable", niche: "food", desc: "Placa de cocción por inducción portátil y ultrafina. Ideal para caravanas, camping o cocinas pequeñas.", supplier: "portable+induction+cooktop" },
  { name: "Masseur Oculaire vibrant avec Chaleur", niche: "beauty", desc: "Masajeador de ojos con vibración, calor y conexión Bluetooth para música rilassante. Ideal per alleviare lo stress.", supplier: "eye+massager+heating+vibration" },
  { name: "Correcteur de Posture Intelligent", niche: "fitness", desc: "Corrector de postura inteligente con sensor de vibración que avisa cuando la espalda está encorvada.", supplier: "smart+posture+corrector" },
  { name: "Kit d'Éclairage LED pour Rétroviseur", niche: "home", desc: "Tira de luces LED autoadhesives para espejo de tocador. Convierte cualquier espejo en un tocador profesional.", supplier: "led+vanity+mirror+lights+kit" },
  { name: "Corde à Sauter Connectée sans Fil", niche: "fitness", desc: "Comba inteligente sin cable con bolas de peso para entrenar en casa sin golpear los muebles.", supplier: "cordless+smart+jump+rope+weight" },
  { name: "Kit d'Herbes Aromatiques d'Intérieur Smart", niche: "home", desc: "Jardín inteligente hidropónico de interior con lámpara de crecimiento LED automática.", supplier: "smart+indoor+garden+hydroponics" },
  { name: "Gourde Autonettoyante UV-C", niche: "tech", desc: "Botella de agua inteligente de acero inoxidable con purificatore UV-C integrato.", supplier: "uv-c+self+cleaning+water+bottle" }
];

const brandsAndContacts = [
  "pureblend.co", "glowbeauty.it", "fitpulse.com", "hometechnology.eu", "ecolife.com"
];

const sources = ["meta", "tiktok_shop", "amazon", "pinterest", "etsy"];
const countriesList = [["IT", "FR", "ES"], ["US", "UK", "CA"], ["DE", "IT", "FR"], ["ES", "PT", "FR"]];

for (let i = 13; i <= 100; i++) {
  const tmpl = productTemplates[i % productTemplates.length];
  const source = sources[i % sources.length];
  const brandDomain = brandsAndContacts[i % brandsAndContacts.length];
  const countries = countriesList[i % countriesList.length];
  
  const price = 19.99 + (i * 3.50) % 90; 
  const cogs = +(price * 0.25).toFixed(2); 
  const monthlySales = 300 + (i * 27) % 3500;
  const monthlyRevenue = Math.floor(monthlySales * price);
  const growthRate = "+" + (50 + (i * 13) % 250) + "%";
  const relevance = 30 + (i * 9) % 70; 
  
  MOCK_PRODUCTS.push({
    id: `prod_${i}`,
    name: tmpl.name + ` Pro v${i % 4 + 1}`,
    niche: tmpl.niche,
    source: source,
    thumbnail: i % 2 === 0 
      ? "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80" 
      : "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
    url: `https://www.facebook.com/ads/library/?active_status=active&q=${encodeURIComponent(tmpl.name)}`,
    price: +price.toFixed(2),
    cogs: cogs,
    monthlyRevenue: monthlyRevenue,
    monthlySales: monthlySales,
    growthRate: growthRate,
    description: tmpl.desc + ` Model VIP #${i}.`,
    countries: countries,
    supplierUrl: `https://www.aliexpress.com/wholesale?SearchText=${tmpl.supplier}`,
    trend: [20, 30 + i % 10, 50 + i % 20, 75 + i % 15, 100 + i % 10],
    relevance: relevance,
    contact: `info@${brandDomain}`
  });
}

export default function ProductFinderTab({ c, mono, API_URL, onImportLead, uiLang, userTier = "free" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [hoveredProd, setHoveredProd] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);

  const maskEmail = (email) => {
    if (userTier === "admin" || userTier === "vip_pro" || userTier === "vip_elite") return email;
    if (!email || email === "À rechercher") return email;
    const parts = email.split("@");
    if (parts.length < 2) return "***";
    const name = parts[0];
    const domain = parts[1];
    const maskedName = name.length <= 3 ? name[0] + "***" : name.slice(0, 2) + "***" + name.slice(-1);
    return maskedName + "@" + domain;
  };

  const t = {
    fr: {
      title: "🎁 Produits Gagnants (Product Finder)",
      desc: "Trouvez les produits e-commerce les plus vendus du moment. Croisez les volumes de vente de Meta Ads, TikTok Shop, Amazon, eBay, Etsy et Pinterest.",
      ph: "Rechercher un produit gagnant, un mot-clé (ex: 'visage', 'blender', 'magnetic')...",
      searchBtn: "🔍 Rechercher",
      niche: "Niche",
      source: "Canal",
      sort: "Trier par",
      relevance: "Pertinence (Par défaut)",
      revenue: "Chiffre d'Affaires ($)",
      sales: "Ventes Mensuelles",
      price: "Prix de Vente",
      import: "🚀 Prospecter Fournisseur",
      viewStore: "🔗 Voir l'Offre originale",
      stats: "Statistiques Financières",
      profit: "Bénéfice estimé / vente",
      monthlyRev: "CA Mensuel",
      monthlySalesLbl: "Ventes mensuelles",
      marginLbl: "Marge bénéficiaire",
      supplierLbl: "🔍 Trouver le fournisseur sur AliExpress",
      targetCountries: "🌍 Pays cibles principaux",
      trendLbl: "Croissance & Ad Scaling Index",
      loadingText: "⚡ Scan des bases publicitaires Meta Ads & TikTok Shop...",
      emptyText: "Aucun produit trouvé. Faites une recherche en direct avec un autre mot-clé !",
      tipText: "💡 Analyse Financière : Calculez vos marges en direct et lancez une prospection vers la marque ou son fournisseur d'un simple clic."
    },
    en: {
      title: "🎁 Winning Products Finder",
      desc: "Identify the top-selling e-commerce products. Spy on sales volumes and active ads from Meta Library, TikTok Shop, Amazon, eBay, Etsy, and Pinterest.",
      ph: "Search winning products, keyword (e.g. 'scrub', 'blender', 'magnetic')...",
      searchBtn: "🔍 Search",
      niche: "Niche",
      source: "Channel",
      sort: "Sort by",
      relevance: "Relevance (Default)",
      revenue: "Monthly Revenue ($)",
      sales: "Monthly Sales",
      price: "Selling Price",
      import: "🚀 Outreach Supplier",
      viewStore: "🔗 View Original Listing",
      stats: "Financial Analytics",
      profit: "Estimated profit / sale",
      monthlyRev: "Monthly Revenue",
      monthlySalesLbl: "Monthly Sales",
      marginLbl: "Profit Margin",
      supplierLbl: "🔍 Source on AliExpress",
      targetCountries: "🌍 Top target countries",
      trendLbl: "Sales Growth & Ad Scaling Index",
      loadingText: "⚡ Scanning Meta Ads Library & marketplaces...",
      emptyText: "No products found. Try a live search with a different keyword!",
      tipText: "💡 Financial Analytics: Inspect margins and directly launch supplier outreach with 1 click."
    },
    it: {
      title: "🎁 Ricerca Prodotti Vincenti",
      desc: "Trova i prodotti e-commerce più venduti del momento. Incrocia i dati di vendita di Meta Ads Library, TikTok Shop, Amazon, eBay, Etsy e Pinterest.",
      ph: "Cerca un prodotto vincente, parola chiave (es: 'scrub', 'blender', 'magnetic')...",
      searchBtn: "🔍 Cerca",
      niche: "Nicchia",
      source: "Canale",
      sort: "Ordina per",
      relevance: "Pertinenza (Default)",
      revenue: "Fatturato Mensile ($)",
      sales: "Vendite Mensili",
      price: "Prezzo di Vendita",
      import: "🚀 Prospezione Fornitore",
      viewStore: "🔗 Vedi Offerta originale",
      stats: "Statistiche Finanziarie",
      profit: "Profitto stimato / vendita",
      monthlyRev: "CA Mensile",
      monthlySalesLbl: "Vendite mensili",
      marginLbl: "Margine di Profitto",
      supplierLbl: "🔍 Trova il fornitore su AliExpress",
      targetCountries: "🌍 Paesi target principali",
      trendLbl: "Crescita & Indice Ad Scaling",
      loadingText: "⚡ Scansione di Meta Ads Library e marketplace...",
      emptyText: "Nessun prodotto trovato. Prova con un'altra parola chiave!",
      tipText: "💡 Analisi Finanziaria: Calcola i tuoi margini in tempo reale ed avvia la prospezione commerciale con un clic."
    }
  }[uiLang] || {
    title: "🎁 Produits Gagnants (Product Finder)",
    desc: "Trouvez les produits e-commerce les plus vendus du moment. Croisez les volumes de vente de Meta Ads, TikTok Shop, Amazon, eBay, Etsy et Pinterest.",
    ph: "Rechercher un produit gagnant...",
    searchBtn: "🔍 Rechercher",
    niche: "Niche",
    source: "Canal",
    sort: "Trier par",
    relevance: "Pertinence",
    revenue: "Chiffre d'Affaires",
    sales: "Ventes",
    price: "Prix",
    import: "🚀 Prospecter",
    viewStore: "Voir",
    stats: "Finances",
    profit: "Bénéfice/vente",
    monthlyRev: "Revenue",
    monthlySalesLbl: "Ventes",
    marginLbl: "Marge",
    supplierLbl: "AliExpress",
    targetCountries: "Pays Cibles",
    trendLbl: "Index Tendance",
    loadingText: "Scannage...",
    emptyText: "Aucun produit trouvé."
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/product-finder/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchTerm, category: selectedNiche, region: "eu" })
      });
      const data = await response.json();

      if (data.products && data.products.length > 0) {
        const mappedProducts = data.products.map((p, idx) => {
          const priceNum = parseFloat(String(p.price || "").replace(/[^0-9.]/g, "")) || (19.99 + idx * 4);
          const cogs = parseFloat((priceNum * 0.25).toFixed(2));
          const sales = p.orders || Math.round(800 + idx * 200);
          const sourceMap = ["aliexpress", "amazon", "aliexpress", "amazon", "etsy"];
          return {
            id: p.id,
            name: p.title,
            niche: (p.category || (selectedNiche === "all" ? "general" : selectedNiche)).toLowerCase(),
            source: p.source || sourceMap[idx % sourceMap.length],
            thumbnail: p.image,
            url: p.url,
            price: priceNum,
            cogs,
            monthlyRevenue: Math.floor(sales * priceNum),
            monthlySales: sales,
            growthRate: p.potential ? `+${p.potential}%` : "+120%",
            description: p.snippet || p.title,
            countries: ["US", "FR", "IT"],
            supplierUrl: p.aliUrl || p.url,
            trend: p.trend,
            relevance: p.potential || Math.max(60, 90 - idx * 3),
            saturation: p.saturation,
            margin: p.margin,
            contact: `support@${(() => { try { return new URL(p.url).hostname; } catch { return "aliexpress.com"; } })()}`
          };
        });
        setProducts(mappedProducts);
      } else {
        const msg = data.status === "under_construction"
          ? (uiLang === "fr" ? "Module en cours de déploiement." : "Module deploying.")
          : (uiLang === "fr" ? "Aucun produit trouvé pour cette recherche." : "No products found.");
        alert(msg);
      }
    } catch (err) {
      console.error(err);
      alert(uiLang === "fr" ? "Erreur de connexion au serveur." : "Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchNiche = selectedNiche === "all" || p.niche === selectedNiche;
      const matchSource = selectedSource === "all" || p.source === selectedSource;
      return matchNiche && matchSource;
    }).sort((a, b) => {
      if (sortBy === "relevance") return (b.relevance || 0) - (a.relevance || 0);
      if (sortBy === "revenue") return b.monthlyRevenue - a.monthlyRevenue;
      if (sortBy === "sales") return b.monthlySales - a.monthlySales;
      if (sortBy === "price") return b.price - a.price;
      return 0;
    });
  }, [products, selectedNiche, selectedSource, sortBy]);

  const getSourceIcon = (src) => {
    const icons = {
      meta: "https://cdn.simpleicons.org/meta/0668E1",
      tiktok_shop: "https://cdn.simpleicons.org/tiktok/010101",
      amazon: "https://cdn.simpleicons.org/amazon/FF9900",
      ebay: "https://cdn.simpleicons.org/ebay/E53238",
      etsy: "https://cdn.simpleicons.org/etsy/F16521",
      pinterest: "https://cdn.simpleicons.org/pinterest/E60023",
      google: "https://cdn.simpleicons.org/google/4285F4"
    };
    return icons[src] || "https://cdn.simpleicons.org/shopify/96bf48";
  };

  const getSourceLabel = (src) => {
    const labels = {
      meta: "Meta Ads",
      tiktok_shop: "TikTok Shop",
      amazon: "Amazon Bestseller",
      ebay: "eBay Trending",
      etsy: "Etsy Popular",
      pinterest: "Pinterest Trends",
      google: "Google Shopping"
    };
    return labels[src] || "Shopify Store";
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out", position: "relative" }}>
      
      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: c.text, margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>{t.title}</h2>
        <p style={{ color: c.textMuted, margin: 0, fontSize: 14, lineHeight: 1.5, maxWidth: 700 }}>{t.desc}</p>
      </div>

      {/* Tip Banner */}
      <div style={{ background: c.accentSoft, border: `1.5px dashed ${c.accent}`, padding: "12px 16px", borderRadius: 12, marginBottom: 20, color: c.text, fontSize: 13 }}>
        <span>{t.tipText}</span>
      </div>

      {/* Filter panel */}
      <form onSubmit={handleSearch} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 18, marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        
        {/* Search */}
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
            <option value="home">Home & Kitchen</option>
            <option value="tech">Tech</option>
          </select>
        </div>

        {/* Source */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontFamily: mono, color: c.textDim, textTransform: "uppercase" }}>{t.source}</span>
          <select 
            value={selectedSource}
            onChange={e => setSelectedSource(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: 9, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13, cursor: "pointer" }}
          >
            <option value="all">{t.all}</option>
            <option value="meta">Meta Ads</option>
            <option value="tiktok_shop">TikTok Shop</option>
            <option value="amazon">Amazon</option>
            <option value="ebay">eBay</option>
            <option value="etsy">Etsy</option>
            <option value="pinterest">Pinterest</option>
            <option value="google">Google Shopping</option>
          </select>
        </div>

        {/* Sort */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <span style={{ fontSize: 11, fontFamily: mono, color: c.textDim, textTransform: "uppercase" }}>{t.sort}</span>
          <select 
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: 9, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", fontSize: 13, cursor: "pointer" }}
          >
            <option value="relevance">{t.relevance}</option>
            <option value="revenue">{t.revenue}</option>
            <option value="sales">{t.sales}</option>
            <option value="price">{t.price}</option>
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

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", color: c.textDim }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <p>{t.emptyText}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {filteredProducts.map((p) => (
            <div 
              key={p.id}
              onMouseEnter={() => setHoveredProd(p.id)}
              onMouseLeave={() => setHoveredProd(null)}
              style={{ 
                background: c.card, 
                border: `1.5px solid ${hoveredProd === p.id ? c.borderActive : c.border}`, 
                borderRadius: 16, 
                overflow: "hidden", 
                boxShadow: hoveredProd === p.id ? `0 12px 32px ${c.accentGlow}` : "none",
                transform: hoveredProd === p.id ? "translateY(-4px)" : "none",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              {/* Product Cover image */}
              <div style={{ height: 200, position: "relative", cursor: "pointer", background: "#000" }} onClick={() => setActiveProduct(p)}>
                <img 
                  src={p.thumbnail} 
                  alt={p.name} 
                  style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
                />
                
                {/* Platform Badge */}
                <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 8px", borderRadius: 6, backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: 4 }}>
                  <img src={getSourceIcon(p.source)} width={11} height={11} alt="" />
                  {getSourceLabel(p.source).toUpperCase()}
                </div>

                {/* Growth Rate */}
                <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(16,185,129,0.95)", color: "#06060b", fontSize: 11, fontWeight: 800, padding: "4px 8px", borderRadius: 6 }}>
                  {p.growthRate}
                </div>
              </div>

              {/* Info Area */}
              <div style={{ padding: 16 }}>
                <h3 style={{ fontSize: 14.5, fontWeight: 700, color: c.text, margin: "0 0 6px 0", height: 20, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</h3>
                <p style={{ fontSize: 12, color: c.textMuted, height: 36, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.4, marginBottom: 12 }}>
                  {p.description}
                </p>

                {/* Financial Summary */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, background: c.bg, padding: 8, borderRadius: 10, border: `1px solid ${c.border}`, marginBottom: 14 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: c.textDim, fontFamily: mono }}>CA MENSUEL</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: c.text }}>
                      ${p.monthlyRevenue >= 1000 ? `${(p.monthlyRevenue / 1000).toFixed(0)}k` : p.monthlyRevenue}
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: c.textDim, fontFamily: mono }}>PRIX</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: c.text }}>${p.price}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: c.textDim, fontFamily: mono }}>MARGE</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: c.success }}>
                      {((p.price - p.cogs) / p.price * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button 
                    onClick={() => setActiveProduct(p)}
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${c.border}`, background: "transparent", color: c.textMuted, fontSize: 12, fontWeight: 650, cursor: "pointer", fontFamily: mono }}
                  >
                    Analyse 📊
                  </button>
                  <button 
                    onClick={() => onImportLead({
                      name: p.name.split("-")[0].trim(),
                      url: p.url,
                      platform: getSourceLabel(p.source),
                      platformId: "web",
                      niche: p.niche,
                      region: p.countries[0].toLowerCase(),
                      contact: maskEmail(p.contact),
                      instagram: null,
                      socials: {},
                      score: 92,
                      size: "Small",
                      reasoning: "Best Seller Product"
                    })}
                    style={{ flex: 2, padding: "8px 12px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: mono }}
                  >
                    {t.import}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL MODAL ANALYSIS */}
      {activeProduct && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 20, width: "100%", maxWidth: 800, maxHeight: "90vh", overflowY: "auto", position: "relative", boxShadow: "0 25px 50px rgba(0,0,0,0.6)", padding: 24 }}>
            
            {/* Close Button */}
            <button onClick={() => setActiveProduct(null)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.6)", border: "none", width: 36, height: 36, borderRadius: "50%", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✖</button>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 12 }}>
              {/* Product Visual */}
              <div style={{ flex: "1 1 300px", maxWidth: 360 }}>
                <img src={activeProduct.thumbnail} alt="" style={{ width: "100%", borderRadius: 14, height: 260, objectFit: "cover", border: `1.5px solid ${c.border}`, marginBottom: 16 }} />
                
                <h4 style={{ margin: "0 0 10px 0", fontSize: 12, fontFamily: mono, color: c.textDim, textTransform: "uppercase" }}>{t.targetCountries}</h4>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                  {activeProduct.countries.map(country => (
                    <span key={country} style={{ background: c.bg, border: `1px solid ${c.border}`, padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 700, color: c.text }}>
                      🌍 {country}
                    </span>
                  ))}
                </div>

                {userTier === "free" || userTier === "standard" ? (
                  <div style={{ display: "block", background: "rgba(224, 92, 43, 0.05)", border: "1.5px dashed rgba(224, 92, 43, 0.4)", color: "#e05c2b", padding: 12, borderRadius: 10, textAlign: "center", fontSize: 12, fontWeight: 700, fontFamily: mono }}>
                    🔒 {uiLang === "fr" ? "Débloquer Fournisseur avec VIP" : "Unlock Supplier with VIP"}
                  </div>
                ) : (
                  <a href={activeProduct.supplierUrl} target="_blank" rel="noreferrer" style={{ display: "block", textDecoration: "none", background: "#e05c2b1a", border: "1.5px solid #e05c2b", color: "#e05c2b", padding: 12, borderRadius: 10, textAlign: "center", fontSize: 12.5, fontWeight: 700, fontFamily: mono, transition: "filter 0.2s" }} onMouseOver={e=>e.currentTarget.style.filter="brightness(1.1)"} onMouseOut={e=>e.currentTarget.style.filter="none"}>
                    {t.supplierLbl}
                  </a>
                )}
              </div>

              {/* Financial Analytics and margins */}
              <div style={{ flex: "1 1 360px", display: "flex", flexDirection: "column" }}>
                <span style={{ color: c.accent, fontWeight: 700, fontSize: 11, fontFamily: mono, textTransform: "uppercase", marginBottom: 4 }}>{getSourceLabel(activeProduct.source)}</span>
                <h3 style={{ margin: "0 0 10px 0", fontSize: 20, color: c.text, fontWeight: 800 }}>{activeProduct.name}</h3>
                
                <p style={{ fontSize: 13.5, color: c.textMuted, lineHeight: 1.5, marginBottom: 20, background: c.bg, padding: 12, borderRadius: 10, border: `1px solid ${c.border}` }}>
                  {activeProduct.description}
                </p>

                <h4 style={{ margin: "0 0 10px 0", fontSize: 12, fontFamily: mono, color: c.textDim, textTransform: "uppercase" }}>{t.stats}</h4>

                {/* Margin Calculator */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 16 }}>
                  <div style={{ background: c.bg, padding: 12, borderRadius: 10, border: `1px solid ${c.border}` }}>
                    <div style={{ fontSize: 10, color: c.textDim }}>PRIX DE VENTE (SELL)</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: c.text }}>${activeProduct.price}</div>
                  </div>
                  <div style={{ background: c.bg, padding: 12, borderRadius: 10, border: `1px solid ${c.border}` }}>
                    <div style={{ fontSize: 10, color: c.textDim }}>COÛT D'ACHAT (COGS)</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: c.text }}>${activeProduct.cogs}</div>
                  </div>
                  <div style={{ background: c.bg, padding: 12, borderRadius: 10, border: `1px solid ${c.border}` }}>
                    <div style={{ fontSize: 10, color: c.textDim }}>{t.profit}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: c.success }}>+${(activeProduct.price - activeProduct.cogs).toFixed(2)}</div>
                  </div>
                  <div style={{ background: c.bg, padding: 12, borderRadius: 10, border: `1px solid ${c.border}` }}>
                    <div style={{ fontSize: 10, color: c.textDim }}>{t.marginLbl}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: c.success }}>
                      {((activeProduct.price - activeProduct.cogs) / activeProduct.price * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 16 }}>
                  <div style={{ background: c.bg, padding: 12, borderRadius: 10, border: `1px solid ${c.border}` }}>
                    <div style={{ fontSize: 10, color: c.textDim }}>{t.monthlyRev}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: c.text }}>${activeProduct.monthlyRevenue.toLocaleString()}</div>
                  </div>
                  <div style={{ background: c.bg, padding: 12, borderRadius: 10, border: `1px solid ${c.border}` }}>
                    <div style={{ fontSize: 10, color: c.textDim }}>{t.monthlySalesLbl}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: c.text }}>{activeProduct.monthlySales.toLocaleString()}</div>
                  </div>
                </div>

                {/* Trend scaling */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <h5 style={{ margin: 0, fontSize: 11, fontFamily: mono, color: c.textDim, textTransform: "uppercase" }}>{t.trendLbl}</h5>
                    <span style={{ fontSize: 11, fontWeight: 700, color: c.success }}>{activeProduct.growthRate} Scaling</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", height: 40, gap: 4, padding: "4px 8px", background: c.bg, borderRadius: 8, border: `1px solid ${c.border}` }}>
                    {activeProduct.trend.map((val, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          flex: 1, 
                          height: `${(val / Math.max(...activeProduct.trend)) * 100}%`, 
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
                        name: activeProduct.name.split("-")[0].trim(),
                        url: activeProduct.url,
                        platform: getSourceLabel(activeProduct.source),
                        platformId: "web",
                        niche: activeProduct.niche,
                        region: activeProduct.countries[0].toLowerCase(),
                        contact: activeProduct.contact,
                        instagram: null,
                        socials: {},
                        score: 95,
                        size: "Medium",
                        reasoning: "Hot Selling Product"
                      });
                      setActiveProduct(null);
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
                    onClick={() => window.open(activeProduct.url, "_blank")} 
                    style={{ flex: 1, padding: "14px", borderRadius: 10, border: `1.5px solid ${c.border}`, background: "transparent", color: c.textMuted, fontSize: 13, fontWeight: 650, cursor: "pointer" }}
                  >
                    {t.viewStore}
                  </button>
                </div>
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
