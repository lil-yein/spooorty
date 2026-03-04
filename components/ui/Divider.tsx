/**
 * Divider component — mapped from Figma component documentation
 *
 * Props (from Figma properties):
 *   emphasis: Bold | Subtle (default Subtle)
 *
 * Anatomy (from Figma docs):
 *   Horizontal line, full width
 *   Bold: border/bold color, 0.5px
 *   Subtle: border/subtle color, 0.5px
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../lib/tokens/colors';

// ─── Types ──────────────────────────────────────────────

export type DividerProps = {
  emphasis?: 'Bold' | 'Subtle';
};

// ─── Component ──────────────────────────────────────────

export default function Divider({ emphasis = 'Subtle' }: DividerProps) {
  return (
    <View
      style={[
        styles.line,
        {
          backgroundColor:
            emphasis === 'Bold' ? colors.border.bold : colors.border.subtle,
        },
      ]}
    />
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  line: {
    height: 0.5,
    width: '100%',
  },
});
