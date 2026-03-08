/**
 * BottomAction component — mapped from Figma component documentation
 *
 * Props:
 *   children: action buttons (renders inside the blurred container)
 *   showHomeIndicator: show iOS home indicator bar (default true)
 *
 * Anatomy (from Figma docs):
 *   Outer: borderRadius 16, items center
 *   Actions row: surface/blur bg, backdrop-blur 8px, borderRadius 16,
 *     px spacer/16, py spacer/12, gap spacer/8, width 345
 *   Home indicator: 144×5 black pill bar, centered, 8px from bottom
 */

import React from 'react';
import { View, StyleSheet, Platform, type ViewStyle } from 'react-native';
import { colors } from '../../lib/tokens/colors';
import { spacer, borderRadius } from '../../lib/tokens/spacing';

// ─── Types ──────────────────────────────────────────────

export type BottomActionProps = {
  children: React.ReactNode;
  showHomeIndicator?: boolean;
};

// ─── Component ──────────────────────────────────────────

export default function BottomAction({
  children,
  showHomeIndicator = true,
}: BottomActionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        {React.Children.map(children, (child) =>
          child ? <View style={styles.buttonWrap}>{child}</View> : null,
        )}
      </View>

      {showHomeIndicator && (
        <View style={styles.indicatorContainer}>
          <View style={styles.homeIndicator} />
        </View>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderTopLeftRadius: borderRadius['16'],
    borderTopRightRadius: borderRadius['16'],
  },

  actionsRow: {
    width: 345,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
    paddingHorizontal: spacer['16'],
    paddingVertical: spacer['12'],
    borderRadius: borderRadius['16'],
    backgroundColor: colors.surface.blur,
    ...(Platform.OS === 'web'
      ? { backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }
      : {}),
  } as ViewStyle,

  buttonWrap: {
    flex: 1,
  },

  indicatorContainer: {
    width: '100%',
    height: 34,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },

  homeIndicator: {
    width: 144,
    height: 5,
    borderRadius: 100,
    backgroundColor: '#000000',
  },
});
