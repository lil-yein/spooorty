/**
 * SportsSelectionScreen — final onboarding step
 *
 * Layout:
 *   Header: "What sports do you play?" + "Your picks help us find the right
 *           clubs and events for you."
 *   Body: Scrollable wrapping grid of Tag pills (one per sport)
 *   Footer:
 *     "Choose at least N more" hint (until min reached)
 *     "Let's get started!" button (disabled until 3 selected)
 *
 * On submit: calls completeOnboarding() with the photoUri/displayName from
 * the previous screen plus the selected sports. AuthContext flips
 * onboardingCompleted to true and the app routes to Tabs.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Button, Tag } from '../components/ui';
import { SPORTS } from '../lib/data/mockData';
import { completeOnboarding } from '../lib/api/onboarding';
import { useAuth } from '../lib/AuthContext';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

const MIN_SPORTS = 3;

export default function SportsSelectionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<OnboardingStackParamList, 'SportsSelection'>>();
  const { setOnboardingCompleted } = useAuth();

  const { photoUri, displayName } = route.params;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const toggleSport = useCallback((sport: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(sport)) next.delete(sport);
      else next.add(sport);
      return next;
    });
  }, []);

  const canSubmit = selected.size >= MIN_SPORTS;

  // Filter "Other" / "Network" out of the visible list — those are filter-only
  const baseSports = useMemo(
    () => SPORTS.filter((s) => s !== 'Network' && s !== 'Other'),
    [],
  );

  // Show selected sports first (in selection order), then the rest
  // alphabetically. Matches the Figma where the user's picks float to the top.
  const visibleSports = useMemo(() => {
    const selectedList = Array.from(selected);
    const unselected = baseSports.filter((s) => !selected.has(s));
    return [...selectedList, ...unselected];
  }, [baseSports, selected]);

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      console.log('[Onboarding] submitting', {
        displayName,
        photoUri,
        sportsCount: selected.size,
      });
      const updated = await completeOnboarding({
        displayName,
        photoUri,
        preferredSports: Array.from(selected),
      });
      console.log('[Onboarding] saved', updated);
      // Flip the gate locally so App.tsx swaps Onboarding stack for Tabs
      setOnboardingCompleted(true);
    } catch (err: any) {
      console.error('[Onboarding] failed', err);
      // Alert.alert is unreliable on web; show a window.alert fallback too
      const msg = err?.message ?? 'Please try again.';
      Alert.alert('Could not finish', msg);
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(`Could not finish onboarding: ${msg}`);
      }
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <View style={styles.headerGroup}>
          <Text style={styles.title}>What sports do you play?</Text>
          <Text style={styles.subtitle}>
            Your picks help us find the right clubs and events for you.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tagGrid}>
          {visibleSports.map((sport) => (
            <Tag
              key={sport}
              label={sport}
              size="Sm"
              selected={selected.has(sport)}
              onPress={() => toggleSport(sport)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Footer floats over the scroll content (no background) so the last
          row of tags can be partially visible behind it — matches the
          Figma where the CTA overlaps the bottom of the tag grid. */}
      <View style={styles.footer} pointerEvents="box-none">
        <Button
          emphasis={canSubmit ? 'Bold' : 'Subtle'}
          label={canSubmit ? "Let's get started!" : `Choose at least ${MIN_SPORTS}`}
          // Submitting takes precedence — show real spinner during the
          // network call. Otherwise the visual "non-actionable" state
          // is conveyed by the Subtle emphasis + disabled flag.
          state={submitting ? 'Loading' : 'Enabled'}
          onPress={handleSubmit}
          disabled={!canSubmit || submitting}
        />
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

  headerWrap: {
    paddingTop: spacer['64'],
    paddingHorizontal: spacer['24'],
    paddingBottom: spacer['24'],
  },

  headerGroup: {
    gap: spacer['16'],
  },

  title: {
    ...textStyles.headline01Medium,
    color: colors.text.bold,
  },

  subtitle: {
    ...textStyles.title01Light,
    color: colors.text.subtle,
  },

  scroll: {
    flex: 1,
  },

  // Bottom padding leaves room for the floating CTA so the last row of
  // tags can scroll above it: button height (48) + spacer/64 bottom inset
  // + spacer/24 breathing room.
  scrollContent: {
    paddingHorizontal: spacer['24'],
    paddingBottom: spacer['64'] + 48 + spacer['24'],
  },

  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacer['8'],
  },

  // Floating footer — no background, anchored to bottom, lets sports
  // grid behind it remain visible (per Figma). pointerEvents="box-none"
  // on the wrapper lets taps pass through outside the button.
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacer['64'],
    paddingHorizontal: spacer['24'],
  },
});
