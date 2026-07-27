// ─── Filet de sécurité contre l'écran blanc ──────────────────────────────────
// Sans ce composant, la moindre exception dans un rendu React démonte tout
// l'arbre : l'utilisateur se retrouve devant une page entièrement blanche,
// sans message, sans moyen de comprendre ni de repartir. C'est arrivé en
// production le 27/07/2026.
//
// Une frontière d'erreur intercepte l'exception, garde l'application debout et
// affiche une sortie de secours. Elle DOIT être une classe : React n'expose
// pas componentDidCatch aux composants fonctionnels.
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Trace complète en console : c'est elle qui permettra de diagnostiquer un
    // crash signalé par un utilisateur.
    console.error("💥 Crash React intercepté :", error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    const lang = (typeof navigator !== "undefined" && navigator.language || "fr").slice(0, 2);
    const t = {
      fr: { title: "Une erreur inattendue s'est produite", body: "L'application a rencontré un problème sur cette page. Le reste du service fonctionne normalement.", reload: "Recharger la page", home: "Retour à l'accueil" },
      it: { title: "Si è verificato un errore imprevisto", body: "L'applicazione ha riscontrato un problema su questa pagina. Il resto del servizio funziona normalmente.", reload: "Ricarica la pagina", home: "Torna alla home" },
      en: { title: "Something went wrong", body: "The app hit a problem on this page. The rest of the service is running normally.", reload: "Reload the page", home: "Back to home" },
    }[["fr", "it", "en"].includes(lang) ? lang : "fr"];

    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#FAFAF8", color: "#18181B", padding: 24,
        fontFamily: "Inter, system-ui, sans-serif",
      }}>
        <div style={{
          maxWidth: 460, width: "100%", textAlign: "center",
          background: "#fff", border: "1px solid #E4E4E7", borderRadius: 20,
          padding: "40px 32px", boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", margin: "0 auto 20px",
            background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 9v4M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
          </div>
          <h1 className="outfit" style={{ fontSize: 21, fontWeight: 800, margin: "0 0 10px" }}>{t.title}</h1>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#52525B", margin: "0 0 24px" }}>{t.body}</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => window.location.reload()} style={{
              padding: "12px 22px", borderRadius: 12, border: "none", cursor: "pointer",
              background: "linear-gradient(90deg, #8B5CF6, #EC4899)", color: "#fff", fontWeight: 700, fontSize: 14,
            }}>{t.reload}</button>
            <button onClick={() => { window.location.href = "/"; }} style={{
              padding: "12px 22px", borderRadius: 12, cursor: "pointer",
              background: "transparent", border: "1px solid #E4E4E7", color: "#18181B", fontWeight: 600, fontSize: 14,
            }}>{t.home}</button>
          </div>
          {/* Détail technique replié : utile quand l'utilisateur nous envoie une
              capture, sans polluer l'écran. */}
          <details style={{ marginTop: 22, textAlign: "left" }}>
            <summary style={{ cursor: "pointer", fontSize: 12, color: "#A1A1AA" }}>Détail technique</summary>
            <pre style={{
              marginTop: 8, padding: 12, borderRadius: 10, background: "#F4F4F5",
              fontSize: 11, color: "#52525B", overflow: "auto", maxHeight: 160, whiteSpace: "pre-wrap",
            }}>{String(this.state.error?.stack || this.state.error)}</pre>
          </details>
        </div>
      </div>
    );
  }
}
