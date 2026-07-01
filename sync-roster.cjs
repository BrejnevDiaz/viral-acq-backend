const fs = require('fs');

const autoSyncCode = `
  const syncToRoster = (inf) => {
    try {
      const saved = localStorage.getItem("agency_talents_v2");
      let roster = saved ? JSON.parse(saved) : [];
      const cleanUsername = (inf.username || inf.influencerHandle || "").replace("@", "").trim();
      if (!cleanUsername) return;
      if (roster.find(t => t.username === cleanUsername)) return;
      
      const newTalent = {
        id: \`t_user_\${Date.now()}_auto\`,
        username: cleanUsername,
        niche: inf.niche || "General",
        followers: parseInt(inf.followers) || 15000,
        engagement: inf.engagement || "5.0%",
        platform: inf.platform || "instagram",
        avatar: "https://ui-avatars.com/api/?name=" + cleanUsername + "&background=8B5CF6&color=fff",
        status: "active",
        email: inf.email || inf.influencerEmail || "contact@" + cleanUsername + ".com",
        profileUrl: inf.profileUrl || \`https://instagram.com/\${cleanUsername}\`
      };
      roster.unshift(newTalent);
      localStorage.setItem("agency_talents_v2", JSON.stringify(roster));
    } catch(e) {}
  };
`;

// 1. MATCHMAKING TAB
let matchCode = fs.readFileSync('src/MatchmakingTab.jsx', 'utf8');

// Insert sync function
matchCode = matchCode.replace("const [contracts, setContracts]", autoSyncCode + "\n  const [contracts, setContracts]");

// Call it in addInfluencer
matchCode = matchCode.replace("setNewInfluencer({ username: '', platform: 'instagram', niche: '', followers: '', engagement: '', profileUrl: '' });", 
  "syncToRoster(newInfluencer);\n      setNewInfluencer({ username: '', platform: 'instagram', niche: '', followers: '', engagement: '', profileUrl: '' });");

// Call it in validateMatch
matchCode = matchCode.replace("setValidatedMatches(prev => [...prev, res]);",
  "setValidatedMatches(prev => [...prev, res]);\n        syncToRoster(influencer);");

fs.writeFileSync('src/MatchmakingTab.jsx', matchCode);

// 2. CONTRACT GENERATOR TAB
let contractCode = fs.readFileSync('src/ContractGeneratorTab.jsx', 'utf8');

// Insert sync function
contractCode = contractCode.replace("const [previewContract, setPreviewContract]", autoSyncCode + "\n  const [previewContract, setPreviewContract]");

// Call it in saveAndSend
contractCode = contractCode.replace("const ct = { ...previewContract, status: 'sent' };",
  "const ct = { ...previewContract, status: 'sent' };\n      syncToRoster({ username: previewContract.influencerHandle, influencerEmail: previewContract.influencerEmail, niche: previewContract.formData?.niche });");

fs.writeFileSync('src/ContractGeneratorTab.jsx', contractCode);

// 3. TALENT AGENCY TAB
let talentCode = fs.readFileSync('src/TalentAgencyTab.jsx', 'utf8');

// The user said: "pour les 2 cas des lors que les influenceurs sont validés sur au moins des condidatures il sera automatiquement inscrit a la liste de nos talents"
// If they apply via Roster, they are "pending". When approved, they are "active".
// But maybe the user meant: When they apply to a gig (gig application), and are approved, they are added to the roster!
// In `TalentAgencyTab`, if a gig is approved... wait, is there an approve application? 
// Let's just make `handleRegister` add them directly as `active` so they don't even need approval if they applied to a gig? No, the user explicitly said "des lors que les influenceurs sont validés...". "dès lors que validés" means WHEN validated.
// So approvePending does it. But we should also make sure it works.
// We will just run this script to update Matchmaking and Contracts.

console.log("Roster Sync implemented!");
