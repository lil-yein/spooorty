/**
 * App root — React Navigation entry point.
 *
 * Wraps the app in SafeAreaProvider + NavigationContainer, then renders a
 * root stack that swaps between three flows based on auth + onboarding state:
 *
 *   no session                          → Auth        (Welcome/Login/SignUp)
 *   session + !onboarding_completed     → Onboarding  (ProfileSetup/SportsSelection)
 *   session + onboarding_completed      → Tabs        (main app)
 *
 * The flag check happens in AuthContext on session change.
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
import AuthNavigator from './navigation/AuthNavigator';
import OnboardingNavigator from './navigation/OnboardingNavigator';
import ComponentTestScreen from './screens/ComponentTestScreen';

// ─── Root Stack ─────────────────────────────────────────────

export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  Tabs: undefined;
  ComponentTest: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ─── Deep linking (web only) ────────────────────────────────

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [],
  config: {
    screens: {
      Auth: {
        screens: {
          Welcome: '',
          Login: 'Login',
          SignUp: 'SignUp',
        },
      },
      Onboarding: {
        screens: {
          ProfileSetup: 'ProfileSetup',
          SportsSelection: 'SportsSelection',
        },
      },
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

// ⚠️ DEV ONLY: set to true to skip auth + onboarding and go straight to Tabs
const DEV_SKIP_AUTH = false;

function AppNavigator() {
  const { session, loading, onboardingCompleted } = useAuth();

  // Initial session check
  if (loading && !DEV_SKIP_AUTH) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Authenticated but still resolving the onboarding flag
  if (session && onboardingCompleted === null && !DEV_SKIP_AUTH) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Decide which root flow to mount
  const flow: 'auth' | 'onboarding' | 'tabs' = DEV_SKIP_AUTH
    ? 'tabs'
    : !session
      ? 'auth'
      : onboardingCompleted
        ? 'tabs'
        : 'onboarding';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {flow === 'auth' && <Stack.Screen name="Auth" component={AuthNavigator} />}
      {flow === 'onboarding' && (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      )}
      {flow === 'tabs' && (
        <>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="ComponentTest" component={ComponentTestScreen} />
        </>
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
