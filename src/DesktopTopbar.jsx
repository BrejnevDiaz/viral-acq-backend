import Badge from "./Badge";

// ─── Desktop Top Header ──────────────────────────────────────────────────────
const PAGE_TITLES = {
  adspy:             { fr: "CREATIVE ADSPY",                    en: "CREATIVE ADSPY",              it: "CREATIVE ADSPY" },
  productfinder:     { fr: "CHERCHEUR DE PRODUITS GAGNANTS",     en: "WINNING PRODUCTS FINDER",     it: "RICERCA PRODOTTI VINCENTI" },
  shopanalyzer:      { fr: "ANALYSEUR DE TENDANCES BOUTIQUES",   en: "SHOP TRENDS ANALYZER",         it: "ANALIZZATORE TREND SHOP" },
  acquisition:       { fr: "SOURCING & ESPACE DE TRAVAIL",       en: "SOURCING & WORKSPACE",         it: "SOURCING & WORKSPACE" },
  vetting:           { fr: "AUDIT VETTING IA",                   en: "AI VETTING AUDIT",             it: "AUDIT VETTING IA" },
  talentagency:      { fr: "AGENCE DE TALENTS & MISSIONS",       en: "TALENT AGENCY & GIGS",         it: "AGENZIA TALENTI & GIGS" },
  resources:         { fr: "RESSOURCES & FAQ",                   en: "RESOURCES & FAQ",              it: "RISORSE & FAQ" },
  brandportal:       { fr: "PORTAIL MARQUES & COLLABORATIONS",   en: "BRAND & COLLABORATION PORTAL", it: "PORTALE BRAND & COLLABORAZIONI" },
  contractgenerator: { fr: "GÉNÉRATEUR CONTRATS IA",             en: "AI CONTRACT GENERATOR",        it: "GENERATORE CONTRATTI IA" },
  videomarketplace:  { fr: "MARKETPLACE VIDÉO",                  en: "VIDEO MARKETPLACE",            it: "MARKETPLACE VIDEO" },
  // ⚠️ Toute entrée de TABS (tabsConfig.jsx) absente de cette table hérite du
  // titre `default` — c'est ainsi que le Coach IA affichait "CATALOGUE
  // MATCHMAKING". Ajouter ici tout nouvel onglet.
  creatorscore:      { fr: "CREATOR SCORE",                      en: "CREATOR SCORE",                it: "CREATOR SCORE" },
  matchmaking:       { fr: "CATALOGUE MATCHMAKING",              en: "MATCHMAKING CATALOGUE",        it: "CATALOGO MATCHMAKING" },
  knowledge:         { fr: "CONNAISSANCES IA",                   en: "AI KNOWLEDGE",                 it: "CONOSCENZE IA" },
  coach:             { fr: "COACH IA ELITE",                     en: "ELITE AI COACH",               it: "COACH IA ELITE" },
  default:           { fr: "CATALOGUE MATCHMAKING",              en: "MATCHMAKING CATALOGUE",        it: "CATALOGO MATCHMAKING" },
};

export default function DesktopTopbar({
  c, mono, currentTab, userRole, backendOk,
  resultsCount, statsTotal, emailsSent, t, uiLang,
}) {
  return (
    <div className="desktop-topbar" style={{ background: c.surface, borderBottom: `1px solid ${c.border}`, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, position: "sticky", top: 0, zIndex: 80 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <h2 className="outfit" style={{ fontSize: 18, fontWeight: 800, margin: 0, color: c.text, display: "flex", alignItems: "center" }}>
          {(() => {
            let icon, text;
            switch (currentTab) {
              case "adspy": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#fireGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(239,68,68,0.3))" }}><defs><linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ef4444"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient></defs><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>; text = PAGE_TITLES.adspy[uiLang]; break;
              case "productfinder": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#boxGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(139,92,246,0.3))" }}><defs><linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>; text = PAGE_TITLES.productfinder[uiLang]; break;
              case "shopanalyzer": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#bagGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(16,185,129,0.3))" }}><defs><linearGradient id="bagGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient></defs><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>; text = PAGE_TITLES.shopanalyzer[uiLang]; break;
              case "acquisition": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#searchGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(244,63,94,0.3))" }}><defs><linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f43f5e"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient></defs><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>; text = PAGE_TITLES.acquisition[uiLang]; break;
              case "vetting": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#botGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(6,182,212,0.3))" }}><defs><linearGradient id="botGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#06b6d4"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient></defs><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>; text = PAGE_TITLES.vetting[uiLang]; break;
              case "talentagency": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#briefGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(192,132,252,0.3))" }}><defs><linearGradient id="briefGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#c084fc"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>; text = PAGE_TITLES.talentagency[uiLang]; break;
              case "resources": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#bookHGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(16,185,129,0.3))" }}><defs><linearGradient id="bookHGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#047857"/></linearGradient></defs><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>; text = PAGE_TITLES.resources[uiLang]; break;
              case "brandportal": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#buildGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(245,158,11,0.3))" }}><defs><linearGradient id="buildGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M6 12H4a2 2 0 0 0-2 2v8"/><path d="M18 12h2a2 2 0 0 1 2 2v8"/><path d="M10 6h.01M14 6h.01M10 10h.01M14 10h.01M10 14h.01M14 14h.01M10 18h.01M14 18h.01"/></svg>; text = PAGE_TITLES.brandportal[uiLang]; break;
              case "contractgenerator": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#docGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(99,102,241,0.3))" }}><defs><linearGradient id="docGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>; text = PAGE_TITLES.contractgenerator[uiLang]; break;
              case "videomarketplace": icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#vidGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(236,72,153,0.3))" }}><defs><linearGradient id="vidGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ec4899"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient></defs><rect x="4" y="2" width="16" height="20" rx="3"/><polygon points="10 9 15 12 10 15 10 9" fill="url(#vidGrad)" stroke="none"/></svg>; text = PAGE_TITLES.videomarketplace[uiLang]; break;
              default: icon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#handshakeGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 10, filter: "drop-shadow(0px 2px 4px rgba(250,204,21,0.3))" }}><defs><linearGradient id="handshakeGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#facc15"/><stop offset="100%" stopColor="#f97316"/></linearGradient></defs><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3-6 6"/><path d="m21 14-6 6"/><path d="M9 19 6 22a2 2 0 1 1-3-3l6-6a2 2 0 0 1 3 3"/><path d="m15 15-3 3"/></svg>; text = PAGE_TITLES.default[uiLang]; break;
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
        {resultsCount > 0 && <div className="desktop-only"><Badge color={c.success} bg={c.successSoft}>Σ {statsTotal}</Badge></div>}
        {emailsSent > 0 && <div className="desktop-only"><Badge color={c.emailBlue} bg={c.emailBlueSoft}>{t.sentCount(emailsSent)}</Badge></div>}

      </div>
    </div>
  );
}
