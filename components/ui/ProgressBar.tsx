/**
 * ProgressBar component — mapped from Figma component documentation
 *
 * Props:
 *   progress: 0 to 1 (percentage filled)
 *
 * Anatomy (from Figma docs):
 *   Track: surface/subtle bg, borderRadius round, height 12px, full width
 *   Fill: surface/highlight bg, borderRadius round, height 12px, width = progress %
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../lib/tokens/colors';
import { borderRadius } from '../../lib/tokens/spacing';

// ─── Types ──────────────────────────────────────────────

export type ProgressBarProps = {
  progress?: number; // 0 to 1
};

// ─── Component ──────────────────────────────────────────

export default function ProgressBar({ progress = 0 }: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${clampedProgress * 100}%` }]} />
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 12,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface.subtle,
    overflow: 'hidden',
  },

  fill: {
    height: 12,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface.highlight,
  },
});
