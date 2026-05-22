import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import VettingTab from "./VettingTab";

// ─── Niches ──────────────────────────────────────────────────────────────────
const NICHES = [
  { id: "beauty", label: { fr: "Beauty / Skincare", en: "Beauty / Skincare", it: "Beauty / Skincare" },
    iconSvg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    keywords: ["skincare italiano", "beauty brand Italia", "cosmetici artigianali italiani", "crema viso italiana", "siero viso brand italiano", "make up brand Italia"] },
  { id: "food",   label: { fr: "Food / Nutrition",  en: "Food / Nutrition",  it: "Food / Nutrizione" },
    iconSvg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M3 12h18"/><path d="M12 3v9"/><path d="M12 3A4.5 4.5 0 0 0 7.5 7.5H12Z"/><path d="M12 3a4.5 4.5 0 0 1 4.5 4.5H12Z"/></svg>`,
    keywords: ["integratori italiani", "food brand italiano", "superfood Italia shop", "snack proteico italiano", "nutrition brand Italia", "organic food italiano"] },
  { id: "fitness",label: { fr: "Fitness / Wellness", en: "Fitness / Wellness", it: "Fitness / Benessere" },
    iconSvg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    keywords: ["activewear italiano", "sportswear brand Italia", "yoga brand italiano", "fitness brand Italia", "abbigliamento sportivo italiano", "wellness brand Italia"] },
];

// ─── Platforms ───────────────────────────────────────────────────────────────
const PLATFORMS = [
  { id: "web",       label: "Web / Google",  icon: "https://cdn.simpleicons.org/google/888888",    siteFilter: "" },
  { id: "instagram", label: "Instagram",     icon: "https://cdn.simpleicons.org/instagram/E1306C", siteFilter: "site:instagram.com" },
  { id: "tiktok",    label: "TikTok",        icon: "https://cdn.simpleicons.org/tiktok/010101",    siteFilter: "site:tiktok.com" },
  { id: "facebook",  label: "Facebook",      icon: "https://cdn.simpleicons.org/facebook/1877F2",  siteFilter: "site:facebook.com" },
  { id: "pinterest", label: "Pinterest",     icon: "https://cdn.simpleicons.org/pinterest/E60023", siteFilter: "site:pinterest.com" },
  { id: "amazon",    label: "Amazon",        icon: "https://cdn.simpleicons.org/amazon/FF9900",    siteFilter: "site:amazon.it" },
  { id: "etsy",      label: "Etsy",          icon: "https://cdn.simpleicons.org/etsy/F16521",      siteFilter: "site:etsy.com" },
  { id: "ebay",      label: "eBay",          icon: "https://cdn.simpleicons.org/ebay/E53238",      siteFilter: "site:ebay.it" },
];

// ─── Regions ─────────────────────────────────────────────────────────────────
const REGIONS = [
  { id: "it", label: "🇮🇹 Italia", term: "Italia italiano \"made in Italy\"", emailLang: "it" },
  { id: "eu", label: "🇪🇺 Europa", term: "Europe European brand",             emailLang: "en" },
  { id: "us", label: "🇺🇸 USA/UK", term: "US brand UK brand",                 emailLang: "en" },
];

