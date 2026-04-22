/**
 * ColorPicker component — mapped from Figma component documentation
 *
 * Props:
 *   hue: 0–360 (current hue value)
 *   onChangeHue: callback with new hue
 *
 * Anatomy (from Figma docs):
 *   Gradient bar: 24px height, pill shape, border/subtle 0.5px
 *     Linear gradient: red → orange → yellow → green → cyan → blue → purple → pink → red
 *   Indicator: pin shape above bar (SVG-based)
 *     Outer: 24×30 Union.svg teardrop/pin, icon/inverse fill, border/subtle 0.5px
 *     Inner circle: 20×20 Rectangle 3.svg, shows selected hue color
 *   Draggable via PanResponder
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Platform,
  type LayoutChangeEvent,
  type GestureResponderEvent,
  type PanResponderGestureState,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '../../lib/tokens/colors';
import { borderRadius, borderWidth } from '../../lib/tokens/spacing';

// ─── Types ──────────────────────────────────────────────

export type ColorPickerProps = {
  hue?: number; // 0–360
  onChangeHue?: (hue: number) => void;
};

// ─── Helpers ────────────────────────────────────────────

const HUE_COLORS = [
  'rgb(255, 54, 54)',    // 0°
  'rgb(255, 144, 0)',    // 36°
  'rgb(255, 242, 0)',    // 72°
  'rgb(132, 255, 0)',    // 108°
  'rgb(0, 255, 89)',     // 144°
  'rgb(0, 255, 234)',    // 180°
  'rgb(0, 106, 255)',    // 216°
  'rgb(78, 0, 255)',     // 254°
  'rgb(208, 0, 255)',    // 286°
  'rgb(255, 0, 170)',    // 324°
  'rgb(255, 0, 4)',      // 360°
];

function hueToColor(hue: number): string {
  const h = Math.min(Math.max(hue, 0), 360);
  const segment = h / 36;
  const i = Math.floor(segment);
  const t = segment - i;
  const from = HUE_COLORS[Math.min(i, HUE_COLORS.length - 1)];
  const to = HUE_COLORS[Math.min(i + 1, HUE_COLORS.length - 1)];

  const parse = (s: string) => {
    const m = s.match(/(\d+)/g);
    return m ? m.map(Number) : [0, 0, 0];
  };
  const [r1, g1, b1] = parse(from);
  const [r2, g2, b2] = parse(to);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

const INDICATOR_W = 24;
const INDICATOR_H = 30;
const BAR_HEIGHT = 24;

// Union.svg pin path (24×30 teardrop)
const PIN_PATH =
  'M13.7695 23.8701C19.5579 23.0146 24 18.0262 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.0259 4.44158 23.0142 10.2295 23.8701L12 30L13.7695 23.8701Z';

// ─── Indicator SVG ──────────────────────────────────────

function PinIndicator({ fillColor }: { fillColor: string }) {
  return (
    <Svg width={INDICATOR_W} height={INDICATOR_H} viewBox="0 0 24 30" fill="none">
      {/* Outer pin shape — icon/inverse fill + border/subtle stroke */}
      <Path
        d={PIN_PATH}
        fill={colors.icon.inverse}
        stroke={colors.border.subtle}
        strokeWidth={0.5}
      />
      {/* Inner circle — selected hue color */}
      <Circle cx={12} cy={12} r={10} fill={fillColor} />
    </Svg>
  );
}

// ─── Component ──────────────────────────────────────────

export default function ColorPicker({
  hue = 0,
  onChangeHue,
}: ColorPickerProps) {
  const barWidth = useRef(0);
  const startHue = useRef(0);
  const hueRef = useRef(hue);

  // Keep hueRef in sync with prop so PanResponder grant reads the latest value
  useEffect(() => {
    hueRef.current = hue;
  }, [hue]);

  const percentToHue = (p: number) => Math.round(Math.min(Math.max(p, 0), 1) * 360);

  const onLayout = (e: LayoutChangeEvent) => {
    barWidth.current = e.nativeEvent.layout.width;
  };

  const createPan = (fromIndicator: boolean) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e: GestureResponderEvent) => {
        if (fromIndicator) {
          // Drag from indicator: start from current hue
          startHue.current = hueRef.current;
        } else {
          // Drag from bar: jump to tap position first
          if (!barWidth.current) return;
          const touchX =
            Platform.OS === 'web'
              ? (e.nativeEvent as any).offsetX
              : e.nativeEvent.locationX;
          if (touchX != null && !isNaN(touchX)) {
            const pctTap = Math.min(Math.max(touchX / barWidth.current, 0), 1);
            const newHue = percentToHue(pctTap);
            onChangeHue?.(newHue);
            startHue.current = newHue;
          } else {
            startHue.current = hueRef.current;
          }
        }
      },
      onPanResponderMove: (
        _e: GestureResponderEvent,
        gs: PanResponderGestureState,
      ) => {
        if (!barWidth.current) return;
        const startPct = startHue.current / 360;
        const deltaPct = gs.dx / barWidth.current;
        const rawPct = startPct + deltaPct;
        const clampedPct = Math.min(Math.max(rawPct, 0), 1);
        onChangeHue?.(percentToHue(clampedPct));
      },
      onPanResponderRelease: (
        _e: GestureResponderEvent,
        gs: PanResponderGestureState,
      ) => {
        if (!barWidth.current) return;
        const startPct = startHue.current / 360;
        const deltaPct = gs.dx / barWidth.current;
        const rawPct = startPct + deltaPct;
        if (rawPct < 0) {
          onChangeHue?.(0);
        } else if (rawPct > 1) {
          onChangeHue?.(360);
        }
      },
    });

  const indicatorPan = useRef(createPan(true)).current;
  const barPan = useRef(createPan(false)).current;

  const pct = Math.min(Math.max(hue, 0), 360) / 360 * 100;
  const indicatorColor = hueToColor(hue);

  const webGradient =
    'linear-gradient(90deg, rgb(255,54,54) 0%, rgb(255,144,0) 10%, rgb(255,242,0) 20%, rgb(132,255,0) 30%, rgb(0,255,89) 40%, rgb(0,255,234) 50%, rgb(0,106,255) 60%, rgb(78,0,255) 70.5%, rgb(208,0,255) 79.5%, rgb(255,0,170) 90%, rgb(255,0,4) 100%)';

  return (
    <View style={styles.container} onLayout={onLayout}>
      {/* Indicator pin (SVG) */}
      <View
        style={[styles.indicatorWrap, { left: `${pct}%` }]}
        {...indicatorPan.panHandlers}
      >
        <PinIndicator fillColor={indicatorColor} />
      </View>

      {/* Gradient bar — draggable + tappable to select color */}
      <View
        style={[
          styles.bar,
          Platform.OS === 'web'
            ? ({ backgroundImage: webGradient } as any)
            : { backgroundColor: colors.surface.subtle },
        ]}
        {...barPan.panHandlers}
      />
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  indicatorWrap: {
    position: 'absolute',
    top: 0,
    marginLeft: -INDICATOR_W / 2,
    zIndex: 1,
    alignItems: 'center',
    cursor: 'grab' as any,
  },

  bar: {
    marginTop: INDICATOR_H,
    height: BAR_HEIGHT,
    borderRadius: borderRadius.round,
    borderWidth: borderWidth.regular,
    borderColor: colors.border.subtle,
    overflow: 'hidden',
  },
});
