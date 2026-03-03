/**
 * AvatarGroup component — mapped from Figma component documentation
 *
 * Renders a row of overlapping Avatar components.
 *
 * Props:
 *   avatars: array of AvatarProps to render
 *   max: maximum visible avatars before showing "+N" overflow (optional)
 *   size: Avatar size applied to all items (default: Sm)
 *
 * Anatomy (from Figma docs):
 *   Layout: horizontal flex, gap spacer/-8 (-8px overlap)
 *   Stacking: isolate context, z-index decreasing left-to-right
 *   Overflow: remaining count shown as Text avatar at the end
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Avatar, { type AvatarProps } from './Avatar';
import { spacer } from '../../lib/tokens/spacing';

// ─── Types ──────────────────────────────────────────────

type AvatarSize = 'Xs' | 'Sm' | 'Md' | 'Lg' | 'Xl';

export type AvatarGroupProps = {
  /** Array of avatar data to render */
  avatars: AvatarProps[];
  /** Max visible avatars before "+N" overflow (shows all if omitted) */
  max?: number;
  /** Size applied to every avatar in the group */
  size?: AvatarSize;
};

// ─── Component ──────────────────────────────────────────

export default function AvatarGroup({
  avatars,
  max,
  size = 'Sm',
}: AvatarGroupProps) {
  const total = avatars.length;
  const hasOverflow = max != null && total > max;
  const visible = hasOverflow ? avatars.slice(0, max) : avatars;
  const overflowCount = hasOverflow ? total - max : 0;

  return (
    <View style={styles.container}>
      {visible.map((avatarProps, index) => (
        <View
          key={index}
          style={[
            styles.item,
            { zIndex: visible.length - index },
          ]}
        >
          <Avatar {...avatarProps} size={size} />
        </View>
      ))}

      {hasOverflow && overflowCount > 0 && (
        <View
          style={[
            styles.item,
            { zIndex: 0 },
          ]}
        >
          <Avatar
            type="Text"
            size={size}
            label={`+${overflowCount}`}
          />
        </View>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Math.abs(spacer['-8']),
  },

  item: {
    marginRight: spacer['-8'],
  },
});