// ─── UI Translations ─────────────────────────────────────────────────────────
const T = {
  fr: {
    subtitle:        "Tavily Search + Email Agent • 8 canaux",
    platforms:       (n, t) => `Plateformes (${n}/${t})`,
    niches:          "Niches",
    regions:         "Régions",
    customLabel:     "Recherche custom",
    customPH:        "ex: vegan protein Italy shopify new brand...",
    launch:          (n) => `🚀 LANCER (${n} plateformes)`,
    stop:            "⏹ STOPPER",
    all:             "Toutes",
    reset:           "Reset",
    filterLabel:     "Filtrer :",
    allFilter:       (n) => `Toutes (${n})`,
    terminal:        "Terminal",
    emptyOk:         "Configure et lance la prospection multi-plateforme",
    emptyOffline:    "⚠️ Backend offline — ouvre un terminal : node server.js",
    emailBtn:        "✉️ Email",
    generating:      "⏳ Génération...",
    emailReady:      "📝 Email prêt",
    sending:         "📤 Envoi...",
    sent:            "✅ Envoyé!",
    errorLbl:        "❌ Erreur",
    copyBtn:         "📋 Copier",
    copied:          "✓ Copié!",
    visit:           "🌐 Visiter",
    sendBtn:         "📤 Envoyer",
    recipient:       "Destinataire",
    subjectLbl:      "Objet",
    bodyLbl:         "Corps du message",
    emailGenerated:  "Email générée",
    gmailWarn:       "Configure GMAIL_APP_PASSWORD dans .env",
    csvBtn:          (n) => `📥 CSV (${n})`,
    sentCount:       (n) => `📤 ${n} envoyés`,
    logLaunched:     (n) => `🚀 Agent lancé — ${n} requêtes planifiées`,
    logPlatforms:    (np, nn) => `📡 ${np} plateformes × ${nn} niches`,
    logNoResult:     "📭 Nessun risultato",
    logAnalyzing:    (n) => `📋 ${n} résultats → analyse...`,
    logDone:         (n) => `🏁 Terminé — ${n} prospects qualifiés (score ≥65)`,
    logStopped:      "⏹️ Interrompu",
    gmailSetupTitle: "📧 Pour activer l'envoi d'emails :",
    gmailStep1:      "Va sur",
    gmailStep2:      'Crée un App Password pour "Mail"',
    gmailStep3:      "Colle les 16 caractères dans",
    gmailStep4:      "Redémarre le backend :",
  },
  en: {
    subtitle:        "Tavily Search + Email Agent • 8 channels",
    platforms:       (n, t) => `Platforms (${n}/${t})`,
    niches:          "Niches",
    regions:         "Regions",
    customLabel:     "Custom search",
    customPH:        "e.g. vegan protein Italy shopify new brand...",
    launch:          (n) => `🚀 LAUNCH (${n} platforms)`,
    stop:            "⏹ STOP",
    all:             "All",
    reset:           "Reset",
    filterLabel:     "Filter:",
    allFilter:       (n) => `All (${n})`,
    terminal:        "Terminal",
    emptyOk:         "Configure and launch multi-platform prospecting",
    emptyOffline:    "⚠️ Backend offline — open a terminal: node server.js",
    emailBtn:        "✉️ Email",
    generating:      "⏳ Generating...",
    emailReady:      "📝 Email ready",
    sending:         "📤 Sending...",
    sent:            "✅ Sent!",
    errorLbl:        "❌ Error",
    copyBtn:         "📋 Copy",
    copied:          "✓ Copied!",
    visit:           "🌐 Visit",
    sendBtn:         "📤 Send",
    recipient:       "Recipient",
    subjectLbl:      "Subject",
    bodyLbl:         "Message body",
    emailGenerated:  "Generated email",
    gmailWarn:       "Configure GMAIL_APP_PASSWORD in .env",
    csvBtn:          (n) => `📥 CSV (${n})`,
    sentCount:       (n) => `📤 ${n} sent`,
    logLaunched:     (n) => `🚀 Agent launched — ${n} queries planned`,
    logPlatforms:    (np, nn) => `📡 ${np} platforms × ${nn} niches`,
    logNoResult:     "📭 No results",
    logAnalyzing:    (n) => `📋 ${n} results → analyzing...`,
    logDone:         (n) => `🏁 Done — ${n} qualified prospects (score ≥65)`,
    logStopped:      "⏹️ Stopped",
    gmailSetupTitle: "📧 To enable email sending:",
    gmailStep1:      "Go to",
    gmailStep2:      'Create an App Password for "Mail"',
    gmailStep3:      "Paste the 16 characters into",
    gmailStep4:      "Restart the backend:",
  },
  it: {
    subtitle:        "Tavily Search + Email Agent • 8 canali",
    platforms:       (n, t) => `Piattaforme (${n}/${t})`,
    niches:          "Nicchie",
    regions:         "Regioni",
    customLabel:     "Ricerca personalizzata",
    customPH:        "es: vegan protein Italy shopify new brand...",
    launch:          (n) => `🚀 AVVIA (${n} piattaforme)`,
    stop:            "⏹ FERMA",
    all:             "Tutte",
    reset:           "Reset",
    filterLabel:     "Filtra:",
    allFilter:       (n) => `Tutti (${n})`,
    terminal:        "Terminale",
    emptyOk:         "Configura e avvia la prospezione multi-piattaforma",
    emptyOffline:    "⚠️ Backend offline — apri un terminale: node server.js",
    emailBtn:        "✉️ Email",
    generating:      "⏳ Generazione...",
    emailReady:      "📝 Email pronta",
    sending:         "📤 Invio...",
    sent:            "✅ Inviata!",
    errorLbl:        "❌ Errore",
    copyBtn:         "📋 Copia",
    copied:          "✓ Copiato!",
    visit:           "🌐 Visita",
    sendBtn:         "📤 Invia",
    recipient:       "Destinatario",
    subjectLbl:      "Oggetto",
    bodyLbl:         "Corpo del messaggio",
    emailGenerated:  "Email generata",
    gmailWarn:       "Configura GMAIL_APP_PASSWORD nel .env",
    csvBtn:          (n) => `📥 CSV (${n})`,
    sentCount:       (n) => `📤 ${n} inviati`,
    logLaunched:     (n) => `🚀 Agente avviato — ${n} query pianificate`,
    logPlatforms:    (np, nn) => `📡 ${np} piattaforme × ${nn} nicchie`,
    logNoResult:     "📭 Nessun risultato",
    logAnalyzing:    (n) => `📋 ${n} risultati → analisi...`,
    logDone:         (n) => `🏁 Terminato — ${n} prospect qualificati (score ≥65)`,
    logStopped:      "⏹️ Interrotto",
    gmailSetupTitle: "📧 Per abilitare l'invio email:",
    gmailStep1:      "Vai su",
    gmailStep2:      'Crea un App Password per "Mail"',
    gmailStep3:      "Incolla i 16 caratteri in",
    gmailStep4:      "Riavvia il backend:",
  },
};

// ─── Themes ───────────────────────────────────────────────────────────────────
const DARK = {
  bg: "#06060b", surface: "#0e0e16", card: "#111119",
  border: "#1c1c2e", borderActive: "#ff6b35",
  accent: "#ff6b35", accentSoft: "rgba(255,107,53,0.12)", accentGlow: "rgba(255,107,53,0.25)",
  accent2: "#a78bfa", accent2Soft: "rgba(167,139,250,0.12)",
  text: "#e8e6e3", textMuted: "#8a8a9a", textDim: "#4a4a5a",
  success: "#34d399", successSoft: "rgba(52,211,153,0.12)",
  warning: "#fbbf24", warningBg: "rgba(251,191,36,0.12)",
  error: "#f87171", errorBg: "rgba(248,113,113,0.12)",
  emailBlue: "#60a5fa", emailBlueSoft: "rgba(96,165,250,0.12)",
  iconFilter: "invert(1) brightness(2)",
  tiktokIcon: "https://cdn.simpleicons.org/tiktok/ffffff",
  ebayIcon:   "https://cdn.simpleicons.org/ebay/ffffff",
  googleIcon: "https://cdn.simpleicons.org/google/aaaaaa",
};

const LIGHT = {
  bg: "#f2f2f8", surface: "#ffffff", card: "#fafaff",
  border: "#dddded", borderActive: "#ff6b35",
  accent: "#e85c28", accentSoft: "rgba(232,92,40,0.1)", accentGlow: "rgba(232,92,40,0.2)",
  accent2: "#7c3aed", accent2Soft: "rgba(124,58,237,0.1)",
  text: "#1a1a2e", textMuted: "#5a5a7a", textDim: "#9090aa",
  success: "#059669", successSoft: "rgba(5,150,105,0.1)",
  warning: "#b45309", warningBg: "rgba(180,83,9,0.08)",
  error: "#dc2626", errorBg: "rgba(220,38,38,0.08)",
  emailBlue: "#2563eb", emailBlueSoft: "rgba(37,99,235,0.1)",
  iconFilter: "none",
  tiktokIcon: "https://cdn.simpleicons.org/tiktok/111111",
  ebayIcon:   "https://cdn.simpleicons.org/ebay/E53238",
  googleIcon: "https://cdn.simpleicons.org/google/555555",
};

const mono = "'JetBrains Mono','Fira Code','SF Mono',monospace";
const sans = "'DM Sans','Segoe UI',system-ui,sans-serif";

// ─── Components ──────────────────────────────────────────────────────────────
const PlatformIcon = ({ src, size = 14 }) =>
  src ? <img src={src} width={size} height={size}
    style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6, flexShrink: 0 }} alt="" /> : null;

