import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./AuthContext";

// ─── RoleContext : droits dérivés de l'identité ──────────────────────────────
// Rôle, palier tarifaire, compteurs d'usage et modale d'upgrade. Son provider
// est imbriqué dans AuthProvider et réagit à isLoggedIn/userId via useEffect
// (pas de second abonnement onAuthStateChange).
const RoleContext = createContext(null);

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
          setUserRole(profile.role);
          setUserTier(profile.role === "admin" ? "admin" : profile.plan);
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

  const openUpgradeModal = (data) => {
    if (data) setUpgradeModalData(data);
    setShowUpgradeModal(true);
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
    const limit = userTier === "free" ? 2 : userTier === "standard" ? 5 : Infinity;
    if (limit !== Infinity && shopAnalysisCount >= limit) {
      openUpgradeModal({
        tab: "shopanalyzer",
        title: uiLang === "fr" ? "Limite d'Analyses de Boutiques" : "Competitor Shop Analysis Limit",
        reason: uiLang === "fr"
          ? `Votre forfait ${userTier === "free" ? "Gratuit" : "Standard"} vous limite à ${limit} analyses par jour. Passez au forfait Pro ou Elite pour analyser en illimité !`
          : `Your ${userTier === "free" ? "Free" : "Standard"} plan limits you to ${limit} competitor shop analyses per day. Upgrade to Pro or Elite for unlimited access!`
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

  return (
    <RoleContext.Provider value={{
      userRole, userTier, shopAnalysisCount,
      selectedSignupTier, setSelectedSignupTier,
      signupRole, setSignupRole,
      showUpgradeModal, upgradeModalData,
      isUpgradingSim, upgradeSimSuccess,
      openUpgradeModal, closeUpgradeModal,
      upgradeTier, checkAnalysisAllowance,
    }}>
      {children}
    </RoleContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRole() {
  return useContext(RoleContext);
}
