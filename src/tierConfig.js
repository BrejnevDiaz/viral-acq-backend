// ─── Tier hierarchy — single source of truth for gated features ──────────────
// "pro"/"elite" are legacy aliases kept alongside "vip_pro"/"vip_elite" (the
// IDs the live upgrade flow actually assigns) so both resolve to the same rank.
export const TIER_RANK = { free: 0, standard: 1, plus: 2, pro: 3, vip_pro: 3, elite: 4, vip_elite: 4, admin: 99 };

// Tabs not listed here are open to every tier (incl. free).
export const TAB_MIN_TIER = { acquisition: 2, vetting: 2, matchmaking: 2, resources: 2 };

export const getTierRank = (tier) => TIER_RANK[tier] ?? 0;
