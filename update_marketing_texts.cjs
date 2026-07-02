const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

// Replace Hero Subtitle
const oldHeroP = `Découvrez les produits gagnants, analysez les boutiques e-commerce concurrentes, espionnez les meilleures créatives publicitaires et recrutez des influenceurs à fort impact sur Meta, TikTok, Pinterest et plus encore.`;
const newHeroP = `L'agence d'acquisition nouvelle génération : l'ultime plateforme de matchmaking. Recrutez les meilleurs influenceurs (le véritable Adecco de l'influence), analysez les stratégies marketing gagnantes et sourcez des créateurs à fort impact pour scaler votre marque.`;
if (app.includes(oldHeroP)) {
    app = app.replace(oldHeroP, newHeroP);
}

// Replace Feature 1 Title & Text
const oldF1Title = `Repère les annonces <span style={{ color: '#8B5CF6' }}>performantes</span>`;
const newF1Title = `L'Adecco de l'<span style={{ color: '#8B5CF6' }}>Influence Marketing</span>`;
// Note: We changed color to 8B5CF6 in previous step! Wait, in my previous step I replaced #F97316 with #8B5CF6. 
// Let's use regex or loose matching if needed. Actually, let's just replace the exact tags.
if (app.includes(oldF1Title)) {
    app = app.replace(oldF1Title, newF1Title);
}

const oldF1P = `Identifie les tendances avant les autres. Filtre par réseau, engagement, activité et popularité pour trouver les créatives publicitaires qui génèrent des millions.`;
const newF1P = `Recrutez instantanément les créateurs de contenu parfaits pour votre marque. Notre système de Matchmaking avancé filtre par niche, engagement et audience pour vous connecter avec les influenceurs qui génèrent une acquisition virale massive.`;
if (app.includes(oldF1P)) {
    app = app.replace(oldF1P, newF1P);
}

// Replace Feature 2 Title & Text
const oldF2Title = `Analyse les annonces avec des <span style={{ color: '#7C3AED' }}>données clés</span>`;
const newF2Title = `Pilotez vos campagnes et votre <span style={{ color: '#7C3AED' }}>Sourcing CRM</span>`;
// Wait, the original was color: '#8B5CF6'.
// Let's just do a regex replace for the text portions.
app = app.replace(/Repère les annonces/g, "L'Adecco de l'");
app = app.replace(/performantes<\/span>/g, "Influence Marketing</span>");
app = app.replace(/Analyse les annonces avec des/g, "Pilotez vos campagnes et votre");
app = app.replace(/données clés<\/span>/g, "Sourcing CRM</span>");

const oldF2P = `Suis l'activité et les budgets, explore la page de l'annonce et accède aux infos essentielles de la boutique pour valider ton produit gagnant.`;
const newF2P = `Une véritable agence de marketing entre vos mains. Gérez votre portefeuille d'influenceurs via notre CRM, suivez les budgets alloués et analysez le ROI de chaque campagne pour optimiser votre rentabilité en temps réel.`;
if (app.includes(oldF2P)) {
    app = app.replace(oldF2P, newF2P);
}

fs.writeFileSync('src/App.jsx', app);
console.log("Marketing texts updated!");
