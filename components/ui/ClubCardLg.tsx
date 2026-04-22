/**
 * ClubCardLg component — club-specific large card
 *
 * Similar to EventCardLg but shows Members + Location instead of Date/Time + Location.
 *
 * Props:
 *   name: string (Club title)
 *   members: string (member count text, e.g. "50 Members")
 *   location: string (location text)
 *   level: 1-5 (Levels indicator value)
 *   avatar: ReactNode (pre-configured Avatar)
 *   mutualHighlight: string (bold portion, e.g. "Ling +3")
 *   mutualBody: string (light portion)
 *   price: string (cost display)
 *   state: Enabled | Joined
 *   ctaLabel: string
 *   ctaColor: string
 *   ctaTextColor: string
 *   onCtaPress: function
 *   onPress: function
 *
 * Anatomy:
 *   Outer: surface/subtle bg, spacer/8 padding, borderRadius/16
 *   Content: border/subtle 0.5px, borderRadius/16, overflow hidden, column
 *     Title: p spacer/16, headline02Medium, text/bold
 *     Divider
 *     Members + Location: two flex-1 columns, vertical divider 84px
 *     Divider
 *     Levels
 *     Mutuals + Cost
 *     Action
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors } from '../../lib/tokens/colors';
import { spacer, borderRadius, borderWidth } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';
import Divider from './Divider';
import Levels, { type LevelsProps } from './Levels';

// ─── Types ──────────────────────────────────────────────

export type ClubCardLgState = 'Enabled' | 'Pending' | 'Joined';

export type ClubCardLgProps = {
  name: string;
  /** Member count text, e.g. "50 Members" */
  members?: string;
  /** Sport name displayed in the Sports column */
  sports?: string;
  location?: string;
  level?: LevelsProps['indicator'];
  avatar?: React.ReactNode;
  mutualHighlight?: string;
  mutualBody?: string;
  price?: string;
  state?: ClubCardLgState;
  ctaLabel?: string;
  ctaColor?: string;
  ctaTextColor?: string;
  onCtaPress?: () => void;
  onPress?: () => void;
  contentBg?: string;
  /** When true, CTA shows "Request to Join" with lock icon (admin approval required) */
  adminApproval?: boolean;
};

// ─── Component ──────────────────────────────────────────

export default function ClubCardLg({
  name = 'COOL PICKLEBALL CLUB',
  members = '50 Members',
  sports = 'Pickleball',
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
}: ClubCardLgProps) {
  const isJoined = state === 'Joined';
  const isPending = state === 'Pending';

  return (
    <Pressable style={styles.outer} onPress={onPress}>
      <View style={[styles.content, contentBg ? { backgroundColor: contentBg } : undefined]}>
        {/* ── Title ─────────────────────────────────── */}
        <View style={styles.titleSection}>
          <Text style={styles.titleText}>{name}</Text>
        </View>

        {/* ── Divider ──────────────────────────────── */}
        <Divider />

        {/* ── Members + Location ─────────────────── */}
        <View style={styles.infoRow}>
          {/* Left column: Sports */}
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{sports}</Text>
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
          <View style={styles.mutualsLeft}>
            {avatar}
            <Text style={styles.mutualTextWrap}>
              <Text style={styles.mutualHighlight}>{mutualHighlight} </Text>
              <Text style={styles.mutualBody}>{mutualBody}</Text>
            </Text>
          </View>

          <View style={styles.costPill}>
            <Text style={styles.costText}>{price}</Text>
          </View>
        </View>

        {/* ── Action ───────────────────────────────── */}
        <View style={styles.actionSection}>
          {isJoined ? (
            <Pressable style={styles.joinedButton} onPress={onCtaPress}>
              <Text style={styles.joinedLabel}>Joined</Text>
              <View style={styles.ctaIconWrap}>
                <Icon type="check" size={16} color={colors.text.subtle} />
              </View>
            </Pressable>
          ) : isPending ? (
            <Pressable style={styles.joinedButton} onPress={onCtaPress}>
              <Text style={styles.joinedLabel}>Pending</Text>
              <View style={styles.ctaIconWrap}>
                <Icon type="clock" size={16} color={colors.text.subtle} />
              </View>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.ctaButton, { backgroundColor: ctaColor }]}
              onPress={onCtaPress}
            >
              <Text style={[styles.ctaLabel, { color: ctaTextColor }]}>
                {adminApproval ? 'Request to Join' : ctaLabel}
              </Text>
              <View style={styles.ctaIconWrap}>
                <Icon type={adminApproval ? "lock" : "arrow forward"} size={16} color={ctaTextColor} />
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
  outer: {
    padding: spacer['8'],
    borderRadius: borderRadius['16'],
    backgroundColor: colors.surface.subtle,
  },

  content: {
    borderWidth: borderWidth.regular,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius['16'],
    overflow: 'hidden',
    backgroundColor: colors.surface.subtle,
  },

  titleSection: {
    padding: spacer['16'],
    justifyContent: 'center',
  },

  titleText: {
    ...textStyles.headline02Medium,
    color: colors.text.bold,
  },

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

  levelsSection: {
    paddingTop: spacer['16'],
    width: '100%',
  },

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

  costPill: {
    width: 63,
    borderWidth: borderWidth.regular,
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

  actionSection: {
    padding: spacer['16'],
  },

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

  joinedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacer['16'],
    gap: spacer['8'],
    backgroundColor: colors.surface.bold,
    borderWidth: borderWidth.regular,
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
