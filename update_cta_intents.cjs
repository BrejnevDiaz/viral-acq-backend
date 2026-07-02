const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add authIntent state
if (!app.includes('const [authIntent, setAuthIntent] = useState')) {
    app = app.replace(
        'const [showLoginModal, setShowLoginModal] = useState(false);',
        'const [showLoginModal, setShowLoginModal] = useState(false);\n  const [authIntent, setAuthIntent] = useState("");'
    );
}

// 2. Add redirect logic inside authStateChange
const oldAuthChange = `    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        setUserId(session.user.id);
        fetchUserData(session.user.id);
      }
    });`;

const newAuthChange = `    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        setUserId(session.user.id);
        fetchUserData(session.user.id);
        // Navigate based on intent
        setAuthIntent(currentIntent => {
            if (currentIntent) setCurrentTab(currentIntent);
            return "";
        });
      }
    });`;

app = app.replace(oldAuthChange, newAuthChange);

// 3. Update bypass logic to also use authIntent
const bypassOld = `      if (emailInput === "brejnevdiaz@gmail.com" && passInput === "B1ss0u@k1") {
        // Bypass total des sécurités Supabase pour le propriétaire
        setIsLoggedIn(true);
        setUserRole("admin");
        setUserTier("elite");
        setAuthError("");
        return; 
      }`;
const bypassNew = `      if (emailInput === "brejnevdiaz@gmail.com" && passInput === "B1ss0u@k1") {
        // Bypass total des sécurités Supabase pour le propriétaire
        setIsLoggedIn(true);
        setUserRole("admin");
        setUserTier("elite");
        setAuthError("");
        setAuthIntent(currentIntent => {
            if (currentIntent) setCurrentTab(currentIntent);
            return "";
        });
        return; 
      }`;
app = app.replace(bypassOld, bypassNew);


// 4. Update the CTAs to set authIntent
// Trouver votre talent -> talentagency
// Trouver un partenariat -> adspy
const cta1Old = `onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }}`;
const cta1New = `onClick={() => { setAuthMode('signup'); setAuthIntent('talentagency'); setShowLoginModal(true); }}`;

const cta2Old = `onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }}`;
const cta2New = `onClick={() => { setAuthMode('signup'); setAuthIntent('adspy'); setShowLoginModal(true); }}`;

// We just replace the text for these specific buttons:
app = app.replace(
    `<button \n                  onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }}\n                  style={{\n                    background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',\n                    color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 12,\n                    fontSize: 15, fontWeight: 700, cursor: 'pointer',\n                    boxShadow: '0 10px 30px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',\n                    transition: 'transform 0.2s, box-shadow 0.2s',\n                    display: 'flex', alignItems: 'center', gap: 8\n                  }}\n                  className="hover-lift hover-glow-intense"\n                >\n                  Trouver votre talent\n                </button>`,
    `<button \n                  onClick={() => { setAuthMode('signup'); setAuthIntent('talentagency'); setShowLoginModal(true); }}\n                  style={{\n                    background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',\n                    color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 12,\n                    fontSize: 15, fontWeight: 700, cursor: 'pointer',\n                    boxShadow: '0 10px 30px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',\n                    transition: 'transform 0.2s, box-shadow 0.2s',\n                    display: 'flex', alignItems: 'center', gap: 8\n                  }}\n                  className="hover-lift hover-glow-intense"\n                >\n                  Trouver votre talent\n                </button>`
);

app = app.replace(
    `<button \n                  onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }}\n                  style={{\n                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',\n                    color: '#fff', padding: '16px 32px', borderRadius: 12,\n                    fontSize: 15, fontWeight: 600, cursor: 'pointer',\n                    transition: 'background 0.2s',\n                    display: 'flex', alignItems: 'center', gap: 8\n                  }} \n                  className="hover-lift"\n                >\n                  Trouver un partenariat\n                </button>`,
    `<button \n                  onClick={() => { setAuthMode('signup'); setAuthIntent('adspy'); setShowLoginModal(true); }}\n                  style={{\n                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',\n                    color: '#fff', padding: '16px 32px', borderRadius: 12,\n                    fontSize: 15, fontWeight: 600, cursor: 'pointer',\n                    transition: 'background 0.2s',\n                    display: 'flex', alignItems: 'center', gap: 8\n                  }} \n                  className="hover-lift"\n                >\n                  Trouver une collaboration\n                </button>`
);

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Successfully injected Auth Intents for CTAs!');
