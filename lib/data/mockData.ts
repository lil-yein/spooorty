/**
 * Mock data shared across screens.
 *
 * Centralises clubs, events, and sports lists so DiscoverScreen,
 * SearchScreen, and filter screens all reference the same source.
 */

import { colors } from '../tokens/colors';
import type { EventCardLgProps, ClubCardLgProps } from '../../components/ui';

// ─── Card data types (without avatar — built in render) ──
export type CardData = Omit<EventCardLgProps, 'avatar' | 'onCtaPress'> & { id: string };
export type ClubCardData = Omit<ClubCardLgProps, 'avatar' | 'onCtaPress'> & { id: string };

// ─── Clubs ──────────────────────────────────────────────
export const CLUBS: ClubCardData[] = [];

// ─── Events ─────────────────────────────────────────────
export const EVENTS: CardData[] = [];

// ─── Sports / activity list (alphabetical) ──────────────
export const SPORTS: string[] = [
  'Archery',
  'Badminton',
  'Baseball',
  'Basketball',
  'Bowling',
  'Boxing',
  'Canoeing',
  'Cheerleading',
  'Cricket',
  'CrossFit',
  'Curling',
  'Cycling',
  'Dance',
  'Disc Golf',
  'Dodgeball',
  'Fencing',
  'Field Hockey',
  'Figure Skating',
  'Flag Football',
  'Football',
  'Golf',
  'Gymnastics',
  'Handball',
  'Hiking',
  'Hockey',
  'Judo',
  'Karate',
  'Kayaking',
  'Kickball',
  'Kickboxing',
  'Lacrosse',
  'Martial Arts',
  'MMA',
  'Network',
  'Other',
  'Paddleboarding',
  'Pickleball',
  'Pilates',
  'Racquetball',
  'Rock Climbing',
  'Rowing',
  'Rugby',
  'Running',
  'Sailing',
  'Skateboarding',
  'Skating',
  'Skiing',
  'Snowboarding',
  'Soccer',
  'Softball',
  'Squash',
  'Surfing',
  'Swimming',
  'Table Tennis',
  'Taekwondo',
  'Tennis',
  'Track & Field',
  'Trail Running',
  'Triathlon',
  'Volleyball',
  'Walking',
  'Water Polo',
  'Weightlifting',
  'Wrestling',
  'Yoga',
];

// ─── Calendar events ───────────────────────────────────
export type CalendarEvent = CardData & { date: string }; // YYYY-MM-DD

export const CALENDAR_EVENTS: CalendarEvent[] = [];

/** Get events for a specific date */
export function getEventsForDate(year: number, month: number, day: number): CalendarEvent[] {
  const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return CALENDAR_EVENTS.filter((e) => e.date === key);
}

/** Get day numbers that have events in a given month (for indicator dots) */
export function getEventDaysForMonth(year: number, month: number): number[] {
  const prefix = `${year}-${String(month).padStart(2, '0')}-`;
  const days = new Set<number>();
  CALENDAR_EVENTS.forEach((e) => {
    if (e.date.startsWith(prefix)) {
      days.add(parseInt(e.date.slice(8), 10));
    }
  });
  return Array.from(days).sort((a, b) => a - b);
}

/** Get event counts per day for a given month: { [day]: count } */
export function getEventCountsForMonth(year: number, month: number): Record<number, number> {
  const prefix = `${year}-${String(month).padStart(2, '0')}-`;
  const counts: Record<number, number> = {};
  CALENDAR_EVENTS.forEach((e) => {
    if (e.date.startsWith(prefix)) {
      const day = parseInt(e.date.slice(8), 10);
      counts[day] = (counts[day] || 0) + 1;
    }
  });
  return counts;
}

/** Find the nearest upcoming date with events from a given date */
export function getNearestEventDay(year: number, month: number, fromDay: number): number | null {
  const eventDays = getEventDaysForMonth(year, month);
  // Try selected day first
  if (eventDays.includes(fromDay)) return fromDay;
  // Only show upcoming events, never previous
  const upcoming = eventDays.filter((d) => d >= fromDay);
  if (upcoming.length > 0) return upcoming[0];
  return null;
}

// ─── User profile types ──────────────────────────────────

export type FriendshipStatus = 'none' | 'pending' | 'friends';

export type UserProfile = {
  id: string;
  name: string;
  handle: string;
  clubIds: string[];
  friendIds: string[];
};

export type MutualFriendInfo = {
  userId: string;
  description: string;
};

// ─── Current (logged-in) user ───────────────────────────

export const CURRENT_USER: UserProfile = {
  id: '',
  name: '',
  handle: '',
  clubIds: [],
  friendIds: [],
};

// ─── Other users ────────────────────────────────────────

export const USERS: UserProfile[] = [];

// ─── Friendship status map (relative to current user) ───

