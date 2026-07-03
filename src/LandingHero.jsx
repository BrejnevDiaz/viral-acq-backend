export default function LandingHero({ uiLang, setAuthMode, setShowLoginModal }) {
  return (
    <>
          {/* Hero Section */}
          <main style={{ position: 'relative', zIndex: 10, paddingTop: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingBottom: 100 }}>
            <h1 style={{
              fontSize: 'clamp(48px, 6vw, 76px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px',
              maxWidth: 900, margin: '0 0 24px 0'
            }}>
              {uiLang === 'fr' ? <>L'Arme Secrète des<br/></> : <>The Secret Weapon for<br/></>}
              <span style={{
                background: 'linear-gradient(90deg, #a78bfa, #f472b6, #fb923c)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                display: 'inline-block', filter: 'drop-shadow(0 0 30px rgba(167,139,250,0.3))'
              }}>{uiLang === 'fr' ? "Marques qui Dominent leur Marché" : "Brands That Dominate Their Market"}</span>
            </h1>
            <p style={{
              fontSize: 18, color: '#A1A1AA', maxWidth: 650, lineHeight: 1.6, margin: '0 0 48px 0', fontWeight: 400
            }}>
              {uiLang === 'fr' ? "La plateforme d'élite réservée aux marques qui refusent la médiocrité. Espionnez les stratégies publicitaires de vos concurrents, recrutez en exclusivité les créateurs UGC les plus performants, et transformez chaque euro investi en croissance explosive — avant que vos concurrents n'y pensent." : "The elite platform built for brands that refuse to settle for average. Spy on your competitors' winning ad strategies, exclusively recruit the highest-performing UGC creators, and turn every dollar spent into explosive growth — before your competitors get there first."}
            </p>

            <div style={{ display: 'flex', gap: 16 }}>
 
                <button 
                  onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }}
                  style={{
                    background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
                    color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 12,
                    fontSize: 15, fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}
                  className="hover-lift hover-glow-intense"
                >
                  Je suis une Marque — Scaler Maintenant →
                </button>
                <button 
                  onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }}
                  style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', padding: '16px 32px', borderRadius: 12,
                    fontSize: 15, fontWeight: 600, cursor: 'pointer',
                    transition: 'background 0.2s',
                    display: 'flex', alignItems: 'center', gap: 8
                  }} 
                  className="hover-lift"
                >
                  Je suis Créateur — Rejoindre Gratuitement →
                </button>
              
            </div>

            {/* Massive Hero Mockup */}
            <div style={{
              marginTop: 80, width: '90%', maxWidth: 1100, height: 600,
              background: 'linear-gradient(180deg, #18181B 0%, #09090B 100%)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
              boxShadow: '0 30px 100px -20px rgba(0,0,0,1), 0 0 40px rgba(139,92,246,0.15)',
              overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ height: 48, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 8, background: '#111' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }}></div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }}></div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }}></div>
                <div style={{ marginLeft: 'auto', background: '#27272A', color: '#71717A', fontSize: 12, padding: '4px 12px', borderRadius: 4 }}>viralacq.app/dashboard</div>
                <div style={{ marginLeft: 'auto', width: 44 }}></div>
              </div>
              <div style={{ flex: 1, padding: 32, display: 'flex', gap: 32 }}>
                 <div style={{ width: 240, borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ width: '100%', height: 32, background: 'rgba(255,255,255,0.05)', borderRadius: 6 }}></div>
                    <div style={{ width: '80%', height: 32, background: 'rgba(255,255,255,0.02)', borderRadius: 6 }}></div>
                    <div style={{ width: '90%', height: 32, background: 'rgba(255,255,255,0.02)', borderRadius: 6 }}></div>
                 </div>
                 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Top Row: 4 Cards */}
                    <div style={{ display: 'flex', gap: 16, height: 160 }}>
                       {/* Ad Card 1 */}
                       <div style={{ flex: 1, background: '#000', borderRadius: 12, border: '1px solid rgba(139,92,246,0.4)', position: 'relative', overflow: 'hidden' }}>
                           <img src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=300&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                           <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 'bold' }}>👁 1.2M</div>
                           <div style={{ position: 'absolute', top: 8, right: 8, background: '#10B981', padding: '3px 8px', borderRadius: 4, fontSize: 9, color: '#fff', fontWeight: 'bold' }}>Active</div>
                       </div>
                       {/* Ad Card 2 */}
                       <div style={{ flex: 1, background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                           <img src="https://images.unsplash.com/photo-1512413917887-8463c6591873?auto=format&fit=crop&w=300&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                           <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 'bold' }}>👁 450K</div>
                       </div>
                       {/* Ad Card 3 */}
                       <div style={{ flex: 1, background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                           <img src="https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?auto=format&fit=crop&w=300&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                           <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 'bold' }}>👁 890K</div>
                       </div>
                       {/* Ad Card 4 (THE FACE) */}
                       <div style={{ flex: 1, background: '#000', borderRadius: 12, border: '1px solid rgba(236,72,153,0.5)', position: 'relative', overflow: 'hidden', boxShadow: '0 0 20px rgba(236,72,153,0.2)' }}>
                           <img src="/founder.jpg" alt="Creative Face" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.95 }} />
                           <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%)' }}>
                               <div style={{ fontSize: 11, fontWeight: 'bold', color: '#fff' }}>Coaching Elite</div>
                               <div style={{ fontSize: 9, color: '#EC4899' }}>Top Performer</div>
                           </div>
                       </div>
                    </div>
                    {/* Bottom Row: 2 Cards + Data */}
                    <div style={{ display: 'flex', gap: 16, height: 160 }}>
                       {/* Ad Card 5 */}
                       <div style={{ width: '22%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                           <img src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=300&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                           <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 'bold' }}>👁 320K</div>
                       </div>
                       {/* Ad Card 6 */}
                       <div style={{ width: '22%', background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                           <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80" alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                           <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 'bold' }}>👁 2.1M</div>
                       </div>
                       {/* Data Card */}
                       <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', padding: 20, display: 'flex', gap: 24 }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                               <div style={{ fontSize: 10, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: 1 }}>Revenus estimés</div>
                               <div style={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}>$48,900</div>
                               <div style={{ fontSize: 11, color: '#10B981' }}>+24.5% vs mois dernier</div>
                               <div style={{ marginTop: 'auto', height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: '85%', background: '#8B5CF6' }}></div>
                               </div>
                            </div>
                            <div style={{ flex: 1.5, background: 'rgba(139,92,246,0.05)', borderRadius: 8, border: '1px solid rgba(139,92,246,0.1)', padding: 12, display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                               {[20, 40, 30, 60, 50, 80, 70, 90, 60, 100].map((h, i) => (
                                  <div key={i} className="chart-bar" style={{ flex: 1, background: 'linear-gradient(180deg, #8B5CF6 0%, transparent 100%)', height: `${h}%`, borderRadius: '4px 4px 0 0', animationDelay: `${i * 0.1}s` }}></div>
                               ))}
                            </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </main>
    </>
  );
}
