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

  const remaining = Math.max(0, MIN_SPORTS - selected.size);
  const canSubmit = selected.size >= MIN_SPORTS;

  // Filter "Other" / "Network" out of the visible list — those are filter-only
  const visibleSports = useMemo(
    () => SPORTS.filter((s) => s !== 'Network' && s !== 'Other'),
    [],
  );

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

      <View style={styles.footer}>
        {!canSubmit && (
          <Text style={styles.hint}>
            Choose at least {remaining} more
          </Text>
        )}
        <Button
          emphasis="Bold"
          label="Let's get started!"
          state={submitting ? 'Loading' : 'Enabled'}
          onPress={handleSubmit}
          disabled={!canSubmit || submitting}
          overrideTextColor={!canSubmit ? colors.text.subtle : undefined}
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
    paddingTop: spacer['24'],
    paddingHorizontal: spacer['24'],
    paddingBottom: spacer['24'],
  },

  headerGroup: {
    gap: spacer['16'],
  },

  title: {
    ...textStyles.headline02Medium,
    color: colors.text.bold,
  },

  subtitle: {
    ...textStyles.title01Light,
    color: colors.text.subtle,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: spacer['24'],
    paddingBottom: spacer['24'],
  },

  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacer['8'],
  },

  footer: {
    paddingHorizontal: spacer['24'],
    paddingTop: spacer['16'],
    paddingBottom: spacer['48'],
    gap: spacer['12'],
  },

  hint: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
    textAlign: 'center',
  },
});
