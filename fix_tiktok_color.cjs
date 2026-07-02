const fs = require('fs');

let tab = fs.readFileSync('src/MatchmakingTab.jsx', 'utf8');

tab = tab.replace(
    `<span style={{ display: "flex", alignItems: "center", gap: 4, color: "#fff" }}>\n                                  <TikTokIcon />`,
    `<span style={{ display: "flex", alignItems: "center", gap: 4, color: c.text }}>\n                                  <TikTokIcon />`
);

tab = tab.replace(
    `<div style={{ display: "flex", alignItems: "center", gap: 4, color: "#fff" }}><TikTokIcon />`,
    `<div style={{ display: "flex", alignItems: "center", gap: 4, color: c.text }}><TikTokIcon />`
);

fs.writeFileSync('src/MatchmakingTab.jsx', tab, 'utf8');
console.log('Fixed TikTok text color in MatchmakingTab.jsx!');
