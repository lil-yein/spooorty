/**
 * Avatar component — mapped from Figma component documentation
 *
 * Props (from Figma properties):
 *   type: Image | Text
 *   size: Xs | Sm | Md | Lg | Xl
 *   +a: boolean (show count badge overlay, for Md and Lg sizes)
 *   source: ImageSourcePropType (for Image type)
 *   label: string (initials for Text type)
 *   count: number (for +a badge, e.g. 3 renders "+3")
 *
 * Anatomy (from Figma docs):
 *   Sizes: Xs=16, Sm=24, Md=36, Lg=48, Xl=140
 *   Image: masked with custom SVG shape (profile-shape.svg)
 *   Text: surface/bold bg, border/subtle 0.5px inside, text/bold centered
 *   Text sizes map to text styles:
 *     Xs = body04Medium, Sm = body03Medium, Md = body02Medium,
 *     Lg = body01Medium, Xl = headline01Medium
 *   +a badge: Xs text avatar positioned at bottom-right corner
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  type ImageSourcePropType,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import Svg, { ClipPath, Defs, Path, Image as SvgImage } from 'react-native-svg';
import { colors } from '../../lib/tokens/colors';
import { borderWidth } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

type AvatarType = 'Image' | 'Text';
type AvatarSize = 'Xs' | 'Sm' | 'Md' | 'Lg' | 'Xl';

export type AvatarProps = {
  type?: AvatarType;
  size?: AvatarSize;
  source?: ImageSourcePropType;
  label?: string;
  showCount?: boolean;
  count?: number;
};

// ─── Size map (Lg updated to 48px) ─────────────────────

const SIZES: Record<AvatarSize, number> = {
  Xs: 16,
  Sm: 24,
  Md: 36,
  Lg: 48,
  Xl: 140,
};

// Text style per size (from Figma docs)
const TEXT_STYLES: Record<AvatarSize, TextStyle> = {
  Xs: textStyles.body04Medium,
  Sm: textStyles.body03Medium,
  Md: textStyles.body02Medium,
  Lg: textStyles.body01Medium,
  Xl: textStyles.headline01Medium,
};

// ─── SVG clip path (from profile-shape.svg, viewBox 0 0 140 140) ────

const PROFILE_SHAPE_PATH =
  'M91.3555 0.520508C95.537 0.446726 100.097 0.598633 104.951 0.598633C123.978 0.598822 139.401 16.0224 139.401 35.0488C139.401 39.9032 139.553 44.463 139.479 48.6445C139.406 52.8156 139.107 56.5283 138.223 59.626C137.341 62.7141 135.887 65.1613 133.519 66.8457C131.293 68.4287 128.206 69.376 123.905 69.4883L123.029 69.5V70.5C127.791 70.5001 131.145 71.4659 133.519 73.1543C135.887 74.8387 137.341 77.2858 138.223 80.374C139.107 83.4717 139.406 87.1844 139.479 91.3555C139.553 95.537 139.401 100.097 139.401 104.951C139.401 123.978 123.978 139.401 104.951 139.401C100.097 139.401 95.537 139.553 91.3555 139.479C87.1844 139.406 83.4717 139.107 80.374 138.223C77.2858 137.341 74.8387 135.887 73.1543 133.519C71.5713 131.293 70.624 128.206 70.5117 123.905L70.5 123.029H69.5C69.4999 127.791 68.5341 131.145 66.8457 133.519C65.1613 135.887 62.7141 137.341 59.626 138.223C56.5283 139.107 52.8156 139.406 48.6445 139.479C44.463 139.553 39.9032 139.401 35.0488 139.401C16.0224 139.401 0.598822 123.978 0.598633 104.951C0.598633 100.097 0.446726 95.537 0.520508 91.3555C0.594119 87.1844 0.893143 83.4717 1.77734 80.374C2.65884 77.2858 4.11311 74.8387 6.48145 73.1543C8.85548 71.4658 12.2086 70.5001 16.9707 70.5V69.5L16.0947 69.4883C11.7935 69.376 8.70719 68.4287 6.48145 66.8457C4.11312 65.1613 2.65884 62.7141 1.77734 59.626C0.893143 56.5283 0.594119 52.8156 0.520508 48.6445C0.446725 44.463 0.598633 39.9032 0.598633 35.0488C0.598804 16.0224 16.0224 0.598804 35.0488 0.598633C39.9032 0.598633 44.463 0.446725 48.6445 0.520508C52.8156 0.594119 56.5283 0.893143 59.626 1.77734C62.7141 2.65884 65.1613 4.11312 66.8457 6.48145C68.5342 8.85548 69.4999 12.2086 69.5 16.9707H70.5L70.5117 16.0947C70.624 11.7935 71.5713 8.70719 73.1543 6.48145C74.8387 4.11311 77.2858 2.65884 80.374 1.77734C83.4717 0.893143 87.1844 0.594119 91.3555 0.520508Z';

/**
 * Renders an image clipped to the Spooorty profile shape.
 * The SVG path is defined at 140×140 and scaled down via the `size` prop.
 */
