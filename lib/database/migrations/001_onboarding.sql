-- ============================================================
-- Migration 001: Onboarding fields
-- Run this in Supabase SQL Editor after schema.sql
-- ============================================================

-- Add preferred_sports array and onboarding_completed flag to users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS preferred_sports TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- Index for quickly finding users by sport (used for recommendations later)
CREATE INDEX IF NOT EXISTS users_preferred_sports_idx
  ON users USING GIN (preferred_sports);

-- ─── Auto-create users row on auth signup ──────────────────
-- When a new auth.users row is created (via magic link), insert a
-- matching row in public.users so onboarding can proceed.
-- display_name is set to email prefix as a placeholder; user updates it
-- in the ProfileSetup step.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, onboarding_completed)
  VALUES (
    NEW.id,
    NEW.email,
    -- placeholder display_name from email prefix; replaced during onboarding
    COALESCE(NULLIF(split_part(NEW.email, '@', 1), ''), 'New User'),
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
