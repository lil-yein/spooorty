/**
 * Icon component — foundation icon from Figma design system
 *
 * Props:
 *   type: IconType (32 glyph names matching Google Material Icon, default "calendar")
 *   variant: 'filled' | 'outlined' (default 'outlined')
 *   size: number (default 24)
 *   color: string (default colors.text.bold)
 *
 * Anatomy (from Figma docs node 892:19788):
 *   - Default size: 24px
 *   - Default color: text/bold
 *   - Uses Google Material Icon Font Package
 *   - Able to pull in specific icon using glyph name
 *   - Resizable
 *
 * Internally uses MaterialIcons from @expo/vector-icons (bundled with Expo),
 * with a mapping from Figma type names → MaterialIcons glyph names.
 * Instagram is a special case using Ionicons.
 *
 * Variant:
 *   'outlined' (default) — uses outline glyph where available, otherwise
 *     falls back to the filled glyph (many icons like arrows, chevrons,
 *     check, close, add are inherently stroke-based and look identical).
 *   'filled' — always uses the filled/solid glyph.
 */

import React from 'react';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { colors } from '../../lib/tokens/colors';

// ─── Icon type union (matches Figma component property) ──

export type IconType =
  | 'money'
  | 'pin drop'
  | 'score'
  | 'calendar'
  | 'soccer'
  | 'search'
  | 'arrow forward'
  | 'star'
  | 'lock'
  | 'public'
  | 'edit'
  | 'add'
  | 'home'
  | 'person'
  | 'people'
  | 'share'
  | 'sign up'
  | 'expanded'
  | 'collapsed'
  | 'remove'
  | 'arrow backward'
  | 'chevron right'
  | 'check'
  | 'chevron Left'
  | 'clock'
  | 'setting'
  | 'add image'
  | 'Instagram'
  | 'close'
  | 'add friend'
  | 'notification'
  | 'filter';

export type IconVariant = 'filled' | 'outlined';

// ─── Figma type → MaterialIcons filled glyph mapping ────

const FILLED_MAP: Record<IconType, string> = {
  'money': 'attach-money',
  'pin drop': 'pin-drop',
  'score': 'scoreboard',
  'calendar': 'calendar-today',
  'soccer': 'sports-soccer',
  'search': 'search',
  'arrow forward': 'arrow-forward',
  'star': 'star-border',
  'lock': 'lock',
  'public': 'public',
  'edit': 'edit',
  'add': 'add',
  'home': 'home',
  'person': 'person',
  'people': 'people',
  'share': 'share',
  'sign up': 'how-to-reg',
  'expanded': 'expand-less',
  'collapsed': 'expand-more',
  'remove': 'remove',
  'arrow backward': 'arrow-back',
  'chevron right': 'chevron-right',
  'check': 'check',
  'chevron Left': 'chevron-left',
  'clock': 'schedule',
  'setting': 'settings',
  'add image': 'add-photo-alternate',
  'Instagram': 'logo-instagram', // special case — rendered via Ionicons
  'close': 'close',
  'add friend': 'person-add',
  'notification': 'notifications',
  'filter': 'tune',
};

// ─── Outline overrides (only for icons with distinct outline glyphs) ──
// Icons not listed here are inherently stroke-based (arrows, chevrons,
// check, close, add, etc.) and share the same glyph in both variants.

const OUTLINE_OVERRIDES: Partial<Record<IconType, string>> = {
  'lock': 'lock-outline',
  'edit': 'mode-edit-outline',
  'person': 'person-outline',
  'people': 'people-outline',
  'add friend': 'person-add-alt',
  'notification': 'notifications-none',
};

// ─── Props ──────────────────────────────────────────────

export type IconProps = {
  type?: IconType;
  variant?: IconVariant;
  size?: number;
  color?: string;
};

// ─── Component ──────────────────────────────────────────

export default function Icon({
  type = 'calendar',
  variant = 'outlined',
  size = 24,
  color = colors.text.bold,
}: IconProps) {
  // Instagram is not in MaterialIcons — use Ionicons fallback
  if (type === 'Instagram') {
    return (
      <Ionicons
        name="logo-instagram"
        size={size}
        color={color}
      />
    );
  }

  const glyph =
    variant === 'outlined' && OUTLINE_OVERRIDES[type]
      ? OUTLINE_OVERRIDES[type]!
      : FILLED_MAP[type];

  return (
    <MaterialIcons
      name={glyph as keyof typeof MaterialIcons.glyphMap}
      size={size}
      color={color}
    />
  );
}
