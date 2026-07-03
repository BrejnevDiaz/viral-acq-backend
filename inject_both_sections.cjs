const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

const inspirationSection = `
          {/* NOUVELLE SECTION : INSPIRATION MARQUES */}
          <section className="p-mobile-sm" style={{ maxWidth: 1200, margin: '100px auto', padding: '0 24px', position: 'relative' }}>
              <div className="text-center-mobile" style={{ textAlign: 'center', marginBottom: 60 }}>
                  <h2 className="text-mobile-h2" style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px' }}>Inspirez-vous des <span style={{ color: '#F43F5E' }}>géants de votre niche</span></h2>
                  <p className="text-mobile-p" style={{ color: '#A1A1AA', fontSize: 20, maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>Pourquoi réinventer la roue ? Analysez les publicités et campagnes des plus grandes marques de votre secteur et reproduisez leur succès.</p>
              </div>

              <div className="flex-col-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'center' }}>
                  
                  {/* Mockup UI Benchmark */}
                  <div className="w-full-mobile" style={{ background: '#18181B', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#F43F5E', letterSpacing: 1 }}>VEILLE CONCURRENTIELLE</div>
                          <div style={{ display: 'flex', gap: 8 }}>
                              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#3F3F46' }}></div>
                              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#3F3F46' }}></div>
                              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#3F3F46' }}></div>
                          </div>
                      </div>

                      <div style={{ background: '#09090B', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                              </div>
                              <div>
                                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Recherche par Niche</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>Tapez "Skincare", "Fitness" ou un nom de marque.</div>
                              </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                              <div style={{ height: 140, borderRadius: 12, background: 'url(https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&auto=format&fit=crop) center/cover', position: 'relative' }}>
                                 <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 6, fontSize: 10, color: '#fff', fontWeight: 700, backdropFilter: 'blur(4px)' }}>1.2M Vues</div>
                              </div>
                              <div style={{ height: 140, borderRadius: 12, background: 'url(https://images.unsplash.com/photo-1571781526291-c477ebfd024b?q=80&w=400&auto=format&fit=crop) center/cover', position: 'relative' }}>
                                 <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 6, fontSize: 10, color: '#fff', fontWeight: 700, backdropFilter: 'blur(4px)' }}>850K Vues</div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Arguments Text */}
                  <div className="w-full-mobile text-center-mobile" style={{ paddingLeft: '10%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                          <div>
                              <h3 className="text-mobile-h3" style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Décelez les tendances avant les autres</h3>
                              <p style={{ color: '#A1A1AA', fontSize: 16, lineHeight: 1.6 }}>Découvrez exactement quels formats vidéos performent pour vos concurrents. Arrêtez de deviner et basez votre créativité sur des données concrètes.</p>
                          </div>
                          
                          <div>
                              <h3 className="text-mobile-h3" style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Créez des briefs parfaits</h3>
                              <p style={{ color: '#A1A1AA', fontSize: 16, lineHeight: 1.6 }}>Sauvegardez les meilleures publicités de votre secteur dans un Moodboard et partagez-les en un clic avec vos créateurs pour leur montrer exactement ce que vous attendez.</p>
                          </div>
                          
                          <div>
                              <h3 className="text-mobile-h3" style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Adaptez les stratégies gagnantes</h3>
                              <p style={{ color: '#A1A1AA', fontSize: 16, lineHeight: 1.6 }}>Ce qui marche pour Gymshark ou Sephora peut marcher pour vous. Analysez leurs hooks (accroches), leurs appels à l'action et la durée de leurs vidéos.</p>
                          </div>
                      </div>
                  </div>

              </div>
          </section>
`;

