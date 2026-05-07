/**
 * SignUpEmailScreen — magic-link email sign-up
 *
 * Two states:
 *   1. Email entry — "Let's get started" → Sign Up button
 *   2. Email sent — "Tab the link in your email to complete sign up." → Check Your Inbox button
 *
 * After magic-link confirmation, the user lands authenticated; the app's
 * onboarding gate then routes them through ProfileSetup → SportsSelection.
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
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Button, Input } from '../components/ui';
import { supabase } from '../lib/supabase';
import { validateEmail } from '../lib/validation';

export default function SignUpEmailScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
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
          <Text style={styles.title}>Let's get started</Text>
          <Text style={styles.subtitle}>
            {sent
              ? 'Tab the link in your email to complete sign up.'
              : 'Enter your email. We will send you confirmation email.'}
          </Text>
        </View>

        <View style={styles.inputGroup}>
          {!sent && (
            <Input
              size="Md"
              placeholder="Sign Up with Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              returnKeyType="go"
              onSubmitEditing={handleSendMagicLink}
            />
          )}

          {sent ? (
            <Input
              size="Md"
              value={email.trim().toLowerCase()}
              editable={false}
            />
          ) : null}

          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkRow}>
              Already have an account?{' '}
              <Text style={styles.linkAction}>Log In</Text>
            </Text>
          </Pressable>
        </View>

        <View style={styles.ctaGroup}>
          <Button
            emphasis="Bold"
            label={sent ? 'Check Your Inbox' : 'Sign Up'}
            state={loading ? 'Loading' : 'Enabled'}
            onPress={sent ? undefined : handleSendMagicLink}
            disabled={sent}
          />
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
    paddingTop: spacer['24'],
    paddingHorizontal: spacer['24'],
    paddingBottom: spacer['48'],
    gap: spacer['24'],
  },

  headerGroup: {
    gap: spacer['16'],
  },

  title: {
    ...textStyles.headline02Medium,
    color: colors.text.bold,
  },

  subtitle: {
    ...textStyles.title01Light,
    color: colors.text.subtle,
  },

  inputGroup: {
    gap: spacer['12'],
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
  },
});
