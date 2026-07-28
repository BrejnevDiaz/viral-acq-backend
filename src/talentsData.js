// ─── Vivier de créateurs ─────────────────────────────────────────────────────
// Utilisé par TalentAgencyTab (gestion du portefeuille) et CreatorScoreTab
// (classement). Depuis le 28/07/2026, la source de vérité est la table
// `agency_talents` : le tableau ci-dessous n'est plus qu'un jeu de
// démonstration servant de repli quand l'utilisateur n'a encore aucun talent.
import { supabase } from "./supabaseClient";

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
    email: "diariatou@talent.viralacquisition.it",
    region: "FR"
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
    email: "nora@talent.viralacquisition.it",
    region: "FR"
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
    email: "jessica@talent.viralacquisition.it",
    region: "IT"
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
    email: "katerina@talent.viralacquisition.it",
    region: "IT"
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
    email: "claudia@talent.viralacquisition.it",
    region: "IT"
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
    email: "clau@talent.viralacquisition.it",
    region: "IT"
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
    email: "enza@talent.viralacquisition.it",
    region: "IT"
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
    email: "mary@talent.viralacquisition.it",
    region: "IT"
  }
];

// ⚠️ OBSOLÈTE depuis le 28/07/2026 — conservée pour l'affichage initial.
// Le roster ne vit plus dans le localStorage mais dans la table
// `agency_talents` : TalentAgencyTab n'écrit donc plus jamais sous cette clé.
// Cette fonction ne sert désormais qu'à peupler le classement le temps que la
// vraie requête revienne, pour éviter un tableau vide pendant une seconde.
// Utiliser `fetchTalents()` ci-dessous pour les données réelles.
export const loadTalents = () => {
  try {
    const saved = localStorage.getItem("agency_talents_v2");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* stockage corrompu → on retombe sur le jeu de démonstration */ }
  return MOCK_TALENTS;
};

// Roster réel. Renvoie le jeu de démonstration si l'utilisateur n'est pas
// connecté ou n'a encore aucun talent : un classement vide n'apprendrait rien
// et donnerait l'impression que la page est cassée.
export const fetchTalents = async () => {
  if (!supabase) return MOCK_TALENTS;
  const { data, error } = await supabase
    .from("agency_talents")
    .select("id, username, niche, followers, engagement, platform, profile_url, avatar, status, email, region");
  if (error) {
    console.error("❌ Classement — lecture du roster :", error.message);
    return MOCK_TALENTS;
  }
  if (!data || data.length === 0) return MOCK_TALENTS;
  return data.map(r => ({
    id: r.id, username: r.username, niche: r.niche, followers: r.followers,
    engagement: r.engagement, platform: r.platform, profileUrl: r.profile_url,
    avatar: r.avatar, status: r.status, email: r.email, region: r.region,
  }));
};
