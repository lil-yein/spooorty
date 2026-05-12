-- ============================================================
-- Migration 003: Notification + privacy preferences
-- Run this in Supabase SQL Editor after 002_phone_number.sql
-- ============================================================

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS notif_friend_request BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS notif_friend_accepted BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS notif_join_request BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS notif_join_decision BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS notif_event_update BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS notif_club_update BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS account_visibility TEXT NOT NULL DEFAULT 'public'
    CHECK (account_visibility IN ('public', 'private')),
  ADD COLUMN IF NOT EXISTS friend_suggestions_from_contacts BOOLEAN NOT NULL DEFAULT FALSE;