const NicheIcon = ({ svg }) => (
  <span dangerouslySetInnerHTML={{ __html: svg }} style={{ display: "inline-flex", alignItems: "center", marginRight: 6, flexShrink: 0 }} />
);

const Chip = ({ selected, onClick, children, color, icon, c }) => {
  const col = color || c.accent;
  return (
    <button onClick={onClick} style={{
      padding: "8px 14px", borderRadius: 9, display: "inline-flex", alignItems: "center",
      border: `1.5px solid ${selected ? col : c.border}`,
      background: selected ? (col === c.accent2 ? c.accent2Soft : c.accentSoft) : "transparent",
      color: selected ? col : c.textDim,
      cursor: "pointer", fontSize: 13, fontFamily: sans, fontWeight: 550,
      transition: "all 0.15s", whiteSpace: "nowrap",
    }}>
      {icon && <PlatformIcon src={icon} />}
      {children}
    </button>
  );
};

const Badge = ({ children, color, bg }) => (
  <span style={{
    fontSize: 10.5, padding: "3px 9px", borderRadius: 5,
    background: bg || "rgba(128,128,128,0.08)",
    color: color || "#888",
    fontFamily: mono, fontWeight: 500,
  }}>{children}</span>
);

// ─── Build Queries ────────────────────────────────────────────────────────────
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
  if (customKw.trim()) {
    queries.unshift({ query: customKw.trim(), niche: "custom", platform: "web", region: "it", emailLang: "it" });
  }
  return queries.sort(() => Math.random() - 0.5).slice(0, 12);
}

