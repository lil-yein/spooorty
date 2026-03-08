/**
 * Navigation type definitions for the bottom tab navigator.
 */

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { DiscoverStackParamList } from './DiscoverStack';

export type RootTabParamList = {
  Discover: NavigatorScreenParams<DiscoverStackParamList> | undefined;
  Calendar: undefined;
  Create: undefined;
  Profile: undefined;
};

export type RootTabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;
