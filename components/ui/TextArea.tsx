/**
 * TextArea component — mapped from Figma component documentation
 *
 * Props (from Figma properties):
 *   state: Enabled | Active | Filled (managed internally via focus/value)
 *   icon: boolean (show trailing pencil icon, default true)
 *   placeholder: string
 *   value / onChangeText: controlled input
 *
 * Anatomy (from Figma docs):
 *   Shape: borderRadius 16, borderWidth 0.5
 *   Height: 64px
 *   Border: border/subtle default, border/bold on focus
 *   Padding: spacer/12 all around, gap spacer/8
 *   Text: body03Light, text/subtle placeholder, text/bold value
 *   Alignment: items flex-start (top-aligned for multi-line)
 *   Trailing icon: 12px pencil, optional via icon prop
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  type TextInputProps,
} from 'react-native';
import Icon from './Icon';
import { colors } from '../../lib/tokens/colors';
import { spacer, borderRadius, borderWidth } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

export type TextAreaProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  /** Show trailing pencil icon (default true) */
  showIcon?: boolean;
} & Omit<TextInputProps, 'style' | 'placeholderTextColor' | 'multiline'>;

// ─── Component ──────────────────────────────────────────

export default function TextArea({
  placeholder = 'Add your description',
  value,
  onChangeText,
  showIcon = true,
  ...rest
}: TextAreaProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Hide scrollbar on web (showsVerticalScrollIndicator only works on native)
  useEffect(() => {
    if (Platform.OS === 'web' && inputRef.current) {
      const node = inputRef.current as unknown as HTMLTextAreaElement;
      if (node?.style) {
        node.style.scrollbarWidth = 'none'; // Firefox
        // @ts-ignore — webkit vendor prefix
        node.style.webkitOverflowScrolling = 'touch';
      }
    }
  }, []);

  return (
    <View
      style={[
        styles.container,
        { borderColor: focused ? colors.border.bold : colors.border.subtle },
      ]}
    >
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.text.subtle}
        value={value}
        onChangeText={onChangeText}
        multiline
        textAlignVertical="top"
        {...({ showsVerticalScrollIndicator: false } as any)}
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
      {showIcon && (
        <View style={styles.iconWrap}>
          <Icon
            type="edit"
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
    alignItems: 'flex-start',
    gap: spacer['8'],
    padding: spacer['12'],
    borderRadius: borderRadius['16'],
    borderWidth: borderWidth.regular,
    height: 64,
  },

  input: {
    flex: 1,
    ...textStyles.body03Light,
    color: colors.text.bold,
    padding: 0,
    margin: 0,
    height: '100%' as unknown as number,
    textAlignVertical: 'top',
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
