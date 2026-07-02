const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

const newSections = `
          {/* TESTIMONIALS */}
          <section style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 60, letterSpacing: '-1px' }}>Ce que les experts disent de <span style={{ color: '#8B5CF6' }}>ViralAcquisition</span></h2>
            <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 24, scrollbarWidth: 'none' }}>
               {[
                 { name: "Lucas Bivert", type: "Marque E-com", text: "Mon outil favori pour la recherche d'influenceurs, c'est ViralAcquisition. C'est devenu un indispensable pour mon équipe et moi dans notre sourcing.", img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80" },
                 { name: "Jonathan", type: "Agence", text: "J'utilise ViralAcq depuis 2024 et ça a toujours été un essentiel de mon matchmaking. Trouver les bons créateurs est devenu un jeu d'enfant.", img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80" },
                 { name: "Nawfel Ammar", type: "Créateur", text: "ViralAcq est un super outil pour les créateurs qui souhaitent trouver leur premier partenariat gagnant. Gérer ses contrats depuis une seule plateforme c'est un vrai gain de temps.", img: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80" }
               ].map((t, i) => (
                 <div key={i} style={{ flex: '0 0 350px', height: 450, borderRadius: 20, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                    <img src={t.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, background: 'linear-gradient(0deg, rgba(139,92,246,0.95) 0%, rgba(139,92,246,0.8) 50%, transparent 100%)', color: '#fff' }}>
                       <p style={{ fontSize: 14, lineHeight: 1.6, fontWeight: 600, marginBottom: 16 }}>"{t.text}"</p>
                       <div style={{ fontSize: 16, fontWeight: 800 }}>{t.name}</div>
                       <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{t.type}</div>
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

          {/* FAQ */}
          <section style={{ background: 'linear-gradient(180deg, rgba(139,92,246,0.15) 0%, transparent 100%)', padding: '120px 24px' }}>
             <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <h2 style={{ fontSize: 42, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 60, letterSpacing: '-1px' }}>Nous répondons à vos questions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                   {[
                     "À quoi sert ViralAcquisition ?",
                     "L'abonnement est-il sans engagement ?",
                     "Comment annuler mon abonnement ?",
                     "Comment fonctionne le Matchmaking ?",
                     "Quelle est la différence entre VIP Pro et VIP Elite ?"
                   ].map((q, i) => (
                      <details key={i} style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                         <summary style={{ padding: 24, fontSize: 16, fontWeight: 600, color: '#E4E4E7', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {q}
                            <span style={{ color: '#8B5CF6', fontSize: 24 }}>›</span>
                         </summary>
                         <div style={{ padding: '0 24px 24px 24px', color: '#A1A1AA', fontSize: 15, lineHeight: 1.6 }}>
                            ViralAcquisition est la plateforme ultime pour connecter les marques et les influenceurs. Notre technologie analyse des milliers de données pour garantir le partenariat le plus rentable.
                         </div>
                      </details>
                   ))}
                </div>
             </div>
          </section>

          {/* ACADEMY FORMATION */}
          <section style={{ maxWidth: 1100, margin: '100px auto', position: 'relative', padding: '0 24px' }}>
             <div style={{ background: '#111', borderRadius: 32, padding: 60, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 60, overflow: 'hidden', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}>
                {/* Background Glow */}
                <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'rgba(236,72,153,0.2)', filter: 'blur(100px)', borderRadius: '50%' }}></div>
                
                <div style={{ flex: 1, zIndex: 10 }}>
                   <h2 style={{ fontSize: 24, color: '#EC4899', fontWeight: 800, marginBottom: 16 }}>Apprends à lancer ta première campagne</h2>
                   <h3 style={{ fontSize: 48, color: '#fff', fontWeight: 800, lineHeight: 1.1, marginBottom: 32, letterSpacing: '-1px' }}>Accède à une formation de +10h gratuitement</h3>
                   <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{
                     background: 'linear-gradient(90deg, #EC4899, #8B5CF6)', color: '#fff', border: 'none',
                     padding: '16px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer',
                     boxShadow: '0 10px 30px rgba(236,72,153,0.3)', transition: 'transform 0.2s'
                   }} className="hover-lift">
                     Commencer la formation
                   </button>
                </div>
                
                <div style={{ flex: 1, zIndex: 10, position: 'relative' }}>
                   <div style={{ background: '#18181B', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                      <h4 style={{ color: '#fff', fontSize: 18, marginBottom: 24 }}>Sommaire</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                         {[
                           { t: "À regarder avant de se lancer", dur: "12m 34s", p: 100 },
                           { t: "Tout savoir sur le Matchmaking", dur: "30m 22s", p: 60 },
                           { t: "La méthode Virale", dur: "9m 15s", p: 0 },
                           { t: "Décrypter l'engagement TikTok", dur: "25m 47s", p: 0 }
                         ].map((v, i) => (
                           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                              <div style={{ width: 24, height: 24, borderRadius: '50%', background: v.p === 100 ? '#10B981' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>{v.p === 100 ? '✓' : ''}</div>
                              <div style={{ width: 60, height: 40, background: '#27272A', borderRadius: 8, position: 'relative' }}>
                                 <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #fff' }}></div>
                              </div>
                              <div style={{ flex: 1 }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontSize: 13, color: '#E4E4E7', fontWeight: 600 }}>{v.t}</span>
                                    <span style={{ fontSize: 11, color: '#A1A1AA' }}>{v.dur}</span>
                                 </div>
                                 <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                                    <div style={{ width: \`\${v.p}%\`, height: '100%', background: '#EC4899' }}></div>
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </section>

          {/* FOOTER */}
          <footer style={{ background: '#09090B', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 80, paddingBottom: 40, marginTop: 80 }}>
             <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'wrap', gap: 60, justifyContent: 'space-between', marginBottom: 80 }}>
                <div style={{ maxWidth: 300 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                     <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>VA</div>
                     <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>ViralAcquisition</span>
                   </div>
                   <p style={{ color: '#A1A1AA', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>L'ultime plateforme de matchmaking et d'acquisition marketing pour marques et créateurs.</p>
                   <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>in</div>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>IG</div>
                   </div>
                </div>

                <div style={{ display: 'flex', gap: 80, flexWrap: 'wrap' }}>
                   <div>
                      <h4 style={{ color: '#EC4899', fontSize: 14, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase' }}>Découvrez</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                         <a href="#" style={{ color: '#A1A1AA', fontSize: 14 }}>Influenceurs TikTok</a>
                         <a href="#" style={{ color: '#A1A1AA', fontSize: 14 }}>Coaching Elite</a>
                         <a href="#" style={{ color: '#A1A1AA', fontSize: 14 }}>Trouvez votre talent</a>
                         <a href="#" style={{ color: '#A1A1AA', fontSize: 14 }}>Matchmaking CRM</a>
                         <a href="#" style={{ color: '#A1A1AA', fontSize: 14 }}>Formation Acquisition</a>
                      </div>
                   </div>

                   <div>
                      <h4 style={{ color: '#10B981', fontSize: 14, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase' }}>En savoir plus</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                         <a href="#" style={{ color: '#A1A1AA', fontSize: 14 }}>Meilleure agence</a>
                         <a href="#" style={{ color: '#A1A1AA', fontSize: 14 }}>Stratégie virale</a>
                         <a href="#" style={{ color: '#A1A1AA', fontSize: 14 }}>Comment démarrer ?</a>
                         <a href="#" style={{ color: '#A1A1AA', fontSize: 14 }}>Analyse de la concurrence</a>
                         <a href="#" style={{ color: '#A1A1AA', fontSize: 14 }}>Blog & Ressources</a>
                      </div>
                   </div>

                   <div>
                      <h4 style={{ color: '#8B5CF6', fontSize: 14, fontWeight: 700, marginBottom: 24, textTransform: 'uppercase' }}>Liens Pratiques (Légal)</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                         <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('login'); setShowLoginModal(true); }} style={{ color: '#A1A1AA', fontSize: 14 }}>Connexion</a>
                         <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('signup'); setShowLoginModal(true); }} style={{ color: '#A1A1AA', fontSize: 14 }}>Inscription</a>
                         <a href="#" style={{ color: '#A1A1AA', fontSize: 14 }}>Conditions générales de vente (CGV)</a>
                         <a href="#" style={{ color: '#A1A1AA', fontSize: 14 }}>Politique de confidentialité</a>
                         <a href="#" style={{ color: '#A1A1AA', fontSize: 14 }}>Mentions Légales</a>
                      </div>
                   </div>
                </div>
             </div>
             
             <div style={{ textAlign: 'center', color: '#71717A', fontSize: 13, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 40 }}>
                ViralAcquisition © 2026. Tous droits réservés.
             </div>
          </footer>
`;

// Insert right before the Auth Modal
let targetStr = '{/* Auth Modal overlay (Glassmorphism) */}';
if (app.includes(targetStr)) {
    app = app.replace(targetStr, newSections + '\n          ' + targetStr);
    fs.writeFileSync('src/App.jsx', app, 'utf8');
    console.log('Successfully injected all missing sections (Testimonials, Bento, FAQ, Academy, Footer)!');
} else {
    console.log('Could not find Auth Modal string to inject before.');
}
