import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import VettingTab from "./VettingTab";
import MatchmakingTab from "./MatchmakingTab";
import AdSpyTab from "./AdSpyTab";
import ProductFinderTab from "./ProductFinderTab";
import ShopAnalyzerTab from "./ShopAnalyzerTab";
import TalentAgencyTab from "./TalentAgencyTab";
import BrandPortalTab from "./BrandPortalTab";
import ContractGeneratorTab from "./ContractGeneratorTab";
import ResourcesTab from "./ResourcesTab";
import LandingPage from "./LandingPage";
import Badge from "./Badge";
import DashboardLayout from "./DashboardLayout";
import { supabase } from "./supabaseClient";
import { apiFetch } from "./utils/apiClient";

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
    // Vetting Tab
    vettingTitle:    "Analyse de Profils (Vetting)",
    vettingDesc:     "Détectez les faux abonnés et analysez la qualité de l'audience d'un influenceur avant de le proposer à vos clients.",
    vettingPh:       "@pseudo ou lien du profil",
    vettingBtn:      "Analyser",
    vettingBtnLoad:  "Analyse...",
    vettingErr:      "Une erreur est survenue",
    vettingSub:      "abonnés",
    vettingEng:      "d'engagement",
    vettingAi:       "🤖 Analyse IA (Commentaires & Audience)",
    vettingPosts:    "Derniers Posts",
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
    // Vetting Tab
    vettingTitle:    "Profile Vetting",
    vettingDesc:     "Detect fake followers and analyze influencer audience quality before proposing them to clients.",
    vettingPh:       "@username or profile link",
    vettingBtn:      "Analyze",
    vettingBtnLoad:  "Analyzing...",
    vettingErr:      "An error occurred",
    vettingSub:      "followers",
    vettingEng:      "engagement",
    vettingAi:       "🤖 AI Analysis (Comments & Audience)",
    vettingPosts:    "Latest Posts",
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
    // Vetting Tab
    vettingTitle:    "Analisi dei Profili (Vetting)",
    vettingDesc:     "Rileva follower falsi e analizza la qualità dell'audience degli influencer prima di proporli ai clienti.",
    vettingPh:       "@username o link del profilo",
    vettingBtn:      "Analizza",
    vettingBtnLoad:  "Analisi...",
    vettingErr:      "Si è verificato un errore",
    vettingSub:      "follower",
    vettingEng:      "di engagement",
    vettingAi:       "🤖 Analisi AI (Commenti & Pubblico)",
    vettingPosts:    "Ultimi Post",
  },
};

// ─── Themes ───────────────────────────────────────────────────────────────────
const DARK = {
  bg: "#080810", surface: "#0f0f20", card: "#15152c",
  border: "rgba(139, 92, 246, 0.15)", borderActive: "#8B5CF6",
  accent: "#8B5CF6", accentSoft: "rgba(139, 92, 246, 0.12)", accentGlow: "rgba(139, 92, 246, 0.35)",
  accent2: "#ec4899", accent2Soft: "rgba(236, 72, 153, 0.12)",
  text: "#f3f4f6", textMuted: "#9ca3af", textDim: "#6b7280",
  success: "#10b981", successSoft: "rgba(16, 185, 129, 0.12)",
  warning: "#f59e0b", warningBg: "rgba(245, 158, 11, 0.12)",
  error: "#ef4444", errorBg: "rgba(239, 68, 68, 0.12)",
  emailBlue: "#3b82f6", emailBlueSoft: "rgba(59, 130, 246, 0.12)",
  iconFilter: "invert(1) brightness(2)",
  tiktokIcon: "https://cdn.simpleicons.org/tiktok/ffffff",
  ebayIcon:   "https://cdn.simpleicons.org/ebay/ffffff",
  googleIcon: "https://cdn.simpleicons.org/google/aaaaaa",
};

