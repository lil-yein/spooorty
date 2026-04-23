/**
 * SearchSportsScreen — alphabetical sports selector
 *
 * Layout (from Figma node 1456:22273):
 *   Header: Back button
 *   Search bar: "Search Sports" placeholder
 *   Body: SectionList of sports grouped by first letter
 *     + right-side A–Z alphabet scrubber
 *   Bottom: BottomAction with "Search" CTA
 */

import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  Pressable,
  StyleSheet,
  type SectionListData,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import {
  Button,
  Icon,
  Search,
  SearchContentItem,
} from '../components/ui';
import { SPORTS } from '../lib/data/mockData';
import type { DiscoverStackParamList } from '../navigation/DiscoverStack';

// ─── Alphabet ───────────────────────────────────────────
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// ─── Helpers ────────────────────────────────────────────
type SportsSection = { title: string; data: string[] };

function groupByLetter(items: string[]): SportsSection[] {
  const map = new Map<string, string[]>();
  items.forEach((item) => {
    const letter = item[0].toUpperCase();
    if (!map.has(letter)) map.set(letter, []);
    map.get(letter)!.push(item);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([title, data]) => ({ title, data }));
}

// ─── Component ──────────────────────────────────────────

export default function SearchSportsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<DiscoverStackParamList, 'SearchSports'>>();

  const initialSelected = route.params?.selectedSports ?? [];
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));
  const [query, setQuery] = useState('');

  const sectionListRef = useRef<SectionList>(null);

  // Filter sports by query
  const filtered = useMemo(
    () =>
      query.length === 0
        ? SPORTS
        : SPORTS.filter((s) => s.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const sections = useMemo(() => groupByLetter(filtered), [filtered]);

  // Active letters that actually have sections
  const activeLetters = useMemo(
    () => new Set(sections.map((s) => s.title)),
    [sections],
  );

  const toggleSport = useCallback((sport: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(sport)) next.delete(sport);
      else next.add(sport);
      return next;
    });
  }, []);

  const handleAlphabetPress = useCallback(
    (letter: string) => {
      const index = sections.findIndex((s) => s.title === letter);
      if (index >= 0 && sectionListRef.current) {
        sectionListRef.current.scrollToLocation({
          sectionIndex: index,
          itemIndex: 0,
          animated: true,
        });
      }
    },
    [sections],
  );

  const handleApply = useCallback(() => {
    navigation.navigate('SearchFilter', {
      currentFilters: {
        sports: Array.from(selected),
        days: route.params?.currentFilters?.days ?? [],
        times: route.params?.currentFilters?.times ?? [],
        levels: route.params?.currentFilters?.levels ?? [],
        feeRange: route.params?.currentFilters?.feeRange ?? [0, 100],
      },
    });
  }, [navigation, selected, route.params]);

  // ─── Render ─────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button
          emphasis="Subtle"
          content="Icon"
          size="Sm"
          icon={({ color, size }) => (
            <Icon type="arrow backward" size={size} color={color} />
          )}
          onPress={handleApply}
        />
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <Search
          value={query}
          onChangeText={setQuery}
          placeholder="Search Sports"
        />
      </View>

      {/* Body: SectionList + Alphabet sidebar */}
      <View style={styles.body}>
        <SectionList
          ref={sectionListRef}
          style={styles.sectionList}
          sections={sections}
          keyExtractor={(item) => item}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <SearchContentItem
              label={item}
              selected={selected.has(item)}
              onPress={() => toggleSport(item)}
            />
          )}
          renderSectionFooter={() => <View style={styles.sectionFooter} />}
          ItemSeparatorComponent={() => <View style={styles.itemGap} />}
          contentContainerStyle={styles.listContent}
          getItemLayout={undefined}
          onScrollToIndexFailed={() => {}}
        />

        {/* Alphabet sidebar */}
        <View style={styles.alphabetSidebar}>
          <View style={styles.alphabetLine} />
          <View style={styles.alphabetLetters}>
            {ALPHABET.map((letter) => {
              const isActive = activeLetters.has(letter);
              return (
                <Pressable
                  key={letter}
                  onPress={() => handleAlphabetPress(letter)}
                  hitSlop={4}
                >
                  <Text
                    style={[
                      styles.alphabetLetter,
                      isActive && styles.alphabetLetterActive,
                    ]}
                  >
                    {letter}
                  </Text>
                </Pressable>
              );
            })}
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

  header: {
    paddingTop: spacer['24'],
    paddingHorizontal: spacer['24'],
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchRow: {
    paddingHorizontal: spacer['24'],
    marginTop: spacer['24'],
  },

  body: {
    flex: 1,
    flexDirection: 'row',
    marginTop: spacer['24'],
  },

  sectionList: {
    flex: 1,
  },

  listContent: {
    paddingLeft: spacer['24'],
    paddingRight: spacer['8'],
    paddingBottom: spacer['24'],
  },

  sectionHeader: {
    ...textStyles.title02Medium,
    color: colors.text.bold,
    marginBottom: spacer['12'],
  },

  sectionFooter: {
    height: spacer['24'],
  },

  itemGap: {
    height: spacer['12'],
  },

  // Alphabet sidebar
  alphabetSidebar: {
    width: 20,
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    gap: spacer['4'],
  },

  alphabetLine: {
    width: 0.5,
    height: '100%',
    backgroundColor: colors.border.subtle,
  },

  alphabetLetters: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 0,
  },

  alphabetLetter: {
    ...textStyles.body04Light,
    color: colors.text.subtle,
  },

  alphabetLetterActive: {
    color: colors.text.bold,
  },
});
