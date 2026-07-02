import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import VettingTab from "./VettingTab";
import MatchmakingTab from "./MatchmakingTab";
import AdSpyTab from "./AdSpyTab";
import ProductFinderTab from "./ProductFinderTab";
import ShopAnalyzerTab from "./ShopAnalyzerTab";
import TalentAgencyTab from "./TalentAgencyTab";
import BrandPortalTab from "./BrandPortalTab";
import ContractGeneratorTab from "./ContractGeneratorTab";
import ResourcesTab from "./ResourcesTab";
import { supabase } from "./supabaseClient";

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
const AdSpyIcon = ({ color, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const ProductFinderIcon = ({ color, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const ShopAnalyzerIcon = ({ color, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const SourcingCRMIcon = ({ color, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="M9 16l2 2 4-4"/>
  </svg>
);

const VettingIAIcon = ({ color, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <path d="M12 7l-1.5 3.5L7 12l3.5 1.5L12 17l1.5-3.5L17 12l-3.5-1.5z"/>
  </svg>
);

const MatchmakingIcon = ({ color, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="22" y2="11"/>
    <line x1="22" y1="11" x2="19" y2="14"/>
    <line x1="16" y1="11" x2="22" y2="11"/>
  </svg>
);

const BriefcaseIcon = ({ color, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

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

// ─── Main App ─────────────────────────────────────────────────────────────────
// La construction des requêtes et le parsing des résultats sont délégués au backend
// via POST /api/campaigns/start → campaignManager.js → src/utils/queryBuilder.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function ProspectionAgent() {
  const [theme, setTheme]               = useState("dark");
  const [uiLang, setUiLang]             = useState("fr");
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

  const location = useLocation();
  const path = location.pathname;

  if (path === '/cgv') return <LegalPage type="CGV" />;
  if (path === '/mentions') return <LegalPage type="Legal" />;
  if (path === '/privacy') return <LegalPage type="Privacy" />;
  if (path.startsWith('/p/')) return <InfoPage title={decodeURIComponent(path.replace('/p/', ''))} />;

  const [isLoggedIn, setIsLoggedIn]       = useState(false);
  const [userTier, setUserTier]           = useState("free");
  const [userRole, setUserRole]           = useState("user");
  const [userId, setUserId]               = useState(null);
  const [selectedSignupTier, setSelectedSignupTier] = useState("standard");
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
  const [authIntent, setAuthIntent] = useState("");
  const [researchMenuOpen, setResearchMenuOpen] = useState(true);
  const [redirectShop, setRedirectShop]   = useState(null);
  const [authMode, setAuthMode]           = useState("login");
  const [emailInput, setEmailInput]       = useState("");
  const [passInput, setPassInput]         = useState("");
  const [showPass, setShowPass]           = useState(false);
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
      fetch(`${API_URL}/api/leads`, {
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
      const res = await fetch(`${API_URL}/api/campaigns/start`, {
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
      await fetch(`${API_URL}/api/leads`, { method: 'DELETE' });
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
        <div style={{
          minHeight: '100vh', 
          backgroundColor: '#000000', 
          color: '#ffffff', 
          fontFamily: "'Inter', sans-serif",
          overflowX: 'hidden',
          position: 'relative'
        }}>
          
          {/* Background Ambient Glow */}
          <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 60%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 60%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>

          {/* NavBar */}
          <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, height: 72,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 48px', zIndex: 100,
            background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                background: 'linear-gradient(135deg, #8B5CF6, #8B5CF6)',
                width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: 16, boxShadow: '0 0 20px rgba(139,92,246,0.4)'
              }}>VA</div>
              <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>ViralAcquisition</span>
            </div>
            <div className="nav-menu-desktop" style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 500, color: '#A1A1AA' }}>
              <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', color: '#fff' }}>Veille Concurrentielle</span>
              <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Trouver vos talents</span>
              <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Trouver une collab</span>
              <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Sourcing & CRM</span>
            </div>
            <div className="nav-menu-desktop" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <select style={{ background: 'transparent', color: '#A1A1AA', border: 'none', fontSize: 14, cursor: 'pointer', outline: 'none' }}>
                  <option value="fr" style={{ color: '#000' }}>French</option>
                  <option value="en" style={{ color: '#000' }}>English</option>
                </select>
              <button 
                onClick={() => { setAuthMode('login'); setShowLoginModal(true); }}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', padding: '8px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
                className="hover-bg-white-10"
              >
                Login
              </button>
            </div>
          </nav>

          {/* Hero Section */}
          <main style={{ position: 'relative', zIndex: 10, paddingTop: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingBottom: 100 }}>
            <h1 style={{
              fontSize: 'clamp(48px, 6vw, 76px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px',
              maxWidth: 900, margin: '0 0 24px 0'
            }}>
              L'ère de<br/>
              <span style={{ 
                background: 'linear-gradient(90deg, #a78bfa, #f472b6, #fb923c)', 
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                display: 'inline-block', filter: 'drop-shadow(0 0 30px rgba(167,139,250,0.3))'
              }}>l'Acquisition Virale & Spy</span>
            </h1>
            <p style={{
              fontSize: 18, color: '#A1A1AA', maxWidth: 650, lineHeight: 1.6, margin: '0 0 48px 0', fontWeight: 400
            }}>
              L'agence d'acquisition nouvelle génération : l'ultime plateforme de matchmaking. Recrutez les meilleurs influenceurs (votre vivier d'influenceurs sur-mesure), analysez les stratégies marketing gagnantes et sourcez des créateurs à fort impact pour scaler votre marque.
            </p>

            <div style={{ display: 'flex', gap: 16 }}>
 
                <button 
                  onClick={() => { setAuthMode('signup'); setAuthIntent('talentagency'); setShowLoginModal(true); }}
                  style={{
                    background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
                    color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 12,
                    fontSize: 15, fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}
                  className="hover-lift hover-glow-intense"
                >
                  Trouver votre talent
                </button>
                <button 
                  onClick={() => { setAuthMode('signup'); setAuthIntent('adspy'); setShowLoginModal(true); }}
                  style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', padding: '16px 32px', borderRadius: 12,
                    fontSize: 15, fontWeight: 600, cursor: 'pointer',
                    transition: 'background 0.2s',
                    display: 'flex', alignItems: 'center', gap: 8
                  }} 
                  className="hover-lift"
                >
                  Trouver une collaboration
                </button>
              
            </div>

            {/* Massive Hero Mockup */}
            <div style={{
              marginTop: 80, width: '90%', maxWidth: 1100, height: 600,
              background: 'linear-gradient(180deg, #18181B 0%, #09090B 100%)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
              boxShadow: '0 30px 100px -20px rgba(0,0,0,1), 0 0 40px rgba(139,92,246,0.15)',
              overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ height: 48, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 8, background: '#111' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }}></div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }}></div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }}></div>
                <div style={{ marginLeft: 'auto', background: '#27272A', color: '#71717A', fontSize: 12, padding: '4px 12px', borderRadius: 4 }}>viralacq.app/dashboard</div>
                <div style={{ marginLeft: 'auto', width: 44 }}></div>
              </div>
              <div style={{ flex: 1, padding: 32, display: 'flex', gap: 32 }}>
                 <div style={{ width: 240, borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ width: '100%', height: 32, background: 'rgba(255,255,255,0.05)', borderRadius: 6 }}></div>
                    <div style={{ width: '80%', height: 32, background: 'rgba(255,255,255,0.02)', borderRadius: 6 }}></div>
                    <div style={{ width: '90%', height: 32, background: 'rgba(255,255,255,0.02)', borderRadius: 6 }}></div>
                 </div>
                 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Top Row: 4 Cards */}
                    <div style={{ display: 'flex', gap: 16, height: 160 }}>
                       {/* Ad Card 1 */}
                       <div style={{ flex: 1, background: '#000', borderRadius: 12, border: '1px solid rgba(139,92,246,0.4)', position: 'relative', overflow: 'hidden' }}>
                           <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}>
                               <source src="https://cdn.pixabay.com/video/2021/08/13/84903-588147171_large.mp4" type="video/mp4" />
                           </video>
                           <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 'bold' }}>👁 1.2M</div>
                           <div style={{ position: 'absolute', top: 8, right: 8, background: '#10B981', padding: '3px 8px', borderRadius: 4, fontSize: 9, color: '#fff', fontWeight: 'bold' }}>Active</div>
                       </div>
                       {/* Ad Card 2 */}
                       <div style={{ flex: 1, background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                           <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}>
                               <source src="https://cdn.pixabay.com/video/2020/05/21/40003-424564858_small.mp4" type="video/mp4" />
                           </video>
                           <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 'bold' }}>👁 450K</div>
                       </div>
                       {/* Ad Card 3 */}
                       <div style={{ flex: 1, background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                           <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}>
                               <source src="https://cdn.pixabay.com/video/2019/11/12/29252-374395079_small.mp4" type="video/mp4" />
                           </video>
                           <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 'bold' }}>👁 890K</div>
                       </div>
                       {/* Ad Card 4 (THE FACE) */}
                       <div style={{ flex: 1, background: '#000', borderRadius: 12, border: '1px solid rgba(236,72,153,0.5)', position: 'relative', overflow: 'hidden', boxShadow: '0 0 20px rgba(236,72,153,0.2)' }}>
                           <img src="/founder.jpg" alt="Creative Face" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.95 }} />
                           <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%)' }}>
                               <div style={{ fontSize: 11, fontWeight: 'bold', color: '#fff' }}>Coaching Elite</div>
                               <div style={{ fontSize: 9, color: '#EC4899' }}>Top Performer</div>
                           </div>
                       </div>
                    </div>
                    {/* Bottom Row: 2 Cards + Data */}
                    <div style={{ display: 'flex', gap: 16, height: 160 }}>
                       {/* Ad Card 5 */}
                       <div style={{ width: '22%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                           <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}>
                               <source src="https://cdn.pixabay.com/video/2023/10/22/185966-876722008_tiny.mp4" type="video/mp4" />
                           </video>
                           <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 'bold' }}>👁 320K</div>
                       </div>
                       {/* Ad Card 6 */}
                       <div style={{ width: '22%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                           <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80" alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                           <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 'bold' }}>👁 2.1M</div>
                       </div>
                       {/* Data Card */}
                       <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', padding: 20, display: 'flex', gap: 24 }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                               <div style={{ fontSize: 10, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: 1 }}>Revenus estimés</div>
                               <div style={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}>$48,900</div>
                               <div style={{ fontSize: 11, color: '#10B981' }}>+24.5% vs mois dernier</div>
                               <div style={{ marginTop: 'auto', height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: '85%', background: '#8B5CF6' }}></div>
                               </div>
                            </div>
                            <div style={{ flex: 1.5, background: 'rgba(139,92,246,0.05)', borderRadius: 8, border: '1px solid rgba(139,92,246,0.1)', padding: 12, display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                               {[20, 40, 30, 60, 50, 80, 70, 90, 60, 100].map((h, i) => (
                                  <div key={i} className="chart-bar" style={{ flex: 1, background: 'linear-gradient(180deg, #8B5CF6 0%, transparent 100%)', height: `${h}%`, borderRadius: '4px 4px 0 0', animationDelay: `${i * 0.1}s` }}></div>
                               ))}
                            </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </main>

          {/* Features Sections (Alternating) */}
          

          {/* ADSPY & PRODUIT GAGNANT */}
          <section id="adspy" style={{ maxWidth: 1100, margin: '120px auto 0 auto', padding: '0 24px', textAlign: 'center', position: 'relative' }}>
            <div id="produit-gagnant" style={{ position: 'absolute', top: -100 }}></div>
            <h2 className="text-mobile-h2" style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px' }}>Trouvez vos prochains <span style={{ color: '#8B5CF6' }}>talents UGC</span> en 3 clics</h2>
            <p style={{ fontSize: 18, color: '#A1A1AA', maxWidth: 700, margin: '0 auto 48px auto', lineHeight: 1.6 }}>Accède à 80M+ d'annonces et d'influenceurs. Analyse les tendances, observe tes concurrents et lance des campagnes qui convertissent vraiment.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 80 }}>
                <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 30px rgba(139,92,246,0.3)' }}>Essayer gratuitement</button>
            </div>
            
            {/* The Social Proof avatars under Adspy (Yomi & Austin style) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap', marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', maxWidth: 350 }}>
                   <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
                   <div>
                      <p style={{ fontSize: 13, color: '#A1A1AA', margin: '0 0 8px 0', lineHeight: 1.4 }}>"ViralAcquisition est mon outil préféré pour trouver des concurrents et de nouveaux produits viraux."</p>
                      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>Austin, <span style={{ color: '#8B5CF6' }}>+180k abonnés</span></div>
                   </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', maxWidth: 350 }}>
                   <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
                   <div>
                      <p style={{ fontSize: 13, color: '#A1A1AA', margin: '0 0 8px 0', lineHeight: 1.4 }}>"J'utilise ViralAcq pour recruter mes créateurs. En 3 clics, je trouve des influenceurs à fort potentiel pour ma marque."</p>
                      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>Thomas, <span style={{ color: '#8B5CF6' }}>Marque E-com</span></div>
                   </div>
                </div>
            </div>
          </section>

          {/* MATCHMAKING & SOURCING SECTIONS */}
          <section id="matchmaking" style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 24px', display: 'flex', flexDirection: 'column', gap: 160, position: 'relative', zIndex: 10 }}>
            {/* Feature 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 80, justifyContent: 'space-between' }}>
              <div style={{ flex: 1, maxWidth: 450 }}>
                <h2 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.1, margin: '0 0 24px 0', letterSpacing: '-1px' }}>
                  L'Agence de l'<span style={{ color: '#8B5CF6' }}>Influence Marketing</span>
                </h2>
                <p style={{ fontSize: 16, color: '#A1A1AA', lineHeight: 1.6, marginBottom: 32 }}>
                  Recrutez instantanément les créateurs de contenu parfaits pour votre marque. Notre système de Matchmaking avancé filtre par niche, engagement et audience pour vous connecter avec les influenceurs qui génèrent une acquisition virale massive.
                </p>
                <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{
                  background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)', color: '#fff', border: 'none',
                  padding: '12px 28px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(139,92,246,0.3)', transition: 'transform 0.2s'
                }} className="hover-lift">
                  Trouver votre talent
                </button>
              </div>
              <div style={{ flex: 1, height: 450, background: 'linear-gradient(135deg, #18181B 0%, #09090B 100%)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                 {/* Influencer Grid Mockup */}
                 <div style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Matchmaking AI</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <span style={{ background: 'rgba(139,92,246,0.2)', color: '#A78BFA', padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 'bold' }}>Beauty</span>
                            <span style={{ background: 'rgba(255,255,255,0.1)', color: '#E4E4E7', padding: '4px 12px', borderRadius: 12, fontSize: 11 }}>Tech</span>
                        </div>
                    </div>
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {/* Influencer 1 */}
                        <div style={{ background: '#000', borderRadius: 16, position: 'relative', overflow: 'hidden', border: '1px solid rgba(139,92,246,0.3)' }}>
                            <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}>
                                <source src="https://cdn.pixabay.com/video/2021/08/13/84903-588147171_large.mp4" type="video/mp4" />
                            </video>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, background: 'linear-gradient(0deg, rgba(0,0,0,0.9), transparent)' }}>
                                <div style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>@skincare_goddess</div>
                                <div style={{ color: '#10B981', fontSize: 10, fontWeight: 'bold' }}>98% Match</div>
                            </div>
                        </div>
                        {/* Influencer 2 */}
                        <div style={{ background: '#000', borderRadius: 16, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, background: 'linear-gradient(0deg, rgba(0,0,0,0.9), transparent)' }}>
                                <div style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>@fashion_nova</div>
                                <div style={{ color: '#8B5CF6', fontSize: 10, fontWeight: 'bold' }}>85% Match</div>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Feature 2 (Reversed) */}
            <div id="sourcing-crm" style={{ paddingTop: 80 }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 80, justifyContent: 'space-between', flexDirection: 'row-reverse' }}>
              <div style={{ flex: 1, maxWidth: 450 }}>
                <h2 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.1, margin: '0 0 24px 0', letterSpacing: '-1px' }}>
                  Pilotez vos campagnes et votre <span style={{ color: '#8B5CF6' }}>Sourcing & CRM</span>
                </h2>
                <p style={{ fontSize: 16, color: '#A1A1AA', lineHeight: 1.6, marginBottom: 32 }}>
                  Une véritable agence de marketing entre vos mains. Gérez votre portefeuille d'influenceurs via notre CRM, suivez les budgets alloués et analysez le ROI de chaque campagne pour optimiser votre rentabilité en temps réel.
                </p>
                <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{
                  background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)', color: '#fff', border: 'none',
                  padding: '12px 28px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(139,92,246,0.3)', transition: 'transform 0.2s'
                }} className="hover-lift">
                  Trouver un talent
                </button>
              </div>
              <div style={{ flex: 1, height: 450, background: 'linear-gradient(180deg, #18181B 0%, #09090B 100%)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.1)', display: 'flex', flexDirection: 'column' }}>
                 {/* Window Header */}
                 <div style={{ height: 40, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 6, background: 'rgba(0,0,0,0.4)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }}></div>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }}></div>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }}></div>
                    <div style={{ marginLeft: 16, display: 'flex', gap: 12 }}>
                        <span style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 600, borderBottom: '2px solid #8B5CF6', paddingBottom: 10, paddingTop: 10 }}>Overview</span>
                        <span style={{ fontSize: 11, color: '#71717A', fontWeight: 500, paddingTop: 10 }}>Transcript</span>
                    </div>
                 </div>
                 
                 {/* Window Body */}
                 <div style={{ flex: 1, padding: 16, display: 'flex', gap: 16 }}>
                    {/* Left: Ad Preview */}
                    <div style={{ width: 200, background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                       <div style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                           <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 'bold' }}>VA</div>
                           <div style={{ fontSize: 11, color: '#E4E4E7', fontWeight: 600 }}>Influencer Elite</div>
                       </div>
                       <div style={{ flex: 1, position: 'relative' }}>
                           <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}>
                               <source src="https://cdn.pixabay.com/video/2023/10/22/185966-876722008_tiny.mp4" type="video/mp4" />
                           </video>
                       </div>
                       <div style={{ padding: 12, background: 'rgba(255,255,255,0.02)' }}>
                           <div style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>This product is viral 🔥</div>
                           <div style={{ fontSize: 10, color: '#A1A1AA' }}>Link in bio for more details!</div>
                       </div>
                    </div>

                    {/* Right: Data Analytics */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Top Stats Row */}
                        <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '4px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', fontWeight: 'bold', fontSize: 14 }}>98%</div>
                                <div>
                                    <div style={{ fontSize: 10, color: '#A1A1AA', textTransform: 'uppercase' }}>Engagement</div>
                                    <div style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Excellent</div>
                                </div>
                            </div>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 16 }}>
                                <div style={{ fontSize: 10, color: '#A1A1AA', textTransform: 'uppercase', marginBottom: 4 }}>Total Spend</div>
                                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>$12,450</div>
                                <div style={{ fontSize: 10, color: '#10B981', marginTop: 4 }}>+14% this week</div>
                            </div>
                        </div>
                        
                        {/* Main Chart Area */}
                        <div style={{ flex: 1, background: 'rgba(139,92,246,0.03)', border: '1px solid rgba(139,92,246,0.1)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#E4E4E7' }}>Revenue Performance</div>
                                <div style={{ fontSize: 10, color: '#8B5CF6', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: 10 }}>Live</div>
                            </div>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                               {[20, 35, 25, 50, 45, 75, 60, 90, 85, 100, 95, 120].map((h, i) => (
                                  <div key={i} className="chart-bar" style={{ flex: 1, background: 'linear-gradient(180deg, #8B5CF6 0%, transparent 100%)', height: `${Math.min(h, 100)}%`, borderRadius: '4px 4px 0 0', animationDelay: `${i * 0.05}s` }}></div>
                               ))}
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
            </div>

          </section>

          
          
            {/* Feature 3 (Track Trends) */}
            <div id="shop-analyzer" style={{ paddingTop: 80 }}></div>
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 80, justifyContent: 'space-between', marginTop: 120, marginBottom: 80 }}>
              <div style={{ flex: 1, maxWidth: 500 }}>
                <h2 style={{ fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px', lineHeight: 1.2 }}>Trackez les marques tendances</h2>
                <p style={{ fontSize: 18, color: '#A1A1AA', lineHeight: 1.6, marginBottom: 32 }}>
                  Accédez aux infos sur l'engagement, les vues, les meilleures campagnes et les influenceurs utilisés pour reproduire les stratégies virales qui fonctionnent.
                </p>
                <button 
                  onClick={() => { setAuthMode('signup'); setAuthIntent('shopanalyzer'); setShowLoginModal(true); }}
                  style={{
                    background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
                    color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 12,
                    fontSize: 15, fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  className="hover-lift hover-glow-intense"
                >
                  Analyser une marque
                </button>
              </div>

              {/* 3D Bar Charts Mockup area */}
              <div style={{ flex: 1, position: 'relative', height: 400, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                 {/* Fake 3D Bars */}
                 <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, height: 300, position: 'relative', zIndex: 2 }}>
                    <div style={{ width: 60, height: 120, background: 'linear-gradient(to top, rgba(255,255,255,0.05), rgba(255,255,255,0.3))', borderRadius: '8px 8px 0 0', position: 'relative', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.5), inset 2px 0 0 rgba(255,255,255,0.2)' }}>
                       <div style={{ position: 'absolute', top: -30, left: -20, background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 'bold' }}>+12% 🚀</div>
                    </div>
                    <div style={{ width: 80, height: 250, background: 'linear-gradient(to top, rgba(139,92,246,0.1), rgba(139,92,246,0.6))', borderRadius: '8px 8px 0 0', position: 'relative', boxShadow: '0 0 30px rgba(139,92,246,0.3), inset 0 2px 0 rgba(255,255,255,0.5), inset 2px 0 0 rgba(255,255,255,0.2)' }}>
                       <div style={{ position: 'absolute', top: -40, left: -20, background: 'rgba(139, 92, 246, 0.2)', color: '#C084FC', padding: '6px 12px', borderRadius: 6, fontSize: 14, fontWeight: 'bold', whiteSpace: 'nowrap' }}>+45% d'Engagement</div>
                    </div>
                    <div style={{ width: 70, height: 180, background: 'linear-gradient(to top, rgba(255,255,255,0.05), rgba(255,255,255,0.4))', borderRadius: '8px 8px 0 0', position: 'relative', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.5), inset 2px 0 0 rgba(255,255,255,0.2)' }}>
                       <div style={{ position: 'absolute', top: 40, right: -40, width: 80, height: 80, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                          <span style={{ fontSize: 32 }}>🛍️</span>
                       </div>
                    </div>
                 </div>
                 <div style={{ position: 'absolute', bottom: -50, left: '50%', transform: 'translateX(-50%)', width: '150%', height: 150, background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(20px)', zIndex: 1 }}></div>
              </div>
            </div>

            {/* Huge Dashboard Mockup Below Feature 3 */}
            <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto 160px auto', position: 'relative', zIndex: 5 }}>
               <div style={{ 
                  background: 'linear-gradient(180deg, #18181B 0%, #09090B 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, 
                  boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 60px rgba(139,92,246,0.15)', 
                  overflow: 'hidden'
                }}>
                  {/* Fake Header */}
                  <div style={{ height: 40, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 6, background: 'rgba(0,0,0,0.4)' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }}></div>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }}></div>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }}></div>
                    <div style={{ margin: '0 auto', fontSize: 12, color: '#52525B', fontWeight: 500 }}>acquisition-pro.app/analyzer</div>
                  </div>
                  {/* Fake Content Area */}
                  <div style={{ padding: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 24 }}>
                       <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 4px 15px rgba(236,72,153,0.3)' }}>✨</div>
                       <div>
                          <div style={{ fontWeight: 800, color: '#fff', fontSize: 24 }}>Sephora France</div>
                          <div style={{ fontSize: 14, color: '#A1A1AA', display: 'flex', gap: 12 }}>
                             <span>Niche: Beauté</span>
                             <span>•</span>
                             <span><span style={{ color: '#10B981' }}>●</span> Actif (32 campagnes)</span>
                          </div>
                       </div>
                    </div>

                    <div style={{ display: 'flex', gap: 24 }}>
                       <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid rgba(255,255,255,0.03)' }}>
                           <div style={{ color: '#A1A1AA', fontSize: 13, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>Trafic & Vues TikTok</div>
                           <div style={{ fontSize: 42, fontWeight: 800, color: '#fff' }}>14.2M</div>
                           <div style={{ color: '#10B981', fontSize: 14, fontWeight: 600 }}>+ 24% vs mois dernier</div>
                           <div style={{ height: 100, marginTop: 'auto' }}>
                             <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                               <path d="M0,40 L10,30 L20,35 L30,20 L40,25 L50,10 L60,15 L70,5 L80,10 L90,0 L100,20 L100,40 Z" fill="rgba(139,92,246,0.15)" />
                               <polyline points="0,40 10,30 20,35 30,20 40,25 50,10 60,15 70,5 80,10 90,0 100,20" fill="none" stroke="#8B5CF6" strokeWidth="3" />
                             </svg>
                           </div>
                       </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, border: '1px solid rgba(255,255,255,0.03)' }}>
                           <div style={{ color: '#A1A1AA', fontSize: 13, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>Top Créateurs Engagés</div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                               <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                               <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>@lena.situations</div>
                               <div style={{ marginLeft: 'auto', fontSize: 13, color: '#10B981', fontWeight: 700, background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: 6 }}>+2.4M Vues</div>
                           </div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                               <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                               <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>@squeezie</div>
                               <div style={{ marginLeft: 'auto', fontSize: 13, color: '#10B981', fontWeight: 700, background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: 6 }}>+1.8M Vues</div>
                           </div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                               <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=100&q=80" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                               <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>@marie.lopez</div>
                               <div style={{ marginLeft: 'auto', fontSize: 13, color: '#10B981', fontWeight: 700, background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: 6 }}>+950k Vues</div>
                           </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* TESTIMONIALS */}
          
          {/* SECTION CRÉATEURS / INFLUENCEURS */}
          <section className="p-mobile-sm" style={{ maxWidth: 1200, margin: '100px auto', padding: '0 24px', position: 'relative' }}>
              <div className="flex-col-mobile" style={{ display: 'flex', gap: 60, alignItems: 'center', background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(0,0,0,0))', borderRadius: 32, padding: 60, border: '1px solid rgba(16,185,129,0.1)', position: 'relative', overflow: 'hidden' }}>
                  
                  {/* Background Glow */}
                  <div style={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, background: 'rgba(16,185,129,0.15)', filter: 'blur(80px)', borderRadius: '50%' }}></div>

                  {/* Left: Text & Benefits */}
                  <div className="w-full-mobile text-center-mobile" style={{ flex: 1, zIndex: 10 }}>
                      <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(16,185,129,0.1)', color: '#10B981', borderRadius: 20, fontSize: 14, fontWeight: 700, marginBottom: 24, border: '1px solid rgba(16,185,129,0.2)' }}>ESPACE CRÉATEURS & UGC</div>
                      <h2 className="text-mobile-h2" style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px', lineHeight: 1.1 }}>Monétisez votre audience. <br/><span style={{ color: '#10B981' }}>Zéro commission.</span></h2>
                      <p className="text-mobile-p" style={{ color: '#A1A1AA', fontSize: 18, marginBottom: 40, lineHeight: 1.6 }}>Rejoignez le réseau privé d'Acquisition Pro et laissez notre IA vous connecter directement avec les meilleures marques de votre niche. Fini les négociations interminables.</p>
                      
                      <div className="text-left-mobile" style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
                          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0, marginTop: 4 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <div style={{ textAlign: 'left' }}>
                                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Matchmaking Automatique</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>Notre IA analyse votre profil et vous propose des marques dont l'ADN correspond parfaitement au vôtre.</div>
                              </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0, marginTop: 4 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <div style={{ textAlign: 'left' }}>
                                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Paiements 100% Sécurisés</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>La marque paie en amont sur un compte séquestre. Vous êtes garanti d'être payé dès la livraison de la vidéo.</div>
                              </div>
                          </div>

                          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0, marginTop: 4 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <div style={{ textAlign: 'left' }}>
                                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Zéro frais pour les créateurs</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>Vous gardez 100% de vos revenus. Ce sont les marques qui paient l'abonnement au logiciel.</div>
                              </div>
                          </div>
                      </div>
                      
                      <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} className="hover-lift" style={{ background: '#10B981', color: '#000', border: 'none', padding: '16px 32px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 30px rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: 12, margin: '0 auto' }}>
                          Devenir Créateur Partenaire
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </button>
                  </div>

                  {/* Right: Visual Mockup */}
                  <div className="w-full-mobile hide-mobile" style={{ flex: 1, position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center' }}>
                      <div style={{ width: '100%', maxWidth: 400, background: '#18181B', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', padding: 24, boxShadow: '0 30px 60px rgba(0,0,0,0.6)', position: 'relative' }}>
                          
                          {/* Fake Notification Badge */}
                          <div style={{ position: 'absolute', top: -20, right: -20, background: '#10B981', color: '#000', padding: '12px 20px', borderRadius: 16, fontWeight: 800, fontSize: 14, boxShadow: '0 10px 20px rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: 10, animation: 'pulseHeight 2s infinite alternate' }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                              +850 € Reçu
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                              <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} alt="Creator" />
                              <div>
                                  <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>Sarah D.</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>Créatrice UGC & Beauté</div>
                              </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                                  <div style={{ color: '#A1A1AA', fontSize: 12, textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>Taux d'engagement</div>
                                  <div style={{ color: '#10B981', fontSize: 24, fontWeight: 800 }}>8.4%</div>
                              </div>
                              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                                  <div style={{ color: '#A1A1AA', fontSize: 12, textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>Collabs réussies</div>
                                  <div style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>34</div>
                              </div>
                          </div>

                          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: 16, borderRadius: 12 }}>
                              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Nouvelle proposition reçue</div>
                              <div style={{ color: '#A1A1AA', fontSize: 13, marginBottom: 12 }}>La marque Sephora souhaite collaborer avec vous pour une vidéo TikTok.</div>
                              <div style={{ display: 'flex', gap: 8 }}>
                                  <div style={{ background: '#10B981', color: '#000', padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>Accepter</div>
                                  <div style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>Voir le brief</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>


          {/* NOUVELLE SECTION : INSPIRATION MARQUES */}
          <section className="p-mobile-sm" style={{ maxWidth: 1200, margin: '100px auto', padding: '0 24px', position: 'relative' }}>
              <div className="text-center-mobile" style={{ textAlign: 'center', marginBottom: 60 }}>
                  <h2 className="text-mobile-h2" style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px' }}>Inspirez-vous des <span style={{ color: '#F43F5E' }}>géants de votre niche</span></h2>
                  <p className="text-mobile-p" style={{ color: '#A1A1AA', fontSize: 20, maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>Pourquoi réinventer la roue ? Analysez les publicités et campagnes des plus grandes marques de votre secteur et reproduisez leur succès.</p>
              </div>

              <div className="flex-col-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'center' }}>
                  
                  {/* Mockup UI Benchmark */}
                  <div className="w-full-mobile" style={{ background: '#18181B', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#F43F5E', letterSpacing: 1 }}>VEILLE CONCURRENTIELLE</div>
                          <div style={{ display: 'flex', gap: 8 }}>
                              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#3F3F46' }}></div>
                              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#3F3F46' }}></div>
                              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#3F3F46' }}></div>
                          </div>
                      </div>

                      <div style={{ background: '#09090B', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                              </div>
                              <div>
                                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Recherche par Niche</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>Tapez "Skincare", "Fitness" ou un nom de marque.</div>
                              </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                              <div style={{ height: 140, borderRadius: 12, background: 'url(https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&auto=format&fit=crop) center/cover', position: 'relative' }}>
                                 <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 6, fontSize: 10, color: '#fff', fontWeight: 700, backdropFilter: 'blur(4px)' }}>1.2M Vues</div>
                              </div>
                              <div style={{ height: 140, borderRadius: 12, background: 'url(https://images.unsplash.com/photo-1571781526291-c477ebfd024b?q=80&w=400&auto=format&fit=crop) center/cover', position: 'relative' }}>
                                 <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 6, fontSize: 10, color: '#fff', fontWeight: 700, backdropFilter: 'blur(4px)' }}>850K Vues</div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Arguments Text */}
                  <div className="w-full-mobile text-center-mobile" style={{ paddingLeft: '10%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                          <div>
                              <h3 className="text-mobile-h3" style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Décelez les tendances avant les autres</h3>
                              <p style={{ color: '#A1A1AA', fontSize: 16, lineHeight: 1.6 }}>Découvrez exactement quels formats vidéos performent pour vos concurrents. Arrêtez de deviner et basez votre créativité sur des données concrètes.</p>
                          </div>
                          
                          <div>
                              <h3 className="text-mobile-h3" style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Créez des briefs parfaits</h3>
                              <p style={{ color: '#A1A1AA', fontSize: 16, lineHeight: 1.6 }}>Sauvegardez les meilleures publicités de votre secteur dans un Moodboard et partagez-les en un clic avec vos créateurs pour leur montrer exactement ce que vous attendez.</p>
                          </div>
                          
                          <div>
                              <h3 className="text-mobile-h3" style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Adaptez les stratégies gagnantes</h3>
                              <p style={{ color: '#A1A1AA', fontSize: 16, lineHeight: 1.6 }}>Ce qui marche pour Gymshark ou Sephora peut marcher pour vous. Analysez leurs hooks (accroches), leurs appels à l'action et la durée de leurs vidéos.</p>
                          </div>
                      </div>
                  </div>

              </div>
          </section>

<section className="p-mobile-sm" style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
            <h2 className="text-mobile-h2" style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 60, letterSpacing: '-1px' }}>Ce que les experts disent de <span style={{ color: '#8B5CF6' }}>Viral Acquisition</span></h2>
            <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 24, scrollbarWidth: 'none' }}>
               {[
                 { name: "Lucas Bivert", type: "Marque E-com", text: "Mon outil favori pour la recherche d'influenceurs, c'est ViralAcquisition. C'est devenu un indispensable pour mon équipe et moi dans notre sourcing.", img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80" },
                 { name: "Jonathan", type: "Agence", text: "J'utilise ViralAcq depuis 2024 et ça a toujours été un essentiel de mon matchmaking. Trouver les bons créateurs est devenu un jeu d'enfant.", img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80" },
                 { name: "Nawfel Ammar", type: "Créateur", text: "ViralAcq est un super outil pour les créateurs qui souhaitent trouver leur premier partenariat gagnant. Gérer ses contrats depuis une seule plateforme c'est un vrai gain de temps.", img: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80" }
               ].map((t, i) => (
                 <div key={i} style={{ flex: '0 0 350px', height: 450, borderRadius: 20, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                    <img src={t.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, background: 'linear-gradient(0deg, rgba(139,92,246,0.95) 0%, rgba(139,92,246,0.8) 50%, transparent 100%)', color: '#fff' }}>
                       <p style={{ fontSize: 14, lineHeight: 1.6, fontWeight: 600, marginBottom: 16 }}>"{t.text}"</p>
                       <div style={{ fontSize: 16, fontWeight: 800 }}>{t.name}</div>
                       <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{t.type}</div>
                    </div>
                 </div>
               ))}
            </div>
          </section>

          {/* GRID FEATURES (BENTO) */}
          <section style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#8B5CF6', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Stop aux doutes</h2>
            <h3 style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 60, letterSpacing: '-1px' }}>Recrutez ce qui marche vraiment</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
               <div style={{ background: '#111', borderRadius: 20, padding: 32, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, minHeight: 150, background: 'linear-gradient(135deg, #18181B 0%, #27272A 100%)', borderRadius: 12, marginBottom: 24, border: '1px solid rgba(139,92,246,0.2)', position: 'relative', overflow: 'hidden' }}>
                     <div style={{ position: 'absolute', top: 16, left: 16, background: '#8B5CF6', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 'bold', color: '#fff' }}>#1</div>
                     <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>10 profils gagnants par jour</h4>
                  <p style={{ fontSize: 14, color: '#A1A1AA', margin: 0 }}>Découvrez chaque jour les créateurs à plus fort potentiel de viralité.</p>
               </div>
               
               <div style={{ background: '#111', borderRadius: 20, padding: 32, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, minHeight: 150, background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(236,72,153,0.1) 100%)', borderRadius: 12, marginBottom: 24, border: '1px solid rgba(236,72,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
                        <span style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 20, fontSize: 12, color: '#fff' }}>Taux d'engagement</span>
                        <span style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 20, fontSize: 12, color: '#fff' }}>Niche</span>
                        <span style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 20, fontSize: 12, color: '#fff' }}>Localisation</span>
                     </div>
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Filtrez les audiences</h4>
                  <p style={{ fontSize: 14, color: '#A1A1AA', margin: 0 }}>Dénichez les audiences les plus rentables en un clin d'œil avec nos filtres intelligents.</p>
               </div>
               
               <div style={{ background: '#111', borderRadius: 20, padding: 32, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, minHeight: 150, background: '#18181B', borderRadius: 12, marginBottom: 24, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                     <div style={{ width: 60, height: 60, background: '#8B5CF6', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24 }}>✍️</div>
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Générez vos contrats</h4>
                  <p style={{ fontSize: 14, color: '#A1A1AA', margin: 0 }}>Transformez n'importe quel accord en contrat légal en un instant depuis le CRM.</p>
               </div>
               
               <div style={{ background: '#111', borderRadius: 20, padding: 32, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, minHeight: 150, background: 'linear-gradient(45deg, #18181B 0%, #27272A 100%)', borderRadius: 12, marginBottom: 24, border: '1px solid rgba(16,185,129,0.2)', position: 'relative', overflow: 'hidden' }}>
                     <div style={{ position: 'absolute', top: 20, left: 20, right: 20, background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, background: '#10B981', borderRadius: '50%' }}></div>
                        <div>
                           <div style={{ fontSize: 12, color: '#fff', fontWeight: 'bold' }}>Formation gratuite</div>
                           <div style={{ fontSize: 10, color: '#A1A1AA' }}>Inclus dans VIP Elite</div>
                        </div>
                     </div>
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Accède à nos offres</h4>
                  <p style={{ fontSize: 14, color: '#A1A1AA', margin: 0 }}>Profitez d'avantages exclusifs sur les outils essentiels pour réussir en influence.</p>
               </div>
            </div>
          </section>

          
            {/* FOUNDER SECTION */}
            <section style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(0,0,0,0))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 24, padding: '60px 40px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', filter: 'blur(30px)' }}></div>
                <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', filter: 'blur(30px)' }}></div>
                
                <img src="https://github.com/BrejnevDiaz.png" alt="Brejnev Diaz" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid #8B5CF6', marginBottom: 24, boxShadow: '0 10px 30px rgba(139,92,246,0.4)', position: 'relative', zIndex: 2 }} />
                
                <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8, position: 'relative', zIndex: 2 }}>Brejnev Diaz</h2>
                <div style={{ fontSize: 16, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 32, position: 'relative', zIndex: 2 }}>Fondateur de ViralAcquisition (Agence)</div>
                
                <p style={{ fontSize: 20, color: '#E4E4E7', lineHeight: 1.6, maxWidth: 700, margin: '0 auto', fontStyle: 'italic', fontWeight: 300, position: 'relative', zIndex: 2 }}>
                  "Mon objectif avec ViralAcquisition est simple : supprimer toutes les frictions entre les marques e-commerce et les créateurs de contenu. Nous ne sommes pas juste un outil d'espionnage, nous sommes le pont qui permet de nouer des partenariats ultra-rentables et de disrupter le marché de l'influence."
                </p>
              </div>
            </section>
            
            {/* FAQ */}
          <section style={{ background: 'linear-gradient(180deg, rgba(139,92,246,0.15) 0%, transparent 100%)', padding: '120px 24px' }}>
             <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <h2 style={{ fontSize: 42, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 60, letterSpacing: '-1px' }}>Nous répondons à vos questions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                   {[
                     "Puis-je gérer mes contrats légaux sur la plateforme ?",
                     "Est-ce adapté si je débute en e-commerce ?",
                     "Quelle est la différence entre VIP Pro et VIP Elite ?"
                   ].map((q, i) => (
                      <details key={i} style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                         <summary style={{ padding: 24, fontSize: 16, fontWeight: 600, color: '#E4E4E7', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {q}
                            <span style={{ color: '#8B5CF6', fontSize: 24 }}>›</span>
                         </summary>
                         <div style={{ padding: '0 24px 24px 24px', color: '#A1A1AA', fontSize: 15, lineHeight: 1.6 }}>
                            Notre IA analyse des milliers de données (engagement, audience, niche) pour vous connecter automatiquement avec les créateurs UGC et influenceurs les plus rentables pour votre marque. Finies les heures de recherche manuelle.
                         </div>
                      </details>
                   ))}
                </div>
             </div>
          </section>

          {/* ACADEMY FORMATION */}
          <section style={{ maxWidth: 1100, margin: '100px auto', position: 'relative', padding: '0 24px' }}>
             <div style={{ background: '#111', borderRadius: 32, padding: 60, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 60, overflow: 'hidden', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}>
                {/* Background Glow */}
                <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'rgba(236,72,153,0.2)', filter: 'blur(100px)', borderRadius: '50%' }}></div>
                
                <div style={{ flex: 1, zIndex: 10 }}>
                   <h2 style={{ fontSize: 24, color: '#EC4899', fontWeight: 800, marginBottom: 16 }}>Apprends à lancer ta première campagne</h2>
                   <h3 style={{ fontSize: 48, color: '#fff', fontWeight: 800, lineHeight: 1.1, marginBottom: 32, letterSpacing: '-1px' }}>Accède à une formation de +10h gratuitement</h3>
                   <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{
                     background: 'linear-gradient(90deg, #EC4899, #8B5CF6)', color: '#fff', border: 'none',
                     padding: '16px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer',
                     boxShadow: '0 10px 30px rgba(236,72,153,0.3)', transition: 'transform 0.2s'
                   }} className="hover-lift">
                     Commencer la formation
                   </button>
                </div>
                
                <div style={{ flex: 1, zIndex: 10, position: 'relative' }}>
                   <div style={{ background: '#18181B', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                      <h4 style={{ color: '#fff', fontSize: 18, marginBottom: 24 }}>Sommaire</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                         {[
                           { t: "À regarder avant de se lancer", dur: "12m 34s", p: 100 },
                           { t: "Tout savoir sur le Matchmaking", dur: "30m 22s", p: 60 },
                           { t: "La méthode Virale", dur: "9m 15s", p: 0 },
                           { t: "Décrypter l'engagement TikTok", dur: "25m 47s", p: 0 }
                         ].map((v, i) => (
                           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                              <div style={{ width: 24, height: 24, borderRadius: '50%', background: v.p === 100 ? '#10B981' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>{v.p === 100 ? '✓' : ''}</div>
                              <div style={{ width: 60, height: 40, background: '#27272A', borderRadius: 8, position: 'relative' }}>
                                 <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #fff' }}></div>
                              </div>
                              <div style={{ flex: 1 }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontSize: 13, color: '#E4E4E7', fontWeight: 600 }}>{v.t}</span>
                                    <span style={{ fontSize: 11, color: '#A1A1AA' }}>{v.dur}</span>
                                 </div>
                                 <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                                    <div style={{ width: `${v.p}%`, height: '100%', background: '#EC4899' }}></div>
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </section>

          {/* FOOTER */}
          <footer style={{ background: '#09090B', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 80, paddingBottom: 40, marginTop: 80 }}>
             <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'wrap', gap: 60, justifyContent: 'space-between', marginBottom: 80 }}>
                <div style={{ maxWidth: 300 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                     <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>VA</div>
                     <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>ViralAcquisition</span>
                   </div>
                   <p style={{ color: '#A1A1AA', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>L'ultime plateforme de matchmaking et d'acquisition marketing pour marques et créateurs.</p>
                   <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>in</div>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>IG</div>
                   </div>
                </div>

                <div style={{ display: 'flex', gap: 80, flexWrap: 'wrap' }}>
                   <div>
                      <h4 style={{ color: '#EC4899', fontSize: 14, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase' }}>Découvrez</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: 'Influenceurs TikTok' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Influenceurs TikTok</a>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: 'Coaching Elite' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Coaching Elite</a>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: 'Trouvez votre talent' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Trouvez votre talent</a>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: 'Matchmaking CRM' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Matchmaking CRM</a>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: 'Formation Acquisition' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Formation Acquisition</a>
                      </div>
                   </div>

                   <div>
                      <h4 style={{ color: '#10B981', fontSize: 14, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase' }}>En savoir plus</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: 'Meilleure agence' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Meilleure agence</a>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: 'Stratégie virale' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Stratégie virale</a>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: 'Comment démarrer ?' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Comment démarrer ?</a>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: 'Analyse de la concurrence' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Analyse de la concurrence</a>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: 'Blog & Ressources' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Blog & Ressources</a>
                      </div>
                   </div>

                   <div>
                      <h4 style={{ color: '#8B5CF6', fontSize: 14, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase' }}>Liens Pratiques (Légal)</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                         <a href="https://viralacquisition.it/" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); setAuthMode('login'); setShowLoginModal(true); }} style={{ color: '#A1A1AA', fontSize: 14 }}>Connexion</a>
                         <a href="https://viralacquisition.it/" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); setAuthMode('signup'); setShowLoginModal(true); }} style={{ color: '#A1A1AA', fontSize: 14 }}>Inscription</a>
                         <a href="#cgv" onClick={(e) => { e.preventDefault(); setLegalType('CGV'); setShowLegalModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Conditions générales de vente (CGV)</a>
                         <a href="#privacy" onClick={(e) => { e.preventDefault(); setLegalType('Privacy'); setShowLegalModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Politique de confidentialité</a>
                         <a href="#mentions" onClick={(e) => { e.preventDefault(); setLegalType('Legal'); setShowLegalModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Mentions Légales</a>
                      </div>
                   </div>
                </div>
             </div>
             
             <div style={{ textAlign: 'center', color: '#71717A', fontSize: 13, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 40 }}>
                ViralAcquisition © 2026. Tous droits réservés.
             </div>
          </footer>

          {/* Info Modal */}
          {showInfoModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#18181B', padding: 40, borderRadius: 24, width: '100%', maxWidth: 600, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', textAlign: 'center' }}>
                <button onClick={() => setShowInfoModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>×</button>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🚧</div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
                  {infoContent.title}
                </h2>
                <p style={{ color: '#A1A1AA', lineHeight: 1.6, fontSize: 15 }}>
                  Cette page est en cours de construction. Elle sera disponible très prochainement dans la version finale d'Acquisition Pro.
                </p>
                <button onClick={() => setShowInfoModal(false)} style={{ marginTop: 24, background: '#8B5CF6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Compris !</button>
              </div>
            </div>
          )}

          {/* Legal Modal */}
          {showLegalModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#18181B', padding: 40, borderRadius: 24, width: '100%', maxWidth: 800, maxHeight: '80vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                <button onClick={() => setShowLegalModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>×</button>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 24 }}>
                  {legalType === 'CGV' ? 'Conditions Générales de Vente' : legalType === 'Privacy' ? 'Politique de Confidentialité' : 'Mentions Légales'}
                </h2>
                <div style={{ color: '#A1A1AA', lineHeight: 1.6, fontSize: 15 }}>
                  {legalType === 'CGV' && (
                    <>
                      <h3>1. Objet</h3>
                      <p>Les présentes Conditions Générales de Vente régissent l'utilisation de la plateforme Acquisition Pro...</p>
                      <h3>2. Abonnements et Paiements</h3>
                      <p>L'accès aux fonctionnalités avancées (Adspy, CRM, Matchmaking) nécessite un abonnement actif. Les paiements sont traités de manière sécurisée via Stripe.</p>
                      <h3>3. Responsabilités</h3>
                      <p>L'utilisateur est seul responsable des contrats générés avec les créateurs via la plateforme.</p>
                    </>
                  )}
                  {legalType === 'Privacy' && (
                    <>
                      <h3>1. Collecte des données</h3>
                      <p>Nous collectons les données nécessaires à la création de votre compte et à l'utilisation du CRM d'influence.</p>
                      <h3>2. Utilisation</h3>
                      <p>Vos données de sourcing et vos portefeuilles de créateurs sont strictement confidentiels et ne sont pas partagés avec les autres utilisateurs.</p>
                      <h3>3. Cookies</h3>
                      <p>Nous utilisons des cookies essentiels pour maintenir votre session active.</p>
                    </>
                  )}
                  {legalType === 'Legal' && (
                    <>
                      <h3>Éditeur du site</h3>
                      <p>Le site Acquisition Pro est édité par l'agence ViralAcquisition.</p>
                      <h3>Hébergement</h3>
                      <p>Ce site est hébergé sur Vercel Inc, San Francisco, CA.</p>
                      <h3>Contact</h3>
                      <p>Pour toute question, veuillez contacter le support via notre adresse email officielle.</p>
                    </>
                  )}
                  <br/><br/>
                  <p style={{ fontSize: 12 }}><i>Ceci est un document légal générique pour le SaaS Acquisition Pro. Il doit être complété par votre avocat ou conseiller juridique.</i></p>
                </div>
              </div>
            </div>
          )}

          {/* Auth Modal overlay (Glassmorphism) */}
          {showLoginModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
              background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{
                background: 'rgba(24,24,27,0.8)', border: '1px solid rgba(255,255,255,0.1)',
                width: 900, maxWidth: '95vw', borderRadius: 24, display: 'flex', overflow: 'hidden',
                boxShadow: '0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: '-20%', left: '-20%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }}></div>
                
                {/* Auth Form Side */}
                <div style={{ flex: 1, padding: 60, position: 'relative', zIndex: 10 }}>
                  <button onClick={() => setShowLoginModal(false)} style={{
                    position: 'absolute', top: 20, left: 20, background: 'transparent', border: 'none',
                    color: '#A1A1AA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13
                  }} className="hover-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Retour
                  </button>
                  
                  <div style={{ textAlign: 'center', marginBottom: 40, marginTop: 20 }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #8B5CF6, #8B5CF6)', width: 48, height: 48, borderRadius: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20,
                      margin: '0 auto 20px auto', boxShadow: '0 0 20px rgba(139,92,246,0.5)'
                    }}>VA</div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px 0', color: '#fff' }}>
                      {authMode === "signup" ? "CRÉEZ VOTRE COMPTE." : "BON RETOUR."}
                    </h2>
                    <p style={{ color: '#A1A1AA', fontSize: 14 }}>
                      Rejoignez l'élite de l'Acquisition Virale.
                    </p>
                  </div>

                  <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#A1A1AA', marginBottom: 8, letterSpacing: 1 }}>ADRESSE E-MAIL</label>
                      <input 
                        type="email" required
                        value={emailInput} onChange={e => setEmailInput(e.target.value)}
                        placeholder="you@company.com"
                        style={{
                          width: '100%', padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 15, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#A1A1AA', marginBottom: 8, letterSpacing: 1 }}>MOT DE PASSE</label>
                      <input 
                        type="password" required
                        value={passInput} onChange={e => setPassInput(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          width: '100%', padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 15, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <button type="submit" disabled={false} style={{
                      width: '100%', padding: 16, borderRadius: 10, border: 'none',
                      background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', color: '#fff', fontSize: 16, fontWeight: 700,
                      cursor: false ? 'not-allowed' : 'pointer', opacity: false ? 0.7 : 1,
                      marginTop: 10, boxShadow: '0 8px 25px rgba(236,72,153,0.3)'
                    }}>
                      {false ? "Chargement..." : (authMode === "signup" ? "Valider l'inscription →" : "Se connecter →")}
                    </button>
                  </form>
                  <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#A1A1AA' }}>
                    {authMode === "signup" ? "Déjà un compte ? " : "Pas encore de compte ? "}
                    <span onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")} style={{ color: '#8B5CF6', fontWeight: 600, cursor: 'pointer' }}>
                      {authMode === "signup" ? "Se connecter" : "Créer un compte"}
                    </span>
                  </div>
                </div>

                {/* Pricing / Value Prop Side */}
                <div style={{ flex: 1.2, background: 'rgba(0,0,0,0.5)', borderLeft: '1px solid rgba(255,255,255,0.05)', padding: 60, display: 'flex', flexDirection: 'column' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#8B5CF6', fontSize: 12, fontWeight: 800, letterSpacing: 1, marginBottom: 16 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      {authMode === "signup" ? "ÉTAPE 2 : CHOISISSEZ VOTRE FORFAIT" : "DÉBLOQUEZ TOUTES LES FONCTIONNALITÉS"}
                   </div>
                   <p style={{ color: '#A1A1AA', fontSize: 13, lineHeight: 1.6, marginBottom: 32 }}>
                      Les abonnements disposent d'accès de fonctionnalités et de données différents.
                   </p>
                   
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1 }}>
                      {/* Plan: Free */}
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column' }}>
                         <div style={{ fontSize: 11, fontWeight: 800, color: '#A1A1AA', letterSpacing: 1, marginBottom: 8 }}>GRATUIT (TRIAL)</div>
                         <p style={{ fontSize: 12, color: '#71717A', lineHeight: 1.5, flex: 1 }}>Vetting IA et ressources basiques uniquement.</p>
                         <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>0 €<span style={{ fontSize: 12, color: '#71717A', fontWeight: 500 }}> /à vie</span></div>
                      </div>
                      {/* Plan: Standard */}
                      <div style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                         <div style={{ position: 'absolute', top: 12, right: 12, color: '#8B5CF6' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
                         <div style={{ fontSize: 11, fontWeight: 800, color: '#8B5CF6', letterSpacing: 1, marginBottom: 8 }}>STANDARD</div>
                         <p style={{ fontSize: 12, color: '#71717A', lineHeight: 1.5, flex: 1 }}>CRM 10 leads, 3 analyses/jour, AdSpy view-only.</p>
                         <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>39 €<span style={{ fontSize: 12, color: '#71717A', fontWeight: 500 }}> /mois</span></div>
                      </div>
                      {/* Plan: Pro */}
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column' }}>
                         <div style={{ fontSize: 11, fontWeight: 800, color: '#A1A1AA', letterSpacing: 1, marginBottom: 8 }}>VIP PRO</div>
                         <p style={{ fontSize: 12, color: '#71717A', lineHeight: 1.5, flex: 1 }}>Accès total, 2 Coachings + 2 Blogs/mois.</p>
                         <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>49 €<span style={{ fontSize: 12, color: '#71717A', fontWeight: 500 }}> /mois</span></div>
                      </div>
                      {/* Plan: Elite */}
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column' }}>
                         <div style={{ fontSize: 11, fontWeight: 800, color: '#A1A1AA', letterSpacing: 1, marginBottom: 8 }}>VIP ELITE</div>
                         <p style={{ fontSize: 12, color: '#71717A', lineHeight: 1.5, flex: 1 }}>Accès total, Coaching hebdomadaire, Blog illimité.</p>
                         <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>99 €<span style={{ fontSize: 12, color: '#71717A', fontWeight: 500 }}> /mois</span></div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: c.bg, color: c.text, fontFamily: sans, transition: "background 0.3s, color 0.3s" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* ── Left Sidebar (Minea-inspired) ─────────────────────────────────── */}
      <div className="sidebar-container" style={{
        width: 260, flexShrink: 0, borderRight: `1px solid ${c.border}`, display: "flex", flexDirection: "column",
        height: "100vh", position: "sticky", top: 0, padding: "24px 16px", zIndex: 90, boxSizing: "border-box",
        background: c.surface
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", fontFamily: mono, boxShadow: `0 4px 16px ${c.accentGlow}` }}>VA</div>
          <div>
            <h1 className="outfit" style={{ fontSize: 17, fontWeight: 800, margin: 0, letterSpacing: "-0.5px", color: c.text }}>
              VIRAL<span style={{ color: c.accent }}>ACQ</span>
            </h1>
            <span style={{ fontSize: 10, color: c.accent2, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>PRO SUITE</span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flexGrow: 1 }}>
          {/* Submenu Trigger */}
          <button onClick={() => setResearchMenuOpen(!researchMenuOpen)} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 10, border: "none",
            background: "transparent", color: c.text, fontSize: 13.5, fontWeight: 700, fontFamily: mono, cursor: "pointer",
            textAlign: "left", transition: "all 0.2s", marginBottom: 2
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 16 }}>🔍</span> Research & Discovery
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: researchMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}><path d="m6 9 6 6 6-6"/></svg>
          </button>

          {/* Submenu Items */}
          <div style={{ 
            display: "flex", flexDirection: "column", gap: 6,
            overflow: "hidden", transition: "max-height 0.3s ease-in-out", 
            maxHeight: researchMenuOpen ? "200px" : "0px",
            marginLeft: 12, paddingLeft: 8, borderLeft: `2px solid ${c.border}`
          }}>
            <button onClick={() => handleTabChange("adspy")} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: "none",
              background: currentTab === "adspy" ? `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)` : "transparent",
              color: currentTab === "adspy" ? c.text : c.textMuted, fontSize: 13, fontWeight: 700, fontFamily: mono, cursor: "pointer",
              textAlign: "left", transition: "all 0.2s"
            }}>
              <AdSpyIcon color={currentTab === "adspy" ? c.accent : c.textDim} />
              Creative AdSpy
            </button>

            <button onClick={() => handleTabChange("productfinder")} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: "none",
              background: currentTab === "productfinder" ? `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)` : "transparent",
              color: currentTab === "productfinder" ? c.text : c.textMuted, fontSize: 13, fontWeight: 700, fontFamily: mono, cursor: "pointer",
              textAlign: "left", transition: "all 0.2s"
            }}>
              <ProductFinderIcon color={currentTab === "productfinder" ? c.accent : c.textDim} />
              Product Finder
            </button>

            <button onClick={() => handleTabChange("shopanalyzer")} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: "none",
              background: currentTab === "shopanalyzer" ? `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)` : "transparent",
              color: currentTab === "shopanalyzer" ? c.text : c.textMuted, fontSize: 13, fontWeight: 700, fontFamily: mono, cursor: "pointer",
              textAlign: "left", transition: "all 0.2s"
            }}>
              <ShopAnalyzerIcon color={currentTab === "shopanalyzer" ? c.accent : c.textDim} />
              Shop Analyzer
            </button>
          </div>
          
          <button onClick={() => handleTabChange("acquisition")} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: "none",
            background: currentTab === "acquisition" ? `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)` : "transparent",
            borderLeft: `3px solid ${currentTab === "acquisition" ? c.accent : "transparent"}`,
            color: currentTab === "acquisition" ? c.text : c.textMuted, fontSize: 13.5, fontWeight: 700, fontFamily: mono, cursor: "pointer",
            textAlign: "left", transition: "all 0.2s"
          }}>
            <SourcingCRMIcon color={currentTab === "acquisition" ? c.accent : c.textDim} />
            Sourcing CRM
          </button>

          <button onClick={() => handleTabChange("vetting")} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: "none",
            background: currentTab === "vetting" ? `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)` : "transparent",
            borderLeft: `3px solid ${currentTab === "vetting" ? c.accent : "transparent"}`,
            color: currentTab === "vetting" ? c.text : c.textMuted, fontSize: 13.5, fontWeight: 700, fontFamily: mono, cursor: "pointer",
            textAlign: "left", transition: "all 0.2s"
          }}>
            <VettingIAIcon color={currentTab === "vetting" ? c.accent : c.textDim} />
            Vetting IA
          </button>

          <button onClick={() => handleTabChange("matchmaking")} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: "none",
            background: currentTab === "matchmaking" ? `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)` : "transparent",
            borderLeft: `3px solid ${currentTab === "matchmaking" ? c.accent : "transparent"}`,
            color: currentTab === "matchmaking" ? c.text : c.textMuted, fontSize: 13.5, fontWeight: 700, fontFamily: mono, cursor: "pointer",
            textAlign: "left", transition: "all 0.2s"
          }}>
            <MatchmakingIcon color={currentTab === "matchmaking" ? c.accent : c.textDim} />
            Matchmaking
          </button>

          <button onClick={() => handleTabChange("talentagency")} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: "none",
            background: currentTab === "talentagency" ? `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)` : "transparent",
            borderLeft: `3px solid ${currentTab === "talentagency" ? c.accent : "transparent"}`,
            color: currentTab === "talentagency" ? c.text : c.textMuted, fontSize: 13.5, fontWeight: 700, fontFamily: mono, cursor: "pointer",
            textAlign: "left", transition: "all 0.2s"
          }}>
            <BriefcaseIcon color={currentTab === "talentagency" ? c.accent : c.textDim} />
            Talents & Gigs
          </button>

          <button onClick={() => handleTabChange("brandportal")} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: "none",
            background: currentTab === "brandportal" ? `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)` : "transparent",
            borderLeft: `3px solid ${currentTab === "brandportal" ? c.accent : "transparent"}`,
            color: currentTab === "brandportal" ? c.text : c.textMuted, fontSize: 13.5, fontWeight: 700, fontFamily: mono, cursor: "pointer",
            textAlign: "left", transition: "all 0.2s"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={currentTab === "brandportal" ? c.accent : c.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect width="18" height="14" x="3" y="6" rx="2" />
              <path d="m3 6 9 6 9-6" />
              <path d="M21 3v4M19 5h4" />
            </svg>
            Contacte l'Agence
          </button>

          <button onClick={() => handleTabChange("contractgenerator")} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: "none",
            background: currentTab === "contractgenerator" ? `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)` : "transparent",
            borderLeft: `3px solid ${currentTab === "contractgenerator" ? c.accent : "transparent"}`,
            color: currentTab === "contractgenerator" ? c.text : c.textMuted, fontSize: 13.5, fontWeight: 700, fontFamily: mono, cursor: "pointer",
            textAlign: "left", transition: "all 0.2s"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={currentTab === "contractgenerator" ? c.accent : c.textDim} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Générateur Contrats
          </button>


          <button onClick={() => handleTabChange("resources")} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: "none",
            background: currentTab === "resources" ? `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)` : "transparent",
            borderLeft: `3px solid ${currentTab === "resources" ? c.accent : "transparent"}`,
            color: currentTab === "resources" ? c.text : c.textMuted, fontSize: 13.5, fontWeight: 700, fontFamily: mono, cursor: "pointer",
            textAlign: "left", transition: "all 0.2s"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={currentTab === "resources" ? c.accent : c.textDim} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Ressources & FAQ
          </button>
        </div>



        {/* 🚀 Upgrade Button (Minea style) */}
        {userTier !== 'elite' && (
          <button onClick={() => setShowUpgradeModal(true)} style={{
            width: '100%', padding: '12px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(90deg, #f97316, #f59e0b)', color: '#fff',
            fontSize: 14, fontWeight: 700, fontFamily: mono, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)', marginBottom: 16
          }}>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'><rect width='18' height='11' x='3' y='11' rx='2' ry='2'/><path d='M7 11V7a5 5 0 0 1 10 0v4'/></svg>
            Améliorer
          </button>
        )}

        {/* 👤 Profile Settings (Minea style) */}
        <div style={{ position: 'relative', marginTop: 'auto' }}>
          <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} style={{
            width: '100%', background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 12, padding: '12px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userId || 'VA')}&background=8B5CF6&color=fff&size=100&rounded=true`} style={{ width: 32, height: 32, borderRadius: '50%' }} alt='User' />
              <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.text, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 140 }}>
                  {userId || 'brejnevdiaz@gmail.com'}
                </div>
                <div style={{ fontSize: 11, color: c.textDim, textTransform: 'uppercase', letterSpacing: 0.5 }}>{userTier}</div>
              </div>
            </div>
            <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke={c.textMuted} strokeWidth='2' style={{ transform: profileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><path d='m15 18-6-6 6-6'/></svg>
          </button>

          {profileMenuOpen && (
            <div style={{
              position: 'absolute', bottom: '100%', left: 0, width: '100%', marginBottom: 8,
              background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: '8px 0',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ padding: '8px 16px', borderBottom: `1px solid ${c.border}`, marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{userId || 'brejnevdiaz@gmail.com'}</div>
                <div style={{ fontSize: 11, color: c.textMuted }}>Compte {userTier}</div>
              </div>
              
              <button style={{ background: 'transparent', border: 'none', padding: '10px 16px', textAlign: 'left', fontSize: 13, color: c.text, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setProfileMenuOpen(false)}>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>
                Mon compte
              </button>
              <button style={{ background: 'transparent', border: 'none', padding: '10px 16px', textAlign: 'left', fontSize: 13, color: c.text, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => { setShowUpgradeModal(true); setProfileMenuOpen(false); }}>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><rect width='18' height='14' x='3' y='5' rx='2' ry='2'/><line x1='3' x2='21' y1='10' y2='10'/></svg>
                Abonnements
              </button>

              <div style={{ height: 1, background: c.border, margin: '4px 0' }} />

              <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: c.textDim }}>Langue</span>
                <select
                  value={uiLang}
                  onChange={(e) => setUiLang(e.target.value)}
                  style={{
                    background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 6,
                    padding: "4px 8px", fontFamily: mono, fontSize: 11, fontWeight: 600, outline: "none", cursor: "pointer"
                  }}
                >
                  <option value="fr">🇫🇷 FR</option>
                  <option value="en">🇬🇧 EN</option>
                  <option value="it">🇮🇹 IT</option>
                </select>
              </div>

              <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: c.textDim }}>Thème</span>
                <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28,
                  borderRadius: 6, border: `1px solid ${c.border}`, background: c.card, color: c.textMuted,
                  cursor: "pointer", transition: "all 0.2s"
                }} title={theme === "dark" ? "Light mode" : "Dark mode"}>
                  {theme === "dark" ? 
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> 
                    : 
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                  }
                </button>
              </div>

              <div style={{ height: 1, background: c.border, margin: '4px 0' }} />
              
              <button style={{ background: 'transparent', border: 'none', padding: '10px 16px', textAlign: 'left', fontSize: 13, color: c.error, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => { setProfileMenuOpen(false); supabase.auth.signOut(); }}>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' x2='9' y1='12' y2='12'/></svg>
                Se déconnecter
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ── Main Content Area ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        
        {/* Mobile Header Navigation Bar */}
        <div className="mobile-nav-bar" style={{
          background: c.surface, borderBottom: `1px solid ${c.border}`, padding: "12px 16px",
          display: "none", alignItems: "center", justifyContent: "space-between", zIndex: 95
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: mono }}>VA</div>
            <h1 className="outfit" style={{ fontSize: 15, fontWeight: 800, margin: 0, letterSpacing: "-0.5px", color: c.text }}>
              VIRAL<span style={{ color: c.accent }}>ACQ</span>
            </h1>
          </div>
          {/* Premium Mobile Navigation Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 14px", borderRadius: 10,
                border: `1px solid rgba(255,255,255,0.08)`,
                background: "rgba(0,0,0,0.3)",
                color: c.text, outline: "none", fontSize: 13, fontWeight: 700, fontFamily: mono,
                cursor: "pointer", transition: "all 0.2s",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 18, height: 18 }}>
                {currentTab === "adspy" ? <AdSpyIcon color={c.accent} /> :
                 currentTab === "productfinder" ? <ProductFinderIcon color={c.accent} /> :
                 currentTab === "shopanalyzer" ? <ShopAnalyzerIcon color={c.accent} /> :
                 currentTab === "acquisition" ? <SourcingCRMIcon color={c.accent} /> :
                 currentTab === "vetting" ? <VettingIAIcon color={c.accent} /> :
                 currentTab === "matchmaking" ? <MatchmakingIcon color={c.accent} /> :
                 currentTab === "talentagency" ? <BriefcaseIcon color={c.accent} /> :
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                }
              </div>
              <span>
                {currentTab === "adspy" ? "AdSpy" : currentTab === "productfinder" ? "Product Finder" : currentTab === "shopanalyzer" ? "Shop Analyzer" : currentTab === "acquisition" ? "Sourcing" : currentTab === "vetting" ? "Vetting IA" : currentTab === "matchmaking" ? "Matchmaking" : currentTab === "talentagency" ? "Talents & Gigs" : "Resources"}
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 4, transform: mobileMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}><path d="m6 9 6 6 6-6"/></svg>
            </button>
            
            {mobileMenuOpen && (
              <>
                <div onClick={() => setMobileMenuOpen(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 98 }} />
                <div style={{
                  position: "absolute", top: "100%", right: 0, marginTop: 8,
                  background: "rgba(15, 15, 22, 0.95)", backdropFilter: "blur(20px)", border: `1px solid rgba(255,255,255,0.1)`,
                  borderRadius: 12, boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
                  width: 220, zIndex: 100, overflow: "hidden", display: "flex", flexDirection: "column", padding: 6
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontSize: 11, color: c.textMuted, textTransform: "uppercase", letterSpacing: 1, padding: "4px 14px", marginTop: 4 }}>Research & Discovery</div>
                    {[
                      { id: "adspy", label: "Creative AdSpy", icon: <AdSpyIcon color={currentTab === "adspy" ? c.accent : c.textDim} /> },
                      { id: "productfinder", label: "Product Finder", icon: <ProductFinderIcon color={currentTab === "productfinder" ? c.accent : c.textDim} /> },
                      { id: "shopanalyzer", label: "Shop Analyzer", icon: <ShopAnalyzerIcon color={currentTab === "shopanalyzer" ? c.accent : c.textDim} /> },
                    ].map(item => (
                      <button 
                        key={item.id}
                        onClick={() => { handleTabChange(item.id); setMobileMenuOpen(false); }}
                        style={{
                          width: "100%", padding: "10px 14px", display: "flex", alignItems: "center", gap: 12, border: "none", borderRadius: 8,
                          background: currentTab === item.id ? `linear-gradient(135deg, ${c.accent}15, ${c.accent2}15)` : "transparent",
                          color: currentTab === item.id ? c.text : c.textDim,
                          textAlign: "left", fontSize: 13, fontFamily: mono, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20 }}>
                          {item.icon}
                        </div>
                        {item.label}
                      </button>
                    ))}
                    
                    <div style={{ height: 1, background: c.border, margin: "4px 14px" }} />
                    <div style={{ fontSize: 11, color: c.textMuted, textTransform: "uppercase", letterSpacing: 1, padding: "4px 14px" }}>Tools</div>

                    {[
                      { id: "acquisition", label: "Sourcing CRM", icon: <SourcingCRMIcon color={currentTab === "acquisition" ? c.accent : c.textDim} /> },
                      { id: "vetting", label: "Vetting IA", icon: <VettingIAIcon color={currentTab === "vetting" ? c.accent : c.textDim} /> },
                      { id: "matchmaking", label: "Matchmaking", icon: <MatchmakingIcon color={currentTab === "matchmaking" ? c.accent : c.textDim} /> },
                      { id: "talentagency", label: "Talents & Gigs", icon: <BriefcaseIcon color={currentTab === "talentagency" ? c.accent : c.textDim} /> },
                      { id: "resources", label: "Ressources & FAQ", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={currentTab === "resources" ? c.accent : c.textDim} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> }
                    ].map(item => (
                      <button 
                        key={item.id}
                        onClick={() => { handleTabChange(item.id); setMobileMenuOpen(false); }}
                        style={{
                          width: "100%", padding: "10px 14px", display: "flex", alignItems: "center", gap: 12, border: "none", borderRadius: 8,
                          background: currentTab === item.id ? `linear-gradient(135deg, ${c.accent}15, ${c.accent2}15)` : "transparent",
                          color: currentTab === item.id ? c.text : c.textDim,
                          textAlign: "left", fontSize: 13, fontFamily: mono, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20 }}>
                          {item.icon}
                        </div>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Desktop Top Header */}
        <div style={{ background: c.surface, borderBottom: `1px solid ${c.border}`, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 80 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <h2 className="outfit" style={{ fontSize: 18, fontWeight: 800, margin: 0, color: c.text, display: "flex", alignItems: "center" }}>
              {(() => {
                let icon, text;
                switch (currentTab) {
                  case "adspy": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#fireGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(239,68,68,0.3))" }}><defs><linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ef4444"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient></defs><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>; text = "CREATIVE ADSPY"; break;
                  case "productfinder": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#boxGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(139,92,246,0.3))" }}><defs><linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>; text = "WINNING PRODUCTS FINDER"; break;
                  case "shopanalyzer": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#bagGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(16,185,129,0.3))" }}><defs><linearGradient id="bagGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient></defs><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>; text = "SHOP TRENDS ANALYZER"; break;
                  case "acquisition": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#searchGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(244,63,94,0.3))" }}><defs><linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f43f5e"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient></defs><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>; text = "SOURCING & WORKSPACE"; break;
                  case "vetting": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#botGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(6,182,212,0.3))" }}><defs><linearGradient id="botGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#06b6d4"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient></defs><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>; text = "VETTING IA AUDIT"; break;
                  case "talentagency": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#briefGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(192,132,252,0.3))" }}><defs><linearGradient id="briefGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#c084fc"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>; text = "TALENT AGENCY & GIGS"; break;
                  case "resources": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#bookHGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(16,185,129,0.3))" }}><defs><linearGradient id="bookHGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#047857"/></linearGradient></defs><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>; text = "RESSOURCES & FAQ"; break;
                  case "brandportal": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#buildGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(245,158,11,0.3))" }}><defs><linearGradient id="buildGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M6 12H4a2 2 0 0 0-2 2v8"/><path d="M18 12h2a2 2 0 0 1 2 2v8"/><path d="M10 6h.01M14 6h.01M10 10h.01M14 10h.01M10 14h.01M14 14h.01M10 18h.01M14 18h.01"/></svg>; text = "PORTAIL MARQUES & COLLABORATIONS"; break;
                  case "contractgenerator": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#docGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(99,102,241,0.3))" }}><defs><linearGradient id="docGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>; text = "GÉNÉRATEUR CONTRATS IA"; break;
                  default: icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#handshakeGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(250,204,21,0.3))" }}><defs><linearGradient id="handshakeGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#facc15"/><stop offset="100%" stopColor="#f97316"/></linearGradient></defs><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3-6 6"/><path d="m21 14-6 6"/><path d="M9 19 6 22a2 2 0 1 1-3-3l6-6a2 2 0 0 1 3 3"/><path d="m15 15-3 3"/></svg>; text = "MATCHMAKING CATALOGUE"; break;
                }
                return <>{icon} {text}</>;
              })()}
            </h2>
          </div>


          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {userRole === "admin" && backendOk && (
              <div className="desktop-only" style={{ display: "flex", gap: 10 }}>
                {/* Tavily Badge */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8,
                  background: backendOk.serper === "✅" ? c.successSoft : c.errorBg,
                  border: `1px solid ${backendOk.serper === "✅" ? c.success : c.error}40`,
                  color: backendOk.serper === "✅" ? c.success : c.error,
                  fontSize: 11, fontWeight: 700, fontFamily: mono, boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  Tavily
                </div>

                {/* Anthropic Badge */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8,
                  background: c.accent2Soft,
                  border: `1px solid ${c.accent2}40`,
                  color: backendOk.anthropic?.includes("✅") ? c.success : c.warning,
                  fontSize: 11, fontWeight: 700, fontFamily: mono, boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  {backendOk.anthropic?.includes("✅") ? "Haiku" : "Auto"}
                </div>

                {/* Gmail Badge */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8,
                  background: backendOk.gmail === "✅" ? c.successSoft : c.warningBg,
                  border: `1px solid ${backendOk.gmail === "✅" ? c.success : c.warning}40`,
                  color: backendOk.gmail === "✅" ? c.success : c.warning,
                  fontSize: 11, fontWeight: 700, fontFamily: mono, boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  Gmail {backendOk.gmail !== "✅" && "⚠️"}
                </div>
              </div>
            )}
            {!backendOk && <Badge color={c.error} bg={c.errorBg}>⚠️ Backend offline</Badge>}
            {results.length > 0 && <div className="desktop-only"><Badge color={c.success} bg={c.successSoft}>Σ {stats.total}</Badge></div>}
            {emailsSent > 0 && <div className="desktop-only"><Badge color={c.emailBlue} bg={c.emailBlueSoft}>{t.sentCount(emailsSent)}</Badge></div>}

          </div>
        </div>

        {/* Main page content body */}
        <div className="main-content" style={{ padding: 24, width: "100%", boxSizing: "border-box", flexGrow: 1 }}>

        {currentTab === "adspy" ? (
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
          <BrandPortalTab c={c} uiLang={uiLang} API_URL={API_URL} />
        ) : currentTab === "contractgenerator" ? (
          <ContractGeneratorTab c={c} mono={mono} API_URL={API_URL} uiLang={uiLang} />
        ) : currentTab === "resources" ? (
          <ResourcesTab c={c} mono={mono} uiLang={uiLang} userTier={userTier} onUpgradeTier={handleUpgradeSimulate} />
        ) : (
          <MatchmakingTab c={c} mono={mono} API_URL={API_URL} uiLang={uiLang} />
        )}
      </div>
      </div>

      {/* ── UPGRADE MODAL (STUNNING GLASSMORPHIC COMPARISON DESIGN) ── */}
      {showUpgradeModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(6, 6, 12, 0.8)", backdropFilter: "blur(14px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 20
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

      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${c.border};border-radius:3px}
        button:hover:not(:disabled){filter:brightness(1.12)}
        a{text-decoration:none}a:hover{text-decoration:underline}
        input{transition:border-color 0.15s}

        @media (max-width: 768px) {
          .sidebar-container { display: none !important; }
          .mobile-nav-bar { display: flex !important; }
          .main-content { padding: 16px !important; }
        }
        @media (min-width: 769px) {
          .sidebar-container { display: flex !important; }
          .mobile-nav-bar { display: none !important; }
        }
      `}</style>

      {/* Global toast notification */}
      {appToast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, padding: "14px 26px", borderRadius: 14,
          background: appToast.type === "success" ? "linear-gradient(90deg,#10b981,#059669)"
            : appToast.type === "warning" ? "linear-gradient(90deg,#f59e0b,#d97706)"
            : appToast.type === "info" ? "linear-gradient(90deg,#6366f1,#8B5CF6)"
            : "linear-gradient(90deg,#ef4444,#dc2626)",
          color: "#fff", fontWeight: 700, fontSize: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.32)",
          animation: "fadeIn 0.25s ease-out",
          maxWidth: 540, textAlign: "center", pointerEvents: "none",
        }}>
          {appToast.message}
        </div>
      )}
    </div>
  );
}
// build: 2026-07-01
