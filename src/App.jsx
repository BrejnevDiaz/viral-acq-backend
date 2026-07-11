import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import VettingTab from "./VettingTab";
import MatchmakingTab from "./MatchmakingTab";
import SourcingCRMTab from "./SourcingCRMTab";
import AdSpyTab from "./AdSpyTab";
import ProductFinderTab from "./ProductFinderTab";
import ShopAnalyzerTab from "./ShopAnalyzerTab";
import TalentAgencyTab from "./TalentAgencyTab";
import BrandPortalTab from "./BrandPortalTab";
import ContractGeneratorTab from "./ContractGeneratorTab";
import ResourcesTab from "./ResourcesTab";
import AccountSettings from "./AccountSettings";
import VideoMarketplaceTab from "./VideoMarketplaceTab";
import CreatorScoreTab from "./CreatorScoreTab";
import KnowledgeAdminTab from "./KnowledgeAdminTab";
import PaywallModal from "./PaywallModal";
import OfferBanner from "./OfferBanner";
import ChatbotWidget from "./ChatbotWidget";
import LandingPage from "./LandingPage";
import FooterInfoPage from "./FooterInfoPage";
import BlogPage from "./BlogPage";
import CoachIATab from "./CoachIATab";
import { FOOTER_PAGE_ROUTES } from "./footerPagesContent";
import DashboardLayout from "./DashboardLayout";
import { apiFetch } from "./utils/apiClient";
import { useAuth } from "./contexts/AuthContext";
import { useRole } from "./contexts/RoleContext";

