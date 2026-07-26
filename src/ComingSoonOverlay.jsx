// ─── Overlay "Bientôt disponible" ─────────────────────────────────────────────
// Posé sur les sections dont les données sont encore simulées (recherche
// produit, shop analyzer...) : l'interface reste visible en teaser derrière un
// voile flouté, avec un panneau premium et un CTA vers le Coach IA (réel, lui).
// À retirer section par section au fur et à mesure des branchements réels.
export default function ComingSoonOverlay({ c, uiLang = "fr" }) {
  const TEXTS = {
    fr: {
      badge: "BIENTÔT DISPONIBLE",
      title: "Cette section arrive très bientôt",
      desc: "Nous calibrons cet outil avec des données réelles pour vous garantir des résultats fiables dès le premier jour. En attendant, votre Coach IA est déjà opérationnel.",
      cta: "Parler à mon Coach IA",
    },
    en: {
      badge: "COMING SOON",
      title: "This section is coming very soon",
      desc: "We're calibrating this tool with real data to guarantee reliable results from day one. In the meantime, your AI Coach is already live.",
      cta: "Talk to my AI Coach",
    },
    it: {
      badge: "PRESTO DISPONIBILE",
      title: "Questa sezione arriva molto presto",
      desc: "Stiamo calibrando questo strumento con dati reali per garantirti risultati affidabili fin dal primo giorno. Nel frattempo, il tuo Coach IA è già operativo.",
      cta: "Parla con il mio Coach IA",
    },
  };
  const t = TEXTS[uiLang] || TEXTS.fr;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, borderRadius: 20, overflow: "hidden" }}>
      {/* Voile : teinte du thème + flou du contenu derrière */}
      <div style={{ position: "absolute", inset: 0, background: c.bg, opacity: 0.55 }} />
      <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(7px)", WebkitBackdropFilter: "blur(7px)" }} />

      {/* Panneau */}
      <div style={{ position: "relative", display: "flex", justifyContent: "center", paddingTop: "12vh" }}>
        <div style={{
          maxWidth: 480, margin: "0 24px", padding: "40px 44px", textAlign: "center",
          background: c.card, border: `1px solid ${c.border}`, borderRadius: 24,
          boxShadow: "0 30px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(139,92,246,0.15)",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px",
            borderRadius: 999, marginBottom: 20, fontSize: 12, fontWeight: 800, letterSpacing: "1.5px",
            background: "linear-gradient(90deg, #8B5CF6, #EC4899)", color: "#fff",
            boxShadow: "0 8px 24px rgba(139,92,246,0.35)",
          }}>
            ✨ {t.badge}
          </div>
          <h3 className="outfit" style={{ fontSize: 24, fontWeight: 800, color: c.text, margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>
            {t.title}
          </h3>
          <p style={{ color: c.textMuted, fontSize: 14.5, lineHeight: 1.65, margin: "0 0 28px 0" }}>
            {t.desc}
          </p>
          <button
            onClick={() => window.dispatchEvent(new Event("va-open-chatbot"))}
            className="hover-lift"
            style={{
              padding: "14px 28px", borderRadius: 14, border: "none", cursor: "pointer",
              background: "linear-gradient(90deg, #8B5CF6, #EC4899)", color: "#fff",
              fontSize: 15, fontWeight: 800, boxShadow: "0 12px 28px rgba(139,92,246,0.35)",
              transition: "all 0.2s",
            }}
          >
            💬 {t.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
