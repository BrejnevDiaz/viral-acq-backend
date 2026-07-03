const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add imports
if (!app.includes("import { Routes, Route, Link, useLocation, useNavigate }")) {
    app = app.replace(
        "import { useState, useEffect, useRef } from 'react';",
        "import { useState, useEffect, useRef } from 'react';\nimport { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';"
    );
}

// 2. Inject Page Components and ScrollToTop at the top
const newComponents = `
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function LegalPage({ type }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', fontFamily: "'Inter', sans-serif" }}>
      <ScrollToTop />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 160px 24px' }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 40, letterSpacing: '-1px' }}>
          {type === 'CGV' ? 'Conditions Générales de Vente' : type === 'Privacy' ? 'Politique de Confidentialité' : 'Mentions Légales'}
        </h1>
        <div style={{ color: '#A1A1AA', lineHeight: 1.8, fontSize: 16 }}>
          {type === 'CGV' && (
            <>
              <h3 style={{ color: '#fff', fontSize: 20, marginTop: 32 }}>1. Objet</h3>
              <p>Les présentes Conditions Générales de Vente régissent l'utilisation de la plateforme Acquisition Pro. En utilisant nos services, vous acceptez ces termes.</p>
              <h3 style={{ color: '#fff', fontSize: 20, marginTop: 32 }}>2. Abonnements et Paiements</h3>
              <p>L'accès aux fonctionnalités avancées (Adspy, CRM, Matchmaking) nécessite un abonnement actif. Les paiements sont traités de manière sécurisée via Stripe. Vous pouvez annuler votre abonnement à tout moment sans frais cachés.</p>
              <h3 style={{ color: '#fff', fontSize: 20, marginTop: 32 }}>3. Responsabilités</h3>
              <p>L'utilisateur est seul responsable des contrats générés avec les créateurs via la plateforme. Acquisition Pro n'agit qu'en tant qu'intermédiaire technologique.</p>
            </>
          )}
          {type === 'Privacy' && (
            <>
              <h3 style={{ color: '#fff', fontSize: 20, marginTop: 32 }}>1. Collecte des données</h3>
              <p>Nous collectons les données strictement nécessaires à la création de votre compte (email, nom) et à l'utilisation du CRM d'influence (informations de campagnes).</p>
              <h3 style={{ color: '#fff', fontSize: 20, marginTop: 32 }}>2. Utilisation et Confidentialité</h3>
              <p>Vos données de sourcing, vos analyses et vos portefeuilles de créateurs sont strictement confidentiels. Nous ne partageons aucune de vos données stratégiques avec d'autres utilisateurs ou marques.</p>
              <h3 style={{ color: '#fff', fontSize: 20, marginTop: 32 }}>3. Cookies</h3>
              <p>Nous utilisons uniquement des cookies essentiels pour maintenir votre session active de manière sécurisée.</p>
            </>
          )}
          {type === 'Legal' && (
            <>
              <h3 style={{ color: '#fff', fontSize: 20, marginTop: 32 }}>Éditeur du site</h3>
              <p>Le site Acquisition Pro est édité par l'agence ViralAcquisition, spécialisée en influence marketing B2B.</p>
              <h3 style={{ color: '#fff', fontSize: 20, marginTop: 32 }}>Hébergement</h3>
              <p>Ce site est hébergé de manière sécurisée et distribuée sur les serveurs de Vercel Inc, San Francisco, Californie (États-Unis).</p>
              <h3 style={{ color: '#fff', fontSize: 20, marginTop: 32 }}>Propriété Intellectuelle</h3>
              <p>L'ensemble des éléments constituant la plateforme Acquisition Pro (structure, design, base de données CRM) est la propriété exclusive de ViralAcquisition.</p>
            </>
          )}
          <div style={{ marginTop: 80, padding: 24, background: 'rgba(139,92,246,0.1)', borderRadius: 12, border: '1px solid rgba(139,92,246,0.2)' }}>
             <p style={{ fontSize: 13, margin: 0, fontStyle: 'italic', color: '#C084FC' }}>Avertissement : Ceci est un document légal générique pour le MVP de la plateforme SaaS Acquisition Pro. Il est recommandé de le faire valider et compléter par un conseiller juridique compétent.</p>
          </div>
          
          <div style={{ marginTop: 40 }}>
             <a href="/" style={{ display: 'inline-block', background: '#27272A', color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 600 }}>
                ← Retour
             </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoPage({ title }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff', fontFamily: "'Inter', sans-serif" }}>
      <ScrollToTop />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '160px 24px 200px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🚧</div>
        <h1 style={{ fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px' }}>
          {title}
        </h1>
        <p style={{ color: '#A1A1AA', lineHeight: 1.6, fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
          Cette page est actuellement en cours de construction par nos équipes. Elle sera déployée très prochainement dans la version finale d'Acquisition Pro !
        </p>
        <div style={{ marginTop: 40 }}>
           <a href="/" style={{ display: 'inline-block', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', color: '#fff', textDecoration: 'none', padding: '14px 32px', borderRadius: 12, fontWeight: 700, boxShadow: '0 10px 30px rgba(139,92,246,0.3)' }}>
              Retour à l'accueil
           </a>
        </div>
      </div>
    </div>
  );
}
`;

