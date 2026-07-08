import { useMemo, useState } from "react";
import { loadTalents } from "./talentsData";
import { rankTalents, topMovers, estWeeklyViews, formatViews } from "./creatorScore";
import { usePaywall } from "./contexts/PaywallContext";
import { useRole } from "./contexts/RoleContext";

// ─── Creator Score — leaderboard vivant ───────────────────────────────────────
// La feature de rétention quotidienne : chaque score bouge toutes les nuits
// (moteur déterministe dans creatorScore.js). Les créateurs viennent défendre
// leur rang, les marques viennent chasser les "Movers". Côté marques en tier
// limité : métriques 100% visibles, identités floutées — le déblocage consomme
// les crédits du PaywallContext.

const DeltaBadge = ({ value, c, mono, label }) => {
  const up = value > 0, flat = value === 0;
  const color = flat ? c.textDim : up ? c.success : c.error;
  return (
    <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color, whiteSpace: "nowrap" }}>
      {flat ? "＝" : up ? "▲" : "▼"} {Math.abs(value)} <span style={{ color: c.textDim, fontWeight: 400 }}>{label}</span>
    </span>
  );
};

const maskName = (username = "?") => `${username.slice(0, 2)}${"•".repeat(Math.min(Math.max(username.length - 2, 4), 9))}`;

