/**
 * DiscoverStack — nested stack navigator inside the Discover tab.
 *
 * By nesting these screens inside a tab, the BottomNav (tab bar)
 * remains visible on all Discover-flow screens including
 * Search, SearchFilter, SearchSports, and Notification.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DiscoverScreen from '../screens/DiscoverScreen';
import SearchScreen from '../screens/SearchScreen';
import SearchFilterScreen from '../screens/SearchFilterScreen';
import SearchSportsScreen from '../screens/SearchSportsScreen';
import NotificationScreen from '../screens/NotificationScreen';
import type { SearchFilters } from '../lib/data/mockData';

// ─── Param list for Discover stack ──────────────────────

export type DiscoverStackParamList = {
  DiscoverHome: undefined;
  Search: { query?: string; filters?: SearchFilters } | undefined;
  SearchFilter: { currentFilters?: SearchFilters } | undefined;
  SearchSports: { selectedSports?: string[]; currentFilters?: SearchFilters } | undefined;
  Notification: undefined;
};

const Stack = createNativeStackNavigator<DiscoverStackParamList>();

export default function DiscoverStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiscoverHome" component={DiscoverScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="SearchFilter" component={SearchFilterScreen} />
      <Stack.Screen name="SearchSports" component={SearchSportsScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
}
