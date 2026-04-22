/**
 * InnerContentCard — card without outer padding wrapper
 * (Figma node 3211:32170)
 *
 * Same internal structure as CardLg but rendered directly with
 * border/subtle 0.5px and borderRadius/16. Used inside nested
 * containers (e.g. Events tab inside a club page section card)
 * where the outer surface/subtle wrapper is already provided.
 *
 * Props match CardLg for consistency.
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

export type InnerContentCardProps = {
  name: string;
  dateTime?: string;
  location?: string;
  level?: LevelsProps['indicator'];
  avatar?: React.ReactNode;
  mutualHighlight?: string;
  mutualBody?: string;
  price?: string;
  state?: 'Enabled' | 'Pending' | 'Joined';
  ctaLabel?: string;
  ctaColor?: string;
  ctaTextColor?: string;
  onCtaPress?: () => void;
  onPress?: () => void;
  adminApproval?: boolean;
};

// ─── Component ──────────────────────────────────────────

export default function InnerContentCard({
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
  adminApproval = false,
}: InnerContentCardProps) {
  const isJoined = state === 'Joined';
  const isPending = state === 'Pending';

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.titleText}>{name}</Text>
        </View>

        <Divider />

        {/* Date/Time + Location */}
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Date/ Time</Text>
            <Text style={styles.infoValue}>{dateTime}</Text>
          </View>
          <View style={styles.verticalDividerWrap}>
            <View style={styles.verticalDivider} />
          </View>
          <View style={styles.infoColRight}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{location}</Text>
          </View>
        </View>

        <Divider />

        {/* Levels */}
        <View style={styles.levelsSection}>
          <Levels indicator={level} />
        </View>

        {/* Mutuals + Cost */}
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

        {/* Action */}
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
  // No outer padding wrapper — just the bordered container
  container: {
    borderWidth: borderWidth.thin,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius['16'],
    overflow: 'hidden',
  },

  content: {
    overflow: 'hidden',
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
    borderWidth: borderWidth.thin,
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
    borderWidth: borderWidth.thin,
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
