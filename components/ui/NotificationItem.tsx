/**
 * NotificationItem component — mapped from Figma component documentation
 *
 * Props:
 *   avatar: ReactNode (Avatar component, no +count badge)
 *   text: string (notification body)
 *   description: string (optional, default hidden)
 *   friendRequest: boolean (show accept/decline buttons, default true)
 *   requestAccepted: boolean (show accepted checkmark icon, default false)
 *   onAccept: callback (optional)
 *   onDecline: callback (optional)
 *   onPress: callback (optional)
 *
 * Anatomy (from Figma docs):
 *   Row: fills parent, gap spacer/16, items center, justify between
 *   Left: Avatar 52px (no +count badge)
 *   Center: flex 1, gap spacer/4
 *     Text: body01Light, text.bold (1 line max)
 *     Description: body03Light, text.subtle (optional, hidden by default)
 *   Right (friendRequest, !requestAccepted): gap spacer/8
 *     Decline: Button emphasis=Subtle content=Icon size=Sm, Google Material close icon
 *     Accept: Button emphasis=Subtle content=Icon size=Sm, Google Material check icon
 *   Right (requestAccepted): 16×16 Google Material check icon, icon.bold
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Button from './Button';
import Icon from './Icon';
import { colors } from '../../lib/tokens/colors';
import { spacer } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

export type NotificationItemProps = {
  avatar: React.ReactNode;
  text: string;
  description?: string;
  friendRequest?: boolean;
  requestAccepted?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onPress?: () => void;
};

// ─── Component ──────────────────────────────────────────

export default function NotificationItem({
  avatar,
  text,
  description,
  friendRequest = true,
  requestAccepted = false,
  onAccept,
  onDecline,
  onPress,
}: NotificationItemProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        {/* Avatar */}
        {avatar}

        {/* Text column */}
        <View style={styles.textCol}>
          <Text style={styles.text} numberOfLines={1}>
            {text}
          </Text>
          {description ? (
            <Text style={styles.description} numberOfLines={1}>
              {description}
            </Text>
          ) : null}
        </View>

        {/* Friend request buttons — shown when friendRequest=true AND not yet accepted */}
        {friendRequest && !requestAccepted && (
          <View style={styles.buttons}>
            <Button
              emphasis="Subtle"
              content="Icon"
              size="Sm"
              icon={({ color, size }) => (
                <Icon type="close" color={color} size={size} />
              )}
              onPress={onDecline}
            />
            <Button
              emphasis="Subtle"
              content="Icon"
              size="Sm"
              icon={({ color, size }) => (
                <Icon type="check" color={color} size={size} />
              )}
              onPress={onAccept}
            />
          </View>
        )}

        {/* Accepted icon — shown after accepting a request */}
        {requestAccepted && (
          <View style={styles.acceptedIcon}>
            <Icon type="check" color={colors.icon.bold} size={16} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['16'],
  },

  textCol: {
    flex: 1,
    gap: spacer['4'],
    justifyContent: 'center',
  },

  text: {
    ...textStyles.body01Light,
    color: colors.text.bold,
  },

  description: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
  },

  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
  },

  acceptedIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
