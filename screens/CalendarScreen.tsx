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
 * Data: fetches events from Supabase for the visible month.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Avatar, Button, EventCardLg, Calendar, Icon } from '../components/ui';
import { useMonthEvents } from '../lib/hooks/useEvents';
import { eventToCardProps } from '../lib/api/transforms';
import type { DbEvent } from '../lib/database/types';

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

/** Extract day number from a YYYY-MM-DD date string */
function dayFromDate(dateStr: string): number {
  return parseInt(dateStr.slice(8), 10);
}

// ─── Component ──────────────────────────────────────────

export default function CalendarScreen() {
  const navigation = useNavigation<any>();
  const now = new Date();
  const todayDay = now.getDate();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);
  const [cardStates, setCardStates] = useState<Record<string, 'Pending' | 'Joined'>>({});

  // Fetch events for the visible month from Supabase (month+1 for 1-indexed)
  const { data: monthEvents, loading } = useMonthEvents(year, month + 1);

  // Derive event days & counts from real data
  const eventDays = useMemo(() => {
    if (!monthEvents) return [];
    const days = new Set<number>();
    monthEvents.forEach((e) => days.add(dayFromDate(e.event_date)));
    return Array.from(days).sort((a, b) => a - b);
  }, [monthEvents]);

  const eventCounts = useMemo(() => {
    if (!monthEvents) return {};
    const counts: Record<number, number> = {};
    monthEvents.forEach((e) => {
      const day = dayFromDate(e.event_date);
      counts[day] = (counts[day] || 0) + 1;
    });
    return counts;
  }, [monthEvents]);

  // Find nearest event day from selected day
  const displayDay = useMemo(() => {
    if (eventDays.includes(selectedDay)) return selectedDay;
    const upcoming = eventDays.filter((d) => d >= selectedDay);
    if (upcoming.length > 0) return upcoming[0];
    return selectedDay;
  }, [selectedDay, eventDays]);

  // Events for the displayed day, transformed to card props
  const dayEvents = useMemo(() => {
    if (!monthEvents) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(displayDay).padStart(2, '0')}`;
    return monthEvents
      .filter((e) => e.event_date === dateStr)
      .map((e, i) => eventToCardProps(e, i));
  }, [monthEvents, year, month, displayDay]);

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

  const handleCtaPress = useCallback((id: string, adminApproval?: boolean) => {
    setCardStates((prev) => {
      const current = prev[id];
      if (current === 'Joined') {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      if (current === 'Pending') return prev;
      return { ...prev, [id]: adminApproval ? 'Pending' : 'Joined' };
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
            todayDay={year === now.getFullYear() && month === now.getMonth() ? todayDay : undefined}
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

            {loading ? (
              <ActivityIndicator
                size="large"
                color={colors.text.subtle}
                style={{ marginTop: spacer['24'] }}
              />
            ) : dayEvents.length > 0 ? (
              dayEvents.map((event) => (
                <EventCardLg
                  key={event.id}
                  name={event.name}
                  dateTime={event.dateTime}
                  location={event.location}
                  level={event.level}
                  avatar={
                    <Avatar type="Image" size="Lg" showCount count={3} />
                  }
                  price={event.price}
                  state={cardStates[event.id] ?? 'Enabled'}
                  ctaLabel={event.ctaLabel}
                  ctaColor={event.ctaColor}
                  ctaTextColor={event.ctaTextColor}
                  adminApproval={event.adminApproval}
                  onCtaPress={() => handleCtaPress(event.id, event.adminApproval)}
                  onPress={() => navigation.push('Event', { eventId: event.id })}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No events on this day</Text>
            )}
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

  emptyText: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
    textAlign: 'center',
    paddingVertical: spacer['24'],
  },
});
