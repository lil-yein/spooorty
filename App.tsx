/**
 * App root — React Navigation entry point.
 *
 * Wraps the app in SafeAreaProvider + NavigationContainer,
 * then renders a root stack with:
 *   - Tabs (bottom tab navigator with custom BottomNav)
 *   - ComponentTest (dev screen, pushed from Profile)
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import TabNavigator from './navigation/TabNavigator';
import ComponentTestScreen from './screens/ComponentTestScreen';

// ─── Root Stack ─────────────────────────────────────────────

export type RootStackParamList = {
  Tabs: undefined;
  ComponentTest: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="ComponentTest" component={ComponentTestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
