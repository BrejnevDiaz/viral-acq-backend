// ─── Shared creator pool ──────────────────────────────────────────────────────
// Single source of truth for the platform's creator roster. Used by
// TalentAgencyTab (roster management) and CreatorScoreTab (leaderboard).
// Persisted in localStorage under "agency_talents_v2" — same key TalentAgencyTab
// has always used, so existing user rosters keep working.

// Real influencer talents scoured from https://viralacquisition.it/talents
export const MOCK_TALENTS = [
  {
    id: "t_1",
    username: "diariatou__sow",
    niche: "beauty",
    followers: 72000,
    engagement: "6.2%",
    platform: "instagram",
    profileUrl: "https://instagram.com/diariatou__sow",
    avatar: "https://viralacquisition.it/assets/avatars/diarry_sow.jpg",
    status: "active", // active | pending
    email: "diariatou@talent.viralacquisition.it"
  },
  {
    id: "t_2",
    username: "thatsnora",
    niche: "beauty", // fashion & beauty
    followers: 82100,
    engagement: "5.8%",
    platform: "instagram",
    profileUrl: "https://instagram.com/thatsnora",
    avatar: "https://viralacquisition.it/assets/avatars/nora_coppini.jpg",
    status: "active",
    email: "nora@talent.viralacquisition.it"
  },
  {
    id: "t_3",
    username: "baratta_jessica",
    niche: "food",
    followers: 41000,
    engagement: "7.1%",
    platform: "instagram",
    profileUrl: "https://instagram.com/baratta_jessica",
    avatar: "https://viralacquisition.it/assets/avatars/jessica_baratta.jpg",
    status: "active",
    email: "jessica@talent.viralacquisition.it"
  },
  {
    id: "t_4",
    username: "katerinmasi_",
    niche: "beauty",
    followers: 49700,
    engagement: "6.5%",
    platform: "instagram",
    profileUrl: "https://instagram.com/katerinmasi_",
    avatar: "https://viralacquisition.it/assets/avatars/catherine_masiello.jpg",
    status: "active",
    email: "katerina@talent.viralacquisition.it"
  },
  {
    id: "t_5",
    username: "glamourousclaudia93",
    niche: "beauty",
    followers: 28000,
    engagement: "4.2%",
    platform: "instagram",
    profileUrl: "https://instagram.com/glamourousclaudia93",
    avatar: "https://viralacquisition.it/assets/avatars/claudia_daniela.jpg",
    status: "active",
    email: "claudia@talent.viralacquisition.it"
  },
  {
    id: "t_6",
    username: "c.lau.g",
    niche: "food",
    followers: 52300,
    engagement: "5.1%",
    platform: "instagram",
    avatar: "https://viralacquisition.it/assets/avatars/claudia_guercio.jpg",
    status: "active",
    email: "clau@talent.viralacquisition.it"
  },
  {
    id: "t_7",
    username: "enzaoliva_",
    niche: "lifestyle",
    followers: 74800,
    engagement: "6.0%",
    platform: "instagram",
    avatar: "https://viralacquisition.it/assets/avatars/vincenza_oliva.jpg",
    status: "active",
    email: "enza@talent.viralacquisition.it"
  },
  {
    id: "t_8",
    username: "maryphotofashionmakeupfood",
    niche: "beauty",
    followers: 95200,
    engagement: "4.9%",
    platform: "instagram",
    avatar: "https://viralacquisition.it/assets/avatars/maria_teresa.jpg",
    status: "active",
    email: "mary@talent.viralacquisition.it"
  }
];

// Read the live roster (localStorage-backed, seeded with MOCK_TALENTS).
export const loadTalents = () => {
  try {
    const saved = localStorage.getItem("agency_talents_v2");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* corrupted storage → fall back to mocks */ }
  return MOCK_TALENTS;
};
