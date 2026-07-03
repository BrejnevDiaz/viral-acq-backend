const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Hook up the language select
app = app.replace(
    `<select style={{ background: 'transparent', color: '#A1A1AA', border: 'none', fontSize: 14, cursor: 'pointer', outline: 'none' }}>`,
    `<select value={uiLang} onChange={(e) => setUiLang(e.target.value)} style={{ background: 'transparent', color: '#A1A1AA', border: 'none', fontSize: 14, cursor: 'pointer', outline: 'none' }}>`
);

// 2. Translate Header Menu
app = app.replace(
    `<span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', color: '#fff' }}>Veille Concurrentielle</span>`,
    `<span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', color: '#fff' }}>{uiLang === 'fr' ? 'Veille Concurrentielle' : 'Spy & Inspiration'}</span>`
);
app = app.replace(
    `<span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Trouver vos talents</span>`,
    `<span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">{uiLang === 'fr' ? 'Trouver vos talents' : 'Find Talents'}</span>`
);
app = app.replace(
    `<span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Trouver une collab</span>`,
    `<span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">{uiLang === 'fr' ? 'Trouver une collab' : 'Creators Hub'}</span>`
);
app = app.replace(
    `<span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Sourcing & CRM</span>`,
    `<span onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="hover-white">Sourcing & CRM</span>`
);
app = app.replace(
    `<button 
                  onClick={() => { setAuthMode('login'); setShowLoginModal(true); }}`,
    `<button 
                  onClick={() => { setAuthMode('login'); setShowLoginModal(true); }}` // Dummy hook point
);
// Replace Login button text
app = app.replace(
    `fontWeight: 700, cursor: 'pointer' }}>
                  Login
                </button>`,
    `fontWeight: 700, cursor: 'pointer' }}>
                  {uiLang === 'fr' ? 'Connexion' : 'Login'}
                </button>`
);

// 3. Translate Hero Section
app = app.replace(
    `L'ère de <br/>l'<span style={{ background: 'linear-gradient(90deg, #8B5CF6, #F43F5E, #F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Acquisition Virale & Spy</span>`,
    `{uiLang === 'fr' ? <>L'ère de <br/>l'<span style={{ background: 'linear-gradient(90deg, #8B5CF6, #F43F5E, #F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Acquisition Virale & Spy</span></> : <>The Era of <br/><span style={{ background: 'linear-gradient(90deg, #8B5CF6, #F43F5E, #F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Viral Acquisition & Spy</span></>}`
);

app = app.replace(
    `L'agence d'acquisition nouvelle génération : l'ultime plateforme de matchmaking. Recrutez les meilleurs influenceurs (votre vivier d'influenceurs sur-mesure), analysez les stratégies marketing gagnantes et sourcez des créateurs à fort impact pour scaler votre marque.`,
    `{uiLang === 'fr' ? "L'agence d'acquisition nouvelle génération : l'ultime plateforme de matchmaking. Recrutez les meilleurs influenceurs (votre vivier d'influenceurs sur-mesure), analysez les stratégies marketing gagnantes et sourcez des créateurs à fort impact pour scaler votre marque." : "The next-gen acquisition agency: the ultimate matchmaking platform. Recruit the best influencers, analyze winning marketing strategies, and source high-impact creators to scale your brand."}`
);

app = app.replace(
    `>Trouver votre talent</button>`,
    `>{uiLang === 'fr' ? 'Trouver votre talent' : 'Find Your Talent'}</button>`
);
app = app.replace(
    `>Trouver une collaboration</button>`,
    `>{uiLang === 'fr' ? 'Trouver une collaboration' : 'Find a Collab'}</button>`
);

