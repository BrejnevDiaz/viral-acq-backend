const fs = require('fs');

let appContent = fs.readFileSync('src/App.jsx', 'utf8');

// Find the start of the !isLoggedIn block
const startIndex = appContent.indexOf('if (!isLoggedIn) {');
if (startIndex === -1) {
  console.error("Could not find if (!isLoggedIn)");
  process.exit(1);
}

// Find the end of the block. It ends right before `return (` of the dashboard.
const dashboardReturnIndex = appContent.search(/return \(\s*<div style=\{\{ display: "flex", minHeight: "100vh"/);
if (dashboardReturnIndex === -1) {
  console.error("Could not find dashboard return");
  process.exit(1);
}

// Extract the original login code so we can wrap it in a modal
const originalAuthBlock = appContent.substring(startIndex, dashboardReturnIndex);

// We need to keep the `loginT` and `handleAuth` parts, but replace the `return ( ... )` inside `if (!isLoggedIn)`.
// We can just construct a new `if (!isLoggedIn)` block.
const newLandingPage = `if (!isLoggedIn) {
    const loginT = {
      fr: {
        brand: "VIRALACQUISITION",
        titlePre: "L'ère de",
        titleMain: "l'Acquisition Virale & Spy",
        subtitle: "Découvrez les produits gagnants, analysez les boutiques e-commerce concurrentes, espionnez les meilleures créatives publicitaires et recrutez des influenceurs à fort impact sur Meta, TikTok, Pinterest et plus encore.",
        statStores: "Boutiques Analysées",
        statAds: "Créatifs AdSpy",
        quote: "J'ai conçu cette suite pour vous offrir en direct la détection de tendances virales et la prospection automatique de vos cibles idéales dans une interface unique.",
        quoteTitle: "Fondateur & CEO"
      },
      en: {
        brand: "VIRALACQUISITION",
        titlePre: "The Era of",
        titleMain: "Viral Acquisition & Spy",
        subtitle: "Discover winning products, analyze competing e-commerce stores, spy on top ad creatives, and recruit high-impact influencers on Meta, TikTok, Pinterest, and more.",
        statStores: "Stores Analyzed",
        statAds: "AdSpy Creatives",
        quote: "I designed this suite to give you live viral trend detection and automatic ideal-target prospecting in a single interface.",
        quoteTitle: "Founder & CEO"
      },
      it: {
        brand: "VIRALACQUISITION",
        titlePre: "L'era di",
        titleMain: "Acquisizione Virale & Spy",
        subtitle: "Scopri prodotti vincenti, analizza negozi e-commerce della concorrenza, spia le migliori creatività pubblicitarie e recluta influencer ad alto impatto su Meta, TikTok, Pinterest e altro ancora.",
        statStores: "Negozi Analizzati",
        statAds: "Creatività AdSpy",
        quote: "Ho progettato questa suite per offrirti il rilevamento dal vivo delle tendenze virali e la prospezione automatica dei tuoi target ideali in un'unica interfaccia.",
        quoteTitle: "Fondatore & CEO"
      }
    }[uiLang];

    const handleAuth = async (e) => {
      e.preventDefault();
      setAuthError("");
      if (!emailInput || !passInput) {
        setAuthError(uiLang === "fr" ? "Veuillez remplir tous les champs." : "Please fill all fields.");
        return;
      }
      try {
        if (authMode === "signup") {
          const { data, error } = await supabase.auth.signUp({
            email: emailInput,
            password: passInput,
            options: {
              data: {
                tier: selectedSignupTier,
                role: "user"
              }
            }
          });
          if (error) throw error;
          if (data?.user?.identities?.length === 0) {
            throw new Error(uiLang === "fr" ? "Cet utilisateur existe déjà." : "This user already exists.");
          }
          setAuthMode("login");
          setAuthError(uiLang === "fr" ? "Inscription réussie ! Vous pouvez vous connecter." : "Sign up successful! You can now log in.");
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email: emailInput,
            password: passInput
          });
          if (error) throw error;
          // onAuthStateChange handles isLoggedIn
        }
      } catch (err) {
        setAuthError(err.message || (uiLang === "fr" ? "Erreur d'authentification" : "Authentication error"));
      }
    };

    return (
      <div style={{
        minHeight: "100vh",
        background: "#fff",
        color: "#111827",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
        position: "relative"
      }}>
        {/* Minea-style Header */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 40px", position: "absolute", top: 0, left: 0, right: 0, zIndex: 50
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: \`linear-gradient(135deg, \${c.accent}, #ec4899)\`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", fontFamily: mono, boxShadow: \`0 4px 16px \${c.accentGlow}\` }}>VA</div>
            <h1 className="outfit" style={{ fontSize: 20, fontWeight: 900, margin: 0, letterSpacing: "-0.5px", color: "#111827" }}>
              ViralAcquisition
            </h1>
          </div>

          <div className="desktop-only" style={{ display: "flex", gap: 32, fontSize: 15, fontWeight: 600, color: "#374151" }}>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }} className="hover-color-accent">Adspy</span>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }} className="hover-color-accent">Produit gagnant</span>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }} className="hover-color-accent">Sourcing CRM</span>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }} className="hover-color-accent">Matchmaking</span>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <select
              value={uiLang}
              onChange={(e) => setUiLang(e.target.value)}
              style={{
                background: "transparent", border: "none", fontSize: 15, fontWeight: 600, color: "#374151", cursor: "pointer", outline: "none"
              }}
            >
              <option value="fr">French</option>
              <option value="en">English</option>
              <option value="it">Italian</option>
            </select>
            <button onClick={() => { setAuthMode("login"); setShowLoginModal(true); }} style={{
              padding: "10px 24px", borderRadius: 12, background: "#111827", color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "transform 0.2s"
            }} className="hover-lift">
              Login
            </button>
          </div>
        </header>

        {/* Hero Section (Radial Gradient) */}
        <section style={{
          position: "relative",
          paddingTop: 160,
          paddingBottom: 80,
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
          overflow: "hidden"
        }}>
          {/* Background Radial Glow */}
          <div style={{
            position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
            width: "100%", maxWidth: 1000, height: 800,
            background: "radial-gradient(ellipse at top, rgba(139,92,246,0.3) 0%, rgba(236,72,153,0.15) 40%, transparent 70%)",
            zIndex: 0, pointerEvents: "none"
          }}></div>

          <div style={{ position: "relative", zIndex: 10, maxWidth: 900, padding: "0 20px" }}>
            <h2 style={{
              fontSize: "clamp(48px, 6vw, 76px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 24px 0", letterSpacing: "-2px", color: "#111827"
            }}>
              <span style={{ display: "block" }}>{loginT.titlePre}</span>
              <span style={{ background: \`linear-gradient(90deg, \${c.accent}, #ec4899)\`, WebkitBackgroundClip: "text", color: "transparent" }}>
                {loginT.titleMain}
              </span>
            </h2>
            <p style={{
              fontSize: 18, color: "#4B5563", lineHeight: 1.6, maxWidth: 700, margin: "0 auto 40px auto", fontWeight: 500
            }}>
              {loginT.subtitle}
            </p>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => { setAuthMode("signup"); setShowLoginModal(true); }} style={{
                padding: "16px 36px", borderRadius: 14, background: \`linear-gradient(90deg, \${c.accent}, #ec4899)\`, color: "#fff", border: "none", fontSize: 18, fontWeight: 800, cursor: "pointer",
                boxShadow: \`0 10px 30px \${c.accentGlow}\`, transition: "all 0.3s"
              }} className="hover-lift">
                {uiLang === "fr" ? "Essayez gratuitement" : "Try for free"}
              </button>
              <button style={{
                padding: "16px 36px", borderRadius: 14, background: "#fff", color: "#111827", border: "1px solid #E5E7EB", fontSize: 18, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)", transition: "all 0.3s"
              }} className="hover-lift">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                {uiLang === "fr" ? "Installer l'extension" : "Install extension"}
              </button>
            </div>
          </div>

          {/* Dashboard Mockup Image */}
          <div style={{
            position: "relative", zIndex: 10, marginTop: 60, width: "90%", maxWidth: 1100,
            background: "#09090E", borderRadius: "24px 24px 0 0", border: "1px solid rgba(255,255,255,0.1)", borderBottom: "none",
            boxShadow: "0 -20px 60px rgba(139,92,246,0.15)", overflow: "hidden", height: 400
          }}>
             <div style={{ display: "flex", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", gap: 6 }}>
                   <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }}></div>
                   <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#eab308" }}></div>
                   <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }}></div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.05)", padding: "6px 24px", borderRadius: 6, color: "#9ca3af", fontSize: 12, fontFamily: mono, marginLeft: 20 }}>
                  viralacq.app/dashboard
                </div>
             </div>
             {/* Fake Content Area */}
             <div style={{ display: "flex", height: "100%" }}>
                <div style={{ width: 220, borderRight: "1px solid rgba(255,255,255,0.05)", padding: 20 }}>
                   <div style={{ height: 16, width: "80%", background: "rgba(255,255,255,0.1)", borderRadius: 4, marginBottom: 20 }}></div>
                   <div style={{ height: 16, width: "60%", background: "rgba(255,255,255,0.05)", borderRadius: 4, marginBottom: 20 }}></div>
                   <div style={{ height: 16, width: "70%", background: "rgba(255,255,255,0.05)", borderRadius: 4, marginBottom: 20 }}></div>
                   <div style={{ height: 16, width: "50%", background: "rgba(255,255,255,0.05)", borderRadius: 4, marginBottom: 20 }}></div>
                </div>
                <div style={{ flex: 1, padding: 30 }}>
                    <div style={{ height: 32, width: 200, background: "rgba(255,255,255,0.1)", borderRadius: 8, marginBottom: 30 }}></div>
                    <div style={{ display: "flex", gap: 20 }}>
                       <div style={{ height: 120, flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(139,92,246,0.2)" }}></div>
                       <div style={{ height: 120, flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 12 }}></div>
                       <div style={{ height: 120, flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 12 }}></div>
                    </div>
                </div>
             </div>
          </div>
        </section>

        {/* Login/Signup Modal overlay */}
        {showLoginModal && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
          }}>
            <div className="glass-panel animate-border" style={{ 
              width: "100%", 
              maxWidth: authMode === "signup" ? 860 : 420, 
              background: "#0f0f20", 
              padding: "36px 32px", 
              borderRadius: 24, 
              border: \`1.5px solid rgba(139, 92, 246, 0.2)\`, 
              boxShadow: "0 25px 50px rgba(0,0,0,0.6)", 
              boxSizing: "border-box",
              position: "relative",
              color: "#fff"
            }}>
              {/* Close Button */}
              <button onClick={() => setShowLoginModal(false)} style={{
                position: "absolute", top: 16, right: 16, background: "transparent", border: "none", color: "#9ca3af", cursor: "pointer", padding: 8
              }} className="hover-lift">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>

              <div style={{ display: "flex", flexDirection: authMode === "signup" ? "row" : "column", gap: 40 }}>
                
                {/* Left Column: Auth Form */}
                <div style={{ flex: "1 1 320px" }}>
                  <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: \`linear-gradient(135deg, \${c.accent}, #ec4899)\`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto", boxShadow: \`0 8px 24px \${c.accentGlow}\` }}>
                      <span style={{ fontSize: 18, fontWeight: 900, color: "#fff", fontFamily: mono }}>VA</span>
                    </div>
                    <h2 style={{ margin: "0 0 8px 0", fontSize: 24, fontWeight: 900, letterSpacing: "-1px" }}>
                      {authMode === "login" ? (uiLang === "fr" ? "BON RETOUR." : (uiLang === "it" ? "BENTORNATO." : "WELCOME BACK.")) : (uiLang === "fr" ? "CRÉEZ VOTRE COMPTE." : (uiLang === "it" ? "CREA IL TUO ACCOUNT." : "CREATE ACCOUNT."))}
                    </h2>
                    <p style={{ margin: 0, fontSize: 13, color: c.textMuted }}>
                      {authMode === "login" 
                        ? (uiLang === "fr" ? "Saisissez vos identifiants pour entrer." : (uiLang === "it" ? "Inserisci le tue credenziali per entrare." : "Enter your credentials to enter."))
                        : (uiLang === "fr" ? "Rejoignez l'élite de l'Acquisition Virale." : (uiLang === "it" ? "Unisciti all'élite dell'Acquisizione Virale." : "Join the elite of Viral Acquisition."))}
                    </p>
                  </div>

                  {authError && <div style={{ background: \`\${c.error}22\`, color: c.error, padding: "10px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, marginBottom: 16, border: \`1px solid \${c.error}44\`, display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                    {authError}
                  </div>}

                  <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", marginBottom: 6, fontSize: 10, fontWeight: 700, color: c.textMuted, fontFamily: mono, letterSpacing: 1, textTransform: "uppercase" }}>{uiLang === "fr" ? "Adresse e-mail" : (uiLang === "it" ? "Indirizzo email" : "Email address")}</label>
                      <input 
                        type="email" 
                        value={emailInput} 
                        onChange={(e) => setEmailInput(e.target.value)} 
                        placeholder="you@company.com" 
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: \`1.5px solid rgba(255,255,255,0.06)\`, background: "rgba(0,0,0,0.3)", color: "#fff", fontSize: 14, fontFamily: sans, outline: "none", boxSizing: "border-box", transition: "all 0.3s" }} 
                        onFocus={e => Object.assign(e.target.style, { borderColor: c.accent, background: "rgba(0,0,0,0.5)", boxShadow: \`0 0 0 4px \${c.accent}22\` })}
                        onBlur={e => Object.assign(e.target.style, { borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)", boxShadow: "none" })}
                        required 
                      />
                    </div>
                    <div style={{ position: "relative" }}>
                      <label style={{ display: "block", marginBottom: 6, fontSize: 10, fontWeight: 700, color: c.textMuted, fontFamily: mono, letterSpacing: 1, textTransform: "uppercase" }}>{uiLang === "fr" ? "Mot de passe" : (uiLang === "it" ? "Password" : "Password")}</label>
                      <input 
                        type={showPass ? "text" : "password"} 
                        value={passInput} 
                        onChange={(e) => setPassInput(e.target.value)} 
                        placeholder="••••••••" 
                        style={{ width: "100%", padding: "12px 40px 12px 16px", borderRadius: 10, border: \`1.5px solid rgba(255,255,255,0.06)\`, background: "rgba(0,0,0,0.3)", color: "#fff", fontSize: 14, fontFamily: sans, outline: "none", boxSizing: "border-box", transition: "all 0.3s" }} 
                        onFocus={e => Object.assign(e.target.style, { borderColor: c.accent, background: "rgba(0,0,0,0.5)", boxShadow: \`0 0 0 4px \${c.accent}22\` })}
                        onBlur={e => Object.assign(e.target.style, { borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)", boxShadow: "none" })}
                        required 
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: 32, background: "none", border: "none", color: c.textDim, cursor: "pointer", padding: 4 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </div>

                    <button type="submit" style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", background: \`linear-gradient(135deg, \${c.accent}, #ec4899)\`, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: mono, marginTop: 10, boxShadow: \`0 8px 24px \${c.accentGlow}\`, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, transition: "transform 0.2s" }} className="hover-lift">
                      {authMode === "login" ? (uiLang === "fr" ? "Se Connecter" : (uiLang === "it" ? "Accedi" : "Log In")) : (uiLang === "fr" ? "Valider l'Inscription" : (uiLang === "it" ? "Registrati" : "Sign Up"))}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                  </form>

                  <div style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: c.textDim }}>
                    {authMode === "login" ? (uiLang === "fr" ? "Pas encore membre ?" : (uiLang === "it" ? "Non sei membro?" : "Not a member yet?")) : (uiLang === "fr" ? "Déjà un compte ?" : (uiLang === "it" ? "Hai già un account?" : "Already have an account?"))}
                    <span style={{ color: c.accent, cursor: "pointer", fontWeight: 700, marginLeft: 6 }} onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setAuthError(""); }}>
                      {authMode === "login" ? (uiLang === "fr" ? "S'inscrire" : (uiLang === "it" ? "Registrati" : "Sign up")) : (uiLang === "fr" ? "Se connecter" : (uiLang === "it" ? "Accedi" : "Log in"))}
                    </span>
                  </div>
                </div>

                {/* Right Column: Pricing Plans Selection (only on Signup) */}
                {authMode === "signup" && (
                  <div style={{ flex: "1.2 1 360px", minWidth: 360, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ margin: "0 0 6px 0", fontSize: 14, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: 0.5, fontFamily: mono }}>
                        ⚡ {uiLang === "fr" ? "Étape 2 : Choisissez votre forfait" : "Step 2: Choose your pricing plan"}
                      </h3>
                      <p style={{ margin: "0 0 16px 0", fontSize: 12, color: c.textMuted }}>
                        {uiLang === "fr" ? "Les abonnements disposent d'accès de fonctionnalités et de données différents." : "Plans feature different feature capacities and data access rules."}
                      </p>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flexGrow: 1 }}>
                      {[
                        {
                          id: "free",
                          name: uiLang === "fr" ? "Gratuit (Trial)" : (uiLang === "it" ? "Gratuito (Trial)" : "Free (Trial)"),
                          price: "0 €",
                          period: uiLang === "fr" ? "à vie" : "forever",
                          desc: uiLang === "fr" ? "Vetting IA et ressources basiques uniquement." : "Vetting IA and basic resources only.",
                          color: c.textDim,
                          badge: uiLang === "fr" ? "Débuter" : "Start"
                        },
                        {
                          id: "standard",
                          name: "Standard",
                          price: "39 €",
                          period: uiLang === "fr" ? "/mois" : "/mo",
                          desc: uiLang === "fr" ? "CRM 10 leads, 3 analyses/jour, AdSpy view-only." : "CRM 10 leads, 3 analysis/day, AdSpy view-only.",
                          color: c.accent,
                          badge: "Standard"
                        },
                        {
                          id: "vip_pro",
                          name: "VIP Pro",
                          price: "49 €",
                          period: uiLang === "fr" ? "/mois" : "/mo",
                          desc: uiLang === "fr" ? "Accès total, 2 Coachings + 2 Blogs/mois." : "Full access, 2 coachings + 2 blogs/mo.",
                          color: c.accent2,
                          badge: "Populaire"
                        },
                        {
                          id: "vip_elite",
                          name: "VIP Elite",
                          price: "99 €",
                          period: uiLang === "fr" ? "/mois" : "/mo",
                          desc: uiLang === "fr" ? "Accès total, Coaching hebdomadaire, Blog illimité." : "Total access, weekly coaching, unlimited blog.",
                          color: c.success,
                          badge: "Ultimate"
                        }
                      ].map(plan => (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedSignupTier(plan.id)}
                          style={{
                            background: selectedSignupTier === plan.id ? \`\${plan.color}08\` : "rgba(0,0,0,0.2)",
                            border: \`1.5px solid \${selectedSignupTier === plan.id ? plan.color : "rgba(255,255,255,0.06)"}\`,
                            borderRadius: 12,
                            padding: "12px 14px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: selectedSignupTier === plan.id ? \`0 4px 14px \${plan.color}22\` : "none"
                          }}
                        >
                          {selectedSignupTier === plan.id && (
                            <div style={{ position: "absolute", top: 0, right: 0, background: plan.color, color: "#fff", padding: "2px 8px", fontSize: 9, fontWeight: 700, borderRadius: "0 0 0 8px", textTransform: "uppercase" }}>★</div>
                          )}
                          <div>
                            <span style={{ fontSize: 11, fontWeight: 800, color: selectedSignupTier === plan.id ? plan.color : c.textMuted, fontFamily: mono, textTransform: "uppercase" }}>
                              {plan.name}
                            </span>
                            <p style={{ fontSize: 10.5, color: c.textDim, margin: "4px 0 0 0", lineHeight: 1.3 }}>
                              {plan.desc}
                            </p>
                          </div>
                          <div style={{ marginTop: 12 }}>
                            <span style={{ fontSize: 18, fontWeight: 900, color: "#fff", fontFamily: mono }}>{plan.price}</span>
                            <span style={{ fontSize: 10, color: c.textDim, marginLeft: 2 }}>{plan.period}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
`;

appContent = appContent.substring(0, startIndex) + newLandingPage + "\n\n  " + appContent.substring(dashboardReturnIndex);

fs.writeFileSync('src/App.jsx', appContent);
console.log("Replaced !isLoggedIn block with new landing page.");
