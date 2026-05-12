/**
 * NotificationSettingsScreen — toggle notification preferences (Figma node 3420:21088)
 *
 * One row per notification category, mapped to a boolean column on users.
 * Saves optimistically: UI updates instantly, network failure reverts.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Button, Icon, Switch } from '../components/ui';
import { useCurrentProfile, useUpdateProfile } from '../lib/hooks/useProfile';
import type { UpdateUser } from '../lib/database/types';

type NotifKey = Extract<
  keyof UpdateUser,
  | 'notif_friend_request'
  | 'notif_friend_accepted'
  | 'notif_join_request'
  | 'notif_join_decision'
  | 'notif_event_update'
  | 'notif_club_update'
>;

const ROWS: { key: NotifKey; label: string }[] = [
  { key: 'notif_friend_request', label: 'Friend Request' },
  { key: 'notif_friend_accepted', label: 'Friend Request Accepted' },
  { key: 'notif_join_request', label: 'Join Request Received' },
  { key: 'notif_join_decision', label: 'Join Request Approved/ Rejected' },
  { key: 'notif_event_update', label: 'Event Update - Reminder, Changes' },
  { key: 'notif_club_update', label: 'Club Update - Member, Event, Changes' },
];

export default function NotificationSettingsScreen() {
  const navigation = useNavigation<any>();
  const { data: profile, loading } = useCurrentProfile();
  const { update } = useUpdateProfile();

  // Local mirror so toggles feel instant
  const [values, setValues] = useState<Record<NotifKey, boolean>>({
    notif_friend_request: true,
    notif_friend_accepted: true,
    notif_join_request: true,
    notif_join_decision: true,
    notif_event_update: true,
    notif_club_update: true,
  });

  useEffect(() => {
    if (!profile) return;
    setValues({
      notif_friend_request: profile.notif_friend_request,
      notif_friend_accepted: profile.notif_friend_accepted,
      notif_join_request: profile.notif_join_request,
      notif_join_decision: profile.notif_join_decision,
      notif_event_update: profile.notif_event_update,
      notif_club_update: profile.notif_club_update,
    });
  }, [profile]);

  const handleToggle = async (key: NotifKey, next: boolean) => {
    const prev = values[key];
    setValues((v) => ({ ...v, [key]: next }));
    const result = await update({ [key]: next } as UpdateUser);
    if (!result) {
      setValues((v) => ({ ...v, [key]: prev }));
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={colors.text.subtle} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topNavRow}>
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
        <Text style={styles.title}>Notification</Text>
        <View style={styles.list}>
          {ROWS.map(({ key, label }) => (
            <View key={key} style={styles.row}>
              <Text style={styles.rowLabel}>{label}</Text>
              <Switch value={values[key]} onToggle={(v) => handleToggle(key, v)} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.bold },
  center: { justifyContent: 'center', alignItems: 'center' },
  content: { padding: spacer['24'], gap: spacer['24'], paddingBottom: 94 },
  topNavRow: { flexDirection: 'row', alignItems: 'center' },
  title: { ...textStyles.headline02Medium, color: colors.text.bold },
  list: { gap: spacer['24'] },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacer['12'],
  },
  rowLabel: {
    ...textStyles.title02Medium,
    color: colors.text.bold,
    flex: 1,
  },
});
