/**
 * CalendarScreen — Calendar tab with month view + event cards
 *
 * Layout (from Figma node 1057:22404):
 *   Header: "Spooorty" title + notification & search icon buttons
 *   Calendar: month grid with event indicator dots
 *   Selected date label: "Wednesday, January 18"
 *   Event cards: CardLg list for the selected/displayed date
 *   BottomNav: handled by TabNavigator
 *
 * Default behaviour: show today's events, or nearest upcoming date with events.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Avatar, Button, CardLg, Calendar, Icon } from '../components/ui';
import {
  getEventsForDate,
  getEventDaysForMonth,
  getEventCountsForMonth,
  getNearestEventDay,
  type CalendarEvent,
} from '../lib/data/mockData';

// ─── Date formatting helpers ─────────────────────────────
const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday',
];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDateLabel(year: number, month: number, day: number): string {
  const d = new Date(year, month, day);
  return `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[month]} ${day}`;
}

// ─── Component ──────────────────────────────────────────

export default function CalendarScreen() {
  const navigation = useNavigation<any>();
  // Demo: use Jan 2024 to match Figma mock data
  const todayDay = 18; // Demo "today"
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(0); // 0 = January
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());

  // Event days for indicator dots
  const eventDays = useMemo(
    () => getEventDaysForMonth(year, month + 1),
    [year, month],
  );

  // Event counts per day (for dot count in DateCell)
  const eventCounts = useMemo(
    () => getEventCountsForMonth(year, month + 1),
    [year, month],
  );

  // Find nearest event day from selected day for the event list
  const displayDay = useMemo(() => {
    return getNearestEventDay(year, month + 1, selectedDay) ?? selectedDay;
  }, [selectedDay, year, month]);

  // Events for the displayed day
  const events: CalendarEvent[] = useMemo(
    () => getEventsForDate(year, month + 1, displayDay),
    [year, month, displayDay],
  );

  const handlePrevMonth = useCallback(() => {
    setMonth((prev) => {
      if (prev === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
    setSelectedDay(1);
  }, []);

  const handleNextMonth = useCallback(() => {
    setMonth((prev) => {
      if (prev === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
    setSelectedDay(1);
  }, []);

  const handleSelectDay = useCallback((day: number) => {
    setSelectedDay(day);
  }, []);

  const handleCtaPress = useCallback((id: string) => {
    setJoinedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // ─── Render ─────────────────────────────────────────────
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

        {/* ── Calendar + Events ──────────────────────────── */}
        <View style={styles.calendarEvents}>
          <Calendar
            year={year}
            month={month}
            selectedDay={selectedDay}
            todayDay={todayDay}
            eventDays={eventDays}
            eventCounts={eventCounts}
            onSelectDay={handleSelectDay}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          {/* ── Following Content ─────────────────────────── */}
          <View style={styles.followingContent}>
            <Text style={styles.dateLabel}>
              {formatDateLabel(year, month, displayDay)}
            </Text>

            {events.map((event) => (
                <CardLg
                  key={event.id}
                  name={event.name}
                  dateTime={event.dateTime}
                  location={event.location}
                  level={event.level}
                  avatar={
                    <Avatar type="Image" size="Lg" showCount count={3} />
                  }
                  mutualHighlight={event.mutualHighlight}
                  mutualBody={event.mutualBody}
                  price={event.price}
                  state={joinedIds.has(event.id) ? 'Joined' : 'Enabled'}
                  ctaLabel={event.ctaLabel}
                  ctaColor={event.ctaColor}
                  ctaTextColor={event.ctaTextColor}
                  onCtaPress={() => handleCtaPress(event.id)}
                  onPress={() => navigation.push('Event', { eventId: event.id })}
                />
            ))}
          </View>
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
    ...textStyles.headline02Light,
    color: colors.text.bold,
  },

  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
  },

  // Calendar + events wrapper
  calendarEvents: {
    marginTop: spacer['24'],
    paddingHorizontal: spacer['24'],
    gap: spacer['24'],
  },

  // Following content (date label + cards)
  followingContent: {
    gap: 12,
  },

  dateLabel: {
    ...textStyles.title01Medium,
    color: colors.text.bold,
  },
});