const creatorSection = `
          {/* SECTION CRÉATEURS / INFLUENCEURS */}
          <section className="p-mobile-sm" style={{ maxWidth: 1200, margin: '100px auto', padding: '0 24px', position: 'relative' }}>
              <div className="flex-col-mobile" style={{ display: 'flex', gap: 60, alignItems: 'center', background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(0,0,0,0))', borderRadius: 32, padding: 60, border: '1px solid rgba(16,185,129,0.1)', position: 'relative', overflow: 'hidden' }}>
                  
                  {/* Background Glow */}
                  <div style={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, background: 'rgba(16,185,129,0.15)', filter: 'blur(80px)', borderRadius: '50%' }}></div>

                  {/* Left: Text & Benefits */}
                  <div className="w-full-mobile text-center-mobile" style={{ flex: 1, zIndex: 10 }}>
                      <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(16,185,129,0.1)', color: '#10B981', borderRadius: 20, fontSize: 14, fontWeight: 700, marginBottom: 24, border: '1px solid rgba(16,185,129,0.2)' }}>ESPACE CRÉATEURS & UGC</div>
                      <h2 className="text-mobile-h2" style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px', lineHeight: 1.1 }}>Monétisez votre audience. <br/><span style={{ color: '#10B981' }}>Zéro commission.</span></h2>
                      <p className="text-mobile-p" style={{ color: '#A1A1AA', fontSize: 18, marginBottom: 40, lineHeight: 1.6 }}>Rejoignez le réseau privé d'Acquisition Pro et laissez notre IA vous connecter directement avec les meilleures marques de votre niche. Fini les négociations interminables.</p>
                      
                      <div className="text-left-mobile" style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
                          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0, marginTop: 4 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <div style={{ textAlign: 'left' }}>
                                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Matchmaking Automatique</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>Notre IA analyse votre profil et vous propose des marques dont l'ADN correspond parfaitement au vôtre.</div>
                              </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0, marginTop: 4 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <div style={{ textAlign: 'left' }}>
                                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Paiements 100% Sécurisés</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>La marque paie en amont sur un compte séquestre. Vous êtes garanti d'être payé dès la livraison de la vidéo.</div>
                              </div>
                          </div>

                          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0, marginTop: 4 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <div style={{ textAlign: 'left' }}>
                                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Zéro frais pour les créateurs</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>Vous gardez 100% de vos revenus. Ce sont les marques qui paient l'abonnement au logiciel.</div>
                              </div>
                          </div>
                      </div>
                      
                      <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} className="hover-lift" style={{ background: '#10B981', color: '#000', border: 'none', padding: '16px 32px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 30px rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: 12, margin: '0 auto' }}>
                          Devenir Créateur Partenaire
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </button>
                  </div>

                  {/* Right: Visual Mockup */}
                  <div className="w-full-mobile hide-mobile" style={{ flex: 1, position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center' }}>
                      <div style={{ width: '100%', maxWidth: 400, background: '#18181B', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', padding: 24, boxShadow: '0 30px 60px rgba(0,0,0,0.6)', position: 'relative' }}>
                          
                          {/* Fake Notification Badge */}
                          <div style={{ position: 'absolute', top: -20, right: -20, background: '#10B981', color: '#000', padding: '12px 20px', borderRadius: 16, fontWeight: 800, fontSize: 14, boxShadow: '0 10px 20px rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: 10, animation: 'pulseHeight 2s infinite alternate' }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                              +850 € Reçu
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                              <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} alt="Creator" />
                              <div>
                                  <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>Sarah D.</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>Créatrice UGC & Beauté</div>
                              </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                                  <div style={{ color: '#A1A1AA', fontSize: 12, textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>Taux d'engagement</div>
                                  <div style={{ color: '#10B981', fontSize: 24, fontWeight: 800 }}>8.4%</div>
                              </div>
                              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                                  <div style={{ color: '#A1A1AA', fontSize: 12, textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>Collabs réussies</div>
                                  <div style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>34</div>
                              </div>
                          </div>

                          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: 16, borderRadius: 12 }}>
                              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Nouvelle proposition reçue</div>
                              <div style={{ color: '#A1A1AA', fontSize: 13, marginBottom: 12 }}>La marque Sephora souhaite collaborer avec vous pour une vidéo TikTok.</div>
                              <div style={{ display: 'flex', gap: 8 }}>
                                  <div style={{ background: '#10B981', color: '#000', padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>Accepter</div>
                                  <div style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>Voir le brief</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
`;

if (!app.includes("ESPACE CRÉATEURS & UGC")) {
    const targetString = "Ce que les experts disent de <span style={{ color: '#8B5CF6' }}>Acquisition Pro</span></h2>";
    
    // Find the exact `<section>` tag that starts the experts section to inject right before it
    const expertsIndex = app.indexOf(targetString);
    if (expertsIndex !== -1) {
        // Search backwards for the `<section>` tag
        const sectionStart = app.lastIndexOf("<section", expertsIndex);
        
        if (sectionStart !== -1) {
            const before = app.substring(0, sectionStart);
            const after = app.substring(sectionStart);
            
            const newApp = before + creatorSection + "\n" + inspirationSection + "\n" + after;
            fs.writeFileSync('src/App.jsx', newApp, 'utf8');
            console.log('Successfully injected Creator and Inspiration sections!');
        } else {
            console.log('Could not find section tag for experts');
        }
    } else {
        console.log('Could not find experts target string');
    }
} else {
    console.log('Sections already exist');
}
