// ─── Creator Score engine ─────────────────────────────────────────────────────
// Deterministic 0-1000 score per creator, "recalculated nightly" without any
// backend: the score is a pure function of (creator, dayIndex). The seeded
// daily drift makes every score move each day — identically for every visitor
// and on every reload — so 24h/7j deltas are consistent app-wide.
// When real performance data lands (views, ROAS, response time), swap the
// drift for real signals; every consumer reads through this module only.

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Small deterministic hash (djb2-ish) — stable across sessions/devices.
export const hashStr = (s) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export const dayIndex = (d = new Date()) => Math.floor(d.getTime() / 86400000);

const parseEngagement = (e) => {
  const n = parseFloat(String(e ?? "").replace("%", "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

// Base score (stable part): audience size (log scale), engagement quality,
// account activity. Tops out around 940 so the daily drift can flirt with 1000.
const baseScore = (t) => {
  const followers = Number(t.followers) || 0;
  const eng = parseEngagement(t.engagement);
  const followersPart = clamp(Math.log10(Math.max(followers, 1)) / 6, 0, 1) * 340; // 1M+ ≈ plafond
  const engagementPart = clamp(eng / 8, 0, 1) * 420;                               // 8%+ ≈ plafond
  const activityPart = t.status === "active" ? 150 : 60;
  return 30 + followersPart + engagementPart + activityPart;
};

// Seeded daily drift ±40 pts — the "ton score a bougé ce matin" mechanic.
const drift = (t, di) => (hashStr(`${t.username || t.id}:${di}`) % 81) - 40;

export const scoreAt = (t, di = dayIndex()) =>
  clamp(Math.round(baseScore(t) + drift(t, di)), 0, 1000);

export const getScore = (t) => scoreAt(t);

// Positive = the creator climbed over the window.
export const getDelta = (t, days = 1) => scoreAt(t) - scoreAt(t, dayIndex() - days);

// Palier — the badge currency creators defend daily.
export const getScoreTier = (score) => {
  if (score >= 850) return { id: "elite",  label: { fr: "Elite",  en: "Elite",  it: "Elite" },  color: "#10b981" };
  if (score >= 700) return { id: "gold",   label: { fr: "Or",     en: "Gold",   it: "Oro" },    color: "#f59e0b" };
  if (score >= 550) return { id: "silver", label: { fr: "Argent", en: "Silver", it: "Argento" }, color: "#94a3b8" };
  return { id: "bronze", label: { fr: "Bronze", en: "Bronze", it: "Bronzo" }, color: "#d97706" };
};

// Estimated weekly organic views ≈ followers × engagement × ~9 contenus/sem.
export const estWeeklyViews = (t) => {
  const followers = Number(t.followers) || 0;
  return Math.round(followers * (parseEngagement(t.engagement) / 100) * 9);
};

export const formatViews = (n) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}K` : String(n);

// Social proof for the paywall — deterministic per creator/ISO-week (demo
// signal; replace with the real contact log once contacts are persisted).
export const contactsThisWeek = (t) => {
  const week = Math.floor(dayIndex() / 7);
  return 2 + (hashStr(`${t.username || t.id}:w${week}`) % 6); // 2..7
};

// Leaderboard: ranked list with score, deltas and palier, best score first.
export const rankTalents = (talents) =>
  [...talents]
    .map((t) => ({
      ...t,
      score: getScore(t),
      delta24: getDelta(t, 1),
      delta7: getDelta(t, 7),
    }))
    .sort((a, b) => b.score - a.score)
    .map((t, i) => ({ ...t, rank: i + 1, scoreTier: getScoreTier(t.score) }));

// Movers — biggest 24h climbers, the daily reason brands log back in.
export const topMovers = (ranked, n = 3) =>
  [...ranked].sort((a, b) => b.delta24 - a.delta24).slice(0, n);
