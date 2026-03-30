/**
 * App root — React Navigation entry point.
 *
 * Wraps the app in SafeAreaProvider + NavigationContainer,
 * then renders a root stack with:
 *   - Tabs (bottom tab navigator with custom BottomNav)
 *   - ComponentTest (dev screen, pushed from Profile)
 */

import React from 'react';
import { Platform, ActivityIndicator, View } from 'react-native';
import { NavigationContainer, type LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

import { AuthProvider, useAuth } from './lib/AuthContext';
import TabNavigator from './navigation/TabNavigator';
import LoginScreen from './screens/LoginScreen';
import ComponentTestScreen from './screens/ComponentTestScreen';

// ─── Root Stack ─────────────────────────────────────────────

export type RootStackParamList = {
  Login: undefined;
  Tabs: undefined;
  ComponentTest: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ─── Deep linking (web only) ────────────────────────────────

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [],
  config: {
    screens: {
      Tabs: {
        screens: {
          Discover: {
            screens: {
              DiscoverHome: '',
              Search: 'Search',
              SearchFilter: 'SearchFilter',
              SearchSports: 'SearchSports',
              Notification: 'Notification',
              Club: 'Club/:clubId',
              Event: 'Event/:eventId',
              OtherUserProfile: 'OtherUserProfile/:userId',
            },
          },
          Calendar: 'Calendar',
          Create: 'Create',
          Profile: {
            screens: {
              ProfileHome: 'Profile',
              OtherUserProfile: 'Profile/OtherUserProfile/:userId',
              Club: 'Profile/Club/:clubId',
              Event: 'Profile/Event/:eventId',
            },
          },
        },
      },
      ComponentTest: 'ComponentTest',
    },
  },
};

// ⚠️ DEV ONLY: set to true to skip login and go straight to Tabs
const DEV_SKIP_AUTH = false;

function AppNavigator() {
  const { session, loading } = useAuth();

  if (loading && !DEV_SKIP_AUTH) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const showApp = DEV_SKIP_AUTH || session;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showApp ? (
        <>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="ComponentTest" component={ComponentTestScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Nohemi-Light': require('./assets/fonts/Nohemi-Light.ttf'),
    'Nohemi-Regular': require('./assets/fonts/Nohemi-Regular.ttf'),
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer linking={Platform.OS === 'web' ? linking : undefined}>
          <StatusBar style="dark" />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
