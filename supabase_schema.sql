-- ============================================================
-- Viral Acquisition — Supabase Schema
-- Paste & run in Supabase Dashboard → SQL Editor
-- Disable "Email confirmations" in Auth → Settings before use.
-- ============================================================

-- ─── Profiles ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email      TEXT        NOT NULL,
  role       TEXT        NOT NULL DEFAULT 'user'     CHECK (role IN ('user', 'creator', 'admin')),
  plan       TEXT        NOT NULL DEFAULT 'free'     CHECK (plan IN ('free', 'standard', 'pro', 'elite')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Existing databases: widen the constraint to allow 'creator' (App.jsx already
-- gates the dashboard on role === 'creator', but signup never wrote that value
-- until now — this was a wired-but-unreachable feature).
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'creator', 'admin'));

-- Auto-create profile row on every new signup.
-- brejnevdiaz@gmail.com est automatiquement promu admin + elite.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  IF NEW.email = 'brejnevdiaz@gmail.com' THEN
    INSERT INTO public.profiles (id, email, role, plan)
    VALUES (NEW.id, NEW.email, 'admin', 'elite');
  ELSE
    INSERT INTO public.profiles (id, email, role, plan)
    VALUES (NEW.id, NEW.email, 'user', 'free');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "admins_read_all"  ON public.profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ─── Shop Analysis Daily Quota ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shop_analysis_usage (
  id            SERIAL  PRIMARY KEY,
  user_id       UUID    NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  analysis_date DATE    NOT NULL DEFAULT CURRENT_DATE,
  count         INTEGER NOT NULL DEFAULT 1,
  UNIQUE (user_id, analysis_date)
);

ALTER TABLE public.shop_analysis_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usage_read_own"   ON public.shop_analysis_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "usage_insert_own" ON public.shop_analysis_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "usage_update_own" ON public.shop_analysis_usage FOR UPDATE USING (auth.uid() = user_id);

-- ─── Roster Applications ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.roster_applications (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  username   TEXT        NOT NULL,
  platform   TEXT        NOT NULL DEFAULT 'instagram',
  niche      TEXT        NOT NULL DEFAULT 'beauty',
  followers  INTEGER     NOT NULL DEFAULT 0,
  engagement TEXT        NOT NULL DEFAULT '5.0%',
  email      TEXT,
  status     TEXT        NOT NULL DEFAULT 'pending_validation'
               CHECK (status IN ('pending_validation', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.roster_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "roster_read_own"   ON public.roster_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "roster_insert_own" ON public.roster_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "roster_admin_all"  ON public.roster_applications FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ─── API Cache (key-value, TTL géré par expires_at) ──────────────────────────
-- Utilisé par les routes /api/adspy, /api/product-finder, /api/shop-analyzer
-- pour éviter de re-appeler les APIs externes sur des recherches identiques.
CREATE TABLE IF NOT EXISTS public.api_cache (
  cache_key  TEXT        PRIMARY KEY,
  data       JSONB       NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

ALTER TABLE public.api_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_only" ON public.api_cache
  USING (auth.role() = 'service_role');

-- ─── Marketplace Videos (UGC vendu par les créateurs) ─────────────────────────
-- Le fichier vidéo brut vit dans le bucket Storage "marketplace-videos"
-- (créé via script, public en lecture) ; cette table stocke ses métadonnées.
CREATE TABLE IF NOT EXISTS public.marketplace_videos (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  username    TEXT        NOT NULL,
  niche       TEXT        NOT NULL DEFAULT 'lifestyle',
  product     TEXT        NOT NULL,
  price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  video_url   TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.marketplace_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "marketplace_videos_read_all"   ON public.marketplace_videos FOR SELECT USING (status = 'active');
CREATE POLICY "marketplace_videos_insert_own" ON public.marketplace_videos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "marketplace_videos_update_own" ON public.marketplace_videos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "marketplace_videos_delete_own" ON public.marketplace_videos FOR DELETE USING (auth.uid() = user_id);

-- Policies RLS sur le bucket Storage lui-même (distinctes de celles de la table
-- ci-dessus) : sans elles, l'upload échoue avec "new row violates row-level
-- security policy" même si la table marketplace_videos est correctement configurée.
-- Le chemin uploadé est "<user_id>/<timestamp>-<filename>", d'où le test sur
-- le 1er segment du chemin pour restreindre chacun à son propre dossier.
CREATE POLICY "marketplace_videos_storage_read_all" ON storage.objects FOR SELECT
  USING (bucket_id = 'marketplace-videos');
CREATE POLICY "marketplace_videos_storage_insert_own" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'marketplace-videos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "marketplace_videos_storage_delete_own" ON storage.objects FOR DELETE
  USING (bucket_id = 'marketplace-videos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ─── Admin assignment (run after brejnevdiaz@gmail.com has signed up) ─────────
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'brejnevdiaz@gmail.com';
