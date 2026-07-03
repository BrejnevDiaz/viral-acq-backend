const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Rename branding to Acquisition Pro in Navbar and titles
// Let's replace the main logo text
app = app.replace(
    `<div style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>ViralAcquisition</div>`,
    `<div style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>Acquisition Pro</div>`
);
app = app.replace(
    `<div style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>ViralAcquisition</div>`,
    `<div style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>Acquisition Pro</div>`
); // Twice for good measure (Landing & Dashboard Navbars)

// Hero Title
app = app.replace(
    `<span style={{ color: '#8B5CF6' }}>ViralAcquisition</span>`,
    `<span style={{ color: '#8B5CF6' }}>Acquisition Pro</span>`
);

// Matchmaking Title
app = app.replace(
    `de <span style={{ color: '#8B5CF6' }}>ViralAcquisition</span></h2>`,
    `d'<span style={{ color: '#8B5CF6' }}>Acquisition Pro</span></h2>`
);
app = app.replace(
    `Ce que les experts disent de <span style={{ color: '#8B5CF6' }}>ViralAcquisition</span>`,
    `Ce que les experts disent d'<span style={{ color: '#8B5CF6' }}>Acquisition Pro</span>`
);
app = app.replace(
    `Fondateur de ViralAcquisition`,
    `Fondateur de ViralAcquisition (Agence)`
);
app = app.replace(
    `viralacq.app/analyzer`,
    `acquisition-pro.app/analyzer`
);
app = app.replace(
    `<h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>\\n                       <span style={{ color: '#8B5CF6' }}>ViralAcquisition</span>`,
    `<h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>\\n                       <span style={{ color: '#8B5CF6' }}>Acquisition Pro</span>`
);

// 2. Founder Photo
app = app.replace(
    `https://github.com/BrejnevDiaz.png`,
    `/founder.jpg`
);

// 3. Real FAQ
const oldFaq1 = `À quoi sert ViralAcquisition ?`;
const newFaq1 = `Comment fonctionne le Matchmaking avec les Créateurs ?`;
const oldFaqAns1 = `ViralAcquisition est la plateforme ultime pour connecter les marques et les influenceurs. Notre technologie analyse des milliers de données pour garantir le partenariat le plus rentable.`;
const newFaqAns1 = `Notre IA analyse des milliers de données (engagement, audience, niche) pour vous connecter automatiquement avec les créateurs UGC et influenceurs les plus rentables pour votre marque. Finies les heures de recherche manuelle.`;

const oldFaq2 = `L'abonnement est-il sans engagement ?`;
const newFaq2 = `Quels sont les avantages par rapport à une agence classique ?`;
const oldFaqAns2 = `Oui, vous pouvez annuler votre abonnement à tout moment depuis les paramètres de votre compte, sans frais cachés.`;
const newFaqAns2 = `Acquisition Pro vous offre la puissance et le réseau d'une agence directement via notre SaaS. Vous gérez vos campagnes, sourcez vos talents et générez vos contrats légaux (CRM) au même endroit, pour une fraction du prix.`;

const oldFaq3 = `Comment annuler mon abonnement ?`;
const newFaq3 = `Puis-je gérer mes contrats légaux sur la plateforme ?`;
const oldFaqAns3 = `Dans votre Dashboard, allez dans Paramètres > Facturation et cliquez sur "Annuler l'abonnement".`;
const newFaqAns3 = `Oui ! Notre CRM intégré vous permet de générer instantanément des contrats d'influence personnalisés et de les faire signer numériquement à vos talents en quelques clics.`;

const oldFaq4 = `Comment fonctionne le Matchmaking ?`;
const newFaq4 = `Est-ce adapté si je débute en e-commerce ?`;
const oldFaqAns4 = `Nous utilisons des algorithmes avancés pour trouver les créateurs qui correspondent parfaitement à l'audience de votre marque.`;
const newFaqAns4 = `Absolument. Nous mettons à disposition "l'Académie", une formation de +10h pour vous apprendre à sourcer, recruter et scaler vos marques grâce à l'influence marketing.`;

app = app.replace(oldFaq1, newFaq1).replace(oldFaqAns1, newFaqAns1)
         .replace(oldFaq2, newFaq2).replace(oldFaqAns2, newFaqAns2)
         .replace(oldFaq3, newFaq3).replace(oldFaqAns3, newFaqAns3)
         .replace(oldFaq4, newFaq4).replace(oldFaqAns4, newFaqAns4);

// 4. Real Insta Handles in Testimonials
app = app.replace(`Lucas Bivert</div>\\n                         <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Marque E-com</div>`, `Lucas Bivert</div>\\n                         <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>@lucasbivert</div>`);
app = app.replace(`Thomas</div>\\n                      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>Thomas, <span style={{ color: '#8B5CF6' }}>Marque E-com</span></div>`, `Thomas</div>\\n                      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>@thomas.ecom, <span style={{ color: '#8B5CF6' }}>Marque E-com</span></div>`);

// 5. Footer Links
app = app.replace(/href="#"/g, `href="https://viralacquisition.it/" target="_blank" rel="noopener noreferrer"`);

// 6. Language Selector binding
const selectTarget = `<select style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 14, cursor: 'pointer', outline: 'none' }}>\\n                     <option value="fr" style={{ color: '#000' }}>French</option>\\n                     <option value="en" style={{ color: '#000' }}>English</option>\\n                   </select>`;
const selectReplacement = `<select value={uiLang} onChange={(e) => setUiLang(e.target.value)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 14, cursor: 'pointer', outline: 'none' }}>\\n                     <option value="fr" style={{ color: '#000' }}>French</option>\\n                     <option value="en" style={{ color: '#000' }}>English</option>\\n                   </select>`;
app = app.replace(selectTarget, selectReplacement);

// 7. Simuler vidéos créatives dans le Bento Grid (Feature #1)
// Replace the big "10 profils gagnants" image with a video loop
app = app.replace(
    `<img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />`,
    `<video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}><source src="https://player.vimeo.com/external/494252666.sd.mp4?s=25db1cd0c3dbf9b7c8fb23893b8d4f40f0653f86&profile_id=165&oauth2_token_id=57447761" type="video/mp4" /></video>`
);

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Successfully applied all UI fixes!');
