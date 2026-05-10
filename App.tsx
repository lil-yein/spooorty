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
import { Platform, ActivityIndicator, View, Text } from 'react-native';
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
//
// Only one root stack (Auth / Onboarding / Tabs) is mounted at a time, so
// both `Welcome` and `DiscoverHome` can legitimately live at "/" — but
// react-navigation's linking config is validated up-front and treats two
// screens claiming the same path as ambiguous. We pick the *currently
// mounted* root's linking shape at render time instead of declaring all
// three statically.

type LinkingKind = 'auth' | 'onboarding' | 'tabs';

function buildLinking(kind: LinkingKind): LinkingOptions<RootStackParamList> {
  if (kind === 'auth') {
    return {
      prefixes: [],
      config: {
        screens: {
          Auth: {
            screens: {
              Welcome: '',
              Login: 'login',
              SignUp: 'signup',
            },
          },
        },
      },
    };
  }
  if (kind === 'onboarding') {
    return {
      prefixes: [],
      config: {
        screens: {
          Onboarding: {
            screens: {
              ProfileSetup: '',
              SportsSelection: 'sports',
            },
          },
        },
      },
    };
  }
  // Tabs
  return {
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
                EditProfile: 'Profile/Edit',
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
}

// ⚠️ DEV ONLY: set to true to skip auth + onboarding and go straight to Tabs
const DEV_SKIP_AUTH = false;

// ─── Error boundary ────────────────────────────────────────
// Surfaces render-time errors instead of leaving a blank screen.

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: any) {
    // Log to the browser console with full stack so we can debug
    // eslint-disable-next-line no-console
    console.error('[AppErrorBoundary]', error.message, error.stack, info);
  }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
            Something went wrong
          </Text>
          <Text style={{ fontSize: 14, color: '#666' }}>
            {this.state.error.message}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

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
  const flow: LinkingKind = DEV_SKIP_AUTH
    ? 'tabs'
    : !session
      ? 'auth'
      : onboardingCompleted
        ? 'tabs'
        : 'onboarding';

  // Re-key the NavigationContainer when the flow changes so the linking
  // config is re-applied. Without this, the linking config picked at first
  // mount would persist even after sign-in/out.
  return (
    <NavigationContainer
      key={flow}
      linking={Platform.OS === 'web' ? buildLinking(flow) : undefined}
    >
      <StatusBar style="dark" />
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
    </NavigationContainer>
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
    <AppErrorBoundary>
      <AuthProvider>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </AuthProvider>
    </AppErrorBoundary>
  );
}
