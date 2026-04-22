/**
 * Search component — mapped from Figma component documentation
 *
 * Props (from Figma properties):
 *   state: Enabled | Active | Filled (managed internally via focus/value)
 *   icon: boolean (show trailing search icon, default true)
 *   placeholder: string
 *   value / onChangeText: controlled input
 *
 * Anatomy (from Figma docs):
 *   Shape: pill (borderRadius round), borderWidth 0.5
 *   Border: border/subtle default, border/bold on focus
 *   Padding: spacer/12 all around, gap spacer/8
 *   Text: body03Light, text/subtle placeholder, text/bold value
 *   Trailing icon: 12px search, optional via icon prop
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

export type SearchProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  /** Show trailing search icon (default true) */
  showIcon?: boolean;
} & Omit<TextInputProps, 'style' | 'placeholderTextColor'>;

// ─── Component ──────────────────────────────────────────

export default function Search({
  placeholder = 'Search',
  value,
  onChangeText,
  showIcon = true,
  ...rest
}: SearchProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        { borderColor: focused ? colors.border.bold : colors.border.subtle },
      ]}
    >
      <TextInput
        style={styles.input}
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
        returnKeyType="search"
        {...rest}
      />
      {showIcon && (
        <View style={styles.iconWrap}>
          <Icon
            type="search"
            size={12}
            color={value ? colors.icon.bold : colors.icon.subtle}
          />
        </View>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
    padding: spacer['12'],
    borderRadius: borderRadius.round,
    borderWidth: borderWidth.thin,
    overflow: 'hidden',
  },

  input: {
    flex: 1,
    ...textStyles.body03Light,
    color: colors.text.bold,
    height: textStyles.body03Light.lineHeight,
    padding: 0,
    margin: 0,
    ...({ outlineStyle: 'none' } as any),
  },

  iconWrap: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
