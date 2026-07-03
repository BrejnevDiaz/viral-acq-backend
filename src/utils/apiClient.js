// ─── API Client — wrapper fetch qui attache le JWT Supabase ──────────────────
// Toute requête vers le backend (server.js) doit passer par apiFetch() au lieu
// de fetch() : le token de session Supabase est ajouté en header Authorization,
// ce qui permet au backend (authMiddleware.js) d'identifier l'utilisateur.
// Exception : /api/image-proxy est consommé via <img src=...> (pas de headers
// possibles) et reste public — ne pas migrer ces usages.
import { supabase } from "../supabaseClient.js";

export async function apiFetch(url, options = {}) {
  let token = null;
  try {
    const { data } = await supabase.auth.getSession();
    token = data?.session?.access_token || null;
  } catch {
    // Pas de session — la requête part sans token (le backend répondra 401 si la route est protégée)
  }

  const headers = { ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return fetch(url, { ...options, headers });
}