function MaskedImage({
  source,
  dimension,
}: {
  source?: ImageSourcePropType;
  dimension: number;
}) {
  const clipId = `profileClip-${dimension}`;
  // Scale factor from 140 (SVG viewBox) to actual dimension
  const scale = dimension / 140;

  // For RN Image fallback when no SVG image support (web)
  const uri = source && typeof source === 'object' && 'uri' in source ? source.uri : undefined;

  return (
    <View style={{ width: dimension, height: dimension }}>
      <Svg width={dimension} height={dimension} viewBox="0 0 140 140">
        <Defs>
          <ClipPath id={clipId}>
            <Path d={PROFILE_SHAPE_PATH} />
          </ClipPath>
        </Defs>
        {uri ? (
          <SvgImage
            href={uri}
            width="140"
            height="140"
            clipPath={`url(#${clipId})`}
            preserveAspectRatio="xMidYMid slice"
          />
        ) : (
          <Path
            d={PROFILE_SHAPE_PATH}
            fill={colors.surface.subtle}
          />
        )}
      </Svg>
    </View>
  );
}

// ─── Component ──────────────────────────────────────────

export default function Avatar({
  type = 'Image',
  size = 'Md',
  source,
  label = 'AB',
  showCount = false,
  count = 0,
}: AvatarProps) {
  const dimension = SIZES[size];

  // ── +a badge position (2px inward from bottom-right edge) ──
  const badgeSize = 16;
  const badgeLeft = dimension - badgeSize - 2;
  const badgeTop = dimension - badgeSize - 2;

  return (
    <View style={{ position: 'relative' }}>
      {type === 'Image' ? (
        <MaskedImage source={source} dimension={dimension} />
      ) : (
        <View
          style={[
            styles.textContainer,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
            },
          ]}
        >
          <Text
            style={[TEXT_STYLES[size], styles.textLabel]}
            numberOfLines={1}
          >
            {size === 'Xs' ? label.charAt(0) : label.slice(0, 2)}
          </Text>
        </View>
      )}

      {/* +a count badge (Xs-sized text avatar at bottom-right) */}
      {showCount && count > 0 && (
        <View style={[styles.badge, { left: badgeLeft, top: badgeTop }]}>
          <Text style={[textStyles.body04Medium, styles.badgeText]}>
            +{count}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  // Text type
  textContainer: {
    backgroundColor: colors.surface.bold,
    borderWidth: borderWidth.regular,
    borderColor: colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  textLabel: {
    color: colors.text.bold,
    textAlign: 'center',
  },

  // +a badge
  badge: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.surface.bold,
    borderWidth: borderWidth.regular,
    borderColor: colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    color: colors.text.bold,
    textAlign: 'center',
  },
});
