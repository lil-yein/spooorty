/**
 * ClubItem component — club selection row for modals
 *
 * Anatomy (from Figma node 3282:16093):
 *   Row: items center, gap spacer/12
 *   Thumbnail: 48x48, borderRadius 8, Image placeholder
 *   Text column: name (body01Medium, text/bold) + subtitle (body03Light, text/subtle)
 *   Trailing: optional checkmark icon (16px, icon/subtle)
 */

import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors } from '../../lib/tokens/colors';
import { spacer, borderRadius } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

export type ClubItemProps = {
  name: string;
  subtitle?: string;
  imageUri?: string;
  selected?: boolean;
  onPress?: () => void;
};

// ─── Component ──────────────────────────────────────────

export default function ClubItem({
  name,
  subtitle,
  imageUri,
  selected = false,
  onPress,
}: ClubItemProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: imageUri || 'https://picsum.photos/96/96' }}
        style={styles.thumbnail}
      />
      <View style={styles.textCol}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['12'],
  },

  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: borderRadius['8'],
    backgroundColor: colors.surface.subtle,
  },

  textCol: {
    flex: 1,
    gap: 2,
  },

  name: {
    ...textStyles.body01Medium,
    color: colors.text.bold,
  },

  subtitle: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
  },

  iconWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
