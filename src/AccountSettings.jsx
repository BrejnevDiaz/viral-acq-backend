import { useState } from "react";

// ─── Account Settings page — reached via Sidebar profile popover → "Mon compte".
// Left-hand tab nav + right-hand content pane, same visual language as the
// rest of the dashboard (c theme, mono font for labels).
export default function AccountSettings({ c, mono, uiLang, userId, userEmail, userTier, setShowUpgradeModal }) {
  const [activeSection, setActiveSection] = useState("info");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("FR");
  const [savedToast, setSavedToast] = useState(false);

  const SECTIONS = [
    { id: "info", label: uiLang === "fr" ? "Informations personnelles" : uiLang === "it" ? "Informazioni personali" : "Personal Information", icon: "👤" },
    { id: "security", label: uiLang === "fr" ? "Sécurité" : uiLang === "it" ? "Sicurezza" : "Security", icon: "🔒" },
    { id: "billing", label: uiLang === "fr" ? "Facturation & Taxes" : uiLang === "it" ? "Fatturazione & Tasse" : "Billing & Taxes", icon: "💳" },
    { id: "subscription", label: uiLang === "fr" ? "Abonnement" : uiLang === "it" ? "Abbonamento" : "Subscription", icon: "⭐" },
    { id: "affiliate", label: uiLang === "fr" ? "Affiliation" : uiLang === "it" ? "Affiliazione" : "Affiliate", icon: "🤝" },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const fieldStyle = { width: "100%", padding: "11px 14px", borderRadius: 9, border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, fontSize: 13.5, outline: "none", boxSizing: "border-box" };
  const labelStyle = { display: "block", fontSize: 11, color: c.textDim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 };

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: c.text, margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>
          ⚙️ {uiLang === "fr" ? "Paramètres du Compte" : uiLang === "it" ? "Impostazioni Account" : "Account Settings"}
        </h2>
        <p style={{ color: c.textMuted, margin: 0, fontSize: 14 }}>
          {uiLang === "fr" ? "Gérez vos informations, votre sécurité et votre abonnement." : uiLang === "it" ? "Gestisci le tue informazioni, la sicurezza e il tuo abbonamento." : "Manage your information, security, and subscription."}
        </p>
      </div>

      <div className="filters-sidebar-row" style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Left tab nav */}
        <div style={{ flex: "0 0 220px", display: "flex", flexDirection: "column", gap: 4, background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 10 }}>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, border: "none",
                background: activeSection === s.id ? `linear-gradient(135deg, ${c.accent}12, ${c.accent2}12)` : "transparent",
                borderLeft: `3px solid ${activeSection === s.id ? c.accent : "transparent"}`,
                color: activeSection === s.id ? c.text : c.textMuted, fontSize: 13, fontWeight: 700, fontFamily: mono,
                cursor: "pointer", textAlign: "left", transition: "all 0.2s"
              }}
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        {/* Right content pane */}
        <div style={{ flex: 1, minWidth: 0, background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 28 }}>

          {activeSection === "info" && (
            <form onSubmit={handleSave} style={{ maxWidth: 440, display: "flex", flexDirection: "column", gap: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: c.text, margin: "0 0 4px 0" }}>
                {uiLang === "fr" ? "Informations personnelles" : uiLang === "it" ? "Informazioni personali" : "Personal Information"}
              </h3>
              <div className="grid-1-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}>{uiLang === "fr" ? "Prénom" : uiLang === "it" ? "Nome" : "First Name"}</label>
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder={uiLang === "fr" ? "ex: Brejnev" : "e.g. Brejnev"} style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{uiLang === "fr" ? "Nom" : uiLang === "it" ? "Cognome" : "Last Name"}</label>
                  <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder={uiLang === "fr" ? "ex: Diaz" : "e.g. Diaz"} style={fieldStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input value={userEmail || userId || ""} disabled style={{ ...fieldStyle, opacity: 0.6, cursor: "not-allowed" }} />
              </div>
              <div>
                <label style={labelStyle}>{uiLang === "fr" ? "Pays" : uiLang === "it" ? "Paese" : "Country"}</label>
                <select value={country} onChange={e => setCountry(e.target.value)} style={{ ...fieldStyle, cursor: "pointer" }}>
                  {["FR", "US", "IT", "UK", "DE", "ES", "CA"].map(cc => <option key={cc} value={cc}>{cc}</option>)}
                </select>
              </div>
              <button type="submit" style={{ marginTop: 6, padding: "12px", borderRadius: 9, border: "none", background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, color: "#fff", fontWeight: 700, fontSize: 13.5, fontFamily: mono, cursor: "pointer", boxShadow: `0 4px 16px ${c.accentGlow}` }}>
                {savedToast ? "✓ " + (uiLang === "fr" ? "Enregistré !" : uiLang === "it" ? "Salvato!" : "Saved!") : (uiLang === "fr" ? "Mettre à jour" : uiLang === "it" ? "Aggiorna" : "Update")}
              </button>
            </form>
          )}

          {activeSection === "security" && (
            <div style={{ maxWidth: 440, display: "flex", flexDirection: "column", gap: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: c.text, margin: "0 0 4px 0" }}>
                {uiLang === "fr" ? "Sécurité" : uiLang === "it" ? "Sicurezza" : "Security"}
              </h3>
              <div>
                <label style={labelStyle}>{uiLang === "fr" ? "Nouveau mot de passe" : uiLang === "it" ? "Nuova password" : "New password"}</label>
                <input type="password" placeholder="••••••••" style={fieldStyle} />
              </div>
              <div>
                <label style={labelStyle}>{uiLang === "fr" ? "Confirmer le mot de passe" : uiLang === "it" ? "Conferma password" : "Confirm password"}</label>
                <input type="password" placeholder="••••••••" style={fieldStyle} />
              </div>
              <button style={{ marginTop: 6, padding: "12px", borderRadius: 9, border: "none", background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, color: "#fff", fontWeight: 700, fontSize: 13.5, fontFamily: mono, cursor: "pointer", alignSelf: "flex-start", paddingLeft: 24, paddingRight: 24 }}>
                {uiLang === "fr" ? "Mettre à jour le mot de passe" : uiLang === "it" ? "Aggiorna password" : "Update password"}
              </button>
            </div>
          )}

          {activeSection === "billing" && (
            <div style={{ maxWidth: 440, display: "flex", flexDirection: "column", gap: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: c.text, margin: "0 0 4px 0" }}>
                {uiLang === "fr" ? "Facturation & Taxes" : uiLang === "it" ? "Fatturazione & Tasse" : "Billing & Taxes"}
              </h3>
              <div>
                <label style={labelStyle}>{uiLang === "fr" ? "Nom de facturation" : uiLang === "it" ? "Nome di fatturazione" : "Billing name"}</label>
                <input placeholder={uiLang === "fr" ? "Nom ou société" : "Name or company"} style={fieldStyle} />
              </div>
              <div>
                <label style={labelStyle}>{uiLang === "fr" ? "Numéro de TVA (optionnel)" : uiLang === "it" ? "Partita IVA (opzionale)" : "VAT Number (optional)"}</label>
                <input placeholder="FR12345678900" style={fieldStyle} />
              </div>
              <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: 14, fontSize: 13, color: c.textMuted }}>
                {uiLang === "fr" ? "Aucune facture disponible pour le moment." : uiLang === "it" ? "Nessuna fattura disponibile al momento." : "No invoices available yet."}
              </div>
            </div>
          )}

          {activeSection === "subscription" && (
            <div style={{ maxWidth: 480 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: c.text, margin: "0 0 16px 0" }}>
                {uiLang === "fr" ? "Abonnement" : uiLang === "it" ? "Abbonamento" : "Subscription"}
              </h3>
              <div style={{ background: c.bg, border: `1.5px solid ${c.accent}44`, borderRadius: 12, padding: 18, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: c.textDim, fontFamily: mono, textTransform: "uppercase" }}>{uiLang === "fr" ? "Forfait actuel" : uiLang === "it" ? "Piano attuale" : "Current plan"}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: c.accent, textTransform: "uppercase" }}>{userTier}</div>
                </div>
                <button onClick={() => setShowUpgradeModal?.(true)} style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c.accent}, #ec4899)`, color: "#fff", fontWeight: 700, fontSize: 12.5, fontFamily: mono, cursor: "pointer" }}>
                  {uiLang === "fr" ? "Changer de forfait" : uiLang === "it" ? "Cambia piano" : "Change plan"}
                </button>
              </div>
              <button style={{ padding: "10px 0", background: "none", border: "none", color: c.error, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: mono }}>
                {uiLang === "fr" ? "Résilier mon abonnement" : uiLang === "it" ? "Annulla abbonamento" : "Cancel subscription"}
              </button>
            </div>
          )}

          {activeSection === "affiliate" && (
            <div style={{ maxWidth: 480 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: c.text, margin: "0 0 8px 0" }}>
                {uiLang === "fr" ? "Programme d'Affiliation" : uiLang === "it" ? "Programma di Affiliazione" : "Affiliate Program"}
              </h3>
              <p style={{ fontSize: 13, color: c.textMuted, marginBottom: 16 }}>
                {uiLang === "fr" ? "Partagez votre lien et touchez 20% de commission récurrente sur chaque abonné parrainé." : uiLang === "it" ? "Condividi il tuo link e guadagna il 20% di commissione ricorrente per ogni abbonato segnalato." : "Share your link and earn 20% recurring commission on every referred subscriber."}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <input readOnly value={`https://acquisitionpro.app/ref/${(userId || "user").split("@")[0]}`} style={{ ...fieldStyle, flex: 1 }} />
                <button style={{ padding: "0 18px", borderRadius: 9, border: "none", background: c.accent, color: "#fff", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: mono }}>
                  {uiLang === "fr" ? "Copier" : uiLang === "it" ? "Copia" : "Copy"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
