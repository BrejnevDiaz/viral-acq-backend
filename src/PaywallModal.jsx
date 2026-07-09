import { useEffect, useState } from "react";
import { usePaywall, OFFER_DISCOUNT } from "./contexts/PaywallContext";
import { useRole } from "./contexts/RoleContext";
import { getScore, getScoreTier, estWeeklyViews, formatViews, contactsThisWeek } from "./creatorScore";

// ─── Paywall contextuel ───────────────────────────────────────────────────────
// Ne dit jamais "Passez Premium" : il affiche les chiffres réels du créateur
// que l'utilisateur vient d'essayer de débloquer, la preuve sociale, et le
// checkout en 1 clic — zéro page intermédiaire. Ancrage visuel sur VIP Elite.

const fmtCountdown = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
};

const PLANS = [
  { id: "plus",      tag: "Plus",  name: "Plan Plus",      price: 69,  color: "accent",
    featuresFr: ["AdSpy complet dropshipping", "CRM Sourcing (20 leads)", "Déblocages illimités"],
    featuresEn: ["Full dropshipping AdSpy", "Sourcing CRM (20 leads)", "Unlimited unlocks"],
    featuresIt: ["AdSpy completo dropshipping", "CRM Sourcing (20 lead)", "Sblocchi illimitati"] },
  { id: "vip_pro",   tag: "Pro",   name: "VIP Pro Plan",    price: 99,  color: "accent2", featured: true,
    featuresFr: ["Outils illimités (Spy, CRM)", "Sourcing influenceurs avancé", "1 Coaching Live mensuel"],
    featuresEn: ["Unlimited tools (Spy, CRM)", "Advanced influencer Sourcing", "1 Monthly Live Coaching"],
    featuresIt: ["Strumenti illimitati (Spy, CRM)", "Sourcing influencer avanzato", "1 Coaching Live mensile"] },
  { id: "vip_elite", tag: "Elite", name: "VIP Elite Plan",  price: 299, color: "success",
    featuresFr: ["TOUTE l'application en illimité", "Coaching Vidéo Hebdomadaire", "Accès prioritaire aux talents"],
    featuresEn: ["Everything entirely unlimited", "Weekly Video Coaching", "Priority access to new talent"],
    featuresIt: ["Tutta l'app illimitata", "Video Coaching settimanale", "Accesso prioritario ai talenti"] },
];

