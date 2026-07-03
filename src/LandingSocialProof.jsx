export default function LandingSocialProof() {
  return (
    <>
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

<section className="p-mobile-sm" style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
            <h2 className="text-mobile-h2" style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 60, letterSpacing: '-1px' }}>Ce que les experts disent de <span style={{ color: '#8B5CF6' }}>Viral Acquisition</span></h2>
            <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 24, scrollbarWidth: 'none' }}>
               {[
                 { name: "Lucas Bivert", type: "Marque E-com", text: "Mon outil favori pour la recherche d'influenceurs, c'est Acquisition Pro. C'est devenu un indispensable pour mon équipe et moi dans notre sourcing.", img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80" },
                 { name: "Jonathan", type: "Agence", text: "J'utilise ViralAcq depuis 2024 et ça a toujours été un essentiel de mon matchmaking. Trouver les bons créateurs est devenu un jeu d'enfant.", img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80" },
                 { name: "Nawfel Ammar", type: "Créateur", text: "ViralAcq est un super outil pour les créateurs qui souhaitent trouver leur premier partenariat gagnant. Gérer ses contrats depuis une seule plateforme c'est un vrai gain de temps.", img: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80" }
               ].map((item, i) => (
                 <div key={i} style={{ flex: '0 0 350px', height: 450, borderRadius: 20, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                    <img src={item.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, background: 'linear-gradient(0deg, rgba(139,92,246,0.95) 0%, rgba(139,92,246,0.8) 50%, transparent 100%)', color: '#fff' }}>
                       <p style={{ fontSize: 14, lineHeight: 1.6, fontWeight: 600, marginBottom: 16 }}>"{item.text}"</p>
                       <div style={{ fontSize: 16, fontWeight: 800 }}>{item.name}</div>
                       <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{item.type}</div>
                    </div>
                 </div>
               ))}
            </div>
          </section>

          {/* GRID FEATURES (BENTO) */}
          <section style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#8B5CF6', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Stop aux doutes</h2>
            <h3 style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 60, letterSpacing: '-1px' }}>Recrutez ce qui marche vraiment</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
               <div style={{ background: '#111', borderRadius: 20, padding: 32, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, minHeight: 150, background: 'linear-gradient(135deg, #18181B 0%, #27272A 100%)', borderRadius: 12, marginBottom: 24, border: '1px solid rgba(139,92,246,0.2)', position: 'relative', overflow: 'hidden' }}>
                     <div style={{ position: 'absolute', top: 16, left: 16, background: '#8B5CF6', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 'bold', color: '#fff' }}>#1</div>
                     <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>10 profils gagnants par jour</h4>
                  <p style={{ fontSize: 14, color: '#A1A1AA', margin: 0 }}>Découvrez chaque jour les créateurs à plus fort potentiel de viralité.</p>
               </div>
               
               <div style={{ background: '#111', borderRadius: 20, padding: 32, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, minHeight: 150, background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(236,72,153,0.1) 100%)', borderRadius: 12, marginBottom: 24, border: '1px solid rgba(236,72,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
                        <span style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 20, fontSize: 12, color: '#fff' }}>Taux d'engagement</span>
                        <span style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 20, fontSize: 12, color: '#fff' }}>Niche</span>
                        <span style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 20, fontSize: 12, color: '#fff' }}>Localisation</span>
                     </div>
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Filtrez les audiences</h4>
                  <p style={{ fontSize: 14, color: '#A1A1AA', margin: 0 }}>Dénichez les audiences les plus rentables en un clin d'œil avec nos filtres intelligents.</p>
               </div>
               
               <div style={{ background: '#111', borderRadius: 20, padding: 32, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, minHeight: 150, background: '#18181B', borderRadius: 12, marginBottom: 24, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                     <div style={{ width: 60, height: 60, background: '#8B5CF6', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24 }}>✍️</div>
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Générez vos contrats</h4>
                  <p style={{ fontSize: 14, color: '#A1A1AA', margin: 0 }}>Transformez n'importe quel accord en contrat légal en un instant depuis le CRM.</p>
               </div>
               
               <div style={{ background: '#111', borderRadius: 20, padding: 32, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, minHeight: 150, background: 'linear-gradient(45deg, #18181B 0%, #27272A 100%)', borderRadius: 12, marginBottom: 24, border: '1px solid rgba(16,185,129,0.2)', position: 'relative', overflow: 'hidden' }}>
                     <div style={{ position: 'absolute', top: 20, left: 20, right: 20, background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, background: '#10B981', borderRadius: '50%' }}></div>
                        <div>
                           <div style={{ fontSize: 12, color: '#fff', fontWeight: 'bold' }}>Formation gratuite</div>
                           <div style={{ fontSize: 10, color: '#A1A1AA' }}>Inclus dans VIP Elite</div>
                        </div>
                     </div>
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Accède à nos offres</h4>
                  <p style={{ fontSize: 14, color: '#A1A1AA', margin: 0 }}>Profitez d'avantages exclusifs sur les outils essentiels pour réussir en influence.</p>
               </div>
            </div>
          </section>

          
            {/* FOUNDER SECTION */}
            <section style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(0,0,0,0))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 24, padding: '60px 40px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', filter: 'blur(30px)' }}></div>
                <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', filter: 'blur(30px)' }}></div>
                
                <img src="https://github.com/BrejnevDiaz.png" alt="Brejnev Diaz" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid #8B5CF6', marginBottom: 24, boxShadow: '0 10px 30px rgba(139,92,246,0.4)', position: 'relative', zIndex: 2 }} />
                
                <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8, position: 'relative', zIndex: 2 }}>Brejnev Diaz</h2>
                <div style={{ fontSize: 16, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 32, position: 'relative', zIndex: 2 }}>Fondateur de l'Agence Viral Acquisition</div>
                
                <p style={{ fontSize: 20, color: '#E4E4E7', lineHeight: 1.6, maxWidth: 700, margin: '0 auto', fontStyle: 'italic', fontWeight: 300, position: 'relative', zIndex: 2 }}>
                  "Mon objectif avec Acquisition Pro est simple : supprimer toutes les frictions entre les marques e-commerce et les créateurs de contenu. Nous ne sommes pas juste un outil d'espionnage, nous sommes le pont qui permet de nouer des partenariats ultra-rentables et de disrupter le marché de l'influence."
                </p>
              </div>
            </section>
    </>
  );
}
