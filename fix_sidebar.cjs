const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

const search = '            Ressources & FAQ\n          </button>\n        </div>';
const insertIndex = c.indexOf(search);
if (insertIndex === -1) {
    console.error("Could not find search string");
    process.exit(1);
}

const sidebarBottom = `

        {/* 🚀 Upgrade Button (Minea style) */}
        {userTier !== 'elite' && (
          <button onClick={() => setShowUpgradeModal(true)} style={{
            width: '100%', padding: '12px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(90deg, #f97316, #f59e0b)', color: '#fff',
            fontSize: 14, fontWeight: 700, fontFamily: mono, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)', marginBottom: 16
          }}>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'><rect width='18' height='11' x='3' y='11' rx='2' ry='2'/><path d='M7 11V7a5 5 0 0 1 10 0v4'/></svg>
            Améliorer
          </button>
        )}

        {/* 👤 Profile Settings (Minea style) */}
        <div style={{ position: 'relative', marginTop: 'auto' }}>
          <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} style={{
            width: '100%', background: c.card, border: \`1.5px solid \${c.border}\`, borderRadius: 12, padding: '12px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={\`https://ui-avatars.com/api/?name=\${encodeURIComponent(userId || 'VA')}&background=8B5CF6&color=fff&size=100&rounded=true\`} style={{ width: 32, height: 32, borderRadius: '50%' }} alt='User' />
              <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.text, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 140 }}>
                  {userId || 'brejnevdiaz@gmail.com'}
                </div>
                <div style={{ fontSize: 11, color: c.textDim, textTransform: 'uppercase', letterSpacing: 0.5 }}>{userTier}</div>
              </div>
            </div>
            <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke={c.textMuted} strokeWidth='2' style={{ transform: profileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><path d='m15 18-6-6 6-6'/></svg>
          </button>

          {profileMenuOpen && (
            <div style={{
              position: 'absolute', bottom: '100%', left: 0, width: '100%', marginBottom: 8,
              background: c.surface, border: \`1px solid \${c.border}\`, borderRadius: 12, padding: '8px 0',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ padding: '8px 16px', borderBottom: \`1px solid \${c.border}\`, marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{userId || 'brejnevdiaz@gmail.com'}</div>
                <div style={{ fontSize: 11, color: c.textMuted }}>Compte {userTier}</div>
              </div>
              
              <button style={{ background: 'transparent', border: 'none', padding: '10px 16px', textAlign: 'left', fontSize: 13, color: c.text, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setProfileMenuOpen(false)}>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>
                Mon compte
              </button>
              <button style={{ background: 'transparent', border: 'none', padding: '10px 16px', textAlign: 'left', fontSize: 13, color: c.text, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => { setShowUpgradeModal(true); setProfileMenuOpen(false); }}>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><rect width='18' height='14' x='3' y='5' rx='2' ry='2'/><line x1='3' x2='21' y1='10' y2='10'/></svg>
                Abonnements
              </button>

              <div style={{ height: 1, background: c.border, margin: '4px 0' }} />
              
              <button style={{ background: 'transparent', border: 'none', padding: '10px 16px', textAlign: 'left', fontSize: 13, color: c.error, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => { setProfileMenuOpen(false); supabase.auth.signOut(); }}>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' x2='9' y1='12' y2='12'/></svg>
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
`;

c = c.substring(0, insertIndex + search.length) + sidebarBottom + c.substring(insertIndex + search.length);
fs.writeFileSync('src/App.jsx', c);
console.log("Profile menu restored!");
