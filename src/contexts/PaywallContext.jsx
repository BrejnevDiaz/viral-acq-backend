import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useRole } from "./RoleContext";

// ─── PaywallContext : crédits de déblocage + offre de bienvenue 48h ───────────
// Stratégie "montrer 100% de la valeur, verrouiller 100% de l'action" :
// les métriques des créateurs sont publiques, leur identité/contact est le
// produit. Les tiers limités consomment des crédits pour révéler un profil ;
// à 0 crédit, la modale paywall contextuelle prend le relais.
// Persistance localStorage par userId — même pattern que le quota hebdo de
// proposals dans RoleContext (pas de table backend encore ; à migrer vers
// Supabase quand le checkout réel remplacera la simulation).

const PaywallContext = createContext(null);

// Crédits de révélation par palier. Plus/Pro/Elite = accès total (cohérent
// avec TAB_MIN_TIER où les outils "brands" s'ouvrent au rang 2).
export const UNLOCK_ALLOWANCE = { free: 3, standard: 10 };

export const OFFER_DURATION_MS = 48 * 3600 * 1000; // 48h
export const OFFER_DISCOUNT = 0.3;                 // -30% premier mois

export function PaywallProvider({ children }) {
  const { isLoggedIn, userId } = useAuth();
  const { userRole, userTierRank, userTier } = useRole();

  const storageKey = (suffix) => `va_${suffix}_${userId || "guest"}`;

  const [unlockedIds, setUnlockedIds] = useState([]);
  const [offerDeadline, setOfferDeadline] = useState(null);
  const [paywall, setPaywall] = useState({ open: false, talent: null });

  // Rôles à accès total : marques payantes rang ≥2, admin, et les créateurs
  // (le leaderboard est LEUR vitrine — on ne floute jamais un créateur à
  // lui-même, c'est le moteur de rétention côté supply).
  const hasFullReveal = userRole === "admin" || userRole === "creator" || userTierRank >= 2;

  // Charger les déblocages + démarrer l'horloge 48h à la première connexion.
  useEffect(() => {
    if (!isLoggedIn) { setUnlockedIds([]); setOfferDeadline(null); return; }
    try {
      setUnlockedIds(JSON.parse(localStorage.getItem(storageKey("unlocked_creators")) || "[]"));
    } catch { setUnlockedIds([]); }
    try {
      const saved = Number(localStorage.getItem(storageKey("offer_deadline")));
      if (saved > 0) {
        setOfferDeadline(saved);
      } else {
        // Première session de ce compte : l'offre démarre maintenant. Vraie
        // deadline — jamais réinitialisée, sinon plus personne n'y croit.
        const deadline = Date.now() + OFFER_DURATION_MS;
        localStorage.setItem(storageKey("offer_deadline"), String(deadline));
        setOfferDeadline(deadline);
      }
    } catch { setOfferDeadline(null); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, userId]);

  const allowance = UNLOCK_ALLOWANCE[userTier] ?? Infinity;
  const creditsLeft = hasFullReveal ? Infinity : Math.max(0, allowance - unlockedIds.length);

  const isUnlocked = (talentId) => hasFullReveal || unlockedIds.includes(talentId);

  const openPaywall = (talent = null) => setPaywall({ open: true, talent });
  const closePaywall = () => setPaywall((p) => ({ ...p, open: false }));

  // Tente de révéler un profil. Consomme un crédit, ou ouvre le paywall
  // contextuel au moment exact de l'intention maximale (le clic).
  const unlockCreator = (talent) => {
    if (isUnlocked(talent.id)) return true;
    if (creditsLeft > 0) {
      const next = [...unlockedIds, talent.id];
      setUnlockedIds(next);
      try { localStorage.setItem(storageKey("unlocked_creators"), JSON.stringify(next)); } catch { /* session-only fallback */ }
      return true;
    }
    openPaywall(talent);
    return false;
  };

  const isOfferActive = !hasFullReveal && offerDeadline != null && offerDeadline > Date.now();

  return (
    <PaywallContext.Provider value={{
      hasFullReveal, creditsLeft, allowance,
      isUnlocked, unlockCreator,
      paywall, openPaywall, closePaywall,
      offerDeadline, isOfferActive,
    }}>
      {children}
    </PaywallContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePaywall() {
  return useContext(PaywallContext);
}
