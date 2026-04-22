/**
 * ButtonMultiSelect component — mapped from Figma component documentation
 *
 * Props:
 *   items: string[] (labels for each selectable item)
 *   selected: number[] (indices of selected items)
 *   onToggle: (index: number) => void (toggle selection of an item)
 *   display: 'Fill' | 'Hug' (default 'Fill')
 *
 * Anatomy (from Figma docs):
 *   Container: pill (borderRadius round), border/subtle 0.5px, overflow hidden, flex row
 *   Items: pill, p spacer/12
 *     Selected: surface/highlight bg, text/onhighlight, body03Medium
 *     Unselected: transparent bg, text/bold, body03Light
 *   Fill: items flex 1 (equal width, container stretches)
 *   Hug: items shrink-0 (hug content)
 *   Allows multiple items to be selected at once
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, type ViewStyle, type LayoutChangeEvent } from 'react-native';
import { colors } from '../../lib/tokens/colors';
import { spacer, borderRadius, borderWidth } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

export type ButtonMultiSelectProps = {
  items: string[];
  selected: number[];
  onToggle?: (index: number) => void;
  display?: 'Fill' | 'Hug';
  /** Short labels used when container width < compactBreakpoint */
  compactItems?: string[];
  /** Width threshold to switch to compactItems (default 355) */
  compactBreakpoint?: number;
};

// ─── Component ──────────────────────────────────────────

export default function ButtonMultiSelect({
  items,
  selected,
  onToggle,
  display = 'Fill',
  compactItems,
  compactBreakpoint = 355,
}: ButtonMultiSelectProps) {
  const isFill = display === 'Fill';
  const [isCompact, setIsCompact] = useState(false);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    if (compactItems) {
      setIsCompact(e.nativeEvent.layout.width < compactBreakpoint);
    }
  }, [compactItems, compactBreakpoint]);

  const labels = isCompact && compactItems ? compactItems : items;

  return (
    <View style={[styles.container, isFill && styles.containerFill]} onLayout={handleLayout}>
      {labels.map((label, index) => {
        const isSelected = selected.includes(index);
        return (
          <Pressable
            key={index}
            style={[
              styles.item,
              isFill && styles.itemFill,
              isSelected && styles.itemSelected,
            ]}
            onPress={() => onToggle?.(index)}
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
