-- ============================================================
-- Spooorty Seed Data
-- Run this in Supabase SQL Editor AFTER schema.sql
--
-- Creates 10 test users, 5 clubs, 6 events, memberships,
-- friendships, and notifications.
--
-- NOTE: Your real auth user will be separate from these.
--       After you log in with magic link, run the "attach"
--       query at the bottom to link your account.
-- ============================================================

-- ─── 1. Create auth users (triggers auto-create public.users) ─

INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at, instance_id, aud, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'ling@test.com',       NOW(), NOW(), NOW(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000002', 'arthur@test.com',     NOW(), NOW(), NOW(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000003', 'thomas@test.com',     NOW(), NOW(), NOW(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000004', 'brian@test.com',      NOW(), NOW(), NOW(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000005', 'diana@test.com',      NOW(), NOW(), NOW(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000006', 'emma@test.com',       NOW(), NOW(), NOW(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000007', 'felix@test.com',      NOW(), NOW(), NOW(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000008', 'grace@test.com',      NOW(), NOW(), NOW(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000009', 'henry@test.com',      NOW(), NOW(), NOW(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000010', 'sarah@test.com',      NOW(), NOW(), NOW(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- ─── 2. Update user profiles with names and handles ──────────

UPDATE public.users SET display_name = 'Ling Cao',       social_handle = '@lingcao',       social_platform = 'instagram' WHERE id = '00000000-0000-0000-0000-000000000001';
UPDATE public.users SET display_name = 'Arthur Liao',    social_handle = '@arthurliao',    social_platform = 'instagram' WHERE id = '00000000-0000-0000-0000-000000000002';
UPDATE public.users SET display_name = 'Thomas Lu',      social_handle = '@thomaslu',      social_platform = 'instagram' WHERE id = '00000000-0000-0000-0000-000000000003';
UPDATE public.users SET display_name = 'Brian Kim',      social_handle = '@briankim',      social_platform = 'instagram' WHERE id = '00000000-0000-0000-0000-000000000004';
UPDATE public.users SET display_name = 'Diana Chen',     social_handle = '@dianachen',     social_platform = 'instagram' WHERE id = '00000000-0000-0000-0000-000000000005';
UPDATE public.users SET display_name = 'Emma Wilson',    social_handle = '@emmawilson',    social_platform = 'instagram' WHERE id = '00000000-0000-0000-0000-000000000006';
UPDATE public.users SET display_name = 'Felix Park',     social_handle = '@felixpark',     social_platform = 'instagram' WHERE id = '00000000-0000-0000-0000-000000000007';
UPDATE public.users SET display_name = 'Grace Liu',      social_handle = '@graceliu',      social_platform = 'instagram' WHERE id = '00000000-0000-0000-0000-000000000008';
UPDATE public.users SET display_name = 'Henry Zhang',    social_handle = '@henryzhang',    social_platform = 'instagram' WHERE id = '00000000-0000-0000-0000-000000000009';
UPDATE public.users SET display_name = 'Sarah Martinez', social_handle = '@sarahm',        social_platform = 'instagram' WHERE id = '00000000-0000-0000-0000-000000000010';

-- ─── 3. Create clubs ────────────────────────────────────────

INSERT INTO clubs (id, name, sport, description, location_name, location_lat, location_lng, skill_level, fee_amount, fee_frequency, vibe, capacity, is_public, requires_approval, created_by)
VALUES
  ('10000000-0000-0000-0000-000000000001',
   'Cool Pickleball Club',
   'Pickleball',
   'A fun and welcoming pickleball club for players of all levels. We meet weekly for games, drills, and social events. Beginners especially welcome — we have loaner paddles!',
   'New York, NY', 40.7128, -74.0060,
   'beginner', 20, 'monthly', 'casual', 20, true, false,
   '00000000-0000-0000-0000-000000000001'),

  ('10000000-0000-0000-0000-000000000002',
   'Fun Hockey Game',
   'Hockey',
   'Competitive hockey games every week. We play hard but fair. Looking for skilled players who love the game. Full gear required.',
   'Brooklyn, NY', 40.6782, -73.9442,
   'intermediate', 25, 'monthly', 'competitive', 16, true, true,
   '00000000-0000-0000-0000-000000000003'),

  ('10000000-0000-0000-0000-000000000003',
   'Saturday Running Crew',
   'Running',
   'We run every Saturday rain or shine. All paces welcome. Great way to explore Central Park trails! Post-run coffee included.',
   'Central Park, NY', 40.7829, -73.9654,
   'beg_int', 15, 'monthly', 'casual', NULL, true, false,
   '00000000-0000-0000-0000-000000000002'),

  ('10000000-0000-0000-0000-000000000004',
   'Exciting Handball Team',
   'Handball',
   'Handball enthusiasts unite! Weekly practice sessions and friendly matches in Queens. We compete in the NYC recreational league.',
   'Queens, NY', 40.7282, -73.7949,
   'beg_int', 18, 'monthly', 'teamwork', 14, true, true,
   '00000000-0000-0000-0000-000000000001'),

  ('10000000-0000-0000-0000-000000000005',
   'Weekend Tennis League',
   'Tennis',
   'Sunday morning tennis league with round-robin tournaments. Intermediate to advanced players. Courts reserved at Flushing Meadows.',
   'Flushing Meadows, NY', 40.7400, -73.8408,
   'int_adv', 22, 'monthly', 'competitive', 12, true, true,
   '00000000-0000-0000-0000-000000000002');

-- ─── 4. Create events ───────────────────────────────────────

INSERT INTO events (id, club_id, name, sport, description, location_name, location_lat, location_lng, event_date, start_time, end_time, skill_level, fee_amount, fee_frequency, vibe, capacity, requires_approval, created_by)
VALUES
  ('20000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000001',
   'Sunset Yoga Session',
   'Yoga',
   'Relax and unwind with a sunset yoga session in Prospect Park. All levels welcome — mats provided. Stay for community snacks after!',
   'Prospect Park, NY', 40.6602, -73.9690,
   '2026-04-05', '17:30', '19:00',
   'beginner', 10, 'per_event', 'casual', 30, false,
   '00000000-0000-0000-0000-000000000001'),

  ('20000000-0000-0000-0000-000000000002',
   NULL,
   'Beach Volleyball Tourney',
   'Volleyball',
   'Annual beach volleyball tournament at Coney Island! Competitive 4v4 format with prizes for the top teams. Sign up solo or with a squad.',
   'Coney Island, NY', 40.5749, -73.9857,
   '2026-04-12', '10:00', '16:00',
   'int_adv', 30, 'per_event', 'competitive', 32, true,
   '00000000-0000-0000-0000-000000000002'),

  ('20000000-0000-0000-0000-000000000003',
   '10000000-0000-0000-0000-000000000003',
   'Central Park 10K',
   'Running',
   'Saturday morning 10K through Central Park. All paces welcome. Meet at Engineers Gate (90th & 5th). Bagels after!',
   'Central Park, NY', 40.7829, -73.9654,
   '2026-04-05', '08:00', '10:00',
   'beg_int', 0, 'free', 'casual', NULL, false,
   '00000000-0000-0000-0000-000000000002'),

  ('20000000-0000-0000-0000-000000000004',
   '10000000-0000-0000-0000-000000000002',
   'Hockey Pickup Game',
   'Hockey',
   'Casual pickup hockey game. Full gear required. First come first served for goalies.',
   'Brooklyn Ice Rink, NY', 40.6782, -73.9442,
   '2026-04-08', '19:00', '21:00',
   'intermediate', 15, 'per_event', 'competitive', 16, false,
   '00000000-0000-0000-0000-000000000003'),

  ('20000000-0000-0000-0000-000000000005',
   '10000000-0000-0000-0000-000000000005',
   'Tennis Round Robin',
   'Tennis',
   'Monthly round robin tournament. Intermediate+ level. Each player guaranteed 3 matches minimum.',
   'Flushing Meadows, NY', 40.7400, -73.8408,
   '2026-04-19', '09:00', '13:00',
   'int_adv', 22, 'per_event', 'competitive', 12, true,
   '00000000-0000-0000-0000-000000000002'),

  ('20000000-0000-0000-0000-000000000006',
   NULL,
   'Pickleball Social',
   'Pickleball',
   'Open pickleball social — all levels welcome! Rotating partners so you get to play with everyone. Snacks and drinks provided.',
   'Hudson River Park, NY', 40.7317, -74.0107,
   '2026-04-19', '14:00', '17:00',
   'beginner', 5, 'per_event', 'casual', 24, false,
   '00000000-0000-0000-0000-000000000001');

-- ─── 5. Club memberships ────────────────────────────────────

-- Cool Pickleball Club (club-1): Ling (admin), Arthur, Thomas, Emma
INSERT INTO club_memberships (user_id, club_id, role, status) VALUES
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'admin',  'approved'),
  ('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'member', 'approved'),
  ('00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'member', 'approved'),
  ('00000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', 'member', 'approved');

-- Fun Hockey Game (club-2): Thomas (admin), Ling, Felix, Henry
INSERT INTO club_memberships (user_id, club_id, role, status) VALUES
  ('00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'admin',  'approved'),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'member', 'approved'),
  ('00000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', 'member', 'approved'),
  ('00000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000002', 'member', 'approved');

-- Saturday Running Crew (club-3): Arthur (admin), Brian, Henry, Sarah
INSERT INTO club_memberships (user_id, club_id, role, status) VALUES
  ('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 'admin',  'approved'),
  ('00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', 'member', 'approved'),
  ('00000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000003', 'member', 'approved'),
  ('00000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000003', 'member', 'approved');

-- Exciting Handball Team (club-4): Ling (admin), Diana, Grace
INSERT INTO club_memberships (user_id, club_id, role, status) VALUES
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'admin',  'approved'),
  ('00000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000004', 'member', 'approved'),
  ('00000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000004', 'member', 'approved');

-- Weekend Tennis League (club-5): Arthur (admin), Ling, Brian, Emma
INSERT INTO club_memberships (user_id, club_id, role, status) VALUES
  ('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005', 'admin',  'approved'),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 'member', 'approved'),
  ('00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000005', 'member', 'approved'),
  ('00000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000005', 'member', 'approved');

-- One pending request: Grace wants to join Hockey
INSERT INTO club_memberships (user_id, club_id, role, status) VALUES
  ('00000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002', 'member', 'pending');

-- ─── 6. Event RSVPs ─────────────────────────────────────────

-- Sunset Yoga: Ling (admin), Thomas, Diana, Sarah
INSERT INTO event_rsvps (user_id, event_id, role, status) VALUES
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'admin',    'approved'),
  ('00000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 'attendee', 'approved'),
  ('00000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', 'attendee', 'approved'),
  ('00000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000001', 'attendee', 'approved');

-- Beach Volleyball Tourney: Arthur (admin), Felix, Brian, Henry
INSERT INTO event_rsvps (user_id, event_id, role, status) VALUES
  ('00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'admin',    'approved'),
  ('00000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000002', 'attendee', 'approved'),
  ('00000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', 'attendee', 'approved'),
  ('00000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000002', 'attendee', 'approved');

-- Central Park 10K: Arthur (admin), Ling, Sarah, Grace
INSERT INTO event_rsvps (user_id, event_id, role, status) VALUES
  ('00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', 'admin',    'approved'),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'attendee', 'approved'),
  ('00000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000003', 'attendee', 'approved'),
  ('00000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000003', 'attendee', 'approved');

-- Hockey Pickup: Thomas (admin), Ling, Felix
INSERT INTO event_rsvps (user_id, event_id, role, status) VALUES
  ('00000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', 'admin',    'approved'),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 'attendee', 'approved'),
  ('00000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000004', 'attendee', 'approved');

-- Tennis Round Robin: Arthur (admin), Ling, Emma
INSERT INTO event_rsvps (user_id, event_id, role, status) VALUES
  ('00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', 'admin',    'approved'),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', 'attendee', 'approved'),
  ('00000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000005', 'attendee', 'approved');

-- Pickleball Social: Ling (admin), Emma, Diana, Grace, Sarah
INSERT INTO event_rsvps (user_id, event_id, role, status) VALUES
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', 'admin',    'approved'),
  ('00000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000006', 'attendee', 'approved'),
  ('00000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000006', 'attendee', 'approved'),
  ('00000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000006', 'attendee', 'approved'),
  ('00000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000006', 'attendee', 'approved');

-- Pending RSVPs: Diana wants to join Beach Volleyball (requires approval)
INSERT INTO event_rsvps (user_id, event_id, role, status) VALUES
  ('00000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000002', 'attendee', 'pending');

-- ─── 7. Friendships ─────────────────────────────────────────

-- Accepted friendships
INSERT INTO friendships (user_id, friend_id, status, source, accepted_at) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'accepted', 'mutual_club',  NOW()),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'accepted', 'mutual_club',  NOW()),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'accepted', 'mutual_event', NOW()),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'accepted', 'mutual_club',  NOW()),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006', 'accepted', 'contacts',     NOW()),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000009', 'accepted', 'mutual_club',  NOW()),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000010', 'accepted', 'contacts',     NOW());

