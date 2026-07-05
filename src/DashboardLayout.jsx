import Sidebar from "./Sidebar";
import MobileTopbar from "./MobileTopbar";
import DesktopTopbar from "./DesktopTopbar";

const sans = "'DM Sans','Segoe UI',system-ui,sans-serif";

// ─── Dashboard layout: Sidebar + Mobile/Desktop topbars + content slot ───────
// The tab router stays in App.jsx and is passed in already evaluated as `children`.
export default function DashboardLayout({
  c, mono, currentTab, handleTabChange,
  researchMenuOpen, setResearchMenuOpen,
  userTier, setShowUpgradeModal,
  profileMenuOpen, setProfileMenuOpen,
  userId, uiLang, setUiLang, theme, setTheme,
  mobileMenuOpen, setMobileMenuOpen,
  userRole, backendOk, resultsCount, statsTotal, emailsSent, t,
  children,
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: c.bg, color: c.text, fontFamily: sans, transition: "background 0.3s, color 0.3s" }}>
      {/* ── Left Sidebar (Minea-inspired) ─────────────────────────────────── */}
      <Sidebar
        c={c} mono={mono} currentTab={currentTab} handleTabChange={handleTabChange}
        researchMenuOpen={researchMenuOpen} setResearchMenuOpen={setResearchMenuOpen}
        userTier={userTier} setShowUpgradeModal={setShowUpgradeModal}
        profileMenuOpen={profileMenuOpen} setProfileMenuOpen={setProfileMenuOpen}
        userId={userId} uiLang={uiLang} setUiLang={setUiLang} theme={theme} setTheme={setTheme}
        mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* ── Main Content Area ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Mobile Header Navigation Bar */}
        <MobileTopbar
          c={c} mono={mono} currentTab={currentTab} handleTabChange={handleTabChange}
          mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} uiLang={uiLang}
        />

        {/* Desktop Top Header */}
        <DesktopTopbar
          c={c} mono={mono} currentTab={currentTab} userRole={userRole} backendOk={backendOk}
          resultsCount={resultsCount} statsTotal={statsTotal} emailsSent={emailsSent} t={t} uiLang={uiLang}
        />

        {/* Main page content body */}
        <div className="main-content" style={{ padding: 24, width: "100%", boxSizing: "border-box", flexGrow: 1 }}>
          {children}
        </div>
      </div>

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
          .sidebar-container.mobile-drawer-open {
            display: flex !important; position: fixed !important; top: 0; left: 0;
            width: 82vw !important; max-width: 300px; height: 100dvh !important;
            z-index: 300; box-shadow: 20px 0 60px rgba(0,0,0,0.6);
            animation: sidebarSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .sidebar-mobile-backdrop { display: block !important; }
          .mobile-nav-bar { display: flex !important; }
          .main-content { padding: 16px !important; }
        }
        @media (min-width: 769px) {
          .sidebar-container { display: flex !important; }
          .mobile-nav-bar { display: none !important; }
          .sidebar-mobile-backdrop { display: none !important; }
        }
        .sidebar-mobile-backdrop { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 299; animation: fadeIn 0.2s ease-out; }
        @keyframes sidebarSlideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
              .hover-bg-light:hover { background: rgba(255,255,255,0.05) !important; }
      `}</style>
    </div>
  );
}
