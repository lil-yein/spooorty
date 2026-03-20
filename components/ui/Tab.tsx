/**
 * Tab component — mapped from Figma component documentation
 *
 * Props (from Figma properties):
 *   items: string[] (tab labels)
 *   selected: number (selected tab index)
 *   onSelect: (index: number) => void
 *
 * Anatomy (from Figma docs):
 *   Layout: horizontal row, gap spacer/24, px spacer/16
 *   Selected tab: title02Medium, text/bold, 1px underline at bottom
 *   Unselected tab: title02Light, text/subtle, no underline
 *   Each tab item: py spacer/12
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { colors } from '../../lib/tokens/colors';
import { spacer } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

export type TabProps = {
  items: string[];
  selected: number;
  onSelect: (index: number) => void;
};

// ─── Component ──────────────────────────────────────────

export default function Tab({ items, selected, onSelect }: TabProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {items.map((label, index) => {
          const isSelected = index === selected;
          return (
            <Pressable
              key={index}
              onPress={() => onSelect(index)}
              style={styles.tabItem}
            >
              <Text
                style={[
                  isSelected ? textStyles.title02Medium : textStyles.title02Light,
                  { color: isSelected ? colors.text.bold : colors.text.subtle },
                ]}
              >
                {label}
              </Text>
              {isSelected && <View style={styles.underline} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacer['16'],
    paddingTop: spacer['16'],
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['24'],
  },

  tabItem: {
    paddingVertical: spacer['12'],
    position: 'relative',
  },

  underline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: colors.border.bold,
  },
});
