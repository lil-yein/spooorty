/**
 * NotificationScreen — Full-screen notification list
 *
 * Layout (from Figma node 1057:22103):
 *   Back button: Subtle Sm Icon (arrow-back) → goBack()
 *   Title: "Notification" (headline02Medium)
 *   Items list: NotificationItem rows, gap spacer/24
 *
 * Data: fetches notifications from Supabase.
 */

import React, { useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Avatar, Button, NotificationItem, Icon } from '../components/ui';
import { useNotifications } from '../lib/hooks/useNotifications';
import { markNotificationActedOn } from '../lib/api/notifications';

export default function NotificationScreen() {
  const navigation = useNavigation();
  const { data: notifications, loading, refetch } = useNotifications();

  const handleAccept = useCallback(async (id: string) => {
    await markNotificationActedOn(id);
    refetch();
  }, [refetch]);

  const handleDecline = useCallback(async (id: string) => {
    await markNotificationActedOn(id);
    refetch();
  }, [refetch]);

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
          {loading ? (
            <ActivityIndicator size="large" color={colors.text.subtle} style={{ marginTop: spacer['24'] }} />
          ) : (notifications ?? []).length === 0 ? (
            <Text style={styles.emptyText}>No notifications yet</Text>
          ) : (
            (notifications ?? []).map((n) => {
              const isFriendRequest = n.type === 'friend_request' || n.type === 'join_request';
              const isAccepted = n.is_acted_on;

              return (
                <NotificationItem
                  key={n.id}
                  avatar={<Avatar type="Image" size="Lg" />}
                  text={n.body}
                  description={!isFriendRequest ? n.title : undefined}
                  friendRequest={isFriendRequest}
                  requestAccepted={isFriendRequest ? isAccepted : undefined}
                  onAccept={() => handleAccept(n.id)}
                  onDecline={() => handleDecline(n.id)}
                />
              );
            })
          )}
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
    paddingTop: spacer['24'],
    paddingBottom: 94,
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

  emptyText: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
    textAlign: 'center',
    paddingVertical: spacer['24'],
  },
});
