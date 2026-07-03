export default function AuthModal({ showLoginModal, setShowLoginModal, authMode, setAuthMode, emailInput, setEmailInput, passInput, setPassInput, handleAuth, authLoading, authError }) {
  return (
    <>
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
                      background: 'linear-gradient(135deg, #8B5CF6, #8B5CF6)', width: 48, height: 48, borderRadius: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20,
                      margin: '0 auto 20px auto', boxShadow: '0 0 20px rgba(139,92,246,0.5)'
                    }}>VA</div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px 0', color: '#fff' }}>
                      {authMode === "signup" ? "CRÉEZ VOTRE COMPTE VIP." : "CONTENT DE VOUS REVOIR."}
                    </h2>
                    <p style={{ color: '#A1A1AA', fontSize: 14 }}>
                      Rejoignez les marques et créateurs qui dominent déjà leur marché.
                    </p>
                  </div>

                  <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#A1A1AA', marginBottom: 8, letterSpacing: 1 }}>ADRESSE E-MAIL</label>
                      <input 
                        type="email" required
                        value={emailInput} onChange={e => setEmailInput(e.target.value)}
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
                        value={passInput} onChange={e => setPassInput(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          width: '100%', padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 15, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    {authError && (
                      <div style={{
                        color: '#F87171', fontSize: 13, background: 'rgba(248,113,113,0.1)',
                        border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, padding: '10px 14px'
                      }}>
                        {authError}
                      </div>
                    )}
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
                   <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#8B5CF6', fontSize: 12, fontWeight: 800, letterSpacing: 1, marginBottom: 16 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      {authMode === "signup" ? "ÉTAPE 2 : CHOISISSEZ VOTRE NIVEAU D'ACCÈS" : "DÉBLOQUEZ L'ACCÈS COMPLET"}
                   </div>
                   <p style={{ color: '#A1A1AA', fontSize: 13, lineHeight: 1.6, marginBottom: 32 }}>
                      Chaque forfait débloque un niveau d'accès différent à l'AdSpy, au CRM et au Matchmaking IA — plus vous montez en gamme, plus vite vous scalez.
                   </p>
                   
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1 }}>
                      {/* Plan: Free */}
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column' }}>
                         <div style={{ fontSize: 11, fontWeight: 800, color: '#A1A1AA', letterSpacing: 1, marginBottom: 8 }}>ACCÈS GRATUIT</div>
                         <p style={{ fontSize: 12, color: '#71717A', lineHeight: 1.5, flex: 1 }}>Vetting IA et ressources de base. Idéal pour démarrer sans risque — passez à un forfait payant dès que vous êtes prêt à débloquer l'AdSpy et le CRM complet.</p>
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
    </>
  );
}
