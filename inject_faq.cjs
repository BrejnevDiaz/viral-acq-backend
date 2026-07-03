const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

const oldFaq = `[
                     "Comment fonctionne le Matchmaking avec les Créateurs ?",
                     "Quels sont les avantages par rapport à une agence classique ?",
                     "Puis-je gérer mes contrats légaux sur la plateforme ?",
                     "Est-ce adapté si je débute en e-commerce ?",
                     "Quelle est la différence entre VIP Pro et VIP Elite ?"
                   ].map((q, i) => (
                      <details key={i} style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                         <summary style={{ padding: 24, fontSize: 16, fontWeight: 600, color: '#E4E4E7', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {q}
                            <span style={{ color: '#8B5CF6', fontSize: 24 }}>›</span>
                         </summary>
                         <div style={{ padding: '0 24px 24px 24px', color: '#A1A1AA', fontSize: 15, lineHeight: 1.6 }}>
                            Notre IA analyse des milliers de données (engagement, audience, niche) pour vous connecter automatiquement avec les créateurs UGC et influenceurs les plus rentables pour votre marque. Finies les heures de recherche manuelle.
                         </div>
                      </details>
                   ))`;

const newFaq = `[
                     {
                        q: "Comment fonctionne le Matchmaking avec les Créateurs ?",
                        a: "Notre algorithme d'IA scanne des milliers de profils TikTok et Instagram en temps réel. Il croise votre niche, votre budget et l'engagement du créateur pour vous proposer les meilleurs profils. Vous gagnez jusqu'à 80% du temps habituellement passé en sourcing manuel."
                     },
                     {
                        q: "Quels sont les avantages par rapport à une agence classique ?",
                        a: "Contrairement à une agence traditionnelle qui vous facture des commissions énormes et vous impose ses propres créateurs, Acquisition Pro vous donne l'outil pour internaliser votre influence. Vous avez un contrôle total, un accès transparent aux données, et vous payez les influenceurs en direct sans intermédiaire."
                     },
                     {
                        q: "Puis-je gérer mes contrats légaux sur la plateforme ?",
                        a: "Oui ! Notre module de génération de contrats est conçu avec des avocats spécialisés. Vous générez vos contrats de cession de droits d'image et de prestation UGC en 3 clics, et vous pouvez les envoyer directement aux créateurs via notre CRM intégré."
                     },
                     {
                        q: "Est-ce adapté si je débute en e-commerce ?",
                        a: "Absolument. Nous avons même inclus des modules d'analyse de concurrence et d'inspiration pour vous guider pas-à-pas. Vous n'avez pas besoin d'être un expert : la plateforme vous aide à trouver les bons créateurs et vous propose des modèles de briefs pré-remplis pour garantir le succès de vos premières campagnes."
                     },
                     {
                        q: "Quelle est la différence entre VIP Pro et VIP Elite ?",
                        a: "Le plan VIP Pro est parfait pour les marques qui lancent quelques campagnes mensuelles. Le plan VIP Elite inclut un accès prioritaire à notre IA de Vetting (qui valide l'authenticité de l'audience d'un influenceur), des recherches illimitées et un accompagnement exclusif par nos équipes."
                     }
                   ].map((item, i) => (
                      <details key={i} style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                         <summary style={{ padding: 24, fontSize: 16, fontWeight: 600, color: '#E4E4E7', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {item.q}
                            <span style={{ color: '#8B5CF6', fontSize: 24 }}>›</span>
                         </summary>
                         <div style={{ padding: '0 24px 24px 24px', color: '#A1A1AA', fontSize: 15, lineHeight: 1.6 }}>
                            {item.a}
                         </div>
                      </details>
                   ))`;

// Using replace function with a custom replacer to avoid regex matching issues with newlines
function replaceFaq(code) {
    // Find the start of the array
    const startIndex = code.indexOf('[\n                     "Comment fonctionne le Matchmaking avec les Créateurs ?",');
    if (startIndex === -1) return code;
    
    // Find the end of the map function
    const endStr = '</div>\n                      </details>\n                   ))';
    const endIndex = code.indexOf(endStr, startIndex);
    if (endIndex === -1) return code;
    
    const before = code.substring(0, startIndex);
    const after = code.substring(endIndex + endStr.length);
    
    return before + newFaq + after;
}

const newApp = replaceFaq(app);

if (newApp !== app) {
    fs.writeFileSync('src/App.jsx', newApp, 'utf8');
    console.log('FAQ replaced successfully');
} else {
    console.log('FAQ string not found!');
}
