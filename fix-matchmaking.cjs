const fs = require('fs');
let code = fs.readFileSync('src/MatchmakingTab.jsx', 'utf8');

// 1. Initial State for Validated Matches
const newValidatedMatch = `const [validatedMatches, setValidatedMatches] = useState([
  {
    id: "match_mock_1",
    brand: { name: "Sephora", niche: "Beauté" },
    influencer: { username: "diariatou_sow", followers: "72K", engagement: "6.2%", profileUrl: "https://instagram.com/diariatou_sow" },
    pitch: "Bonjour ! Sephora souhaite vous proposer une collaboration exclusive pour notre nouvelle gamme de soins...",
    relationship: "warm",
    createdAt: new Date().toISOString()
  }
]);`;
code = code.replace("const [validatedMatches, setValidatedMatches] = useState([]);", newValidatedMatch);

// 2. Initial State for Contracts
const newContracts = `const [contracts, setContracts] = useState(() => {
    const saved = localStorage.getItem("matchmaking_contracts");
    if (saved) { try { return JSON.parse(saved); } catch(e) {} }
    return [
      {
        id: "CG_MOCK_23910",
        brandName: "Sephora",
        influencerHandle: "diariatou_sow",
        content: "CONTRAT DE PRESTATION DE SERVICES ET CESSION DE DROITS D'AUTEUR (UGC)\\n\\nRéf: CG_MOCK_23910\\n\\n...",
        status: "signed_both",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        brandEmail: "contact@sephora.fr",
        influencerEmail: "contact@diariatou.com",
        formData: { contractLanguage: "fr" }
      }
    ];
  });`;
code = code.replace(/const \[contracts, setContracts\] = useState\(\(\) => \{[^]*?\}\);/, newContracts);

// 3. Premium Icons for Titles
const brandIcon = `<div style={{ width: 28, height: 28, borderRadius: 8, background: \`linear-gradient(135deg, \${c.accent}, #ec4899)\`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: \`0 4px 12px \${c.accentGlow}\` }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>`;
code = code.replace("💼 Accords Marques", `{${brandIcon}} Accords Marques`);

const infIcon = `<div style={{ width: 28, height: 28, borderRadius: 8, background: \`linear-gradient(135deg, #eab308, #f59e0b)\`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 4px 12px rgba(234,179,8,0.3)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>`;
code = code.replace("⭐ Influenceurs Signés", `{${infIcon}} Influenceurs Signés`);

const valIcon = `<div style={{ width: 32, height: 32, borderRadius: 10, background: \`linear-gradient(135deg, #10b981, #059669)\`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          </div>`;
code = code.replace("🏆 Accords Validés & Signés", `{${valIcon}} Accords Validés & Signés`);

const docIcon = `<div style={{ width: 32, height: 32, borderRadius: 10, background: \`linear-gradient(135deg, #3b82f6, #2563eb)\`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>`;
code = code.replace("📄 Gestion des Contrats", `{${docIcon}} Gestion des Contrats`);


fs.writeFileSync('src/MatchmakingTab.jsx', code);
console.log("Matchmaking updated!");