export default function PaywallModal({ c, mono, uiLang = "fr" }) {
  const { paywall, closePaywall, offerDeadline, isOfferActive } = usePaywall();
  const { upgradeTier, isUpgradingSim, upgradeSimSuccess, userRole, switchUserRole } = useRole();
  const [now, setNow] = useState(Date.now());
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  const handleSwitchToBrand = async () => {
    setIsSwitchingRole(true);
    await switchUserRole("brand");
    setIsSwitchingRole(false);
  };

  useEffect(() => {
    if (!paywall.open || !isOfferActive) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [paywall.open, isOfferActive]);

  if (!paywall.open) return null;

  const t = paywall.talent;
  const score = t ? getScore(t) : null;
  const tier = score != null ? getScoreTier(score) : null;
  const views = t ? formatViews(estWeeklyViews(t)) : null;
  const contacts = t ? contactsThisWeek(t) : null;
  const offerOn = isOfferActive && offerDeadline > now;

  const fr = uiLang === "fr", it = uiLang === "it";
  const headline = t
    ? (fr ? "Ce créateur génère des résultats. Débloquez-le." : it ? "Questo creator genera risultati. Sbloccalo." : "This creator delivers. Unlock them.")
    : (fr ? "Vos crédits de déblocage sont épuisés" : it ? "I tuoi crediti di sblocco sono esauriti" : "You're out of unlock credits");
  const sub = t
    ? (fr ? `${contacts} marques l'ont contacté cette semaine. Chaque jour d'attente, c'est un concurrent qui signe avant vous.`
        : it ? `${contacts} brand l'hanno contattato questa settimana. Ogni giorno di attesa è un concorrente che firma prima di te.`
        : `${contacts} brands contacted them this week. Every day you wait, a competitor signs first.`)
    : (fr ? "Passez en illimité pour révéler et contacter tous les créateurs du leaderboard."
        : it ? "Passa all'illimitato per rivelare e contattare tutti i creator della classifica."
        : "Go unlimited to reveal and contact every creator on the leaderboard.");

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(6,6,12,0.82)", backdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, padding: 20,
      color: c.text, fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif"
    }}>
      <div style={{
        background: c.card, border: `1.5px solid ${c.border}`, borderRadius: 24, width: "100%",
        maxWidth: 720, padding: 30, position: "relative", boxShadow: "0 25px 50px rgba(0,0,0,0.5)", overflow: "hidden"
      }}>
        {(isUpgradingSim || upgradeSimSuccess) && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(8,8,16,0.95)", backdropFilter: "blur(10px)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            zIndex: 100, textAlign: "center", borderRadius: 24
          }}>
            {upgradeSimSuccess ? (
              <>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: c.successSoft, display: "flex", alignItems: "center", justifyContent: "center", color: c.success, fontSize: 32, marginBottom: 18, border: `2px solid ${c.success}` }}>✓</div>
                <h3 style={{ fontSize: 20, color: "#fff", fontWeight: 800, margin: 0 }}>{fr ? "Abonnement Activé ! 🎉" : it ? "Abbonamento Attivato! 🎉" : "Subscription Activated! 🎉"}</h3>
              </>
            ) : (
              <>
                <div style={{ width: 60, height: 60, borderRadius: "50%", border: `3px solid ${c.accent}22`, borderTopColor: c.accent, animation: "spin 1s linear infinite", marginBottom: 18 }}></div>
                <p style={{ fontSize: 13, color: c.textDim, fontFamily: mono, margin: 0 }}>🔐 Stripe Secure Checkout Simulation</p>
              </>
            )}
          </div>
        )}

        <button onClick={closePaywall} style={{ position: "absolute", top: 18, right: 18, background: "none", border: "none", color: c.textDim, fontSize: 20, cursor: "pointer" }}>✖</button>

        {/* Contexte créateur : la donnée prouve la valeur, l'identité est le produit */}
        {t && (
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, padding: 14, background: c.bg, borderRadius: 14, border: `1px solid ${c.border}` }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <img src={t.avatar} alt="" style={{ width: 54, height: 54, borderRadius: "50%", objectFit: "cover", filter: "blur(7px)" }} />
              <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔒</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>{(t.username || "?").slice(0, 2)}•••••••</div>
              <div style={{ fontSize: 12, color: c.textMuted, display: "flex", gap: 10, flexWrap: "wrap", marginTop: 3, fontFamily: mono }}>
                <span style={{ color: tier.color, fontWeight: 700 }}>Score {score} · {tier.label[uiLang] || tier.label.fr}</span>
                <span>👁 ~{views} {fr ? "vues/sem" : it ? "views/sett" : "views/wk"}</span>
                <span>💬 {t.engagement} eng.</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 21, fontWeight: 900, margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>{headline}</h3>
          <p style={{ fontSize: 13.5, color: c.textMuted, margin: 0, lineHeight: 1.5 }}>{sub}</p>
        </div>

        {userRole === "creator" && (
          <div style={{
            background: `${c.accent}15`, border: `1px solid ${c.accent}55`, borderRadius: 12, padding: 12,
            marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14
          }}>
            <div style={{ fontSize: 13, color: c.textDim, flex: 1, fontFamily: mono, lineHeight: 1.4 }}>
              <strong style={{ color: c.text }}>{fr ? "Statut Actuel : Créateur" : it ? "Status: Creator" : "Current Status: Creator"}</strong><br/>
              {fr ? "Les forfaits ci-dessous sont dédiés aux Marques et Agences." : it ? "I piani sottostanti sono dedicati a Brand e Agenzie." : "The plans below are dedicated to Brands and Agencies."}
            </div>
            <button
              onClick={handleSwitchToBrand}
              disabled={isSwitchingRole}
              style={{
                background: c.accent, color: "#fff", border: "none", padding: "8px 14px", borderRadius: 8,
                fontSize: 12, fontWeight: 700, cursor: isSwitchingRole ? "wait" : "pointer", flexShrink: 0, fontFamily: mono,
                boxShadow: `0 4px 12px ${c.accent}44`
              }}
            >
              {isSwitchingRole ? "..." : (fr ? "Basculer vers Marque ➔" : it ? "Passa a Brand ➔" : "Switch to Brand ➔")}
            </button>
          </div>
        )}

        {offerOn && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18,
            padding: "10px 14px", borderRadius: 12, background: "linear-gradient(90deg, rgba(139,92,246,0.14), rgba(236,72,153,0.14))",
            border: `1px solid ${c.accent}55`, fontFamily: mono, fontSize: 12.5, fontWeight: 700
          }}>
            ⚡ {fr ? "Offre de bienvenue : -30% sur le 1er mois — expire dans"
              : it ? "Offerta di benvenuto: -30% sul 1º mese — scade tra"
              : "Welcome offer: -30% off month one — expires in"}
            <span style={{ color: c.accent2, fontSize: 14 }}>{fmtCountdown(offerDeadline - now)}</span>
          </div>
        )}

        <div className="grid-1-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {PLANS.map((p) => {
            const color = c[p.color];
            const soft = c[`${p.color}Soft`] || `${color}22`;
            const firstMonth = offerOn ? Math.round(p.price * (1 - OFFER_DISCOUNT)) : p.price;
            return (
              <div key={p.id} style={{
                background: c.bg, borderRadius: 16, padding: 16, position: "relative",
                border: `1.5px solid ${p.featured ? color : `${color}44`}`,
                boxShadow: p.featured ? `0 0 24px ${soft}` : "none",
                transform: p.featured ? "scale(1.03)" : "none",
                display: "flex", flexDirection: "column", justifyContent: "space-between"
              }}>
                {p.featured && (
                  <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: color, color: "#fff", fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: 20, fontFamily: mono, whiteSpace: "nowrap", boxShadow: `0 4px 10px ${soft}` }}>
                    {fr ? "LE PLUS POPULAIRE" : it ? "IL PIÙ POPOLARE" : "MOST POPULAR"}
                  </span>
                )}
                <div>
                  <span style={{ fontSize: 11, background: soft, color, padding: "3px 10px", borderRadius: 6, fontWeight: "800", textTransform: "uppercase", fontFamily: mono, display: "inline-block", margin: "8px 0" }}>{p.tag}</span>
                  <h4 style={{ margin: "4px 0 12px 0", fontSize: 18, fontWeight: 800, color: c.text }}>{p.name}</h4>
                  
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                    {(fr ? p.featuresFr : it ? p.featuresIt : p.featuresEn).map((feat, i) => (
                      <li key={i} style={{ fontSize: 12, color: c.textDim, lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <svg style={{ flexShrink: 0, marginTop: 2, color }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontFamily: mono }}>
                    {offerOn && <span style={{ fontSize: 12, color: c.textDim, textDecoration: "line-through", marginRight: 6 }}>{p.price} €</span>}
                    <span style={{ fontSize: 19, fontWeight: 900, color }}>{firstMonth} €</span>
                    <span style={{ fontSize: 10, color: c.textDim }}> {offerOn ? (fr ? "le 1er mois" : it ? "il 1º mese" : "first month") : (fr ? "/mois" : it ? "/mese" : "/mo")}</span>
                  </div>
                  <button
                    onClick={() => upgradeTier(p.id, closePaywall)}
                    style={{ width: "100%", marginTop: 10, padding: "10px", borderRadius: 8, border: "none", background: color, color: "#fff", fontSize: 11.5, fontWeight: 700, fontFamily: mono, cursor: "pointer", boxShadow: `0 4px 12px ${soft}` }}
                  >
                    {fr ? "Débloquer en illimité ➔" : it ? "Sblocca illimitato ➔" : "Unlock unlimited ➔"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
