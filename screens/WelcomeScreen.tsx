/**
 * WelcomeScreen — entry point of the auth flow
 *
 * Layout:
 *   Hero image fills the full screen (100% height & width) as background
 *   Title group at top: "Spooorty" + tagline "Find your people. Play your sport."
 *     gap spacer/16 between title and tagline
 *     content paddingTop spacer/64
 *   Buttons at bottom (side-by-side):
 *     "Log In"  → Bold   (black bg, white text) — primary CTA for returning users
 *     "Sign Up" → Subtle (white bg, black text)
 *     gap spacer/16 between buttons
 *     content paddingBottom spacer/64
 *
 * Routes:
 *   Log In  → LoginScreen
 *   Sign Up → SignUpEmailScreen
 */

import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Button } from '../components/ui';

const HERO = require('../assets/images/onboarding-hero.png');

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <ImageBackground source={HERO} style={styles.hero} resizeMode="cover">
        <View style={styles.content}>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>Spooorty</Text>
            <Text style={styles.tagline}>
              Find your people.{'\n'}Play your sport.
            </Text>
          </View>

          <View style={styles.buttons}>
            <View style={styles.buttonHalf}>
              <Button
                emphasis="Bold"
                label="Log In"
                onPress={() => navigation.navigate('Login')}
              />
            </View>
            <View style={styles.buttonHalf}>
              <Button
                emphasis="Subtle"
                label="Sign Up"
                onPress={() => navigation.navigate('SignUp')}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.bold,
  },

  hero: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: spacer['64'],
    paddingHorizontal: spacer['24'],
    paddingBottom: spacer['64'],
  },

  titleGroup: {
    gap: spacer['16'],
  },

  title: {
    ...textStyles.headline01Medium,
    color: '#FFFFFF',
  },

  tagline: {
    ...textStyles.title01Light,
    color: '#FFFFFF',
  },

  buttons: {
    flexDirection: 'row',
    gap: spacer['16'],
  },

  buttonHalf: {
    flex: 1,
  },
});
