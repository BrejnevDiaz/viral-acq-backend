import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./AuthContext";
import { TAB_MIN_TIER, getTierRank } from "../tierConfig";

// ─── RoleContext : droits dérivés de l'identité ──────────────────────────────
// Rôle, palier tarifaire, compteurs d'usage et modale d'upgrade. Son provider
// est imbriqué dans AuthProvider et réagit à isLoggedIn/userId via useEffect
// (pas de second abonnement onAuthStateChange).
const RoleContext = createContext(null);

// Free-tier creators are capped on weekly gig/brand proposal responses (see
// checkProposalAllowance below). No backend table yet — tracked client-side
// per user in localStorage, keyed by ISO week so it resets automatically.
export const WEEKLY_PROPOSAL_LIMIT = 3;
const getIsoWeekKey = (d = new Date()) => {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${weekNo}`;
};

export function RoleProvider({ children }) {
  const { isLoggedIn, userId } = useAuth();

  const [userTier, setUserTier]                     = useState("free");
  const [userRole, setUserRole]                     = useState("user");
  const [selectedSignupTier, setSelectedSignupTier] = useState("standard");
  const [signupRole, setSignupRole]                 = useState("brand");
  const [showUpgradeModal, setShowUpgradeModal]     = useState(false);
  const [upgradeModalData, setUpgradeModalData]     = useState({ tab: "", title: "", reason: "" });
  const [isUpgradingSim, setIsUpgradingSim]         = useState(false);
  const [upgradeSimSuccess, setUpgradeSimSuccess]   = useState(false);
  const [shopAnalysisCount, setShopAnalysisCount]   = useState(0);
  const [weeklyProposalCount, setWeeklyProposalCount] = useState(0);

  // Toujours lire le userId courant dans les callbacks différés (setTimeout),
  // pour que la simulation post-signup vise bien la session fraîchement créée.
  const userIdRef = useRef(userId);
  userIdRef.current = userId;

  useEffect(() => {
    if (isLoggedIn && !userId) {
      // Bypass propriétaire : pas de session Supabase → accès complet direct,
      // sans requête `profiles`.
      setUserRole("admin");
      setUserTier("elite");
      return;
    }
    if (isLoggedIn && userId) {
      (async () => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, plan")
          .eq("id", userId)
          .single();
        if (profile) {
          // Signup role choice (brand/creator toggle in AuthModal) is stashed
          // in localStorage rather than written inline at signup, so it applies
          // the same way whether the user just signed up with email/password
          // or came back from the Google OAuth redirect.
          const pendingRole = localStorage.getItem("va_pending_role");
          let role = profile.role;
          if (pendingRole && pendingRole !== profile.role && profile.role !== "admin") {
            const { error } = await supabase.from("profiles").update({ role: pendingRole }).eq("id", userId);
            if (!error) role = pendingRole;
          }
          localStorage.removeItem("va_pending_role");
          setUserRole(role);
          setUserTier(role === "admin" ? "admin" : profile.plan);
          const today = new Date().toISOString().split("T")[0];
          const { data: usage } = await supabase
            .from("shop_analysis_usage")
            .select("count")
            .eq("user_id", userId)
            .eq("analysis_date", today)
            .single();
          setShopAnalysisCount(usage?.count ?? 0);
        }
      })();
      return;
    }
    setUserTier("free");
    setUserRole("user");
    setShopAnalysisCount(0);
  }, [isLoggedIn, userId]);

  // Load this week's proposal count for the current user (resets on ISO week change).
  useEffect(() => {
    const storageKey = `va_weekly_proposals_${userId || "guest"}`;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      setWeeklyProposalCount(saved?.week === getIsoWeekKey() ? saved.count : 0);
    } catch {
      setWeeklyProposalCount(0);
    }
  }, [userId]);

  const openUpgradeModal = (data) => {
    if (data) setUpgradeModalData(data);
    setShowUpgradeModal(true);
  };

  const userTierRank = getTierRank(userTier);

  // Whole-tab gating — same hierarchy the visual lock icons in Sidebar/MobileTopbar read from.
  const hasTabAccess = (tabId) => {
    const required = TAB_MIN_TIER[tabId];
    if (required === undefined) return true;
    return userTierRank >= required;
  };

  // Checks access and, if denied, opens the upgrade modal with a tab-appropriate message.
  const requestTabAccess = (tabId, uiLang = "fr") => {
    if (hasTabAccess(tabId)) return true;
    openUpgradeModal({
      tab: tabId,
      title: uiLang === "fr" ? "🔥 Module Réservé aux Forfaits Supérieurs" : uiLang === "it" ? "🔥 Modulo Riservato ai Piani Superiori" : "🔥 Module Reserved for Higher Plans",
      reason: uiLang === "fr"
        ? "Le Sourcing CRM, le Vetting IA, le Matchmaking et les Ressources exclusives sont réservés aux forfaits Plus, Pro et Elite. Passez au niveau supérieur pour débloquer l'accès complet."
        : uiLang === "it"
        ? "Sourcing CRM, Vetting IA, Matchmaking e Risorse esclusive sono riservati ai piani Plus, Pro ed Elite. Passa al livello superiore per sbloccare l'accesso completo."
        : "Sourcing CRM, AI Vetting, Matchmaking and exclusive Resources are reserved for Plus, Pro and Elite plans. Upgrade to unlock full access."
    });
    return false;
  };

  const closeUpgradeModal = () => setShowUpgradeModal(false);

  // Simulation d'upgrade (ex-handleUpgradeSimulate). `onComplete` optionnel :
  // App.jsx s'en sert pour faire setCurrentTab(...) sans que RoleContext
  // connaisse l'état de navigation.
  const upgradeTier = (planId, onComplete) => {
    setIsUpgradingSim(true);
    setUpgradeSimSuccess(false);
    setTimeout(() => {
      setIsUpgradingSim(false);
      setUpgradeSimSuccess(true);
      setTimeout(async () => {
        setUserTier(planId);
        if (userIdRef.current) {
          await supabase.from("profiles").update({ plan: planId }).eq("id", userIdRef.current);
        }
        setUpgradeSimSuccess(false);
        setShowUpgradeModal(false);
        if (onComplete) onComplete();
      }, 1500);
    }, 2000);
  };

  // Quota d'analyses de boutiques (ex-handleAnalyzeStore).
  const checkAnalysisAllowance = (uiLang = "fr") => {
    const limit = userTier === "free" ? 2 : userTier === "standard" ? 5 : userTier === "plus" ? 10 : Infinity;
    if (limit !== Infinity && shopAnalysisCount >= limit) {
      const tierLabelFr = userTier === "free" ? "Gratuit" : userTier === "standard" ? "Standard" : "Plus";
      const tierLabelEn = userTier === "free" ? "Free" : userTier === "standard" ? "Standard" : "Plus";
      openUpgradeModal({
        tab: "shopanalyzer",
        title: uiLang === "fr" ? "Limite d'Analyses de Boutiques" : "Competitor Shop Analysis Limit",
        reason: uiLang === "fr"
          ? `Votre forfait ${tierLabelFr} vous limite à ${limit} analyses par jour. Passez au forfait Pro ou Elite pour analyser en illimité !`
          : `Your ${tierLabelEn} plan limits you to ${limit} competitor shop analyses per day. Upgrade to Pro or Elite for unlimited access!`
      });
      return false;
    }
    if (limit !== Infinity) {
      const newCount = shopAnalysisCount + 1;
      setShopAnalysisCount(newCount);
      if (userId) {
        const today = new Date().toISOString().split("T")[0];
        supabase.from("shop_analysis_usage").upsert(
          { user_id: userId, analysis_date: today, count: newCount },
          { onConflict: "user_id,analysis_date" }
        ).then(() => {});
      }
    }
    return true;
  };

  // Free-tier creators only: caps how many gig/brand proposals they can respond
  // to per week, and steers them toward Standard or a direct agency contract.
  const checkProposalAllowance = (uiLang = "fr") => {
    if (userTier !== "free") return true;
    if (weeklyProposalCount >= WEEKLY_PROPOSAL_LIMIT) {
      openUpgradeModal({
        tab: "talentagency",
        title: uiLang === "fr" ? "🔒 Limite Hebdomadaire Atteinte" : uiLang === "it" ? "🔒 Limite Settimanale Raggiunto" : "🔒 Weekly Limit Reached",
        reason: uiLang === "fr"
          ? `Le forfait Gratuit limite vos candidatures à ${WEEKLY_PROPOSAL_LIMIT} par semaine. En tant qu'utilisateur gratuit, votre profil n'est pas prioritaire face aux marques. Pour devenir un Influenceur Confirmé et prioritaire, vous devez signer un contrat exclusif avec l'agence Viral Acquisition (ou passer au forfait Standard).`
          : uiLang === "it"
          ? `Il piano Gratuito limita le tue candidature a ${WEEKLY_PROPOSAL_LIMIT} a settimana. Come utente gratuito, il tuo profilo non è prioritario per i brand. Per diventare un Influencer Confermato e prioritario, devi firmare un contratto esclusivo con l'agenzia Viral Acquisition (oppure passare al piano Standard).`
          : `The Free plan limits your applications to ${WEEKLY_PROPOSAL_LIMIT} per week. As a free user, your profile isn't prioritized with brands. To become a Confirmed, priority Influencer, you need to sign an exclusive contract with the Viral Acquisition agency (or upgrade to the Standard plan).`
      });
      return false;
    }
    const newCount = weeklyProposalCount + 1;
    setWeeklyProposalCount(newCount);
    try {
      localStorage.setItem(`va_weekly_proposals_${userId || "guest"}`, JSON.stringify({ week: getIsoWeekKey(), count: newCount }));
    } catch {
      // localStorage unavailable — the count still updates for this session
    }
    return true;
  };

  const switchUserRole = async (newRole) => {
    if (!userIdRef.current) {
      setUserRole(newRole);
      return;
    }
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userIdRef.current);
    if (!error) {
      setUserRole(newRole);
    }
  };

  return (
    <RoleContext.Provider value={{
      userRole, userTier, userTierRank, shopAnalysisCount,
      selectedSignupTier, setSelectedSignupTier,
      signupRole, setSignupRole,
      showUpgradeModal, upgradeModalData,
      isUpgradingSim, upgradeSimSuccess,
      openUpgradeModal, closeUpgradeModal,
      upgradeTier, checkAnalysisAllowance,
      hasTabAccess, requestTabAccess,
      weeklyProposalCount, checkProposalAllowance,
      switchUserRole,
    }}>
      {children}
    </RoleContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRole() {
  return useContext(RoleContext);
}
