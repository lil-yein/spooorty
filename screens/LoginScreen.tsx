/**
 * LoginScreen — email magic link + Apple Sign-In authentication
 *
 * Figma ref: node 3320-16426
 *
 * Layout:
 *   surface/bold bg, content vertically centered
 *   Header group: "Spooorty" (headline01Medium) + subtitle (title01Light, text/subtle)
 *     gap spacer/16 between logo and subtitle
 *   Input group: Input Md "Enter your email" + Button Bold "Continue with Email"
 *                + Apple Sign-In button (iOS only) + terms
 *     gap spacer/16 between items
 *   gap spacer/24 between header group and input group
 *
 * Three states:
 *   1. Enter email / sign in → sends magic link or Apple auth
 *   2. Check your email confirmation (magic link sent)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Button, Icon, Input } from '../components/ui';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { validateEmail } from '../lib/validation';

export default function LoginScreen() {
  const { signInWithApple } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendMagicLink = async () => {
    const trimmed = email.trim().toLowerCase();
    const emailError = validateEmail(trimmed);
    if (emailError) {
      Alert.alert('Invalid Email', emailError);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setSent(true);
    }
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    const { error } = await signInWithApple();
    setAppleLoading(false);

    if (error) {
      Alert.alert('Apple Sign-In', error);
    }
    // On success, AuthContext updates session → App.tsx navigates away
  };

  // ─── "Check your email" state ──────────────────────────────

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.sentContent}>
          {/* Header + description */}
          <View style={styles.headerGroup}>
            <Text style={styles.logo}>Check your{'\n'}email</Text>
            <View>
              <Text style={styles.subtitle}>We sent magic link to </Text>
              <Text style={styles.emailHighlight}>{email.trim().toLowerCase()}</Text>
              <Text style={styles.subtitle}>
                Tab the link in your email to complete sign up.
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.inputGroup}>
            <Button
              emphasis="Bold"
              label="Resend Link"
              state={loading ? 'Loading' : 'Enabled'}
              onPress={handleSendMagicLink}
            />
            <Button
              emphasis="Subtle"
              label="Use Different Email"
              onPress={() => {
                setSent(false);
                setEmail('');
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  // ─── Email entry state ─────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Header + description */}
        <View style={styles.headerGroup}>
          <Text style={styles.logo}>Spooorty</Text>
          <Text style={styles.subtitle}>
            Find your people.{'\n'}Play your sport.
          </Text>
        </View>

        {/* Input + buttons + terms */}
        <View style={styles.inputGroup}>
          <Input
            size="Md"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="go"
            onSubmitEditing={handleSendMagicLink}
          />

          <Button
            emphasis="Bold"
            label="Continue with Email"
            state={loading ? 'Loading' : 'Enabled'}
            leadingIcon={({ color, size }) => (
              <Icon type="mail" size={size} color={color} />
            )}
            onPress={handleSendMagicLink}
          />

          {/* Apple Sign-In — iOS only */}
          {Platform.OS === 'ios' && (
            <>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <Button
                emphasis="Subtle"
                label="Continue with Apple"
                state={appleLoading ? 'Loading' : 'Enabled'}
                leadingIcon={({ color, size }) => (
                  <Icon type="apple" size={size} color={color} />
                )}
                onPress={handleAppleSignIn}
              />
            </>
          )}

          <Text style={styles.terms}>
            {"By continuing, you agree to Spooorty's"}{'\n'}
            Terms of Service and Privacy Policy.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ─────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.bold,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacer['24'],
    gap: spacer['24'],
  },

  // ── Header group ──

  headerGroup: {
    gap: spacer['16'],
  },

  logo: {
    ...textStyles.headline01Medium,
    color: colors.text.bold,
  },

  subtitle: {
    ...textStyles.title01Light,
    color: colors.text.subtle,
  },

  // ── Input group ──

  inputGroup: {
    gap: spacer['16'],
  },

  // ── Divider row ("or") ──

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['12'],
  },

  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: colors.border.subtle,
  },

  dividerText: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
  },

  terms: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
    textAlign: 'center',
  },

  // ── Sent state ──

  sentContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacer['24'],
    gap: spacer['48'],
  },

  emailHighlight: {
    ...textStyles.title01Light,
    color: colors.text.bold,
  },
});
