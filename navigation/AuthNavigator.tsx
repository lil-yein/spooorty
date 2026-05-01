/**
 * AuthNavigator — pre-auth flow.
 *
 * Mounted by App.tsx when there is no session.
 *
 * Screens:
 *   - Welcome  : hero image + Log In / Sign Up
 *   - Login    : "Welcome back" magic-link sign-in
 *   - SignUp   : "Let's get started" magic-link sign-up
 *
 * After the magic link is clicked, AuthContext picks up the new session,
 * App.tsx swaps in OnboardingNavigator (or Tabs if already onboarded).
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpEmailScreen from '../screens/SignUpEmailScreen';

// ─── Param list ─────────────────────────────────────────

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpEmailScreen} />
    </Stack.Navigator>
  );
}
