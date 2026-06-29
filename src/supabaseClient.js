// ─── FRONTEND Supabase Client ─────────────────────────────────────────────────
// Utilisé UNIQUEMENT par les composants React (Vite).
// Lit les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY depuis import.meta.env.
// Ne pas importer depuis server.js — utiliser ./supabaseClient.js (racine) à la place.
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
