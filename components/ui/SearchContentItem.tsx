/**
 * SearchContentItem component — mapped from Figma component documentation
 *
 * Props:
 *   label: string
 *   selected: boolean (shows trailing checkmark, default false)
 *   onPress: callback (optional — makes item interactive / selectable)
 *
 * Anatomy (from Figma docs):
 *   Row: w=333, items center
 *   When selected: justify between, trailing checkmark 16px
 *   Text: body01Light (16px/300), text.bold
 *   Checkmark: icon.subtle 16px
 */

import React from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import Icon from './Icon';
import { colors } from '../../lib/tokens/colors';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

export type SearchContentItemProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

// ─── Component ──────────────────────────────────────────

export default function SearchContentItem({
  label,
  selected = false,
  onPress,
}: SearchContentItemProps) {
  return (
    <Pressable
      style={[styles.container, selected && styles.containerSelected]}
      onPress={onPress}
    >
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      {selected && (
        <View style={styles.iconWrap}>
          <Icon type="check" size={16} color={colors.icon.subtle} />
        </View>
      )}
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  containerSelected: {
    justifyContent: 'space-between',
  },

  label: {
    ...textStyles.body01Light,
    color: colors.text.bold,
  },

  iconWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
