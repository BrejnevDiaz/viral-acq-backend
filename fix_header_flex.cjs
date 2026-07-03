const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Header texts
app = app.replace(
    /Adspy<\/span>/g,
    "Veille Concurrentielle</span>"
);
app = app.replace(
    /Produit gagnant<\/span>/g,
    "Trouver vos talents</span>"
);
app = app.replace(
    /Sourcing CRM<\/span>/g,
    "Trouver une collab</span>"
);
app = app.replace(
    /Matchmaking<\/span>/g,
    "Sourcing & CRM</span>"
);

// 2. Language Button
// Need to find exactly the one in the top header: <span style={{ fontSize: 14, color: '#A1A1AA', cursor: 'pointer' }}>French ▾</span>
app = app.replace(
    /<span style={{ fontSize: 14, color: '#A1A1AA', cursor: 'pointer' }}>French ▾<\/span>/g,
    `<select style={{ background: 'transparent', color: '#A1A1AA', border: 'none', fontSize: 14, cursor: 'pointer', outline: 'none' }}>
                  <option value="fr" style={{ color: '#000' }}>French</option>
                  <option value="en" style={{ color: '#000' }}>English</option>
                </select>`
);
// Or maybe it is French ▾ but wait, in the powershell output it showed "French -" (unicode issue).
// I will just regex for >French.*</span>
app = app.replace(
    />French.*?<\/span>/g,
    `><select style={{ background: 'transparent', color: '#A1A1AA', border: 'none', fontSize: 14, cursor: 'pointer', outline: 'none' }}>
                  <option value="fr" style={{ color: '#000' }}>French</option>
                  <option value="en" style={{ color: '#000' }}>English</option>
                </select></span>`
);

// 3. Images in the black boxes
// The black boxes look like: <div style={{ height: '100%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
// And one of them has width: '22%'
app = app.replace(
    `<div style={{ height: '100%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>`,
    `<div style={{ height: '100%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                             <img src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=300&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />`
);
app = app.replace(
    `<div style={{ height: '100%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>`,
    `<div style={{ height: '100%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                             <img src="https://images.unsplash.com/photo-1512413917887-8463c6591873?auto=format&fit=crop&w=300&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />`
);
app = app.replace(
    `<div style={{ height: '100%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>`,
    `<div style={{ height: '100%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                             <img src="https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?auto=format&fit=crop&w=300&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />`
);
app = app.replace(
    `<div style={{ width: '22%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>`,
    `<div style={{ width: '22%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                             <img src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=300&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />`
);

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Flexibly replaced texts and images!');