-- Pending friend requests
INSERT INTO friendships (user_id, friend_id, status, source) VALUES
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'pending', 'mutual_club'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000007', 'pending', 'mutual_event');

-- ─── 8. Notifications ───────────────────────────────────────

-- Ling's notifications
INSERT INTO notifications (recipient_id, type, title, body, reference_type, reference_id, action_type) VALUES
  ('00000000-0000-0000-0000-000000000001', 'friend_request',  'Friend Request',       'Emma Wilson sent you a friend request', 'user', '00000000-0000-0000-0000-000000000006', 'accept_decline'),
  ('00000000-0000-0000-0000-000000000001', 'join_request',    'Join Request',          'Grace Liu wants to join Fun Hockey Game', 'club', '10000000-0000-0000-0000-000000000002', 'approve_reject'),
  ('00000000-0000-0000-0000-000000000001', 'new_event',       'New Event',             'Central Park 10K has been created by Saturday Running Crew', 'event', '20000000-0000-0000-0000-000000000003', 'navigate'),
  ('00000000-0000-0000-0000-000000000001', 'member_joined',   'New Member',            'Thomas Lu joined Cool Pickleball Club', 'club', '10000000-0000-0000-0000-000000000001', 'navigate');

-- Arthur's notifications
INSERT INTO notifications (recipient_id, type, title, body, reference_type, reference_id, action_type) VALUES
  ('00000000-0000-0000-0000-000000000002', 'join_approved',   'Request Approved',      'You have been approved to join Weekend Tennis League', 'club', '10000000-0000-0000-0000-000000000005', 'navigate'),
  ('00000000-0000-0000-0000-000000000002', 'event_reminder',  'Event Tomorrow',        'Central Park 10K is happening tomorrow at 8:00 AM', 'event', '20000000-0000-0000-0000-000000000003', 'navigate'),
  ('00000000-0000-0000-0000-000000000002', 'friend_accepted', 'Friend Accepted',       'Brian Kim accepted your friend request', 'user', '00000000-0000-0000-0000-000000000004', 'navigate');

