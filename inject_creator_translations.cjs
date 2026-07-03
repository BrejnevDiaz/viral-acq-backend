const fs = require('fs');
let content = fs.readFileSync('src/LandingCreators.jsx', 'utf8');

// Add uiLang prop
content = content.replace(
    /export default function LandingCreators\(\{\s*setAuthMode,\s*setShowLoginModal\s*\}\)/,
    `export default function LandingCreators({ setAuthMode, setShowLoginModal, uiLang })`
);

// Translate ESPACE CRÉATEURS
content = content.replace(
    /ESPACE CRÉATEURS & UGC/,
    `{uiLang === 'fr' ? 'ESPACE CRÉATEURS & UGC' : 'CREATORS & UGC HUB'}`
);

// Translate Headline
content = content.replace(
    /Monétisez votre audience\. <br\/>/,
    `{uiLang === 'fr' ? 'Monétisez votre audience. ' : 'Monetize your audience. '}<br/>`
);
content = content.replace(
    /Zéro commission\./,
    `{uiLang === 'fr' ? 'Zéro commission.' : 'Zero commission.'}`
);

// Translate Subheadline
content = content.replace(
    /Rejoignez le réseau privé d'Acquisition Pro et laissez notre IA vous connecter directement avec les meilleures marques de votre niche\. Fini les négociations interminables\./,
    `{uiLang === 'fr' ? "Rejoignez le réseau privé d'Acquisition Pro et laissez notre IA vous connecter directement avec les meilleures marques de votre niche. Fini les négociations interminables." : "Join the exclusive Acquisition Pro network and let our AI connect you directly with the best brands in your niche. No more endless negotiations."}`
);

// Translate Feature 1
content = content.replace(
    /Matchmaking Automatique/,
    `{uiLang === 'fr' ? 'Matchmaking Automatique' : 'Automatic Matchmaking'}`
);
content = content.replace(
    /Notre IA analyse votre profil et vous propose des marques dont l'ADN correspond parfaitement au vôtre\./,
    `{uiLang === 'fr' ? "Notre IA analyse votre profil et vous propose des marques dont l'ADN correspond parfaitement au vôtre." : "Our AI analyzes your profile and suggests brands whose DNA perfectly matches yours."}`
);

// Translate Feature 2
content = content.replace(
    /Paiements 100% Sécurisés/,
    `{uiLang === 'fr' ? 'Paiements 100% Sécurisés' : '100% Secure Payments'}`
);
content = content.replace(
    /La marque paie en amont sur un compte séquestre\. Vous êtes garanti d'être payé dès la livraison de la vidéo\./,
    `{uiLang === 'fr' ? "La marque paie en amont sur un compte séquestre. Vous êtes garanti d'être payé dès la livraison de la vidéo." : "The brand pays upfront into an escrow account. You are guaranteed to be paid upon delivery of the video."}`
);

// Translate Feature 3
content = content.replace(
    /Zéro frais pour les créateurs/,
    `{uiLang === 'fr' ? 'Zéro frais pour les créateurs' : 'Zero fees for creators'}`
);
content = content.replace(
    /Vous gardez 100% de vos revenus\. Ce sont les marques qui paient l'abonnement au logiciel\./,
    `{uiLang === 'fr' ? "Vous gardez 100% de vos revenus. Ce sont les marques qui paient l'abonnement au logiciel." : "You keep 100% of your earnings. The brands pay the software subscription."}`
);

// Translate CTA
content = content.replace(
    /Devenir Créateur Partenaire/,
    `{uiLang === 'fr' ? 'Devenir Créateur Partenaire' : 'Become a Partner Creator'}`
);

// Translate Notification Badge
content = content.replace(
    /\+850 € Reçu/,
    `{uiLang === 'fr' ? '+850 € Reçu' : '+850 € Received'}`
);

// Translate Creator role
content = content.replace(
    /Créatrice UGC & Beauté/,
    `{uiLang === 'fr' ? 'Créatrice UGC & Beauté' : 'UGC & Beauty Creator'}`
);

// Translate Stats
content = content.replace(
    /Taux d'engagement/,
    `{uiLang === 'fr' ? "Taux d'engagement" : "Engagement Rate"}`
);
content = content.replace(
    /Collabs réussies/,
    `{uiLang === 'fr' ? 'Collabs réussies' : 'Successful Collabs'}`
);

// Translate Match notification
content = content.replace(
    /Nouvelle proposition reçue/,
    `{uiLang === 'fr' ? 'Nouvelle proposition reçue' : 'New proposal received'}`
);
content = content.replace(
    /La marque Sephora souhaite collaborer avec vous pour une vidéo TikTok\./,
    `{uiLang === 'fr' ? "La marque Sephora souhaite collaborer avec vous pour une vidéo TikTok." : "The brand Sephora wants to collaborate with you for a TikTok video."}`
);
content = content.replace(
    /Accepter/g,
    `{uiLang === 'fr' ? 'Accepter' : 'Accept'}`
);
content = content.replace(
    /Voir le brief/,
    `{uiLang === 'fr' ? 'Voir le brief' : 'View Brief'}`
);

fs.writeFileSync('src/LandingCreators.jsx', content, 'utf8');
console.log('LandingCreators translations applied!');
