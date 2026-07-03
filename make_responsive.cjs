const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add mobile state to LandingPage component (inside App if it's all one component)
// Actually we can just do pure CSS for the menu (display:none on mobile)

// 2. Make Header responsive
app = app.replace(
    "<div style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 500, color: '#A1A1AA' }}>",
    "<div className=\"nav-menu-desktop\" style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 500, color: '#A1A1AA' }}>"
);
app = app.replace(
    "<div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>",
    "<div className=\"nav-menu-desktop\" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>"
);

// 3. Add Hamburger Menu Button
app = app.replace(
    "<div style={{ fontWeight: 900, fontSize: 22, color: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>",
    "<div style={{ fontWeight: 900, fontSize: 22, color: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>"
);

// We need to inject the hamburger button inside the header, right after the logo but only visible on mobile.
const headerStart = `<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 40px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
              <div style={{ fontWeight: 900, fontSize: 22, color: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>`;

const newHeaderStart = `<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
              <div style={{ fontWeight: 900, fontSize: 22, color: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>`;
app = app.replace(headerStart, newHeaderStart);

// Inject hamburger right before the end of the header
const headerEnd = `            </header>`;
const hamburgerBtn = `              <div className="mobile-menu-btn" onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ color: '#fff', cursor: 'pointer' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </div>\n            </header>`;
app = app.replace(headerEnd, hamburgerBtn);

// 4. Hero Section text sizes
app = app.replace(
    "<h1 style={{ fontSize: 72, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 24, letterSpacing: '-2px' }}>",
    "<h1 className=\"text-mobile-h1\" style={{ fontSize: 72, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 24, letterSpacing: '-2px' }}>"
);

app = app.replace(
    "<h2 style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px' }}>Trouve ton prochain",
    "<h2 className=\"text-mobile-h2\" style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px' }}>Trouvez vos prochains"
);

app = app.replace(
    "<span style={{ color: '#8B5CF6' }}>produit gagnant</span> en 3 clics</h2>",
    "<span style={{ color: '#8B5CF6' }}>talents UGC</span> en 3 clics</h2>"
);

app = app.replace(
    "<h2 style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 60, letterSpacing: '-1px' }}>Ce que les experts disent de",
    "<h2 className=\"text-mobile-h2\" style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 60, letterSpacing: '-1px' }}>Ce que les experts disent de"
);

// 5. Grids to 1 column on mobile
app = app.replace(
    "<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>",
    "<div className=\"grid-1-mobile\" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>"
);

app = app.replace(
    "<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>",
    "<div className=\"grid-1-mobile\" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>"
);

app = app.replace(
    "<div style={{ display: 'flex', gap: 64, alignItems: 'center' }}>",
    "<div className=\"flex-col-mobile\" style={{ display: 'flex', gap: 64, alignItems: 'center' }}>"
);

// 6. Padding adjustments for sections
app = app.replace(
    "<section style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>",
    "<section className=\"p-mobile-sm\" style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>"
);

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Mobile responsive classes injected');
