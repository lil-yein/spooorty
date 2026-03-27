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
export const CLUBS: ClubCardData[] = [
  {
    id: 'club-1',
    name: 'COOL PICKLEBALL CLUB',
    members: '4 Members',

    sports: 'Pickleball',
    location: 'New York, NY',
    level: 1,
    mutualHighlight: 'Ling +3',
    mutualBody: 'friends\nare members of this club',
    price: '$20',
    ctaLabel: 'Join Club',
    ctaColor: '#FF834F',
    ctaTextColor: colors.text.bold,
  },
  {
    id: 'club-2',
    name: 'FUN HOCKEY GAME',
    members: '4 Members',

    sports: 'Hockey',
    location: 'Brooklyn, NY',
    level: 3,
    mutualHighlight: 'Alex +2',
    mutualBody: 'friends\nare members of this club',
    price: '$25',
    ctaLabel: 'Join Club',
    ctaColor: '#64437E',
    ctaTextColor: colors.text.inverse,
  },
  {
    id: 'club-3',
    name: 'SATURDAY RUNNING CREW',
    members: '3 Members',

    sports: 'Running',
    location: 'Central Park, NY',
    level: 2,
    mutualHighlight: 'Sam +5',
    mutualBody: 'friends\nare members of this club',
    price: '$15',
    ctaLabel: 'Join Club',
    ctaColor: '#FF834F',
    ctaTextColor: colors.text.bold,
  },
  {
    id: 'club-4',
    name: 'EXCITING HANDBALL TEAM',
    members: '3 Members',

    sports: 'Handball',
    location: 'Queens, NY',
    level: 2,
    mutualHighlight: 'Mia +1',
    mutualBody: 'friends\nare members of this club',
    price: '$18',
    ctaLabel: 'Join Club',
    ctaColor: '#66AAEF',
    ctaTextColor: colors.text.bold,
    adminApproval: true,
  },
  {
    id: 'club-5',
    name: 'WEEKEND TENNIS LEAGUE',
    members: '4 Members',

    sports: 'Tennis',
    location: 'Flushing Meadows, NY',
    level: 3,
    mutualHighlight: 'Jake +4',
    mutualBody: 'friends\nare members of this club',
    price: '$22',
    ctaLabel: 'Join Club',
    ctaColor: '#82DC56',
    ctaTextColor: colors.text.bold,
  },
];