function parseGoogleResult(item, niche, platform, region, emailLang) {
  const platLabel = PLATFORMS.find(p => p.id === platform)?.label || platform;
  const name = item.title.split(" | ")[0].split(" - ")[0].split(" – ")[0].trim().slice(0, 50);
  const emailMatch = (item.snippet || "").match(/[\w.-]+@[\w.-]+\.\w{2,}/g);
  const email = emailMatch?.[0] || null;
  const igMatch = (item.snippet + item.title).match(/@[\w_.]{3,30}/g);
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

// ─── Main App ─────────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function ProspectionAgent() {
  const [theme, setTheme]               = useState("dark");
  const [uiLang, setUiLang]             = useState("fr");
  const [selNiches, setSelNiches]       = useState(["beauty", "food"]);
  const [selPlatforms, setSelPlatforms] = useState(["web", "instagram"]);
  const [selRegions, setSelRegions]     = useState(["it"]);
  const [searching, setSearching]       = useState(false);
  const [results, setResults]           = useState([]);
  const [logs, setLogs]                 = useState([]);
  const [customKw, setCustomKw]         = useState("");
  const [phase, setPhase]               = useState("");
  const [stats, setStats]               = useState({ total: 0, byPlatform: {}, byNiche: {} });
  const [fPlatform, setFPlatform]       = useState("all");
  const [fNiche, setFNiche]             = useState("all");
  const [copiedIdx, setCopiedIdx]       = useState(null);
  const [backendOk, setBackendOk]       = useState(null);
  const [emailsSent, setEmailsSent]     = useState(0);
  const [expandedEmail, setExpandedEmail] = useState(null);
  const [isLoggedIn, setIsLoggedIn]       = useState(false);
  const [currentTab, setCurrentTab]       = useState("acquisition");
  const [authMode, setAuthMode]           = useState("login"); // login | signup
  const [emailInput, setEmailInput]       = useState("");
  const [passInput, setPassInput]         = useState("");
  const [showPass, setShowPass]           = useState(false);
  const [authError, setAuthError]         = useState("");
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem("va_users") || '{"admin@viralacquisition.it":"admin"}'); } catch { return {}; }
  });
  const logRef   = useRef(null);
  const abortRef = useRef(false);

  const c  = theme === "dark" ? DARK : LIGHT;
  const t  = T[uiLang];

  // Adjust icon colors for light/dark theme
  const getPlatformIcon = (p) => {
    if (p.id === "tiktok") return c.tiktokIcon;
    if (p.id === "ebay")   return c.ebayIcon;
    if (p.id === "web")    return c.googleIcon;
    return p.icon;
  };

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [logs]);
  useEffect(() => {
    fetch(`${API_URL}/health`).then(r => r.json()).then(setBackendOk).catch(() => setBackendOk(null));
  }, []);

  // CRM: Load leads when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${API_URL}/api/leads`)
        .then(r => r.json())
        .then(data => {
          if (data.leads && data.leads.length) {
             setResults(data.leads);
             const st = { total: data.leads.length, byPlatform: {}, byNiche: {} };
             data.leads.forEach(r => {
               st.byPlatform[r.platformId] = (st.byPlatform[r.platformId] || 0) + 1;
               st.byNiche[r.niche] = (st.byNiche[r.niche] || 0) + 1;
             });
             setStats(st);
          }
        })
        .catch(console.error);

      // Check if a campaign is already running in background
      fetch(`${API_URL}/api/campaigns/status`)
        .then(r => r.json())
        .then(data => {
          if (data.isRunning) {
            setSearching(true);
            setPhase(data.phase);
            setLogs(data.logs);
          }
        })
        .catch(console.error);
    }
  }, [isLoggedIn]);

  // Polling campaign status when searching
  useEffect(() => {
    let interval;
    if (searching) {
      interval = setInterval(async () => {
        try {
          const r = await fetch(`${API_URL}/api/campaigns/status`);
          const data = await r.json();
          setPhase(data.phase);
          setLogs(data.logs);
          if (!data.isRunning && searching) {
            setSearching(false);
            setPhase("");
            // Refresh leads at the end
            fetch(`${API_URL}/api/leads`)
              .then(r=>r.json())
              .then(d => {
                if (d.leads) setResults(d.leads);
              });
          }
        } catch {}
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [searching]);

  // CRM: Save leads automatically to localStorage (Legacy fallback, now backend saves it on send)
  useEffect(() => {
    if (isLoggedIn && emailInput && results.length > 0) {
      localStorage.setItem(`va_leads_${emailInput}`, JSON.stringify(results));
    }
  }, [results, isLoggedIn, emailInput]);

  const addLog = useCallback((msg, type = "info") => {
    setLogs(p => [...p, { msg, type, time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) }]);
  }, []);

  const toggle = (arr, setArr, id) => setArr(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const updateBrand = useCallback((idx, patch) => {
    setResults(prev => { const n = [...prev]; n[idx] = { ...n[idx], ...patch }; return n; });
  }, []);

  // ─── Generate email ───────────────────────────────────────────────────────
  const generateEmail = async (brand, idx) => {
    updateBrand(idx, { emailStatus: "generating" });
    setExpandedEmail(idx);
    try {
      const r = await fetch(`${API_URL}/api/generate-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, emailLang: brand.emailLang }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Error");
      updateBrand(idx, { emailStatus: "ready", generatedEmail: data, emailTo: brand.emailTo || "" });
    } catch {
      updateBrand(idx, { emailStatus: "error" });
    }
  };

  // ─── Send email ───────────────────────────────────────────────────────────
  const sendEmail = async (brand, idx) => {
    if (!brand.generatedEmail || !brand.emailTo) return;
    updateBrand(idx, { emailStatus: "sending" });
    try {
      const r = await fetch(`${API_URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: brand.emailTo, subject: brand.generatedEmail.subject, body: brand.generatedEmail.body, brandName: brand.name }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Error");
      updateBrand(idx, { emailStatus: "sent" });
      setEmailsSent(n => n + 1);
    } catch (err) {
      updateBrand(idx, { emailStatus: "error" });
      alert(`❌ ${err.message}`);
    }
  };

  // ─── Run search (Backend Background Queue) ───────────────────────────────
  const runSearch = async () => {
    abortRef.current = false;
    setSearching(true); 
    setLogs([{ msg: "Lancement de la campagne sur le serveur...", type: "info", time: new Date().toLocaleTimeString() }]);
    setExpandedEmail(null); 
    setFPlatform("all"); 
    setFNiche("all");

    try {
      const res = await fetch(`${API_URL}/api/campaigns/start`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selPlatforms, selNiches, selRegions, customKw, emailInput }),
      });
      if (!res.ok) throw new Error("Erreur serveur");
    } catch (err) {
      setSearching(false);
      addLog(`⚠️ Erreur de connexion au backend: ${err.message}`, "error");
    }
  };

  const exportCSV = () => {
    const h = "Nome,URL,Piattaforma,Niche,Regione,Contatto,Instagram,Score,Size,Email\n";
    const rows = filtered.map(r => [r.name, r.url, r.platform, r.niche, r.region, r.contact, r.instagram || "", r.score, r.size, r.emailStatus === "sent" ? "Sì" : "No"].map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + h + rows], { type: "text/csv;charset=utf-8" });
    const u = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), { href: u, download: `VA_prospects_${new Date().toISOString().slice(0, 10)}.csv` }).click();
    URL.revokeObjectURL(u);
  };

  const clearLeads = async () => {
    if (!window.confirm(uiLang === "fr" ? "Vider tous les résultats ?" : "Clear all results?")) return;
    try {
      await fetch(`${API_URL}/api/leads`, { method: 'DELETE' });
      setResults([]);
    } catch {}
  };

  const filtered = results
    .filter(r => (fPlatform === "all" || r.platformId === fPlatform) && (fNiche === "all" || r.niche === fNiche))
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const emailStatusColor = (s) => ({ idle: c.textDim, generating: c.warning, ready: c.emailBlue, sending: c.warning, sent: c.success, error: c.error }[s] || c.textDim);
  const emailStatusLabel = (s) => ({ idle: t.emailBtn, generating: t.generating, ready: t.emailReady, sending: t.sending, sent: t.sent, error: t.errorLbl }[s] || t.emailBtn);

  const emailLangFlag = (lang) => lang === "it" ? "🇮🇹" : "🇬🇧";

  const handleAuth = (e) => {
    e.preventDefault();
    setAuthError("");
    if (authMode === "login") {
      if (registeredUsers[emailInput]) {
         if (registeredUsers[emailInput] === passInput) {
            setIsLoggedIn(true);
         } else {
            setAuthError(uiLang === "fr" ? "Mot de passe incorrect." : "Incorrect password.");
         }
      } else {
         setAuthError(uiLang === "fr" ? "Cet email ne correspond à aucun compte enregistré." : "This email is not registered.");
      }
    } else {
      if (registeredUsers[emailInput]) {
         setAuthError(uiLang === "fr" ? "Ce compte existe déjà. Connectez-vous." : "Account already exists. Please log in.");
      } else {
         const newUsers = { ...registeredUsers, [emailInput]: passInput };
         setRegisteredUsers(newUsers);
         localStorage.setItem("va_users", JSON.stringify(newUsers));
         setIsLoggedIn(true);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", background: c.bg, color: c.text, fontFamily: sans, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        
        {/* Theme toggle corner */}
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ position: "absolute", top: 24, right: 24, padding: "8px 12px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.card, color: c.textMuted, fontSize: 16, cursor: "pointer", transition: "all 0.2s" }}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <div style={{ width: "100%", maxWidth: 400, background: c.card, padding: 40, borderRadius: 24, border: `1px solid ${c.border}`, boxShadow: theme === "dark" ? `0 10px 40px rgba(0,0,0,0.5)` : `0 10px 40px rgba(0,0,0,0.05)`, boxSizing: "border-box" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
             <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${c.accent}, #ff9a5c)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: mono, margin: "0 auto 20px", boxShadow: `0 8px 24px ${c.accentGlow}` }}>VA</div>
             <h2 style={{ margin: 0, fontFamily: mono, fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>ACQUISITION<span style={{ color: c.accent }}>.</span></h2>
             <p style={{ color: c.textDim, fontSize: 14, marginTop: 8 }}>{authMode === "login" ? "Sign in to access your dashboard" : "Create your premium account"}</p>
          </div>
          
          <form onSubmit={handleAuth}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, fontFamily: mono, color: c.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Email</label>
              <input type="email" required value={emailInput} onChange={e=>setEmailInput(e.target.value)} placeholder="you@company.com" style={{ width: "100%", padding: "14px 16px", borderRadius: 11, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", boxSizing: "border-box", fontSize: 14, transition: "border-color 0.2s" }} onFocus={e=>e.target.style.borderColor=c.accent} onBlur={e=>e.target.style.borderColor=c.border} />
            </div>
            <div style={{ marginBottom: 12, position: "relative" }}>
              <label style={{ display: "block", fontSize: 11, fontFamily: mono, color: c.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Password</label>
              <input type={showPass ? "text" : "password"} required value={passInput} onChange={e=>setPassInput(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "14px 40px 14px 16px", borderRadius: 11, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, outline: "none", boxSizing: "border-box", fontSize: 14, transition: "border-color 0.2s" }} onFocus={e=>e.target.style.borderColor=c.accent} onBlur={e=>e.target.style.borderColor=c.border} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, bottom: 12, background: "none", border: "none", color: c.textMuted, cursor: "pointer", fontSize: 16 }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
            {authError && <div style={{ color: c.error, fontSize: 12, marginBottom: 16, background: c.errorBg, padding: "8px 12px", borderRadius: 8 }}>{authError}</div>}
            <button type="submit" style={{ width: "100%", padding: "16px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${c.accent}, #ff9a5c)`, color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: mono, cursor: "pointer", boxShadow: `0 6px 20px ${c.accentGlow}`, transition: "transform 0.1s", marginTop: 8 }} onMouseDown={e=>e.target.style.transform="scale(0.98)"} onMouseUp={e=>e.target.style.transform="scale(1)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}>
              {authMode === "login" ? "Sign In" : "Sign Up"}
            </button>
          </form>
          
          <div style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: c.textDim }}>
            {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span style={{ color: c.accent, cursor: "pointer", fontWeight: 600 }} onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setAuthError(""); }}>
              {authMode === "login" ? "Sign up" : "Log in"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: c.bg, color: c.text, fontFamily: sans, transition: "background 0.3s, color 0.3s" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ background: c.surface, borderBottom: `1px solid ${c.border}`, padding: "16px", transition: "background 0.3s, border-color 0.3s" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${c.accent}, #ff9a5c)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: mono, boxShadow: `0 4px 20px ${c.accentGlow}` }}>VA</div>
            <div>
              <h1 style={{ fontSize: 19, fontWeight: 800, margin: 0, fontFamily: mono, letterSpacing: "-0.5px", color: c.text }}>
                ACQUISITION<span style={{ color: c.accent }}>.</span> <span style={{ fontSize: 11, color: c.accent, fontWeight: 500 }}>PRO</span>
              </h1>
              <p style={{ fontSize: 10.5, color: c.textDim, margin: 0, fontFamily: mono }}>{t.subtitle}</p>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {/* API Status */}
            {backendOk && (
              <>
                <Badge color={backendOk.serper === "✅" ? c.success : c.error} bg={backendOk.serper === "✅" ? c.successSoft : c.errorBg}>🔍 Tavily {backendOk.serper}</Badge>
                <Badge color={backendOk.anthropic?.includes("✅") ? c.success : c.warning} bg={c.accent2Soft}>🤖 {backendOk.anthropic?.includes("✅") ? "Haiku ✅" : "Auto"}</Badge>
                <Badge color={backendOk.gmail === "✅" ? c.success : c.warning} bg={backendOk.gmail === "✅" ? c.successSoft : c.warningBg}>📧 Gmail {backendOk.gmail === "✅" ? "✅" : "⚠️"}</Badge>
              </>
            )}
            {!backendOk && <Badge color={c.error} bg={c.errorBg}>⚠️ Backend offline</Badge>}
            {results.length > 0 && <Badge color={c.success} bg={c.successSoft}>Σ {stats.total}</Badge>}
            {emailsSent > 0 && <Badge color={c.emailBlue} bg={c.emailBlueSoft}>{t.sentCount(emailsSent)}</Badge>}

            {/* Language switcher */}
            <div style={{ display: "flex", gap: 3, background: c.bg, borderRadius: 8, padding: 3, border: `1px solid ${c.border}` }}>
              {["fr", "en", "it"].map(l => (
                <button key={l} onClick={() => setUiLang(l)} style={{
                  padding: "4px 9px", borderRadius: 6, border: "none", fontFamily: mono, fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                  background: uiLang === l ? c.accent : "transparent",
                  color: uiLang === l ? "#fff" : c.textDim,
                }}>{l.toUpperCase()}</button>
              ))}
            </div>

            {/* Theme toggle */}
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{
              padding: "6px 12px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.card, color: c.textMuted,
              fontSize: 15, cursor: "pointer", transition: "all 0.2s", fontFamily: mono,
            }} title={theme === "dark" ? "Light mode" : "Dark mode"}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "20px 16px" }}>

        {/* ── Tabs ──────────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button onClick={() => setCurrentTab("acquisition")} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "none", background: currentTab === "acquisition" ? c.accent : c.card, color: currentTab === "acquisition" ? "#fff" : c.textMuted, fontSize: 14, fontWeight: 700, fontFamily: mono, cursor: "pointer", transition: "all 0.2s" }}>
            🔍 Acquisition
          </button>
          <button onClick={() => setCurrentTab("vetting")} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "none", background: currentTab === "vetting" ? c.accent : c.card, color: currentTab === "vetting" ? "#fff" : c.textMuted, fontSize: 14, fontWeight: 700, fontFamily: mono, cursor: "pointer", transition: "all 0.2s" }}>
            🕵️‍♂️ Vetting (Audience Analysis)
          </button>
        </div>

        {currentTab === "acquisition" ? (
          <>
        {/* ── Config Panel ──────────────────────────────────────────────────── */}
        <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 20, marginBottom: 16, transition: "background 0.3s" }}>

          {/* Platforms */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={{ fontSize: 10, fontFamily: mono, color: c.textMuted, textTransform: "uppercase", letterSpacing: 1.5 }}>
                {t.platforms(selPlatforms.length, PLATFORMS.length)}
              </label>
              <button onClick={() => setSelPlatforms(selPlatforms.length === PLATFORMS.length ? ["web"] : PLATFORMS.map(p => p.id))}
                style={{ fontSize: 10, fontFamily: mono, color: c.textDim, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                {selPlatforms.length === PLATFORMS.length ? t.reset : t.all}
              </button>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {PLATFORMS.map(p => (
                <Chip key={p.id} c={c} selected={selPlatforms.includes(p.id)} onClick={() => toggle(selPlatforms, setSelPlatforms, p.id)} icon={getPlatformIcon(p)}>
                  {p.label}
                </Chip>
              ))}
            </div>
          </div>

          {/* Niches */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 10, fontFamily: mono, color: c.textMuted, textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 10 }}>{t.niches}</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {NICHES.map(n => (
                <Chip key={n.id} c={c} selected={selNiches.includes(n.id)} onClick={() => toggle(selNiches, setSelNiches, n.id)} color={c.accent2}>
                  <NicheIcon svg={n.iconSvg} /> {n.label[uiLang]}
                </Chip>
              ))}
            </div>
          </div>

          {/* Regions */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 10, fontFamily: mono, color: c.textMuted, textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 10 }}>{t.regions}</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {REGIONS.map(r => (
                <Chip key={r.id} c={c} selected={selRegions.includes(r.id)} onClick={() => toggle(selRegions, setSelRegions, r.id)}>
                  {r.label}
                  <span style={{ marginLeft: 6, fontSize: 9, fontFamily: mono, color: c.textDim }}>
                    {r.emailLang === "it" ? "🇮🇹 IT" : "🇬🇧 EN"}
                  </span>
                </Chip>
              ))}
            </div>
          </div>

          {/* Custom */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 10, fontFamily: mono, color: c.textMuted, textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 10 }}>{t.customLabel}</label>
            <input value={customKw} onChange={e => setCustomKw(e.target.value)} placeholder={t.customPH}
              style={{ width: "100%", padding: "11px 14px", borderRadius: 9, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, fontSize: 13, fontFamily: sans, outline: "none", boxSizing: "border-box", transition: "background 0.3s" }}
              onFocus={e => e.target.style.borderColor = c.accent}
              onBlur={e => e.target.style.borderColor = c.border} />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={searching ? () => abortRef.current = true : runSearch}
              disabled={!selPlatforms.length || !selNiches.length || !selRegions.length || !backendOk}
              style={{
                flex: 1, minWidth: 200, padding: "13px 20px", borderRadius: 11, border: "none",
                background: searching ? c.error : `linear-gradient(135deg, ${c.accent}, #ff9a5c)`,
                color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: mono, cursor: "pointer",
                boxShadow: searching ? "none" : `0 4px 24px ${c.accentGlow}`,
                opacity: (!selPlatforms.length || !selNiches.length || !backendOk) ? 0.4 : 1,
                transition: "all 0.2s",
              }}>
              {searching ? t.stop : t.launch(selPlatforms.length)}
            </button>
            {results.length > 0 && (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={clearLeads} style={{ padding: "13px 18px", borderRadius: 11, border: `1.5px solid ${c.error}`, background: c.errorBg, color: c.error, fontSize: 13, fontWeight: 600, fontFamily: mono, cursor: "pointer" }}>
                  🗑️ {uiLang === "fr" ? "Vider" : "Clear"}
                </button>
                <button onClick={exportCSV} style={{ padding: "13px 18px", borderRadius: 11, border: `1.5px solid ${c.success}`, background: c.successSoft, color: c.success, fontSize: 13, fontWeight: 600, fontFamily: mono, cursor: "pointer" }}>
                  {t.csvBtn(filtered.length)}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Terminal ──────────────────────────────────────────────────────── */}
        {logs.length > 0 && (
          <div ref={logRef} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 11, padding: 14, marginBottom: 16, maxHeight: 170, overflowY: "auto", fontFamily: mono, fontSize: 11.5, transition: "background 0.3s" }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.5, color: c.textDim, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              {t.terminal} {phase && <Badge color={c.accent} bg={c.accentSoft}>{phase}</Badge>}
            </div>
            {logs.map((l, i) => (
              <div key={i} style={{ color: l.type === "success" ? c.success : l.type === "error" ? c.error : l.type === "warning" ? c.warning : c.textMuted, marginBottom: 2, lineHeight: 1.6 }}>
                <span style={{ color: c.textDim, marginRight: 8 }}>{l.time}</span>{l.msg}
              </div>
            ))}
            {searching && <span style={{ color: c.accent, animation: "blink 1s infinite" }}>▊</span>}
          </div>
        )}

        {/* ── Filters ───────────────────────────────────────────────────────── */}
        {results.length > 0 && (
          <div style={{ display: "flex", gap: 7, marginBottom: 16, flexWrap: "wrap", alignItems: "center", padding: "10px 14px", background: c.card, border: `1px solid ${c.border}`, borderRadius: 11 }}>
            <span style={{ fontSize: 9.5, fontFamily: mono, color: c.textDim, textTransform: "uppercase", letterSpacing: 1.2, marginRight: 2 }}>{t.filterLabel}</span>
            <Chip c={c} selected={fPlatform === "all"} onClick={() => setFPlatform("all")}>{t.allFilter(results.length)}</Chip>
            {Object.entries(stats.byPlatform).map(([pid, cnt]) => {
              const p = PLATFORMS.find(x => x.id === pid);
              return <Chip key={pid} c={c} selected={fPlatform === pid} onClick={() => setFPlatform(pid)} icon={getPlatformIcon(p)}>{cnt}</Chip>;
            })}
            <span style={{ width: 1, height: 18, background: c.border, margin: "0 3px" }} />
            {Object.entries(stats.byNiche).map(([nid, cnt]) => {
              const n = NICHES.find(x => x.id === nid);
              return n ? <Chip key={nid} c={c} selected={fNiche === nid} onClick={() => setFNiche(fNiche === nid ? "all" : nid)} color={c.accent2}><NicheIcon svg={n.iconSvg} /> {cnt}</Chip> : null;
            })}
          </div>
        )}

        {/* ── Results ───────────────────────────────────────────────────────── */}
        {filtered.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((brand, loopIdx) => {
              const idx = results.indexOf(brand);
              const ni = NICHES.find(n => n.id === brand.niche);
              const isOpen = expandedEmail === idx;
              const emailSt = brand.emailStatus || "idle";
              const gmailOk = backendOk?.gmail === "✅";

              return (
                <div key={idx} style={{ background: c.card, border: `1px solid ${isOpen ? c.borderActive : c.border}`, borderRadius: 13, padding: "16px 18px", transition: "border-color 0.2s, background 0.3s" }}>

                  {/* Brand info */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5, flexWrap: "wrap" }}>
                        <h3 style={{ fontSize: 15.5, fontWeight: 700, margin: 0, color: c.text }}>{brand.name}</h3>
                        <Badge color={brand.score >= 85 ? c.success : brand.score >= 75 ? c.accent : c.warning}
                               bg={brand.score >= 85 ? c.successSoft : brand.score >= 75 ? c.accentSoft : c.warningBg}>
                          {brand.score}/100
                        </Badge>
                        <Badge color={c.textMuted} bg={`rgba(128,128,128,0.08)`}>{brand.platform}</Badge>
                        <Badge color={brand.emailLang === "it" ? "#34d399" : c.emailBlue} bg={brand.emailLang === "it" ? c.successSoft : c.emailBlueSoft}>
                          {emailLangFlag(brand.emailLang)} {brand.emailLang.toUpperCase()}
                        </Badge>
                        {emailSt === "sent" && <Badge color={c.success} bg={c.successSoft}>✉️ {t.sent}</Badge>}
                      </div>
                      <p style={{ fontSize: 12.5, color: c.textMuted, margin: "0 0 8px", lineHeight: 1.5 }}>{brand.description?.slice(0, 200) || "—"}</p>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 6 }}>
                        {ni && <Badge><NicheIcon svg={ni.iconSvg} /> {ni.label[uiLang]}</Badge>}
                        <Badge color={c.success} bg={c.successSoft}>{brand.size}</Badge>
                        {brand.reasoning && <Badge color={c.textDim}>{brand.reasoning}</Badge>}
                      </div>
                      {brand.url && <div style={{ fontSize: 11, color: c.textDim, fontFamily: mono, wordBreak: "break-all" }}>🔗 {brand.url}</div>}
                      {brand.contact !== "À rechercher" && <div style={{ fontSize: 11, color: c.success, fontFamily: mono, marginTop: 2 }}>📧 {brand.contact}</div>}
                      
                      {Object.keys(brand.socials || {}).length > 0 && (
                        <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                          {brand.socials?.instagram && <a href={brand.socials.instagram} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: c.textMuted, fontFamily: mono, background: c.surface, padding: "2px 6px", borderRadius: 4, border: `1px solid ${c.border}`, transition: "filter 0.2s" }} onMouseOver={e=>e.target.style.filter="brightness(1.2)"} onMouseOut={e=>e.target.style.filter="none"}><PlatformIcon src={getPlatformIcon({id:"instagram"})} size={11} /> Instagram</a>}
                          {brand.socials?.tiktok && <a href={brand.socials.tiktok} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: c.textMuted, fontFamily: mono, background: c.surface, padding: "2px 6px", borderRadius: 4, border: `1px solid ${c.border}`, transition: "filter 0.2s" }} onMouseOver={e=>e.target.style.filter="brightness(1.2)"} onMouseOut={e=>e.target.style.filter="none"}><PlatformIcon src={getPlatformIcon({id:"tiktok"})} size={11} /> TikTok</a>}
                          {brand.socials?.facebook && <a href={brand.socials.facebook} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: c.textMuted, fontFamily: mono, background: c.surface, padding: "2px 6px", borderRadius: 4, border: `1px solid ${c.border}`, transition: "filter 0.2s" }} onMouseOver={e=>e.target.style.filter="brightness(1.2)"} onMouseOut={e=>e.target.style.filter="none"}><PlatformIcon src={getPlatformIcon({id:"facebook"})} size={11} /> Facebook</a>}
                          {brand.socials?.pinterest && <a href={brand.socials.pinterest} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: c.textMuted, fontFamily: mono, background: c.surface, padding: "2px 6px", borderRadius: 4, border: `1px solid ${c.border}`, transition: "filter 0.2s" }} onMouseOver={e=>e.target.style.filter="brightness(1.2)"} onMouseOut={e=>e.target.style.filter="none"}><PlatformIcon src={getPlatformIcon({id:"pinterest"})} size={11} /> Pinterest</a>}
                        </div>
                      )}
                      {!brand.socials?.instagram && brand.instagram && <div style={{ fontSize: 11, color: c.accent2, fontFamily: mono, marginTop: 2 }}>📸 {brand.instagram}</div>}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 6, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${c.border}`, flexWrap: "wrap" }}>
                    <button id={`btn-email-${idx}`}
                      onClick={() => {
                        if (emailSt === "idle" || emailSt === "error") generateEmail(brand, idx);
                        else setExpandedEmail(isOpen ? null : idx);
                      }}
                      disabled={emailSt === "generating" || emailSt === "sending"}
                      style={{ padding: "7px 14px", borderRadius: 7, border: `1px solid ${emailStatusColor(emailSt)}`, background: isOpen ? `${emailStatusColor(emailSt)}15` : "transparent", color: emailStatusColor(emailSt), fontSize: 11, fontWeight: 600, fontFamily: mono, cursor: "pointer", opacity: (emailSt === "generating" || emailSt === "sending") ? 0.6 : 1, transition: "all 0.15s" }}>
                      {emailStatusLabel(emailSt)}
                    </button>
                    {brand.generatedEmail && (
                      <button onClick={() => { navigator.clipboard.writeText(brand.generatedEmail.body).catch(()=>{}); setCopiedIdx(`b-${idx}`); setTimeout(()=>setCopiedIdx(null), 2000); }}
                        style={{ padding: "7px 14px", borderRadius: 7, border: `1px solid ${copiedIdx === `b-${idx}` ? c.success : c.border}`, background: copiedIdx === `b-${idx}` ? c.successSoft : "transparent", color: copiedIdx === `b-${idx}` ? c.success : c.textMuted, fontSize: 11, fontWeight: 600, fontFamily: mono, cursor: "pointer" }}>
                        {copiedIdx === `b-${idx}` ? t.copied : t.copyBtn}
                      </button>
                    )}
                    {brand.url && <button onClick={() => window.open(brand.url, "_blank")} style={{ padding: "7px 14px", borderRadius: 7, border: `1px solid ${c.border}`, background: "transparent", color: c.textMuted, fontSize: 11, fontWeight: 600, fontFamily: mono, cursor: "pointer" }}>{t.visit}</button>}
                  </div>

                  {/* Email panel */}
                  {isOpen && brand.generatedEmail && (
                    <div style={{ marginTop: 14, background: c.bg, borderRadius: 10, border: `1px solid ${c.emailBlue}33`, overflow: "hidden", transition: "background 0.3s" }}>
                      <div style={{ padding: "10px 14px", background: `${c.emailBlue}08`, borderBottom: `1px solid ${c.border}`, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10, fontFamily: mono, color: c.textDim, textTransform: "uppercase", letterSpacing: 1.2 }}>{t.emailGenerated}</span>
                        <Badge color={brand.generatedEmail.generatedBy === "claude-haiku" ? c.accent2 : c.textDim} bg={c.accent2Soft}>
                          {brand.generatedEmail.generatedBy === "claude-haiku" ? "🤖 Haiku" : "📝 Template"}
                        </Badge>
                        <Badge color={brand.emailLang === "it" ? c.success : c.emailBlue} bg={brand.emailLang === "it" ? c.successSoft : c.emailBlueSoft}>
                          {emailLangFlag(brand.emailLang)} {brand.emailLang === "it" ? "Italiano" : "English"}
                        </Badge>
                        {emailSt === "sent" && <Badge color={c.success} bg={c.successSoft}>✅ {t.sent}</Badge>}
                      </div>
                      <div style={{ padding: 14 }}>
                        <div style={{ marginBottom: 10 }}>
                          <label style={{ fontSize: 9.5, fontFamily: mono, color: c.textDim, textTransform: "uppercase", letterSpacing: 1.2, display: "block", marginBottom: 5 }}>{t.subjectLbl}</label>
                          <input type="text" 
                                 value={brand.generatedEmail.subject}
                                 onChange={e => updateBrand(idx, { generatedEmail: { ...brand.generatedEmail, subject: e.target.value } })}
                                 disabled={emailSt === "sent" || emailSt === "sending"}
                                 style={{ width: "100%", fontSize: 13, fontWeight: 600, color: c.text, padding: "8px 12px", background: c.surface, borderRadius: 7, border: `1px solid ${c.border}`, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                                 onFocus={e => e.target.style.borderColor = c.emailBlue}
                                 onBlur={e => e.target.style.borderColor = c.border} />
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <label style={{ fontSize: 9.5, fontFamily: mono, color: c.textDim, textTransform: "uppercase", letterSpacing: 1.2, display: "block", marginBottom: 5 }}>{t.bodyLbl}</label>
                          <textarea 
                            value={brand.generatedEmail.body}
                            onChange={e => updateBrand(idx, { generatedEmail: { ...brand.generatedEmail, body: e.target.value } })}
                            disabled={emailSt === "sent" || emailSt === "sending"}
                            style={{ width: "100%", minHeight: 220, fontSize: 13, fontFamily: sans, color: c.textMuted, margin: 0, lineHeight: 1.6, padding: "12px 14px", background: c.surface, borderRadius: 7, border: `1px solid ${c.border}`, outline: "none", boxSizing: "border-box", resize: "vertical", transition: "border-color 0.2s" }}
                            onFocus={e => e.target.style.borderColor = c.emailBlue}
                            onBlur={e => e.target.style.borderColor = c.border} />
                        </div>
                        {emailSt !== "sent" && (
                          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
                            <div style={{ flex: 1, minWidth: 200 }}>
                              <label style={{ fontSize: 9.5, fontFamily: mono, color: c.textDim, textTransform: "uppercase", letterSpacing: 1.2, display: "block", marginBottom: 5 }}>{t.recipient}</label>
                              <input type="email" value={brand.emailTo || ""} onChange={e => updateBrand(idx, { emailTo: e.target.value })}
                                placeholder="email@brand.com"
                                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${brand.emailTo ? c.emailBlue : c.border}`, background: c.surface, color: c.text, fontSize: 13, fontFamily: mono, outline: "none", boxSizing: "border-box" }}
                                onFocus={e => e.target.style.borderColor = c.emailBlue}
                                onBlur={e => e.target.style.borderColor = brand.emailTo ? c.emailBlue : c.border} />
                            </div>
                            <div>
                              {!gmailOk ? (
                                <div style={{ fontSize: 11, color: c.warning, fontFamily: mono, lineHeight: 1.5 }}>⚠️ {t.gmailWarn}</div>
                              ) : (
                                <button id={`btn-send-${idx}`} onClick={() => sendEmail(brand, idx)}
                                  disabled={!brand.emailTo || emailSt === "sending"}
                                  style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: brand.emailTo ? `linear-gradient(135deg, ${c.emailBlue}, #818cf8)` : c.surface, color: brand.emailTo ? "#fff" : c.textDim, fontSize: 12, fontWeight: 700, fontFamily: mono, cursor: brand.emailTo ? "pointer" : "not-allowed", opacity: emailSt === "sending" ? 0.6 : 1, boxShadow: brand.emailTo ? `0 4px 16px ${c.emailBlueSoft}` : "none", transition: "all 0.15s" }}>
                                  {emailSt === "sending" ? t.sending : t.sendBtn}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────────────────── */}
        {!searching && !results.length && !logs.length && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: c.textDim }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>🎯</div>
            <p style={{ fontSize: 15, color: c.textMuted, marginBottom: 8 }}>
              {backendOk ? t.emptyOk : t.emptyOffline}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 12 }}>
              {PLATFORMS.map(p => (
                <span key={p.id} style={{ fontSize: 11, color: c.textDim, fontFamily: mono, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <PlatformIcon src={getPlatformIcon(p)} size={12} />{p.label}
                </span>
              ))}
            </div>
            {backendOk && backendOk.gmail !== "✅" && (
              <div style={{ marginTop: 20, padding: "14px 20px", background: c.warningBg, border: `1px solid ${c.warning}33`, borderRadius: 10, maxWidth: 480, margin: "20px auto 0", textAlign: "left" }}>
                <div style={{ fontSize: 12, color: c.warning, fontFamily: mono, fontWeight: 600, marginBottom: 8 }}>{t.gmailSetupTitle}</div>
                <div style={{ fontSize: 11.5, color: c.textMuted, lineHeight: 1.9 }}>
                  1. {t.gmailStep1} <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" style={{ color: c.emailBlue }}>myaccount.google.com/apppasswords</a><br/>
                  2. {t.gmailStep2}<br/>
                  3. {t.gmailStep3} <code style={{ color: c.accent, background: c.accentSoft, padding: "1px 5px", borderRadius: 3 }}>GMAIL_APP_PASSWORD</code> dans <code style={{ color: c.accent, background: c.accentSoft, padding: "1px 5px", borderRadius: 3 }}>.env</code><br/>
                  4. {t.gmailStep4} <code style={{ color: c.accent, background: c.accentSoft, padding: "1px 5px", borderRadius: 3 }}>node server.js</code>
                </div>
              </div>
            )}
          </div>
        )}
          </>
        ) : (
          <VettingTab c={c} mono={mono} API_URL={API_URL} uiLang={uiLang} t={t} />
        )}
      </div>

      <style>{`
        @keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${c.border};border-radius:3px}
        button:hover:not(:disabled){filter:brightness(1.12)}
        a{text-decoration:none}a:hover{text-decoration:underline}
        input{transition:border-color 0.15s}
      `}</style>
    </div>
  );
}
