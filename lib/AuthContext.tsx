/**
 * AuthContext — provides auth state to the entire app
 *
 * Wraps children in a context that provides:
 *   - session: the current Supabase session (null if logged out)
 *   - user: the current user object (null if logged out)
 *   - loading: true while checking initial session
 *   - signOut: function to sign out
 *   - signInWithApple: function to sign in with Apple
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import type { Session, User } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithApple: () => Promise<{ error?: string }>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  signInWithApple: async () => ({}),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  /**
   * Apple Sign-In flow:
   * 1. Generate a random nonce for security
   * 2. Request Apple credential with the nonce
   * 3. Send the Apple ID token to Supabase for verification
   * 4. Supabase creates/links the user and returns a session
   *
   * Note: Only works on iOS native. On web/Android, returns an error message.
   */
  const signInWithApple = async (): Promise<{ error?: string }> => {
    if (Platform.OS !== 'ios') {
      return { error: 'Apple Sign-In is only available on iOS' };
    }

    try {
      // Check if Apple Sign-In is available on this device
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        return { error: 'Apple Sign-In is not available on this device' };
      }

      // Generate a random nonce — prevents replay attacks
      const rawNonce = Crypto.randomUUID();
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawNonce,
      );

      // Request Apple credential
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      if (!credential.identityToken) {
        return { error: 'No identity token returned from Apple' };
      }

      // Exchange Apple token for a Supabase session
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
        nonce: rawNonce, // Supabase verifies this against the hashed nonce in the token
      });

      if (error) {
        return { error: error.message };
      }

      // If Apple provided a display name (first sign-in only), update user profile
      if (credential.fullName?.givenName) {
        const displayName = [
          credential.fullName.givenName,
          credential.fullName.familyName,
        ]
          .filter(Boolean)
          .join(' ');

        // Update Supabase user metadata + public profile
        await supabase.auth.updateUser({
          data: { display_name: displayName },
        });
      }

      return {};
    } catch (err: any) {
      // User cancelled the Apple Sign-In dialog
      if (err.code === 'ERR_REQUEST_CANCELED') {
        return {}; // Not an error — user just dismissed the dialog
      }
      return { error: err.message ?? 'Apple Sign-In failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        signOut,
        signInWithApple,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
