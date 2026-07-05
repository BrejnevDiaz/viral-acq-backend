import LandingNavbar from "./LandingNavbar";
import LandingHero from "./LandingHero";
import LandingFeatures from "./LandingFeatures";
import LandingCreators from "./LandingCreators";
import LandingSocialProof from "./LandingSocialProof";
import LandingAgencyFAQAcademy from "./LandingAgencyFAQAcademy";
import LandingFooter from "./LandingFooter";
import ContactModal from "./ContactModal";
import AuthModal from "./AuthModal";
import { L } from "./landingTheme";

export default function LandingPage({
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
  return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: L.bg,
          color: L.text,
          fontFamily: "'Inter', sans-serif",
          overflowX: 'hidden',
          position: 'relative'
        }}>

          {/* Background Ambient Glow */}
          <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 60%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>
          <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 60%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>

          {/* NavBar */}
          <LandingNavbar uiLang={uiLang} setUiLang={setUiLang} setAuthMode={setAuthMode} setShowLoginModal={setShowLoginModal} openAuthWithIntent={openAuthWithIntent} />

          <LandingHero uiLang={uiLang} setAuthMode={setAuthMode} setShowLoginModal={setShowLoginModal} />

          {/* Features Sections (Alternating) */}
          <LandingFeatures setAuthMode={setAuthMode} setShowLoginModal={setShowLoginModal} openAuthWithIntent={openAuthWithIntent} uiLang={uiLang} />

          {/* SECTION CRÉATEURS / INFLUENCEURS */}
          <LandingCreators setAuthMode={setAuthMode} setShowLoginModal={setShowLoginModal} uiLang={uiLang} />

          {/* INSPIRATION MARQUES, TÉMOIGNAGES, BENTO & FONDATEUR */}
          <LandingSocialProof setAuthMode={setAuthMode} setShowLoginModal={setShowLoginModal} openAuthWithIntent={openAuthWithIntent} uiLang={uiLang} />

          {/* AGENCE DONE-FOR-YOU, FAQ & ACADÉMIE */}
          <LandingAgencyFAQAcademy uiLang={uiLang} setShowContactModal={setShowContactModal} setAuthMode={setAuthMode} setShowLoginModal={setShowLoginModal} openAuthWithIntent={openAuthWithIntent} />

          {/* FOOTER + Info/Legal Modals */}
          <LandingFooter setAuthMode={setAuthMode} setShowLoginModal={setShowLoginModal} showLegalModal={showLegalModal} setShowLegalModal={setShowLegalModal} legalType={legalType} setLegalType={setLegalType} uiLang={uiLang} />

          {/* Internal Agency Contact Modal (fix: rendu dans la branche Landing, où se trouve son déclencheur) */}
          <ContactModal uiLang={uiLang} showContactModal={showContactModal} setShowContactModal={setShowContactModal} contactFormStatus={contactFormStatus} setContactFormStatus={setContactFormStatus} />

          {/* Auth Modal overlay (Glassmorphism) */}
          <AuthModal uiLang={uiLang} showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} authMode={authMode} setAuthMode={setAuthMode} emailInput={emailInput} setEmailInput={setEmailInput} passInput={passInput} setPassInput={setPassInput} handleAuth={handleAuth} authLoading={authLoading} authError={authError} />
        </div>
  );
}
