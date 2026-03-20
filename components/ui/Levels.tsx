/**
 * Levels component — mapped from Figma component documentation
 *
 * Description: ONLY for level indicator inside a card
 *
 * Props (from Figma properties):
 *   indicator: 1 | 2 | 3 | 4 | 5 (which level is selected)
 *
 * Anatomy (from Figma docs):
 *   Labels: Beginner, Beg-Int, Intermediate, Int-Adv, Advanced
 *   Labels row: justify-between, px spacer/16
 *   Selected label: body03Medium, text/bold
 *   Unselected: body03Light, text/bold
 *   Triangle: 14×8 SVG, icon/bold, centered below selected label
 *   Line: 0.5px border/subtle, full width
 *   Gap: spacer/16 between labels row and line
 *
 * Responsive:
 *   When container width < 320px, labels switch to abbreviated form:
 *   Beg, Beg-Int, Inter, Int-Adv, Adv
 *
 * Requirements:
 *   Indicator property has fixed left padding value as it
 *   depends on the length of the word of levels.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, type LayoutChangeEvent } from 'react-native';
import { colors } from '../../lib/tokens/colors';
import { spacer } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';
import Divider from './Divider';

// ─── Types ──────────────────────────────────────────────

export type LevelsProps = {
  /** Currently selected level (1-5) */
  indicator?: 1 | 2 | 3 | 4 | 5;
};

// ─── Labels ─────────────────────────────────────────────

const LABELS_FULL = ['Beginner', 'Beg-Int', 'Intermediate', 'Int-Adv', 'Advanced'];
const LABELS_SHORT = ['Beg', 'Beg-Int', 'Inter', 'Int-Adv', 'Adv'];

const COMPACT_BREAKPOINT = 320;

// ─── Triangle (CSS border trick, 14×8) ──────────────────

function Triangle() {
  return <View style={triangleStyles.shape} />;
}

const triangleStyles = StyleSheet.create({
  shape: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.icon.bold,
  },
});

// ─── Component ──────────────────────────────────────────

export default function Levels({ indicator = 1 }: LevelsProps) {
  const selectedIndex = indicator - 1;
  const [isCompact, setIsCompact] = useState(false);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    setIsCompact(width < COMPACT_BREAKPOINT);
  }, []);

  const labels = isCompact ? LABELS_SHORT : LABELS_FULL;

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {/* Labels row */}
      <View style={styles.labelsRow}>
        {labels.map((label, index) => {
          const isSelected = index === selectedIndex;
          return (
            <View key={label} style={styles.labelWrap}>
              <Text
                style={[
                  isSelected ? textStyles.body03Medium : textStyles.body03Light,
                  styles.labelText,
                ]}
              >
                {label}
              </Text>

              {/* Triangle centered below selected label */}
              {isSelected && (
                <View style={styles.triangleWrap}>
                  <Triangle />
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Horizontal line */}
      <Divider />
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: spacer['16'],
  },

  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacer['16'],
  },

  labelWrap: {
    alignItems: 'center',
    position: 'relative',
  },

  labelText: {
    color: colors.text.bold,
    textAlign: 'center',
  },

  triangleWrap: {
    position: 'absolute',
    top: 20,
    alignItems: 'center',
  },
});
