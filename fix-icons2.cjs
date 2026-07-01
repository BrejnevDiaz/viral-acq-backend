const fs = require('fs');

// VettingTab
let vettingCode = fs.readFileSync('src/VettingTab.jsx', 'utf8');

// Fix Historique
const histIcon = `<div style={{ width: 28, height: 28, borderRadius: 8, background: \`linear-gradient(135deg, #8b5cf6, #6d28d9)\`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 4px 12px rgba(139,92,246,0.3)" }}>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
</div>`;

vettingCode = vettingCode.replace(/<h3 style=\{\{ margin: "0 0 16px 0", fontSize: 15, fontFamily: mono, color: c\.text \}\}>.*Historique \(\{history\.length\}\)<\/h3>/g, 
  `<h3 style={{ margin: "0 0 16px 0", fontSize: 16, fontFamily: mono, color: c.text, display: "flex", alignItems: "center", gap: 10 }}>{${histIcon}} Historique ({history.length})</h3>`);

fs.writeFileSync('src/VettingTab.jsx', vettingCode);

// MatchmakingTab
let matchCode = fs.readFileSync('src/MatchmakingTab.jsx', 'utf8');

// Fix Matchmaking & Collab Title
const collabIcon = `<div style={{ width: 36, height: 36, borderRadius: 10, background: \`linear-gradient(135deg, \${c.accent}, #ec4899)\`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: \`0 4px 12px \${c.accentGlow}\` }}>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
</div>`;

matchCode = matchCode.replace(/<h2 style=\{\{ fontSize: 22, color: c\.text, margin: "0 0 8px 0" \}\}>.*Matchmaking & Collaborations<\/h2>/g,
  `<h2 style={{ fontSize: 24, fontWeight: 800, color: c.text, margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: 12 }}>{${collabIcon}} Matchmaking & Collaborations</h2>`);

// Just in case there are still emojis in Accords Marques or Influenceurs Signés, let's aggressively replace them
matchCode = matchCode.replace(/💼/g, "");
matchCode = matchCode.replace(/⭐/g, "");
matchCode = matchCode.replace(/🏆/g, "");
matchCode = matchCode.replace(/📄/g, "");

fs.writeFileSync('src/MatchmakingTab.jsx', matchCode);

console.log("Icons updated!");
