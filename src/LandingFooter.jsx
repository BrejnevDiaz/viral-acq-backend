export default function LandingFooter({ setAuthMode, setShowLoginModal, showInfoModal, setShowInfoModal, infoContent, setInfoContent, showLegalModal, setShowLegalModal, legalType, setLegalType, uiLang }) {
  return (
    <>
          {/* FOOTER */}
          <footer style={{ background: '#09090B', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 80, paddingBottom: 40, marginTop: 80 }}>
             <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'wrap', gap: 60, justifyContent: 'space-between', marginBottom: 80 }}>
                <div style={{ maxWidth: 300 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                     <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>VA</div>
                     <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Acquisition Pro</span>
                   </div>
                   <p style={{ color: '#A1A1AA', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>{uiLang === 'fr' ? "La plateforme d'élite qui connecte marques ambitieuses et créateurs à fort impact — espionnage concurrentiel, matchmaking IA, et CRM, réunis en un seul outil." : uiLang === 'it' ? "La piattaforma d'élite che connette brand ambiziosi e creatori ad alto impatto — analisi competitiva, matchmaking IA e CRM, tutto in uno." : "The elite platform connecting ambitious brands and high-impact creators — competitive intelligence, AI matchmaking, and CRM, all in one tool."}</p>
                   <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>in</div>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>IG</div>
                   </div>
                </div>

                <div style={{ display: 'flex', gap: 80, flexWrap: 'wrap' }}>
                   <div>
                      <h4 style={{ color: '#EC4899', fontSize: 14, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase' }}>{uiLang === 'fr' ? 'Découvrez' : uiLang === 'it' ? 'Scopri' : 'Discover'}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: uiLang === 'fr' ? 'Influenceurs TikTok' : uiLang === 'it' ? 'Influencer TikTok' : 'TikTok Influencers' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Influenceurs TikTok</a>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: 'Coaching Elite' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Coaching Elite</a>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: uiLang === 'fr' ? 'Trouvez votre talent' : uiLang === 'it' ? 'Trova il tuo talento' : 'Find your talent' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Trouvez votre talent</a>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: 'Matchmaking CRM' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Matchmaking CRM</a>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: 'Formation Acquisition' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Formation Acquisition</a>
                      </div>
                   </div>

                   <div>
                      <h4 style={{ color: '#10B981', fontSize: 14, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase' }}>En savoir plus</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: 'Meilleure agence' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Meilleure agence</a>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: 'Stratégie virale' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Stratégie virale</a>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: 'Comment démarrer ?' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Comment démarrer ?</a>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: 'Analyse de la concurrence' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Analyse de la concurrence</a>
                         <a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: uiLang === 'fr' ? 'Blog & Ressources' : uiLang === 'it' ? 'Blog & Risorse' : 'Blog & Resources' }); setShowInfoModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Blog & Ressources</a>
                      </div>
                   </div>

                   <div>
                      <h4 style={{ color: '#8B5CF6', fontSize: 14, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase' }}>Liens Pratiques (Légal)</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                         <a href="#login" onClick={(e) => { e.preventDefault(); setAuthMode('login'); setShowLoginModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Connexion</a>
                         <a href="#signup" onClick={(e) => { e.preventDefault(); setAuthMode('signup'); setShowLoginModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Inscription</a>
                         <a href="#cgv" onClick={(e) => { e.preventDefault(); setLegalType('CGV'); setShowLegalModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Conditions générales de vente (CGV)</a>
                         <a href="#privacy" onClick={(e) => { e.preventDefault(); setLegalType('Privacy'); setShowLegalModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>Politique de confidentialité</a>
                         <a href="#mentions" onClick={(e) => { e.preventDefault(); setLegalType('Legal'); setShowLegalModal(true); }} style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer' }}>{uiLang === 'fr' ? 'Mentions Légales' : uiLang === 'it' ? 'Note Legali' : 'Legal Notice'}</a>
                      </div>
                   </div>
                </div>
             </div>
             
             <div style={{ textAlign: 'center', color: '#71717A', fontSize: 13, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 40 }}>
                Acquisition Pro by Viral Acquisition © 2026. Tous droits réservés.
             </div>
          </footer>

          {/* Info Modal */}
          {showInfoModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#18181B', padding: 40, borderRadius: 24, width: '100%', maxWidth: 600, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', textAlign: 'center' }}>
                <button onClick={() => setShowInfoModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>×</button>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🚧</div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
                  {infoContent.title}
                </h2>
                <p style={{ color: '#A1A1AA', lineHeight: 1.6, fontSize: 15 }}>
                  Cette page est en cours de construction. Elle sera disponible très prochainement dans la version finale d'Acquisition Pro.
                </p>
                <button onClick={() => setShowInfoModal(false)} style={{ marginTop: 24, background: '#8B5CF6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Compris !</button>
              </div>
            </div>
          )}

          {/* Legal Modal */}
          {showLegalModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#18181B', padding: 40, borderRadius: 24, width: '100%', maxWidth: 800, maxHeight: '80vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                <button onClick={() => setShowLegalModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>×</button>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 24 }}>
                  {legalType === 'CGV' ? 'Conditions Générales de Vente' : legalType === 'Privacy' ? (uiLang === 'fr' ? 'Politique de Confidentialité' : uiLang === 'it' ? 'Informativa sulla Privacy' : 'Privacy Policy') : (uiLang === 'fr' ? 'Mentions Légales' : uiLang === 'it' ? 'Note Legali' : 'Legal Notice')}
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
                      <p>Le site Acquisition Pro est édité par l'agence Viral Acquisition (fondée par Brejnev Diaz).</p>
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
    </>
  );
}
