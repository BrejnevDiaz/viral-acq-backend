const fs = require('fs');

let code = fs.readFileSync('src/TalentAgencyTab.jsx', 'utf8');

const oldStr = `            {/* Roster talents grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {talents.filter(t => t.status === "active" || currentUserRole === "admin").map((talent, idx) => {`;

const newStr = `            {/* Roster talents grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {currentUserRole === "influencer" ? (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", color: c.textMuted, background: c.card, borderRadius: 14, border: \`1px dashed \${c.border}\` }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: c.text, marginBottom: 6 }}>Accès Restreint (Sécurité Agent)</div>
                  <div style={{ fontSize: 13, color: c.textDim }}>Pour des raisons de confidentialité, vous ne pouvez pas consulter le profil des autres talents de l'agence.</div>
                </div>
              ) : talents.filter(t => t.status === "active" || currentUserRole === "admin").map((talent, idx) => {`;

code = code.replace(oldStr, newStr);

fs.writeFileSync('src/TalentAgencyTab.jsx', code);
console.log("Roster hidden for influencers.");
