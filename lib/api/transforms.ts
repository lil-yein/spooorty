/**
 * Transforms — convert database types into UI component props.
 *
 * These functions bridge the gap between DbClub/DbEvent rows
 * and the ClubCardLg/EventCardLg component props.
 */

import { colors } from '../tokens/colors';
import type { DbClub, DbEvent, SkillLevel } from '../database/types';

// ─── Skill level → numeric (1–5) for the Levels component ──

const SKILL_LEVEL_MAP: Record<SkillLevel, number> = {
  beginner: 1,
  beg_int: 2,
  intermediate: 3,
  int_adv: 4,
  advanced: 5,
};

export function skillLevelToNumber(level: SkillLevel): 1 | 2 | 3 | 4 | 5 {
  return (SKILL_LEVEL_MAP[level] ?? 1) as 1 | 2 | 3 | 4 | 5;
}

// ─── Fee display ────────────────────────────────────────────

export function formatFee(amount: number, frequency: string): string {
  if (frequency === 'free' || amount === 0) return 'Free';
  const formatted = amount % 1 === 0 ? `$${amount}` : `$${amount.toFixed(2)}`;
  if (frequency === 'monthly') return `${formatted}/mo`;
  if (frequency === 'per_session') return `${formatted}/session`;
  if (frequency === 'per_event') return `${formatted}`;
  return formatted;
}

// ─── Default CTA colors (rotate through a palette) ─────────

const CTA_COLORS = [
  { bg: '#FF834F', text: colors.text.bold },
  { bg: '#64437E', text: colors.text.inverse },
  { bg: '#82DC56', text: colors.text.bold },
  { bg: '#66AAEF', text: colors.text.bold },
  { bg: '#FFB854', text: colors.text.bold },
];

export function getCtaColors(index: number) {
  return CTA_COLORS[index % CTA_COLORS.length];
}

// ─── Date/time formatting ───────────────────────────────────

export function formatEventDateTime(date: string, startTime: string): string {
  const d = new Date(date + 'T00:00:00');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();

  // Convert 24h time to 12h
  const [h, m] = startTime.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const timeStr = `${hour12}:${String(m).padStart(2, '0')}${period}`;

  return `${month}/${day} ${year} ${timeStr}`;
}

// ─── Club → ClubCardLg props ────────────────────────────────

export function clubToCardProps(club: DbClub, index: number, memberCount?: number) {
  const ctaColors = getCtaColors(index);
  return {
    id: club.id,
    name: club.name.toUpperCase(),
    members: `${memberCount ?? 0} Members`,
    sports: club.sport ?? '',
    location: club.location_name ?? '',
    level: skillLevelToNumber(club.skill_level),
    price: formatFee(club.fee_amount, club.fee_frequency),
    ctaLabel: club.requires_approval ? 'Request to Join' : 'Join Club',
    ctaColor: ctaColors.bg,
    ctaTextColor: ctaColors.text,
    adminApproval: club.requires_approval,
  };
}

// ─── Event → EventCardLg props ──────────────────────────────

export function eventToCardProps(event: DbEvent, index: number) {
  const ctaColors = getCtaColors(index);
  return {
    id: event.id,
    name: event.name.toUpperCase(),
    dateTime: formatEventDateTime(event.event_date, event.start_time),
    location: event.location_name ?? '',
    level: skillLevelToNumber(event.skill_level),
    price: formatFee(event.fee_amount, event.fee_frequency),
    ctaLabel: event.requires_approval ? 'Request to Join' : 'Join Event',
    ctaColor: ctaColors.bg,
    ctaTextColor: ctaColors.text,
    adminApproval: event.requires_approval,
  };
}
