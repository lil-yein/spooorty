/**
 * Bottom Tab Navigator — wires React Navigation to the custom BottomNav component.
 *
 * The TabBarAdapter bridges React Navigation's BottomTabBarProps
 * to our BottomNav component props:
 *   state.index → selected
 *   navigation.emit + navigate → onSelect
 *   useSafeAreaInsets().bottom → bottomInset
 *
 * Tab order matches BottomNav's TABS array:
 *   0 = Discover (globe), 1 = Calendar, 2 = Create (add), 3 = Profile (person)
 */

import React from 'react';
import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { createStaticNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BottomNav from '../components/ui/BottomNav';
import type { RootTabParamList } from './types';

import DiscoverStack from './DiscoverStack';
import CalendarScreen from '../screens/CalendarScreen';
import CreateScreen from '../screens/CreateScreen';
import ProfileScreen from '../screens/ProfileScreen';

// ─── Custom tab bar adapter ────────────────────────────────

function TabBarAdapter({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <BottomNav
      selected={state.index as 0 | 1 | 2 | 3}
      onSelect={(index) => {
        const route = state.routes[index];
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });
        if (!event.defaultPrevented) {
          navigation.navigate(route.name, route.params);
        }
      }}
      bottomInset={insets.bottom}
    />
  );
}

// ─── Tab Navigator ─────────────────────────────────────────

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBarAdapter {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Discover" component={DiscoverStack} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
