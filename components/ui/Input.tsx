/**
 * Input component — mapped from Figma component documentation
 *
 * Props (from Figma properties):
 *   size: Sm | Md (default Sm)
 *   state: Enabled | Active | Filled (managed internally via focus/value)
 *   placeholder: string
 *   value / onChangeText: controlled input
 *
 * Anatomy (from Figma docs):
 *   Shape: pill (borderRadius round), borderWidth 0.5
 *   Border: border/subtle default, border/bold on focus
 *   Sm: padding spacer/12, text body03Light (12px), icon 12px
 *   Md: padding spacer/16, text title02Light (16px), icon 16px
 *   Trailing icon: pencil (edit), always visible
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  type TextInputProps,
} from 'react-native';
import Icon from './Icon';
import { colors } from '../../lib/tokens/colors';
import { spacer, borderRadius, borderWidth } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

type InputSize = 'Sm' | 'Md';

export type InputProps = {
  size?: InputSize;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
} & Omit<TextInputProps, 'style' | 'placeholderTextColor'>;

// ─── Size config ────────────────────────────────────────

const SIZE_CONFIG = {
  Sm: {
    padding: spacer['12'],
    textStyle: textStyles.body03Light,
    iconSize: 12,
  },
  Md: {
    padding: spacer['16'],
    textStyle: textStyles.title02Light,
    iconSize: 16,
  },
} as const;

// ─── Component ──────────────────────────────────────────

export default function Input({
  size = 'Sm',
  placeholder = 'Enter text',
  value,
  onChangeText,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const config = SIZE_CONFIG[size];

  return (
    <View
      style={[
        styles.container,
        {
          padding: config.padding,
          borderColor: focused ? colors.border.bold : colors.border.subtle,
        },
      ]}
    >
      <TextInput
        style={[styles.input, config.textStyle]}
        placeholder={placeholder}
        placeholderTextColor={colors.text.subtle}
        value={value}
        onChangeText={onChangeText}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        {...rest}
      />
      <View
        style={[
          styles.iconWrap,
          { width: config.iconSize, height: config.iconSize },
        ]}
      >
        <Icon
          type="edit"
          size={config.iconSize}
          color={value ? colors.icon.bold : colors.icon.subtle}
        />
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
    borderRadius: borderRadius.round,
    borderWidth: borderWidth.regular,
    overflow: 'hidden',
  },

  input: {
    flex: 1,
    color: colors.text.bold,
    padding: 0,
    margin: 0,
    ...({ outlineStyle: 'none' } as any),
  },

  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
