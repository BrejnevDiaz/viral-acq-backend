import { TABS } from "./tabsConfig";

// ─── Mobile Header Navigation Bar (<769px) ───────────────────────────────────
export default function MobileTopbar({
  c, mono, currentTab, handleTabChange,
  mobileMenuOpen, setMobileMenuOpen,
}) {
  const activeTab = TABS.find(tab => tab.id === currentTab) || TABS.find(tab => tab.id === "resources");
  const ActiveIcon = activeTab.Icon;
  const researchTabs = TABS.filter(tab => tab.group === "research");
  const toolTabs = TABS.filter(tab => tab.group === "tools");

  const renderItem = (item) => (
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
        <item.Icon color={currentTab === item.id ? c.accent : c.textDim} />
      </div>
      {item.label}
    </button>
  );

  return (
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
            <ActiveIcon color={c.accent} />
          </div>
          <span>{activeTab.shortLabel}</span>
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
                {researchTabs.map(renderItem)}

                <div style={{ height: 1, background: c.border, margin: "4px 14px" }} />
                <div style={{ fontSize: 11, color: c.textMuted, textTransform: "uppercase", letterSpacing: 1, padding: "4px 14px" }}>Tools</div>
                {toolTabs.map(renderItem)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
