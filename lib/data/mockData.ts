/**
 * Mock data shared across screens.
 *
 * Centralises clubs, events, and sports lists so DiscoverScreen,
 * SearchScreen, and filter screens all reference the same source.
 */

import { colors } from '../tokens/colors';
import type { CardLgProps } from '../../components/ui';

// ─── Card data type (without avatar — built in render) ──
export type CardData = Omit<CardLgProps, 'avatar' | 'onCtaPress'> & { id: string };

// ─── Clubs ──────────────────────────────────────────────
export const CLUBS: CardData[] = [
  {
    id: 'club-1',
    name: 'COOL PICKLEBALL CLUB',
    dateTime: '12/31 2024 12:30PM',
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
    dateTime: '01/15 2025 6:00PM',
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
    dateTime: 'Every Sat 8:00AM',
    location: 'Central Park, NY',
    level: 2,
    mutualHighlight: 'Sam +5',
    mutualBody: 'friends\nare members of this club',
    price: '$15',
    ctaLabel: 'Join Club',
    ctaColor: '#FF834F',
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
  },
];

// ─── Sports list (alphabetical) ─────────────────────────
export const SPORTS: string[] = [
  'Archery',
  'Badminton',
  'Baseball',
  'Basketball',
  'Boxing',
  'Cricket',
  'Cycling',
  'Fencing',
  'Football',
  'Golf',
  'Gymnastics',
  'Hockey',
  'Judo',
  'Kickboxing',
  'Lacrosse',
  'MMA',
  'Pickleball',
  'Racquetball',
  'Rock Climbing',
  'Rowing',
  'Rugby',
  'Running',
  'Skating',
  'Skiing',
  'Soccer',
  'Squash',
  'Swimming',
  'Table Tennis',
  'Tennis',
  'Volleyball',
  'Wrestling',
  'Yoga',
];

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
