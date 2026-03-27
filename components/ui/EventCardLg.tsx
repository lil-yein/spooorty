/**
 * EventCardLg component — mapped from Figma component documentation
 *
 * Props (from Figma properties):
 *   name: string (Club/event title, displayed as-is)
 *   dateTime: string (date/time text)
 *   location: string (location text)
 *   level: 1-5 (Levels indicator value)
 *   avatar: ReactNode (pre-configured Avatar, rendered in mutuals row)
 *   mutualHighlight: string (bold portion, e.g. "Ling +3")
 *   mutualBody: string (light portion, e.g. "friends\nare members of this club")
 *   price: string (cost display, e.g. "$20")
 *   state: Enabled | Joined (card action state)
 *   ctaLabel: string (CTA button label, e.g. "Join Club")
 *   ctaColor: string (custom CTA button background color)
 *   ctaTextColor: string (CTA button text/icon color)
 *   onCtaPress: function
 *
 * Anatomy (from Figma docs):
 *   Outer: surface/subtle bg, spacer/8 padding, borderRadius/16, fills parent width
 *   Content: border/subtle 0.5px, borderRadius/16, overflow hidden, column
 *     Title: p spacer/16, headline02Medium, text/bold
 *     Divider (Subtle)
 *     Date/Time + Location: two flex-1 columns, vertical divider 84px
 *     Divider (Subtle)
 *     Levels: pt spacer/16, nesting Levels component (full width)
 *     Mutuals + Cost: pt spacer/16, px spacer/16
 *     Action: p spacer/16
 *       Enabled: custom-color CTA button w/ trailing arrow (full width)
 *       Joined: Subtle button (surface/bold bg, border/subtle, text/subtle "Joined" + checkmark)
 *
 * Requirements:
 *   Button color is customizable by user's selection during
 *   create/edit event/club flow.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors } from '../../lib/tokens/colors';
import { spacer, borderRadius } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';
import Divider from './Divider';
import Levels, { type LevelsProps } from './Levels';

// ─── Types ──────────────────────────────────────────────

export type EventCardLgState = 'Enabled' | 'Joined';

export type EventCardLgProps = {
  /** Club/event title (displayed as-is, use uppercase for clubs) */
  name: string;
  /** Date/time string, e.g. "12/31 2024 12:30PM" */
  dateTime?: string;
  /** Location string, e.g. "New York, NY" */
  location?: string;
  /** Levels indicator (1–5) */
  level?: LevelsProps['indicator'];
  /** Pre-configured Avatar node (render Avatar Lg externally) */
  avatar?: React.ReactNode;
  /** Bold portion of mutual text, e.g. "Ling +3" */
  mutualHighlight?: string;
  /** Light portion of mutual text, e.g. "friends\nare members of this club" */
  mutualBody?: string;
  /** Price display, e.g. "$20" */
  price?: string;
  /** Card action state */
  state?: EventCardLgState;
  /** CTA button label (for Enabled state) */
  ctaLabel?: string;
  /** Custom CTA button background color (user-customizable) */
  ctaColor?: string;
  /** CTA button text/icon color (defaults to text/bold) */
  ctaTextColor?: string;
  /** CTA button press handler */
  onCtaPress?: () => void;
  /** Card body press handler (e.g. navigate to detail) */
  onPress?: () => void;
  /** Override inner content background color (defaults to surface/subtle) */
  contentBg?: string;
  /** When true, CTA shows "Request to Join" with lock icon (admin approval required) */
  adminApproval?: boolean;
};

// ─── Component ──────────────────────────────────────────

