/**
 * OnboardingNavigator — post-auth onboarding flow.
 *
 * Mounted by App.tsx when:
 *   session && onboardingCompleted === false
 *
 * Steps:
 *   1. ProfileSetup     — photo (optional) + display name (required)
 *   2. SportsSelection  — pick at least 3 sports → completeOnboarding()
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import SportsSelectionScreen from '../screens/SportsSelectionScreen';

// ─── Param list ─────────────────────────────────────────

export type OnboardingStackParamList = {
  ProfileSetup: undefined;
  SportsSelection: {
    /** Photo URI selected on the previous screen (null if skipped). */
    photoUri: string | null;
    /** Display name entered on the previous screen. */
    displayName: string;
  };
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="SportsSelection" component={SportsSelectionScreen} />
    </Stack.Navigator>
  );
}
