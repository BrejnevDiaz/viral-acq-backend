-- ============================================================
-- Viral Acquisition — Supabase Schema
-- Paste & run in Supabase Dashboard → SQL Editor
-- Disable "Email confirmations" in Auth → Settings before use.
-- ============================================================

-- ─── Profiles ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email      TEXT        NOT NULL,
  role       TEXT        NOT NULL DEFAULT 'user'     CHECK (role IN ('user', 'admin')),
  plan       TEXT        NOT NULL DEFAULT 'free'     CHECK (plan IN ('free', 'standard', 'pro', 'elite')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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

-- ─── Admin assignment (run after brejnevdiaz@gmail.com has signed up) ─────────
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'brejnevdiaz@gmail.com';