export default function EventCardLg({
  name = 'COOL PICKLEBALL CLUB',
  dateTime = '12/31 2024 12:30PM',
  location = 'New York, NY',
  level = 1,
  avatar,
  mutualHighlight = 'Ling +3',
  mutualBody = 'friends\nare members of this club',
  price = '$20',
  state = 'Enabled',
  ctaLabel = 'Join Club',
  ctaColor = colors.surface.inverse,
  ctaTextColor = colors.text.onhighlight,
  onCtaPress,
  onPress,
  contentBg,
  adminApproval = false,
}: EventCardLgProps) {
  const isJoined = state === 'Joined';

  return (
    <Pressable style={styles.outer} onPress={onPress}>
      <View style={[styles.content, contentBg ? { backgroundColor: contentBg } : undefined]}>
        {/* ── Title ─────────────────────────────────── */}
        <View style={styles.titleSection}>
          <Text style={styles.titleText}>{name}</Text>
        </View>

        {/* ── Divider ──────────────────────────────── */}
        <Divider />

        {/* ── Date/Time + Location ─────────────────── */}
        <View style={styles.infoRow}>
          {/* Left column: Date/Time */}
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Date/ Time</Text>
            <Text style={styles.infoValue}>{dateTime}</Text>
          </View>

          {/* Vertical divider */}
          <View style={styles.verticalDividerWrap}>
            <View style={styles.verticalDivider} />
          </View>

          {/* Right column: Location */}
          <View style={styles.infoColRight}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{location}</Text>
          </View>
        </View>

        {/* ── Divider ──────────────────────────────── */}
        <Divider />

        {/* ── Levels ───────────────────────────────── */}
        <View style={styles.levelsSection}>
          <Levels indicator={level} />
        </View>

        {/* ── Mutuals + Cost ───────────────────────── */}
        <View style={styles.mutualsRow}>
          {/* Mutuals (avatar + text) */}
          <View style={styles.mutualsLeft}>
            {avatar}
            <Text style={styles.mutualTextWrap}>
              <Text style={styles.mutualHighlight}>{mutualHighlight} </Text>
              <Text style={styles.mutualBody}>{mutualBody}</Text>
            </Text>
          </View>

          {/* Cost pill */}
          <View style={styles.costPill}>
            <Text style={styles.costText}>{price}</Text>
          </View>
        </View>

        {/* ── Action ───────────────────────────────── */}
        <View style={styles.actionSection}>
          {isJoined ? (
            /* Joined state: Subtle button with "Joined" + checkmark */
            <Pressable style={styles.joinedButton} onPress={onCtaPress}>
              <Text style={styles.joinedLabel}>Joined</Text>
              <View style={styles.ctaIconWrap}>
                <Icon
                  type="check"
                  size={16}
                  color={colors.text.subtle}
                />
              </View>
            </Pressable>
          ) : (
            /* Enabled state: Custom-color CTA button with arrow */
            <Pressable
              style={[styles.ctaButton, { backgroundColor: ctaColor }]}
              onPress={onCtaPress}
            >
              <Text style={[styles.ctaLabel, { color: ctaTextColor }]}>
                {adminApproval ? 'Request to Join' : ctaLabel}
              </Text>
              <View style={styles.ctaIconWrap}>
                <Icon
                  type={adminApproval ? "lock" : "arrow forward"}
                  size={16}
                  color={ctaTextColor}
                />
              </View>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  // Outer container — fills parent width
  outer: {
    padding: spacer['8'],
    borderRadius: borderRadius['16'],
    backgroundColor: colors.surface.subtle,
  },

  // Inner content frame
  content: {
    borderWidth: 0.5,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius['16'],
    overflow: 'hidden',
    backgroundColor: colors.surface.subtle,
  },

  // ── Title ──────────────────────────────────────
  titleSection: {
    padding: spacer['16'],
    justifyContent: 'center',
  },

  titleText: {
    ...textStyles.headline02Medium,
    color: colors.text.bold,
  },

  // ── Info row (Date/Time + Location) ────────────
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['16'],
  },

  infoCol: {
    flex: 1,
    paddingLeft: spacer['16'],
    justifyContent: 'center',
    gap: spacer['8'],
  },

  infoColRight: {
    flex: 1,
    paddingRight: spacer['16'],
    justifyContent: 'center',
    gap: spacer['8'],
  },

  infoLabel: {
    ...textStyles.title02Medium,
    color: colors.text.bold,
  },

  infoValue: {
    ...textStyles.body03Light,
    color: colors.text.bold,
  },

  // Vertical divider between columns
  verticalDividerWrap: {
    height: 84,
    justifyContent: 'center',
    alignItems: 'center',
    width: 0,
  },

  verticalDivider: {
    width: 0.5,
    height: '100%',
    backgroundColor: colors.border.subtle,
  },

  // ── Levels (full width) ─────────────────────────
  levelsSection: {
    paddingTop: spacer['16'],
    width: '100%',
  },

  // ── Mutuals + Cost ─────────────────────────────
  mutualsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: spacer['16'],
    paddingHorizontal: spacer['16'],
  },

  mutualsLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['16'],
    paddingRight: spacer['16'],
  },

  mutualTextWrap: {
    flex: 1,
    ...textStyles.body03Light,
    color: colors.text.bold,
  },

  mutualHighlight: {
    ...textStyles.body03Medium,
    color: colors.text.bold,
  },

  mutualBody: {
    ...textStyles.body03Light,
    color: colors.text.bold,
  },

  // Cost pill
  costPill: {
    width: 63,
    borderWidth: 0.5,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius['16'],
    paddingHorizontal: spacer['16'],
    paddingVertical: spacer['18'],
    alignItems: 'center',
    justifyContent: 'center',
  },

  costText: {
    ...textStyles.title02Medium,
    color: colors.text.bold,
  },

  // ── Action ─────────────────────────────────────
  actionSection: {
    padding: spacer['16'],
  },

  // Enabled state: custom-color CTA button (full width)
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacer['16'],
    gap: spacer['8'],
  },

  ctaLabel: {
    ...textStyles.title02Medium,
  },

  // Joined state: Subtle button
  joinedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacer['16'],
    gap: spacer['8'],
    backgroundColor: colors.surface.bold,
    borderWidth: 0.5,
    borderColor: colors.border.subtle,
  },

  joinedLabel: {
    ...textStyles.title02Medium,
    color: colors.text.subtle,
  },

  ctaIconWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
