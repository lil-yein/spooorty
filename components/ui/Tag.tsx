/**
 * Tag component — mapped from Figma component documentation
 *
 * Props (from Figma properties):
 *   selected: boolean (default false)
 *   size: Lg | Sm (default Lg)
 *   label: string
 *
 * Anatomy (from Figma docs):
 *   Shape: pill (borderRadius round)
 *   Selected: surface/highlight bg, text/onhighlight text, Medium weight
 *   Not selected: border/subtle 0.5px border, text/bold text, Light weight
 *   Lg: px spacer/24, py spacer/12, title02 (16px)
 *   Sm: px spacer/16, py spacer/8, body03 (12px)
 */

import React from 'react';
import {
  Text,
  Pressable,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { colors } from '../../lib/tokens/colors';
import { spacer } from '../../lib/tokens/spacing';
import { borderRadius } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

type TagSize = 'Lg' | 'Sm';

export type TagProps = {
  label: string;
  selected?: boolean;
  size?: TagSize;
  onPress?: () => void;
  style?: ViewStyle;
};

// ─── Size configs ───────────────────────────────────────

const SIZE_STYLES: Record<TagSize, { container: ViewStyle; selectedText: TextStyle; unselectedText: TextStyle }> = {
  Lg: {
    container: { paddingHorizontal: spacer['24'], paddingVertical: spacer['12'] },
    selectedText: textStyles.title02Medium,
    unselectedText: textStyles.title02Light,
  },
  Sm: {
    container: { paddingHorizontal: spacer['16'], paddingVertical: spacer['8'] },
    selectedText: textStyles.body03Medium,
    unselectedText: textStyles.body03Light,
  },
};

// ─── Component ──────────────────────────────────────────

export default function Tag({
  label,
  selected = false,
  size = 'Lg',
  onPress,
  style,
}: TagProps) {
  const sizeConfig = SIZE_STYLES[size];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        sizeConfig.container,
        selected ? styles.selectedContainer : styles.unselectedContainer,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          selected ? sizeConfig.selectedText : sizeConfig.unselectedText,
          { color: selected ? colors.text.onhighlight : colors.text.bold },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedContainer: {
    backgroundColor: colors.surface.highlight,
  },

  unselectedContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: colors.border.subtle,
  },

  text: {
    textAlign: 'center',
  },
});
