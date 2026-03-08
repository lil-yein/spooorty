/**
 * SearchScreen — search results with text query + filter integration
 *
 * Layout (from Figma node 1456:22109):
 *   Header: Back button + Search input (flex 1) + Filter button
 *   Tags row: Clubs / Events
 *   Cards list: filtered CardLg results
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { Avatar, Button, CardLg, Icon, Search } from '../components/ui';
import Tag from '../components/ui/Tag';
import { CLUBS, EVENTS, DEFAULT_FILTERS, type SearchFilters } from '../lib/data/mockData';
import type { DiscoverStackParamList } from '../navigation/DiscoverStack';

// ─── Tag labels ─────────────────────────────────────────
const TAGS = ['Clubs', 'Events'];

// ─── Component ──────────────────────────────────────────

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<DiscoverStackParamList, 'Search'>>();

  const [query, setQuery] = useState(route.params?.query ?? '');
  const [selectedTag, setSelectedTag] = useState(0);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());

  const filters: SearchFilters = route.params?.filters ?? DEFAULT_FILTERS;

  // Filter cards by query text (name match)
  const sourceCards = selectedTag === 0 ? CLUBS : EVENTS;

  const cards = useMemo(() => {
    if (query.length === 0) return [];
    const q = query.toLowerCase();
    return sourceCards.filter((c) => c.name.toLowerCase().includes(q));
  }, [query, sourceCards]);

  const handleCtaPress = useCallback((id: string) => {
    setJoinedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleFilterPress = useCallback(() => {
    navigation.navigate('SearchFilter', { currentFilters: filters });
  }, [navigation, filters]);

  // ─── Render ─────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Header Row ─────────────────────────────────── */}
        <View style={styles.headerRow}>
          <Button
            emphasis="Subtle"
            content="Icon"
            size="Sm"
            icon={({ color, size }) => (
              <Icon type="arrow backward" size={size} color={color} />
            )}
            onPress={() => navigation.navigate('DiscoverHome')}
          />

          <View style={styles.searchWrap}>
            <Search
              value={query}
              onChangeText={setQuery}
              placeholder="Search clubs and events"
            />
          </View>

          <Button
            emphasis="Subtle"
            content="Icon"
            size="Sm"
            icon={({ color, size }) => (
              <Icon type="filter" size={size} color={color} />
            )}
            onPress={handleFilterPress}
          />
        </View>

        {/* ── Tags Row ───────────────────────────────────── */}
        <View style={styles.tagsRow}>
          {TAGS.map((label, index) => (
            <Tag
              key={label}
              label={label}
              selected={selectedTag === index}
              size="Lg"
              onPress={() => setSelectedTag(index)}
            />
          ))}
        </View>

        {/* ── Cards List ─────────────────────────────────── */}
        <View style={styles.cardsSection}>
          {cards.map((card) => (
            <CardLg
              key={card.id}
              name={card.name}
              dateTime={card.dateTime}
              location={card.location}
              level={card.level}
              avatar={
                <Avatar type="Image" size="Lg" showCount count={3} />
              }
              mutualHighlight={card.mutualHighlight}
              mutualBody={card.mutualBody}
              price={card.price}
              state={joinedIds.has(card.id) ? 'Joined' : 'Enabled'}
              ctaLabel={card.ctaLabel}
              ctaColor={card.ctaColor}
              ctaTextColor={card.ctaTextColor}
              onCtaPress={() => handleCtaPress(card.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.bold,
  },

  content: {
    paddingTop: spacer['64'],
    paddingBottom: spacer['96'],
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
    paddingHorizontal: spacer['24'],
  },

  searchWrap: {
    flex: 1,
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
    paddingHorizontal: spacer['24'],
    marginTop: spacer['24'],
  },

  // Cards
  cardsSection: {
    marginTop: spacer['12'],
    paddingHorizontal: spacer['24'],
    gap: spacer['12'],
  },
});
