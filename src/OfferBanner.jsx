import { useEffect, useState } from "react";
import { usePaywall } from "./contexts/PaywallContext";
import { useRole } from "./contexts/RoleContext";

// ─── Bandeau offre 48h ────────────────────────────────────────────────────────
// Compte à rebours persistant en tête de dashboard pour les marques en tier
// limité. Vraie deadline (PaywallContext ne la réinitialise jamais) : passé
// 48h, le bandeau disparaît définitivement pour ce compte.

const pad = (n) => String(n).padStart(2, "0");

export default function OfferBanner({ c, mono, uiLang = "fr" }) {
  const { isOfferActive, offerDeadline, openPaywall } = usePaywall();
  const { userRole } = useRole();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!isOfferActive) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [isOfferActive]);

  if (!isOfferActive || userRole === "creator" || offerDeadline <= now) return null;

  const s = Math.floor((offerDeadline - now) / 1000);
  const countdown = `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
  const fr = uiLang === "fr", it = uiLang === "it";

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap",
      padding: "10px 16px", marginBottom: 16, borderRadius: 12,
      background: "linear-gradient(90deg, rgba(139,92,246,0.16), rgba(236,72,153,0.16))",
      border: `1px solid ${c.accent}55`, fontFamily: mono, fontSize: 12.5, color: c.text
    }}>
      <span style={{ fontWeight: 700 }}>
        ⚡ {fr ? "Offre de bienvenue : -30% sur votre 1er mois" : it ? "Offerta di benvenuto: -30% sul 1º mese" : "Welcome offer: -30% off your first month"}
      </span>
      <span style={{ color: c.accent2, fontWeight: 800, fontSize: 14, letterSpacing: 1 }}>{countdown}</span>
      <button
        onClick={() => openPaywall(null)}
        style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontSize: 11.5, fontWeight: 700, fontFamily: mono, cursor: "pointer" }}
      >
        {fr ? "En profiter ➔" : it ? "Approfittane ➔" : "Claim it ➔"}
      </button>
    </div>
  );
}
