export default function LandingCreators({ setAuthMode, setShowLoginModal, uiLang }) {
  return (
    <>
          {/* SECTION CRÉATEURS / INFLUENCEURS */}
          <section className="p-mobile-sm" style={{ maxWidth: 1200, margin: '100px auto', padding: '0 24px', position: 'relative' }}>
              <div className="flex-col-mobile" style={{ display: 'flex', gap: 60, alignItems: 'center', background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(0,0,0,0))', borderRadius: 32, padding: 60, border: '1px solid rgba(16,185,129,0.1)', position: 'relative', overflow: 'hidden' }}>
                  
                  {/* Background Glow */}
                  <div style={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, background: 'rgba(16,185,129,0.15)', filter: 'blur(80px)', borderRadius: '50%' }}></div>

                  {/* Left: Text & Benefits */}
                  <div className="w-full-mobile text-center-mobile" style={{ flex: 1, zIndex: 10 }}>
                      <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(16,185,129,0.1)', color: '#10B981', borderRadius: 20, fontSize: 14, fontWeight: 700, marginBottom: 24, border: '1px solid rgba(16,185,129,0.2)' }}>{uiLang === 'fr' ? 'ESPACE CRÉATEURS & UGC' : 'CREATORS & UGC HUB'}</div>
                      <h2 className="text-mobile-h2" style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px', lineHeight: 1.1 }}>{uiLang === 'fr' ? 'Monétisez votre audience. ' : 'Monetize your audience. '}<br/><span style={{ color: '#10B981' }}>{uiLang === 'fr' ? 'Sans intermédiaire, sans commission.' : 'No middleman, zero commission.'}</span></h2>
                      <p className="text-mobile-p" style={{ color: '#A1A1AA', fontSize: 18, marginBottom: 40, lineHeight: 1.6 }}>{uiLang === 'fr' ? "Rejoignez le réseau privé et sélectif d'Acquisition Pro : notre IA vous connecte directement avec les marques les plus solvables de votre niche — sans DM à rallonge, sans négociations interminables, sans intermédiaire qui prend sa part." : "Join Acquisition Pro's private, curated creator network: our AI connects you directly with the best-paying brands in your niche — no endless DMs, no drawn-out negotiations, no middleman taking a cut."}</p>
                      
                      <div className="text-left-mobile" style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
                          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0, marginTop: 4 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <div style={{ textAlign: 'left' }}>
                                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{uiLang === 'fr' ? 'Matchmaking Automatique' : 'Automatic Matchmaking'}</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>{uiLang === 'fr' ? "Notre IA analyse votre profil et vous propose des marques dont l'ADN correspond parfaitement au vôtre." : "Our AI analyzes your profile and suggests brands whose DNA perfectly matches yours."}</div>
                              </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0, marginTop: 4 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <div style={{ textAlign: 'left' }}>
                                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{uiLang === 'fr' ? 'Paiements 100% Sécurisés' : '100% Secure Payments'}</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>{uiLang === 'fr' ? "La marque paie en amont sur un compte séquestre. Vous êtes garanti d'être payé dès la livraison de la vidéo." : "The brand pays upfront into an escrow account. You are guaranteed to be paid upon delivery of the video."}</div>
                              </div>
                          </div>

                          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0, marginTop: 4 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <div style={{ textAlign: 'left' }}>
                                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{uiLang === 'fr' ? 'Zéro frais pour les créateurs' : 'Zero fees for creators'}</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>{uiLang === 'fr' ? "Vous gardez 100% de vos revenus. Ce sont les marques qui paient l'abonnement au logiciel." : "You keep 100% of your earnings. The brands pay the software subscription."}</div>
                              </div>
                          </div>
                      </div>
                      
                      <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} className="hover-lift" style={{ background: '#10B981', color: '#000', border: 'none', padding: '16px 32px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 30px rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: 12, margin: '0 auto' }}>
                          {uiLang === 'fr' ? 'Rejoindre le Réseau — 100% Gratuit' : 'Join the Network — 100% Free'}
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </button>
                  </div>

                  {/* Right: Visual Mockup */}
                  <div className="w-full-mobile hide-mobile" style={{ flex: 1, position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center' }}>
                      <div style={{ width: '100%', maxWidth: 400, background: '#18181B', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', padding: 24, boxShadow: '0 30px 60px rgba(0,0,0,0.6)', position: 'relative' }}>
                          
                          {/* Fake Notification Badge */}
                          <div style={{ position: 'absolute', top: -20, right: -20, background: '#10B981', color: '#000', padding: '12px 20px', borderRadius: 16, fontWeight: 800, fontSize: 14, boxShadow: '0 10px 20px rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: 10, animation: 'pulseHeight 2s infinite alternate' }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                              {uiLang === 'fr' ? '+850 € Reçu' : '+850 € Received'}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                              <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} alt="Creator" />
                              <div>
                                  <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>Sarah D.</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>{uiLang === 'fr' ? 'Créatrice UGC & Beauté' : 'UGC & Beauty Creator'}</div>
                              </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                                  <div style={{ color: '#A1A1AA', fontSize: 12, textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>{uiLang === 'fr' ? "Taux d'engagement" : "Engagement Rate"}</div>
                                  <div style={{ color: '#10B981', fontSize: 24, fontWeight: 800 }}>8.4%</div>
                              </div>
                              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                                  <div style={{ color: '#A1A1AA', fontSize: 12, textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>{uiLang === 'fr' ? 'Collabs réussies' : 'Successful Collabs'}</div>
                                  <div style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>34</div>
                              </div>
                          </div>

                          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: 16, borderRadius: 12 }}>
                              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{uiLang === 'fr' ? 'Nouvelle proposition reçue' : 'New proposal received'}</div>
                              <div style={{ color: '#A1A1AA', fontSize: 13, marginBottom: 12 }}>{uiLang === 'fr' ? "La marque Sephora souhaite collaborer avec vous pour une vidéo TikTok." : "The brand Sephora wants to collaborate with you for a TikTok video."}</div>
                              <div style={{ display: 'flex', gap: 8 }}>
                                  <div style={{ background: '#10B981', color: '#000', padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>{uiLang === 'fr' ? 'Accepter' : 'Accept'}</div>
                                  <div style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>{uiLang === 'fr' ? 'Voir le brief' : 'View Brief'}</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
    </>
  );
}
