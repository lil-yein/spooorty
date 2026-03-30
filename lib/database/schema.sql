-- ============================================================
-- Spooorty Database Schema
-- Run this in Supabase SQL Editor (supabase.com → project → SQL Editor)
-- ============================================================

-- ─── ENUMS ──────────────────────────────────────────────────

CREATE TYPE skill_level AS ENUM ('beginner', 'beg_int', 'intermediate', 'int_adv', 'advanced');
CREATE TYPE vibe_tag AS ENUM ('casual', 'competitive', 'teamwork', 'professional');
CREATE TYPE membership_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE membership_role AS ENUM ('member', 'admin', 'attendee');
CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'declined');
CREATE TYPE friend_source AS ENUM ('mutual_event', 'mutual_club', 'contacts', 'manual');
CREATE TYPE notification_type AS ENUM (
  'join_request', 'join_approved', 'join_rejected',
  'new_event', 'event_reminder',
  'friend_request', 'friend_accepted', 'member_joined'
);
CREATE TYPE notification_action AS ENUM ('approve_reject', 'accept_decline', 'navigate');

-- ─── USERS ──────────────────────────────────────────────────

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL CHECK (char_length(display_name) BETWEEN 2 AND 50),
  profile_photo_url TEXT,
  social_handle TEXT,          -- e.g., "@thelillianlee"
  social_platform TEXT,        -- e.g., "instagram"
  phone_hash TEXT,             -- hashed phone number for contact matching
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CLUBS ──────────────────────────────────────────────────

CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
  cover_photo_url TEXT,
  sport TEXT,
  description TEXT CHECK (char_length(description) <= 2000),
  location_name TEXT CHECK (char_length(location_name) <= 100),
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  schedule_type TEXT DEFAULT 'recurring' CHECK (schedule_type IN ('recurring', 'one_time')),
  schedule_day TEXT,           -- e.g., "saturday"
  schedule_time TEXT,          -- e.g., "12:30"
  end_time TEXT,
  skill_level skill_level NOT NULL DEFAULT 'beginner',
  fee_amount NUMERIC(7,2) DEFAULT 0 CHECK (fee_amount >= 0 AND fee_amount <= 9999),
  fee_frequency TEXT DEFAULT 'free' CHECK (fee_frequency IN ('monthly', 'per_session', 'free')),
  fee_method TEXT,             -- e.g., "Venmo @lingpickleball"
  vibe vibe_tag,
  capacity INTEGER CHECK (capacity IS NULL OR capacity >= 1),
  is_public BOOLEAN DEFAULT TRUE,
  requires_approval BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── EVENTS ─────────────────────────────────────────────────

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
  cover_photo_url TEXT,
  sport TEXT,
  description TEXT CHECK (char_length(description) <= 2000),
  location_name TEXT CHECK (char_length(location_name) <= 100),
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  event_date DATE NOT NULL,
  start_time TEXT NOT NULL,    -- e.g., "10:00"
  end_time TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,        -- e.g., "weekly", "biweekly"
  skill_level skill_level DEFAULT 'beginner',
  fee_amount NUMERIC(7,2) DEFAULT 0 CHECK (fee_amount >= 0 AND fee_amount <= 9999),
  fee_frequency TEXT DEFAULT 'free' CHECK (fee_frequency IN ('per_event', 'free')),
  vibe vibe_tag,
  capacity INTEGER CHECK (capacity IS NULL OR capacity >= 1),
  requires_approval BOOLEAN DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CLUB MEMBERSHIPS (User ↔ Club) ────────────────────────

CREATE TABLE club_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  role membership_role DEFAULT 'member',
  status membership_status DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES users(id),
  UNIQUE (user_id, club_id)
);

-- ─── EVENT RSVPs (User ↔ Event) ────────────────────────────

CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  role membership_role DEFAULT 'attendee',
  status membership_status DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES users(id),
  UNIQUE (user_id, event_id)
);

-- ─── FRIENDSHIPS (User ↔ User) ─────────────────────────────

CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status friendship_status DEFAULT 'pending',
  source friend_source,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  CHECK (user_id != friend_id)
);

-- Prevent duplicate friendships (A→B and B→A)
CREATE UNIQUE INDEX idx_friendships_unique
  ON friendships (LEAST(user_id, friend_id), GREATEST(user_id, friend_id));

-- ─── NOTIFICATIONS ──────────────────────────────────────────

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  reference_type TEXT CHECK (reference_type IN ('club', 'event', 'user')),
  reference_id UUID,
  action_type notification_action,
  is_read BOOLEAN DEFAULT FALSE,
  is_acted_on BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDEXES ────────────────────────────────────────────────

-- Feed: list active clubs/events sorted by recency
CREATE INDEX idx_clubs_active_created ON clubs(is_active, created_at DESC);
CREATE INDEX idx_events_active_date ON events(is_active, event_date ASC);

