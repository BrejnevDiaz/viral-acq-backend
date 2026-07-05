import LandingNavbar from "./LandingNavbar";
import LandingFooter from "./LandingFooter";
import ContactModal from "./ContactModal";
import AuthModal from "./AuthModal";
import { BLOG_ARTICLES } from "./blogArticles";
import { L } from "./landingTheme";

const HEADER = {
  fr: { kicker: "Contenu & Ressources", title: "Le Blog Acquisition Pro", subtitle: "Études de cas, guides tactiques et retours d'expérience de marques qui scalent avec l'influence marketing — écrits par l'équipe qui utilise l'outil tous les jours." },
  en: { kicker: "Content & Resources", title: "The Acquisition Pro Blog", subtitle: "Case studies, tactical guides, and lessons from brands scaling with influencer marketing — written by the team that uses the tool every day." },
  it: { kicker: "Contenuti & Risorse", title: "Il Blog di Acquisition Pro", subtitle: "Case study, guide tattiche e feedback da brand che scalano con l'influencer marketing — scritti dal team che usa lo strumento ogni giorno." },
};

export default function BlogPage({
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
  const header = HEADER[uiLang] || HEADER.fr;

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: L.bg, color: L.text,
      fontFamily: "'Inter', sans-serif", overflowX: 'hidden', position: 'relative'
    }}>
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 60%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }}></div>

      <LandingNavbar uiLang={uiLang} setUiLang={setUiLang} setAuthMode={setAuthMode} setShowLoginModal={setShowLoginModal} openAuthWithIntent={openAuthWithIntent} />

      <main style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '180px 24px 120px 24px', animation: 'fadeInUp 0.6s ease-out' }}>
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 64px auto' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(139,92,246,0.1)', color: '#C4B5FD', borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 24, border: '1px solid rgba(139,92,246,0.3)', textTransform: 'uppercase', letterSpacing: 1 }}>
            {header.kicker}
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1px', margin: '0 0 20px 0' }}>
            {header.title}
          </h1>
          <p style={{ fontSize: 17, color: L.textMuted, lineHeight: 1.7, margin: 0 }}>
            {header.subtitle}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {BLOG_ARTICLES.map(article => (
            <div key={article.slug} className="hover-card-dark" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: '#8B5CF6', background: 'rgba(139,92,246,0.1)', padding: '4px 10px', borderRadius: 6 }}>
                  {article.category[uiLang] || article.category.fr}
                </span>
                <span style={{ fontSize: 12, color: '#71717A' }}>{article.readTime[uiLang] || article.readTime.fr}</span>
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: '#fff', lineHeight: 1.35, marginBottom: 12 }}>
                {article.title[uiLang] || article.title.fr}
              </h3>
              <p style={{ fontSize: 14, color: '#A1A1AA', lineHeight: 1.6, flex: 1, marginBottom: 20 }}>
                {article.excerpt[uiLang] || article.excerpt.fr}
              </p>
              <button onClick={() => { setAuthMode('signup'); setShowLoginModal(true); }} style={{
                background: 'transparent', border: 'none', color: '#A78BFA', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', padding: 0, textAlign: 'left', alignSelf: 'flex-start'
              }} className="hover-white">
                {uiLang === 'fr' ? "Lire l'article complet →" : uiLang === 'it' ? "Leggi l'articolo completo →" : "Read the full article →"}
              </button>
            </div>
          ))}
        </div>
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
