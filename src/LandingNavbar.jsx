import { useState } from "react";
import { Link } from "react-router-dom";
import { L } from "./landingTheme";

const LANGUAGES = [
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "it", flag: "🇮🇹", label: "Italiano" },
];

export default function LandingNavbar({ uiLang, setUiLang, setAuthMode, setShowLoginModal, openAuthWithIntent }) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeLang = LANGUAGES.find(l => l.code === uiLang) || LANGUAGES[0];
  // Falls back to a plain signup opener if a page forgets to pass
  // openAuthWithIntent, instead of throwing when a nav item is clicked.
  const openAuth = openAuthWithIntent || (() => { setAuthMode('signup'); setShowLoginModal(true); });
  const closeAndOpenAuth = (tabId) => { setMobileMenuOpen(false); openAuth(tabId); };

  const navItems = [
    { id: 'adspy', label: uiLang === 'fr' ? 'Espionner mes Concurrents' : uiLang === 'it' ? 'Spia i Concorrenti' : 'Spy on Competitors' },
    { id: 'matchmaking', label: uiLang === 'fr' ? 'Créateurs Haute Conversion' : uiLang === 'it' ? 'Creator ad Alta Conversione' : 'High-Conversion Creators' },
    { id: 'talentagency', label: uiLang === 'fr' ? 'Espace Créateurs' : uiLang === 'it' ? 'Area Creatori' : 'Creators Hub' },
    { id: 'acquisition', label: 'Sourcing & CRM' },
  ];

  return (
        <>
          <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, height: 72,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 48px', zIndex: 100,
            background: L.navBg, backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${L.border}`
          }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'inherit', textDecoration: 'none' }}>
              <div style={{
                background: 'linear-gradient(135deg, #8B5CF6, #8B5CF6)',
                width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: 16, boxShadow: '0 0 20px rgba(139,92,246,0.4)'
              }}>AP</div>
              <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', color: L.text }}>Acquisition Pro</span>
            </Link>
            <div className="nav-menu-desktop" style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 500, color: L.textMuted }}>
              <span onClick={() => openAuth('adspy')} style={{ cursor: 'pointer', color: L.text, fontWeight: 700 }}>{uiLang === 'fr' ? 'Espionner mes Concurrents' : uiLang === 'it' ? 'Spia i Concorrenti' : 'Spy on Competitors'}</span>
              <span onClick={() => openAuth('matchmaking')} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-dark">{uiLang === 'fr' ? 'Créateurs Haute Conversion' : uiLang === 'it' ? 'Creator ad Alta Conversione' : 'High-Conversion Creators'}</span>
              <span onClick={() => openAuth('talentagency')} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-dark">{uiLang === 'fr' ? 'Espace Créateurs' : uiLang === 'it' ? 'Area Creatori' : 'Creators Hub'}</span>
              <span onClick={() => openAuth('acquisition')} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-dark">Sourcing & CRM</span>
            </div>
            <div className="nav-menu-desktop" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setLangMenuOpen(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(24,24,27,0.85)',
                    backdropFilter: 'blur(12px)', color: '#D4D4D8',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  className="hover-bg-dark-5"
                >
                  <span style={{ fontSize: 16 }}>{activeLang.flag}</span>
                  {activeLang.code.toUpperCase()}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: langMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><path d="m6 9 6 6 6-6"/></svg>
                </button>

                {langMenuOpen && (
                  <>
                    <div onClick={() => setLangMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 170, zIndex: 99,
                      background: L.surface, border: `1px solid ${L.border}`, borderRadius: 14,
                      boxShadow: '0 20px 45px rgba(0,0,0,0.12)', padding: 6, overflow: 'hidden'
                    }}>
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => { setUiLang(lang.code); setLangMenuOpen(false); }}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                            borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: 600,
                            background: lang.code === uiLang ? 'rgba(139,92,246,0.1)' : 'transparent',
                            color: lang.code === uiLang ? '#7C3AED' : L.text, transition: 'background 0.15s'
                          }}
                          className="hover-bg-dark-5"
                        >
                          <span style={{ fontSize: 18 }}>{lang.flag}</span>
                          {lang.label}
                          {lang.code === uiLang && <span style={{ marginLeft: 'auto', fontSize: 13 }}>✓</span>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => { setAuthMode('login'); setShowLoginModal(true); }}
                style={{
                  background: L.surface, border: `1px solid ${L.borderStrong}`,
                  color: L.text, padding: '8px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
                className="hover-bg-dark-5"
              >
                {uiLang === 'fr' ? 'Connexion' : uiLang === 'it' ? 'Accedi' : 'Login'}
              </button>
            </div>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menu"
              style={{
                alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10,
                border: `1px solid ${L.borderStrong}`, background: L.surface, color: L.text, cursor: 'pointer'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </nav>

          {mobileMenuOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: L.bg, display: 'flex', flexDirection: 'column' }}>
              <div style={{
                height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 24px', borderBottom: `1px solid ${L.border}`, flexShrink: 0
              }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: L.text }}>Acquisition Pro</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${L.borderStrong}`, background: L.surface, color: L.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {navItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => closeAndOpenAuth(item.id)}
                    style={{ padding: '18px 8px', fontSize: 17, fontWeight: 700, color: L.text, borderBottom: `1px solid ${L.border}`, cursor: 'pointer' }}
                  >
                    {item.label}
                  </div>
                ))}

                <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setUiLang(lang.code)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10,
                        border: `1px solid ${lang.code === uiLang ? '#8B5CF6' : L.borderStrong}`,
                        background: lang.code === uiLang ? 'rgba(139,92,246,0.1)' : L.surface,
                        color: lang.code === uiLang ? '#7C3AED' : L.text, fontSize: 14, fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      <span>{lang.flag}</span>{lang.code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ padding: 24, borderTop: `1px solid ${L.border}`, flexShrink: 0 }}>
                <button
                  onClick={() => { setMobileMenuOpen(false); setAuthMode('login'); setShowLoginModal(true); }}
                  style={{
                    width: '100%', background: L.surface, border: `1px solid ${L.borderStrong}`,
                    color: L.text, padding: '14px 24px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  {uiLang === 'fr' ? 'Connexion' : uiLang === 'it' ? 'Accedi' : 'Login'}
                </button>
              </div>
            </div>
          )}
        </>
  );
}
