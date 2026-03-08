/**
 * BottomNav component — mapped from Figma component documentation
 *
 * Props (from Figma properties):
 *   selected: Item 1 | Item 2 | Item 3 | Item 4
 *     Item 1 = Discover (globe), Item 2 = Calendar, Item 3 = Create (+), Item 4 = Profile (person)
 *   onSelect: callback with tab index
 *
 * Anatomy (from Figma docs):
 *   4 items, fill screen width
 *   Icon: 36×36, always outline style
 *   Selected = icon/bold color
 *   Unselected = icon/subtle color
 *   Padding left/right: spacer/40
 *   Padding top: spacer/24
 *   Background: linear gradient from surface/bold (60%) → transparent
 *   Bottom: iOS home indicator safe area (34px)
 *   Single-select only
 */

import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon, { type IconType } from './Icon';
import { colors } from '../../lib/tokens/colors';
import { spacer } from '../../lib/tokens/spacing';

// ─── Types ──────────────────────────────────────────────

type TabIndex = 0 | 1 | 2 | 3;

export type BottomNavProps = {
  selected?: TabIndex;
  onSelect?: (index: TabIndex) => void;
  bottomInset?: number;
};

// ─── Tab config ─────────────────────────────────────────
// Icons use Icon foundation component — selection changes color only

const TABS: { icon: IconType }[] = [
  { icon: 'public' },               // Discover (globe)
  { icon: 'calendar' },             // Calendar
  { icon: 'add' },                  // Create
  { icon: 'person' },               // Profile
];

const ICON_SIZE = 36;

// ─── Component ──────────────────────────────────────────

/** Default bottom inset — 34px matches iOS home indicator height from Figma */
const DEFAULT_BOTTOM_INSET = 34;

export default function BottomNav({
  selected = 0,
  onSelect,
  bottomInset,
}: BottomNavProps) {
  const safeBottom = bottomInset ?? (Platform.OS === 'web' ? 0 : DEFAULT_BOTTOM_INSET);

  return (
    <View style={styles.container}>
      <View style={styles.items}>
        {TABS.map((tab, index) => {
          const isSelected = selected === index;
          const iconColor = isSelected ? colors.icon.bold : colors.icon.subtle;

          return (
            <Pressable
              key={index}
              style={styles.tabItem}
              onPress={() => onSelect?.(index as TabIndex)}
            >
              <View style={styles.iconWrap}>
                <Icon type={tab.icon} size={ICON_SIZE} color={iconColor} />
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Home indicator safe area */}
      {safeBottom > 0 && <View style={{ height: safeBottom }} />}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.bold,
  },

  items: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacer['40'],
    paddingTop: spacer['24'],
  },

  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrap: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
