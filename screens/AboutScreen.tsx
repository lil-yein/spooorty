/**
 * AboutScreen — Privacy Policy, Terms, Support, version (Figma node 3421:21493)
 *
 * Privacy Policy / Terms / Support Email are external links. Update the
 * URLs once the Termly-generated documents are live.
 */

import React from 'react';
import { View, Text, ScrollView, Pressable, Linking, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Button, Icon } from '../components/ui';

const PRIVACY_POLICY_URL = 'https://spooorty.vercel.app/privacy.html';
// TODO: replace with the real URL once Termly Terms doc is published
const TERMS_URL = 'https://spooorty.vercel.app/terms.html';
const SUPPORT_EMAIL = 'yeinlillianlee@gmail.com';

type LinkRow = { label: string; onPress: () => void };

export default function AboutScreen() {
  const navigation = useNavigation<any>();
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const rows: LinkRow[] = [
    { label: 'Privacy Policy', onPress: () => Linking.openURL(PRIVACY_POLICY_URL) },
    { label: 'Terms', onPress: () => Linking.openURL(TERMS_URL) },
    { label: 'Support Email', onPress: () => Linking.openURL(`mailto:${SUPPORT_EMAIL}`) },
  ];

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
        <Text style={styles.title}>About</Text>

        <View style={styles.list}>
          {rows.map((row) => (
            <Pressable key={row.label} style={styles.row} onPress={row.onPress}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Icon type="chevron right" size={16} color={colors.icon.bold} />
            </Pressable>
          ))}

          <View style={styles.row}>
            <Text style={styles.rowLabel}>App Version</Text>
            <Text style={styles.versionLabel}>V{appVersion}</Text>
          </View>
        </View>
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
  },
  versionLabel: {
    ...textStyles.title02Light,
    color: colors.text.bold,
  },
});
