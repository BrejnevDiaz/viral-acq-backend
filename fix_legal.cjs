const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add state for Legal Modal
if (!app.includes('const [showLegalModal, setShowLegalModal] = useState')) {
    app = app.replace(
        'const [showLoginModal, setShowLoginModal] = useState(false);',
        'const [showLoginModal, setShowLoginModal] = useState(false);\\n  const [showLegalModal, setShowLegalModal] = useState(false);\\n  const [legalType, setLegalType] = useState("");'
    );
}

// 2. Add Legal Modal Component before LoginModal
const legalModalCode = `
      {/* Legal Modal */}
      {showLegalModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#18181B', padding: 40, borderRadius: 24, width: '100%', maxWidth: 800, maxHeight: '80vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
            <button onClick={() => setShowLegalModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>×</button>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 24 }}>
              {legalType === 'CGV' ? 'Conditions Générales de Vente' : legalType === 'Privacy' ? 'Politique de Confidentialité' : 'Mentions Légales'}
            </h2>
            <div style={{ color: '#A1A1AA', lineHeight: 1.6, fontSize: 15 }}>
              {legalType === 'CGV' && (
                <>
                  <h3>1. Objet</h3>
                  <p>Les présentes Conditions Générales de Vente régissent l'utilisation de la plateforme Acquisition Pro...</p>
                  <h3>2. Abonnements et Paiements</h3>
                  <p>L'accès aux fonctionnalités avancées (Adspy, CRM, Matchmaking) nécessite un abonnement actif. Les paiements sont traités de manière sécurisée via Stripe.</p>
                  <h3>3. Responsabilités</h3>
                  <p>L'utilisateur est seul responsable des contrats générés avec les créateurs via la plateforme.</p>
                </>
              )}
              {legalType === 'Privacy' && (
                <>
                  <h3>1. Collecte des données</h3>
                  <p>Nous collectons les données nécessaires à la création de votre compte et à l'utilisation du CRM d'influence.</p>
                  <h3>2. Utilisation</h3>
                  <p>Vos données de sourcing et vos portefeuilles de créateurs sont strictement confidentiels et ne sont pas partagés avec les autres utilisateurs.</p>
                  <h3>3. Cookies</h3>
                  <p>Nous utilisons des cookies essentiels pour maintenir votre session active.</p>
                </>
              )}
              {legalType === 'Legal' && (
                <>
                  <h3>Éditeur du site</h3>
                  <p>Le site Acquisition Pro est édité par l'agence ViralAcquisition.</p>
                  <h3>Hébergement</h3>
                  <p>Ce site est hébergé sur Vercel Inc, San Francisco, CA.</p>
                  <h3>Contact</h3>
                  <p>Pour toute question, veuillez contacter le support via notre adresse email officielle.</p>
                </>
              )}
              <br/><br/>
              <p style={{ fontSize: 12 }}><i>Ceci est un document légal générique pour le SaaS Acquisition Pro. Il doit être complété par votre avocat ou conseiller juridique.</i></p>
            </div>
          </div>
        </div>
      )}
`;

app = app.replace('{/* Login Modal */}', legalModalCode + '\\n      {/* Login Modal */}');

// 3. Fix Footer Links to open Modal instead of redirecting
app = app.replace(
    `<a href="https://viralacquisition.it/" target="_blank" rel="noopener noreferrer" style={{ color: '#A1A1AA', textDecoration: 'none', fontSize: 14 }}>Conditions générales de vente (CGV)</a>`,
    `<a href="#cgv" onClick={(e) => { e.preventDefault(); setLegalType('CGV'); setShowLegalModal(true); }} style={{ color: '#A1A1AA', textDecoration: 'none', fontSize: 14, cursor: 'pointer' }}>Conditions générales de vente (CGV)</a>`
);
app = app.replace(
    `<a href="https://viralacquisition.it/" target="_blank" rel="noopener noreferrer" style={{ color: '#A1A1AA', textDecoration: 'none', fontSize: 14 }}>Politique de confidentialité</a>`,
    `<a href="#privacy" onClick={(e) => { e.preventDefault(); setLegalType('Privacy'); setShowLegalModal(true); }} style={{ color: '#A1A1AA', textDecoration: 'none', fontSize: 14, cursor: 'pointer' }}>Politique de confidentialité</a>`
);
app = app.replace(
    `<a href="https://viralacquisition.it/" target="_blank" rel="noopener noreferrer" style={{ color: '#A1A1AA', textDecoration: 'none', fontSize: 14 }}>Mentions Légales</a>`,
    `<a href="#mentions" onClick={(e) => { e.preventDefault(); setLegalType('Legal'); setShowLegalModal(true); }} style={{ color: '#A1A1AA', textDecoration: 'none', fontSize: 14, cursor: 'pointer' }}>Mentions Légales</a>`
);


fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Successfully added legal modals and removed external links!');
