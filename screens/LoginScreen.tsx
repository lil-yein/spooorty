/**
 * LoginScreen — "Welcome back" magic-link sign-in
 *
 * Two states:
 *   1. Email entry — "Welcome back" title + email input → Log In button
 *   2. Email sent — email locked in input → Check Your Inbox button
 *
 * Apple Sign-In (iOS only) is offered as an alternative below the divider.
 *
 * Layout matches SignUpEmailScreen so the auth flow feels consistent.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer, borderWidth } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Button, Icon, Input } from '../components/ui';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { validateEmail } from '../lib/validation';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { signInWithApple } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendMagicLink = async () => {
    const trimmed = email.trim().toLowerCase();
    const emailError = validateEmail(trimmed);
    if (emailError) {
      showError('Invalid Email', emailError);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email: trimmed });
    setLoading(false);

    if (error) {
      showError('Could not send magic link', error.message);
    } else {
      setSent(true);
    }
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    const { error } = await signInWithApple();
    setAppleLoading(false);

    if (error) {
      showError('Apple Sign-In', error);
    }
  };

  /** Alert.alert is unreliable on web — fall through to window.alert too. */
  const showError = (title: string, msg: string) => {
    Alert.alert(title, msg);
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(`${title}: ${msg}`);
    }
  };

  // ─── Render ─────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.headerGroup}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in quickly with your email.{'\n'}No password needed.
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Input
            size="Md"
            placeholder="Log in with Email"
            value={email}
            onChangeText={setEmail}
            editable={!sent}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="go"
            onSubmitEditing={handleSendMagicLink}
          />

          <Pressable onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.linkRow}>
              Don't have an account?{' '}
              <Text style={styles.linkAction}>Sign Up</Text>
            </Text>
          </Pressable>
        </View>

        <View style={styles.ctaGroup}>
          <Button
            emphasis="Bold"
            label={sent ? 'Check Your Inbox' : 'Log In'}
            state={loading ? 'Loading' : 'Enabled'}
            onPress={sent ? undefined : handleSendMagicLink}
            disabled={sent}
          />

          {/* Apple Sign-In — iOS only, hidden in sent state */}
          {Platform.OS === 'ios' && !sent && (
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
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.bold,
  },

  content: {
    flex: 1,
    paddingTop: spacer['64'],
    paddingHorizontal: spacer['24'],
    paddingBottom: spacer['64'],
    gap: spacer['24'],
  },

  headerGroup: {
    gap: spacer['16'],
  },

  title: {
    ...textStyles.headline01Medium,
    color: colors.text.bold,
  },

  subtitle: {
    ...textStyles.title01Light,
    color: colors.text.subtle,
  },

  inputGroup: {
    gap: spacer['16'],
  },

  linkRow: {
    ...textStyles.body02Light,
    color: colors.text.subtle,
  },

  linkAction: {
    ...textStyles.body02Medium,
    color: colors.text.bold,
  },

  ctaGroup: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: spacer['16'],
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['12'],
  },

  dividerLine: {
    flex: 1,
    height: borderWidth.regular,
    backgroundColor: colors.border.subtle,
  },

  dividerText: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
  },
});
