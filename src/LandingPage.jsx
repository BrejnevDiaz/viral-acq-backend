import LandingNavbar from "./LandingNavbar";
import LandingHero from "./LandingHero";
import LandingFeatures from "./LandingFeatures";
import LandingCreators from "./LandingCreators";
import LandingSocialProof from "./LandingSocialProof";
import LandingAgencyFAQAcademy from "./LandingAgencyFAQAcademy";
import LandingFooter from "./LandingFooter";
import ContactModal from "./ContactModal";
import AuthModal from "./AuthModal";

export default function LandingPage({
  uiLang, setUiLang,
  authMode, setAuthMode,
  showLoginModal, setShowLoginModal,
  emailInput, setEmailInput,
  passInput, setPassInput,
  handleAuth,
  showContactModal, setShowContactModal,
  contactFormStatus, setContactFormStatus,
  showInfoModal, setShowInfoModal,
  infoContent, setInfoContent,
  showLegalModal, setShowLegalModal,
  legalType, setLegalType,
}) {
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
          <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 60%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>

          {/* NavBar */}
          <LandingNavbar uiLang={uiLang} setUiLang={setUiLang} setAuthMode={setAuthMode} setShowLoginModal={setShowLoginModal} />

          <LandingHero uiLang={uiLang} setAuthMode={setAuthMode} setShowLoginModal={setShowLoginModal} />

          {/* Features Sections (Alternating) */}
          <LandingFeatures setAuthMode={setAuthMode} setShowLoginModal={setShowLoginModal} />

          {/* SECTION CRÉATEURS / INFLUENCEURS */}
          <LandingCreators setAuthMode={setAuthMode} setShowLoginModal={setShowLoginModal} />

          {/* INSPIRATION MARQUES, TÉMOIGNAGES, BENTO & FONDATEUR */}
          <LandingSocialProof />

          {/* AGENCE DONE-FOR-YOU, FAQ & ACADÉMIE */}
          <LandingAgencyFAQAcademy uiLang={uiLang} setShowContactModal={setShowContactModal} setAuthMode={setAuthMode} setShowLoginModal={setShowLoginModal} />

          {/* FOOTER + Info/Legal Modals */}
          <LandingFooter setAuthMode={setAuthMode} setShowLoginModal={setShowLoginModal} showInfoModal={showInfoModal} setShowInfoModal={setShowInfoModal} infoContent={infoContent} setInfoContent={setInfoContent} showLegalModal={showLegalModal} setShowLegalModal={setShowLegalModal} legalType={legalType} setLegalType={setLegalType} />

          {/* Internal Agency Contact Modal (fix: rendu dans la branche Landing, où se trouve son déclencheur) */}
          <ContactModal uiLang={uiLang} showContactModal={showContactModal} setShowContactModal={setShowContactModal} contactFormStatus={contactFormStatus} setContactFormStatus={setContactFormStatus} />

          {/* Auth Modal overlay (Glassmorphism) */}
          <AuthModal showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} authMode={authMode} setAuthMode={setAuthMode} emailInput={emailInput} setEmailInput={setEmailInput} passInput={passInput} setPassInput={setPassInput} handleAuth={handleAuth} />
        </div>
  );
}
