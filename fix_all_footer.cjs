const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

// Add info modal state
if (!app.includes('const [showInfoModal, setShowInfoModal] = useState(false)')) {
    app = app.replace(
        'const [showLegalModal, setShowLegalModal] = useState(false);',
        'const [showLegalModal, setShowLegalModal] = useState(false);\\n  const [showInfoModal, setShowInfoModal] = useState(false);\\n  const [infoContent, setInfoContent] = useState({ title: "", text: "" });'
    );
}

// Add info modal UI
const infoModalCode = `
      {/* Info Modal */}
      {showInfoModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#18181B', padding: 40, borderRadius: 24, width: '100%', maxWidth: 600, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', textAlign: 'center' }}>
            <button onClick={() => setShowInfoModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>×</button>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🚧</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
              {infoContent.title}
            </h2>
            <p style={{ color: '#A1A1AA', lineHeight: 1.6, fontSize: 15 }}>
              Cette page est en cours de construction. Elle sera disponible très prochainement dans la version finale d'Acquisition Pro.
            </p>
            <button onClick={() => setShowInfoModal(false)} style={{ marginTop: 24, background: '#8B5CF6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Compris !</button>
          </div>
        </div>
      )}
`;

if (!app.includes(' {/* Info Modal */}')) {
    app = app.replace('{/* Legal Modal */}', infoModalCode + '\\n      {/* Legal Modal */}');
}

// Replace all external viralacquisition.it links in the footer
app = app.replace(/<a href="https:\/\/viralacquisition\.it\/" target="_blank" rel="noopener noreferrer" style=\{\{ color: '#A1A1AA', fontSize: 14 \}\}>(.*?)<\/a>/g, 
    '<a href="#info" onClick={(e) => { e.preventDefault(); setInfoContent({ title: "$1" }); setShowInfoModal(true); }} style={{ color: \\'#A1A1AA\\', fontSize: 14, cursor: \\'pointer\\' }}>$1</a>');

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Successfully added Info Modal and fixed all footer links!');