export default function CreatorScoreTab({ c, mono, uiLang = "fr", onImportLead }) {
  const { userRole } = useRole();
  const { isUnlocked, unlockCreator, creditsLeft, hasFullReveal, allowance, openPaywall } = usePaywall();
  const [toast, setToast] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("ALL");
  // Re-render trigger after an unlock (context state changes flow down, but a
  // local tick keeps row buttons in sync immediately on the same click).
  const [, setTick] = useState(0);

  const ranked = useMemo(() => {
    let talents = loadTalents();
    if (selectedRegion !== "ALL") {
      talents = talents.filter(t => (t.region || "IT") === selectedRegion);
    }
    return rankTalents(talents);
  }, [selectedRegion]);
  const movers = useMemo(() => topMovers(ranked, 3), [ranked]);

  const fr = uiLang === "fr", it = uiLang === "it";
  const isCreator = userRole === "creator";

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = (t) => {
    if (!isUnlocked(t.id)) {
      const ok = unlockCreator(t);
      setTick(x => x + 1);
      if (ok) showToast(fr ? `✅ ${t.username} débloqué !` : it ? `✅ ${t.username} sbloccato!` : `✅ ${t.username} unlocked!`);
      return;
    }
    if (onImportLead) {
      onImportLead({
        name: t.username,
        platformId: t.platform || "instagram",
        url: t.profileUrl || `https://instagram.com/${t.username}`,
        niche: t.niche || "general",
        contact: t.email || "À rechercher",
        region: "EU",
      });
    }
  };

  const medal = (rank) => rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", color: c.text }}>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px" }}>
            🏆 Creator Score
          </h2>
          <p style={{ margin: "6px 0 0 0", fontSize: 13, color: c.textMuted, maxWidth: 560, lineHeight: 1.5 }}>
            {fr ? "Le classement vivant des créateurs UGC. Recalculé chaque nuit à partir des vues, de l'engagement et de la réactivité."
              : it ? "La classifica viva dei creator UGC. Ricalcolata ogni notte da views, engagement e reattività."
              : "The live UGC creator ranking. Recalculated nightly from views, engagement and responsiveness."}
          </p>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            {[{id: "ALL", label: "🌍 Global"}, {id: "FR", label: "🇫🇷 France"}, {id: "IT", label: "🇮🇹 Italia"}, {id: "US", label: "🇺🇸 USA"}].map(r => (
              <button key={r.id} onClick={() => setSelectedRegion(r.id)} style={{
                padding: "6px 12px", borderRadius: 20, border: `1px solid ${selectedRegion === r.id ? c.accent : c.border}`,
                background: selectedRegion === r.id ? `${c.accent}22` : "transparent",
                color: selectedRegion === r.id ? c.accent : c.textMuted,
                fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
              }}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
        {!isCreator && !hasFullReveal && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 10, background: creditsLeft > 0 ? c.accentSoft : c.errorBg, color: creditsLeft > 0 ? c.accent : c.error, border: `1px solid ${creditsLeft > 0 ? c.accent : c.error}44` }}>
              🔓 {fr ? "Crédits" : it ? "Crediti" : "Credits"} : {creditsLeft}/{allowance}
            </span>
            {creditsLeft === 0 && (
              <button onClick={() => openPaywall(null)} style={{ padding: "8px 14px", borderRadius: 10, border: "none", background: c.accent, color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: mono, cursor: "pointer" }}>
                {fr ? "Passer en illimité ➔" : it ? "Passa all'illimitato ➔" : "Go unlimited ➔"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Bannière créateur : le score est leur vitrine ── */}
      {isCreator && (
        <div style={{ padding: 16, borderRadius: 14, marginBottom: 18, background: `linear-gradient(90deg, ${c.accentSoft}, ${c.accent2Soft})`, border: `1px solid ${c.accent}44` }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>
            {fr ? "📈 Ton score est ta vitrine auprès des marques." : it ? "📈 Il tuo score è la tua vetrina per i brand." : "📈 Your score is your storefront for brands."}
          </div>
          <div style={{ fontSize: 12.5, color: c.textMuted, lineHeight: 1.5 }}>
            {fr ? "Il bouge chaque nuit. Réponds vite aux briefs, publie régulièrement et garde ton engagement haut pour monter de palier — les marques contactent d'abord le haut du classement."
              : it ? "Si muove ogni notte. Rispondi veloce ai brief, pubblica con costanza e tieni alto l'engagement per salire di livello — i brand contattano prima la cima della classifica."
              : "It moves every night. Answer briefs fast, post consistently and keep engagement high to rank up — brands contact the top of the board first."}
          </div>
        </div>
      )}

      {/* ── Movers 24h ── */}
      <div style={{ marginBottom: 22 }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: 14, fontWeight: 800, fontFamily: mono, color: c.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>
          🔥 {fr ? "Movers des dernières 24h" : it ? "Movers delle ultime 24h" : "Movers — last 24h"}
        </h3>
        <div className="grid-1-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {movers.map((t) => {
            const unlocked = isUnlocked(t.id);
            return (
              <div key={t.id} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
                <img src={t.avatar} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", filter: unlocked ? "none" : "blur(7px)", flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {unlocked ? `@${t.username}` : maskName(t.username)}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 3, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 900, color: t.scoreTier.color }}>{t.score}</span>
                    <DeltaBadge value={t.delta24} c={c} mono={mono} label="24h" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Leaderboard ── */}
      <h3 style={{ margin: "0 0 10px 0", fontSize: 14, fontWeight: 800, fontFamily: mono, color: c.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>
        {fr ? "Classement général" : it ? "Classifica generale" : "Full leaderboard"}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ranked.map((t) => {
          const unlocked = isUnlocked(t.id);
          return (
            <div key={t.id} style={{
              display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
              background: c.card, border: `1px solid ${t.rank <= 3 ? `${t.scoreTier.color}55` : c.border}`,
              borderRadius: 14, padding: "12px 16px"
            }}>
              <span style={{ fontFamily: mono, fontSize: t.rank <= 3 ? 20 : 13, fontWeight: 800, width: 38, textAlign: "center", color: c.textMuted, flexShrink: 0 }}>
                {medal(t.rank)}
              </span>
              <img src={t.avatar} alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", filter: unlocked ? "none" : "blur(7px)", flexShrink: 0 }} />
              <div style={{ flex: "1 1 140px", minWidth: 120 }}>
                <div style={{ fontWeight: 800, fontSize: 13.5, letterSpacing: unlocked ? 0 : 1 }}>
                  {unlocked ? `@${t.username}` : maskName(t.username)}
                </div>
                <div style={{ fontSize: 11, color: c.textDim, marginTop: 2, textTransform: "capitalize" }}>
                  {t.niche} · {t.platform || "instagram"}
                </div>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 800, fontFamily: mono, textTransform: "uppercase", padding: "3px 9px",
                borderRadius: 20, background: `${t.scoreTier.color}1e`, color: t.scoreTier.color, border: `1px solid ${t.scoreTier.color}55`, flexShrink: 0
              }}>
                {t.scoreTier.label[uiLang] || t.scoreTier.label.fr}
              </span>
              <div style={{ fontFamily: mono, fontSize: 11.5, color: c.textMuted, flex: "1 1 150px", minWidth: 140 }}>
                👥 {formatViews(t.followers)} · 💬 {t.engagement} · 👁 ~{formatViews(estWeeklyViews(t))}/{fr ? "sem" : it ? "sett" : "wk"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
                <span style={{ fontFamily: mono, fontSize: 19, fontWeight: 900, color: t.scoreTier.color }}>{t.score}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <DeltaBadge value={t.delta24} c={c} mono={mono} label="24h" />
                  <DeltaBadge value={t.delta7} c={c} mono={mono} label="7j" />
                </div>
              </div>
              {!isCreator && (
                <button onClick={() => handleAction(t)} style={{
                  padding: "9px 14px", borderRadius: 9, border: "none", cursor: "pointer",
                  background: unlocked ? c.success : c.accent, color: "#fff",
                  fontSize: 11.5, fontWeight: 700, fontFamily: mono, flexShrink: 0
                }}>
                  {unlocked
                    ? (fr ? "Contacter ➔" : it ? "Contatta ➔" : "Contact ➔")
                    : hasFullReveal
                      ? (fr ? "Révéler" : it ? "Rivela" : "Reveal")
                      : (fr ? "🔓 Débloquer (1 crédit)" : it ? "🔓 Sblocca (1 credito)" : "🔓 Unlock (1 credit)")}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: 11, color: c.textDim, fontFamily: mono, marginTop: 16 }}>
        {fr ? "⏱ Prochain recalcul : cette nuit à 02:00 UTC. Les scores intègrent vues estimées, engagement et réactivité aux briefs."
          : it ? "⏱ Prossimo ricalcolo: stanotte alle 02:00 UTC. Gli score integrano views stimate, engagement e reattività ai brief."
          : "⏱ Next recalculation: tonight at 02:00 UTC. Scores blend estimated views, engagement and brief responsiveness."}
      </p>

      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 9998,
          padding: "13px 24px", borderRadius: 13, background: "linear-gradient(90deg,#10b981,#059669)",
          color: "#fff", fontWeight: 700, fontSize: 13.5, boxShadow: "0 8px 32px rgba(0,0,0,0.32)", pointerEvents: "none"
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
