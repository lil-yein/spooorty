/**
 * PrivacySettingsScreen — visibility + contact discovery (Figma node 3421:21365)
 *
 * - Account Visibility: switch toggles users.account_visibility between
 *   'public' and 'private'. The label shows the current state.
 * - Friend Suggestions from Contact: tapping Connect requests contact
 *   permission and (eventually) hashes contacts to find friends already
 *   on Spooorty. For now it just flips the boolean.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Button, Icon, Switch } from '../components/ui';
import { useCurrentProfile, useUpdateProfile } from '../lib/hooks/useProfile';

export default function PrivacySettingsScreen() {
  const navigation = useNavigation<any>();
  const { data: profile, loading } = useCurrentProfile();
  const { update } = useUpdateProfile();

  const [isPrivate, setIsPrivate] = useState(false);
  const [contactsConnected, setContactsConnected] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setIsPrivate(profile.account_visibility === 'private');
    setContactsConnected(profile.friend_suggestions_from_contacts);
  }, [profile]);

  const handleVisibilityToggle = async (next: boolean) => {
    const prev = isPrivate;
    setIsPrivate(next);
    const result = await update({ account_visibility: next ? 'private' : 'public' });
    if (!result) setIsPrivate(prev);
  };

  const handleConnectContacts = async () => {
    if (contactsConnected) return;
    setBusy(true);
    const result = await update({ friend_suggestions_from_contacts: true });
    if (result) setContactsConnected(true);
    setBusy(false);
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
        <Text style={styles.title}>Privacy</Text>

        <View style={styles.list}>
          {/* Account Visibility */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Account Visibility</Text>
            <View style={styles.rowControl}>
              <Text style={styles.statusLabel}>{isPrivate ? 'Private' : 'Public'}</Text>
              <Switch value={isPrivate} onToggle={handleVisibilityToggle} />
            </View>
          </View>

          {/* Friend Suggestions from Contact */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Friend Suggestions from Contact</Text>
            <Button
              emphasis="Bold"
              size="Sm"
              label={contactsConnected ? 'Connected' : 'Connect'}
              state={busy ? 'Loading' : 'Enabled'}
              disabled={contactsConnected || busy}
              onPress={handleConnectContacts}
            />
          </View>
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
  rowControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
  },
  statusLabel: {
    ...textStyles.body03Light,
    color: colors.text.bold,
  },
});
