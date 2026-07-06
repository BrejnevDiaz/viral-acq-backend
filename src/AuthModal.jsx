export default function AuthModal({ uiLang, showLoginModal, setShowLoginModal, authMode, setAuthMode, emailInput, setEmailInput, passInput, setPassInput, signupRole = "brand", setSignupRole, handleAuth, signInWithGoogle, authLoading, authError }) {
  // Stashed in localStorage (not sent inline) so the choice survives the
  // Google OAuth redirect just as well as a plain email/password signup —
  // RoleContext applies it once the fresh session comes back.
  const stashPendingRole = () => {
    if (authMode === "signup") localStorage.setItem("va_pending_role", signupRole);
  };
  return (
    <>
          {/* Auth Modal overlay (Glassmorphism) */}
          {showLoginModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
              background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <div className="modal-pop" style={{
                background: 'rgba(24,24,27,0.8)', border: '1px solid rgba(255,255,255,0.1)',
                width: 820, maxWidth: '95vw', maxHeight: '92vh', borderRadius: 24, display: 'flex', overflowX: 'hidden', overflowY: 'auto',
                boxShadow: '0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: '-20%', left: '-20%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }}></div>

                {/* Auth Form Side */}
                <div className="p-mobile-md" style={{ flex: 1, padding: 60, position: 'relative', zIndex: 10, minWidth: 0 }}>
                  <button onClick={() => setShowLoginModal(false)} style={{
                    position: 'absolute', top: 20, left: 20, background: 'transparent', border: 'none',
                    color: '#A1A1AA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13
                  }} className="hover-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    {uiLang === 'fr' ? 'Retour' : uiLang === 'it' ? 'Indietro' : 'Back'}
                  </button>

                  <div style={{ textAlign: 'center', marginBottom: 40, marginTop: 20 }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #8B5CF6, #8B5CF6)', width: 48, height: 48, borderRadius: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20,
                      margin: '0 auto 20px auto', boxShadow: '0 0 20px rgba(139,92,246,0.5)'
                    }}>AP</div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px 0', color: '#fff' }}>
                      {authMode === "signup"
                        ? (uiLang === 'fr' ? "CRÉEZ VOTRE COMPTE VIP." : uiLang === 'it' ? "CREA IL TUO ACCOUNT VIP." : "CREATE YOUR VIP ACCOUNT.")
                        : (uiLang === 'fr' ? "CONTENT DE VOUS REVOIR." : uiLang === 'it' ? "BENTORNATO." : "WELCOME BACK.")}
                    </h2>
                    <p style={{ color: '#A1A1AA', fontSize: 14 }}>
                      {uiLang === 'fr' ? "Rejoignez les marques et créateurs qui dominent déjà leur marché." : uiLang === 'it' ? "Unisciti ai brand e ai creator che dominano già il loro mercato." : "Join the brands and creators already dominating their market."}
                    </p>
                  </div>

                  {authMode === "signup" && (
                    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                      {["brand", "creator"].map(role => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setSignupRole?.(role)}
                          style={{
                            flex: 1, padding: '11px 4px', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            border: `1.5px solid ${signupRole === role ? '#8B5CF6' : 'rgba(255,255,255,0.1)'}`,
                            background: signupRole === role ? 'rgba(139,92,246,0.15)' : 'rgba(0,0,0,0.2)',
                            color: signupRole === role ? '#fff' : '#A1A1AA', transition: 'all 0.15s'
                          }}
                        >
                          {role === "brand"
                            ? (uiLang === 'fr' ? '🏢 Marque' : uiLang === 'it' ? '🏢 Brand' : '🏢 Brand')
                            : (uiLang === 'fr' ? '👤 Créateur' : uiLang === 'it' ? '👤 Creator' : '👤 Creator')}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => { stashPendingRole(); signInWithGoogle?.(uiLang); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      background: '#fff', border: '1px solid rgba(255,255,255,0.15)', color: '#1f1f1f',
                      padding: '13px 16px', borderRadius: 10, fontSize: 14.5, fontWeight: 600, cursor: 'pointer',
                      marginBottom: 20, transition: 'transform 0.15s'
                    }}
                    className="hover-lift"
                  >
                    <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
                    {uiLang === 'fr' ? 'Continuer avec Google' : uiLang === 'it' ? 'Continua con Google' : 'Continue with Google'}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
                    <span style={{ fontSize: 12, color: '#71717A', fontWeight: 600 }}>{uiLang === 'fr' ? 'OU' : uiLang === 'it' ? 'OPPURE' : 'OR'}</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
                  </div>

                  <form onSubmit={(e) => { stashPendingRole(); handleAuth(e, uiLang); }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#A1A1AA', marginBottom: 8, letterSpacing: 1 }}>{uiLang === 'fr' ? 'ADRESSE E-MAIL' : uiLang === 'it' ? 'INDIRIZZO E-MAIL' : 'EMAIL ADDRESS'}</label>
                      <input
                        type="email" required
                        value={emailInput} onChange={e => setEmailInput(e.target.value)}
                        placeholder="you@company.com"
                        className="input-premium"
                        style={{
                          width: '100%', padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#A1A1AA', marginBottom: 8, letterSpacing: 1 }}>{uiLang === 'fr' ? 'MOT DE PASSE' : uiLang === 'it' ? 'PASSWORD' : 'PASSWORD'}</label>
                      <input
                        type="password" required
                        value={passInput} onChange={e => setPassInput(e.target.value)}
                        placeholder="••••••••"
                        className="input-premium"
                        style={{
                          width: '100%', padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box'
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
                      {authLoading
                        ? (uiLang === 'fr' ? "Chargement..." : uiLang === 'it' ? "Caricamento..." : "Loading...")
                        : (authMode === "signup"
                          ? (uiLang === 'fr' ? "Valider l'inscription →" : uiLang === 'it' ? "Conferma l'iscrizione →" : "Complete Sign Up →")
                          : (uiLang === 'fr' ? "Se connecter →" : uiLang === 'it' ? "Accedi →" : "Log In →"))}
                    </button>
                  </form>
                  <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#A1A1AA' }}>
                    {authMode === "signup"
                      ? (uiLang === 'fr' ? "Déjà un compte ? " : uiLang === 'it' ? "Hai già un account? " : "Already have an account? ")
                      : (uiLang === 'fr' ? "Pas encore de compte ? " : uiLang === 'it' ? "Non hai ancora un account? " : "Don't have an account yet? ")}
                    <span onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")} style={{ color: '#8B5CF6', fontWeight: 600, cursor: 'pointer' }}>
                      {authMode === "signup"
                        ? (uiLang === 'fr' ? "Se connecter" : uiLang === 'it' ? "Accedi" : "Log in")
                        : (uiLang === 'fr' ? "Créer un compte" : uiLang === 'it' ? "Crea un account" : "Create an account")}
                    </span>
                  </div>
                </div>

                {/* Pricing / Value Prop Side */}
                <div className="hide-mobile" style={{ flex: 1, maxWidth: 340, background: 'rgba(0,0,0,0.5)', borderLeft: '1px solid rgba(255,255,255,0.05)', padding: '40px 32px', display: 'flex', flexDirection: 'column' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#8B5CF6', fontSize: 12, fontWeight: 800, letterSpacing: 1, marginBottom: 16 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      {authMode === "signup"
                        ? (uiLang === 'fr' ? "ÉTAPE 2 : CHOISISSEZ VOTRE NIVEAU D'ACCÈS" : uiLang === 'it' ? "FASE 2: SCEGLI IL TUO LIVELLO DI ACCESSO" : "STEP 2: CHOOSE YOUR ACCESS LEVEL")
                        : (uiLang === 'fr' ? "DÉBLOQUEZ L'ACCÈS COMPLET" : uiLang === 'it' ? "SBLOCCA L'ACCESSO COMPLETO" : "UNLOCK FULL ACCESS")}
                   </div>
                   <p style={{ color: '#A1A1AA', fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
                      {authMode === "signup" && signupRole === "creator"
                        ? (uiLang === 'fr' ? "Gratuit & Standard sont réservés aux Créateurs UGC & Influenceurs." : uiLang === 'it' ? "Gratuito & Standard sono riservati ai Creator UGC & Influencer." : "Free & Standard are reserved for UGC Creators & Influencers.")
                        : authMode === "signup" && signupRole === "brand"
                        ? (uiLang === 'fr' ? "Plus, Pro et Elite sont pensés pour les marques — plus vous montez en gamme, plus vite vous scalez." : uiLang === 'it' ? "Plus, Pro ed Elite sono pensati per i brand — più sali di livello, più velocemente scali." : "Plus, Pro and Elite are built for brands — the higher the tier, the faster you scale.")
                        : (uiLang === 'fr' ? "Gratuit & Standard sont réservés aux Créateurs. Plus, Pro et Elite sont pensés pour les marques — plus vous montez en gamme, plus vite vous scalez." : uiLang === 'it' ? "Gratuito & Standard sono riservati ai Creator. Plus, Pro ed Elite sono pensati per i brand — più sali di livello, più velocemente scali." : "Free & Standard are reserved for Creators. Plus, Pro and Elite are built for brands — the higher the tier, the faster you scale.")}
                   </p>

                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, flex: 1, alignContent: 'start' }}>
                      {/* Plan: Free */}
                      {(authMode !== "signup" || signupRole === "creator") && (
                      <div className="hover-card-dark" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column' }}>
                         <div style={{ fontSize: 11, fontWeight: 800, color: '#A1A1AA', letterSpacing: 1, marginBottom: 4 }}>{uiLang === 'fr' ? 'GRATUIT' : uiLang === 'it' ? 'GRATUITO' : 'FREE'}</div>
                         <div style={{ fontSize: 9.5, fontWeight: 700, color: '#EC4899', letterSpacing: 0.3, marginBottom: 8, textTransform: 'uppercase' }}>{uiLang === 'fr' ? '👤 Créateurs UGC & Influenceurs' : uiLang === 'it' ? '👤 Creator UGC & Influencer' : '👤 UGC Creators & Influencers'}</div>
                         <p style={{ fontSize: 11.5, color: '#71717A', lineHeight: 1.5, flex: 1 }}>{uiLang === 'fr' ? "Rejoignez le réseau et recevez des propositions de marques. Zéro frais, zéro engagement." : uiLang === 'it' ? "Unisciti alla rete e ricevi proposte dai brand. Zero costi, zero impegno." : "Join the network and receive brand proposals. Zero fees, zero commitment."}</p>
                         <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>0 €<span style={{ fontSize: 11, color: '#71717A', fontWeight: 500 }}> {uiLang === 'fr' ? '/à vie' : uiLang === 'it' ? '/a vita' : '/forever'}</span></div>
                      </div>
                      )}
                      {/* Plan: Standard */}
                      {(authMode !== "signup" || signupRole === "creator") && (
                      <div className="hover-card-dark" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                         <div style={{ position: 'absolute', top: -9, left: 16, background: '#10B981', color: '#000', fontSize: 9, fontWeight: 800, letterSpacing: 0.5, padding: '2px 10px', borderRadius: 6, textTransform: 'uppercase' }}>{uiLang === 'fr' ? 'UGC Boost' : uiLang === 'it' ? 'UGC Boost' : 'UGC Boost'}</div>
                         <div style={{ fontSize: 11, fontWeight: 800, color: '#10B981', letterSpacing: 1, marginBottom: 4, marginTop: 6 }}>STANDARD</div>
                         <div style={{ fontSize: 9.5, fontWeight: 700, color: '#EC4899', letterSpacing: 0.3, marginBottom: 8, textTransform: 'uppercase' }}>{uiLang === 'fr' ? '👤 Créateurs UGC & Influenceurs' : uiLang === 'it' ? '👤 Creator UGC & Influencer' : '👤 UGC Creators & Influencers'}</div>
                         <p style={{ fontSize: 11.5, color: '#71717A', lineHeight: 1.5, flex: 1 }}>{uiLang === 'fr' ? "Priorité de matching, statistiques avancées et badge Créateur Vérifié." : uiLang === 'it' ? "Priorità nel matching, statistiche avanzate e badge Creator Verificato." : "Priority matching, advanced stats, and a Verified Creator badge."}</p>
                         <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>39 €<span style={{ fontSize: 11, color: '#71717A', fontWeight: 500 }}> {uiLang === 'fr' ? '/mois' : uiLang === 'it' ? '/mese' : '/month'}</span></div>
                      </div>
                      )}
                      {/* Plan: Plus (new) */}
                      {(authMode !== "signup" || signupRole === "brand") && (
                      <div className="hover-card-dark" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column' }}>
                         <div style={{ fontSize: 11, fontWeight: 800, color: '#A1A1AA', letterSpacing: 1, marginBottom: 4 }}>PLUS</div>
                         <div style={{ fontSize: 9.5, fontWeight: 700, color: '#8B5CF6', letterSpacing: 0.3, marginBottom: 8, textTransform: 'uppercase' }}>{uiLang === 'fr' ? '🏢 Marques & E-commerce' : uiLang === 'it' ? '🏢 Brand & E-commerce' : '🏢 Brands & E-commerce'}</div>
                         <p style={{ fontSize: 11.5, color: '#71717A', lineHeight: 1.5, flex: 1 }}>{uiLang === 'fr' ? "AdSpy complet pour trouver vos produits gagnants + CRM 20 leads." : uiLang === 'it' ? "AdSpy completo per trovare i tuoi prodotti vincenti + CRM 20 lead." : "Full AdSpy to find your winning products + 20-lead CRM."}</p>
                         <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>69 €<span style={{ fontSize: 11, color: '#71717A', fontWeight: 500 }}> {uiLang === 'fr' ? '/mois' : uiLang === 'it' ? '/mese' : '/month'}</span></div>
                      </div>
                      )}
                      {/* Plan: Pro */}
                      {(authMode !== "signup" || signupRole === "brand") && (
                      <div className="hover-card-dark" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                         <div style={{ position: 'absolute', top: -9, left: 16, background: '#8B5CF6', color: '#fff', fontSize: 9, fontWeight: 800, letterSpacing: 0.5, padding: '2px 10px', borderRadius: 6, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            {uiLang === 'fr' ? 'Recommandé' : uiLang === 'it' ? 'Consigliato' : 'Recommended'}
                         </div>
                         <div style={{ fontSize: 11, fontWeight: 800, color: '#8B5CF6', letterSpacing: 1, marginBottom: 4, marginTop: 6 }}>VIP PRO</div>
                         <div style={{ fontSize: 9.5, fontWeight: 700, color: '#8B5CF6', letterSpacing: 0.3, marginBottom: 8, textTransform: 'uppercase' }}>{uiLang === 'fr' ? '🏢 Marques & E-commerce' : uiLang === 'it' ? '🏢 Brand & E-commerce' : '🏢 Brands & E-commerce'}</div>
                         <p style={{ fontSize: 11.5, color: '#71717A', lineHeight: 1.5, flex: 1 }}>{uiLang === 'fr' ? "Accès total, 1 coaching + 2 articles de blog par mois." : uiLang === 'it' ? "Accesso totale, 1 coaching + 2 articoli del blog al mese." : "Full access, 1 coaching session + 2 blog posts per month."}</p>
                         <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>99 €<span style={{ fontSize: 11, color: '#71717A', fontWeight: 500 }}> {uiLang === 'fr' ? '/mois' : uiLang === 'it' ? '/mese' : '/month'}</span></div>
                      </div>
                      )}
                      {/* Plan: Elite */}
                      {(authMode !== "signup" || signupRole === "brand") && (
                      <div className="hover-card-dark" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column' }}>
                         <div style={{ fontSize: 11, fontWeight: 800, color: '#A1A1AA', letterSpacing: 1, marginBottom: 4 }}>VIP ELITE</div>
                         <div style={{ fontSize: 9.5, fontWeight: 700, color: '#8B5CF6', letterSpacing: 0.3, marginBottom: 8, textTransform: 'uppercase' }}>{uiLang === 'fr' ? '🏢 Marques & E-commerce' : uiLang === 'it' ? '🏢 Brand & E-commerce' : '🏢 Brands & E-commerce'}</div>
                         <p style={{ fontSize: 11.5, color: '#71717A', lineHeight: 1.5, flex: 1 }}>{uiLang === 'fr' ? "Accès total, coaching hebdomadaire, blog illimité." : uiLang === 'it' ? "Accesso totale, coaching settimanale, blog illimitato." : "Full access, weekly coaching, unlimited blog."}</p>
                         <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>299 €<span style={{ fontSize: 11, color: '#71717A', fontWeight: 500 }}> {uiLang === 'fr' ? '/mois' : uiLang === 'it' ? '/mese' : '/month'}</span></div>
                      </div>
                      )}
                   </div>
                </div>
              </div>
            </div>
          )}
    </>
  );
}