if (!app.includes('function LegalPage')) {
    app = app.replace('export default function App() {', newComponents + '\nexport default function App() {');
}

// 3. Inject useLocation and routing logic at the start of App()
const routingLogic = `
  const location = useLocation();
  const path = location.pathname;

  if (path === '/cgv') return <LegalPage type="CGV" />;
  if (path === '/mentions') return <LegalPage type="Legal" />;
  if (path === '/privacy') return <LegalPage type="Privacy" />;
  if (path.startsWith('/p/')) return <InfoPage title={decodeURIComponent(path.replace('/p/', ''))} />;
`;

if (!app.includes('const path = location.pathname;')) {
    app = app.replace(
        '  const [isLoggedIn, setIsLoggedIn]       = useState(false);',
        routingLogic + '\n  const [isLoggedIn, setIsLoggedIn]       = useState(false);'
    );
}

// 4. Replace links in footer
app = app.replace(
    /<a href="#cgv"[^>]*>Conditions générales de vente \(CGV\)<\/a>/g, 
    '<Link to="/cgv" style={{ color: "#A1A1AA", fontSize: 14, textDecoration: "none" }}>Conditions générales de vente (CGV)</Link>'
);

app = app.replace(
    /<a href="#privacy"[^>]*>Politique de confidentialité<\/a>/g, 
    '<Link to="/privacy" style={{ color: "#A1A1AA", fontSize: 14, textDecoration: "none" }}>Politique de confidentialité</Link>'
);

app = app.replace(
    /<a href="#mentions"[^>]*>Mentions Légales<\/a>/g, 
    '<Link to="/mentions" style={{ color: "#A1A1AA", fontSize: 14, textDecoration: "none" }}>Mentions Légales</Link>'
);

const titles = [
    "Influenceurs TikTok",
    "Coaching Elite",
    "Trouvez votre talent",
    "Matchmaking CRM",
    "Formation Acquisition",
    "Meilleure agence",
    "Stratégie virale",
    "Comment démarrer ?",
    "Analyse de la concurrence",
    "Blog & Ressources"
];

titles.forEach(t => {
    const safeT = t.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('<a href="#info"[^>]*>' + safeT + '</a>', 'g');
    app = app.replace(regex, '<Link to="/p/' + encodeURIComponent(t) + '" style={{ color: "#A1A1AA", fontSize: 14, textDecoration: "none" }}>' + t + '</Link>');
});

// Since the regex might miss the two with encoding issues, replace them explicitly just in case:
app = app.replace(
    /<a href="#info"[^>]*>Stratégie virale<\/a>/g,
    '<Link to="/p/Strategie%20virale" style={{ color: "#A1A1AA", fontSize: 14, textDecoration: "none" }}>Stratégie virale</Link>'
);
app = app.replace(
    /<a href="#info"[^>]*>Comment démarrer \?<\/a>/g,
    '<Link to="/p/Comment%20demarrer" style={{ color: "#A1A1AA", fontSize: 14, textDecoration: "none" }}>Comment démarrer ?</Link>'
);

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Successfully injected conditional routing logic into App.jsx!');