// 4. Inject Agency Section "Done For You" right before the FAQ
const agencySection = `
          {/* SECTION AGENCE DONE-FOR-YOU */}
          <section className="p-mobile-sm" style={{ maxWidth: 1200, margin: '100px auto', padding: '0 24px', position: 'relative' }}>
              <div className="flex-col-mobile" style={{ display: 'flex', gap: 60, alignItems: 'center', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(0,0,0,0.8))', borderRadius: 32, padding: 60, border: '1px solid rgba(139,92,246,0.3)', position: 'relative', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}>
                  
                  {/* Background Glow */}
                  <div style={{ position: 'absolute', top: -50, right: -100, width: 400, height: 400, background: 'rgba(139,92,246,0.2)', filter: 'blur(100px)', borderRadius: '50%' }}></div>

                  {/* Left: Text & Benefits */}
                  <div className="w-full-mobile text-center-mobile" style={{ flex: 1, zIndex: 10 }}>
                      <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(139,92,246,0.1)', color: '#C4B5FD', borderRadius: 20, fontSize: 14, fontWeight: 700, marginBottom: 24, border: '1px solid rgba(139,92,246,0.3)', textTransform: 'uppercase', letterSpacing: 1 }}>{uiLang === 'fr' ? "Service Premium" : "Premium Service"}</div>
                      
                      <h2 className="text-mobile-h2" style={{ fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-1px', lineHeight: 1.1 }}>
                          {uiLang === 'fr' ? <>Vous n'avez pas le temps ?<br/><span style={{ color: '#A78BFA' }}>Déléguez tout à l'Agence.</span></> : <>No time to manage?<br/><span style={{ color: '#A78BFA' }}>Delegate to our Agency.</span></>}
                      </h2>
                      
                      <p className="text-mobile-p" style={{ color: '#A1A1AA', fontSize: 18, marginBottom: 40, lineHeight: 1.6 }}>
                          {uiLang === 'fr' 
                          ? "Passez en mode « Done-For-You ». L'équipe Viral Acquisition gère vos campagnes de A à Z : sourcing, scripts créatifs, gestion des contrats, montage vidéo publicitaire et lancement des campagnes."
                          : "Switch to « Done-For-You » mode. The Viral Acquisition team manages your campaigns from A to Z: sourcing, creative scripts, contract management, ad editing, and campaign launch."}
                      </p>
                      
                      <div className="text-left-mobile" style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
                          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA', flexShrink: 0, marginTop: 4 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <div style={{ textAlign: 'left' }}>
                                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{uiLang === 'fr' ? "Gestion Complète" : "Full Management"}</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>{uiLang === 'fr' ? "On s'occupe des influenceurs pendant que vous vous occupez de vos ventes." : "We handle influencers while you handle sales."}</div>
                              </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA', flexShrink: 0, marginTop: 4 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                              <div style={{ textAlign: 'left' }}>
                                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{uiLang === 'fr' ? "Créatives Performantes" : "High-Converting Creatives"}</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 14 }}>{uiLang === 'fr' ? "Nos monteurs transforment le contenu brut en publicités ultra-rentables." : "Our editors turn raw content into highly profitable ads."}</div>
                              </div>
                          </div>
                      </div>
                      
                      <button onClick={() => { alert(uiLang === 'fr' ? "Redirection vers le calendrier de réservation (Calendly)..." : "Redirecting to booking calendar (Calendly)..."); }} className="hover-glow-intense" style={{ background: 'linear-gradient(90deg, #A78BFA, #7C3AED)', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, margin: '0 auto' }}>
                          {uiLang === 'fr' ? "Réserver un appel avec l'Agence" : "Book a call with the Agency"}
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                      </button>
                  </div>

                  {/* Right: Visual */}
                  <div className="w-full-mobile hide-mobile" style={{ flex: 1, position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center' }}>
                      <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
                          <img src="https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=500&q=80" style={{ width: '100%', borderRadius: 24, border: '2px solid rgba(139,92,246,0.3)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }} alt="Viral Acquisition Agency Team" />
                          <div style={{ position: 'absolute', bottom: -20, left: -20, background: '#18181B', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 16 }}>
                              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
                              </div>
                              <div>
                                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>+340%</div>
                                  <div style={{ color: '#A1A1AA', fontSize: 12, textTransform: 'uppercase' }}>{uiLang === 'fr' ? 'Augmentation du ROI' : 'ROI Increase'}</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
`;

if (!app.includes("SECTION AGENCE DONE-FOR-YOU")) {
    const targetStringFAQ = "<section style={{ background: 'linear-gradient(180deg, rgba(139,92,246,0.15) 0%, transparent 100%)'";
    const faqIndex = app.indexOf(targetStringFAQ);
    if (faqIndex !== -1) {
        const before = app.substring(0, faqIndex);
        const after = app.substring(faqIndex);
        app = before + agencySection + "\n          " + after;
        console.log('Successfully injected Agency section!');
    } else {
        console.log('Could not find FAQ target string');
    }
}

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log('Implemented translation state and injected agency section.');
