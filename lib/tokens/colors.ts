/**
 * Color tokens — mapped 1:1 from Figma Variables (Color collection)
 *
 * Naming: {category}-{variant}
 * Categories: surface, text, icon, border
 * Variants: bold, subtle, highlight, onhighlight, inverse, overlay, blur
 */

export const colors = {
  // ─── Surface ────────────────────────────────────────
  surface: {
    bold: '#FFFFFF',
    subtle: '#F6F6F6',
    highlight: '#000000',
    inverse: '#000000',
    overlay: 'rgba(0, 0, 0, 0.20)',
    blur: 'rgba(255, 255, 255, 0.70)',
    transparent: 'rgba(255, 255, 255, 0)',
  },

  // ─── Text ───────────────────────────────────────────
  text: {
    bold: '#000000',
    subtle: '#717171',
    highlight: '#000000',
    onhighlight: '#FFFFFF',
    inverse: '#FFFFFF',
    error: '#A20D0D',
  },

  // ─── Icon ───────────────────────────────────────────
  icon: {
    bold: '#000000',
    subtle: '#717171',
    highlight: '#000000',
    onhighlight: '#FFFFFF',
    inverse: '#FFFFFF',
    error: '#A20D0D',
  },

  // ─── Border ─────────────────────────────────────────
  border: {
    bold: '#000000',
    subtle: '#8B8B8B',
    highlight: '#000000',
    onhighlight: '#FFFFFF',
    inverse: '#FFFFFF',
  },
} as const;

export type ColorCategory = keyof typeof colors;
export type SurfaceVariant = keyof typeof colors.surface;
export type TextVariant = keyof typeof colors.text;
export type IconVariant = keyof typeof colors.icon;
export type BorderVariant = keyof typeof colors.border;
