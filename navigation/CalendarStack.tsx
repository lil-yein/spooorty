/**
 * CalendarStack — nested stack navigator inside the Calendar tab.
 *
 * By nesting these screens inside a tab, the BottomNav (tab bar)
 * remains visible on all Calendar-flow screens including
 * Club, Event, OtherUserProfile, Notification, and Search.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CalendarScreen from '../screens/CalendarScreen';
import ClubScreen from '../screens/ClubScreen';
import EventScreen from '../screens/EventScreen';
import OtherUserProfileScreen from '../screens/OtherUserProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SearchScreen from '../screens/SearchScreen';
import SearchFilterScreen from '../screens/SearchFilterScreen';
import SearchSportsScreen from '../screens/SearchSportsScreen';
import type { SearchFilters } from '../lib/data/mockData';

// ─── Param list for Calendar stack ──────────────────────

export type CalendarStackParamList = {
  CalendarHome: undefined;
  Club: { clubId: string };
  Event: { eventId: string };
  OtherUserProfile: { userId: string };
  Notification: undefined;
  Search: { query?: string; filters?: SearchFilters } | undefined;
  SearchFilter: { currentFilters?: SearchFilters } | undefined;
  SearchSports: { selectedSports?: string[]; currentFilters?: SearchFilters } | undefined;
};

const Stack = createNativeStackNavigator<CalendarStackParamList>();

export default function CalendarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CalendarHome" component={CalendarScreen} />
      <Stack.Screen name="Club" component={ClubScreen} />
      <Stack.Screen name="Event" component={EventScreen} />
      <Stack.Screen name="OtherUserProfile" component={OtherUserProfileScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="SearchFilter" component={SearchFilterScreen} />
      <Stack.Screen name="SearchSports" component={SearchSportsScreen} />
    </Stack.Navigator>
  );
}