export const INITIAL_FRIENDSHIP_STATUS: Record<string, FriendshipStatus> = {};

// ─── Mutual friend info (when viewing another user) ─────

export const MUTUAL_FRIEND_INFO: Record<string, MutualFriendInfo[]> = {};

// ─── Suggestion descriptions (for Friend Suggestion) ────

export const SUGGESTION_DESCRIPTIONS: Record<string, string> = {};

// ─── Friend descriptions (for MyProfileScreen) ─────────

export const FRIEND_DESCRIPTIONS: Record<string, string> = {};

// ─── Club detail data (for ClubScreen) ──────────────────

export type ClubDetail = {
  id: string;
  description: string;
  vibe: string;
  sports: string;
  adminIds: string[];
  memberIds: string[];
  eventIds: string[];
  fee: string;
};

export const CLUB_DETAILS: Record<string, ClubDetail> = {};

export function getClubDetail(clubId: string): ClubDetail | undefined {
  return CLUB_DETAILS[clubId];
}

export function getClubMembers(clubId: string): {
  friends: UserProfile[];
  others: UserProfile[];
} {
  const detail = CLUB_DETAILS[clubId];
  if (!detail) return { friends: [], others: [] };
  const allUsers = [CURRENT_USER, ...USERS];
  const members = allUsers.filter((u) => detail.memberIds.includes(u.id));
  const friendSet = new Set(CURRENT_USER.friendIds);
  return {
    friends: members.filter((m) => friendSet.has(m.id)),
    others: members.filter(
      (m) => !friendSet.has(m.id) && m.id !== CURRENT_USER.id,
    ),
  };
}

export function getClubEvents(clubId: string): CardData[] {
  const detail = CLUB_DETAILS[clubId];
  if (!detail) return [];
  return EVENTS.filter((e) => detail.eventIds.includes(e.id));
}

export function getClubAdmins(clubId: string): UserProfile[] {
  const detail = CLUB_DETAILS[clubId];
  if (!detail) return [];
  const allUsers = [CURRENT_USER, ...USERS];
  return allUsers.filter((u) => detail.adminIds.includes(u.id));
}

// ─── User/profile helpers ───────────────────────────────

export function getUserClubs(userId: string): ClubCardData[] {
  const allUsers = [CURRENT_USER, ...USERS];
  const user = allUsers.find((u) => u.id === userId);
  if (!user) return [];
  return CLUBS.filter((c) => user.clubIds.includes(c.id));
}

export function getFriends(): UserProfile[] {
  return USERS.filter((u) => CURRENT_USER.friendIds.includes(u.id));
}

export function getFriendSuggestions(): UserProfile[] {
  return USERS.filter((u) => !CURRENT_USER.friendIds.includes(u.id));
}

export function getMutualFriends(userId: string): (MutualFriendInfo & { user: UserProfile })[] {
  const infos = MUTUAL_FRIEND_INFO[userId] ?? [];
  return infos
    .map((info) => {
      const user = USERS.find((u) => u.id === info.userId);
      return user ? { ...info, user } : null;
    })
    .filter(Boolean) as (MutualFriendInfo & { user: UserProfile })[];
}

// ─── Event detail data (for EventScreen) ─────────────────

export type EventDetail = {
  id: string;
  description: string;
  vibe: string;
  hostIds: string[];
  memberIds: string[];
  fee: string;
};

export const EVENT_DETAILS: Record<string, EventDetail> = {};

export function getEventDetail(eventId: string): EventDetail | undefined {
  return EVENT_DETAILS[eventId];
}

export function getEventMembers(eventId: string): {
  friends: UserProfile[];
  others: UserProfile[];
} {
  const detail = EVENT_DETAILS[eventId];
  if (!detail) return { friends: [], others: [] };
  const allUsers = [CURRENT_USER, ...USERS];
  const members = allUsers.filter((u) => detail.memberIds.includes(u.id));
  const friendSet = new Set(CURRENT_USER.friendIds);
  return {
    friends: members.filter((m) => friendSet.has(m.id)),
    others: members.filter(
      (m) => !friendSet.has(m.id) && m.id !== CURRENT_USER.id,
    ),
  };
}

export function getEventHosts(eventId: string): UserProfile[] {
  const detail = EVENT_DETAILS[eventId];
  if (!detail) return [];
  const allUsers = [CURRENT_USER, ...USERS];
  return allUsers.filter((u) => detail.hostIds.includes(u.id));
}

// ─── Search filter types ────────────────────────────────
export type SearchFilters = {
  sports: string[];
  days: number[];
  times: number[];
  levels: number[];
  feeRange: [number, number];
};

export const DEFAULT_FILTERS: SearchFilters = {
  sports: [],
  days: [],
  times: [],
  levels: [],
  feeRange: [0, 100],
};
