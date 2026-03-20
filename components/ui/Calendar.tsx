/**
 * Calendar component — mapped from Figma component documentation
 *
 * Props:
 *   year, month: current displayed month
 *   selectedDay: currently selected day (optional)
 *   todayDay: which day is "today" (optional)
 *   eventDays: array of days with events (optional)
 *   onSelectDay: callback
 *   onPrevMonth / onNextMonth: navigation callbacks
 *   showBackButton: optional back button
 *   onBack: back button callback
 *
 * Anatomy (from Figma docs):
 *   Title: month/year in headline02Medium + prev/next pill buttons
 *   Weekday header: S M T W T F S in body02Light, text/subtle
 *   Grid: 5-6 rows of 7 DateCells, justify-between
 *   Nav buttons: pill shape, 10px padding, 16px icon, border/subtle 0.5px
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors } from '../../lib/tokens/colors';
import { spacer, borderRadius } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';
import DateCell from './DateCell';

// ─── Types ──────────────────────────────────────────────

export type CalendarProps = {
  year: number;
  month: number; // 0-indexed (0 = January)
  selectedDay?: number;
  todayDay?: number;
  eventDays?: number[];
  eventCounts?: Record<number, number>;
  onSelectDay?: (day: number) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
};

// ─── Helpers ────────────────────────────────────────────

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

function getCalendarWeeks(year: number, month: number): (number | null)[][] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = [];

  // Pad start
  for (let i = 0; i < firstDay; i++) week.push(null);

  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  // Pad end
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return weeks;
}

// ─── Component ──────────────────────────────────────────

export default function Calendar({
  year,
  month,
  selectedDay,
  todayDay,
  eventDays = [],
  eventCounts = {},
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  showBackButton = false,
  onBack,
}: CalendarProps) {
  const weeks = getCalendarWeeks(year, month);
  const eventSet = new Set(eventDays);

  return (
    <View style={styles.container}>
      {/* Back button */}
      {showBackButton && (
        <Pressable style={styles.navButton} onPress={onBack}>
          <Icon type="chevron Left" size={16} color={colors.icon.bold} />
        </Pressable>
      )}

      {/* Title row */}
      <View style={styles.titleRow}>
        <Text style={styles.titleText}>
          {MONTH_NAMES[month]} {year}
        </Text>
        <View style={styles.navIcons}>
          <Pressable style={styles.navButton} onPress={onPrevMonth}>
            <Icon type="chevron Left" size={16} color={colors.icon.bold} />
          </Pressable>
          <Pressable style={styles.navButton} onPress={onNextMonth}>
            <Icon type="chevron right" size={16} color={colors.icon.bold} />
          </Pressable>
        </View>
      </View>

      {/* Weekday header */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((label, i) => (
          <View key={i} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Weeks grid */}
      <View style={styles.weeksContainer}>
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.weekRow}>
            {week.map((day, di) => (
              <View key={di} style={styles.dayCell}>
                {day != null ? (
                  <DateCell
                    day={day}
                    selected={day === selectedDay}
                    today={day === todayDay}
                    events={eventSet.has(day)}
                    eventCount={eventCounts[day] || 0}
                    onPress={() => onSelectDay?.(day)}
                  />
                ) : (
                  <View style={styles.emptyCell} />
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  // Title
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacer['24'],
  },

  titleText: {
    ...textStyles.headline02Medium,
    color: colors.text.bold,
  },

  navIcons: {
    flexDirection: 'row',
    gap: spacer['8'],
  },

  navButton: {
    padding: spacer['10'],
    borderRadius: borderRadius.round,
    borderWidth: 0.5,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.bold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Weekday header
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacer['10'],
    paddingVertical: spacer['4'],
  },

  weekdayCell: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  weekdayText: {
    ...textStyles.body02Light,
    color: colors.text.subtle,
    textAlign: 'center',
    width: 20,
  },

  // Weeks
  weeksContainer: {
    gap: spacer['8'],
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dayCell: {
    width: 40,
    alignItems: 'center',
  },

  emptyCell: {
    width: 40,
    height: 48,
  },
});