-- Club-Event relationship
CREATE INDEX idx_events_club ON events(club_id) WHERE club_id IS NOT NULL;

-- Membership lookups
CREATE INDEX idx_club_memberships_user ON club_memberships(user_id, status);
CREATE INDEX idx_club_memberships_club ON club_memberships(club_id, status);

-- Pending requests for admin notification
CREATE INDEX idx_club_memberships_pending ON club_memberships(club_id, status) WHERE status = 'pending';
CREATE INDEX idx_event_rsvps_pending ON event_rsvps(event_id, status) WHERE status = 'pending';

-- RSVP lookups
CREATE INDEX idx_event_rsvps_user ON event_rsvps(user_id, status);
CREATE INDEX idx_event_rsvps_event ON event_rsvps(event_id, status);

-- Friend lookups
CREATE INDEX idx_friendships_user ON friendships(user_id, status);
CREATE INDEX idx_friendships_friend ON friendships(friend_id, status);

-- Notifications (unread first, most recent)
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read, created_at DESC);

-- Calendar: events by date range
CREATE INDEX idx_events_date_range ON events(event_date, is_active);

-- Friend suggestions: find users in same clubs/events
CREATE INDEX idx_club_memberships_approved ON club_memberships(club_id, user_id) WHERE status = 'approved';
CREATE INDEX idx_event_rsvps_approved ON event_rsvps(event_id, user_id) WHERE status = 'approved';

-- Contact matching
CREATE INDEX idx_users_phone_hash ON users(phone_hash) WHERE phone_hash IS NOT NULL;

-- ─── ROW-LEVEL SECURITY ────────────────────────────────────

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users: anyone can read active users, users can update own profile
CREATE POLICY "Public read users" ON users FOR SELECT USING (is_active = true);
CREATE POLICY "Users update own" ON users FOR UPDATE USING (id = auth.uid());

-- Clubs: anyone can read active clubs, creators can update
CREATE POLICY "Public read clubs" ON clubs FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated create clubs" ON clubs FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admin update clubs" ON clubs FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM club_memberships
    WHERE club_memberships.club_id = clubs.id
    AND club_memberships.user_id = auth.uid()
    AND club_memberships.role = 'admin'
    AND club_memberships.status = 'approved'
  )
);

-- Events: anyone can read active events, creators can update
CREATE POLICY "Public read events" ON events FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated create events" ON events FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admin update events" ON events FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM event_rsvps
    WHERE event_rsvps.event_id = events.id
    AND event_rsvps.user_id = auth.uid()
    AND event_rsvps.role = 'admin'
    AND event_rsvps.status = 'approved'
  )
);

-- Club memberships: users can request join, admins can approve/reject
CREATE POLICY "Read club memberships" ON club_memberships FOR SELECT USING (true);
CREATE POLICY "Request join club" ON club_memberships FOR INSERT
  WITH CHECK (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "Admin approve club" ON club_memberships FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM club_memberships AS admin_check
    WHERE admin_check.club_id = club_memberships.club_id
    AND admin_check.user_id = auth.uid()
    AND admin_check.role = 'admin'
    AND admin_check.status = 'approved'
  )
);
CREATE POLICY "Leave club" ON club_memberships FOR DELETE USING (user_id = auth.uid());

-- Event RSVPs: users can request, admins can approve/reject
CREATE POLICY "Read event rsvps" ON event_rsvps FOR SELECT USING (true);
CREATE POLICY "Request join event" ON event_rsvps FOR INSERT
  WITH CHECK (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "Admin approve event" ON event_rsvps FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM event_rsvps AS admin_check
    WHERE admin_check.event_id = event_rsvps.event_id
    AND admin_check.user_id = auth.uid()
    AND admin_check.role = 'admin'
    AND admin_check.status = 'approved'
  )
);
CREATE POLICY "Leave event" ON event_rsvps FOR DELETE USING (user_id = auth.uid());

-- Friendships: users can send requests, recipients can respond
CREATE POLICY "Read friendships" ON friendships FOR SELECT USING (
  user_id = auth.uid() OR friend_id = auth.uid()
);
CREATE POLICY "Send friend request" ON friendships FOR INSERT
  WITH CHECK (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "Respond to friend request" ON friendships FOR UPDATE
  USING (friend_id = auth.uid());
CREATE POLICY "Delete friendship" ON friendships FOR DELETE
  USING (user_id = auth.uid() OR friend_id = auth.uid());

-- Notifications: users can only read/update their own
CREATE POLICY "Own notifications read" ON notifications FOR SELECT
  USING (recipient_id = auth.uid());
CREATE POLICY "Own notifications update" ON notifications FOR UPDATE
  USING (recipient_id = auth.uid());

-- ─── AUTO-UPDATE TIMESTAMPS ────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER clubs_updated_at BEFORE UPDATE ON clubs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── AUTO-CREATE USER PROFILE ON SIGNUP ─────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
