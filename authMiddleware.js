// ─── Auth Middleware (backend) ────────────────────────────────────────────────
// requireAuth : valide le JWT Supabase (header Authorization: Bearer <token>),
// lit le profil (role/plan) EN TANT QUE l'utilisateur (client éphémère scoped,
// respecte la RLS), et pose req.user = { id, email, role, plan, token }.
// requireRole(...roles) : 403 si le rôle ne matche pas. 'admin' passe toujours
// (miroir du bypass admin existant côté frontend dans handleAuth).
import { createClient } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient.js";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
    if (!token) {
      // Bypass local pour tester sans se connecter.
      // ⚠️ Verrouillé au développement : cette branche donne un compte admin
      // elite SANS AUCUN jeton. Si la variable était activée par erreur en
      // production (copier-coller d'un .env, variable Vercel oubliée), toute
      // requête anonyme deviendrait administratrice. Le garde-fou ne doit donc
      // pas reposer sur la seule discipline de configuration.
      if (process.env.ALLOW_DEV_AUTH === "true" && process.env.NODE_ENV !== "production") {
        req.user = { id: "local-bypass", email: "dev@localhost", role: "admin", plan: "elite", token: null };
        return next();
      }
      if (process.env.ALLOW_DEV_AUTH === "true" && process.env.NODE_ENV === "production") {
        console.error("🚨 ALLOW_DEV_AUTH est activé en production — bypass ignoré. Retirez cette variable.");
      }
      return res.status(401).json({ error: "Authentification requise" });
    }
    if (!supabase) {
      return res.status(500).json({ error: "Supabase non configuré côté serveur" });
    }

    // Validation du token auprès de Supabase Auth
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }
    const authUser = data.user;

    // Client éphémère par requête : anon key + token de l'appelant → lit
    // profiles.role/plan en tant que cet utilisateur (respecte la RLS).
    let role = "creator";
    let plan = "free";
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (supabaseUrl && anonKey) {
      try {
        const scoped = createClient(supabaseUrl, anonKey, {
          global: { headers: { Authorization: `Bearer ${token}` } },
        });
        const { data: profile } = await scoped
          .from("profiles")
          .select("role, plan")
          .eq("id", authUser.id)
          .single();
        if (profile) {
          role = profile.role || role;
          plan = profile.plan || plan;
        }
      } catch {
        // Profil illisible → rôle par défaut 'creator' (le moins privilégié)
      }
    }

    // ⚠️ SUPPRIMÉ le 28/07/2026 — un bloc accordait ici role=admin et
    // plan=elite à trois adresses e-mail codées en dur. La confirmation
    // d'e-mail étant désactivée dans Supabase, n'importe qui pouvait
    // s'inscrire AVEC l'une de ces adresses sans jamais y avoir accès, et
    // devenait administrateur. Une adresse e-mail non vérifiée n'est pas une
    // preuve d'identité : les privilèges se lisent désormais uniquement dans
    // `profiles.role`, indexé sur l'UUID Supabase et protégé en écriture par
    // le trigger `protect_profile_privileges` (chantier #24).
    // Pour (re)devenir admin : voir supabase/api_cache_and_admin.sql.

    req.user = { id: authUser.id, email: authUser.email, role, plan, token };
    next();
  } catch (err) {
    console.error("requireAuth error:", err.message);
    return res.status(401).json({ error: "Authentification échouée" });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  const role = req.user?.role;
  if (role === "admin" || roles.includes(role)) return next();
  // Un « Accès refusé » nu est indiagnosticable : on ne sait pas si le compte a
  // le mauvais rôle, si le profil n'a pas pu être lu, ou si la route est mal
  // protégée. On nomme donc le rôle constaté et celui attendu. Aucune fuite :
  // l'appelant est authentifié et ne lit que son propre rôle.
  console.warn(`403 ${req.method} ${req.originalUrl} — rôle « ${role} », attendu « ${roles.join(" | ")} » (user ${req.user?.id})`);
  return res.status(403).json({
    error: `Accès refusé — votre compte a le rôle « ${role} », cette fonctionnalité demande « ${roles.join(" ou ")} ».`,
    role,
    requiredRoles: roles,
  });
};

export const requireBrand = [requireAuth, requireRole("brand")];
export const requireAnyUser = [requireAuth];
