const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Fix layout for Feature 3
app = app.replace(
    `<div style={{ display: 'flex', alignItems: 'center', gap: 80, justifyContent: 'space-between', \nmarginTop: 120, marginBottom: 80 }}>`,
    `<div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 80, justifyContent: 'space-between', marginTop: 120, marginBottom: 80 }}>`
);

// Fallback if the newlines are different
app = app.replace(
    `<div style={{ display: 'flex', alignItems: 'center', gap: 80, justifyContent: 'space-between', marginTop: 120, marginBottom: 80 }}>`,
    `<div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 80, justifyContent: 'space-between', marginTop: 120, marginBottom: 80 }}>`
);


// 2. Replace Yomi Denzel with Brejnev Diaz
app = app.replace(
    `Yomi Denzel, <span style={{ color: '#8B5CF6' }}>+1,4M abonnés</span>`,
    `Brejnev Diaz, <span style={{ color: '#8B5CF6' }}>Fondateur</span>`
);

// Change image to a UI avatar for Brejnev Diaz
app = app.replace(
    `src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }}`,
    `src="https://ui-avatars.com/api/?name=Brejnev+Diaz&background=8B5CF6&color=fff&size=150" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }}`
);

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Fixed Layout and Yomi Denzel');
