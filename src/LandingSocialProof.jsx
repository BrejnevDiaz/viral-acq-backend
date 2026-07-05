import { L } from "./landingTheme";

export default function LandingSocialProof({ setAuthMode, setShowLoginModal, openAuthWithIntent, uiLang }) {
  return (
    <>
          {/* NOUVELLE SECTION : INSPIRATION MARQUES */}
          <section className="p-mobile-sm" style={{ maxWidth: 1200, margin: '100px auto', padding: '0 24px', position: 'relative' }}>
              <div className="text-center-mobile" style={{ textAlign: 'center', marginBottom: 60 }}>
                  <h2 className="text-mobile-h2" style={{ fontSize: 48, fontWeight: 800, color: L.text, marginBottom: 24, letterSpacing: '-1px' }}>{uiLang === 'fr' ? <>Volez les Stratégies des <span style={{ color: '#F43F5E' }}>Géants de votre Niche</span></> : uiLang === 'it' ? <>Ruba le Strategie dei <span style={{ color: '#F43F5E' }}>Giganti della tua Nicchia</span></> : <>Steal Strategies from the <span style={{ color: '#F43F5E' }}>Giants of your Niche</span></>}</h2>
                  <p className="text-mobile-p" style={{ color: L.textMuted, fontSize: 20, maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>{uiLang === 'fr' ? "Pourquoi payer le prix de vos propres erreurs ? Disséquez les publicités des plus grandes marques de votre secteur, et copiez leur succès dès votre premier lancement." : uiLang === 'it' ? "Perché pagare il prezzo dei tuoi errori? Seziona le pubblicità dei più grandi brand del tuo settore e copia il loro successo fin dal primo lancio." : "Why pay the price of your own mistakes? Dissect the ads of the biggest brands in your industry, and copy their success from your very first launch."}</p>
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
                              <div style={{ height: 140, borderRadius: 12, background: 'url(https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=400&auto=format&fit=crop) center/cover', position: 'relative' }}>
                                 <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 6, fontSize: 10, color: '#fff', fontWeight: 700, backdropFilter: 'blur(4px)' }}>1.2M Vues</div>
                              </div>
                              <div style={{ height: 140, borderRadius: 12, background: 'url(https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400&auto=format&fit=crop) center/cover', position: 'relative' }}>
                                 <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 6, fontSize: 10, color: '#fff', fontWeight: 700, backdropFilter: 'blur(4px)' }}>850K Vues</div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Arguments Text */}
                  <div className="w-full-mobile text-center-mobile" style={{ paddingLeft: '10%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                          <div>
                              <h3 className="text-mobile-h3" style={{ fontSize: 24, fontWeight: 800, color: L.text, marginBottom: 12 }}>{uiLang === 'fr' ? 'Décelez les Tendances Avant Tout le Monde' : uiLang === 'it' ? 'Individua le Tendenze Prima di Tutti' : 'Spot Trends Before Anyone Else'}</h3>
                              <p style={{ color: L.textMuted, fontSize: 16, lineHeight: 1.6 }}>{uiLang === 'fr' ? "Découvrez exactement quelles publicités crachent du cash pour vos concurrents. Arrêtez de brûler votre budget et basez votre créativité sur ce qui convertit déjà." : uiLang === 'it' ? "Scopri esattamente quali pubblicità generano profitti per i tuoi concorrenti. Smetti di bruciare budget e basa la creatività su ciò che converte già." : "Discover exactly which ads print money for your competitors. Stop burning ad spend and base your creative on what already converts."}</p>
                          </div>
                          
                          <div>
                              <h3 className="text-mobile-h3" style={{ fontSize: 24, fontWeight: 800, color: L.text, marginBottom: 12 }}>{uiLang === 'fr' ? 'Créez des Briefs Irréprochables en 2 Minutes' : uiLang === 'it' ? 'Crea Brief Perfetti in 2 Minuti' : 'Create Flawless Briefs in 2 Minutes'}</h3>
                              <p style={{ color: L.textMuted, fontSize: 16, lineHeight: 1.6 }}>{uiLang === 'fr' ? "Sauvegardez les meilleures publicités dans un Moodboard et partagez-les en un clic à vos créateurs pour obtenir des vidéos qui performent." : uiLang === 'it' ? "Salva le migliori pubblicità in un Moodboard e condividile in un clic con i creatori per ottenere video ad alte prestazioni." : "Save the best ads in a Moodboard and share them in one click with your creators to get high-performing videos."}</p>
                          </div>
                          
                          <div>
                              <h3 className="text-mobile-h3" style={{ fontSize: 24, fontWeight: 800, color: L.text, marginBottom: 12 }}>{uiLang === 'fr' ? 'Copiez les Stratégies qui Génèrent des Millions de Vues' : uiLang === 'it' ? 'Copia le Strategie che Generano Milioni di Visualizzazioni' : 'Copy the Strategies Generating Millions of Views'}</h3>
                              <p style={{ color: L.textMuted, fontSize: 16, lineHeight: 1.6 }}>{uiLang === 'fr' ? "Ce qui marche pour les leaders marchera pour vous. Hacker légalement leurs hooks, leurs appels à l'action et la structure de leurs vidéos." : uiLang === 'it' ? "Quello che funziona per i leader funzionerà per te. Hackera legalmente i loro hook, le CTA e la struttura dei video." : "What works for the leaders will work for you. Legally hack their hooks, calls to action, and video structure."}</p>
                          </div>
                          <button onClick={() => openAuthWithIntent('adspy')} style={{
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
            <h2 className="text-mobile-h2" style={{ fontSize: 48, fontWeight: 800, color: L.text, marginBottom: 60, letterSpacing: '-1px' }}>{uiLang === 'fr' ? <>Ce que l'élite dit d'<span style={{ color: '#8B5CF6' }}>Acquisition Pro</span></> : uiLang === 'it' ? <>Cosa dice l'élite di <span style={{ color: '#8B5CF6' }}>Acquisition Pro</span></> : <>What the elite say about <span style={{ color: '#8B5CF6' }}>Acquisition Pro</span></>}</h2>
            <div className="testimonial-marquee" style={{ overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)' }}>
               <div className="testimonial-track" style={{ display: 'flex', gap: 24, width: 'max-content', paddingBottom: 24 }}>
               {(() => {
                 const testimonials = [
                   { name: "Lucas Bivert", type: uiLang === 'fr' ? "Marque E-com" : uiLang === 'it' ? "Brand E-com" : "E-com Brand", text: uiLang === 'fr' ? "L'arme absolue pour sourcer des influenceurs ultra-rentables. C'est devenu le moteur de croissance principal pour nos marques." : uiLang === 'it' ? "L'arma assoluta per trovare influencer ultra-redditizi. È diventato il motore di crescita principale per i nostri brand." : "The absolute weapon for sourcing ultra-profitable influencers. It has become the main growth engine for our brands.", img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80" },
                   { name: "Jonathan", type: uiLang === 'fr' ? "Agence" : uiLang === 'it' ? "Agenzia" : "Agency", text: uiLang === 'fr' ? "On a divisé par 10 notre temps de sourcing créateurs avec Acquisition Pro. Le ROI de nos campagnes UGC a littéralement explosé." : uiLang === 'it' ? "Abbiamo diviso per 10 il tempo di ricerca creatori. Il ROI delle nostre campagne UGC è letteralmente esploso." : "We cut our creator sourcing time by 10x. The ROI of our UGC campaigns has literally exploded.", img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80" },
                   { name: "Nawfel Ammar", type: uiLang === 'fr' ? "Créateur" : uiLang === 'it' ? "Creator" : "Creator", text: uiLang === 'fr' ? "Le seul réseau où les marques paient réellement ce que tu vaux. Plus besoin de négocier pendant des semaines pour un contrat, tout est fluide." : uiLang === 'it' ? "L'unica rete in cui i brand ti pagano davvero per quanto vali. Niente più lunghe negoziazioni, è tutto fluido." : "The only network where brands actually pay what you're worth. No more negotiating for weeks, everything is seamless.", img: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80" },
                   { name: "Sarah Chen", type: "CEO, Beauty Brand", text: uiLang === 'fr' ? "En tant que CEO, je regarde le ROI avant tout. Acquisition Pro est le seul outil qui m'a montré des chiffres concrets dès le premier mois." : uiLang === 'it' ? "Da CEO, guardo prima di tutto il ROI. Acquisition Pro è l'unico strumento che mi ha mostrato numeri concreti già dal primo mese." : "As a CEO, I look at ROI before anything else. Acquisition Pro is the only tool that showed me concrete numbers within the first month.", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80" },
                   { name: "Marion Dubois", type: uiLang === 'fr' ? "Influenceuse Lifestyle" : uiLang === 'it' ? "Influencer Lifestyle" : "Lifestyle Influencer", text: uiLang === 'fr' ? "Fini les DM ignorés et les tarifs cassés. Les marques qui me contactent ici savent déjà ce qu'elles veulent et paient en conséquence." : uiLang === 'it' ? "Basta DM ignorati e tariffe stracciate. I brand che mi contattano qui sanno già cosa vogliono e pagano di conseguenza." : "No more ignored DMs or lowball offers. Brands that reach out here already know what they want and pay accordingly.", img: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=400&q=80" },
                   { name: "Thiago Rossi", type: uiLang === 'fr' ? "Créateur UGC" : uiLang === 'it' ? "Creator UGC" : "UGC Creator", text: uiLang === 'fr' ? "La Marketplace Vidéo a changé mon quotidien : je poste, les marques négocient directement en DM, et je suis payé sans intermédiaire." : uiLang === 'it' ? "Il Marketplace Video ha cambiato la mia quotidianità: pubblico, i brand negoziano direttamente in DM, e vengo pagato senza intermediari." : "The Video Marketplace changed my day-to-day: I post, brands negotiate directly in DM, and I get paid with no middleman.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" },
                   { name: "Amélie Laurent", type: uiLang === 'fr' ? "Directrice Marketing" : uiLang === 'it' ? "Direttrice Marketing" : "Marketing Director", text: uiLang === 'fr' ? "L'AdSpy à lui seul justifie l'abonnement. On a arrêté de deviner nos créas et on copie ce qui marche déjà chez les leaders." : uiLang === 'it' ? "L'AdSpy da solo giustifica l'abbonamento. Abbiamo smesso di indovinare le creatività e copiamo ciò che già funziona per i leader." : "AdSpy alone justifies the subscription. We stopped guessing our creatives and now copy what already works for market leaders.", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80" },
                   { name: "Karim Belkacem", type: uiLang === 'fr' ? "Fondateur, Dropshipping" : uiLang === 'it' ? "Fondatore, Dropshipping" : "Founder, Dropshipping", text: uiLang === 'fr' ? "Le forfait Plus est taillé pour le dropshipping : je trouve mes produits gagnants sur l'AdSpy avant tout le monde, chaque semaine." : uiLang === 'it' ? "Il piano Plus è tagliato su misura per il dropshipping: trovo i miei prodotti vincenti sull'AdSpy prima di tutti, ogni settimana." : "The Plus plan is built for dropshipping: I find my winning products on AdSpy before everyone else, every single week.", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80" },
                 ];
                 return [...testimonials, ...testimonials].map((item, i) => (
                   <div key={i} className="hover-card-dark" style={{ flex: '0 0 350px', height: 450, borderRadius: 20, position: 'relative', overflow: 'hidden', border: `1px solid ${L.border}`, textAlign: 'left' }}>
                      <img src={item.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, background: 'linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)', color: '#fff' }}>
                         <p style={{ fontSize: 14, lineHeight: 1.6, fontWeight: 600, marginBottom: 16 }}>"{item.text}"</p>
                         <div style={{ fontSize: 16, fontWeight: 800 }}>{item.name}</div>
                         <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{item.type}</div>
                      </div>
                   </div>
                 ));
               })()}
               </div>
            </div>
          </section>

          <style>{`
            .testimonial-track { animation: testimonialScroll 55s linear infinite; }
            .testimonial-marquee:hover .testimonial-track { animation-play-state: paused; }
            @keyframes testimonialScroll {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            .radar-beam { animation: radarSpin 6s linear infinite; transform-origin: 50% 50%; }
            @keyframes radarSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .radar-blip { animation: radarBlipPulse 2.4s ease-in-out infinite; }
            @keyframes radarBlipPulse {
              0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.55); }
              50% { box-shadow: 0 0 0 10px rgba(16,185,129,0); }
            }
          `}</style>

          {/* CONVICTION BANNER — anti-guesswork proof section */}
          <section style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px 100px', textAlign: 'center' }}>
            <div style={{
              background: `linear-gradient(135deg, rgba(139,92,246,0.08), ${L.surface})`,
              border: '1px solid rgba(139,92,246,0.25)', borderRadius: 28, padding: '0 40px 72px',
              position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
            }}>
              <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 400, height: 200, background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)', filter: 'blur(40px)' }}></div>

              {/* Scanning radar — dedicated header zone, tilted upward like a dish scanning down.
                  Boxed + overflow:hidden so it can never overlap the headline/text below. */}
              <div style={{ position: 'relative', height: 340, overflow: 'hidden', marginBottom: -12 }}>
                <div style={{ position: 'absolute', top: -380, left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, maxWidth: '160vw', borderRadius: '50%', opacity: 0.85, pointerEvents: 'none' }}>
                  {[1, 0.75, 0.5, 0.25].map((s, i) => (
                    <div key={i} style={{ position: 'absolute', top: `${(1 - s) * 50}%`, left: `${(1 - s) * 50}%`, width: `${s * 100}%`, height: `${s * 100}%`, borderRadius: '50%', border: '1px solid rgba(139,92,246,0.45)' }} />
                  ))}
                  <div className="radar-beam" style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, rgba(139,92,246,0.55), rgba(139,92,246,0.1) 20%, transparent 35%)'
                  }} />
                  {[
                    { img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80", x: 91.4, y: 57.3 },
                    { img: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=100&q=80", x: 85.2, y: 72.9 },
                    { img: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=100&q=80", x: 73.5, y: 84.8 },
                    { img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80", x: 58.0, y: 91.2 },
                    { img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&q=80", x: 42.0, y: 91.2 },
                    { img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=100&q=80", x: 26.5, y: 84.8 },
                    { img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80", x: 14.8, y: 72.9 },
                    { img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80", x: 8.6, y: 57.3 },
                  ].map((blip, i) => (
                    <div key={i} className="radar-blip" style={{
                      position: 'absolute', top: `${blip.y}%`, left: `${blip.x}%`, transform: 'translate(-50%, -50%)',
                      width: 52, height: 52, borderRadius: '50%', overflow: 'hidden',
                      border: '2px solid rgba(16,185,129,0.7)', animationDelay: `${i * 0.4}s`
                    }}>
                      <img src={blip.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>

              <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: L.text, lineHeight: 1.15, letterSpacing: '-1px', maxWidth: 780, margin: '0 auto 20px', position: 'relative', zIndex: 2 }}>
                {uiLang === 'fr' ? <>Stop au Recrutement à l'Instinct.<br/>Ne Signez Qu'avec des Créateurs qui <span style={{ background: 'linear-gradient(90deg, #7c3aed, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Performent Déjà</span>.</>
                 : uiLang === 'it' ? <>Basta Recruiting a Istinto.<br/>Firma Solo Creator che <span style={{ background: 'linear-gradient(90deg, #7c3aed, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Già Performano</span>.</>
                 : <>Stop Guessing.<br/>Only Sign Creators Who <span style={{ background: 'linear-gradient(90deg, #7c3aed, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Already Perform</span>.</>}
              </h2>
              <p style={{ fontSize: 17, color: L.textMuted, maxWidth: 620, margin: '0 auto 40px', lineHeight: 1.6, position: 'relative', zIndex: 2 }}>
                {uiLang === 'fr' ? "Chaque profil de notre réseau est passé au crible par notre IA de Vetting : Trust Score sur 100, taux d'engagement vérifié, détection des faux abonnés. Vous ne recrutez plus au hasard — vous recrutez avec des preuves." : uiLang === 'it' ? "Ogni profilo della nostra rete viene analizzato dal nostro motore di Vetting IA: Trust Score su 100, tasso di engagement verificato, rilevamento dei falsi follower. Non recluti più alla cieca — recluti con prove." : "Every profile in our network is screened by our AI Vetting engine: a Trust Score out of 100, verified engagement rate, fake-follower detection. You're no longer recruiting blind — you're recruiting with proof."}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 44, position: 'relative', zIndex: 2 }}>
                {[
                  { icon: "🛡️", label: { fr: "Trust Score /100 par profil", it: "Trust Score /100 a profilo", en: "Trust Score /100 per profile" } },
                  { icon: "📈", label: { fr: "Taux d'engagement vérifié", it: "Tasso di engagement verificato", en: "Verified engagement rate" } },
                  { icon: "🚫", label: { fr: "Détection anti-faux abonnés", it: "Rilevamento falsi follower", en: "Fake-follower detection" } },
                  { icon: "📊", label: { fr: "Historique de performance", it: "Storico delle performance", en: "Performance history" } },
                ].map((chip, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: L.bgAlt, border: `1px solid ${L.borderStrong}`, borderRadius: 30, fontSize: 13.5, fontWeight: 600, color: L.text }}>
                    <span>{chip.icon}</span>{chip.label[uiLang] || chip.label.fr}
                  </span>
                ))}
              </div>

              <button onClick={() => openAuthWithIntent('vetting')} style={{
                background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', color: '#fff', border: 'none',
                padding: '16px 36px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(139,92,246,0.35)', position: 'relative', zIndex: 2
              }} className="hover-lift hover-glow-intense">
                {uiLang === 'fr' ? 'Recruter avec Certitude →' : uiLang === 'it' ? 'Recluta con Certezza →' : 'Recruit with Certainty →'}
              </button>
            </div>
          </section>

          {/* GRID FEATURES (BENTO) */}
          <section style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#8B5CF6', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{uiLang === 'fr' ? 'Fini le Recrutement au Hasard' : uiLang === 'it' ? 'Basta Reclutamento a Caso' : 'No More Guessing'}</h2>
            <h3 style={{ fontSize: 48, fontWeight: 800, color: L.text, marginBottom: 60, letterSpacing: '-1px' }}>{uiLang === 'fr' ? 'Recrutez Uniquement ce qui Convertit' : uiLang === 'it' ? 'Recluta Solo Ciò Che Converte' : 'Recruit Only What Converts'}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
               {[
                 {
                   badge: "#1", badgeColor: "#8B5CF6",
                   img: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=500&q=80",
                   title: { fr: "10 profils gagnants par jour", it: "10 profili vincenti al giorno", en: "10 winning profiles daily" },
                   desc: { fr: "Découvrez chaque jour les créateurs à plus fort potentiel de rentabilité.", it: "Scopri ogni giorno i creatori con il più alto potenziale di redditività.", en: "Discover the creators with the highest profit potential every day." }
                 },
                 {
                   badge: "IA", badgeColor: "#EC4899",
                   img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80",
                   title: { fr: "Filtrez les audiences", it: "Filtra le audience", en: "Filter audiences" },
                   desc: { fr: "Ciblez chirurgicalement les audiences prêtes à acheter grâce à nos filtres IA exclusifs.", it: "Colpisci chirurgicamente il pubblico pronto a comprare grazie ai nostri filtri IA.", en: "Surgically target ready-to-buy audiences with our exclusive AI filters." }
                 },
                 {
                   badge: "🔒", badgeColor: "#10B981",
                   img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500&q=80",
                   title: { fr: "Générez vos contrats", it: "Genera i tuoi contratti", en: "Generate contracts" },
                   desc: { fr: "Verrouillez juridiquement chaque partenariat en un clic directement depuis votre CRM.", it: "Blocca legalmente ogni partnership con un clic direttamente dal CRM.", en: "Legally lock in every partnership in one click directly from your CRM." }
                 },
                 {
                   badge: "🎓", badgeColor: "#F59E0B",
                   img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=80",
                   title: { fr: "Accédez à nos offres", it: "Accedi alle nostre offerte", en: "Access our offers" },
                   desc: { fr: "Débloquez l'arsenal complet VIP Pro & Elite pour écraser la concurrence sur votre marché.", it: "Sblocca l'arsenale completo VIP Pro & Elite per distruggere la concorrenza.", en: "Unlock the full VIP Pro & Elite arsenal to crush the competition in your market." }
                 },
                 {
                   badge: "AdSpy", badgeColor: "#8B5CF6",
                   img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=500&q=80",
                   title: { fr: "Espionnez les pubs qui cartonnent", it: "Spia le ads che sfondano", en: "Spy on ads that are crushing it" },
                   desc: { fr: "Repérez en temps réel les publicités les plus rentables de vos concurrents et copiez ce qui marche déjà.", it: "Individua in tempo reale le pubblicità più redditizie dei tuoi concorrenti e copia ciò che già funziona.", en: "Spot your competitors' most profitable ads in real time and copy what's already working." }
                 },
                 {
                   badge: "UGC", badgeColor: "#EC4899",
                   img: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=500&q=80",
                   title: { fr: "Achetez du contenu prêt à poster", it: "Compra contenuti pronti da pubblicare", en: "Buy content that's ready to post" },
                   desc: { fr: "Parcourez la Marketplace Vidéo, négociez en DM avec les créateurs et achetez leur UGC en un clic.", it: "Sfoglia il Marketplace Video, negozia in DM con i creator e acquista il loro UGC in un clic.", en: "Browse the Video Marketplace, negotiate in DM with creators, and buy their UGC in one click." }
                 },
               ].map((card, i) => (
                 <div key={i} className="hover-card-dark" style={{ background: '#111', borderRadius: 20, padding: 32, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, minHeight: 150, borderRadius: 12, marginBottom: 24, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                       <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 2, background: card.badgeColor, padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 'bold', color: '#fff' }}>{card.badge}</div>
                       <img src={card.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h4 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{card.title[uiLang] || card.title.fr}</h4>
                    <p style={{ fontSize: 14, color: '#A1A1AA', margin: 0 }}>{card.desc[uiLang] || card.desc.fr}</p>
                 </div>
               ))}
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
              <div style={{ background: `linear-gradient(135deg, rgba(139,92,246,0.07), ${L.surface})`, border: '1px solid rgba(139,92,246,0.22)', borderRadius: 24, padding: '60px 40px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', filter: 'blur(30px)' }}></div>
                <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)', filter: 'blur(30px)' }}></div>

                <img src="/founder.jpg" alt="Brejnev Diaz" style={{ width: 140, height: 140, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(139,92,246,0.5)', marginBottom: 24, boxShadow: '0 20px 50px rgba(139,92,246,0.25), 0 0 0 8px rgba(139,92,246,0.08)', position: 'relative', zIndex: 2 }} />

                <h2 style={{ fontSize: 32, fontWeight: 800, color: L.text, marginBottom: 8, position: 'relative', zIndex: 2 }}>Brejnev Diaz</h2>
                <div style={{ fontSize: 16, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 32, position: 'relative', zIndex: 2 }}>{uiLang === 'fr' ? "Fondateur de Viral Acquisition — Créateur d'Acquisition Pro" : uiLang === 'it' ? "Fondatore di Viral Acquisition — Creatore di Acquisition Pro" : "Founder of Viral Acquisition — Creator of Acquisition Pro"}</div>

                <p style={{ fontSize: 20, color: L.textMuted, lineHeight: 1.6, maxWidth: 700, margin: '0 auto', fontStyle: 'italic', fontWeight: 300, position: 'relative', zIndex: 2 }}>
                  {uiLang === 'fr' ? '"Ma mission avec Acquisition Pro est radicale : détruire toutes les frictions entre les marques ambitieuses et les top créateurs. Nous ne sommes pas un simple outil, nous sommes la machine de guerre qui vous permet de scaler vos partenariats ultra-rentables."' : uiLang === 'it' ? '"La mia missione con Acquisition Pro è radicale: distruggere ogni attrito tra brand ambiziosi e top creator. Non siamo un semplice strumento, siamo la macchina da guerra per scalare le tue partnership ultra-redditizie."' : '"My mission with Acquisition Pro is radical: destroy all friction between ambitious brands and top creators. We are not just a tool, we are the war machine that lets you scale ultra-profitable partnerships."'}
                </p>
              </div>
            </section>
    </>
  );
}
