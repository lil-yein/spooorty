/**
 * Button component — mapped from Figma component documentation
 *
 * Props (from Figma properties):
 *   emphasis: Bold | Subtle | Minimal
 *   textStyle: Medium | Light
 *   content: Text | Icon
 *   size: Sm | Md
 *   state: Enabled | Disabled | Loading
 *   label: string (for Text content)
 *   leadingIcon: ReactNode (optional)
 *   trailingIcon: ReactNode (optional)
 *   icon: ReactNode (for Icon content)
 *
 * State semantics:
 *   Enabled  — interactive, normal colors
 *   Disabled — non-interactive, muted text + icon (text/subtle, icon/subtle).
 *              No spinner. Use this for "form not yet valid" / "min N items
 *              not selected" cases. Replaces what used to be `state="Loading"`
 *              for that visual.
 *   Loading  — non-interactive, normal colors PLUS a small spinner shown
 *              before the label (for Text content) or replacing the icon
 *              (for Icon content). Use this for genuine in-flight async
 *              operations so the user sees both the action label and a
 *              progress indicator.
 *
 * Anatomy (from Figma docs):
 *   Bold:    surface/inverse bg, text/onhighlight, icon/onhighlight
 *   Subtle:  surface/bold bg, border/subtle 1px, text/bold, icon/bold
 *   Minimal: surface/bold bg, no border, text/bold, icon/bold
 *   Disabled: text/subtle, icon/subtle for all emphasis levels
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
import { spacer, borderRadius, borderWidth } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

type Emphasis = 'Bold' | 'Subtle' | 'Minimal';
type ButtonTextStyle = 'Medium' | 'Light';
type Content = 'Text' | 'Icon';
type Size = 'Sm' | 'Md';
type State = 'Enabled' | 'Disabled' | 'Loading';

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
  const iconSize = size === 'Sm' ? 12 : 16;
  const isLoading = state === 'Loading';
  const isStateDisabled = state === 'Disabled';
  // The button shouldn't fire onPress while loading or in the Disabled
  // state, and the legacy `disabled` prop still hard-disables it.
  const isInteractionBlocked = disabled || isLoading || isStateDisabled;
  // Muted text/icon visual: applied for Disabled state OR the legacy
  // `disabled` prop. Loading keeps full-color label so users can still
  // read the action that's in flight.
  const showMutedColors = isStateDisabled || disabled;

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
    // Legacy `disabled` prop still applies opacity for backward compat;
    // the new Disabled state relies on muted colors alone (per Figma).
    disabled && styles.disabled,
  ].filter(Boolean) as ViewStyle[];

  // ── Text color ──────────────────────────────────────────
  const textColor: string = overrideTextColor
    ? overrideTextColor
    : showMutedColors
      ? colors.text.subtle
      : emphasis === 'Bold'
        ? colors.text.onhighlight
        : colors.text.bold;

  // ── Icon color ──────────────────────────────────────────
  const iconColor: string = overrideTextColor
    ? overrideTextColor
    : showMutedColors
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
      disabled={isInteractionBlocked}
    >
      {content === 'Text' ? (
        <>
          {/* When loading, the spinner takes the leadingIcon slot. Otherwise
              we render the leadingIcon if one was provided. */}
          {isLoading ? (
            <View style={styles.iconWrapper}>
              <ActivityIndicator size="small" color={iconColor} />
            </View>
          ) : leadingIcon ? (
            <View style={styles.iconWrapper}>
              {leadingIcon({ color: iconColor, size: iconSize })}
            </View>
          ) : null}

          {/* Label is always visible — even during Loading — so users can
              read the action that's in flight. */}
          <Text style={[labelStyle, { color: textColor }]}>{label}</Text>

          {trailingIcon && (
            <View style={styles.iconWrapper}>
              {trailingIcon({ color: iconColor, size: iconSize })}
            </View>
          )}
        </>
      ) : (
        // Icon-only content: spinner replaces the icon during Loading.
        <View style={styles.iconWrapper}>
          {isLoading ? (
            <ActivityIndicator size="small" color={iconColor} />
          ) : icon ? (
            icon({ color: iconColor, size: iconSize })
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
    borderWidth: borderWidth.regular,
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
