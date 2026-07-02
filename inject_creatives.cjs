const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

// Replace 1: Video Ad Mockup
const target1 = `<div style={{ width: '100%', height: 200, background: 'rgba(255,255,255,0.02)', borderRadius: 12, marginBottom: 16 }}></div>`;
const replacement1 = `
<div style={{ width: '100%', height: 200, background: '#000', borderRadius: 12, marginBottom: 16, overflow: 'hidden', position: 'relative', border: '1px solid rgba(139,92,246,0.3)' }}>
  <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}>
    <source src="https://cdn.pixabay.com/video/2021/08/13/84903-588147171_large.mp4" type="video/mp4" />
  </video>
  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 50%)', pointerEvents: 'none' }}></div>
  <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
     <div style={{ display: 'flex', gap: 6 }}>
       <div style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 6, fontSize: 10, color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>👁 1.2M</div>
       <div style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 6, fontSize: 10, color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>+450% ROI</div>
     </div>
     <div style={{ background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 'bold', color: '#fff', boxShadow: '0 0 10px rgba(139,92,246,0.5)' }}>Acheter</div>
  </div>
</div>
`;
app = app.replace(target1, replacement1);

// Replace 2: Animated Chart Mockup
const target2 = `<div style={{ width: '100%', height: 100, background: 'rgba(139,92,246,0.1)', borderRadius: 8, marginBottom: 16 }}></div>`;
const replacement2 = `
<div style={{ width: '100%', height: 100, background: 'rgba(139,92,246,0.05)', borderRadius: 8, marginBottom: 16, display: 'flex', alignItems: 'flex-end', padding: '10px 10px 0 10px', gap: 6, border: '1px solid rgba(139,92,246,0.1)' }}>
   {[40, 60, 45, 80, 50, 90, 70, 100].map((h, i) => (
      <div key={i} className="chart-bar" style={{ flex: 1, background: 'linear-gradient(180deg, #8B5CF6 0%, transparent 100%)', height: \`\${h}%\`, borderRadius: '4px 4px 0 0', animationDelay: \`\${i * 0.1}s\` }}></div>
   ))}
</div>
`;
app = app.replace(target2, replacement2);

fs.writeFileSync('src/App.jsx', app);
console.log('Injected animated creatives!');
