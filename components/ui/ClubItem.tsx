/**
 * ClubItem component — club selection row for modals
 *
 * Anatomy (from Figma node 3282:16093):
 *   Row: items center, gap spacer/16
 *   Avatar: Lg size (Avatar component for proper rounded shape)
 *   Text column: name (body01Light, text/bold) + subtitle (body03Light, text/subtle), gap spacer/4
 *   Trailing: optional checkmark icon (16px, icon/subtle)
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Avatar from './Avatar';
import Icon from './Icon';
import { colors } from '../../lib/tokens/colors';
import { spacer } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

export type ClubItemProps = {
  name: string;
  subtitle?: string;
  imageUri?: string;
  selected?: boolean;
  onPress?: () => void;
};

// ─── Component ──────────────────────────────────────────

export default function ClubItem({
  name,
  subtitle,
  imageUri,
  selected = false,
  onPress,
}: ClubItemProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Avatar type="Image" size="Lg" />
      <View style={styles.textCol}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {selected && (
        <View style={styles.iconWrap}>
          <Icon type="check" size={16} color={colors.icon.bold} />
        </View>
      )}
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['16'],
  },

  textCol: {
    flex: 1,
    gap: spacer['4'],
  },

  name: {
    ...textStyles.body01Light,
    color: colors.text.bold,
  },

  subtitle: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
  },

  iconWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
