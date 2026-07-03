export default function LandingSocialProof({ setAuthMode, setShowLoginModal, uiLang }) {
  return (
    <>
          {/* NOUVELLE SECTION : INSPIRATION MARQUES */}
          <section className="p-mobile-sm" style={{ maxWidth: 1200, margin: '100px auto', padding: '0 24px', position: 'relative' }}>
              <div className="text-center-mobile" style={{ textAlign: 'center', marginBottom: 60 }}>
                  <h2 className="text-mobile-h2" style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px' }}>{uiLang === 'fr' ? <>Volez les Stratégies des <span style={{ color: '#F43F5E' }}>Géants de votre Niche</span></> : uiLang === 'it' ? <>Ruba le Strategie dei <span style={{ color: '#F43F5E' }}>Giganti della tua Nicchia</span></> : <>Steal Strategies from the <span style={{ color: '#F43F5E' }}>Giants of your Niche</span></>}</h2>
                  <p className="text-mobile-p" style={{ color: '#A1A1AA', fontSize: 20, maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>{uiLang === 'fr' ? "Pourquoi payer le prix de vos propres erreurs ? Disséquez les publicités des plus grandes marques de votre secteur, et copiez leur succès dès votre premier lancement." : uiLang === 'it' ? "Perché pagare il prezzo dei tuoi errori? Seziona le pubblicità dei più grandi brand del tuo settore e copia il loro successo fin dal primo lancio." : "Why pay the price of your own mistakes? Dissect the ads of the biggest brands in your industry, and copy their success from your very first launch."}</p>
              </div>

              <div className="flex-col-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'center' }}>
                  
                  {/* Mockup UI Benchmark */}
                  <div className="w-full-mobile" style={{ background: '#18181B', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#F43F5E', letterSpacing: 1 }}>{uiLang === 'fr' ? 'VEILLE CONCURRENTIELLE' : uiLang === 'it' ? 'ANALISI COMPETITIVA' : 'COMPETITIVE INTELLIGENCE'}</div>
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
                                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{uiLang === 'fr' ? 'Recherche par Niche' : uiLang === 'it' ? 'Ricerca per Nicchia' : 'Niche Search'}</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>{uiLang === 'fr' ? 'Tapez "Skincare", "Fitness" ou un nom de marque.' : uiLang === 'it' ? 'Cerca "Skincare", "Fitness" o un brand.' : 'Search "Skincare", "Fitness" or a brand name.'}</div>
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
                              <h3 className="text-mobile-h3" style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>{uiLang === 'fr' ? 'Décelez les Tendances Avant Tout le Monde' : uiLang === 'it' ? 'Individua le Tendenze Prima di Tutti' : 'Spot Trends Before Anyone Else'}</h3>
                              <p style={{ color: '#A1A1AA', fontSize: 16, lineHeight: 1.6 }}>{uiLang === 'fr' ? "Découvrez exactement quelles publicités crachent du cash pour vos concurrents. Arrêtez de brûler votre budget et basez votre créativité sur ce qui convertit déjà." : uiLang === 'it' ? "Scopri esattamente quali pubblicità generano profitti per i tuoi concorrenti. Smetti di bruciare budget e basa la creatività su ciò che converte già." : "Discover exactly which ads print money for your competitors. Stop burning ad spend and base your creative on what already converts."}</p>
                          </div>
                          
                          <div>
                              <h3 className="text-mobile-h3" style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>{uiLang === 'fr' ? 'Créez des Briefs Irréprochables en 2 Minutes' : uiLang === 'it' ? 'Crea Brief Perfetti in 2 Minuti' : 'Create Flawless Briefs in 2 Minutes'}</h3>
                              <p style={{ color: '#A1A1AA', fontSize: 16, lineHeight: 1.6 }}>{uiLang === 'fr' ? "Sauvegardez les meilleures publicités dans un Moodboard et partagez-les en un clic à vos créateurs pour obtenir des vidéos qui performent." : uiLang === 'it' ? "Salva le migliori pubblicità in un Moodboard e condividile in un clic con i creatori per ottenere video ad alte prestazioni." : "Save the best ads in a Moodboard and share them in one click with your creators to get high-performing videos."}</p>
                          </div>
                          
                          <div>
                              <h3 className="text-mobile-h3" style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>{uiLang === 'fr' ? 'Copiez les Stratégies qui Génèrent des Millions de Vues' : uiLang === 'it' ? 'Copia le Strategie che Generano Milioni di Visualizzazioni' : 'Copy the Strategies Generating Millions of Views'}</h3>
                              <p style={{ color: '#A1A1AA', fontSize: 16, lineHeight: 1.6 }}>{uiLang === 'fr' ? "Ce qui marche pour les leaders marchera pour vous. Hacker légalement leurs hooks, leurs appels à l'action et la structure de leurs vidéos." : uiLang === 'it' ? "Quello che funziona per i leader funzionerà per te. Hackera legalmente i loro hook, le CTA e la struttura dei video." : "What works for the leaders will work for you. Legally hack their hooks, calls to action, and video structure."}</p>
                          </div>
                          <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{
                            background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', color: '#fff', border: 'none',
                            padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 8px 25px rgba(139,92,246,0.3)', marginTop: 8, alignSelf: 'flex-start'
                          }} className="hover-lift">
                            {uiLang === 'fr' ? 'Espionner mes concurrents →' : uiLang === 'it' ? 'Spia i miei concorrenti →' : 'Spy on my competitors →'}
                          </button>
                      </div>
                  </div>

              </div>
          </section>

<section className="p-mobile-sm" style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
            <h2 className="text-mobile-h2" style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 60, letterSpacing: '-1px' }}>{uiLang === 'fr' ? <>Ce que l'élite dit d'<span style={{ color: '#8B5CF6' }}>Acquisition Pro</span></> : uiLang === 'it' ? <>Cosa dice l'élite di <span style={{ color: '#8B5CF6' }}>Acquisition Pro</span></> : <>What the elite say about <span style={{ color: '#8B5CF6' }}>Acquisition Pro</span></>}</h2>
            <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 24, scrollbarWidth: 'none' }}>
               {[
                 { name: "Lucas Bivert", type: "Marque E-com", text: uiLang === 'fr' ? "L'arme absolue pour sourcer des influenceurs ultra-rentables. C'est devenu le moteur de croissance principal pour nos marques." : uiLang === 'it' ? "L'arma assoluta per trovare influencer ultra-redditizi. È diventato il motore di crescita principale per i nostri brand." : "The absolute weapon for sourcing ultra-profitable influencers. It has become the main growth engine for our brands.", img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80" },
                 { name: "Jonathan", type: "Agence", text: uiLang === 'fr' ? "On a divisé par 10 notre temps de sourcing créateurs avec Acquisition Pro. Le ROI de nos campagnes UGC a littéralement explosé." : uiLang === 'it' ? "Abbiamo diviso per 10 il tempo di ricerca creatori. Il ROI delle nostre campagne UGC è letteralmente esploso." : "We cut our creator sourcing time by 10x. The ROI of our UGC campaigns has literally exploded.", img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80" },
                 { name: "Nawfel Ammar", type: "Créateur", text: uiLang === 'fr' ? "Le seul réseau où les marques paient réellement ce que tu vaux. Plus besoin de négocier pendant des semaines pour un contrat, tout est fluide." : uiLang === 'it' ? "L'unica rete in cui i brand ti pagano davvero per quanto vali. Niente più lunghe negoziazioni, è tutto fluido." : "The only network where brands actually pay what you're worth. No more negotiating for weeks, everything is seamless.", img: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80" }
               ].map((item, i) => (
                 <div key={i} style={{ flex: '0 0 350px', height: 450, borderRadius: 20, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                    <img src={item.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, background: 'linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)', color: '#fff' }}>
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
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#8B5CF6', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{uiLang === 'fr' ? 'Fini le Recrutement au Hasard' : uiLang === 'it' ? 'Basta Reclutamento a Caso' : 'No More Guessing'}</h2>
            <h3 style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 60, letterSpacing: '-1px' }}>{uiLang === 'fr' ? 'Recrutez Uniquement ce qui Convertit' : uiLang === 'it' ? 'Recluta Solo Ciò Che Converte' : 'Recruit Only What Converts'}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
               <div style={{ background: '#111', borderRadius: 20, padding: 32, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, minHeight: 150, background: 'linear-gradient(135deg, #18181B 0%, #27272A 100%)', borderRadius: 12, marginBottom: 24, border: '1px solid rgba(139,92,246,0.2)', position: 'relative', overflow: 'hidden' }}>
                     <div style={{ position: 'absolute', top: 16, left: 16, background: '#8B5CF6', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 'bold', color: '#fff' }}>#1</div>
                     <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{uiLang === 'fr' ? '10 profils gagnants par jour' : uiLang === 'it' ? '10 profili vincenti al giorno' : '10 winning profiles daily'}</h4>
                  <p style={{ fontSize: 14, color: '#A1A1AA', margin: 0 }}>{uiLang === 'fr' ? 'Découvrez chaque jour les créateurs à plus fort potentiel de rentabilité.' : uiLang === 'it' ? 'Scopri ogni giorno i creatori con il più alto potenziale di redditività.' : 'Discover the creators with the highest profit potential every day.'}</p>
               </div>
               
               <div style={{ background: '#111', borderRadius: 20, padding: 32, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, minHeight: 150, background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(236,72,153,0.1) 100%)', borderRadius: 12, marginBottom: 24, border: '1px solid rgba(236,72,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
                        <span style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 20, fontSize: 12, color: '#fff' }}>Taux d'engagement</span>
                        <span style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 20, fontSize: 12, color: '#fff' }}>Niche</span>
                        <span style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 20, fontSize: 12, color: '#fff' }}>Localisation</span>
                     </div>
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{uiLang === 'fr' ? 'Filtrez les audiences' : uiLang === 'it' ? 'Filtra le audience' : 'Filter audiences'}</h4>
                  <p style={{ fontSize: 14, color: '#A1A1AA', margin: 0 }}>{uiLang === 'fr' ? "Ciblez chirurgicalement les audiences prêtes à acheter grâce à nos filtres IA exclusifs." : uiLang === 'it' ? "Colpisci chirurgicamente il pubblico pronto a comprare grazie ai nostri filtri IA." : "Surgically target ready-to-buy audiences with our exclusive AI filters."}</p>
               </div>
               
               <div style={{ background: '#111', borderRadius: 20, padding: 32, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, minHeight: 150, background: '#18181B', borderRadius: 12, marginBottom: 24, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                     <div style={{ width: 60, height: 60, background: '#8B5CF6', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24 }}>✍️</div>
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{uiLang === 'fr' ? 'Générez vos contrats' : uiLang === 'it' ? 'Genera i tuoi contratti' : 'Generate contracts'}</h4>
                  <p style={{ fontSize: 14, color: '#A1A1AA', margin: 0 }}>{uiLang === 'fr' ? "Verrouillez juridiquement chaque partenariat en un clic directement depuis votre CRM." : uiLang === 'it' ? "Blocca legalmente ogni partnership con un clic direttamente dal CRM." : "Legally lock in every partnership in one click directly from your CRM."}</p>
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
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{uiLang === 'fr' ? 'Accédez à nos offres' : uiLang === 'it' ? 'Accedi alle nostre offerte' : 'Access our offers'}</h4>
                  <p style={{ fontSize: 14, color: '#A1A1AA', margin: 0 }}>{uiLang === 'fr' ? "Débloquez l'arsenal complet VIP Pro & Elite pour écraser la concurrence sur votre marché." : uiLang === 'it' ? "Sblocca l'arsenale completo VIP Pro & Elite per distruggere la concorrenza." : "Unlock the full VIP Pro & Elite arsenal to crush the competition in your market."}</p>
               </div>
            </div>
            <div style={{ marginTop: 48 }}>
              <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{
                background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', color: '#fff', border: 'none',
                padding: '16px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(139,92,246,0.3)'
              }} className="hover-lift hover-glow-intense">
                {uiLang === 'fr' ? 'Accéder à toutes les fonctionnalités →' : uiLang === 'it' ? 'Accedi a tutte le funzionalità →' : 'Access all features →'}
              </button>
            </div>
          </section>

          
            {/* FOUNDER SECTION */}
            <section style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(0,0,0,0))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 24, padding: '60px 40px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', filter: 'blur(30px)' }}></div>
                <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', filter: 'blur(30px)' }}></div>
                
                <img src="https://github.com/BrejnevDiaz.png" alt="Brejnev Diaz" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid #8B5CF6', marginBottom: 24, boxShadow: '0 10px 30px rgba(139,92,246,0.4)', position: 'relative', zIndex: 2 }} />
                
                <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8, position: 'relative', zIndex: 2 }}>Brejnev Diaz</h2>
                <div style={{ fontSize: 16, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 32, position: 'relative', zIndex: 2 }}>{uiLang === 'fr' ? "Fondateur de l'Agence Acquisition Pro" : uiLang === 'it' ? "Fondatore dell'Agenzia Acquisition Pro" : "Founder of Acquisition Pro Agency"}</div>
                
                <p style={{ fontSize: 20, color: '#E4E4E7', lineHeight: 1.6, maxWidth: 700, margin: '0 auto', fontStyle: 'italic', fontWeight: 300, position: 'relative', zIndex: 2 }}>
                  {uiLang === 'fr' ? '"Ma mission avec Acquisition Pro est radicale : détruire toutes les frictions entre les marques ambitieuses et les top créateurs. Nous ne sommes pas un simple outil, nous sommes la machine de guerre qui vous permet de scaler vos partenariats ultra-rentables."' : uiLang === 'it' ? '"La mia missione con Acquisition Pro è radicale: distruggere ogni attrito tra brand ambiziosi e top creator. Non siamo un semplice strumento, siamo la macchina da guerra per scalare le tue partnership ultra-redditizie."' : '"My mission with Acquisition Pro is radical: destroy all friction between ambitious brands and top creators. We are not just a tool, we are the war machine that lets you scale ultra-profitable partnerships."'}
                </p>
              </div>
            </section>
    </>
  );
}
