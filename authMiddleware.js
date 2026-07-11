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

    if (authUser.email === "contact@brejnevdiaz.com" || authUser.email === "admin@acquisitionpro.fr" || authUser.email === "brejnevdiaz@gmail.com") {
      role = "admin";
      plan = "elite";
    }

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
  return res.status(403).json({ error: "Accès refusé — rôle insuffisant" });
};

export const requireBrand = [requireAuth, requireRole("brand")];
export const requireAnyUser = [requireAuth];
