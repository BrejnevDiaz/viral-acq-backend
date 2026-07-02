const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// The language and theme controls:
const menuControls = `
              <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: c.textDim }}>Langue</span>
                <select
                  value={uiLang}
                  onChange={(e) => setUiLang(e.target.value)}
                  style={{
                    background: c.bg, color: c.text, border: \\\`1px solid \${c.border}\\\`, borderRadius: 6,
                    padding: "4px 8px", fontFamily: mono, fontSize: 11, fontWeight: 600, outline: "none", cursor: "pointer"
                  }}
                >
                  <option value="fr">🇫🇷 FR</option>
                  <option value="en">🇬🇧 EN</option>
                  <option value="it">🇮🇹 IT</option>
                </select>
              </div>

              <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: c.textDim }}>Thème</span>
                <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28,
                  borderRadius: 6, border: \\\`1px solid \${c.border}\\\`, background: c.card, color: c.textMuted,
                  cursor: "pointer", transition: "all 0.2s"
                }} title={theme === "dark" ? "Light mode" : "Dark mode"}>
                  {theme === "dark" ? 
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> 
                    : 
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                  }
                </button>
              </div>
`;

const insertIndex = c.indexOf("<div style={{ height: 1, background: c.border, margin: '4px 0' }} />");
if (insertIndex !== -1) {
  const newC = c.substring(0, insertIndex) + menuControls + "\n              " + c.substring(insertIndex);
  fs.writeFileSync('src/App.jsx', newC);
  console.log("Menu controls injected into sidebar!");
} else {
  console.log("Could not find insertion point for menu controls.");
}
