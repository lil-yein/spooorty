/**
 * ProfileStack — nested stack navigator inside the Profile tab.
 *
 * By nesting these screens inside a tab, the BottomNav (tab bar)
 * remains visible on all Profile-flow screens.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyProfileScreen from '../screens/MyProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import OtherUserProfileScreen from '../screens/OtherUserProfileScreen';
import ClubScreen from '../screens/ClubScreen';
import EventScreen from '../screens/EventScreen';

// ─── Param list for Profile stack ───────────────────────

export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  OtherUserProfile: { userId: string };
  Club: { clubId: string };
  Event: { eventId: string };
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={MyProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="OtherUserProfile" component={OtherUserProfileScreen} />
      <Stack.Screen name="Club" component={ClubScreen} />
      <Stack.Screen name="Event" component={EventScreen} />
    </Stack.Navigator>
  );
}
