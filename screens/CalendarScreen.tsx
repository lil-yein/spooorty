import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Calendar</Text>
        <Text style={styles.subtitle}>Your upcoming events</Text>
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
  },
});
