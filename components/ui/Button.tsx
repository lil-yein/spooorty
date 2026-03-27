/**
 * Button component — mapped from Figma component documentation
 *
 * Props (from Figma properties):
 *   emphasis: Bold | Subtle | Minimal
 *   textStyle: Medium | Light
 *   content: Text | Icon
 *   size: Sm | Md
 *   state: Enabled | Loading
 *   label: string (for Text content)
 *   leadingIcon: ReactNode (optional)
 *   trailingIcon: ReactNode (optional)
 *   icon: ReactNode (for Icon content)
 *
 * Anatomy (from Figma docs):
 *   Bold:    surface/inverse bg, text/onhighlight, icon/onhighlight
 *   Subtle:  surface/bold bg, border/subtle 0.5px, text/bold, icon/bold
 *   Minimal: surface/bold bg, no border, text/bold, icon/bold
 *   Loading: text/subtle, icon/subtle for all emphasis levels
 *   Text content: fills container width
 *   Icon content: hugs content
 *   Md: height 48, padding spacer/16, gap spacer/8
 *   Sm: padding spacer/10, gap spacer/8 (Icon content only)
 *   Border radius: round (999)
 */

import React from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
  type PressableProps,
} from 'react-native';
import { colors } from '../../lib/tokens/colors';
import { spacer, borderRadius } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

type Emphasis = 'Bold' | 'Subtle' | 'Minimal';
type ButtonTextStyle = 'Medium' | 'Light';
type Content = 'Text' | 'Icon';
type Size = 'Sm' | 'Md';
type State = 'Enabled' | 'Loading';

/** Render function for icons — receives resolved color and size */
type IconRenderer = (props: { color: string; size: number }) => React.ReactNode;

export type ButtonProps = {
  emphasis?: Emphasis;
  textStyle?: ButtonTextStyle;
  content?: Content;
  size?: Size;
  state?: State;
  label?: string;
  leadingIcon?: IconRenderer;
  trailingIcon?: IconRenderer;
  icon?: IconRenderer;
  onPress?: PressableProps['onPress'];
  disabled?: PressableProps['disabled'];
  /** Override default text color (e.g. colors.text.subtle for inactive states) */
  overrideTextColor?: string;
};

// ─── Component ──────────────────────────────────────────

export default function Button({
  emphasis = 'Bold',
  textStyle = 'Medium',
  content = 'Text',
  size = 'Md',
  state = 'Enabled',
  label = 'Button',
  leadingIcon,
  trailingIcon,
  icon,
  onPress,
  disabled,
  overrideTextColor,
}: ButtonProps) {
  const isLoading = state === 'Loading';
  const isDisabled = disabled || isLoading;

  // ── Container styles ────────────────────────────────────
  const containerStyle: ViewStyle[] = [
    styles.base,
    // Size
    size === 'Md' && content === 'Text' && styles.mdText,
    size === 'Md' && content === 'Icon' && styles.mdIcon,
    size === 'Sm' && content === 'Text' && styles.smText,
    size === 'Sm' && content === 'Icon' && styles.smIcon,
    // Emphasis
    emphasis === 'Bold' && styles.emphasisBold,
    emphasis === 'Subtle' && styles.emphasisSubtle,
    emphasis === 'Minimal' && styles.emphasisMinimal,
    // Disabled: reduce opacity
    disabled && styles.disabled,
  ].filter(Boolean) as ViewStyle[];

  // ── Text color ──────────────────────────────────────────
  const textColor: string = overrideTextColor
    ? overrideTextColor
    : isLoading || disabled
      ? colors.text.subtle
      : emphasis === 'Bold'
        ? colors.text.onhighlight
        : colors.text.bold;

  // ── Icon color ──────────────────────────────────────────
  const iconColor: string = overrideTextColor
    ? overrideTextColor
    : isLoading || disabled
      ? colors.icon.subtle
      : emphasis === 'Bold'
        ? colors.icon.onhighlight
        : colors.icon.bold;

  // ── Text style (Medium = 500, Light = 300) ──────────────
  const labelStyle: TextStyle =
    size === 'Sm'
      ? (textStyle === 'Medium' ? textStyles.body03Medium : textStyles.body03Light)
      : (textStyle === 'Medium' ? textStyles.title02Medium : textStyles.title02Light);

  return (
    <Pressable
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
    >
      {content === 'Text' ? (
        <>
          {leadingIcon && (
            <View style={styles.iconWrapper}>
              {leadingIcon({ color: iconColor, size: 16 })}
            </View>
          )}

          {isLoading ? (
            <ActivityIndicator size="small" color={textColor} />
          ) : (
            <Text style={[labelStyle, { color: textColor }]}>{label}</Text>
          )}

          {trailingIcon && (
            <View style={styles.iconWrapper}>
              {trailingIcon({ color: iconColor, size: 16 })}
            </View>
          )}
        </>
      ) : (
        // Icon-only content
        <View style={styles.iconWrapper}>
          {isLoading ? (
            <ActivityIndicator size="small" color={iconColor} />
          ) : icon ? (
            icon({ color: iconColor, size: 16 })
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  // Base (shared)
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.round,
    gap: spacer['8'],
  },

  // Size: Md + Text (fill container)
  mdText: {
    height: 48,
    paddingHorizontal: spacer['16'],
    paddingVertical: spacer['16'],
    alignSelf: 'stretch',
  },

  // Size: Md + Icon (hug content)
  mdIcon: {
    height: 48,
    padding: spacer['16'],
  },

  // Size: Sm + Text (fill container, smaller height)
  smText: {
    height: 36,
    paddingHorizontal: spacer['12'],
    paddingVertical: spacer['10'],
    alignSelf: 'stretch',
  },

  // Size: Sm + Icon (hug content)
  smIcon: {
    padding: spacer['10'],
  },

  // Emphasis: Bold
  emphasisBold: {
    backgroundColor: colors.surface.inverse,
  },

  // Emphasis: Subtle
  emphasisSubtle: {
    backgroundColor: colors.surface.bold,
    borderWidth: 0.5,
    borderColor: colors.border.subtle,
  },

  // Emphasis: Minimal
  emphasisMinimal: {
    backgroundColor: colors.surface.bold,
  },

  // Disabled state
  disabled: {
    opacity: 0.4,
  },

  // Icon wrapper
  iconWrapper: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
