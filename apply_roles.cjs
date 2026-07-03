const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Premium Language Dropdown
// We need to add state `const [showLangMenu, setShowLangMenu] = useState(false);`
app = app.replace(
    /const \[uiLang, setUiLang\]\s*=\s*useState\("fr"\);/,
    `const [uiLang, setUiLang]             = useState("fr");\n  const [showLangMenu, setShowLangMenu] = useState(false);`
);

// Replace the <select> with a custom premium dropdown
const oldSelect = `<select value={uiLang} onChange={(e) => setUiLang(e.target.value)} style={{ background: 'transparent', color: '#A1A1AA', border: 'none', fontSize: 14, cursor: 'pointer', outline: 'none' }}>
                  <option value="fr" style={{ color: '#000' }}>French</option>
                  <option value="en" style={{ color: '#000' }}>English</option>
                </select>`;

const newPremiumDropdown = `<div style={{ position: 'relative' }}>
                <div onClick={() => setShowLangMenu(!showLangMenu)} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: '#fff', fontSize: 14, fontWeight: 600, background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s' }} className="hover-glow">
                  {uiLang === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showLangMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                {showLangMenu && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: '#18181B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, overflow: 'hidden', zIndex: 100, boxShadow: '0 10px 40px rgba(0,0,0,0.5)', minWidth: 120 }}>
                    <div onClick={() => { setUiLang('fr'); setShowLangMenu(false); }} style={{ padding: '10px 16px', fontSize: 14, color: uiLang === 'fr' ? '#fff' : '#A1A1AA', cursor: 'pointer', background: uiLang === 'fr' ? 'rgba(139,92,246,0.1)' : 'transparent', display: 'flex', alignItems: 'center', gap: 8 }} className="hover-bg-light">
                      🇫🇷 Français
                    </div>
                    <div onClick={() => { setUiLang('en'); setShowLangMenu(false); }} style={{ padding: '10px 16px', fontSize: 14, color: uiLang === 'en' ? '#fff' : '#A1A1AA', cursor: 'pointer', background: uiLang === 'en' ? 'rgba(139,92,246,0.1)' : 'transparent', display: 'flex', alignItems: 'center', gap: 8 }} className="hover-bg-light">
                      🇬🇧 English
                    </div>
                  </div>
                )}
              </div>`;

app = app.replace(oldSelect, newPremiumDropdown);


// 2. Free Trial Text in the Hero section and Navbar
app = app.replace(
    `>{uiLang === 'fr' ? 'Trouver votre talent' : 'Find Your Talent'}</button>`,
    `>{uiLang === 'fr' ? 'Essai Gratuit 14 Jours' : '14-Day Free Trial'}</button>`
);
// In Navbar
app = app.replace(
    `onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }}
                  style={{
                    background: 'linear-gradient(90deg, #8B5CF6, #F43F5E)',`,
    `onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }}
                  style={{
                    background: 'linear-gradient(90deg, #8B5CF6, #F43F5E)',` // this is just finding it
);
app = app.replace(
    `Démarrer
                </button>`,
    `{uiLang === 'fr' ? 'Essai Gratuit' : 'Free Trial'}
                </button>`
);

// 3. User Roles Logic
// Add `signupRole` state
app = app.replace(
    /const \[selectedSignupTier, setSelectedSignupTier\] = useState\("standard"\);/,
    `const [selectedSignupTier, setSelectedSignupTier] = useState("standard");\n  const [signupRole, setSignupRole] = useState("brand");`
);

// Add Role Selection to the Signup Modal
const authModalRegex = /(<div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'rgba\(0,0,0,0\.2\)', padding: 4, borderRadius: 8 }}>.*?<\/div>)/s;
const roleSelector = `
              {authMode === 'signup' && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, color: '#A1A1AA', marginBottom: 8, fontWeight: 600 }}>{uiLang === 'fr' ? 'Vous êtes :' : 'You are:'}</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div onClick={() => setSignupRole('brand')} style={{ flex: 1, padding: '12px 10px', borderRadius: 8, border: signupRole === 'brand' ? '1px solid #8B5CF6' : '1px solid rgba(255,255,255,0.1)', background: signupRole === 'brand' ? 'rgba(139,92,246,0.1)' : 'rgba(0,0,0,0.2)', color: signupRole === 'brand' ? '#fff' : '#A1A1AA', cursor: 'pointer', textAlign: 'center', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}>
                      🏢 {uiLang === 'fr' ? 'Marque / Agence' : 'Brand / Agency'}
                    </div>
                    <div onClick={() => setSignupRole('creator')} style={{ flex: 1, padding: '12px 10px', borderRadius: 8, border: signupRole === 'creator' ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.1)', background: signupRole === 'creator' ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.2)', color: signupRole === 'creator' ? '#fff' : '#A1A1AA', cursor: 'pointer', textAlign: 'center', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}>
                      🎥 {uiLang === 'fr' ? 'Créateur UGC' : 'UGC Creator'}
                    </div>
                  </div>
                </div>
              )}
`;
app = app.replace(authModalRegex, `$1${roleSelector}`);

// Set the userRole upon Mock Login
app = app.replace(
    /setIsLoggedIn\(true\);\n\s*setShowLoginModal\(false\);/,
    `setUserRole(authMode === 'signup' ? signupRole : 'brand');\n      if (authMode === 'signup' && signupRole === 'creator') {\n        setCurrentTab('talentagency');\n      }\n      setIsLoggedIn(true);\n      setShowLoginModal(false);`
);

// 4. Feature Gating in the Dashboard Content
const tabRoutingStart = `{currentTab === "adspy" ? (`;
const lockedScreen = `
        {userRole === 'creator' && currentTab !== 'talentagency' && currentTab !== 'resources' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#09090b', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', padding: 40 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>{uiLang === 'fr' ? 'Espace réservé aux Marques' : 'Brand Only Area'}</h2>
            <p style={{ color: '#A1A1AA', fontSize: 15, maxWidth: 400, lineHeight: 1.6, marginBottom: 32 }}>
              {uiLang === 'fr' 
                ? "En tant que Créateur UGC, cette section de recherche et d'espionnage ne vous est pas accessible. Votre espace de gestion des missions se trouve dans l'onglet Talents & Gigs."
                : "As a UGC Creator, this research and spy section is locked. Your mission management workspace is in the Talents & Gigs tab."}
            </p>
            <button onClick={() => setCurrentTab('talentagency')} style={{ background: '#10B981', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              {uiLang === 'fr' ? 'Aller à mes missions' : 'Go to my missions'}
            </button>
          </div>
        ) : currentTab === "adspy" ? (`

app = app.replace(tabRoutingStart, lockedScreen);

// Add some extra CSS class for hover effects
if (!app.includes('.hover-bg-light:hover')) {
  app = app.replace(
    `</style>`,
    `  .hover-bg-light:hover { background: rgba(255,255,255,0.05) !important; }\n</style>`
  );
}

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Applied premium language dropdown, free trial text, and user roles logic!');
