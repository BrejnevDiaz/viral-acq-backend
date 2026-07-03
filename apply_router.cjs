const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

if (!app.includes("import { Routes, Route, Link, useLocation, useNavigate }")) {
    app = app.replace(
        "import { useState, useEffect, useRef } from 'react';",
        "import { useState, useEffect, useRef } from 'react';\nimport { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';"
    );
}

if (!app.includes("function ScrollToTop() {")) {
    const scrollToTop = `
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
`;
    app = app.replace('export default function App() {', scrollToTop + '\nexport default function App() {');
}

app = app.replace(
    '          {isLoggedIn ? (',
    '          <ScrollToTop />\n          <Routes>\n            <Route path="/" element={\n              isLoggedIn ? ('
);

app = app.replace(
    '          {/* FOOTER */}',
    '            } />\n            <Route path="/cgv" element={<LegalPage type="CGV" />} />\n            <Route path="/privacy" element={<LegalPage type="Privacy" />} />\n            <Route path="/mentions" element={<LegalPage type="Legal" />} />\n            <Route path="/p/:id" element={<InfoPage />} />\n          </Routes>\n\n          {/* FOOTER */}'
);

const newComponents = `
function LegalPage({ type }) {
  return (
    <div style={{ maxWidth: 800, margin: '120px auto 160px auto', padding: '0 24px', color: '#fff' }}>
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
      </div>
    </div>
  );
}

function InfoPage() {
  const location = useLocation();
  const title = decodeURIComponent(location.pathname.replace('/p/', ''));
  
  return (
    <div style={{ maxWidth: 800, margin: '160px auto 200px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>🚧</div>
      <h1 style={{ fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px' }}>
        {title}
      </h1>
      <p style={{ color: '#A1A1AA', lineHeight: 1.6, fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
        Cette page est actuellement en cours de construction par nos équipes. Elle sera déployée très prochainement dans la version finale d'Acquisition Pro !
      </p>
      <div style={{ marginTop: 40 }}>
         <Link to="/" style={{ display: 'inline-block', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', color: '#fff', textDecoration: 'none', padding: '14px 32px', borderRadius: 12, fontWeight: 700, boxShadow: '0 10px 30px rgba(139,92,246,0.3)' }}>
            Retour à l'accueil
         </Link>
      </div>
    </div>
  );
}
`;

if (!app.includes('function LegalPage')) {
    app = app.replace('function ScrollToTop() {', newComponents + '\nfunction ScrollToTop() {');
}

// Manually replace the 3 remaining legal links
// <a href="#cgv" onClick={(e) => { e.preventDefault(); setLegalType('CGV'); setShowLegalModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Conditions générales de vente (CGV)</a>
app = app.replace(
    "onClick={(e) => { e.preventDefault(); setLegalType('CGV'); setShowLegalModal(true); }}",
    ""
).replace(
    '<a href="#cgv"',
    '<Link to="/cgv"'
).replace(
    'Conditions générales de vente (CGV)</a>',
    'Conditions générales de vente (CGV)</Link>'
);

// <a href="#privacy" onClick={(e) => { e.preventDefault(); setLegalType('Privacy'); setShowLegalModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Politique de confidentialité</a>
app = app.replace(
    "onClick={(e) => { e.preventDefault(); setLegalType('Privacy'); setShowLegalModal(true); }}",
    ""
).replace(
    '<a href="#privacy"',
    '<Link to="/privacy"'
).replace(
    'Politique de confidentialité</a>',
    'Politique de confidentialité</Link>'
);

// <a href="#mentions" onClick={(e) => { e.preventDefault(); setLegalType('Legal'); setShowLegalModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Mentions Légales</a>
app = app.replace(
    "onClick={(e) => { e.preventDefault(); setLegalType('Legal'); setShowLegalModal(true); }}",
    ""
).replace(
    '<a href="#mentions"',
    '<Link to="/mentions"'
).replace(
    'Mentions Légales</a>',
    'Mentions Légales</Link>'
);


// Delete Modals
app = app.replace(/\{\/\* Info Modal \*\/\}(.|\n)*\{\/\* Legal Modal \*\/\}(.|\n)*\{\/\* Auth Modal overlay \(Glassmorphism\) \*\/\}/g, '{/* Auth Modal overlay (Glassmorphism) */}');

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Done!');
