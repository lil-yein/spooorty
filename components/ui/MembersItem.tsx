/**
 * MembersItem component — mapped from Figma component documentation
 *
 * Props:
 *   avatar: ReactNode (Avatar component)
 *   name: string
 *   description: string (optional)
 *   showIcon: boolean (trailing action icon, default true)
 *   icon: render function (optional, defaults to person-add)
 *   onPress: callback (optional)
 *
 * Anatomy (from Figma docs):
 *   Row: w=100%, gap spacer/16, items center
 *   Left: Avatar 52px with optional +count badge
 *   Center: flex 1, gap spacer/4
 *     Name: body01Light, text.bold
 *     Description: body03Light, text.subtle (optional)
 *   Right: 16×16 trailing icon, icon.subtle
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors } from '../../lib/tokens/colors';
import { spacer } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

type IconRenderer = (props: { color: string; size: number }) => React.ReactNode;

export type MembersItemProps = {
  avatar: React.ReactNode;
  name: string;
  description?: string;
  showIcon?: boolean;
  icon?: IconRenderer;
  onPress?: () => void;
  onIconPress?: () => void;
};

// ─── Component ──────────────────────────────────────────

export default function MembersItem({
  avatar,
  name,
  description,
  showIcon = true,
  icon,
  onPress,
  onIconPress,
}: MembersItemProps) {
  const defaultIcon: IconRenderer = ({ color, size }) => (
    <Icon type="add friend" color={color} size={size} />
  );
  const renderIcon = icon ?? defaultIcon;

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
            <Text style={styles.description} numberOfLines={1}>
              {description}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Trailing icon */}
      {showIcon && (
        onIconPress ? (
          <Pressable style={styles.iconWrap} onPress={onIconPress}>
            {renderIcon({ color: colors.icon.subtle, size: 16 })}
          </Pressable>
        ) : (
          <View style={styles.iconWrap}>
            {renderIcon({ color: colors.icon.bold, size: 16 })}
          </View>
        )
      )}
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