// ─── Events ─────────────────────────────────────────────
export const EVENTS: CardData[] = [
  {
    id: 'event-1',
    name: 'SUNSET YOGA SESSION',
    dateTime: '03/20 2025 5:30PM',
    location: 'Prospect Park, NY',
    level: 1,
    mutualHighlight: 'Mia +4',
    mutualBody: 'friends\nare attending this event',
    price: '$10',
    ctaLabel: 'Join Event',
    ctaColor: '#64437E',
    ctaTextColor: colors.text.inverse,
  },
  {
    id: 'event-2',
    name: 'BEACH VOLLEYBALL TOURNEY',
    dateTime: '04/05 2025 10:00AM',
    location: 'Coney Island, NY',
    level: 4,
    mutualHighlight: 'Jake +6',
    mutualBody: 'friends\nare attending this event',
    price: '$30',
    ctaLabel: 'Join Event',
    ctaColor: '#FF834F',
    ctaTextColor: colors.text.bold,
    adminApproval: true,
  },
];

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

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'cal-1',
    date: '2024-01-01',
    name: 'SUPER FUN BASEBALL DAY',
    dateTime: '01/01 2024 12:30PM',
    location: 'New York, NY',
    level: 1,
    mutualHighlight: 'Ling +3',
    mutualBody: 'friends\nare members of this club',
    price: '$20',
    ctaLabel: 'Join Event',
    ctaColor: '#82DC56',
    ctaTextColor: colors.text.bold,
  },
  {
    id: 'cal-2',
    date: '2024-01-08',
    name: 'CHILL BADMINTON GAMES',
    dateTime: '01/08 2024 12:30PM',
    location: 'New York, NY',
    level: 1,
    mutualHighlight: 'Ling +3',
    mutualBody: 'friends\nare members of this club',
    price: '$20',
    ctaLabel: 'Join Event',
    ctaColor: '#82DC56',
    ctaTextColor: colors.text.bold,
  },
  {
    id: 'cal-3',
    date: '2024-01-08',
    name: 'THRILLING MARATHON',
    dateTime: '01/08 2024 12:30PM',
    location: 'New York, NY',
    level: 1,
    mutualHighlight: 'Ling +3',
    mutualBody: 'friends\nare members of this club',
    price: '$20',
    ctaLabel: 'Request to Join',
    ctaColor: '#FFB854',
    ctaTextColor: colors.text.bold,
    adminApproval: true,
  },
  {
    id: 'cal-4',
    date: '2024-01-10',
    name: 'EXCITING HANDBALL TEAM',
    dateTime: '01/10 2024 2:00PM',
    location: 'New York, NY',
    level: 2,
    mutualHighlight: 'Alex +2',
    mutualBody: 'friends\nare members of this club',
    price: '$25',
    ctaLabel: 'Join Event',
    ctaColor: '#66AAEF',
    ctaTextColor: colors.text.bold,
  },
  {
    id: 'cal-5',
    date: '2024-01-17',
    name: 'COOL PICKLEBALL CLUB',
    dateTime: '01/17 2024 6:00PM',
    location: 'Brooklyn, NY',
    level: 3,
    mutualHighlight: 'Sam +5',
    mutualBody: 'friends\nare members of this club',
    price: '$15',
    ctaLabel: 'Join Event',
    ctaColor: '#82DC56',
    ctaTextColor: colors.text.bold,
  },
  {
    id: 'cal-6',
    date: '2024-01-18',
    name: 'SUPER FUN BASEBALL DAY',
    dateTime: '01/18 2024 12:30PM',
    location: 'New York, NY',
    level: 1,
    mutualHighlight: 'Ling +3',
    mutualBody: 'friends\nare members of this club',
    price: '$20',
    ctaLabel: 'Join Event',
    ctaColor: '#82DC56',
    ctaTextColor: colors.text.bold,
  },
  {
    id: 'cal-7',
    date: '2024-01-18',
    name: 'DREAM SOCCER EVENT',
    dateTime: '01/18 2024 12:30PM',
    location: 'New York, NY',
    level: 1,
    mutualHighlight: 'Ling +3',
    mutualBody: 'friends\nare members of this club',
    price: '$20',
    ctaLabel: 'Request to Join',
    ctaColor: '#FFB854',
    ctaTextColor: colors.text.bold,
    adminApproval: true,
  },
  {
    id: 'cal-8',
    date: '2024-01-18',
    name: 'SUPER SWIMMING COMPETITION',
    dateTime: '01/18 2024 12:30PM',
    location: 'New York, NY',
    level: 1,
    mutualHighlight: 'Ling +3',
    mutualBody: 'friends\nare members of this club',
    price: '$20',
    ctaLabel: 'Join Event',
    ctaColor: '#66AAEF',
    ctaTextColor: colors.text.bold,
  },
  {
    id: 'cal-9',
    date: '2024-01-08',
    name: 'SUPER SWIMMING COMPETITION',
    dateTime: '01/08 2024 12:30PM',
    location: 'New York, NY',
    level: 1,
    mutualHighlight: 'Ling +3',
    mutualBody: 'friends\nare members of this club',
    price: '$20',
    ctaLabel: 'Join Event',
    ctaColor: '#66AAEF',
    ctaTextColor: colors.text.bold,
  },
];

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
  id: 'user-me',
  name: 'Yein Lillian Lee',
  handle: '@thelillianlee',
  clubIds: ['club-1', 'club-2', 'club-4', 'club-5'],
  friendIds: ['user-1', 'user-2', 'user-3'],
};

// ─── Other users ────────────────────────────────────────

export const USERS: UserProfile[] = [
  {
    id: 'user-1',
    name: 'Ling Cao',
    handle: '@lingcao',
    clubIds: ['club-1', 'club-2'],
    friendIds: ['user-me', 'user-2', 'user-3'],
  },
  {
    id: 'user-2',
    name: 'Arthur Liao',
    handle: '@arthurliao',
    clubIds: ['club-1', 'club-3'],
    friendIds: ['user-me', 'user-1', 'user-3'],
  },
  {
    id: 'user-3',
    name: 'Thomas Lu',
    handle: '@thomaslu',
    clubIds: ['club-2'],
    friendIds: ['user-me'],
  },
  {
    id: 'user-4',
    name: 'Brian Kim',
    handle: '@briankim',
    clubIds: ['club-3'],
    friendIds: [],
  },
  {
    id: 'user-5',
    name: 'Diana Chen',
    handle: '@dianachen',
    clubIds: [],
    friendIds: [],
  },
  {
    id: 'user-6',
    name: 'Emma Wilson',
    handle: '@emmawilson',
    clubIds: ['club-1'],
    friendIds: [],
  },
  {
    id: 'user-7',
    name: 'Felix Park',
    handle: '@felixpark',
    clubIds: ['club-2'],
    friendIds: [],
  },
  {
    id: 'user-8',
    name: 'Grace Liu',
    handle: '@graceliu',
    clubIds: [],
    friendIds: [],
  },
  {
    id: 'user-9',
    name: 'Henry Zhang',
    handle: '@henryzhang',
    clubIds: ['club-3'],
    friendIds: [],
  },
];

