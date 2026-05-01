/**
 * WelcomeScreen — entry point of the auth flow
 *
 * Layout:
 *   Full-bleed hero image (sports photo) as background
 *   Title group at top: "Spooorty" + tagline "Find your people. Play your sport."
 *   Buttons at bottom (side-by-side): "Log In" (Subtle), "Sign Up" (Bold)
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
        {/* Subtle dark scrim so the title reads cleanly over photography */}
        <View style={styles.overlay} />

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
                emphasis="Subtle"
                label="Log In"
                onPress={() => navigation.navigate('Login')}
              />
            </View>
            <View style={styles.buttonHalf}>
              <Button
                emphasis="Bold"
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
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: spacer['24'],
    paddingHorizontal: spacer['24'],
    paddingBottom: spacer['48'],
  },

  titleGroup: {
    gap: spacer['8'],
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
    gap: spacer['12'],
  },

  buttonHalf: {
    flex: 1,
  },
});
