/**
 * Switch component — mapped from Figma component documentation
 *
 * Props (from Figma properties):
 *   value: boolean (on/off)
 *   onToggle: (value: boolean) => void
 *
 * Anatomy (from Figma docs):
 *   Shape: pill (borderRadius round), height 16px
 *   On: surface/highlight (black) bg, white 14px circle handle on right
 *   Off: surface/bold (white) bg, border/subtle 0.5px, black 14px circle handle on left
 *   Padding: 1px horizontal, internal layout pushes handle via 14px spacer
 */

import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
} from 'react-native';
import { colors } from '../../lib/tokens/colors';
import { borderRadius, borderWidth } from '../../lib/tokens/spacing';

// ─── Types ──────────────────────────────────────────────

export type SwitchProps = {
  value: boolean;
  onToggle?: (value: boolean) => void;
};

// ─── Component ──────────────────────────────────────────

export default function Switch({ value, onToggle }: SwitchProps) {
  return (
    <Pressable
      onPress={() => onToggle?.(!value)}
      style={[
        styles.track,
        value ? styles.trackOn : styles.trackOff,
      ]}
    >
      {/* Spacer pushes handle to right when on */}
      {value && <View style={styles.spacer} />}

      <View
        style={[
          styles.handle,
          value ? styles.handleOn : styles.handleOff,
        ]}
      />

      {/* Spacer pushes handle to left when off */}
      {!value && <View style={styles.spacer} />}
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 16,
    borderRadius: borderRadius.round,
    paddingHorizontal: 1,
    paddingVertical: 2,
    overflow: 'hidden',
  },

  trackOn: {
    backgroundColor: colors.surface.highlight,
    borderWidth: borderWidth.thin,
    borderColor: colors.surface.highlight,
  },

  trackOff: {
    backgroundColor: colors.surface.bold,
    borderWidth: borderWidth.thin,
    borderColor: colors.border.subtle,
  },

  spacer: {
    width: 14,
    height: 14,
  },

  handle: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },

  handleOn: {
    backgroundColor: colors.surface.bold,
  },

  handleOff: {
    backgroundColor: colors.surface.highlight,
  },
});