const LIGHT = {
  bg: "#f3f4f6", surface: "#ffffff", card: "#f9fafb",
  border: "#e5e7eb", borderActive: "#8B5CF6",
  accent: "#8B5CF6", accentSoft: "rgba(139, 92, 246, 0.08)", accentGlow: "rgba(139, 92, 246, 0.2)",
  accent2: "#ec4899", accent2Soft: "rgba(236, 72, 153, 0.08)",
  text: "#1f2937", textMuted: "#4b5563", textDim: "#9ca3af",
  success: "#059669", successSoft: "rgba(5, 150, 105, 0.08)",
  warning: "#d97706", warningBg: "rgba(217, 119, 6, 0.08)",
  error: "#dc2626", errorBg: "rgba(220, 38, 38, 0.08)",
  emailBlue: "#2563eb", emailBlueSoft: "rgba(37, 99, 235, 0.08)",
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

// ─── Main App ─────────────────────────────────────────────────────────────────
// La construction des requêtes et le parsing des résultats sont délégués au backend
// via POST /api/campaigns/start → campaignManager.js → src/utils/queryBuilder.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function ProspectionAgent() {
  const [theme, setTheme]               = useState("dark");
  const [uiLang, setUiLang]             = useState("fr");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactFormStatus, setContactFormStatus] = useState('idle');
  const [selNiches, setSelNiches]       = useState(["beauty", "food"]);
  const [selTarget, setSelTarget]       = useState("influencers");
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
  const [userTier, setUserTier]           = useState("free");
  const [userRole, setUserRole]           = useState("user");
  const [userId, setUserId]               = useState(null);
  const [selectedSignupTier, setSelectedSignupTier] = useState("standard");
  const [signupRole, setSignupRole] = useState("brand");
  const [showUpgradeModal, setShowUpgradeModal]     = useState(false);
  const [upgradeModalData, setUpgradeModalData]     = useState({ tab: "", title: "", reason: "" });
  const [isUpgradingSim, setIsUpgradingSim]         = useState(false);
  const [upgradeSimSuccess, setUpgradeSimSuccess]   = useState(false);
  const [shopAnalysisCount, setShopAnalysisCount]   = useState(0);

  const [currentTab, setCurrentTab]       = useState("adspy");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoContent, setInfoContent] = useState({ title: "", text: "" });
  const [legalType, setLegalType] = useState("");
  const [researchMenuOpen, setResearchMenuOpen] = useState(true);
  const [redirectShop, setRedirectShop]   = useState(null);
  const [authMode, setAuthMode]           = useState("login");
  const [emailInput, setEmailInput]       = useState("");
  const [passInput, setPassInput]         = useState("");
  const [authError, setAuthError]         = useState("");
  const logRef   = useRef(null);
  const abortRef = useRef(false);
  const [appToast, setAppToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showAppToast = (message, type = "success") => {
    clearTimeout(toastTimerRef.current);
    setAppToast({ message, type });
    toastTimerRef.current = setTimeout(() => setAppToast(null), 4000);
  };

  // ─── Supabase Auth ───────────────────────────────────────────────────────────
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setEmailInput(session.user.email || "");
        setIsLoggedIn(true);
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, plan")
          .eq("id", session.user.id)
          .single();
        if (profile) {
          setUserRole(profile.role);
          setUserTier(profile.role === "admin" ? "admin" : profile.plan);
          const today = new Date().toISOString().split("T")[0];
          const { data: usage } = await supabase
            .from("shop_analysis_usage")
            .select("count")
            .eq("user_id", session.user.id)
            .eq("analysis_date", today)
            .single();
          setShopAnalysisCount(usage?.count ?? 0);
        }
      } else {
        setIsLoggedIn(false);
        setUserTier("free");
        setUserRole("user");
        setUserId(null);
        setShopAnalysisCount(0);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const importLeadFromAdSpy = useCallback((lead) => {
    // Enforce Standard tier limit of 10 Sourcing CRM leads
    if (userTier === "standard" && results.length >= 10) {
      setUpgradeModalData({
        tab: "acquisition",
        title: uiLang === "fr" ? "Limite de Sourcing CRM Atteinte" : "Sourcing CRM Limit Reached",
        reason: uiLang === "fr" 
          ? "Le forfait Standard limite votre Sourcing CRM à 10 prospects qualifiés. Passez au niveau VIP Pro ou VIP Elite pour importer des leads en illimité !" 
          : "The Standard plan limits your Sourcing CRM to 10 qualified prospects. Upgrade to VIP Pro or VIP Elite to unlock unlimited lead imports!"
      });
      setShowUpgradeModal(true);
      return;
    }

    setResults(prev => {
      if (prev.some(x => x.name === lead.name && x.platformId === lead.platformId)) {
        showAppToast(uiLang === "fr" ? "Ce lead a déjà été importé !" : "Questo lead è già stato importato!", "warning");
        return prev;
      }
      const updated = [lead, ...prev];
      const st = { total: updated.length, byPlatform: {}, byNiche: {} };
      updated.forEach(r => {
        st.byPlatform[r.platformId] = (st.byPlatform[r.platformId] || 0) + 1;
        st.byNiche[r.niche] = (st.byNiche[r.niche] || 0) + 1;
      });
      setStats(st);
      
      // Enregistrer sur le backend
      apiFetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailTo: lead.contact === "À rechercher" ? `no-email-${Math.random().toString(36).slice(2, 7)}@viral.com` : lead.contact,
          brandName: lead.name,
          platform: lead.platformId,
          url: lead.url,
          niche: lead.niche,
          region: lead.region,
          emailStatus: "draft"
        })
      }).catch(console.error);

      return updated;
    });
    setCurrentTab("acquisition");
  }, [uiLang]);

  const c  = theme === "dark" ? DARK : LIGHT;
  const t  = T[uiLang];

  // Adjust icon colors for light/dark theme
  const getPlatformIcon = (p) => {
    if (!p) return null;
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
      apiFetch(`${API_URL}/api/leads`)
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
      apiFetch(`${API_URL}/api/campaigns/status`)
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
          const r = await apiFetch(`${API_URL}/api/campaigns/status`);
          const data = await r.json();
          setPhase(data.phase);
          setLogs(data.logs);
          if (!data.isRunning && searching) {
            setSearching(false);
            setPhase("");
            // Refresh leads at the end
            apiFetch(`${API_URL}/api/leads`)
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
      const r = await apiFetch(`${API_URL}/api/generate-email`, {
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
      const r = await apiFetch(`${API_URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: brand.emailTo, subject: brand.generatedEmail.subject, body: brand.generatedEmail.body, brandName: brand.name }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Error");
      if (data.simulated) {
        updateBrand(idx, { emailStatus: "ready" });
        showAppToast("📭 Email simulé (Gmail non configuré)", "warning");
        return;
      }
      updateBrand(idx, { emailStatus: "sent" });
      setEmailsSent(n => n + 1);
    } catch (err) {
      updateBrand(idx, { emailStatus: "error" });
      showAppToast(`❌ ${err.message}`, "error");
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
      const res = await apiFetch(`${API_URL}/api/campaigns/start`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selTarget, selPlatforms, selNiches, selRegions, customKw, emailInput }),
      });
      if (!res.ok) throw new Error("Erreur serveur");
    } catch (err) {
      setSearching(false);
      addLog(`⚠️ Erreur de connexion au backend: ${err.message}`, "error");
    }
  };

  const sendAllDrafts = async () => {
    const drafts = results.map((r, i) => ({ r, i })).filter(item => item.r.generatedEmail && item.r.emailStatus === 'draft');
    if (drafts.length === 0) { showAppToast(uiLang === "fr" ? "Aucun email en brouillon à envoyer." : "Nessuna email in bozza da inviare.", "warning"); return; }
    showAppToast(uiLang === "fr" ? `Envoi de ${drafts.length} e-mails en cours…` : `Invio di ${drafts.length} email in corso…`, "info");

    for (const { r, i } of drafts) {
      await sendEmail(r, i);
      await new Promise(res => setTimeout(res, 2000));
    }
    showAppToast(uiLang === "fr" ? "Envoi de masse terminé !" : "Invio massivo completato!");
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
    if (!window.confirm(uiLang === "fr" ? "Vider tous les résultats ?" : "Clear all results?")) return; // gardé pour destructive action
    try {
      await apiFetch(`${API_URL}/api/leads`, { method: 'DELETE' });
      setResults([]);
    } catch {}
  };

  const filtered = results
    .filter(r => (fPlatform === "all" || r.platformId === fPlatform) && (fNiche === "all" || r.niche === fNiche))
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const handleTabChange = (tabId) => {
    const isFullAccess = userTier === "admin" || userTier === "pro" || userTier === "elite" || userTier === "vip_pro" || userTier === "vip_elite";
    if (isFullAccess) {
      setCurrentTab(tabId);
      return;
    }
    const proOnlyTabs = ["acquisition", "vetting", "matchmaking", "resources"];
    if (proOnlyTabs.includes(tabId)) {
      setUpgradeModalData({
        tab: tabId,
        title: uiLang === "fr" ? "🔥 Module Réservé aux Membres Pro" : "🔥 Pro Members Only",
        reason: uiLang === "fr"
          ? "Le Sourcing CRM, le Vetting IA, le Matchmaking et les Ressources exclusives sont réservés aux forfaits Pro et Elite. Passez au niveau supérieur pour débloquer l'accès complet."
          : "Sourcing CRM, AI Vetting, Matchmaking and exclusive Resources are reserved for Pro and Elite plans. Upgrade to unlock full access."
      });
      setShowUpgradeModal(true);
      return;
    }
    setCurrentTab(tabId);
  };

  const handleUpgradeSimulate = (planId) => {
    setIsUpgradingSim(true);
    setUpgradeSimSuccess(false);
    setTimeout(() => {
      setIsUpgradingSim(false);
      setUpgradeSimSuccess(true);
      setTimeout(async () => {
        setUserTier(planId);
        if (userId) {
          await supabase.from("profiles").update({ plan: planId }).eq("id", userId);
        }
        setUpgradeSimSuccess(false);
        setShowUpgradeModal(false);
        if (upgradeModalData.tab) {
          setCurrentTab(upgradeModalData.tab);
        }
      }, 1500);
    }, 2000);
  };

  const handleAnalyzeStore = () => {
    const limit = userTier === "free" ? 2 : userTier === "standard" ? 5 : Infinity;
    if (limit !== Infinity && shopAnalysisCount >= limit) {
      setUpgradeModalData({
        tab: "shopanalyzer",
        title: uiLang === "fr" ? "Limite d'Analyses de Boutiques" : "Competitor Shop Analysis Limit",
        reason: uiLang === "fr"
          ? `Votre forfait ${userTier === "free" ? "Gratuit" : "Standard"} vous limite à ${limit} analyses par jour. Passez au forfait Pro ou Elite pour analyser en illimité !`
          : `Your ${userTier === "free" ? "Free" : "Standard"} plan limits you to ${limit} competitor shop analyses per day. Upgrade to Pro or Elite for unlimited access!`
      });
      setShowUpgradeModal(true);
      return false;
    }
    if (limit !== Infinity) {
      const newCount = shopAnalysisCount + 1;
      setShopAnalysisCount(newCount);
      if (userId) {
        const today = new Date().toISOString().split("T")[0];
        supabase.from("shop_analysis_usage").upsert(
          { user_id: userId, analysis_date: today, count: newCount },
          { onConflict: "user_id,analysis_date" }
        ).then(() => {});
      }
    }
    return true;
  };

  const emailStatusColor = (s) => ({ idle: c.textDim, generating: c.warning, ready: c.emailBlue, sending: c.warning, sent: c.success, error: c.error }[s] || c.textDim);
  const emailStatusLabel = (s) => ({ idle: t.emailBtn, generating: t.generating, ready: t.emailReady, sending: t.sending, sent: t.sent, error: t.errorLbl }[s] || t.emailBtn);

  const emailLangFlag = (lang) => lang === "it" ? "🇮🇹" : "🇬🇧";

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (emailInput === "brejnevdiaz@gmail.com" && passInput === "B1ss0u@k1") {
      // Bypass total des sécurités Supabase pour le propriétaire
      setIsLoggedIn(true);
      setUserRole("admin");
      setUserTier("elite");
      setAuthError("");
      return; 
    }

    if (authMode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passInput,
      });
      if (error) {
        setAuthError(uiLang === "fr" ? "Email ou mot de passe incorrect." : uiLang === "it" ? "Email o password errata." : "Incorrect email or password.");
      }
      // onAuthStateChange handles isLoggedIn / userTier / userRole updates
    } else {
      const { error } = await supabase.auth.signUp({
        email: emailInput,
        password: passInput,
      });
      if (error) {
        setAuthError(error.message);
        return;
      }
      // Simulate paid checkout flow for non-free plans
      if (selectedSignupTier !== "free") {
        setIsUpgradingSim(true);
        setUpgradeSimSuccess(false);
        setTimeout(() => {
          setIsUpgradingSim(false);
          setUpgradeSimSuccess(true);
          setTimeout(async () => {
            setUpgradeSimSuccess(false);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from("profiles").update({ plan: selectedSignupTier }).eq("id", user.id);
              setUserTier(selectedSignupTier);
            }
          }, 1500);
        }, 2000);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <LandingPage
        uiLang={uiLang} setUiLang={setUiLang}
        authMode={authMode} setAuthMode={setAuthMode}
        showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal}
        emailInput={emailInput} setEmailInput={setEmailInput}
        passInput={passInput} setPassInput={setPassInput}
        handleAuth={handleAuth}
        showContactModal={showContactModal} setShowContactModal={setShowContactModal}
        contactFormStatus={contactFormStatus} setContactFormStatus={setContactFormStatus}
        showInfoModal={showInfoModal} setShowInfoModal={setShowInfoModal}
        infoContent={infoContent} setInfoContent={setInfoContent}
        showLegalModal={showLegalModal} setShowLegalModal={setShowLegalModal}
        legalType={legalType} setLegalType={setLegalType}
      />
    );
  }

  return (
    <>
      <DashboardLayout
        c={c} mono={mono} currentTab={currentTab} handleTabChange={handleTabChange}
        researchMenuOpen={researchMenuOpen} setResearchMenuOpen={setResearchMenuOpen}
        userTier={userTier} setShowUpgradeModal={setShowUpgradeModal}
        profileMenuOpen={profileMenuOpen} setProfileMenuOpen={setProfileMenuOpen}
        userId={userId} uiLang={uiLang} setUiLang={setUiLang} theme={theme} setTheme={setTheme}
        mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}
        userRole={userRole} backendOk={backendOk} resultsCount={results.length}
        statsTotal={stats.total} emailsSent={emailsSent} t={t}
      >

        
        {userRole === 'creator' && currentTab !== 'talentagency' && currentTab !== 'resources' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#09090b', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', padding: 40 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>{uiLang === 'fr' ? 'Espace réservé aux Marques' : 'Brand Only Area'}</h2>
            <p style={{ color: '#A1A1AA', fontSize: 15, maxWidth: 400, lineHeight: 1.6, marginBottom: 32 }}>
              {uiLang === 'fr' 
                ? "En tant que Créateur UGC, cette section de recherche et d'espionnage ne vous est pas accessible. Votre espace de gestion des missions se trouve dans l'onglet Talents & Gigs."
                : "As a UGC Creator, this research and spy section is locked. Your mission management workspace is in the Talents & Gigs tab."}
            </p>
            <button onClick={() => setCurrentTab('talentagency')} style={{ background: '#10B981', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              {uiLang === 'fr' ? 'Aller à mes missions' : 'Go to my missions'}
            </button>
          </div>
        ) : currentTab === "adspy" ? (
          <AdSpyTab c={c} mono={mono} API_URL={API_URL} onImportLead={importLeadFromAdSpy} uiLang={uiLang} setCurrentTab={setCurrentTab} setRedirectShop={setRedirectShop} userTier={userTier} />
        ) : currentTab === "productfinder" ? (
          <ProductFinderTab c={c} mono={mono} API_URL={API_URL} onImportLead={importLeadFromAdSpy} uiLang={uiLang} userTier={userTier} />
        ) : currentTab === "acquisition" ? (
          <>
        {/* ── Config Panel ──────────────────────────────────────────────────── */}
        <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 20, marginBottom: 16, transition: "background 0.3s" }}>

          {/* Target Type */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 10, fontFamily: mono, color: c.textMuted, textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 10 }}>
              Cible de la prospection
            </label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Chip c={c} selected={selTarget === "brands"} onClick={() => setSelTarget("brands")}>
                🏢 Marques E-commerce
              </Chip>
              <Chip c={c} selected={selTarget === "influencers"} onClick={() => setSelTarget("influencers")}>
                🌟 Influenceurs / Créateurs
              </Chip>
            </div>
          </div>

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
                <button onClick={sendAllDrafts} disabled={results.filter(r=>r.emailStatus==='draft').length === 0} style={{ padding: "13px 18px", borderRadius: 11, border: `1.5px solid ${c.emailBlue}`, background: results.filter(r=>r.emailStatus==='draft').length > 0 ? c.emailBlueSoft : 'transparent', color: results.filter(r=>r.emailStatus==='draft').length > 0 ? c.emailBlue : c.textMuted, fontSize: 13, fontWeight: 600, fontFamily: mono, cursor: results.filter(r=>r.emailStatus==='draft').length > 0 ? "pointer" : "not-allowed" }}>
                  🚀 Mass Mail ({results.filter(r=>r.emailStatus==='draft').length})
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
              const p = PLATFORMS.find(x => x.id.toLowerCase() === pid.toLowerCase() || x.label.toLowerCase() === pid.toLowerCase());
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
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "nowrap" }}>
                    
                    {/* Real Brand/Creator Logo (Minea-like Clearbit enrichment) */}
                    {(() => {
                      let domain = "";
                      try {
                        if (brand.url && brand.url.startsWith("http")) {
                          domain = new URL(brand.url).hostname.replace("www.", "");
                        }
                      } catch (e) {}
                      return (
                        <div style={{
                          width: 48, height: 48, borderRadius: 10,
                          background: `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)`,
                          border: `1.5px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center",
                          overflow: "hidden", flexShrink: 0, marginTop: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                        }}>
                          <img 
                            src={domain ? `https://logo.clearbit.com/${domain}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&background=8B5CF6&color=fff&size=100&rounded=false`} 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&background=8B5CF6&color=fff&size=100&rounded=false`;
                            }}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            alt="" 
                          />
                        </div>
                      );
                    })()}

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
                        {brand.sourcedAt && (
                          <Badge color={c.accent2} bg={c.accent2Soft}>
                            📅 {new Date(brand.sourcedAt).toLocaleString(uiLang === 'fr' ? 'fr-FR' : (uiLang === 'it' ? 'it-IT' : 'en-US'))}
                          </Badge>
                        )}
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
                    {brand.url && <button onClick={() => window.open(brand.url, "_blank")} style={{ padding: "7px 14px", borderRadius: 7, border: `1px solid ${c.border}`, background: brand.reason?.includes("INFLUENCER") ? "rgba(225, 48, 108, 0.1)" : "transparent", color: brand.reason?.includes("INFLUENCER") ? "#E1306C" : c.textMuted, fontSize: 11, fontWeight: 600, fontFamily: mono, cursor: "pointer" }}>{brand.reason?.includes("INFLUENCER") ? "📱 Voir Profil & DM" : t.visit}</button>}
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
        ) : currentTab === "vetting" ? (
          <VettingTab c={c} mono={mono} API_URL={API_URL} uiLang={uiLang} t={(k) => t[k] || k} userId={userId} />
        ) : currentTab === "shopanalyzer" ? (
          <ShopAnalyzerTab c={c} mono={mono} API_URL={API_URL} onImportLead={importLeadFromAdSpy} uiLang={uiLang} redirectShop={redirectShop} setRedirectShop={setRedirectShop} userTier={userTier} onAnalyzeStore={handleAnalyzeStore} />
        ) : currentTab === "talentagency" ? (
          <TalentAgencyTab c={c} mono={mono} API_URL={API_URL} uiLang={uiLang} onImportLead={importLeadFromAdSpy} userPlan={userTier} userId={userId} />
        ) : currentTab === "brandportal" ? (
          <BrandPortalTab c={c} mono={mono} uiLang={uiLang} API_URL={API_URL} />
        ) : currentTab === "contractgenerator" ? (
          <ContractGeneratorTab c={c} mono={mono} API_URL={API_URL} uiLang={uiLang} />
        ) : currentTab === "resources" ? (
          <ResourcesTab c={c} mono={mono} uiLang={uiLang} userTier={userTier} onUpgradeTier={handleUpgradeSimulate} />
        ) : (
          <MatchmakingTab c={c} mono={mono} API_URL={API_URL} uiLang={uiLang} />
        )}
      </DashboardLayout>

      {/* ── UPGRADE MODAL (STUNNING GLASSMORPHIC COMPARISON DESIGN) ── */}
      {showUpgradeModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(6, 6, 12, 0.8)", backdropFilter: "blur(14px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 20, color: c.text, fontFamily: sans
        }}>
          <div style={{
            background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 24,
            width: "100%", maxWidth: 660, padding: 32, position: "relative",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column",
            overflow: "hidden"
          }}>
            {/* Simulated checkout loader overlay inside modal */}
            {isUpgradingSim && (
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(8, 8, 16, 0.95)", backdropFilter: "blur(10px)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                zIndex: 100, textAlign: "center", borderRadius: 24
              }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", border: `3px solid ${c.accent}22`, borderTopColor: c.accent, animation: "spin 1s linear infinite", marginBottom: 20 }}></div>
                <h3 style={{ fontSize: 18, color: "#fff", fontWeight: 700, margin: "0 0 8px 0" }}>
                  {uiLang === "fr" ? "Traitement de l'abonnement..." : "Processing secure subscription..."}
                </h3>
                <p style={{ fontSize: 13, color: c.textDim, fontFamily: mono, margin: 0 }}>
                  🔐 Stripe Secure Checkout Simulation
                </p>
              </div>
            )}

            {upgradeSimSuccess && (
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(8, 8, 16, 0.95)", backdropFilter: "blur(10px)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                zIndex: 100, textAlign: "center", borderRadius: 24
              }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: c.successSoft, display: "flex", alignItems: "center", justifyContent: "center", color: c.success, fontSize: 32, marginBottom: 20, border: `2px solid ${c.success}` }}>✓</div>
                <h3 style={{ fontSize: 20, color: "#fff", fontWeight: 800, margin: "0 0 8px 0" }}>
                  {uiLang === "fr" ? "Abonnement Activé ! 🎉" : "Subscription Activated! 🎉"}
                </h3>
                <p style={{ fontSize: 13, color: c.textMuted, margin: 0 }}>
                  {uiLang === "fr" ? "Bienvenue dans le club premium de ViralAcq Pro !" : "Welcome to the premium suite of ViralAcq Pro!"}
                </p>
              </div>
            )}

            {/* Close */}
            <button onClick={() => setShowUpgradeModal(false)} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: c.textDim, fontSize: 20, cursor: "pointer" }}>✖</button>
            
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <span style={{ fontSize: 36 }}>💎</span>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "8px 0 6px 0", letterSpacing: "-0.5px" }}>{upgradeModalData.title}</h3>
              <p style={{ fontSize: 13.5, color: c.textMuted, margin: 0, lineHeight: 1.5 }}>{upgradeModalData.reason}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              
              {/* VIP Pro card option */}
              <div style={{
                background: "rgba(0,0,0,0.2)", border: `1.5px solid ${c.accent2}44`, borderRadius: 16, padding: 18,
                display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative"
              }}>
                <div>
                  <span style={{ fontSize: 10, background: c.accent2Soft, color: c.accent2, padding: "2px 8px", borderRadius: 4, fontWeight: "bold", textTransform: "uppercase", fontFamily: mono, display: "inline-block", marginBottom: 6 }}>Pro</span>
                  <h4 style={{ margin: "0 0 4px 0", fontSize: 15, fontWeight: 800, color: "#fff" }}>VIP Pro Plan</h4>
                  <p style={{ margin: 0, fontSize: 11.5, color: c.textDim, lineHeight: 1.4 }}>
                    {uiLang === "fr" ? "Accès illimité aux outils (Spy, CRM, Sourcing) + 2 Coachings Live & 2 Blogs par mois." : "Full workspace access + 2 Live Coachings & 2 case study blogs/mo."}
                  </p>
                </div>
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: c.accent2, fontFamily: mono }}>3999 €<span style={{ fontSize: 11, color: c.textDim, fontWeight: 400 }}> /mois</span></div>
                  <button onClick={() => handleUpgradeSimulate("vip_pro")} style={{ width: "100%", marginTop: 10, padding: "10px", borderRadius: 8, border: "none", background: c.accent2, color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: mono, cursor: "pointer", boxShadow: `0 4px 12px ${c.accent2Soft}` }}>
                    {uiLang === "fr" ? "Activer VIP Pro ➔" : "Subscribe VIP Pro ➔"}
                  </button>
                </div>
              </div>

              {/* VIP Elite card option */}
              <div style={{
                background: "rgba(0,0,0,0.2)", border: `1.5px solid ${c.success}44`, borderRadius: 16, padding: 18,
                display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative"
              }}>
                <div>
                  <span style={{ fontSize: 10, background: c.successSoft, color: c.success, padding: "2px 8px", borderRadius: 4, fontWeight: "bold", textTransform: "uppercase", fontFamily: mono, display: "inline-block", marginBottom: 6 }}>Elite</span>
                  <h4 style={{ margin: "0 0 4px 0", fontSize: 15, fontWeight: 800, color: "#fff" }}>VIP Elite Plan</h4>
                  <p style={{ margin: 0, fontSize: 11.5, color: c.textDim, lineHeight: 1.4 }}>
                    {uiLang === "fr" ? "Accès illimité à TOUTE l'application e-commerce + Coaching Vidéo Hebdomadaire & Blog en illimité." : "Total e-commerce access + Weekly Video Coaching & unlimited strategy blog."}
                  </p>
                </div>
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: c.success, fontFamily: mono }}>5999 €<span style={{ fontSize: 11, color: c.textDim, fontWeight: 400 }}> /mois</span></div>
                  <button onClick={() => handleUpgradeSimulate("vip_elite")} style={{ width: "100%", marginTop: 10, padding: "10px", borderRadius: 8, border: "none", background: c.success, color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: mono, cursor: "pointer", boxShadow: `0 4px 12px ${c.successSoft}` }}>
                    {uiLang === "fr" ? "Activer VIP Elite ➔" : "Subscribe VIP Elite ➔"}
                  </button>
                </div>
              </div>

            </div>

            {userTier === "free" && (
              <button onClick={() => handleUpgradeSimulate("standard")} style={{ width: "100%", padding: "12px", borderRadius: 10, border: `1.5px solid ${c.accent}`, background: `${c.accent}15`, color: c.accent, fontSize: 12.5, fontWeight: 700, fontFamily: mono, cursor: "pointer", transition: "all 0.2s" }}>
                {uiLang === "fr" ? "Ou souscrire au forfait Standard à 39 € / mois ➔" : "Or subscribe to the Standard plan at 39 € / month ➔"}
              </button>
            )}
          </div>
        </div>
      )}


      
      {/* Global toast notification */}
      {appToast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, padding: "14px 26px", borderRadius: 14,
          background: appToast.type === "success" ? "linear-gradient(90deg,#10b981,#059669)"
            : appToast.type === "warning" ? "linear-gradient(90deg,#f59e0b,#d97706)"
            : appToast.type === "info" ? "linear-gradient(90deg,#6366f1,#8B5CF6)"
            : "linear-gradient(90deg,#ef4444,#dc2626)",
          color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: sans,
          boxShadow: "0 8px 32px rgba(0,0,0,0.32)",
          animation: "fadeIn 0.25s ease-out",
          maxWidth: 540, textAlign: "center", pointerEvents: "none",
        }}>
          {appToast.message}
        </div>
      )}
    </>
  );
}
// build: 2026-07-01
