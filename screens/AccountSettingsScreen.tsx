/**
 * AccountSettingsScreen — deactivate, delete, sign out (Figma node 3420:21262)
 *
 * Deactivate and Delete are destructive — both prompt for confirmation,
 * soft-disable the account via is_active=false, then sign out. Hard
 * deletion of auth.users requires an Edge Function and isn't wired yet.
 */

import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Button, Divider, Icon } from '../components/ui';
import { useAuth } from '../lib/AuthContext';
import { deactivateCurrentUser, deleteCurrentUser } from '../lib/api/users';

// Web-friendly confirm (Alert.alert is a no-op on web)
function confirm(title: string, message: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Confirm', style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}

export default function AccountSettingsScreen() {
  const navigation = useNavigation<any>();
  const { signOut } = useAuth();
  const [busy, setBusy] = useState<'deactivate' | 'delete' | 'signout' | null>(null);

  const handleDeactivate = useCallback(async () => {
    const ok = await confirm(
      'Deactivate Account',
      'Your profile will be hidden and you will be signed out. Sign back in to reactivate.',
    );
    if (!ok) return;
    setBusy('deactivate');
    try {
      await deactivateCurrentUser();
      await signOut();
    } catch (err) {
      console.warn('Deactivate failed:', err);
      Alert.alert('Failed', 'Could not deactivate your account. Please try again.');
    } finally {
      setBusy(null);
    }
  }, [signOut]);

  const handleDelete = useCallback(async () => {
    const ok = await confirm(
      'Permanently Delete Account',
      'This will remove your profile, clubs, events, and friendships. This action cannot be undone.',
    );
    if (!ok) return;
    setBusy('delete');
    try {
      await deleteCurrentUser();
      await signOut();
    } catch (err) {
      console.warn('Delete failed:', err);
      Alert.alert('Failed', 'Could not delete your account. Please try again.');
    } finally {
      setBusy(null);
    }
  }, [signOut]);

  const handleSignOut = useCallback(async () => {
    setBusy('signout');
    try {
      await signOut();
    } finally {
      setBusy(null);
    }
  }, [signOut]);

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
        <Text style={styles.title}>Account</Text>

        <View style={styles.list}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Deactivate Account</Text>
            <Button
              emphasis="Subtle"
              size="Sm"
              label="Deactivate"
              state={busy === 'deactivate' ? 'Loading' : 'Enabled'}
              disabled={busy !== null}
              onPress={handleDeactivate}
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Permanently Delete Account</Text>
            <Button
              emphasis="Subtle"
              size="Sm"
              label="Delete"
              state={busy === 'delete' ? 'Loading' : 'Enabled'}
              disabled={busy !== null}
              onPress={handleDelete}
            />
          </View>
        </View>

        <Divider emphasis="Subtle" />

        <Button
          emphasis="Bold"
          label="Sign Out"
          state={busy === 'signout' ? 'Loading' : 'Enabled'}
          disabled={busy !== null}
          onPress={handleSignOut}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.bold },
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
