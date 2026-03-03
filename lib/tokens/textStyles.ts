/**
 * Semantic text styles — mapped from Figma published text styles (Kigen export)
 *
 * Each style composes foundational tokens (fontFamily, fontSize, lineHeight, fontWeight)
 * into ready-to-use React Native TextStyle objects.
 *
 * Naming: {category}-{scale}-{weight}
 * Categories: headline, title, body
 * Weights: light (300), medium (500)
 */

import { TextStyle } from 'react-native';
import { fontFamily, fontSize, lineHeight, fontWeight } from './typography';

// ─── Headline ───────────────────────────────────────────
export const headline01Light: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['48'],
  fontWeight: fontWeight['300'],
  lineHeight: lineHeight['48'],
  letterSpacing: 0,
};

export const headline01Medium: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['48'],
  fontWeight: fontWeight['500'],
  lineHeight: lineHeight['48'],
  letterSpacing: 0,
};

export const headline02Light: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['32'],
  fontWeight: fontWeight['300'],
  lineHeight: lineHeight['32'],
  letterSpacing: 0,
};

export const headline02Medium: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['32'],
  fontWeight: fontWeight['500'],
  lineHeight: lineHeight['32'],
  letterSpacing: 0,
};

export const headline03Light: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['28'],
  fontWeight: fontWeight['300'],
  lineHeight: lineHeight['28'],
  letterSpacing: 0,
};

export const headline03Medium: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['28'],
  fontWeight: fontWeight['500'],
  lineHeight: lineHeight['28'],
  letterSpacing: 0,
};

// ─── Title ──────────────────────────────────────────────
export const title01Light: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['24'],
  fontWeight: fontWeight['300'],
  lineHeight: lineHeight['24'],
  letterSpacing: 0,
};

export const title01Medium: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['24'],
  fontWeight: fontWeight['500'],
  lineHeight: lineHeight['24'],
  letterSpacing: 0,
};

export const title02Light: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['16'],
  fontWeight: fontWeight['300'],
  lineHeight: lineHeight['16'],
  letterSpacing: 0,
};

export const title02Medium: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['16'],
  fontWeight: fontWeight['500'],
  lineHeight: lineHeight['16'],
  letterSpacing: 0,
};

// ─── Body ───────────────────────────────────────────────
export const body01Light: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['16'],
  fontWeight: fontWeight['300'],
  lineHeight: lineHeight['16'],
  letterSpacing: 0,
};

export const body01Medium: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['16'],
  fontWeight: fontWeight['500'],
  lineHeight: lineHeight['16'],
  letterSpacing: 0,
};

export const body02Light: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['14'],
  fontWeight: fontWeight['300'],
  lineHeight: lineHeight['14'],
  letterSpacing: 0,
};

export const body02Medium: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['14'],
  fontWeight: fontWeight['500'],
  lineHeight: lineHeight['14'],
  letterSpacing: 0,
};

export const body03Light: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['12'],
  fontWeight: fontWeight['300'],
  lineHeight: lineHeight['12'],
  letterSpacing: 0,
};

export const body03Medium: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['12'],
  fontWeight: fontWeight['500'],
  lineHeight: lineHeight['12'],
  letterSpacing: 0,
};

export const body04Light: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['11'],
  fontWeight: fontWeight['300'],
  lineHeight: lineHeight['11'],
  letterSpacing: 0,
};

export const body04Medium: TextStyle = {
  fontFamily: fontFamily.base,
  fontSize: fontSize['11'],
  fontWeight: fontWeight['500'],
  lineHeight: lineHeight['11'],
  letterSpacing: 0,
};

// ─── Grouped export for convenience ─────────────────────
export const textStyles = {
  headline01Light,
  headline01Medium,
  headline02Light,
  headline02Medium,
  headline03Light,
  headline03Medium,
  title01Light,
  title01Medium,
  title02Light,
  title02Medium,
  body01Light,
  body01Medium,
  body02Light,
  body02Medium,
  body03Light,
  body03Medium,
  body04Light,
  body04Medium,
} as const;

export type TextStyleToken = keyof typeof textStyles;
