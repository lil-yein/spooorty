/**
 * Typography tokens — mapped 1:1 from Figma Variables (Type-foundation collection)
 *
 * Groups: fontFamily, fontSize, lineHeight, fontWeight
 */

// ─── Font Family ────────────────────────────────────────
export const fontFamily = {
  base: 'Nohemi',
  light: 'Nohemi-Light',
  medium: 'Nohemi-Regular',
} as const;

// ─── Font Size ──────────────────────────────────────────
export const fontSize = {
  '11': 11,
  '12': 12,
  '14': 14,
  '16': 16,
  '24': 24,
  '28': 28,
  '32': 32,
  '48': 48,
} as const;

// ─── Line Height ────────────────────────────────────────
export const lineHeight = {
  '11': 11,
  '12': 12,
  '14': 14,
  '16': 16,
  '24': 24,
  '28': 28,
  '32': 32,
  '48': 48,
} as const;

// ─── Font Weight ────────────────────────────────────────
// Maps to React Native fontWeight values
export const fontWeight = {
  '300': '300',
  '400': '400',
  '500': '500',
  '700': '700',
} as const;

export type FontSizeToken = keyof typeof fontSize;
export type LineHeightToken = keyof typeof lineHeight;
export type FontWeightToken = keyof typeof fontWeight;
