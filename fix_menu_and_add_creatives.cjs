const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Fix the top menu to trigger signup modal
const oldNavMenu = `<div style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 500, color: '#A1A1AA' }}>
              <span style={{ cursor: 'pointer', color: '#fff' }}>Adspy</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Produit gagnant</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Sourcing CRM</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Matchmaking</span>
            </div>`;

const newNavMenu = `<div style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 500, color: '#A1A1AA' }}>
              <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', color: '#fff' }}>Adspy</span>
              <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Produit gagnant</span>
              <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Sourcing CRM</span>
              <span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Matchmaking</span>
            </div>`;

if (app.includes(oldNavMenu)) {
    app = app.replace(oldNavMenu, newNavMenu);
    console.log("Menu fixed!");
}

// 2. Expand Massive Hero Mockup to a larger grid with his face
const oldMockupContent = `<div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                       {/* Ad Card 1 */}
                       <div style={{ flex: 1, height: 150, background: '#000', borderRadius: 12, border: '1px solid rgba(139,92,246,0.3)', position: 'relative', overflow: 'hidden' }}>
                           <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}>
                               <source src="https://cdn.pixabay.com/video/2021/08/13/84903-588147171_large.mp4" type="video/mp4" />
                           </video>
                           <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '2px 6px', borderRadius: 4, fontSize: 9, color: '#fff' }}>👁 1.2M</div>
                           <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(139,92,246,0.8)', padding: '2px 6px', borderRadius: 4, fontSize: 9, color: '#fff', fontWeight: 'bold' }}>Active</div>
                       </div>
                       {/* Ad Card 2 */}
                       <div style={{ flex: 1, height: 150, background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                           <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}>
                               <source src="https://cdn.pixabay.com/video/2020/05/21/40003-424564858_small.mp4" type="video/mp4" />
                           </video>
                           <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '2px 6px', borderRadius: 4, fontSize: 9, color: '#fff' }}>👁 450K</div>
                       </div>
                       {/* Ad Card 3 */}
                       <div style={{ flex: 1, height: 150, background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                           <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}>
                               <source src="https://cdn.pixabay.com/video/2019/11/12/29252-374395079_small.mp4" type="video/mp4" />
                           </video>
                           <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '2px 6px', borderRadius: 4, fontSize: 9, color: '#fff' }}>👁 890K</div>
                       </div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.01)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', padding: 24, display: 'flex', gap: 24 }}>
                        <div style={{ width: '35%', height: '100%', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                           <div style={{ fontSize: 10, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: 1 }}>Revenus estimés</div>
                           <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>$24,500</div>
                           <div style={{ fontSize: 11, color: '#10B981' }}>+12.5% vs mois dernier</div>
                           <div style={{ marginTop: 'auto', height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: '65%', background: '#8B5CF6' }}></div>
                           </div>
                        </div>
                        <div style={{ flex: 1, height: '100%', background: 'rgba(139,92,246,0.05)', borderRadius: 8, border: '1px solid rgba(139,92,246,0.1)', padding: 16, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                           {[20, 40, 30, 60, 50, 80, 70, 90, 60, 100].map((h, i) => (
                              <div key={i} className="chart-bar" style={{ flex: 1, background: 'linear-gradient(180deg, #8B5CF6 0%, transparent 100%)', height: \`\${h}%\`, borderRadius: '4px 4px 0 0', animationDelay: \`\${i * 0.1}s\` }}></div>
                           ))}
                        </div>
                    </div>
                 </div>`;

const newMockupContent = `<div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Top Row: 4 Cards */}
                    <div style={{ display: 'flex', gap: 16, height: 160 }}>
                       {/* Ad Card 1 */}
                       <div style={{ flex: 1, background: '#000', borderRadius: 12, border: '1px solid rgba(139,92,246,0.4)', position: 'relative', overflow: 'hidden' }}>
                           <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}>
                               <source src="https://cdn.pixabay.com/video/2021/08/13/84903-588147171_large.mp4" type="video/mp4" />
                           </video>
                           <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 'bold' }}>👁 1.2M</div>
                           <div style={{ position: 'absolute', top: 8, right: 8, background: '#10B981', padding: '3px 8px', borderRadius: 4, fontSize: 9, color: '#fff', fontWeight: 'bold' }}>Active</div>
                       </div>
                       {/* Ad Card 2 */}
                       <div style={{ flex: 1, background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                           <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}>
                               <source src="https://cdn.pixabay.com/video/2020/05/21/40003-424564858_small.mp4" type="video/mp4" />
                           </video>
                           <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 'bold' }}>👁 450K</div>
                       </div>
                       {/* Ad Card 3 */}
                       <div style={{ flex: 1, background: '#000', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                           <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}>
                               <source src="https://cdn.pixabay.com/video/2019/11/12/29252-374395079_small.mp4" type="video/mp4" />
                           </video>
                           <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 'bold' }}>👁 890K</div>
                       </div>
                       {/* Ad Card 4 (THE FACE) */}
                       <div style={{ flex: 1, background: '#000', borderRadius: 12, border: '1px solid rgba(236,72,153,0.5)', position: 'relative', overflow: 'hidden', boxShadow: '0 0 20px rgba(236,72,153,0.2)' }}>
                           <img src="https://github.com/BrejnevDiaz.png" alt="Creative Face" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.95 }} />
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
                           <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}>
                               <source src="https://cdn.pixabay.com/video/2023/10/22/185966-876722008_tiny.mp4" type="video/mp4" />
                           </video>
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
                                  <div key={i} className="chart-bar" style={{ flex: 1, background: 'linear-gradient(180deg, #8B5CF6 0%, transparent 100%)', height: \`\${h}%\`, borderRadius: '4px 4px 0 0', animationDelay: \`\${i * 0.1}s\` }}></div>
                               ))}
                            </div>
                       </div>
                    </div>
                 </div>`;

if (app.includes(oldMockupContent)) {
    app = app.replace(oldMockupContent, newMockupContent);
    console.log("Mockup expanded!");
}

fs.writeFileSync('src/App.jsx', app);
