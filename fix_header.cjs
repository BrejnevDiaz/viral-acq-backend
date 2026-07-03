const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `              <div className="nav-menu-desktop" style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 500, color: '#A1A1AA' }}>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', color: '#fff' }}>Adspy</span>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Produit gagnant</span>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Sourcing CRM</span>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Matchmaking</span>
              </div>`;

const replaceStr = `              <div className="nav-menu-desktop" style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 500, color: '#A1A1AA' }}>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', color: '#fff' }}>Veille Concurrentielle</span>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Trouvez vos talents</span>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Trouver une collab</span>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Sourcing & CRM</span>
              </div>`;

if (app.includes(targetStr)) {
    app = app.replace(targetStr, replaceStr);
    fs.writeFileSync('src/App.jsx', app, 'utf8');
    console.log('Successfully replaced header text!');
} else {
    console.log('Could not find header text target string. Did you copy it perfectly?');
}
