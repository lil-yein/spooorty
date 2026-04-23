/**
 * DiscoverScreen — Home screen layout
 *
 * Layout (from Figma node 1057:21863):
 *   Header: "Spooorty" title + notification & search icon buttons
 *   Tags row: "Clubs" / "Events" filter tags (switches content below)
 *   Cards list: CardLg items — different data per tag
 *   BottomNav: handled by TabNavigator
 *
 * Data: fetches clubs & events from Supabase, falls back to mock data.
 */

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Avatar, Button, ClubCardLg, EventCardLg, Icon } from '../components/ui';
import Tag from '../components/ui/Tag';
import { useClubs } from '../lib/hooks/useClubs';
import { useEvents } from '../lib/hooks/useEvents';
import { clubToCardProps, eventToCardProps } from '../lib/api/transforms';

// ─── Tag labels ─────────────────────────────────────────
const TAGS = ['Clubs', 'Events'];

export default function DiscoverScreen() {
  const navigation = useNavigation<any>();
  const [selectedTag, setSelectedTag] = useState(0);
  const [cardStates, setCardStates] = useState<Record<string, 'Pending' | 'Joined'>>({});

  // Fetch real data from Supabase
  const { data: dbClubs, loading: clubsLoading } = useClubs();
  const { data: dbEvents, loading: eventsLoading } = useEvents();

  // Transform DB rows into card props
  const clubs = useMemo(
    () => (dbClubs ?? []).map((club, i) => clubToCardProps(club, i)),
    [dbClubs],
  );
  const events = useMemo(
    () => (dbEvents ?? []).map((event, i) => eventToCardProps(event, i)),
    [dbEvents],
  );

  const loading = selectedTag === 0 ? clubsLoading : eventsLoading;

  const handleCtaPress = (id: string, adminApproval?: boolean) => {
    setCardStates((prev) => {
      const current = prev[id];
      if (current === 'Joined') {
        // Toggle back to Enabled
        const next = { ...prev };
        delete next[id];
        return next;
      }
      if (current === 'Pending') {
        // Already pending, no change
        return prev;
      }
      // Enabled → Pending (if admin approval) or Joined (if not)
      return { ...prev, [id]: adminApproval ? 'Pending' : 'Joined' };
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Header Row ─────────────────────────────────── */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Spooorty</Text>
          <View style={styles.headerButtons}>
            <Button
              emphasis="Subtle"
              content="Icon"
              size="Sm"
              icon={({ color, size }) => (
                <Icon type="notification" size={size} color={color} />
              )}
              onPress={() => navigation.navigate('Notification')}
            />
            <Button
              emphasis="Subtle"
              content="Icon"
              size="Sm"
              icon={({ color, size }) => (
                <Icon type="search" size={size} color={color} />
              )}
              onPress={() => navigation.navigate('Search')}
            />
          </View>
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
          {loading ? (
            <ActivityIndicator
              size="large"
              color={colors.text.subtle}
              style={styles.loader}
            />
          ) : selectedTag === 0
            ? clubs.map((card) => (
                <ClubCardLg
                  key={card.id}
                  name={card.name}
                  members={card.members}
                  sports={card.sports}
                  location={card.location}
                  level={card.level}
                  avatar={
                    <Avatar type="Image" size="Lg" showCount count={3} />
                  }
                  price={card.price}
                  state={cardStates[card.id] ?? 'Enabled'}
                  ctaLabel={card.ctaLabel}
                  ctaColor={card.ctaColor}
                  ctaTextColor={card.ctaTextColor}
                  adminApproval={card.adminApproval}
                  onCtaPress={() => handleCtaPress(card.id, card.adminApproval)}
                  onPress={() => navigation.navigate('Club', { clubId: card.id })}
                />
              ))
            : events.map((card) => (
                <EventCardLg
                  key={card.id}
                  name={card.name}
                  dateTime={card.dateTime}
                  location={card.location}
                  level={card.level}
                  avatar={
                    <Avatar type="Image" size="Lg" showCount count={3} />
                  }
                  price={card.price}
                  state={cardStates[card.id] ?? 'Enabled'}
                  ctaLabel={card.ctaLabel}
                  ctaColor={card.ctaColor}
                  ctaTextColor={card.ctaTextColor}
                  adminApproval={card.adminApproval}
                  onCtaPress={() => handleCtaPress(card.id, card.adminApproval)}
                  onPress={() => navigation.navigate('Event', { eventId: card.id })}
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
    paddingTop: spacer['24'],
    paddingBottom: 94,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacer['24'],
  },

  title: {
    ...textStyles.headline02Medium,
    color: colors.text.bold,
  },

  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
    paddingHorizontal: spacer['24'],
    marginTop: spacer['24'],
  },

  // Cards — full width with horizontal padding
  cardsSection: {
    marginTop: spacer['12'],
    paddingHorizontal: spacer['24'],
    gap: spacer['12'],
  },

  loader: {
    marginTop: spacer['48'],
  },
});
