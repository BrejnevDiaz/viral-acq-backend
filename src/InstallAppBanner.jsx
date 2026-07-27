// ─── Incitation à installer l'app (PWA) ──────────────────────────────────────
// Le manifeste et le service worker existent déjà (vite-plugin-pwa) : il ne
// manquait que l'invitation. Installée, l'app s'ouvre en plein écran depuis
// l'écran d'accueil, sans barre d'adresse — et sans commission de store.
//
// DEUX CHEMINS, parce que les navigateurs ne se valent pas :
// - Chrome / Edge / Android : l'événement `beforeinstallprompt` permet une
//   installation en un clic. On l'intercepte et on le rejoue au bon moment.
// - Safari iOS : cet événement N'EXISTE PAS. La seule voie est manuelle
//   (Partager → Sur l'écran d'accueil), il faut donc l'expliquer en images.
//   C'est le piège classique : un bandeau qui n'écouterait que
//   `beforeinstallprompt` ne s'afficherait jamais sur iPhone, précisément la
//   cible principale des créateurs UGC.
import { useState, useEffect } from "react";

const T = {
  fr: {
    title: "Installe Acquisition Pro",
    desc: "Accède à tes campagnes et publie tes vidéos en un geste, depuis ton écran d'accueil.",
    install: "Installer",
    later: "Plus tard",
    iosTitle: "Ajoute l'app à ton écran d'accueil",
    iosStep1: "Appuie sur",
    iosStep2: "dans la barre de Safari",
    iosStep3: "puis choisis « Sur l'écran d'accueil »",
    close: "Fermer",
  },
  en: {
    title: "Install Acquisition Pro",
    desc: "Reach your campaigns and publish your videos in one tap, straight from your home screen.",
    install: "Install",
    later: "Later",
    iosTitle: "Add the app to your home screen",
    iosStep1: "Tap",
    iosStep2: "in the Safari toolbar",
    iosStep3: "then choose “Add to Home Screen”",
    close: "Close",
  },
  it: {
    title: "Installa Acquisition Pro",
    desc: "Accedi alle tue campagne e pubblica i tuoi video con un tocco, dalla schermata home.",
    install: "Installa",
    later: "Più tardi",
    iosTitle: "Aggiungi l'app alla schermata home",
    iosStep1: "Tocca",
    iosStep2: "nella barra di Safari",
    iosStep3: "poi scegli «Aggiungi a Home»",
    close: "Chiudi",
  },
};

const DISMISS_KEY = "va_install_dismissed_until";
// Un refus vaut trois semaines de silence : proposer à nouveau le lendemain
// serait perçu comme du harcèlement et ferait fuir l'utilisateur.
const SNOOZE_MS = 21 * 24 * 60 * 60 * 1000;

const isIos = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  // iPadOS 13+ se présente comme un Mac : le tactile le trahit.
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

export default function InstallAppBanner({ uiLang = "fr" }) {
  const [promptEvent, setPromptEvent] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const t = T[uiLang] || T.fr;

  useEffect(() => {
    // Déjà installée : ne jamais proposer. Déjà refusée récemment : silence.
    if (isStandalone()) return;
    const until = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (Date.now() < until) return;

    if (isIos()) {
      // Aucun événement à attendre sur iOS : on propose après un court délai,
      // le temps que l'utilisateur voie d'abord le contenu de la page.
      const timer = setTimeout(() => setVisible(true), 4000);
      return () => clearTimeout(timer);
    }

    const onPrompt = (e) => {
      e.preventDefault(); // sinon Chrome affiche sa propre bannière, moins claire
      setPromptEvent(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + SNOOZE_MS));
    setVisible(false);
    setShowIosHelp(false);
  };

  const install = async () => {
    if (isIos()) { setShowIosHelp(true); return; }
    if (!promptEvent) return;
    promptEvent.prompt();
    try {
      await promptEvent.userChoice;
    } catch {
      // L'utilisateur a fermé la boîte système : rien à signaler.
    }
    // Le prompt natif ne peut être rejoué qu'une fois par événement.
    setPromptEvent(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t.title}
      style={{
        position: "fixed", left: 16, right: 16, bottom: 16, zIndex: 3000,
        maxWidth: 460, margin: "0 auto",
        background: "#FFFFFF", border: "1px solid #E4E4E7", borderRadius: 18,
        boxShadow: "0 18px 50px rgba(0,0,0,0.18)", overflow: "hidden",
        animation: "installSlideUp 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", gap: 14, padding: 16, alignItems: "flex-start" }}>
        <div style={{
          width: 46, height: 46, borderRadius: 12, flexShrink: 0,
          background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: -0.3,
        }}>AP</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="outfit" style={{ fontSize: 15.5, fontWeight: 800, color: "#18181B", marginBottom: 3 }}>
            {showIosHelp ? t.iosTitle : t.title}
          </div>

          {showIosHelp ? (
            <div style={{ fontSize: 13, color: "#52525B", lineHeight: 1.65 }}>
              {t.iosStep1}{" "}
              {/* Icône « Partager » d'iOS, pour que l'instruction soit
                  reconnaissable sans capture d'écran. */}
              <span style={{ display: "inline-flex", verticalAlign: "middle", margin: "0 3px", color: "#0A84FF" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 16V3m0 0L8 7m4-4 4 4" />
                  <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
                </svg>
              </span>{" "}
              {t.iosStep2}, {t.iosStep3}.
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#52525B", lineHeight: 1.55 }}>{t.desc}</div>
          )}
        </div>

        <button onClick={dismiss} aria-label={t.close} style={{
          border: "none", background: "transparent", color: "#A1A1AA",
          cursor: "pointer", padding: 2, flexShrink: 0, lineHeight: 1,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>

      {!showIosHelp && (
        <div style={{ display: "flex", gap: 8, padding: "0 16px 16px" }}>
          <button onClick={install} style={{
            flex: 1, padding: "11px 0", borderRadius: 11, border: "none", cursor: "pointer",
            background: "linear-gradient(90deg, #8B5CF6, #EC4899)", color: "#fff",
            fontSize: 14, fontWeight: 800,
          }}>{t.install}</button>
          <button onClick={dismiss} style={{
            padding: "11px 18px", borderRadius: 11, cursor: "pointer",
            background: "transparent", border: "1px solid #E4E4E7", color: "#52525B",
            fontSize: 13.5, fontWeight: 600,
          }}>{t.later}</button>
        </div>
      )}

      <style>{`
        @keyframes installSlideUp { from { transform: translateY(120%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
