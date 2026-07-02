const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Update Navbar Links to act as anchors and style them
const oldNavLinks = `<div style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 500, color: '#A1A1AA' }}>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', color: '#fff' }}>Adspy</span>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Produit gagnant</span>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Sourcing CRM</span>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Matchmaking</span>
              </div>`;

const newNavLinks = `<div style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 500, color: '#A1A1AA' }}>
                <a href="#adspy" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }} className="hover-white">Adspy</a>
                <a href="#produit-gagnant" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }} className="hover-white">Produit gagnant</a>
                <a href="#sourcing-crm" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }} className="hover-white">Sourcing CRM</a>
                <a href="#matchmaking" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }} className="hover-white">Matchmaking</a>
              </div>`;

app = app.replace(oldNavLinks, newNavLinks);

// 2. Add IDs to existing sections:
// Matchmaking Section: L'Agence de l'Influence Marketing
let matchmakingStart = app.indexOf('          <section style={{ maxWidth: 1100, margin: \'0 auto\', padding: \'120px 24px\', display: \'flex\'');
if (matchmakingStart !== -1) {
    app = app.substring(0, matchmakingStart) + 
          '          {/* MATCHMAKING & SOURCING SECTIONS */}\n          <section id="matchmaking" style={{ maxWidth: 1100, margin: \'0 auto\', padding: \'120px 24px\', display: \'flex\'' +
          app.substring(matchmakingStart + 104);
}

// CRM Section: Pilotez vos campagnes
let crmStart = app.indexOf('{/* Feature 2 (Reversed) */}');
if (crmStart !== -1) {
    app = app.substring(0, crmStart) + '{/* Feature 2 (Reversed) */}\n            <div id="sourcing-crm" style={{ paddingTop: 80 }}></div>\n' + app.substring(crmStart + 29);
}

// 3. Inject new ADSPY / PRODUIT GAGNANT section right after the Hero Mockup and before Matchmaking
const adspySection = `

          {/* ADSPY & PRODUIT GAGNANT */}
          <section id="adspy" style={{ maxWidth: 1100, margin: '120px auto 0 auto', padding: '0 24px', textAlign: 'center', position: 'relative' }}>
            <div id="produit-gagnant" style={{ position: 'absolute', top: -100 }}></div>
            <h2 style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px' }}>Trouve ton prochain <span style={{ color: '#8B5CF6' }}>produit gagnant</span> en 3 clics</h2>
            <p style={{ fontSize: 18, color: '#A1A1AA', maxWidth: 700, margin: '0 auto 48px auto', lineHeight: 1.6 }}>Accède à 80M+ d'annonces et d'influenceurs. Analyse les tendances, observe tes concurrents et lance des campagnes qui convertissent vraiment.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 80 }}>
                <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 30px rgba(139,92,246,0.3)' }}>Essayer gratuitement</button>
            </div>
            
            {/* The Social Proof avatars under Adspy (Yomi & Austin style) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap', marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', maxWidth: 350 }}>
                   <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
                   <div>
                      <p style={{ fontSize: 13, color: '#A1A1AA', margin: '0 0 8px 0', lineHeight: 1.4 }}>"ViralAcquisition est mon outil préféré pour trouver des concurrents et de nouveaux produits viraux."</p>
                      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>Austin, <span style={{ color: '#8B5CF6' }}>+180k abonnés</span></div>
                   </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', maxWidth: 350 }}>
                   <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
                   <div>
                      <p style={{ fontSize: 13, color: '#A1A1AA', margin: '0 0 8px 0', lineHeight: 1.4 }}>"J'utilise ViralAcq depuis des années. En 3 clics, je trouve des produits à fort potentiel pour ma marque."</p>
                      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>Yomi Denzel, <span style={{ color: '#8B5CF6' }}>+1,4M abonnés</span></div>
                   </div>
                </div>
            </div>
          </section>

`;

let heroEnd = app.indexOf('          {/* MATCHMAKING & SOURCING SECTIONS */}');
if (heroEnd !== -1) {
    app = app.substring(0, heroEnd) + adspySection + app.substring(heroEnd);
}

// Add smooth scrolling to the HTML container/body
if (!app.includes('html { scroll-behavior: smooth; }')) {
    let styleIndex = app.indexOf('<style>{`');
    if (styleIndex !== -1) {
        app = app.substring(0, styleIndex + 9) + '\n        html { scroll-behavior: smooth; }' + app.substring(styleIndex + 9);
    }
}

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Successfully updated navigation and added Adspy & Produit Gagnant sections!');
