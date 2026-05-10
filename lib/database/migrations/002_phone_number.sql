-- ============================================================
-- Migration 002: Phone number
-- Run this in Supabase SQL Editor after 001_onboarding.sql
-- ============================================================

-- Plaintext phone for the Edit Profile field. The existing phone_hash
-- column stays in place for contact-matching lookups.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone_number TEXT
    CHECK (phone_number IS NULL OR char_length(phone_number) BETWEEN 4 AND 32);
