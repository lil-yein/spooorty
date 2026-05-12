/**
 * SettingsScreen — top-level settings index (Figma node 3420:20235)
 *
 * Reached from MyProfileScreen's settings (cog) header button.
 * Shows a list of section entries; each row will deep-link into its own
 * sub-screen once those are built (Notification, Account, Privacy, About).
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Button, Icon } from '../components/ui';
import type { IconType } from '../components/ui/Icon';

// ─── Row config ─────────────────────────────────────────

type SettingsSection = {
  label: string;
  icon: IconType;
  route?: string; // wired up as sub-screens land
};

const SECTIONS: SettingsSection[] = [
  { label: 'Notification', icon: 'notification', route: 'NotificationSettings' },
  { label: 'Account', icon: 'person', route: 'AccountSettings' },
  { label: 'Privacy', icon: 'lock', route: 'PrivacySettings' },
  { label: 'About', icon: 'info', route: 'About' },
];

// ─── Component ──────────────────────────────────────────

export default function SettingsScreen() {
  const navigation = useNavigation<any>();

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

        <Text style={styles.title}>Setting</Text>

        <View style={styles.list}>
          {SECTIONS.map((section) => (
            <SettingRow
              key={section.label}
              label={section.label}
              icon={section.icon}
              onPress={
                section.route
                  ? () => navigation.navigate(section.route!)
                  : undefined
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Row ────────────────────────────────────────────────

type SettingRowProps = {
  label: string;
  icon: IconType;
  onPress?: () => void;
};

function SettingRow({ label, icon, onPress }: SettingRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowLeft}>
        <Icon type={icon} size={16} color={colors.icon.bold} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Icon type="chevron right" size={16} color={colors.icon.bold} />
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.bold,
  },

  content: {
    padding: spacer['24'],
    gap: spacer['24'],
    paddingBottom: 94, // clear bottom nav
  },

  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    ...textStyles.headline02Medium,
    color: colors.text.bold,
  },

  list: {
    gap: spacer['24'],
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
  },

  rowLabel: {
    ...textStyles.title02Medium,
    color: colors.text.bold,
  },
});
