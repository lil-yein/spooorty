/**
 * CreateStack — nested stack navigator inside the Create tab.
 *
 * By nesting these screens inside a tab, the BottomNav (tab bar)
 * remains visible on all Create-flow screens.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CreateScreen from '../screens/CreateScreen';
import CreateClubScreen from '../screens/CreateClubScreen';
import CreateEventScreen from '../screens/CreateEventScreen';

// ─── Param list for Create stack ───────────────────────

export type CreateStackParamList = {
  CreateHome: undefined;
  CreateClub: undefined;
  CreateEvent: { associatedClubId?: string } | undefined;
};

const Stack = createNativeStackNavigator<CreateStackParamList>();

export default function CreateStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateHome" component={CreateScreen} />
      <Stack.Screen name="CreateClub" component={CreateClubScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
    </Stack.Navigator>
  );
}
