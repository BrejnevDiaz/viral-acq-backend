import { L } from "./landingTheme";

export default function LandingHero({ uiLang, setAuthMode, setShowLoginModal, setSignupRole }) {
  return (
    <>
          {/* Hero Section */}
          <main className="hero-container-mobile" style={{ position: 'relative', zIndex: 10, paddingTop: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingBottom: 100, paddingLeft: 20, paddingRight: 20, boxSizing: 'border-box' }}>
            <h1 style={{
              fontSize: 'clamp(48px, 6vw, 76px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px',
              maxWidth: 900, margin: '0 0 24px 0', animation: 'fadeInUp 0.7s ease-out'
            }}>
              {uiLang === 'fr' ? <>L'Arme Secrète des<br/></> : uiLang === 'it' ? <>L'Arma Segreta per i<br/></> : <>The Secret Weapon for<br/></>}
              <span style={{
                background: 'linear-gradient(90deg, #a78bfa, #f472b6, #fb923c)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                display: 'inline-block', filter: 'drop-shadow(0 0 30px rgba(167,139,250,0.3))'
              }}>{uiLang === 'fr' ? "Marques qui Dominent leur Marché" : uiLang === 'it' ? "Brand che Dominano il Mercato" : "Brands That Dominate Their Market"}</span>
            </h1>
            <p style={{
              fontSize: 18, color: L.textMuted, maxWidth: 650, lineHeight: 1.6, margin: '0 0 48px 0', fontWeight: 400,
              animation: 'fadeInUp 0.7s ease-out 0.1s both'
            }}>
              {uiLang === 'fr' ? "La plateforme d'élite réservée aux marques qui refusent la médiocrité. Espionnez les publicités de vos concurrents, recrutez les meilleurs créateurs UGC, et transformez chaque euro en croissance explosive — avant qu'il ne soit trop tard." : uiLang === 'it' ? "La piattaforma d'élite riservata ai brand che rifiutano la mediocrità. Spia le pubblicità dei tuoi concorrenti, recluta i migliori creatori UGC e trasforma ogni euro in una crescita esplosiva — prima che sia troppo tardi." : "The elite platform built for brands that refuse to settle for average. Spy on your competitors' winning ads, recruit the best UGC creators, and turn every dollar spent into explosive growth — before it's too late."}
            </p>

            <div className="text-center-mobile" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, animation: 'fadeInUp 0.7s ease-out 0.2s both', padding: '0 16px' }}>

                <button
                  onClick={() => { setSignupRole?.('brand'); setAuthMode('signup'); setShowLoginModal(true); }}
                  style={{
                    background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
                    color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 12,
                    fontSize: 15, fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}
                  className="hover-lift hover-glow-intense"
                >
                  {uiLang === 'fr' ? 'Je suis une Marque — Scaler Maintenant →' : uiLang === 'it' ? 'Sono un Brand — Scala Ora →' : 'I am a Brand — Scale Now →'}
                </button>
                <button
                  onClick={() => { setSignupRole?.('creator'); setAuthMode('signup'); setShowLoginModal(true); }}
                  style={{
                    background: L.surface, border: `1px solid ${L.borderStrong}`,
                    color: L.text, padding: '16px 32px', borderRadius: 12,
                    fontSize: 15, fontWeight: 600, cursor: 'pointer',
                    transition: 'background 0.2s',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}
                  className="hover-lift"
                >
                  {uiLang === 'fr' ? 'Je suis Créateur — Rejoindre Gratuitement →' : uiLang === 'it' ? 'Sono un Creatore — Unisciti Gratis →' : 'I am a Creator — Join for Free →'}
                </button>
              
            </div>

            {/* Hero Product Demo — real screen-recording video, not a static mockup.
                Drop your demo file at public/demo-video.mp4 (served at /demo-video.mp4). */}
            <div style={{
              marginTop: 80, width: '90%', maxWidth: 1100,
              background: 'linear-gradient(180deg, #18181B 0%, #09090B 100%)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
              boxShadow: '0 30px 100px -20px rgba(0,0,0,1), 0 0 40px rgba(139,92,246,0.15)',
              overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column',
              animation: 'fadeInUp 0.9s ease-out 0.3s both'
            }}>
              <div style={{ height: 48, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 8, background: '#111', flexShrink: 0 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }}></div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }}></div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }}></div>
                <div style={{ marginLeft: 'auto', background: '#27272A', color: '#71717A', fontSize: 12, padding: '4px 12px', borderRadius: 4 }}>acquisition-pro.app/dashboard</div>
                <div style={{ marginLeft: 'auto', width: 44 }}></div>
              </div>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', background: '#000' }}>
                <video
                  src="/demo-video.mp4"
                  autoPlay muted loop playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </main>
    </>
  );
}
