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
  const activeLang = LANGUAGES.find(l => l.code === uiLang) || LANGUAGES[0];
  // Falls back to a plain signup opener if a page forgets to pass
  // openAuthWithIntent, instead of throwing when a nav item is clicked.
  const openAuth = openAuthWithIntent || (() => { setAuthMode('signup'); setShowLoginModal(true); });

  return (
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
                    border: `1px solid ${L.borderStrong}`, background: L.surface, color: L.text,
                    fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  className="hover-bg-dark-5"
                >
                  <span style={{ fontSize: 16 }}>{activeLang.flag}</span>
                  {activeLang.code.toUpperCase()}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={L.textMuted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: langMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><path d="m6 9 6 6 6-6"/></svg>
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
          </nav>
  );
}
