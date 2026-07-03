export default function LandingFeatures({ setAuthMode, setShowLoginModal, uiLang }) {
  return (
    <>
          {/* Features Sections (Alternating) */}
          

          {/* ADSPY & PRODUIT GAGNANT */}
          <section id="adspy" style={{ maxWidth: 1100, margin: '120px auto 0 auto', padding: '0 24px', textAlign: 'center', position: 'relative' }}>
            <div id="produit-gagnant" style={{ position: 'absolute', top: -100 }}></div>
            <h2 className="text-mobile-h2" style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px' }}>{uiLang === 'fr' ? <>Recrutez l'élite des <span style={{ color: '#8B5CF6' }}>créateurs UGC</span> en 3 clics chrono</> : uiLang === 'it' ? <>Recluta l'élite dei <span style={{ color: '#8B5CF6' }}>creatori UGC</span> in 3 clic netti</> : <>Recruit elite <span style={{ color: '#8B5CF6' }}>UGC creators</span> in just 3 clicks</>}</h2>
            <p style={{ fontSize: 18, color: '#A1A1AA', maxWidth: 700, margin: '0 auto 48px auto', lineHeight: 1.6 }}>{uiLang === 'fr' ? "Accédez à plus de 80 millions d'annonces et d'influenceurs analysés en continu. Décryptez les tendances en temps réel, surveillez vos concurrents ligne par ligne, et lancez des campagnes taillées pour générer des ventes — ne jouez plus aux devinettes avec votre budget." : uiLang === 'it' ? "Accedi a oltre 80 milioni di annunci e influencer analizzati continuamente. Decifra le tendenze in tempo reale, spia i tuoi concorrenti e lancia campagne studiate per generare vendite — non indovinare più con il tuo budget." : "Access over 80 million ads and influencers analyzed continuously. Decode trends in real-time, monitor competitors line-by-line, and launch campaigns built to generate sales — stop guessing with your ad budget."}</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 80 }}>
                <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 30px rgba(139,92,246,0.3)' }}>{uiLang === 'fr' ? "Explorer l'AdSpy gratuitement →" : uiLang === 'it' ? "Esplora AdSpy Gratis →" : "Explore AdSpy for Free →"}</button>
            </div>
            
            {/* The Social Proof avatars under Adspy (Yomi & Austin style) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap', marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', maxWidth: 350 }}>
                   <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
                   <div>
                      <p style={{ fontSize: 13, color: '#A1A1AA', margin: '0 0 8px 0', lineHeight: 1.4 }}>{uiLang === 'fr' ? '"Acquisition Pro est mon arme secrète pour voler les stratégies gagnantes de mes concurrents et trouver mes produits viraux."' : uiLang === 'it' ? '"Acquisition Pro è la mia arma segreta per rubare le strategie vincenti ai concorrenti e trovare prodotti virali."' : '"Acquisition Pro is my secret weapon to steal winning strategies from competitors and find viral products."'}</p>
                      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>{uiLang === 'fr' ? <>Austin, <span style={{ color: '#8B5CF6' }}>+180k abonnés</span></> : uiLang === 'it' ? <>Austin, <span style={{ color: '#8B5CF6' }}>+180k iscritti</span></> : <>Austin, <span style={{ color: '#8B5CF6' }}>+180k subscribers</span></>}</div>
                   </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', maxWidth: 350 }}>
                   <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
                   <div>
                      <p style={{ fontSize: 13, color: '#A1A1AA', margin: '0 0 8px 0', lineHeight: 1.4 }}>{uiLang === 'fr' ? '"J\'utilise Acquisition Pro pour sourcer mes créateurs. En 3 clics, je trouve des influenceurs extrêmement rentables pour ma marque."' : uiLang === 'it' ? '"Uso Acquisition Pro per trovare creatori. In 3 clic, trovo influencer estremamente redditizi per il mio brand."' : '"I use Acquisition Pro to source creators. In 3 clicks, I find extremely profitable influencers for my brand."'}</p>
                      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>{uiLang === 'fr' ? <>Thomas, <span style={{ color: '#8B5CF6' }}>Marque E-com</span></> : uiLang === 'it' ? <>Thomas, <span style={{ color: '#8B5CF6' }}>Brand E-com</span></> : <>Thomas, <span style={{ color: '#8B5CF6' }}>E-com Brand</span></>}</div>
                   </div>
                </div>
            </div>
          </section>

          {/* MATCHMAKING & SOURCING SECTIONS */}
          <section id="matchmaking" style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 24px', display: 'flex', flexDirection: 'column', gap: 160, position: 'relative', zIndex: 10 }}>
            {/* Feature 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 80, justifyContent: 'space-between' }}>
              <div style={{ flex: 1, maxWidth: 450 }}>
                <h2 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.1, margin: '0 0 24px 0', letterSpacing: '-1px' }}>
                  {uiLang === 'fr' ? <>L'IA qui <span style={{ color: '#8B5CF6' }}>Recrute vos Créateurs</span> à votre Place</> : uiLang === 'it' ? <>L'IA che <span style={{ color: '#8B5CF6' }}>Recluta Creatori</span> per Te</> : <>The AI that <span style={{ color: '#8B5CF6' }}>Recruits Creators</span> for You</>}
                </h2>
                <p style={{ fontSize: 16, color: '#A1A1AA', lineHeight: 1.6, marginBottom: 32 }}>
                  {uiLang === 'fr' ? "Arrêtez de chercher, laissez notre IA faire le travail. Notre moteur analyse la niche, le véritable engagement et l'audience pour vous matcher — en quelques minutes — avec les créateurs qui feront exploser votre acquisition." : uiLang === 'it' ? "Smetti di cercare, lascia lavorare l'IA. Il nostro motore analizza nicchia e coinvolgimento per abbinarti in pochi minuti con creatori che faranno esplodere la tua acquisizione." : "Stop searching, let our AI do the work. Our engine analyzes niche, real engagement, and audience to match you — in minutes — with creators who will skyrocket your acquisition."}
                </p>
                <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{
                  background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)', color: '#fff', border: 'none',
                  padding: '12px 28px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(139,92,246,0.3)', transition: 'transform 0.2s'
                }} className="hover-lift">
                  {uiLang === 'fr' ? "Lancer le Matchmaking IA →" : uiLang === 'it' ? "Avvia il Matchmaking IA →" : "Launch AI Matchmaking →"}
                </button>
              </div>
              <div style={{ flex: 1, height: 450, background: 'linear-gradient(135deg, #18181B 0%, #09090B 100%)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                 {/* Influencer Grid Mockup */}
                 <div style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Matchmaking AI</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <span style={{ background: 'rgba(139,92,246,0.2)', color: '#A78BFA', padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 'bold' }}>Beauty</span>
                            <span style={{ background: 'rgba(255,255,255,0.1)', color: '#E4E4E7', padding: '4px 12px', borderRadius: 12, fontSize: 11 }}>Tech</span>
                        </div>
                    </div>
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {/* Influencer 1 */}
                        <div style={{ background: '#000', borderRadius: 16, position: 'relative', overflow: 'hidden', border: '1px solid rgba(139,92,246,0.3)' }}>
                            <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}>
                                <source src="https://cdn.pixabay.com/video/2021/08/13/84903-588147171_large.mp4" type="video/mp4" />
                            </video>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, background: 'linear-gradient(0deg, rgba(0,0,0,0.9), transparent)' }}>
                                <div style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>@skincare_goddess</div>
                                <div style={{ color: '#10B981', fontSize: 10, fontWeight: 'bold' }}>98% Match</div>
                            </div>
                        </div>
                        {/* Influencer 2 */}
                        <div style={{ background: '#000', borderRadius: 16, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, background: 'linear-gradient(0deg, rgba(0,0,0,0.9), transparent)' }}>
                                <div style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>@fashion_nova</div>
                                <div style={{ color: '#8B5CF6', fontSize: 10, fontWeight: 'bold' }}>85% Match</div>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Feature 2 (Reversed) */}
            <div id="sourcing-crm" style={{ paddingTop: 80 }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 80, justifyContent: 'space-between', flexDirection: 'row-reverse' }}>
              <div style={{ flex: 1, maxWidth: 450 }}>
                <h2 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.1, margin: '0 0 24px 0', letterSpacing: '-1px' }}>
                  {uiLang === 'fr' ? <>Votre <span style={{ color: '#8B5CF6' }}>Agence Marketing</span>, Intégrée au CRM</> : uiLang === 'it' ? <>La Tua <span style={{ color: '#8B5CF6' }}>Agenzia Marketing</span>, Integrata nel CRM</> : <>Your <span style={{ color: '#8B5CF6' }}>Marketing Agency</span>, Built into your CRM</>}
                </h2>
                <p style={{ fontSize: 16, color: '#A1A1AA', lineHeight: 1.6, marginBottom: 32 }}>
                  {uiLang === 'fr' ? "Gérez chaque collaboration comme une vraie agence d'élite — sans payer d'honoraires. Centralisez votre portefeuille, trackez chaque euro dépensé, et scalez le ROI de vos campagnes en temps réel pour ne plus jamais investir à l'aveugle." : uiLang === 'it' ? "Gestisci le collaborazioni come un'agenzia d'élite — senza pagarne le tariffe. Centralizza i tuoi creatori, traccia la spesa e scala il ROI delle campagne in tempo reale per non investire mai più alla cieca." : "Manage collaborations like an elite agency — without the agency fees. Centralize your portfolio, track every dollar spent, and scale campaign ROI in real-time so you never invest blindly again."}
                </p>
                <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{
                  background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)', color: '#fff', border: 'none',
                  padding: '12px 28px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(139,92,246,0.3)', transition: 'transform 0.2s'
                }} className="hover-lift">
                  {uiLang === 'fr' ? "Piloter mon CRM & Sourcing →" : uiLang === 'it' ? "Gestisci CRM & Sourcing →" : "Run my CRM & Sourcing →"}
                </button>
              </div>
              <div style={{ flex: 1, height: 450, background: 'linear-gradient(180deg, #18181B 0%, #09090B 100%)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.1)', display: 'flex', flexDirection: 'column' }}>
                 {/* Window Header */}
                 <div style={{ height: 40, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 6, background: 'rgba(0,0,0,0.4)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }}></div>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }}></div>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }}></div>
                    <div style={{ marginLeft: 16, display: 'flex', gap: 12 }}>
                        <span style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 600, borderBottom: '2px solid #8B5CF6', paddingBottom: 10, paddingTop: 10 }}>Overview</span>
                        <span style={{ fontSize: 11, color: '#71717A', fontWeight: 500, paddingTop: 10 }}>Transcript</span>
                    </div>
                 </div>
                 
                 {/* Window Body */}
                 <div style={{ flex: 1, padding: 16, display: 'flex', gap: 16 }}>
                    {/* Left: Ad Preview */}
                    <div style={{ width: 200, background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                       <div style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                           <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 'bold' }}>VA</div>
                           <div style={{ fontSize: 11, color: '#E4E4E7', fontWeight: 600 }}>Influencer Elite</div>
                       </div>
                       <div style={{ flex: 1, position: 'relative' }}>
                           <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}>
                               <source src="https://cdn.pixabay.com/video/2023/10/22/185966-876722008_tiny.mp4" type="video/mp4" />
                           </video>
                       </div>
                       <div style={{ padding: 12, background: 'rgba(255,255,255,0.02)' }}>
                           <div style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>This product is viral 🔥</div>
                           <div style={{ fontSize: 10, color: '#A1A1AA' }}>Link in bio for more details!</div>
                       </div>
                    </div>

                    {/* Right: Data Analytics */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Top Stats Row */}
                        <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '4px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', fontWeight: 'bold', fontSize: 14 }}>98%</div>
                                <div>
                                    <div style={{ fontSize: 10, color: '#A1A1AA', textTransform: 'uppercase' }}>Engagement</div>
                                    <div style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Excellent</div>
                                </div>
                            </div>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 16 }}>
                                <div style={{ fontSize: 10, color: '#A1A1AA', textTransform: 'uppercase', marginBottom: 4 }}>Total Spend</div>
                                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>$12,450</div>
                                <div style={{ fontSize: 10, color: '#10B981', marginTop: 4 }}>+14% this week</div>
                            </div>
                        </div>
                        
                        {/* Main Chart Area */}
                        <div style={{ flex: 1, background: 'rgba(139,92,246,0.03)', border: '1px solid rgba(139,92,246,0.1)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#E4E4E7' }}>Revenue Performance</div>
                                <div style={{ fontSize: 10, color: '#8B5CF6', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: 10 }}>Live</div>
                            </div>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                               {[20, 35, 25, 50, 45, 75, 60, 90, 85, 100, 95, 120].map((h, i) => (
                                  <div key={i} className="chart-bar" style={{ flex: 1, background: 'linear-gradient(180deg, #8B5CF6 0%, transparent 100%)', height: `${Math.min(h, 100)}%`, borderRadius: '4px 4px 0 0', animationDelay: `${i * 0.05}s` }}></div>
                               ))}
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
            </div>

          </section>

          
          
            {/* Feature 3 (Track Trends) */}
            <div id="shop-analyzer" style={{ paddingTop: 80 }}></div>
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 80, justifyContent: 'space-between', marginTop: 120, marginBottom: 80 }}>
              <div style={{ flex: 1, maxWidth: 500 }}>
                <h2 style={{ fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px', lineHeight: 1.2 }}>{uiLang === 'fr' ? "Espionnez les Marques qui Cartonnent — Avant Tout le Monde" : uiLang === 'it' ? "Spia i Brand che Spaccano — Prima di Tutti" : "Spy on Brands that Crush It — Before Anyone Else"}</h2>
                <p style={{ fontSize: 18, color: '#A1A1AA', lineHeight: 1.6, marginBottom: 32 }}>
                  {uiLang === 'fr' ? "Engagement, vues, top campagnes, influenceurs utilisés : disséquez la stratégie exacte de n'importe quel concurrent et copiez ce qui encaisse de l'argent — au lieu de réinventer la roue à perte." : uiLang === 'it' ? "Coinvolgimento, visualizzazioni, campagne top: seziona l'esatta strategia dei concorrenti e copia ciò che porta soldi — invece di reinventare la ruota in perdita." : "Engagement, views, top campaigns, influencers used: dissect the exact strategy of any competitor and copy what prints money — instead of reinventing the wheel at a loss."}
                </p>
                <button 
                  onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }}
                  style={{
                    background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
                    color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 12,
                    fontSize: 15, fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  className="hover-lift hover-glow-intense"
                >
                  {uiLang === 'fr' ? "Analyser une marque concurrente →" : uiLang === 'it' ? "Analizza un brand concorrente →" : "Analyze a competing brand →"}
                </button>
              </div>

              {/* 3D Bar Charts Mockup area */}
              <div style={{ flex: 1, position: 'relative', height: 400, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                 {/* Fake 3D Bars */}
                 <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, height: 300, position: 'relative', zIndex: 2 }}>
                    <div style={{ width: 60, height: 120, background: 'linear-gradient(to top, rgba(255,255,255,0.05), rgba(255,255,255,0.3))', borderRadius: '8px 8px 0 0', position: 'relative', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.5), inset 2px 0 0 rgba(255,255,255,0.2)' }}>
                       <div style={{ position: 'absolute', top: -30, left: -20, background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 'bold' }}>+12% 🚀</div>
                    </div>
                    <div style={{ width: 80, height: 250, background: 'linear-gradient(to top, rgba(139,92,246,0.1), rgba(139,92,246,0.6))', borderRadius: '8px 8px 0 0', position: 'relative', boxShadow: '0 0 30px rgba(139,92,246,0.3), inset 0 2px 0 rgba(255,255,255,0.5), inset 2px 0 0 rgba(255,255,255,0.2)' }}>
                       <div style={{ position: 'absolute', top: -40, left: -20, background: 'rgba(139, 92, 246, 0.2)', color: '#C084FC', padding: '6px 12px', borderRadius: 6, fontSize: 14, fontWeight: 'bold', whiteSpace: 'nowrap' }}>+45% d'Engagement</div>
                    </div>
                    <div style={{ width: 70, height: 180, background: 'linear-gradient(to top, rgba(255,255,255,0.05), rgba(255,255,255,0.4))', borderRadius: '8px 8px 0 0', position: 'relative', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.5), inset 2px 0 0 rgba(255,255,255,0.2)' }}>
                       <div style={{ position: 'absolute', top: 40, right: -40, width: 80, height: 80, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                          <span style={{ fontSize: 32 }}>🛍️</span>
                       </div>
                    </div>
                 </div>
                 <div style={{ position: 'absolute', bottom: -50, left: '50%', transform: 'translateX(-50%)', width: '150%', height: 150, background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(20px)', zIndex: 1 }}></div>
              </div>
            </div>

            {/* Huge Dashboard Mockup Below Feature 3 */}
            <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto 160px auto', position: 'relative', zIndex: 5 }}>
               <div style={{ 
                  background: 'linear-gradient(180deg, #18181B 0%, #09090B 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, 
                  boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 60px rgba(139,92,246,0.15)', 
                  overflow: 'hidden'
                }}>
                  {/* Fake Header */}
                  <div style={{ height: 40, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 6, background: 'rgba(0,0,0,0.4)' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }}></div>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }}></div>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }}></div>
                    <div style={{ margin: '0 auto', fontSize: 12, color: '#52525B', fontWeight: 500 }}>acquisition-pro.app/analyzer</div>
                  </div>
                  {/* Fake Content Area */}
                  <div style={{ padding: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 24 }}>
                       <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 4px 15px rgba(236,72,153,0.3)' }}>✨</div>
                       <div>
                          <div style={{ fontWeight: 800, color: '#fff', fontSize: 24 }}>Sephora France</div>
                          <div style={{ fontSize: 14, color: '#A1A1AA', display: 'flex', gap: 12 }}>
                             <span>Niche: Beauté</span>
                             <span>•</span>
                             <span><span style={{ color: '#10B981' }}>●</span> Actif (32 campagnes)</span>
                          </div>
                       </div>
                    </div>

                    <div style={{ display: 'flex', gap: 24 }}>
                       <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid rgba(255,255,255,0.03)' }}>
                           <div style={{ color: '#A1A1AA', fontSize: 13, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>Trafic & Vues TikTok</div>
                           <div style={{ fontSize: 42, fontWeight: 800, color: '#fff' }}>14.2M</div>
                           <div style={{ color: '#10B981', fontSize: 14, fontWeight: 600 }}>+ 24% vs mois dernier</div>
                           <div style={{ height: 100, marginTop: 'auto' }}>
                             <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                               <path d="M0,40 L10,30 L20,35 L30,20 L40,25 L50,10 L60,15 L70,5 L80,10 L90,0 L100,20 L100,40 Z" fill="rgba(139,92,246,0.15)" />
                               <polyline points="0,40 10,30 20,35 30,20 40,25 50,10 60,15 70,5 80,10 90,0 100,20" fill="none" stroke="#8B5CF6" strokeWidth="3" />
                             </svg>
                           </div>
                       </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, border: '1px solid rgba(255,255,255,0.03)' }}>
                           <div style={{ color: '#A1A1AA', fontSize: 13, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>Top Créateurs Engagés</div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                               <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                               <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>@lena.situations</div>
                               <div style={{ marginLeft: 'auto', fontSize: 13, color: '#10B981', fontWeight: 700, background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: 6 }}>+2.4M Vues</div>
                           </div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                               <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                               <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>@squeezie</div>
                               <div style={{ marginLeft: 'auto', fontSize: 13, color: '#10B981', fontWeight: 700, background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: 6 }}>+1.8M Vues</div>
                           </div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                               <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=100&q=80" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                               <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>@marie.lopez</div>
                               <div style={{ marginLeft: 'auto', fontSize: 13, color: '#10B981', fontWeight: 700, background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: 6 }}>+950k Vues</div>
                           </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
    </>
  );
}
