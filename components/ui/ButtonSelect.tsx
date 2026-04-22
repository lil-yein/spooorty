/**
 * ButtonSelect component — mapped from Figma component documentation
 *
 * Props:
 *   items: string[] (labels for each selectable item)
 *   selected: number (index of the selected item)
 *   onSelect: (index: number) => void (select a single item)
 *   display: 'Fill' | 'Hug' (default 'Fill')
 *
 * Anatomy (from Figma docs):
 *   Container: pill (borderRadius round), border/subtle 0.5px, overflow hidden, flex row
 *   Items: pill, p spacer/12
 *     Selected: surface/highlight bg, text/onhighlight, body03Medium
 *     Unselected: transparent bg, text/bold, body03Light
 *   Fill: items flex 1 (equal width, container stretches)
 *   Hug: items shrink-0 (hug content)
 *   Only one item can be selected at a time (single-select)
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { colors } from '../../lib/tokens/colors';
import { spacer, borderRadius, borderWidth } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

export type ButtonSelectProps = {
  items: string[];
  selected: number;
  onSelect?: (index: number) => void;
  display?: 'Fill' | 'Hug';
};

// ─── Component ──────────────────────────────────────────

export default function ButtonSelect({
  items,
  selected,
  onSelect,
  display = 'Fill',
}: ButtonSelectProps) {
  const isFill = display === 'Fill';

  return (
    <View style={[styles.container, isFill && styles.containerFill]}>
      {items.map((label, index) => {
        const isSelected = selected === index;
        return (
          <Pressable
            key={index}
            style={[
              styles.item,
              isFill && styles.itemFill,
              isSelected && styles.itemSelected,
            ]}
            onPress={() => onSelect?.(index)}
          >
            <Text
              style={[
                isSelected ? styles.textSelected : styles.textUnselected,
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.round,
    borderWidth: borderWidth.thin,
    borderColor: colors.border.subtle,
    overflow: 'hidden',
  },

  containerFill: {
    width: '100%',
  },

  item: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacer['12'],
    borderRadius: borderRadius.round,
  },

  itemFill: {
    flex: 1,
  },

  itemSelected: {
    backgroundColor: colors.surface.highlight,
  },

  textSelected: {
    ...textStyles.body03Medium,
    color: colors.text.onhighlight,
  },

  textUnselected: {
    ...textStyles.body03Light,
    color: colors.text.bold,
  },
});
