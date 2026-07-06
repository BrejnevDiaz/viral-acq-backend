import { supabase } from "./supabaseClient";
import { TABS } from "./tabsConfig";
import { useRole } from "./contexts/RoleContext";

// ─── Left Sidebar (Minea-inspired) ───────────────────────────────────────────
export default function Sidebar({
  c, mono, currentTab, handleTabChange,
  researchMenuOpen, setResearchMenuOpen,
  userTier, setShowUpgradeModal,
  profileMenuOpen, setProfileMenuOpen,
  userId, uiLang, setUiLang, theme, setTheme,
  mobileMenuOpen, setMobileMenuOpen,
}) {
  const { hasTabAccess } = useRole();
  const researchTabs = TABS.filter(tab => tab.group === "research");
  const toolTabs = TABS.filter(tab => tab.group === "tools");
  const lockedLabel = uiLang === "fr" ? "Réservé aux forfaits Plus, Pro & Elite" : uiLang === "it" ? "Riservato ai piani Plus, Pro e Elite" : "Reserved for Plus, Pro & Elite plans";

  // On mobile the nav doubles as a slide-in drawer; picking a tab should close it.
  const selectTab = (tabId) => { handleTabChange(tabId); setMobileMenuOpen?.(false); };

  return (
    <>
      {mobileMenuOpen && <div className="sidebar-mobile-backdrop" onClick={() => setMobileMenuOpen(false)} />}
      <div className={`sidebar-container${mobileMenuOpen ? " mobile-drawer-open" : ""}`} style={{
        width: 260, flexShrink: 0, borderRight: `1px solid ${c.border}`, display: "flex", flexDirection: "column",
        height: "100vh", position: "sticky", top: 0, padding: "24px 16px", zIndex: 90, boxSizing: "border-box",
        background: c.surface
      }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", fontFamily: mono, boxShadow: `0 4px 16px ${c.accentGlow}` }}>AP</div>
        <div style={{ flex: 1 }}>
          <h1 className="outfit" style={{ fontSize: 17, fontWeight: 800, margin: 0, letterSpacing: "-0.5px", color: c.text }}>
            ACQUISITION<span style={{ color: c.accent }}> PRO</span>
          </h1>
          <span style={{ fontSize: 10, color: c.accent2, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Suite</span>
        </div>
        <button onClick={() => setMobileMenuOpen(false)} className="show-mobile-flex" style={{ background: "none", border: "none", color: c.textMuted, fontSize: 20, cursor: "pointer", display: "none", padding: 4 }} aria-label="Close menu">✕</button>
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
            <span style={{ fontSize: 16 }}>🔍</span> {uiLang === "fr" ? "Recherche & Découverte" : uiLang === "it" ? "Ricerca & Scoperta" : "Research & Discovery"}
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
          {researchTabs.map(tab => {
            const locked = !hasTabAccess(tab.id);
            return (
              <button key={tab.id} onClick={() => selectTab(tab.id)} title={locked ? lockedLabel : undefined} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: "none",
                background: currentTab === tab.id ? `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)` : "transparent",
                color: currentTab === tab.id ? c.text : (locked ? c.textDim : c.textMuted), fontSize: 13, fontWeight: 700, fontFamily: mono, cursor: "pointer",
                textAlign: "left", transition: "all 0.2s", opacity: locked ? 0.6 : 1
              }}>
                <tab.Icon color={currentTab === tab.id ? c.accent : c.textDim} />
                <span style={{ flex: 1 }}>{tab.label[uiLang]}</span>
                {locked && <span style={{ fontSize: 12 }}>🔒</span>}
              </button>
            );
          })}
        </div>

        {toolTabs.map(tab => {
          const locked = !hasTabAccess(tab.id);
          return (
            <button key={tab.id} onClick={() => selectTab(tab.id)} title={locked ? lockedLabel : undefined} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: "none",
              background: currentTab === tab.id ? `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)` : "transparent",
              borderLeft: `3px solid ${currentTab === tab.id ? c.accent : "transparent"}`,
              color: currentTab === tab.id ? c.text : (locked ? c.textDim : c.textMuted), fontSize: 13.5, fontWeight: 700, fontFamily: mono, cursor: "pointer",
              textAlign: "left", transition: "all 0.2s", opacity: locked ? 0.6 : 1
            }}>
              <tab.Icon color={currentTab === tab.id ? c.accent : c.textDim} />
              <span style={{ flex: 1 }}>{tab.label[uiLang]}</span>
              {locked && <span style={{ fontSize: 12 }}>🔒</span>}
            </button>
          );
        })}
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
          {uiLang === "fr" ? "Améliorer" : uiLang === "it" ? "Migliora" : "Upgrade"}
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
              <div style={{ fontSize: 11, color: c.textMuted }}>{uiLang === "fr" ? "Compte" : uiLang === "it" ? "Account" : "Account"} {userTier}</div>
            </div>

            <button style={{ background: 'transparent', border: 'none', padding: '10px 16px', textAlign: 'left', fontSize: 13, color: c.text, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => { selectTab('account'); setProfileMenuOpen(false); }}>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>
              {uiLang === "fr" ? "Mon compte" : uiLang === "it" ? "Il mio account" : "My account"}
            </button>
            <button style={{ background: 'transparent', border: 'none', padding: '10px 16px', textAlign: 'left', fontSize: 13, color: c.text, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => { setShowUpgradeModal(true); setProfileMenuOpen(false); }}>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><rect width='18' height='14' x='3' y='5' rx='2' ry='2'/><line x1='3' x2='21' y1='10' y2='10'/></svg>
              {uiLang === "fr" ? "Abonnements" : uiLang === "it" ? "Abbonamenti" : "Subscriptions"}
            </button>
            <button style={{ background: 'transparent', border: 'none', padding: '10px 16px', textAlign: 'left', fontSize: 13, color: c.text, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => { window.dispatchEvent(new CustomEvent('va-open-chatbot')); setProfileMenuOpen(false); }}>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'/></svg>
              {uiLang === "fr" ? "Support" : uiLang === "it" ? "Supporto" : "Support"}
            </button>

            <div style={{ height: 1, background: c.border, margin: '4px 0' }} />

            <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: c.textDim }}>{uiLang === "fr" ? "Langue" : uiLang === "it" ? "Lingua" : "Language"}</span>
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
              <span style={{ fontSize: 13, color: c.textDim }}>{uiLang === "fr" ? "Thème" : uiLang === "it" ? "Tema" : "Theme"}</span>
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
              {uiLang === "fr" ? "Se déconnecter" : uiLang === "it" ? "Disconnetti" : "Log out"}
            </button>
          </div>
        )}
      </div>

      </div>
    </>
  );
}
