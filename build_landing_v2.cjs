const fs = require('fs');

let lines = fs.readFileSync('src/App.jsx', 'utf8').split('\n');

const startIndex = lines.findIndex(l => l.includes('if (!isLoggedIn) {'));
const endIndex = lines.findIndex((l, i) => i > startIndex && l.startsWith('  return ('));

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find landing page boundaries.", startIndex, endIndex);
  process.exit(1);
}

// ---------------------------------------------------------
// NEW LANDING PAGE (Dark, Premium, Minea Style)
// ---------------------------------------------------------
const newLandingPage = `  if (!isLoggedIn) {
    return (
        <div style={{
          minHeight: '100vh', 
          backgroundColor: '#000000', 
          color: '#ffffff', 
          fontFamily: "'Inter', sans-serif",
          overflowX: 'hidden',
          position: 'relative'
        }}>
          
          {/* Background Ambient Glow */}
          <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 60%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 60%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>

          {/* NavBar */}
          <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, height: 72,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 48px', zIndex: 100,
            background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                background: 'linear-gradient(135deg, #8B5CF6, #F97316)',
                width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: 16, boxShadow: '0 0 20px rgba(139,92,246,0.4)'
              }}>VA</div>
              <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>ViralAcquisition</span>
            </div>
            <div style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 500, color: '#A1A1AA' }}>
              <span style={{ cursor: 'pointer', color: '#fff' }}>Adspy</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Produit gagnant</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Sourcing CRM</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Matchmaking</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <span style={{ fontSize: 14, color: '#A1A1AA', cursor: 'pointer' }}>French ▾</span>
              <button 
                onClick={() => { setAuthMode('login'); setShowLoginModal(true); }}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', padding: '8px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
                className="hover-bg-white-10"
              >
                Login
              </button>
            </div>
          </nav>

          {/* Hero Section */}
          <main style={{ position: 'relative', zIndex: 10, paddingTop: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingBottom: 100 }}>
            <h1 style={{
              fontSize: 'clamp(48px, 6vw, 76px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px',
              maxWidth: 900, margin: '0 0 24px 0'
            }}>
              L'ère de<br/>
              <span style={{ 
                background: 'linear-gradient(90deg, #a78bfa, #f472b6, #fb923c)', 
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                display: 'inline-block', filter: 'drop-shadow(0 0 30px rgba(167,139,250,0.3))'
              }}>l'Acquisition Virale & Spy</span>
            </h1>
            <p style={{
              fontSize: 18, color: '#A1A1AA', maxWidth: 650, lineHeight: 1.6, margin: '0 0 48px 0', fontWeight: 400
            }}>
              Découvrez les produits gagnants, analysez les boutiques e-commerce concurrentes, espionnez les meilleures créatives publicitaires et recrutez des influenceurs à fort impact sur Meta, TikTok, Pinterest et plus encore.
            </p>

            <div style={{ display: 'flex', gap: 16 }}>
              <button 
                onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }}
                style={{
                  background: 'linear-gradient(90deg, #8B5CF6, #EC4899, #F97316)',
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
                display: 'flex', alignItems: 'center', gap: 10, backdropFilter: 'blur(10px)',
                transition: 'background 0.2s'
              }} className="hover-bg-white-10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                Installer l'extension
              </button>
            </div>

            {/* Massive Hero Mockup */}
            <div style={{
              marginTop: 80, width: '90%', maxWidth: 1100, height: 600,
              background: 'linear-gradient(180deg, #18181B 0%, #09090B 100%)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
              boxShadow: '0 30px 100px -20px rgba(0,0,0,1), 0 0 40px rgba(139,92,246,0.15)',
              overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ height: 48, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 8, background: '#111' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }}></div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }}></div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }}></div>
                <div style={{ marginLeft: 'auto', background: '#27272A', color: '#71717A', fontSize: 12, padding: '4px 12px', borderRadius: 4 }}>viralacq.app/dashboard</div>
                <div style={{ marginLeft: 'auto', width: 44 }}></div>
              </div>
              <div style={{ flex: 1, padding: 32, display: 'flex', gap: 32 }}>
                 <div style={{ width: 240, borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ width: '100%', height: 32, background: 'rgba(255,255,255,0.05)', borderRadius: 6 }}></div>
                    <div style={{ width: '80%', height: 32, background: 'rgba(255,255,255,0.02)', borderRadius: 6 }}></div>
                    <div style={{ width: '90%', height: 32, background: 'rgba(255,255,255,0.02)', borderRadius: 6 }}></div>
                 </div>
                 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                       <div style={{ flex: 1, height: 120, background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(249,115,22,0.05))', borderRadius: 12, border: '1px solid rgba(139,92,246,0.2)' }}></div>
                       <div style={{ flex: 1, height: 120, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}></div>
                       <div style={{ flex: 1, height: 120, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}></div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.01)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', padding: 24, display: 'flex', gap: 16 }}>
                        <div style={{ width: '30%', height: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}></div>
                        <div style={{ flex: 1, height: '100%', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}></div>
                    </div>
                 </div>
              </div>
            </div>
          </main>

          {/* Features Sections (Alternating) */}
          <section style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 24px', display: 'flex', flexDirection: 'column', gap: 160, position: 'relative', zIndex: 10 }}>
            
            {/* Feature 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 80, justifyContent: 'space-between' }}>
              <div style={{ flex: 1, maxWidth: 450 }}>
                <h2 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.1, margin: '0 0 24px 0', letterSpacing: '-1px' }}>
                  Repère les annonces <span style={{ color: '#F97316' }}>performantes</span>
                </h2>
                <p style={{ fontSize: 16, color: '#A1A1AA', lineHeight: 1.6, marginBottom: 32 }}>
                  Identifie les tendances avant les autres. Filtre par réseau, engagement, activité et popularité pour trouver les créatives publicitaires qui génèrent des millions.
                </p>
                <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{
                  background: 'linear-gradient(90deg, #F97316, #EA580C)', color: '#fff', border: 'none',
                  padding: '12px 28px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(249,115,22,0.3)', transition: 'transform 0.2s'
                }} className="hover-lift">
                  Essayer gratuitement
                </button>
              </div>
              <div style={{ flex: 1, height: 450, background: '#111', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                 {/* Faux Card Mockup */}
                 <div style={{ position: 'absolute', top: 30, left: 30, right: 30, bottom: -30, background: '#18181B', borderRadius: '16px 16px 0 0', border: '1px solid rgba(255,255,255,0.1)', padding: 20 }}>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                       <div style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 100, fontSize: 10, color: '#fff' }}>🔥 Facebook</div>
                       <div style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 100, fontSize: 10, color: '#fff' }}>♪ TikTok</div>
                    </div>
                    <div style={{ width: '100%', height: 200, background: 'rgba(255,255,255,0.02)', borderRadius: 12, marginBottom: 16 }}></div>
                    <div style={{ width: '70%', height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 6, marginBottom: 10 }}></div>
                    <div style={{ width: '40%', height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 6 }}></div>
                 </div>
              </div>
            </div>

            {/* Feature 2 (Reversed) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 80, justifyContent: 'space-between', flexDirection: 'row-reverse' }}>
              <div style={{ flex: 1, maxWidth: 450 }}>
                <h2 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.1, margin: '0 0 24px 0', letterSpacing: '-1px' }}>
                  Analyse les annonces avec des <span style={{ color: '#8B5CF6' }}>données clés</span>
                </h2>
                <p style={{ fontSize: 16, color: '#A1A1AA', lineHeight: 1.6, marginBottom: 32 }}>
                  Suis l'activité et les budgets, explore la page de l'annonce et accède aux infos essentielles de la boutique pour valider ton produit gagnant.
                </p>
                <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{
                  background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)', color: '#fff', border: 'none',
                  padding: '12px 28px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(139,92,246,0.3)', transition: 'transform 0.2s'
                }} className="hover-lift">
                  Essayer gratuitement
                </button>
              </div>
              <div style={{ flex: 1, height: 450, background: '#111', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                 <div style={{ position: 'absolute', top: 40, right: -40, width: 300, height: 350, background: '#18181B', borderRadius: 16, border: '1px solid rgba(139,92,246,0.3)', padding: 20, boxShadow: '-10px 10px 40px rgba(0,0,0,0.8)' }}>
                    <div style={{ width: '100%', height: 100, background: 'rgba(139,92,246,0.1)', borderRadius: 8, marginBottom: 16 }}></div>
                    <div style={{ width: '100%', height: 40, background: 'rgba(255,255,255,0.03)', borderRadius: 6, marginBottom: 10 }}></div>
                    <div style={{ width: '100%', height: 40, background: 'rgba(255,255,255,0.03)', borderRadius: 6, marginBottom: 10 }}></div>
                    <div style={{ width: '100%', height: 40, background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}></div>
                 </div>
              </div>
            </div>

          </section>

          {/* Auth Modal overlay (Glassmorphism) */}
          {showLoginModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
              background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{
                background: 'rgba(24,24,27,0.8)', border: '1px solid rgba(255,255,255,0.1)',
                width: 900, maxWidth: '95vw', borderRadius: 24, display: 'flex', overflow: 'hidden',
                boxShadow: '0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: '-20%', left: '-20%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }}></div>
                
                {/* Auth Form Side */}
                <div style={{ flex: 1, padding: 60, position: 'relative', zIndex: 10 }}>
                  <button onClick={() => setShowLoginModal(false)} style={{
                    position: 'absolute', top: 20, left: 20, background: 'transparent', border: 'none',
                    color: '#A1A1AA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13
                  }} className="hover-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Retour
                  </button>
                  
                  <div style={{ textAlign: 'center', marginBottom: 40, marginTop: 20 }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #8B5CF6, #F97316)', width: 48, height: 48, borderRadius: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20,
                      margin: '0 auto 20px auto', boxShadow: '0 0 20px rgba(139,92,246,0.5)'
                    }}>VA</div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px 0', color: '#fff' }}>
                      {authMode === "signup" ? "CRÉEZ VOTRE COMPTE." : "BON RETOUR."}
                    </h2>
                    <p style={{ color: '#A1A1AA', fontSize: 14 }}>
                      Rejoignez l'élite de l'Acquisition Virale.
                    </p>
                  </div>

                  <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#A1A1AA', marginBottom: 8, letterSpacing: 1 }}>ADRESSE E-MAIL</label>
                      <input 
                        type="email" required
                        value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        style={{
                          width: '100%', padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 15, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#A1A1AA', marginBottom: 8, letterSpacing: 1 }}>MOT DE PASSE</label>
                      <input 
                        type="password" required
                        value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          width: '100%', padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 15, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <button type="submit" disabled={authLoading} style={{
                      width: '100%', padding: 16, borderRadius: 10, border: 'none',
                      background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', color: '#fff', fontSize: 16, fontWeight: 700,
                      cursor: authLoading ? 'not-allowed' : 'pointer', opacity: authLoading ? 0.7 : 1,
                      marginTop: 10, boxShadow: '0 8px 25px rgba(236,72,153,0.3)'
                    }}>
                      {authLoading ? "Chargement..." : (authMode === "signup" ? "Valider l'inscription →" : "Se connecter →")}
                    </button>
                  </form>
                  <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#A1A1AA' }}>
                    {authMode === "signup" ? "Déjà un compte ? " : "Pas encore de compte ? "}
                    <span onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")} style={{ color: '#8B5CF6', fontWeight: 600, cursor: 'pointer' }}>
                      {authMode === "signup" ? "Se connecter" : "Créer un compte"}
                    </span>
                  </div>
                </div>

                {/* Pricing / Value Prop Side */}
                <div style={{ flex: 1.2, background: 'rgba(0,0,0,0.5)', borderLeft: '1px solid rgba(255,255,255,0.05)', padding: 60, display: 'flex', flexDirection: 'column' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#F97316', fontSize: 12, fontWeight: 800, letterSpacing: 1, marginBottom: 16 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      {authMode === "signup" ? "ÉTAPE 2 : CHOISISSEZ VOTRE FORFAIT" : "DÉBLOQUEZ TOUTES LES FONCTIONNALITÉS"}
                   </div>
                   <p style={{ color: '#A1A1AA', fontSize: 13, lineHeight: 1.6, marginBottom: 32 }}>
                      Les abonnements disposent d'accès de fonctionnalités et de données différents.
                   </p>
                   
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1 }}>
                      {/* Plan: Free */}
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column' }}>
                         <div style={{ fontSize: 11, fontWeight: 800, color: '#A1A1AA', letterSpacing: 1, marginBottom: 8 }}>GRATUIT (TRIAL)</div>
                         <p style={{ fontSize: 12, color: '#71717A', lineHeight: 1.5, flex: 1 }}>Vetting IA et ressources basiques uniquement.</p>
                         <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>0 €<span style={{ fontSize: 12, color: '#71717A', fontWeight: 500 }}> /à vie</span></div>
                      </div>
                      {/* Plan: Standard */}
                      <div style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                         <div style={{ position: 'absolute', top: 12, right: 12, color: '#8B5CF6' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
                         <div style={{ fontSize: 11, fontWeight: 800, color: '#8B5CF6', letterSpacing: 1, marginBottom: 8 }}>STANDARD</div>
                         <p style={{ fontSize: 12, color: '#71717A', lineHeight: 1.5, flex: 1 }}>CRM 10 leads, 3 analyses/jour, AdSpy view-only.</p>
                         <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>39 €<span style={{ fontSize: 12, color: '#71717A', fontWeight: 500 }}> /mois</span></div>
                      </div>
                      {/* Plan: Pro */}
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column' }}>
                         <div style={{ fontSize: 11, fontWeight: 800, color: '#A1A1AA', letterSpacing: 1, marginBottom: 8 }}>VIP PRO</div>
                         <p style={{ fontSize: 12, color: '#71717A', lineHeight: 1.5, flex: 1 }}>Accès total, 2 Coachings + 2 Blogs/mois.</p>
                         <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>49 €<span style={{ fontSize: 12, color: '#71717A', fontWeight: 500 }}> /mois</span></div>
                      </div>
                      {/* Plan: Elite */}
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column' }}>
                         <div style={{ fontSize: 11, fontWeight: 800, color: '#A1A1AA', letterSpacing: 1, marginBottom: 8 }}>VIP ELITE</div>
                         <p style={{ fontSize: 12, color: '#71717A', lineHeight: 1.5, flex: 1 }}>Accès total, Coaching hebdomadaire, Blog illimité.</p>
                         <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>99 €<span style={{ fontSize: 12, color: '#71717A', fontWeight: 500 }}> /mois</span></div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
    );
  }
`;
// ---------------------------------------------------------

lines.splice(startIndex, endIndex - startIndex, newLandingPage);
fs.writeFileSync('src/App.jsx', lines.join('\n'));
console.log('Replaced !isLoggedIn block with new PREMIUM Minea-style landing page.');
