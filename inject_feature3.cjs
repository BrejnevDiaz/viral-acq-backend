const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

const feature3 = `
            {/* Feature 3 (Track Trends) */}
            <div id="shop-analyzer" style={{ paddingTop: 80 }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 80, justifyContent: 'space-between', marginTop: 120, marginBottom: 80 }}>
              <div style={{ flex: 1, maxWidth: 500 }}>
                <h2 style={{ fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px', lineHeight: 1.2 }}>Trackez les marques tendances</h2>
                <p style={{ fontSize: 18, color: '#A1A1AA', lineHeight: 1.6, marginBottom: 32 }}>
                  Accédez aux infos sur l'engagement, les vues, les meilleures campagnes et les influenceurs utilisés pour reproduire les stratégies virales qui fonctionnent.
                </p>
                <button 
                  onClick={() => { setAuthMode('signup'); setAuthIntent('shopanalyzer'); setShowLoginModal(true); }}
                  style={{
                    background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
                    color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 12,
                    fontSize: 15, fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  className="hover-lift hover-glow-intense"
                >
                  Analyser une marque
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
                    <div style={{ margin: '0 auto', fontSize: 12, color: '#52525B', fontWeight: 500 }}>viralacq.app/analyzer</div>
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
`;

app = app.replace('{/* TESTIMONIALS */}', feature3 + '\n            {/* TESTIMONIALS */}');

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Successfully injected Feature 3 (Shop Analyzer / Trends Tracking)!');
