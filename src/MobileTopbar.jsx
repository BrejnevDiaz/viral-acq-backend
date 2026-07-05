import { TABS } from "./tabsConfig";

// ─── Mobile Header Navigation Bar (<769px) ───────────────────────────────────
// The hamburger button opens Sidebar.jsx as a full slide-in drawer (see its
// `mobile-drawer-open` class in DashboardLayout.jsx) — same nav, profile,
// language, theme and logout as desktop, just presented as an overlay.
export default function MobileTopbar({
  c, mono, currentTab, mobileMenuOpen, setMobileMenuOpen, uiLang,
}) {
  const activeTab = TABS.find(tab => tab.id === currentTab) || TABS.find(tab => tab.id === "resources");
  const ActiveIcon = activeTab.Icon;

  return (
    <div className="mobile-nav-bar" style={{
      background: c.surface, borderBottom: `1px solid ${c.border}`, padding: "12px 16px",
      display: "none", alignItems: "center", justifyContent: "space-between", zIndex: 95
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: mono }}>AP</div>
        <h1 className="outfit" style={{ fontSize: 15, fontWeight: 800, margin: 0, letterSpacing: "-0.5px", color: c.text }}>
          ACQUISITION<span style={{ color: c.accent }}> PRO</span>
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: c.textMuted, fontFamily: mono }}>
          <ActiveIcon color={c.accent} />
          {activeTab.shortLabel[uiLang]}
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 10,
            border: `1px solid rgba(255,255,255,0.08)`, background: "rgba(0,0,0,0.3)", color: c.text,
            cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
        </button>
      </div>
    </div>
  );
}
