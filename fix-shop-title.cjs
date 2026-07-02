const fs = require('fs');

let code = fs.readFileSync('src/ShopAnalyzerTab.jsx', 'utf8');

// 1. Remove the emojis from the translations
code = code.replace(/title: ".*? Boutiques Tendances \(Shop Analyzer\)"/g, 'title: "Boutiques Tendances (Shop Analyzer)"');
code = code.replace(/title: ".*? Shop Analyzer & Trending Stores"/g, 'title: "Shop Analyzer & Trending Stores"');
code = code.replace(/title: ".*? Analisi Store Vincenti \(Shop Analyzer\)"/g, 'title: "Analisi Store Vincenti (Shop Analyzer)"');

// 2. Add the premium SVG icon to the title
const premiumIcon = `
        <h2 style={{ fontSize: 24, fontWeight: 800, color: c.text, margin: "0 0 8px 0", letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: \`linear-gradient(135deg, \${c.accent}, #ec4899)\`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: \`0 4px 12px \${c.accent}40\` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          {t.title}
        </h2>
`.trim();

code = code.replace(
  /<h2 style={{ fontSize: 24, fontWeight: 800, color: c\.text, margin: "0 0 8px 0", letterSpacing: "-0\.5px" }}>\{t\.title\}<\/h2>/g,
  premiumIcon
);

fs.writeFileSync('src/ShopAnalyzerTab.jsx', code);
console.log("Title SVG injected.");
