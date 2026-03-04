/**
 * Range component — mapped from Figma component documentation
 *
 * Props:
 *   min, max: value range
 *   low, high: current selected range
 *   onChangeRange: callback with [low, high]
 *   formatLabel: optional label formatter (default: (v) => `$${v}`)
 *
 * Anatomy (from Figma docs):
 *   Background track: 2px line, border/subtle color
 *   Filled track: 2px line, surface/highlight (black)
 *   Handles: 16px circle, surface/highlight bg, border/subtle 1px border
 *   Labels: body03Light, text/bold, gap spacer/8 below handle
 */

import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  type LayoutChangeEvent,
  type GestureResponderEvent,
  type PanResponderGestureState,
} from 'react-native';
import { colors } from '../../lib/tokens/colors';
import { spacer, borderRadius } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

export type RangeProps = {
  min?: number;
  max?: number;
  low: number;
  high: number;
  onChangeRange?: (range: [number, number]) => void;
  formatLabel?: (value: number) => string;
};

const HANDLE_SIZE = 16;

// ─── Component ──────────────────────────────────────────

export default function Range({
  min = 0,
  max = 100,
  low,
  high,
  onChangeRange,
  formatLabel = (v) => `$${v}`,
}: RangeProps) {
  const trackWidth = useRef(0);
  const lowRef = useRef(low);
  const highRef = useRef(high);
  const startValueRef = useRef(0);

  lowRef.current = low;
  highRef.current = high;

  const valueToPercent = (v: number) => (max === min ? 0 : (v - min) / (max - min));
  const percentToValue = (p: number) => Math.round(min + p * (max - min));
  const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

  const onLayout = (e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  };

  // ─── Low handle ──────────────────────────────────────────
  const lowPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startValueRef.current = lowRef.current;
      },
      onPanResponderMove: (
        _e: GestureResponderEvent,
        gs: PanResponderGestureState,
      ) => {
        if (!trackWidth.current) return;
        const startPct = valueToPercent(startValueRef.current);
        const deltaPct = gs.dx / trackWidth.current;
        const newPct = clamp(startPct + deltaPct, 0, 1);
        const newValue = percentToValue(newPct);
        const clamped = clamp(newValue, min, highRef.current);
        onChangeRange?.([clamped, highRef.current]);
      },
    }),
  ).current;

  // ─── High handle ─────────────────────────────────────────
  const highStartRef = useRef(0);
  const highPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        highStartRef.current = highRef.current;
      },
      onPanResponderMove: (
        _e: GestureResponderEvent,
        gs: PanResponderGestureState,
      ) => {
        if (!trackWidth.current) return;
        const startPct = valueToPercent(highStartRef.current);
        const deltaPct = gs.dx / trackWidth.current;
        const newPct = clamp(startPct + deltaPct, 0, 1);
        const newValue = percentToValue(newPct);
        const clamped = clamp(newValue, lowRef.current, max);
        onChangeRange?.([lowRef.current, clamped]);
      },
    }),
  ).current;

  const lowPercent = valueToPercent(low) * 100;
  const highPercent = valueToPercent(high) * 100;

  return (
    <View style={styles.container}>
      {/* Track area */}
      <View style={styles.trackContainer} onLayout={onLayout}>
        {/* Background track */}
        <View style={styles.trackBg} />

        {/* Filled track */}
        <View
          style={[
            styles.trackFill,
            { left: `${lowPercent}%`, right: `${100 - highPercent}%` },
          ]}
        />

        {/* Low handle */}
        <View
          style={[styles.handle, { left: `${lowPercent}%` }]}
          {...lowPan.panHandlers}
        />

        {/* High handle */}
        <View
          style={[styles.handle, { left: `${highPercent}%` }]}
          {...highPan.panHandlers}
        />
      </View>

      {/* Labels */}
      <View style={styles.labelsRow}>
        <Text style={[styles.label, { left: `${lowPercent}%` }]}>
          {formatLabel(low)}
        </Text>
        <Text style={[styles.label, { left: `${highPercent}%` }]}>
          {formatLabel(high)}
        </Text>
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: HANDLE_SIZE / 2,
  },

  trackContainer: {
    height: HANDLE_SIZE,
    justifyContent: 'center',
  },

  trackBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.border.subtle,
  },

  trackFill: {
    position: 'absolute',
    height: 1,
    backgroundColor: colors.surface.highlight,
  },

  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface.highlight,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    marginLeft: -HANDLE_SIZE / 2,
    cursor: 'grab' as any,
  },

  labelsRow: {
    position: 'relative',
    height: 20,
    marginTop: spacer['8'],
  },

  label: {
    ...textStyles.body03Light,
    color: colors.text.bold,
    position: 'absolute',
    transform: [{ translateX: -HANDLE_SIZE / 2 }],
  },
});
