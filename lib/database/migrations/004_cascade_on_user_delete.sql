-- ============================================================
-- Migration 004: Cascade behavior so account deletion works
-- Run this in Supabase SQL Editor after 003_settings_preferences.sql
--
-- auth.admin.deleteUser() was failing with "Database error deleting
-- user" because deleting public.users (cascaded from auth.users) was
-- blocked by FKs that had no ON DELETE action:
--   - clubs.created_by              (NOT NULL, no action)  -> CASCADE
--   - events.created_by             (NOT NULL, no action)  -> CASCADE
--   - club_memberships.responded_by (nullable, no action)  -> SET NULL
--   - event_rsvps.responded_by      (nullable, no action)  -> SET NULL
--
-- Deleting your account therefore deletes clubs/events you created
-- (matches the in-app confirmation copy) but preserves memberships
-- others hold — only the "approved by" pointer is nulled.
-- ============================================================

-- clubs.created_by -> CASCADE
ALTER TABLE clubs DROP CONSTRAINT IF EXISTS clubs_created_by_fkey;
ALTER TABLE clubs
  ADD CONSTRAINT clubs_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;

-- events.created_by -> CASCADE
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_created_by_fkey;
ALTER TABLE events
  ADD CONSTRAINT events_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;

-- club_memberships.responded_by -> SET NULL
ALTER TABLE club_memberships DROP CONSTRAINT IF EXISTS club_memberships_responded_by_fkey;
ALTER TABLE club_memberships
  ADD CONSTRAINT club_memberships_responded_by_fkey
  FOREIGN KEY (responded_by) REFERENCES users(id) ON DELETE SET NULL;

-- event_rsvps.responded_by -> SET NULL
ALTER TABLE event_rsvps DROP CONSTRAINT IF EXISTS event_rsvps_responded_by_fkey;
ALTER TABLE event_rsvps
  ADD CONSTRAINT event_rsvps_responded_by_fkey
  FOREIGN KEY (responded_by) REFERENCES users(id) ON DELETE SET NULL;
