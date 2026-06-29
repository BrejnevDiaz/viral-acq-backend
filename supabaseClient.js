// ─── BACKEND Supabase Client ──────────────────────────────────────────────────
// Utilisé UNIQUEMENT par server.js (Node.js).
// Lit les variables depuis process.env (chargées par le parseur .env manuel de server.js).
// Ne pas importer depuis les composants React — utiliser src/supabaseClient.js à la place.
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ SUPABASE_URL ou SUPABASE_KEY manquant dans le fichier .env !");
}

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
