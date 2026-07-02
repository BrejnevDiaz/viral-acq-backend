const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

// FEATURE 1 MOCKUP REPLACEMENT
const f1StartStr = `<div style={{ flex: 1, height: 450, background: '#111', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>`;
const f1EndStr = `</div>
            </div>`; // Note: we have to be careful with indexing.

// It's safer to use regex or findIndex since the block is large.
let lines = app.split('\n');

let f1StartIdx = lines.findIndex(l => l.includes('L\'Adecco de l\'<span style={{ color: \'#8B5CF6\' }}>Influence Marketing</span>'));
let f1MockupStart = lines.findIndex((l, i) => i > f1StartIdx && l.includes('<div style={{ flex: 1, height: 450, background: \'#111\''));
let f1MockupEnd = lines.findIndex((l, i) => i > f1MockupStart && l.includes('</section>')); 
// Wait, the Feature 1 is before Feature 2. So f1MockupEnd should be before Feature 2.
let f2StartIdx = lines.findIndex((l, i) => i > f1MockupStart && l.includes('Pilotez vos campagnes'));
f1MockupEnd = lines.findIndex((l, i) => i > f1MockupStart && i < f2StartIdx && l === '            </div>'); // The end of the flex-row container

const newF1Mockup = `              <div style={{ flex: 1, height: 450, background: 'linear-gradient(135deg, #18181B 0%, #09090B 100%)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
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
              </div>`;

lines.splice(f1MockupStart, f1MockupEnd - f1MockupStart + 1, newF1Mockup);
app = lines.join('\n');


// FEATURE 2 MOCKUP REPLACEMENT
lines = app.split('\n');
f2StartIdx = lines.findIndex(l => l.includes('Pilotez vos campagnes'));
let f2MockupStart = lines.findIndex((l, i) => i > f2StartIdx && l.includes('<div style={{ flex: 1, height: 450, background: \'#111\''));
let f2MockupEnd = lines.findIndex((l, i) => i > f2MockupStart && l.includes('</section>'));
f2MockupEnd = lines.findIndex((l, i) => i > f2MockupStart && i < f2MockupEnd && l === '            </div>'); // End of the flex-row reversed

const newF2Mockup = `              <div style={{ flex: 1, height: 450, background: 'linear-gradient(180deg, #18181B 0%, #09090B 100%)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.1)', display: 'flex', flexDirection: 'column' }}>
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
              </div>`;

lines.splice(f2MockupStart, f2MockupEnd - f2MockupStart + 1, newF2Mockup);
app = lines.join('\n');

fs.writeFileSync('src/App.jsx', app);
console.log('Feature mockups updated beautifully!');