-- Thomas's notifications
INSERT INTO notifications (recipient_id, type, title, body, reference_type, reference_id, action_type) VALUES
  ('00000000-0000-0000-0000-000000000003', 'new_event',       'New Event',             'Hockey Pickup Game has been scheduled', 'event', '20000000-0000-0000-0000-000000000004', 'navigate'),
  ('00000000-0000-0000-0000-000000000003', 'member_joined',   'New Member',            'Henry Zhang joined Fun Hockey Game', 'club', '10000000-0000-0000-0000-000000000002', 'navigate');

-- Felix's notification
INSERT INTO notifications (recipient_id, type, title, body, reference_type, reference_id, action_type) VALUES
  ('00000000-0000-0000-0000-000000000007', 'friend_request',  'Friend Request',       'Brian Kim sent you a friend request', 'user', '00000000-0000-0000-0000-000000000004', 'accept_decline');


-- ============================================================
-- 🔗 LINK YOUR REAL ACCOUNT
-- ============================================================
-- After you log in with your real email via magic link,
-- run this query to add yourself to clubs/friendships:
--
-- Replace YOUR_USER_ID with your actual auth user ID
-- (find it in Supabase Dashboard → Authentication → Users)
--
-- -- Update your profile
-- UPDATE public.users
-- SET display_name = 'Yein Lillian Lee',
--     social_handle = '@thelillianlee',
--     social_platform = 'instagram'
-- WHERE id = 'YOUR_USER_ID';
--
-- -- Join some clubs
-- INSERT INTO club_memberships (user_id, club_id, role, status) VALUES
--   ('YOUR_USER_ID', '10000000-0000-0000-0000-000000000001', 'member', 'approved'),
--   ('YOUR_USER_ID', '10000000-0000-0000-0000-000000000002', 'member', 'approved'),
--   ('YOUR_USER_ID', '10000000-0000-0000-0000-000000000004', 'admin',  'approved'),
--   ('YOUR_USER_ID', '10000000-0000-0000-0000-000000000005', 'member', 'approved');
--
-- -- RSVP to some events
-- INSERT INTO event_rsvps (user_id, event_id, role, status) VALUES
--   ('YOUR_USER_ID', '20000000-0000-0000-0000-000000000001', 'attendee', 'approved'),
--   ('YOUR_USER_ID', '20000000-0000-0000-0000-000000000003', 'attendee', 'approved'),
--   ('YOUR_USER_ID', '20000000-0000-0000-0000-000000000006', 'attendee', 'approved');
--
-- -- Add friendships with Ling, Arthur, Thomas
-- INSERT INTO friendships (user_id, friend_id, status, source, accepted_at) VALUES
--   ('YOUR_USER_ID', '00000000-0000-0000-0000-000000000001', 'accepted', 'mutual_club', NOW()),
--   ('YOUR_USER_ID', '00000000-0000-0000-0000-000000000002', 'accepted', 'mutual_club', NOW()),
--   ('YOUR_USER_ID', '00000000-0000-0000-0000-000000000003', 'accepted', 'contacts',    NOW());
-- ============================================================
