/**
 * TypeScript types matching the Supabase database schema.
 *
 * Keep in sync with schema.sql whenever the DB changes.
 */

// ─── Enums ────────────────────────────────────────────────

export type SkillLevel = 'beginner' | 'beg_int' | 'intermediate' | 'int_adv' | 'advanced';
export type VibeTag = 'casual' | 'competitive' | 'teamwork' | 'professional';
export type MembershipStatus = 'pending' | 'approved' | 'rejected';
export type MembershipRole = 'member' | 'admin' | 'attendee';
export type FriendshipStatus = 'pending' | 'accepted' | 'declined';
export type FriendSource = 'mutual_event' | 'mutual_club' | 'contacts' | 'manual';
export type NotificationType =
  | 'join_request'
  | 'join_approved'
  | 'join_rejected'
  | 'new_event'
  | 'event_reminder'
  | 'friend_request'
  | 'friend_accepted'
  | 'member_joined';
export type NotificationAction = 'approve_reject' | 'accept_decline' | 'navigate';

// ─── Table Row Types ──────────────────────────────────────

export type DbUser = {
  id: string;
  email: string;
  display_name: string;
  profile_photo_url: string | null;
  social_handle: string | null;
  social_platform: string | null;
  phone_hash: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DbClub = {
  id: string;
  name: string;
  cover_photo_url: string | null;
  sport: string | null;
  description: string | null;
  location_name: string | null;
  location_lat: number | null;
  location_lng: number | null;
  schedule_type: 'recurring' | 'one_time';
  schedule_day: string | null;
  schedule_time: string | null;
  end_time: string | null;
  skill_level: SkillLevel;
  fee_amount: number;
  fee_frequency: 'monthly' | 'per_session' | 'free';
  fee_method: string | null;
  vibe: VibeTag | null;
  capacity: number | null;
  is_public: boolean;
  requires_approval: boolean;
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DbEvent = {
  id: string;
  club_id: string | null;
  name: string;
  cover_photo_url: string | null;
  sport: string | null;
  description: string | null;
  location_name: string | null;
  location_lat: number | null;
  location_lng: number | null;
  event_date: string; // YYYY-MM-DD
  start_time: string;
  end_time: string | null;
  is_recurring: boolean;
  recurrence_rule: string | null;
  skill_level: SkillLevel;
  fee_amount: number;
  fee_frequency: 'per_event' | 'free';
  vibe: VibeTag | null;
  capacity: number | null;
  requires_approval: boolean;
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DbClubMembership = {
  id: string;
  user_id: string;
  club_id: string;
  role: MembershipRole;
  status: MembershipStatus;
  requested_at: string;
  responded_at: string | null;
  responded_by: string | null;
};

export type DbEventRsvp = {
  id: string;
  user_id: string;
  event_id: string;
  role: MembershipRole;
  status: MembershipStatus;
  requested_at: string;
  responded_at: string | null;
  responded_by: string | null;
};

export type DbFriendship = {
  id: string;
  user_id: string;
  friend_id: string;
  status: FriendshipStatus;
  source: FriendSource | null;
  created_at: string;
  accepted_at: string | null;
};

export type DbNotification = {
  id: string;
  recipient_id: string;
  type: NotificationType;
  title: string;
  body: string;
  reference_type: 'club' | 'event' | 'user' | null;
  reference_id: string | null;
  action_type: NotificationAction | null;
  is_read: boolean;
  is_acted_on: boolean;
  created_at: string;
};

// ─── Insert Types (omit server-generated fields) ──────────

export type InsertUser = Pick<DbUser, 'id' | 'email' | 'display_name'> &
  Partial<Pick<DbUser, 'profile_photo_url' | 'social_handle' | 'social_platform' | 'phone_hash'>>;

export type InsertClub = Pick<DbClub, 'name' | 'created_by'> &
  Partial<
    Omit<DbClub, 'id' | 'name' | 'created_by' | 'is_active' | 'created_at' | 'updated_at'>
  >;

export type InsertEvent = Pick<DbEvent, 'name' | 'event_date' | 'start_time' | 'created_by'> &
  Partial<
    Omit<
      DbEvent,
      'id' | 'name' | 'event_date' | 'start_time' | 'created_by' | 'is_active' | 'created_at' | 'updated_at'
    >
  >;

export type InsertClubMembership = Pick<DbClubMembership, 'user_id' | 'club_id'> &
  Partial<Pick<DbClubMembership, 'role' | 'status'>>;

export type InsertEventRsvp = Pick<DbEventRsvp, 'user_id' | 'event_id'> &
  Partial<Pick<DbEventRsvp, 'role' | 'status'>>;

export type InsertFriendship = Pick<DbFriendship, 'user_id' | 'friend_id'> &
  Partial<Pick<DbFriendship, 'source'>>;

export type InsertNotification = Pick<DbNotification, 'recipient_id' | 'type' | 'title' | 'body'> &
  Partial<Pick<DbNotification, 'reference_type' | 'reference_id' | 'action_type'>>;

// ─── Update Types ─────────────────────────────────────────

export type UpdateUser = Partial<
  Pick<DbUser, 'display_name' | 'profile_photo_url' | 'social_handle' | 'social_platform' | 'phone_hash'>
>;

export type UpdateClub = Partial<
  Omit<DbClub, 'id' | 'created_by' | 'created_at' | 'updated_at'>
>;

export type UpdateEvent = Partial<
  Omit<DbEvent, 'id' | 'created_by' | 'created_at' | 'updated_at'>
>;
