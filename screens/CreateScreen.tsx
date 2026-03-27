/**
 * CreateScreen — landing page for the Create tab.
 *
 * Layout:
 *   Content (vertically centered): two section cards — Club & Event
 *   Each card: surface/subtle wrapper ▸ bordered inner ▸ title + desc + CTA
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../lib/tokens/colors';
import { spacer, borderRadius } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Button, Icon } from '../components/ui';
import type { CreateStackParamList } from '../navigation/CreateStack';

// ─── Component ──────────────────────────────────────────

export default function CreateScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<CreateStackParamList>>();

  return (
    <View style={styles.container}>
      {/* ── Content (centered) ───────────────────────────── */}
      <View style={styles.content}>
        <View style={styles.sections}>
          {/* Club section */}
          <View style={styles.sectionWrapper}>
            <View style={styles.sectionInner}>
              <View style={styles.sectionContent}>
                <View style={styles.sectionTextGroup}>
                  <Text style={styles.sectionTitle}>Club</Text>
                  <Text style={styles.sectionDesc}>
                    Create your own club to manage members and host events!
                  </Text>
                </View>
                <Button
                  emphasis="Bold"
                  label="Create Club"
                  leadingIcon={undefined}
                  trailingIcon={({ color, size }) => (
                    <Icon type="arrow forward" size={size} color={color} />
                  )}
                  onPress={() => {
                    navigation.navigate('CreateClub');
                  }}
                />
              </View>
            </View>
          </View>

          {/* Event section */}
          <View style={styles.sectionWrapper}>
            <View style={styles.sectionInner}>
              <View style={styles.sectionContent}>
                <View style={styles.sectionTextGroup}>
                  <Text style={styles.sectionTitle}>Event</Text>
                  <Text style={styles.sectionDesc}>
                    Create your own one-time or regular event to share with your
                    friends!
                  </Text>
                </View>
                <Button
                  emphasis="Bold"
                  label="Create Event"
                  leadingIcon={undefined}
                  trailingIcon={({ color, size }) => (
                    <Icon type="arrow forward" size={size} color={color} />
                  )}
                  onPress={() => {
                    navigation.navigate('CreateEvent');
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.bold,
    paddingTop: 50,
  },

  /* Content — centred vertically between top nav and bottom nav */
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacer['24'],
    paddingBottom: spacer['64'], // offset for bottom nav
  },

  sections: {
    width: '100%',
    gap: spacer['12'],
  },

  /* Outer wrapper — surface/subtle + padding */
  sectionWrapper: {
    backgroundColor: colors.surface.subtle,
    borderRadius: borderRadius['16'],
    padding: spacer['8'],
  },

  /* Inner bordered container */
  sectionInner: {
    borderWidth: 0.5,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius['16'],
    overflow: 'hidden',
  },

  /* Inner content area */
  sectionContent: {
    padding: spacer['16'],
    gap: spacer['24'],
  },

  /* Title — Headline 02 Medium */
  sectionTitle: {
    ...textStyles.headline02Medium,
    color: colors.text.bold,
  },

  /* Description — Body 01 Light */
  sectionDesc: {
    ...textStyles.body01Light,
    color: colors.text.bold,
  },

  /* Group title + description with tighter gap */
  sectionTextGroup: {
    gap: spacer['12'],
  },
});
