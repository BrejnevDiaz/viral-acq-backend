import LandingNavbar from "./LandingNavbar";
import LandingFooter from "./LandingFooter";
import ContactModal from "./ContactModal";
import AuthModal from "./AuthModal";
import { FOOTER_PAGES } from "./footerPagesContent";
import { L } from "./landingTheme";

export default function FooterInfoPage({
  pageKey,
  uiLang, setUiLang,
  authMode, setAuthMode,
  showLoginModal, setShowLoginModal,
  openAuthWithIntent,
  emailInput, setEmailInput,
  passInput, setPassInput,
  handleAuth,
  authLoading, authError,
  showContactModal, setShowContactModal,
  contactFormStatus, setContactFormStatus,
  showLegalModal, setShowLegalModal,
  legalType, setLegalType,
}) {
  const page = FOOTER_PAGES[pageKey]?.[uiLang] || FOOTER_PAGES[pageKey]?.fr;

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: L.bg, color: L.text,
      fontFamily: "'Inter', sans-serif", overflowX: 'hidden', position: 'relative'
    }}>
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 60%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>

      <LandingNavbar uiLang={uiLang} setUiLang={setUiLang} setAuthMode={setAuthMode} setShowLoginModal={setShowLoginModal} openAuthWithIntent={openAuthWithIntent} />

      <main style={{ position: 'relative', zIndex: 10, maxWidth: 800, margin: '0 auto', padding: '180px 24px 120px 24px', animation: 'fadeInUp 0.6s ease-out' }}>
        <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(139,92,246,0.1)', color: '#C4B5FD', borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 24, border: '1px solid rgba(139,92,246,0.3)', textTransform: 'uppercase', letterSpacing: 1 }}>
          {page.kicker}
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1px', margin: '0 0 24px 0' }}>
          {page.title}
        </h1>
        <p style={{ fontSize: 18, color: L.textMuted, lineHeight: 1.7, margin: '0 0 40px 0' }}>
          {page.intro}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
          {page.bullets.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA', flexShrink: 0, marginTop: 2 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div style={{ color: L.text, fontSize: 16, lineHeight: 1.5, paddingTop: 3 }}>{b}</div>
            </div>
          ))}
        </div>
        <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} className="hover-lift hover-glow-intense" style={{
          background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)', color: '#fff', border: 'none',
          padding: '16px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
        }}>
          {page.cta} →
        </button>
      </main>

      <LandingFooter
        setAuthMode={setAuthMode} setShowLoginModal={setShowLoginModal}
        showLegalModal={showLegalModal} setShowLegalModal={setShowLegalModal}
        legalType={legalType} setLegalType={setLegalType} uiLang={uiLang}
      />

      <ContactModal uiLang={uiLang} showContactModal={showContactModal} setShowContactModal={setShowContactModal} contactFormStatus={contactFormStatus} setContactFormStatus={setContactFormStatus} />
      <AuthModal uiLang={uiLang} showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} authMode={authMode} setAuthMode={setAuthMode} emailInput={emailInput} setEmailInput={setEmailInput} passInput={passInput} setPassInput={setPassInput} handleAuth={handleAuth} authLoading={authLoading} authError={authError} />
    </div>
  );
}
