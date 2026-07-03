const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Fix Header Texts
app = app.replace(
    `                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', color: '#fff' }}>Adspy</span>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Produit gagnant</span>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Sourcing CRM</span>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Matchmaking</span>`,
    `                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', color: '#fff' }}>Veille Concurrentielle</span>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Trouver vos talents</span>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Trouver une collab</span>
                <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Sourcing & CRM</span>`
);

// 2. Fix Language Button
app = app.replace(
    `<span style={{ fontSize: 14, color: '#A1A1AA', cursor: 'pointer' }}>French ▾</span>`,
    `<select style={{ background: 'transparent', color: '#A1A1AA', border: 'none', fontSize: 14, cursor: 'pointer', outline: 'none' }}>
                  <option value="fr" style={{ color: '#000' }}>French</option>
                  <option value="en" style={{ color: '#000' }}>English</option>
                </select>`
);

// 3. Add Images to Dashboard Mockup
// The dashboard has empty black boxes:
// Box 1 (Active, 1.2M)
app = app.replace(
    `<div style={{ height: '100%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>`,
    `<div style={{ height: '100%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                             <img src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=300&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />`
);

// Box 2 (450K)
app = app.replace(
    `<div style={{ height: '100%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>`,
    `<div style={{ height: '100%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                             <img src="https://images.unsplash.com/photo-1512413917887-8463c6591873?auto=format&fit=crop&w=300&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />`
);

// Box 3 (890K)
app = app.replace(
    `<div style={{ height: '100%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>`,
    `<div style={{ height: '100%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                             <img src="https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?auto=format&fit=crop&w=300&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />`
);

// Box 5 (320K)
app = app.replace(
    `<div style={{ width: '22%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>`,
    `<div style={{ width: '22%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                             <img src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=300&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />`
);

// Box 6 is already an image in the code:
// <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30...

// 4. Update nomenclature
// "Ce que les experts disent de Acquisition Pro" -> "Ce que les experts disent de Viral Acquisition"
app = app.replace(
    `Ce que les experts disent de <span style={{ color: '#8B5CF6' }}>Acquisition Pro</span>`,
    `Ce que les experts disent de <span style={{ color: '#8B5CF6' }}>Viral Acquisition</span>`
);
app = app.replace(
    `Acquisition Pro par Brejnev Diaz`,
    `Viral Acquisition par Brejnev Diaz`
);
// Replace other instances of "Acquisition Pro" with "Acquisition Pro by Viral Acquisition" if appropriate, 
// or just ensure the brand is clear. The user said: "Retiens le et souvient en Acquisition Pro by Viral Acquisition, Viral Acquisition by Brejnev DIaz"
// I will add a text in the footer.
app = app.replace(
    `<div style={{ fontSize: 14, color: '#A1A1AA' }}>© 2024 Acquisition Pro. Tous droits réservés.</div>`,
    `<div style={{ fontSize: 14, color: '#A1A1AA' }}>© 2026 Acquisition Pro by Viral Acquisition. Un projet de Brejnev Diaz. Tous droits réservés.</div>`
);

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Fixed texts, language button, and added images!');