// ─── UI Translations ─────────────────────────────────────────────────────────
const T = {
  fr: {
    subtitle:        "Tavily Search + Email Agent • 8 canaux",
    sentCount:       (n) => `📤 ${n} envoyés`,
    logLaunched:     (n) => `🚀 Agent lancé — ${n} requêtes planifiées`,
    logPlatforms:    (np, nn) => `📡 ${np} plateformes × ${nn} niches`,
    logNoResult:     "📭 Nessun risultato",
    logAnalyzing:    (n) => `📋 ${n} résultats → analyse...`,
    logDone:         (n) => `🏁 Terminé — ${n} prospects qualifiés (score ≥65)`,
    logStopped:      "⏹️ Interrompu",
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
    sentCount:       (n) => `📤 ${n} sent`,
    logLaunched:     (n) => `🚀 Agent launched — ${n} queries planned`,
    logPlatforms:    (np, nn) => `📡 ${np} platforms × ${nn} niches`,
    logNoResult:     "📭 No results",
    logAnalyzing:    (n) => `📋 ${n} results → analyzing...`,
    logDone:         (n) => `🏁 Done — ${n} qualified prospects (score ≥65)`,
    logStopped:      "⏹️ Stopped",
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
    sentCount:       (n) => `📤 ${n} inviati`,
    logLaunched:     (n) => `🚀 Agente avviato — ${n} query pianificate`,
    logPlatforms:    (np, nn) => `📡 ${np} piattaforme × ${nn} nicchie`,
    logNoResult:     "📭 Nessun risultato",
    logAnalyzing:    (n) => `📋 ${n} risultati → analisi...`,
    logDone:         (n) => `🏁 Terminato — ${n} prospect qualificati (score ≥65)`,
    logStopped:      "⏹️ Interrotto",
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

// ─── Main App ─────────────────────────────────────────────────────────────────
// La construction des requêtes et le parsing des résultats sont délégués au backend
// via POST /api/campaigns/start → campaignManager.js → src/utils/queryBuilder.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function ProspectionAgent() {
  const location = useLocation();
  const [theme, setTheme]               = useState("light");
  const [uiLang, setUiLang]             = useState("fr");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactFormStatus, setContactFormStatus] = useState('idle');
  const [results, setResults]           = useState([]);
  const [stats, setStats]               = useState({ total: 0, byPlatform: {}, byNiche: {} });
  const [backendOk, setBackendOk]       = useState(null);
  const [emailsSent, setEmailsSent]     = useState(0);

  const {
    isLoggedIn, userId, userEmail,
    authMode, setAuthMode,
    showLoginModal, setShowLoginModal,
    emailInput, setEmailInput,
    passInput, setPassInput,
    handleAuth, authLoading, authError,
    signInWithGoogle
  } = useAuth();
  const { userRole, userTier, showUpgradeModal, upgradeModalData,
          isUpgradingSim, upgradeSimSuccess, openUpgradeModal,
          closeUpgradeModal, upgradeTier, checkAnalysisAllowance,
          switchUserRole, requestTabAccess, signupRole, setSignupRole } = useRole();
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  const handleSwitchToBrand = async () => {
    setIsSwitchingRole(true);
    await switchUserRole("brand");
    setIsSwitchingRole(false);
  };

  const [currentTab, setCurrentTab]       = useState("adspy");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalType, setLegalType] = useState("");
  const [researchMenuOpen, setResearchMenuOpen] = useState(true);
  const [redirectShop, setRedirectShop]   = useState(null);
  const [pendingIntentTab, setPendingIntentTab] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly | annual — annual = 20% off, billed yearly
  const [appToast, setAppToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showAppToast = (message, type = "success") => {
    clearTimeout(toastTimerRef.current);
    setAppToast({ message, type });
    toastTimerRef.current = setTimeout(() => setAppToast(null), 4000);
  };

  const importLeadFromAdSpy = useCallback((lead) => {
    // Enforce Standard tier limit of 10 Sourcing CRM leads
    if (userTier === "standard" && results.length >= 10) {
      openUpgradeModal({
        tab: "acquisition",
        title: uiLang === "fr" ? "Limite de Sourcing CRM Atteinte" : uiLang === "it" ? "Limite Sourcing CRM Raggiunto" : "Sourcing CRM Limit Reached",
        reason: uiLang === "fr"
          ? "Le forfait Standard limite votre Sourcing CRM à 10 prospects qualifiés. Passez au niveau VIP Pro ou VIP Elite pour importer des leads en illimité !"
          : "The Standard plan limits your Sourcing CRM to 10 qualified prospects. Upgrade to VIP Pro or VIP Elite to unlock unlimited lead imports!"
      });
      return;
    }

    setResults(prev => {
      if (prev.some(x => x.name === lead.name && x.platformId === lead.platformId)) {
        showAppToast(uiLang === "fr" ? "Ce lead a déjà été importé !" : uiLang === "it" ? "Questo lead è già stato importato!" : "This lead has already been imported!", "warning");
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
    }
  }, [isLoggedIn]);

  // CRM: Save leads automatically to localStorage (Legacy fallback, now backend saves it on send)
  useEffect(() => {
    if (isLoggedIn && userEmail && results.length > 0) {
      localStorage.setItem(`va_leads_${userEmail}`, JSON.stringify(results));
    }
  }, [results, isLoggedIn, userEmail]);

  const handleTabChange = (tabId) => {
    if (!requestTabAccess(tabId, uiLang)) return;
    setCurrentTab(tabId);
  };

  // Chat widget "Unlock VIP Elite" CTA: visitors who aren't logged in yet go
  // straight to signup; logged-in users see the in-app upgrade modal instead.
  const openEliteSignup = () => { setAuthMode("signup"); setShowLoginModal(true); };

  // Landing page CTAs tied to a specific feature (AdSpy, Matchmaking, CRM...)
  // remember that intent so login/signup lands the user directly on the
  // matching dashboard tab instead of the generic default.
  const openAuthWithIntent = (tabId, mode = "signup") => {
    setPendingIntentTab(tabId);
    setAuthMode(mode);
    setShowLoginModal(true);
  };

  useEffect(() => {
    if (isLoggedIn && pendingIntentTab) {
      // Route through handleTabChange (not setCurrentTab directly) so a
      // free-tier signup landing on a gated tab still hits requestTabAccess
      // and gets the upgrade modal instead of silently seeing gated content.
      handleTabChange(pendingIntentTab);
      setPendingIntentTab(null);
    }
  }, [isLoggedIn, pendingIntentTab]);

  // Public marketing pages linked from the Footer — accessible via a real URL.
  // Gated on !isLoggedIn: once a login/signup succeeds from one of these pages,
  // the URL doesn't change, so without this check the render would keep
  // returning the same public page forever instead of falling through to the
  // Dashboard below — leaving the Auth modal looking stuck/unresponsive.
  if (!isLoggedIn && location.pathname === "/blog-ressources") {
    return (
      <>
        <BlogPage
          uiLang={uiLang} setUiLang={setUiLang}
          authMode={authMode} setAuthMode={setAuthMode}
          showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal}
          openAuthWithIntent={openAuthWithIntent}
          emailInput={emailInput} setEmailInput={setEmailInput}
          passInput={passInput} setPassInput={setPassInput}
          signupRole={signupRole} setSignupRole={setSignupRole}
          handleAuth={handleAuth} signInWithGoogle={signInWithGoogle}
          authLoading={authLoading} authError={authError}
          showContactModal={showContactModal} setShowContactModal={setShowContactModal}
          contactFormStatus={contactFormStatus} setContactFormStatus={setContactFormStatus}
          showLegalModal={showLegalModal} setShowLegalModal={setShowLegalModal}
          legalType={legalType} setLegalType={setLegalType}
        />
        <ChatbotWidget uiLang={uiLang} API_URL={API_URL} onUpgradeClick={openEliteSignup} />
      </>
    );
  }

  const footerPageKey = !isLoggedIn ? FOOTER_PAGE_ROUTES.find(slug => location.pathname === `/${slug}`) : null;
  if (footerPageKey) {
    return (
      <>
        <FooterInfoPage
          pageKey={footerPageKey}
          uiLang={uiLang} setUiLang={setUiLang}
          authMode={authMode} setAuthMode={setAuthMode}
          showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal}
          openAuthWithIntent={openAuthWithIntent}
          emailInput={emailInput} setEmailInput={setEmailInput}
          passInput={passInput} setPassInput={setPassInput}
          signupRole={signupRole} setSignupRole={setSignupRole}
          handleAuth={handleAuth} signInWithGoogle={signInWithGoogle}
          authLoading={authLoading} authError={authError}
          showContactModal={showContactModal} setShowContactModal={setShowContactModal}
          contactFormStatus={contactFormStatus} setContactFormStatus={setContactFormStatus}
          showLegalModal={showLegalModal} setShowLegalModal={setShowLegalModal}
          legalType={legalType} setLegalType={setLegalType}
        />
        <ChatbotWidget uiLang={uiLang} API_URL={API_URL} onUpgradeClick={openEliteSignup} />
      </>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <LandingPage
          uiLang={uiLang} setUiLang={setUiLang}
          authMode={authMode} setAuthMode={setAuthMode}
          showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal}
          openAuthWithIntent={openAuthWithIntent}
          emailInput={emailInput} setEmailInput={setEmailInput}
          passInput={passInput} setPassInput={setPassInput}
          signupRole={signupRole} setSignupRole={setSignupRole}
          handleAuth={handleAuth} signInWithGoogle={signInWithGoogle}
          authLoading={authLoading} authError={authError}
          showContactModal={showContactModal} setShowContactModal={setShowContactModal}
          contactFormStatus={contactFormStatus} setContactFormStatus={setContactFormStatus}
          showLegalModal={showLegalModal} setShowLegalModal={setShowLegalModal}
          legalType={legalType} setLegalType={setLegalType}
        />
        <ChatbotWidget uiLang={uiLang} API_URL={API_URL} onUpgradeClick={openEliteSignup} />
      </>
    );
  }

  return (
    <>
      <DashboardLayout
        c={c} mono={mono} currentTab={currentTab} handleTabChange={handleTabChange}
        researchMenuOpen={researchMenuOpen} setResearchMenuOpen={setResearchMenuOpen}
        profileMenuOpen={profileMenuOpen} setProfileMenuOpen={setProfileMenuOpen}
        uiLang={uiLang} setUiLang={setUiLang} theme={theme} setTheme={setTheme}
        mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}
        backendOk={backendOk} resultsCount={results.length}
        statsTotal={stats.total} emailsSent={emailsSent} t={t}
        userTier={userTier} userId={userId} userEmail={userEmail}
        setShowUpgradeModal={() => openUpgradeModal({
          tab: "",
          title: uiLang === "fr" ? "💎 Passez à un Forfait Supérieur" : uiLang === "it" ? "💎 Passa a un Piano Superiore" : "💎 Upgrade Your Plan",
          reason: uiLang === "fr" ? "Débloquez tous les outils premium d'Acquisition Pro." : uiLang === "it" ? "Sblocca tutti gli strumenti premium di Acquisition Pro." : "Unlock every premium tool in Acquisition Pro."
        })}
      >

        <OfferBanner c={c} mono={mono} uiLang={uiLang} />
        {userRole === 'creator' && currentTab !== 'talentagency' && currentTab !== 'resources' && currentTab !== 'videomarketplace' && currentTab !== 'creatorscore' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#09090b', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', padding: 40 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>{uiLang === 'fr' ? 'Espace réservé aux Marques' : uiLang === 'it' ? 'Area riservata ai Brand' : 'Brand Only Area'}</h2>
            <p style={{ color: '#A1A1AA', fontSize: 15, maxWidth: 400, lineHeight: 1.6, marginBottom: 32 }}>
              {uiLang === 'fr'
                ? "En tant que Créateur UGC, cette section de recherche et d'espionnage ne vous est pas accessible. Votre espace de gestion des missions se trouve dans l'onglet Talents & Gigs."
                : "As a UGC Creator, this research and spy section is locked. Your mission management workspace is in the Talents & Gigs tab."}
            </p>
            <button onClick={() => setCurrentTab('talentagency')} style={{ background: '#10B981', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              {uiLang === 'fr' ? 'Aller à mes missions' : uiLang === 'it' ? 'Vai alle mie missioni' : 'Go to my missions'}
            </button>
          </div>
        ) : currentTab === "knowledge" && userRole === "admin" ? (
          <KnowledgeAdminTab c={c} mono={mono} uiLang={uiLang} API_URL={API_URL} />
        ) : currentTab === "creatorscore" ? (
          <CreatorScoreTab c={c} mono={mono} uiLang={uiLang} onImportLead={importLeadFromAdSpy} />
        ) : currentTab === "adspy" ? (
          <AdSpyTab c={c} mono={mono} API_URL={API_URL} onImportLead={importLeadFromAdSpy} uiLang={uiLang} setCurrentTab={setCurrentTab} setRedirectShop={setRedirectShop} userTier={userTier} openUpgradeModal={openUpgradeModal} />
        ) : currentTab === "productfinder" ? (
          <ProductFinderTab c={c} mono={mono} API_URL={API_URL} onImportLead={importLeadFromAdSpy} uiLang={uiLang} userTier={userTier} openUpgradeModal={openUpgradeModal} />
        ) : currentTab === "acquisition" ? (
          <SourcingCRMTab c={c} mono={mono} uiLang={uiLang} API_URL={API_URL} results={results} setResults={setResults} stats={stats} backendOk={backendOk} setEmailsSent={setEmailsSent} />
        ) : currentTab === "vetting" ? (
          <VettingTab c={c} mono={mono} API_URL={API_URL} uiLang={uiLang} t={(k) => t[k] || k} />
        ) : currentTab === "shopanalyzer" ? (
          <ShopAnalyzerTab c={c} mono={mono} API_URL={API_URL} onImportLead={importLeadFromAdSpy} uiLang={uiLang} redirectShop={redirectShop} setRedirectShop={setRedirectShop} onAnalyzeStore={() => checkAnalysisAllowance(uiLang)} />
        ) : currentTab === "talentagency" ? (
          <TalentAgencyTab c={c} mono={mono} API_URL={API_URL} uiLang={uiLang} onImportLead={importLeadFromAdSpy} userId={userId} />
        ) : currentTab === "brandportal" ? (
          <BrandPortalTab c={c} mono={mono} uiLang={uiLang} API_URL={API_URL} />
        ) : currentTab === "contractgenerator" ? (
          <ContractGeneratorTab c={c} mono={mono} API_URL={API_URL} uiLang={uiLang} />
        ) : currentTab === "resources" ? (
          <ResourcesTab c={c} mono={mono} uiLang={uiLang} />
        ) : currentTab === "account" ? (
          <AccountSettings c={c} mono={mono} uiLang={uiLang} userId={userId} userEmail={userEmail} userTier={userTier} setShowUpgradeModal={() => openUpgradeModal({ tab: "", title: uiLang === "fr" ? "💎 Passez à un Forfait Supérieur" : "💎 Upgrade Your Plan", reason: "" })} />
        ) : currentTab === "videomarketplace" ? (
          <VideoMarketplaceTab c={c} mono={mono} uiLang={uiLang} userId={userId} />
        ) : currentTab === "coach" ? (
          <CoachIATab c={c} mono={mono} uiLang={uiLang} userTier={userTier} API_URL={API_URL} onUpgradeClick={() => openUpgradeModal({ tab: "", title: uiLang === "fr" ? "💎 Passez au VIP Elite" : "💎 Upgrade to VIP Elite", reason: "" })} />
        ) : (
          <MatchmakingTab c={c} mono={mono} API_URL={API_URL} uiLang={uiLang} />
        )}
      </DashboardLayout>

      {/* ── PAYWALL CONTEXTUEL (déblocage créateurs + offre 48h) ── */}
      <PaywallModal c={c} mono={mono} uiLang={uiLang} />

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
                  {uiLang === "fr" ? "Traitement de l'abonnement..." : uiLang === "it" ? "Elaborazione dell'abbonamento..." : "Processing secure subscription..."}
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
                  {uiLang === "fr" ? "Abonnement Activé ! 🎉" : uiLang === "it" ? "Abbonamento Attivato! 🎉" : "Subscription Activated! 🎉"}
                </h3>
                <p style={{ fontSize: 13, color: c.textMuted, margin: 0 }}>
                  {uiLang === "fr" ? "Bienvenue dans le club premium d'Acquisition Pro !" : uiLang === "it" ? "Benvenuto nel club premium di Acquisition Pro!" : "Welcome to the premium suite of Acquisition Pro!"}
                </p>
              </div>
            )}

            {/* Close */}
            <button onClick={closeUpgradeModal} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: c.textDim, fontSize: 20, cursor: "pointer" }}>✖</button>

            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <span style={{ fontSize: 36 }}>💎</span>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: c.text, margin: "8px 0 6px 0", letterSpacing: "-0.5px" }}>{upgradeModalData.title}</h3>
              <p style={{ fontSize: 13.5, color: c.textMuted, margin: 0, lineHeight: 1.5 }}>{upgradeModalData.reason}</p>
            </div>

            {userRole === "creator" && (
              <div style={{
                background: `${c.accent}15`, border: `1px solid ${c.accent}55`, borderRadius: 12, padding: 12,
                marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14
              }}>
                <div style={{ fontSize: 13, color: c.textDim, flex: 1, fontFamily: mono, lineHeight: 1.4 }}>
                  <strong style={{ color: c.text }}>{uiLang === "fr" ? "Statut Actuel : Créateur" : uiLang === "it" ? "Status: Creator" : "Current Status: Creator"}</strong><br/>
                  {uiLang === "fr" ? "Les forfaits ci-dessous sont dédiés aux Marques et Agences." : uiLang === "it" ? "I piani sottostanti sono dedicati a Brand e Agenzie." : "The plans below are dedicated to Brands and Agencies."}
                </div>
                <button
                  onClick={handleSwitchToBrand}
                  disabled={isSwitchingRole}
                  style={{
                    background: c.accent, color: "#fff", border: "none", padding: "8px 14px", borderRadius: 8,
                    fontSize: 12, fontWeight: 700, cursor: isSwitchingRole ? "wait" : "pointer", flexShrink: 0, fontFamily: mono,
                    boxShadow: `0 4px 12px ${c.accent}44`
                  }}
                >
                  {isSwitchingRole ? "..." : (uiLang === "fr" ? "Basculer vers Marque ➔" : uiLang === "it" ? "Passa a Brand ➔" : "Switch to Brand ➔")}
                </button>
              </div>
            )}

            {/* Monthly / Annual toggle — annual nudges toward a longer commitment */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: billingCycle === "monthly" ? c.text : c.textDim, fontFamily: mono }}>
                {uiLang === "fr" ? "Mensuel" : uiLang === "it" ? "Mensile" : "Monthly"}
              </span>
              <button
                type="button"
                onClick={() => setBillingCycle(v => v === "monthly" ? "annual" : "monthly")}
                style={{ width: 44, height: 24, borderRadius: 20, border: `1px solid ${c.border}`, background: billingCycle === "annual" ? `linear-gradient(135deg, ${c.accent}, #ec4899)` : c.bg, position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}
              >
                <span style={{ position: "absolute", top: 2, left: billingCycle === "annual" ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: billingCycle === "annual" ? "#fff" : c.textMuted, transition: "left 0.2s" }} />
              </button>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: billingCycle === "annual" ? c.text : c.textDim, fontFamily: mono, display: "flex", alignItems: "center", gap: 6 }}>
                {uiLang === "fr" ? "Annuel" : uiLang === "it" ? "Annuale" : "Annual"}
                <span style={{ background: c.successSoft, color: c.success, fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 20 }}>-20%</span>
              </span>
            </div>

            <div className="grid-1-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>

              {/* Plus card option */}
              <div style={{
                background: c.bg, border: `1.5px solid ${c.accent}44`, borderRadius: 16, padding: 16,
                display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative"
              }}>
                <div>
                  <span style={{ fontSize: 10, background: c.accentSoft, color: c.accent, padding: "2px 8px", borderRadius: 4, fontWeight: "bold", textTransform: "uppercase", fontFamily: mono, display: "inline-block", marginBottom: 6 }}>Plus</span>
                  <h4 style={{ margin: "4px 0 12px 0", fontSize: 18, fontWeight: 800, color: c.text }}>Plan Plus</h4>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      uiLang === "fr" ? "AdSpy complet dropshipping" : "Full dropshipping AdSpy",
                      uiLang === "fr" ? "CRM Sourcing (20 leads)" : "Sourcing CRM (20 leads)",
                      uiLang === "fr" ? "Déblocages illimités" : "Unlimited unlocks"
                    ].map((feat, i) => (
                      <li key={i} style={{ fontSize: 12, color: c.textDim, lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <svg style={{ flexShrink: 0, marginTop: 2, color: c.accent }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: c.accent, fontFamily: mono }}>
                    {billingCycle === "annual" ? Math.round(69 * 0.8) : 69} €<span style={{ fontSize: 10, color: c.textDim, fontWeight: 400 }}> {uiLang === "fr" ? "/mois" : uiLang === "it" ? "/mese" : "/mo"}{billingCycle === "annual" ? (uiLang === "fr" ? ", facturé annuellement" : uiLang === "it" ? ", fatturato annualmente" : ", billed yearly") : ""}</span>
                  </div>
                  <button onClick={() => upgradeTier("plus", () => { if (upgradeModalData.tab) setCurrentTab(upgradeModalData.tab); })} style={{ width: "100%", marginTop: 10, padding: "10px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontSize: 11.5, fontWeight: 700, fontFamily: mono, cursor: "pointer", boxShadow: `0 4px 12px ${c.accentSoft}` }}>
                    {uiLang === "fr" ? "Activer Plus ➔" : "Subscribe Plus ➔"}
                  </button>
                </div>
              </div>

              {/* VIP Pro card option */}
              <div style={{
                background: c.bg, border: `1.5px solid ${c.accent2}`, borderRadius: 16, padding: 16,
                display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative",
                boxShadow: `0 0 24px ${c.accent2}22`, transform: "scale(1.03)"
              }}>
                <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: c.accent2, color: "#fff", fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: 20, fontFamily: mono, whiteSpace: "nowrap", boxShadow: `0 4px 10px ${c.accent2Soft}` }}>
                  {uiLang === "fr" ? "LE PLUS POPULAIRE" : "MOST POPULAR"}
                </span>
                <div>
                  <span style={{ fontSize: 10, background: c.accent2Soft, color: c.accent2, padding: "2px 8px", borderRadius: 4, fontWeight: "bold", textTransform: "uppercase", fontFamily: mono, display: "inline-block", margin: "8px 0" }}>Pro</span>
                  <h4 style={{ margin: "4px 0 12px 0", fontSize: 18, fontWeight: 800, color: c.text }}>VIP Pro Plan</h4>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      uiLang === "fr" ? "Outils illimités (Spy, CRM)" : "Unlimited tools (Spy, CRM)",
                      uiLang === "fr" ? "Sourcing influenceurs avancé" : "Advanced influencer Sourcing",
                      uiLang === "fr" ? "1 Coaching Live mensuel" : "1 Monthly Live Coaching"
                    ].map((feat, i) => (
                      <li key={i} style={{ fontSize: 12, color: c.textDim, lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <svg style={{ flexShrink: 0, marginTop: 2, color: c.accent2 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: c.accent2, fontFamily: mono }}>
                    {billingCycle === "annual" ? Math.round(99 * 0.8) : 99} €<span style={{ fontSize: 10, color: c.textDim, fontWeight: 400 }}> {uiLang === "fr" ? "/mois" : uiLang === "it" ? "/mese" : "/mo"}{billingCycle === "annual" ? (uiLang === "fr" ? ", facturé annuellement" : uiLang === "it" ? ", fatturato annualmente" : ", billed yearly") : ""}</span>
                  </div>
                  <button onClick={() => upgradeTier("vip_pro", () => { if (upgradeModalData.tab) setCurrentTab(upgradeModalData.tab); })} style={{ width: "100%", marginTop: 10, padding: "10px", borderRadius: 8, border: "none", background: c.accent2, color: "#fff", fontSize: 11.5, fontWeight: 700, fontFamily: mono, cursor: "pointer", boxShadow: `0 4px 12px ${c.accent2Soft}` }}>
                    {uiLang === "fr" ? "Activer VIP Pro ➔" : "Subscribe VIP Pro ➔"}
                  </button>
                </div>
              </div>

              {/* VIP Elite card option */}
              <div style={{
                background: c.bg, border: `1.5px solid ${c.success}44`, borderRadius: 16, padding: 16,
                display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative"
              }}>
                <div>
                  <span style={{ fontSize: 10, background: c.successSoft, color: c.success, padding: "2px 8px", borderRadius: 4, fontWeight: "bold", textTransform: "uppercase", fontFamily: mono, display: "inline-block", marginBottom: 6 }}>Elite</span>
                  <h4 style={{ margin: "4px 0 12px 0", fontSize: 18, fontWeight: 800, color: c.text }}>VIP Elite Plan</h4>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      uiLang === "fr" ? "TOUTE l'application en illimité" : "Everything entirely unlimited",
                      uiLang === "fr" ? "Coaching Vidéo Hebdomadaire" : "Weekly Video Coaching",
                      uiLang === "fr" ? "Accès prioritaire aux talents" : "Priority access to new talent"
                    ].map((feat, i) => (
                      <li key={i} style={{ fontSize: 12, color: c.textDim, lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <svg style={{ flexShrink: 0, marginTop: 2, color: c.success }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: c.success, fontFamily: mono }}>
                    {billingCycle === "annual" ? Math.round(299 * 0.8) : 299} €<span style={{ fontSize: 10, color: c.textDim, fontWeight: 400 }}> {uiLang === "fr" ? "/mois" : uiLang === "it" ? "/mese" : "/mo"}{billingCycle === "annual" ? (uiLang === "fr" ? ", facturé annuellement" : uiLang === "it" ? ", fatturato annualmente" : ", billed yearly") : ""}</span>
                  </div>
                  <button onClick={() => upgradeTier("vip_elite", () => { if (upgradeModalData.tab) setCurrentTab(upgradeModalData.tab); })} style={{ width: "100%", marginTop: 10, padding: "10px", borderRadius: 8, border: "none", background: c.success, color: "#fff", fontSize: 11.5, fontWeight: 700, fontFamily: mono, cursor: "pointer", boxShadow: `0 4px 12px ${c.successSoft}` }}>
                    {uiLang === "fr" ? "Activer VIP Elite ➔" : "Subscribe VIP Elite ➔"}
                  </button>
                </div>
              </div>

            </div>

            {userTier === "free" && (
              <button onClick={() => upgradeTier("standard", () => { if (upgradeModalData.tab) setCurrentTab(upgradeModalData.tab); })} style={{ width: "100%", padding: "12px", borderRadius: 10, border: `1.5px solid ${c.accent}`, background: `${c.accent}15`, color: c.accent, fontSize: 12.5, fontWeight: 700, fontFamily: mono, cursor: "pointer", transition: "all 0.2s" }}>
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

      <ChatbotWidget uiLang={uiLang} userTier={userTier} API_URL={API_URL} onUpgradeClick={() => openUpgradeModal({
        tab: "chatbot",
        title: uiLang === "fr" ? "👑 Coach IA Mindeo Blueprint" : uiLang === "it" ? "👑 Coach IA Mindeo Blueprint" : "👑 Mindeo Blueprint AI Coach",
        reason: uiLang === "fr"
          ? "Le coaching e-commerce avancé par IA est réservé au forfait VIP Elite. Passez au niveau supérieur pour débloquer des réponses stratégiques illimitées."
          : uiLang === "it"
          ? "Il coaching e-commerce avanzato tramite IA è riservato al piano VIP Elite. Passa al livello superiore per sbloccare risposte strategiche illimitate."
          : "Advanced AI-powered e-commerce coaching is reserved for the VIP Elite plan. Upgrade to unlock unlimited strategic answers."
      })} />
    </>
  );
}
// build: 2026-07-01
