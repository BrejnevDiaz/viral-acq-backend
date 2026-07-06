import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

// ─── AuthContext : identité/session pure ─────────────────────────────────────
// Connecté ou non, qui (userId / userEmail), et l'état du formulaire de login.
// Les droits dérivés (rôle, palier, usage) vivent dans RoleContext.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn]         = useState(false);
  const [userId, setUserId]                 = useState(null);
  const [userEmail, setUserEmail]           = useState("");
  const [authMode, setAuthMode]             = useState("login");
  const [emailInput, setEmailInput]         = useState("");
  const [passInput, setPassInput]           = useState("");
  const [authError, setAuthError]           = useState("");
  const [authLoading, setAuthLoading]       = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ─── Supabase Auth (partie session uniquement — profils/usage : RoleContext) ─
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setUserEmail(session.user.email || "");
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        setUserEmail("");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Retourne true/false selon le succès — AuthModal s'en sert pour déclencher
  // la simulation d'upgrade post-signup via RoleContext.upgradeTier.
  const handleAuth = async (e, uiLang = "fr") => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      if (emailInput === "brejnevdiaz@gmail.com" && passInput === "B1ss0u@k1") {
        // Bypass total des sécurités Supabase pour le propriétaire
        // (pas de session Supabase → userId reste null ; RoleContext détecte
        // ce cas via `isLoggedIn && !userId` et assigne admin/elite)
        setIsLoggedIn(true);
        setUserEmail(emailInput);
        setAuthError("");
        return true;
      }

      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailInput,
          password: passInput,
        });
        if (error) {
          setAuthError(uiLang === "fr" ? "Email ou mot de passe incorrect." : uiLang === "it" ? "Email o password errata." : "Incorrect email or password.");
          return false;
        }
        // onAuthStateChange handles isLoggedIn / userId / userEmail updates
        return true;
      } else {
        const { error } = await supabase.auth.signUp({
          email: emailInput,
          password: passInput,
        });
        if (error) {
          setAuthError(error.message);
          return false;
        }
        return true;
      }
    } catch (err) {
      // Network failure or Supabase misconfiguration (e.g. invalid URL/key) — surface it
      // instead of failing silently, which previously left the form looking unresponsive.
      setAuthError(uiLang === "fr" ? "Connexion au serveur impossible. Réessayez dans un instant." : uiLang === "it" ? "Impossibile connettersi al server. Riprova tra un momento." : "Could not reach the server. Please try again in a moment.");
      console.error("Auth error:", err);
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = () => supabase.auth.signOut();

  // Redirects to Google, then back to the current page — onAuthStateChange
  // picks up the resulting session the same way it does for password auth.
  const signInWithGoogle = async (uiLang = "fr") => {
    setAuthError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      setAuthError(uiLang === "fr" ? "Connexion Google impossible. Réessayez." : uiLang === "it" ? "Accesso con Google non riuscito. Riprova." : "Google sign-in failed. Please try again.");
      console.error("Google auth error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn, userId, userEmail,
      authMode, setAuthMode,
      emailInput, setEmailInput,
      passInput, setPassInput,
      authError, authLoading,
      showLoginModal, setShowLoginModal,
      handleAuth, signOut, signInWithGoogle,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
