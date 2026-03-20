/**
 * CreateScreen — landing page for the Create tab.
 *
 * Layout:
 *   Content (vertically centered): two section cards — Club & Event
 *   Each card: surface/subtle wrapper ▸ bordered inner ▸ title + desc + CTA
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../lib/tokens/colors';
import { spacer, borderRadius } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Button, Icon } from '../components/ui';

// ─── Component ──────────────────────────────────────────

export default function CreateScreen() {
  return (
    <View style={styles.container}>
      {/* ── Content (centered) ───────────────────────────── */}
      <View style={styles.content}>
        <View style={styles.sections}>
          {/* Club section */}
          <View style={styles.sectionWrapper}>
            <View style={styles.sectionInner}>
              <View style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Club</Text>
                <Text style={styles.sectionDesc}>
                  Create your own club to manage members and host events!
                </Text>
                <Button
                  emphasis="Bold"
                  label="Create Club"
                  leadingIcon={undefined}
                  trailingIcon={({ color, size }) => (
                    <Icon type="arrow forward" size={size} color={color} />
                  )}
                  onPress={() => {
                    // TODO: navigate to Create Club flow
                  }}
                />
              </View>
            </View>
          </View>

          {/* Event section */}
          <View style={styles.sectionWrapper}>
            <View style={styles.sectionInner}>
              <View style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Event</Text>
                <Text style={styles.sectionDesc}>
                  Create your own one-time or regular event to share with your
                  friends!
                </Text>
                <Button
                  emphasis="Bold"
                  label="Create Event"
                  leadingIcon={undefined}
                  trailingIcon={({ color, size }) => (
                    <Icon type="arrow forward" size={size} color={color} />
                  )}
                  onPress={() => {
                    // TODO: navigate to Create Event flow
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
  },

  /* Top nav */
  topNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacer['64'],
    paddingHorizontal: spacer['24'],
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
});
