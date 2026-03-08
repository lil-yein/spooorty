/**
 * Overlay component — mapped from Figma component documentation
 *
 * Props:
 *   variant: 'dark' | 'blur' (default 'dark')
 *   onPress: callback for dismissing
 *   children: optional content rendered on top
 *
 * Anatomy (from Figma docs):
 *   Dark: surface/overlay (rgba(0,0,0,0.2)), full screen absolute
 *   Blur: surface/blur (rgba(255,255,255,0.7)), backdrop-blur 8px
 */

import React from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { colors } from '../../lib/tokens/colors';

// ─── Types ──────────────────────────────────────────────

export type OverlayProps = {
  variant?: 'dark' | 'blur';
  onPress?: () => void;
  children?: React.ReactNode;
};

// ─── Component ──────────────────────────────────────────

export default function Overlay({
  variant = 'dark',
  onPress,
  children,
}: OverlayProps) {
  return (
    <Pressable
      style={[
        styles.base,
        variant === 'dark' ? styles.dark : styles.blur,
      ]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dark: {
    backgroundColor: colors.surface.overlay,
  },

  blur: {
    backgroundColor: colors.surface.blur,
    ...(Platform.OS === 'web'
      ? { backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }
      : {}),
  },
});
