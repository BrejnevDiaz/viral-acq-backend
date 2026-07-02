const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

// I will just use regex to remove the corrupted character: Y" and any other weird characters from "This product is viral"
app = app.replace(/This product is viral .*/g, "This product is viral 🔥</div>");

// Let's replace the whole Features section from `<section style={{ maxWidth: 1100...` up to `</section>` with a perfectly balanced version.
// First, extract the content.
let startIdx = app.indexOf("<section style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 24px'");
let endIdx = app.indexOf("          {/* Auth Modal overlay");
if (startIdx !== -1 && endIdx !== -1) {
    let before = app.substring(0, startIdx);
    let after = app.substring(endIdx);
    
    // Construct the correct section
    let newSection = `          <section style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 24px', display: 'flex', flexDirection: 'column', gap: 160, position: 'relative', zIndex: 10 }}>
            {/* Feature 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 80, justifyContent: 'space-between' }}>
              <div style={{ flex: 1, maxWidth: 450 }}>
                <h2 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.1, margin: '0 0 24px 0', letterSpacing: '-1px' }}>
                  L'Agence de l'<span style={{ color: '#8B5CF6' }}>Influence Marketing</span>
                </h2>
                <p style={{ fontSize: 16, color: '#A1A1AA', lineHeight: 1.6, marginBottom: 32 }}>
                  Recrutez instantanément les créateurs de contenu parfaits pour votre marque. Notre système de Matchmaking avancé filtre par niche, engagement et audience pour vous connecter avec les influenceurs qui génèrent une acquisition virale massive.
                </p>
                <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{
                  background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)', color: '#fff', border: 'none',
                  padding: '12px 28px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(139,92,246,0.3)', transition: 'transform 0.2s'
                }} className="hover-lift">
                  Essayer gratuitement
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 80, justifyContent: 'space-between', flexDirection: 'row-reverse' }}>
              <div style={{ flex: 1, maxWidth: 450 }}>
                <h2 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.1, margin: '0 0 24px 0', letterSpacing: '-1px' }}>
                  Pilotez vos campagnes et votre <span style={{ color: '#8B5CF6' }}>Sourcing CRM</span>
                </h2>
                <p style={{ fontSize: 16, color: '#A1A1AA', lineHeight: 1.6, marginBottom: 32 }}>
                  Une véritable agence de marketing entre vos mains. Gérez votre portefeuille d'influenceurs via notre CRM, suivez les budgets alloués et analysez le ROI de chaque campagne pour optimiser votre rentabilité en temps réel.
                </p>
                <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{
                  background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)', color: '#fff', border: 'none',
                  padding: '12px 28px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(139,92,246,0.3)', transition: 'transform 0.2s'
                }} className="hover-lift">
                  Essayer gratuitement
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
                                  <div key={i} className="chart-bar" style={{ flex: 1, background: 'linear-gradient(180deg, #8B5CF6 0%, transparent 100%)', height: \`\${Math.min(h, 100)}%\`, borderRadius: '4px 4px 0 0', animationDelay: \`\${i * 0.05}s\` }}></div>
                               ))}
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
            </div>

          </section>

`;
    
    // Also remove the "Adecco" from the Hero Text while we're at it.
    before = before.replace("le véritable Adecco de l'influence", "votre vivier d'influenceurs sur-mesure");
    
    app = before + newSection + after;
    fs.writeFileSync('src/App.jsx', app, 'utf8');
    console.log("Completely repaired the sections!");
} else {
    console.log("Could not find the bounds!");
}