// ─── Friendship status map (relative to current user) ───

export const INITIAL_FRIENDSHIP_STATUS: Record<string, FriendshipStatus> = {
  'user-1': 'friends',
  'user-2': 'friends',
  'user-3': 'friends',
  'user-4': 'none',
  'user-5': 'none',
  'user-6': 'pending',
  'user-7': 'none',
  'user-8': 'none',
  'user-9': 'none',
};

// ─── Mutual friend info (when viewing another user) ─────

export const MUTUAL_FRIEND_INFO: Record<string, MutualFriendInfo[]> = {
  'user-1': [
    { userId: 'user-2', description: '4 Clubs, Pickleball Event together' },
    { userId: 'user-3', description: '1 Club together' },
  ],
  'user-2': [
    { userId: 'user-1', description: '4 Clubs, Pickleball Event together' },
    { userId: 'user-3', description: '2 Clubs together' },
  ],
  'user-3': [
    { userId: 'user-1', description: '1 Club together' },
  ],
};

// ─── Suggestion descriptions (for Friend Suggestion) ────

export const SUGGESTION_DESCRIPTIONS: Record<string, string> = {
  'user-4': 'Went to Cool Pickleball Event together',
  'user-5': 'From your contacts',
  'user-6': 'A member of Cool Pickleball Club',
  'user-7': 'From your contacts',
  'user-8': 'Friends from contacts',
  'user-9': 'Went to Cool Pickleball Event together',
};

// ─── Friend descriptions (for MyProfileScreen) ─────────

export const FRIEND_DESCRIPTIONS: Record<string, string> = {
  'user-1': 'Went to Cool Pickleball Event together',
  'user-2': 'A member of Cool Pickleball Club',
  'user-3': 'Friends from contacts',
};

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

export const CLUB_DETAILS: Record<string, ClubDetail> = {
  'club-1': {
    id: 'club-1',
    description:
      'A fun and welcoming pickleball club for players of all levels. We meet weekly for games, drills, and social events.',
    vibe: 'Casual',
    sports: 'Pickleball',
    adminIds: ['user-me'],
    memberIds: ['user-me', 'user-1', 'user-2', 'user-6'],
    eventIds: ['event-1'],
    fee: '$20/ Mnth',
  },
  'club-2': {
    id: 'club-2',
    description:
      'Competitive hockey games every week. We play hard but fair. Looking for skilled players who love the game.',
    vibe: 'Competitive',
    sports: 'Hockey',
    adminIds: ['user-3'],
    memberIds: ['user-me', 'user-1', 'user-3', 'user-7'],
    eventIds: ['event-2'],
    fee: '$25/ Mnth',
  },
  'club-3': {
    id: 'club-3',
    description:
      'We run every Saturday rain or shine. All paces welcome. Great way to explore Central Park trails!',
    vibe: 'Casual',
    sports: 'Running',
    adminIds: ['user-2'],
    memberIds: ['user-2', 'user-4', 'user-9'],
    eventIds: [],
    fee: '$15/ Mnth',
  },
  'club-4': {
    id: 'club-4',
    description:
      'Handball enthusiasts unite! Weekly practice sessions and friendly matches in Queens.',
    vibe: 'Moderate',
    sports: 'Handball',
    adminIds: ['user-me'],
    memberIds: ['user-me', 'user-5', 'user-8'],
    eventIds: [],
    fee: '$18/ Mnth',
  },
  'club-5': {
    id: 'club-5',
    description:
      'Sunday morning tennis league with round-robin tournaments. Intermediate to advanced players.',
    vibe: 'Competitive',
    sports: 'Tennis',
    adminIds: ['user-1'],
    memberIds: ['user-me', 'user-1', 'user-4', 'user-6'],
    eventIds: [],
    fee: '$22/ Mnth',
  },
};

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

export const EVENT_DETAILS: Record<string, EventDetail> = {
  'event-1': {
    id: 'event-1',
    description:
      'Relax and unwind with a sunset yoga session in Prospect Park. All levels welcome — mats provided. Stay for community snacks after!',
    vibe: 'Casual',
    hostIds: ['user-1'],
    memberIds: ['user-me', 'user-1', 'user-3', 'user-5'],
    fee: '$10',
  },
  'event-2': {
    id: 'event-2',
    description:
      'Annual beach volleyball tournament at Coney Island! Competitive 4v4 format with prizes for the top teams. Sign up solo or with a squad.',
    vibe: 'Competitive',
    hostIds: ['user-2'],
    memberIds: ['user-me', 'user-2', 'user-4', 'user-7'],
    fee: '$30',
  },
};

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
