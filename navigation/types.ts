/**
 * Navigation type definitions for the bottom tab navigator.
 */

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { DiscoverStackParamList } from './DiscoverStack';
import type { CalendarStackParamList } from './CalendarStack';
import type { ProfileStackParamList } from './ProfileStack';
import type { CreateStackParamList } from './CreateStack';

export type RootTabParamList = {
  Discover: NavigatorScreenParams<DiscoverStackParamList> | undefined;
  Calendar: NavigatorScreenParams<CalendarStackParamList> | undefined;
  Create: NavigatorScreenParams<CreateStackParamList> | undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type RootTabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;
