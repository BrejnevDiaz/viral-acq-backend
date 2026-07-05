import { Link } from "react-router-dom";

export default function LandingFooter({ setAuthMode, setShowLoginModal, showLegalModal, setShowLegalModal, legalType, setLegalType, uiLang }) {
  return (
    <>
          {/* FOOTER */}
          <footer style={{ background: '#09090B', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 80, paddingBottom: 40, marginTop: 80 }}>
             <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'wrap', gap: 60, justifyContent: 'space-between', marginBottom: 80 }}>
                <div style={{ maxWidth: 300 }}>
                   <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, textDecoration: 'none' }}>
                     <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>AP</div>
                     <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Acquisition Pro</span>
                   </Link>
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
                         <Link to="/tiktok-influencers" className="hover-white" style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}>{uiLang === 'fr' ? 'Influenceurs TikTok' : uiLang === 'it' ? 'Influencer TikTok' : 'TikTok Influencers'}</Link>
                         <Link to="/coaching-elite" className="hover-white" style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}>Coaching Elite</Link>
                         <Link to="/trouvez-votre-talent" className="hover-white" style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}>{uiLang === 'fr' ? 'Trouvez votre talent' : uiLang === 'it' ? 'Trova il tuo talento' : 'Find your talent'}</Link>
                         <Link to="/matchmaking-crm" className="hover-white" style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}>Matchmaking CRM</Link>
                         <Link to="/formation-acquisition" className="hover-white" style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}>{uiLang === 'fr' ? 'Formation Acquisition' : uiLang === 'it' ? 'Corso Acquisition' : 'Acquisition Training'}</Link>
                      </div>
                   </div>

                   <div>
                      <h4 style={{ color: '#10B981', fontSize: 14, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase' }}>{uiLang === 'fr' ? 'En savoir plus' : uiLang === 'it' ? 'Scopri di più' : 'Learn More'}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                         <Link to="/meilleure-agence" className="hover-white" style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}>{uiLang === 'fr' ? 'Meilleure agence' : uiLang === 'it' ? 'Migliore agenzia' : 'Best Agency'}</Link>
                         <Link to="/strategie-virale" className="hover-white" style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}>{uiLang === 'fr' ? 'Stratégie virale' : uiLang === 'it' ? 'Strategia virale' : 'Viral Strategy'}</Link>
                         <Link to="/comment-demarrer" className="hover-white" style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}>{uiLang === 'fr' ? 'Comment démarrer ?' : uiLang === 'it' ? 'Come iniziare?' : 'How to Get Started'}</Link>
                         <Link to="/analyse-concurrence" className="hover-white" style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}>{uiLang === 'fr' ? 'Analyse de la concurrence' : uiLang === 'it' ? 'Analisi della concorrenza' : 'Competitor Analysis'}</Link>
                         <Link to="/blog-ressources" className="hover-white" style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}>{uiLang === 'fr' ? 'Blog & Ressources' : uiLang === 'it' ? 'Blog & Risorse' : 'Blog & Resources'}</Link>
                      </div>
                   </div>

                   <div>
                      <h4 style={{ color: '#8B5CF6', fontSize: 14, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase' }}>{uiLang === 'fr' ? 'Liens Pratiques (Légal)' : uiLang === 'it' ? 'Link Utili (Legale)' : 'Useful Links (Legal)'}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                         <a href="#login" onClick={(e) => { e.preventDefault(); setAuthMode('login'); setShowLoginModal(true); }} className="hover-white" style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}>{uiLang === 'fr' ? 'Connexion' : uiLang === 'it' ? 'Accedi' : 'Login'}</a>
                         <a href="#signup" onClick={(e) => { e.preventDefault(); setAuthMode('signup'); setShowLoginModal(true); }} className="hover-white" style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}>{uiLang === 'fr' ? 'Inscription' : uiLang === 'it' ? 'Iscrizione' : 'Sign Up'}</a>
                         <a href="#cgv" onClick={(e) => { e.preventDefault(); setLegalType('CGV'); setShowLegalModal(true); }} className="hover-white" style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}>{uiLang === 'fr' ? 'Conditions générales de vente (CGV)' : uiLang === 'it' ? 'Termini e Condizioni di Vendita' : 'Terms & Conditions of Sale'}</a>
                         <a href="#privacy" onClick={(e) => { e.preventDefault(); setLegalType('Privacy'); setShowLegalModal(true); }} className="hover-white" style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}>{uiLang === 'fr' ? 'Politique de confidentialité' : uiLang === 'it' ? 'Informativa sulla Privacy' : 'Privacy Policy'}</a>
                         <a href="#mentions" onClick={(e) => { e.preventDefault(); setLegalType('Legal'); setShowLegalModal(true); }} className="hover-white" style={{ color: '#A1A1AA', fontSize: 14, cursor: 'pointer', transition: 'color 0.2s' }}>{uiLang === 'fr' ? 'Mentions Légales' : uiLang === 'it' ? 'Note Legali' : 'Legal Notice'}</a>
                      </div>
                   </div>
                </div>
             </div>

             <div style={{ textAlign: 'center', color: '#71717A', fontSize: 13, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 40 }}>
                {uiLang === 'fr' ? 'Acquisition Pro by Viral Acquisition © 2026. Tous droits réservés.' : uiLang === 'it' ? 'Acquisition Pro by Viral Acquisition © 2026. Tutti i diritti riservati.' : 'Acquisition Pro by Viral Acquisition © 2026. All rights reserved.'}
             </div>
          </footer>

          {/* Legal Modal */}
          {showLegalModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#18181B', padding: 40, borderRadius: 24, width: '100%', maxWidth: 800, maxHeight: '80vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                <button onClick={() => setShowLegalModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>×</button>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 24 }}>
                  {legalType === 'CGV' ? (uiLang === 'fr' ? 'Conditions Générales de Vente' : uiLang === 'it' ? 'Termini e Condizioni di Vendita' : 'Terms & Conditions of Sale') : legalType === 'Privacy' ? (uiLang === 'fr' ? 'Politique de Confidentialité' : uiLang === 'it' ? 'Informativa sulla Privacy' : 'Privacy Policy') : (uiLang === 'fr' ? 'Mentions Légales' : uiLang === 'it' ? 'Note Legali' : 'Legal Notice')}
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
