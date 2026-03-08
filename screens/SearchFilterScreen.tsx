/**
 * SearchFilterScreen — advanced search filter panel
 *
 * Layout (from Figma node 1456:22226):
 *   Header: Back button
 *   Body (scrollable): Sports row, Date, Time, Level, Fee
 *   Bottom: BottomAction with "Search" CTA
 *
 * Filter sections:
 *   Sports: label + chevron right → navigates to SearchSportsScreen
 *   Date:   ButtonMultiSelect (Mon–Sun)
 *   Time:   ButtonMultiSelect (Morning / Afternoon / Night)
 *   Level:  ButtonMultiSelect (Beginner / Intermediate / Advanced)
 *   Fee:    Range slider ($0 – $100)
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import {
  Button,
  Icon,
  ButtonMultiSelect,
  Range,
  BottomAction,
} from '../components/ui';
import { DEFAULT_FILTERS, type SearchFilters } from '../lib/data/mockData';
import type { DiscoverStackParamList } from '../navigation/DiscoverStack';

// ─── Filter option labels ───────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIMES = ['Morning', 'Afternoon', 'Night'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

// ─── Component ──────────────────────────────────────────

export default function SearchFilterScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<DiscoverStackParamList, 'SearchFilter'>>();

  const initial = route.params?.currentFilters ?? DEFAULT_FILTERS;

  const [sports, setSports] = useState<string[]>(initial.sports);
  const [days, setDays] = useState<number[]>(initial.days);
  const [times, setTimes] = useState<number[]>(initial.times);
  const [levels, setLevels] = useState<number[]>(initial.levels);
  const [feeRange, setFeeRange] = useState<[number, number]>(initial.feeRange);

  // Sync sports when returning from SearchSportsScreen with updated params
  useEffect(() => {
    if (route.params?.currentFilters?.sports) {
      setSports(route.params.currentFilters.sports);
    }
  }, [route.params?.currentFilters?.sports]);

  const toggleDay = useCallback((i: number) => {
    setDays((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  }, []);

  const toggleTime = useCallback((i: number) => {
    setTimes((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  }, []);

  const toggleLevel = useCallback((i: number) => {
    setLevels((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  }, []);

  const handleSportsPress = useCallback(() => {
    navigation.navigate('SearchSports', {
      selectedSports: sports,
      currentFilters: { sports, days, times, levels, feeRange },
    });
  }, [navigation, sports, days, times, levels, feeRange]);

  const handleSearch = useCallback(() => {
    const filters: SearchFilters = { sports, days, times, levels, feeRange };
    navigation.navigate('Search', { filters });
  }, [navigation, sports, days, times, levels, feeRange]);

  // ─── Render ─────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
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

        {/* Sports */}
        <Pressable style={styles.sportsRow} onPress={handleSportsPress}>
          <Text style={styles.sectionLabel}>Sports</Text>
          <Icon type="chevron right" size={16} color={colors.icon.bold} />
        </Pressable>

        {/* Date */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Date</Text>
          <ButtonMultiSelect
            items={DAYS}
            selected={days}
            onToggle={toggleDay}
            display="Fill"
          />
        </View>

        {/* Time */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Time</Text>
          <ButtonMultiSelect
            items={TIMES}
            selected={times}
            onToggle={toggleTime}
            display="Fill"
          />
        </View>

        {/* Level */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Level</Text>
          <ButtonMultiSelect
            items={LEVELS}
            selected={levels}
            onToggle={toggleLevel}
            display="Fill"
          />
        </View>

        {/* Fee */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Fee</Text>
          <Range
            min={0}
            max={100}
            low={feeRange[0]}
            high={feeRange[1]}
            onChangeRange={(range) => setFeeRange(range)}
            formatLabel={(v) => `$${v}`}
          />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomAction}>
        <BottomAction showHomeIndicator={false}>
          <Button
            emphasis="Bold"
            label="Apply"
            trailingIcon={({ color, size }) => (
              <Icon type="arrow forward" size={size} color={color} />
            )}
            onPress={handleSearch}
          />
        </BottomAction>
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

  scrollContent: {
    paddingBottom: spacer['128'],
  },

  header: {
    paddingTop: spacer['64'],
    paddingHorizontal: spacer['24'],
    flexDirection: 'row',
    alignItems: 'center',
  },

  sportsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacer['24'],
    marginTop: spacer['24'],
  },

  section: {
    paddingHorizontal: spacer['24'],
    marginTop: spacer['24'],
    gap: spacer['8'],
  },

  sectionLabel: {
    ...textStyles.title02Medium,
    color: colors.text.bold,
  },

  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
