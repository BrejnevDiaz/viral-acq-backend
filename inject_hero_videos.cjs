const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

const targetMockup = `                    <div style={{ display: 'flex', gap: 16 }}>
                       <div style={{ flex: 1, height: 120, background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))', borderRadius: 12, border: '1px solid rgba(139,92,246,0.2)' }}></div>
                       <div style={{ flex: 1, height: 120, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}></div>
                       <div style={{ flex: 1, height: 120, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}></div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.01)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', padding: 24, display: 'flex', gap: 16 }}>
                        <div style={{ width: '30%', height: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}></div>
                        <div style={{ flex: 1, height: '100%', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}></div>
                    </div>`;

const replacementMockup = `                    <div style={{ display: 'flex', gap: 16 }}>
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
                    </div>`;

if (app.includes(targetMockup)) {
   app = app.replace(targetMockup, replacementMockup);
   fs.writeFileSync('src/App.jsx', app);
   console.log('Successfully injected massive hero videos!');
} else {
   console.log('Target mockup not found!');
}
