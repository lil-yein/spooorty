/**
 * NotificationScreen — Full-screen notification list
 *
 * Layout (from Figma node 1057:22103, updated prototype):
 *   Back button: Subtle Sm Icon (arrow-back) → goBack()
 *   Title: "Notification" (headline02Medium)
 *   Items list: NotificationItem rows, gap spacer/24
 *   Avatars: no +count badge (a=false)
 *   BottomNav: handled by TabNavigator
 *
 * Notification types shown:
 *   - Info only (no buttons, with description)
 *   - Friend request pending (with ✕ ✓ buttons, no description)
 *   - Request accepted (just ✓ icon, no description)
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Avatar, Button, NotificationItem, Icon } from '../components/ui';

// ─── Mock notification data (from Figma prototype) ───────

type NotificationData = {
  id: string;
  text: string;
  description?: string;
  friendRequest: boolean;
  requestAccepted?: boolean;
};

const NOTIFICATIONS: NotificationData[] = [
  // ── Info notifications (no buttons, with description) ──
  {
    id: 'n-1',
    text: 'Ling has joined Cool Pickleball Club',
    description: 'Visit Cool Pickleball Club Page',
    friendRequest: false,
  },
  {
    id: 'n-2',
    text: 'Ling is attending Cooler Basketball Event',
    description: 'Visit Cooler Basketball Event Page',
    friendRequest: false,
  },
  {
    id: 'n-3',
    text: 'Cool Pickleball Club has new event added',
    description: '12/31 Tue 2PM · Beginner · $20',
    friendRequest: false,
  },
  {
    id: 'n-4',
    text: 'Saturday Running Crew cancelled this week',
    description: 'Due to weather conditions',
    friendRequest: false,
  },
  // ── Friend request pending (with ✕ ✓ buttons) ──
  {
    id: 'n-5',
    text: 'Ling sent a friend request',
    friendRequest: true,
  },
  // ── Request accepted (just ✓ icon) ──
  {
    id: 'n-6',
    text: 'Ling sent a friend request',
    friendRequest: true,
    requestAccepted: true,
  },
  // ── More friend requests with buttons ──
  {
    id: 'n-7',
    text: "You accepted Ling's friend request",
    friendRequest: true,
  },
  {
    id: 'n-8',
    text: 'Lillian requested to join Cool Pickleball Club',
    friendRequest: true,
  },
];

export default function NotificationScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState<NotificationData[]>(NOTIFICATIONS);

  /** ✓ Accept → change item to requestAccepted state */
  const handleAccept = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, requestAccepted: true } : item,
      ),
    );
  };

  /** ✕ Decline → remove item from list */
  const handleDecline = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Back Button ──────────────────────────────── */}
        <View style={styles.backRow}>
          <Button
            emphasis="Subtle"
            content="Icon"
            size="Sm"
            icon={({ color, size }) => (
              <Icon type="arrow backward" size={size} color={color} />
            )}
            onPress={() => navigation.goBack()}
          />
        </View>

        {/* ── Title ────────────────────────────────────── */}
        <Text style={styles.title}>Notification</Text>

        {/* ── Notification Items ───────────────────────── */}
        <View style={styles.itemsList}>
          {items.map((n) => (
            <NotificationItem
              key={n.id}
              avatar={
                <Avatar
                  type="Image"
                  size="Lg"
                />
              }
              text={n.text}
              description={n.description}
              friendRequest={n.friendRequest}
              requestAccepted={n.requestAccepted}
              onAccept={() => handleAccept(n.id)}
              onDecline={() => handleDecline(n.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.bold,
  },

  content: {
    paddingTop: spacer['64'],
    paddingBottom: spacer['96'],
    paddingHorizontal: spacer['24'],
    gap: spacer['24'],
  },

  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    ...textStyles.headline02Medium,
    color: colors.text.bold,
  },

  itemsList: {
    gap: spacer['24'],
  },
});
