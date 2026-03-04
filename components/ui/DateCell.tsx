/**
 * DateCell component — mapped from Figma component documentation
 *
 * Props (from Figma properties):
 *   day: number (1–31)
 *   selected: boolean (shows circle bg + border)
 *   today: boolean (Medium weight text)
 *   events: boolean (shows dot indicator below)
 *   onPress: callback
 *
 * Anatomy (from Figma docs):
 *   Container: flex col, gap spacer/4, items center, justify center
 *   Circle: 40x40, borderRadius round
 *     Selected: surface/subtle bg, border/subtle 0.5px
 *     Unselected: no bg/border
 *   Text: body01Light (16px Light), text/bold
 *     Today: body01Medium (16px Medium), text/highlight
 *   Event indicator: small dots row, 4px height below circle
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../lib/tokens/colors';
import { spacer, borderRadius } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

export type DateCellProps = {
  day: number;
  selected?: boolean;
  today?: boolean;
  events?: boolean;
  onPress?: () => void;
};

// ─── Component ──────────────────────────────────────────

export default function DateCell({
  day,
  selected = false,
  today = false,
  events = false,
  onPress,
}: DateCellProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {/* Circle */}
      <View style={[styles.circle, selected && styles.circleSelected]}>
        <Text
          style={[
            today ? textStyles.body01Medium : textStyles.body01Light,
            {
              color: today ? colors.text.highlight : colors.text.bold,
              textAlign: 'center',
              width: 20,
            },
          ]}
        >
          {day}
        </Text>
      </View>

      {/* Event indicator dots */}
      {events && (
        <View style={styles.indicator}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      )}
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
  },

  circle: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleSelected: {
    backgroundColor: colors.surface.subtle,
    borderWidth: 0.5,
    borderColor: colors.border.subtle,
  },

  indicator: {
    flexDirection: 'row',
    gap: 2,
    height: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.icon.bold,
  },
});
