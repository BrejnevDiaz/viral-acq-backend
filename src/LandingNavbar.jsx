export default function LandingNavbar({ uiLang, setUiLang, setAuthMode, setShowLoginModal }) {
  return (
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
              <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>Acquisition Pro</span>
            </div>
            <div className="nav-menu-desktop" style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 500, color: '#A1A1AA' }}>
              <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', color: '#fff' }}>{uiLang === 'fr' ? 'Espionner mes Concurrents' : 'Spy on Competitors'}</span>
              <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">{uiLang === 'fr' ? 'Recruter des Créateurs' : 'Recruit Top Talent'}</span>
              <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">{uiLang === 'fr' ? 'Espace Créateurs' : 'Creators Hub'}</span>
              <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Sourcing & CRM</span>
            </div>
            <div className="nav-menu-desktop" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <select value={uiLang} onChange={(e) => setUiLang(e.target.value)} style={{ background: 'transparent', color: '#A1A1AA', border: 'none', fontSize: 14, cursor: 'pointer', outline: 'none' }}>
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
                {uiLang === 'fr' ? 'Connexion' : 'Login'}
              </button>
            </div>
          </nav>
  );
}
