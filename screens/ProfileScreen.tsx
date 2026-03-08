import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/ui/Button';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Your account and settings</Text>

        {/* Dev shortcut to component test screen */}
        <View style={styles.devSection}>
          <Text style={styles.devLabel}>Developer</Text>
          <Button
            emphasis="Subtle"
            textStyle="Light"
            label="Component Test"
            onPress={() => navigation.navigate('ComponentTest')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.bold },
  content: {
    paddingTop: spacer['64'],
    paddingHorizontal: spacer['16'],
    paddingBottom: spacer['96'],
  },
  title: {
    ...textStyles.headline02Medium,
    color: colors.text.bold,
    marginBottom: spacer['8'],
  },
  subtitle: {
    ...textStyles.body01Light,
    color: colors.text.subtle,
    marginBottom: spacer['48'],
  },
  devSection: {
    gap: spacer['12'],
  },
  devLabel: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
  },
});
