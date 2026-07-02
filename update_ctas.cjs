const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

// Replace Hero buttons
const heroButtonsOld = `<button 
                  onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }}
                  style={{
                    background: 'linear-gradient(90deg, #8B5CF6, #EC4899, #8B5CF6)',
                    color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 12,
                    fontSize: 16, fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(236,72,153,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  className="hover-lift hover-glow-intense"
                >
                  Essayer gratuitement
                </button>
                <button style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', padding: '16px 32px', borderRadius: 12,
                  fontSize: 16, fontWeight: 600, cursor: 'pointer',
                  transition: 'background 0.2s'
                }} className="hover-lift">
                  Voir la vidéo
                </button>`;

const heroButtonsNew = `<button 
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
                  Trouver votre talent
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
                  Trouver un partenariat
                </button>`;

// If the previous exact string doesn't match perfectly, we'll use regex for hero buttons.
let startIndex = app.indexOf('<div style={{ display: \'flex\', gap: 16 }}>');
if (startIndex !== -1) {
    let buttonEndIndex = app.indexOf('</button>', app.indexOf('</button>', startIndex) + 1) + 9;
    let oldHeroButtons = app.substring(startIndex + 44, buttonEndIndex);
    app = app.replace(oldHeroButtons, '\n                ' + heroButtonsNew + '\n              ');
}

// Replace Feature 1 button
app = app.replace(
  `className="hover-lift">
                  Essayer gratuitement
                </button>`,
  `className="hover-lift">
                  Trouver votre talent
                </button>`
);

// Replace Feature 2 button (it's the 2nd one now)
app = app.replace(
  `className="hover-lift">
                  Essayer gratuitement
                </button>`,
  `className="hover-lift">
                  Trouver un talent
                </button>`
);

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('CTAs updated!');
