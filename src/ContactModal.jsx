export default function ContactModal({ uiLang, showContactModal, setShowContactModal, contactFormStatus, setContactFormStatus }) {
  return (
    <>
      {/* INTERNAL AGENCY CONTACT MODAL */}
      {showContactModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}>
          <div style={{ 
            background: "#09090b", width: "100%", maxWidth: 900, borderRadius: 24, display: "flex", overflow: "hidden", 
            border: "1px solid rgba(139,92,246,0.3)", boxShadow: "0 40px 100px rgba(0,0,0,0.8)", position: "relative" 
          }}>
            <button onClick={() => setShowContactModal(false)} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Left side: Pitch */}
            <div style={{ flex: 1, background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(0,0,0,0.9))", padding: 48, display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid rgba(255,255,255,0.05)" }} className="hide-mobile">
              <div>
                <div style={{ display: "inline-block", padding: "6px 16px", background: "rgba(139,92,246,0.1)", color: "#C4B5FD", borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 24, textTransform: "uppercase", letterSpacing: 1 }}>{uiLang === 'fr' ? 'Agence Exclusive' : 'Exclusive Agency'}</div>
                <h2 style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
                  {uiLang === 'fr' ? <>Scaler vos ventes<br/><span style={{ color: "#A78BFA" }}>n'a jamais été aussi simple.</span></> : <>Scaling your sales<br/><span style={{ color: "#A78BFA" }}>has never been easier.</span></>}
                </h2>
                <p style={{ color: "#A1A1AA", fontSize: 16, lineHeight: 1.6, marginBottom: 40 }}>
                  {uiLang === 'fr' ? "Laissez l'équipe d'experts de Viral Acquisition gérer l'intégralité de vos campagnes : Sourcing UGC, Tournage, Montage Vidéo publicitaire et Stratégie Ads." : "Let Viral Acquisition's team of experts handle your entire campaigns: UGC Sourcing, Shooting, Ad Video Editing, and Ads Strategy."}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#fff', fontWeight: 600 }}><svg width="20" height="20" stroke="#10B981" fill="none" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> +340% {uiLang === 'fr' ? 'Augmentation du ROI' : 'ROI Increase'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#fff', fontWeight: 600 }}><svg width="20" height="20" stroke="#10B981" fill="none" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> {uiLang === 'fr' ? 'Vidéos virales prêtes à publier' : 'Ready-to-publish viral videos'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#fff', fontWeight: 600 }}><svg width="20" height="20" stroke="#10B981" fill="none" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> {uiLang === 'fr' ? 'Gestion 100% déléguée' : '100% delegated management'}</div>
                </div>
              </div>
              <div style={{ marginTop: 40, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20, display: "flex", alignItems: "center", gap: 16 }}>
                 <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff" }}>VA</div>
                 <div>
                   <div style={{ color: "#fff", fontWeight: 700 }}>Brejnev Diaz</div>
                   <div style={{ color: "#A1A1AA", fontSize: 13 }}>{uiLang === 'fr' ? 'Fondateur' : 'Founder'} @ Viral Acquisition</div>
                 </div>
              </div>
            </div>

            {/* Right side: Form */}
            <div style={{ flex: 1, padding: 48, display: "flex", flexDirection: "column", justifyContent: "center" }} className="p-mobile-md">
              {contactFormStatus === 'success' ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 16 }}>{uiLang === 'fr' ? 'Demande envoyée !' : 'Request sent!'}</h3>
                  <p style={{ color: "#A1A1AA", fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
                    {uiLang === 'fr' ? "Notre équipe a bien reçu vos informations. Nous analyserons votre marque et vous contacterons sous 24h pour planifier un appel stratégique." : "Our team has received your information. We will analyze your brand and contact you within 24h to schedule a strategic call."}
                  </p>
                  <button onClick={() => setShowContactModal(false)} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%" }}>
                    {uiLang === 'fr' ? 'Fermer' : 'Close'}
                  </button>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setContactFormStatus('success'); }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, color: "#A1A1AA", fontWeight: 600, marginBottom: 8 }}>{uiLang === 'fr' ? 'Nom Complet' : 'Full Name'}</label>
                    <input type="text" required placeholder="John Doe" style={{ width: "100%", padding: 14, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#fff", fontSize: 15, outline: "none" }} />
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: 13, color: "#A1A1AA", fontWeight: 600, marginBottom: 8 }}>{uiLang === 'fr' ? 'Marque / Entreprise' : 'Brand / Company'}</label>
                      <input type="text" required placeholder="Ex: Sephora" style={{ width: "100%", padding: 14, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#fff", fontSize: 15, outline: "none" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: 13, color: "#A1A1AA", fontWeight: 600, marginBottom: 8 }}>URL de la boutique</label>
                      <input type="url" placeholder="https://" style={{ width: "100%", padding: 14, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#fff", fontSize: 15, outline: "none" }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, color: "#A1A1AA", fontWeight: 600, marginBottom: 8 }}>{uiLang === 'fr' ? 'Budget Ads Mensuel' : 'Monthly Ad Budget'}</label>
                    <select required style={{ width: "100%", padding: 14, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#fff", fontSize: 15, outline: "none" }}>
                      <option value="">{uiLang === 'fr' ? 'Sélectionnez un budget...' : 'Select a budget...'}</option>
                      <option value="1">Moins de 5 000 €</option>
                      <option value="2">5 000 € - 20 000 €</option>
                      <option value="3">20 000 € - 50 000 €</option>
                      <option value="4">Plus de 50 000 €</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, color: "#A1A1AA", fontWeight: 600, marginBottom: 8 }}>{uiLang === 'fr' ? 'Objectif Principal' : 'Main Goal'}</label>
                    <textarea required placeholder={uiLang === 'fr' ? "Qu'attendez-vous de l'agence ?" : "What do you expect from the agency?"} rows="3" style={{ width: "100%", padding: 14, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#fff", fontSize: 15, outline: "none", resize: "none" }} />
                  </div>
                  <button type="submit" className="hover-glow-intense" style={{ width: "100%", padding: 16, borderRadius: 8, border: "none", background: "linear-gradient(90deg, #8B5CF6, #EC4899)", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", marginTop: 8 }}>
                    {uiLang === 'fr' ? 'Demander mon Analyse Gratuite' : 'Request my Free Analysis'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
