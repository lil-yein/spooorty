/**
 * Spacing tokens — mapped 1:1 from Figma Variables (Spacer collection)
 *
 * Groups: grid, spacer, borderRadius, borderWidth
 */

// ─── Grid ───────────────────────────────────────────────
export const grid = {
  margin: 16,
  gutter: 12,
} as const;

// ─── Spacer ─────────────────────────────────────────────
// Negative spacers (for overlapping/offsets)
// Positive spacers (ascending scale)
export const spacer = {
  '-2': -2,
  '-4': -4,
  '-8': -8,
  '-16': -16,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '6': 6,
  '8': 8,
  '10': 10,
  '12': 12,
  '14': 14,
  '16': 16,
  '18': 18,
  '20': 20,
  '24': 24,
  '28': 28,
  '32': 32,
  '34': 34,
  '36': 36,
  '40': 40,
  '48': 48,
  '54': 54,
  '64': 64,
  '72': 72,
  '84': 84,
  '96': 96,
  '108': 108,
  '128': 128,
  '248': 248,
  '280': 280,
} as const;

// ─── Border Radius ──────────────────────────────────────
export const borderRadius = {
  '8': 8,
  '16': 16,
  round: 999,
} as const;

// ─── Border Width ───────────────────────────────────────
export const borderWidth = {
  thin: 0.5,
  regular: 1,
} as const;

export type GridToken = keyof typeof grid;
export type SpacerToken = keyof typeof spacer;
export type BorderRadiusToken = keyof typeof borderRadius;
export type BorderWidthToken = keyof typeof borderWidth;
