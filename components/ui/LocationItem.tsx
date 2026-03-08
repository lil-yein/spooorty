/**
 * LocationItem component — mapped from Figma component documentation
 *
 * Props:
 *   avatar: ReactNode (Avatar component, no +count badge)
 *   name: string (location name)
 *   description: string (address, optional)
 *   selected: boolean (shows trailing checkmark, default false)
 *   onPress: callback (optional — makes item selectable)
 *
 * Anatomy (from Figma docs):
 *   Row: fills parent, gap spacer/16, items center
 *   Left: Avatar 52px (no +count badge)
 *   Center: flex 1, gap spacer/4
 *     Name: body01Light, text.bold
 *     Description: body03Light, text.subtle (optional)
 *   Right: 16×16 Google Material check icon, icon.bold (when selected)
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors } from '../../lib/tokens/colors';
import { spacer } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

export type LocationItemProps = {
  avatar: React.ReactNode;
  name: string;
  description?: string;
  selected?: boolean;
  onPress?: () => void;
};

// ─── Component ──────────────────────────────────────────

export default function LocationItem({
  avatar,
  name,
  description,
  selected = false,
  onPress,
}: LocationItemProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {/* Avatar */}
      <View style={styles.content}>
        {avatar}

        {/* Text column */}
        <View style={styles.textCol}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {description ? (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Trailing checkmark when selected */}
      {selected && (
        <View style={styles.iconWrap}>
          <Icon type="check" color={colors.icon.bold} size={16} />
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

  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['16'],
  },

  textCol: {
    flex: 1,
    gap: spacer['4'],
    justifyContent: 'center',
  },

  name: {
    ...textStyles.body01Light,
    color: colors.text.bold,
  },

  description: {
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
