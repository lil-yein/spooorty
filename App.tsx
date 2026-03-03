/**
 * Component Test Screen — renders all Button, Avatar, and BottomNav variants
 * Remove this file before production. Replace with expo-router entry.
 */

import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import Button from './components/ui/Button';
import Avatar from './components/ui/Avatar';
import AvatarGroup from './components/ui/AvatarGroup';
import BottomNav from './components/ui/BottomNav';

import { colors } from './lib/tokens/colors';
import { spacer } from './lib/tokens/spacing';
import { textStyles } from './lib/tokens/textStyles';

// ─── Section header ──────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.row}>
      {label && <Text style={sectionStyles.label}>{label}</Text>}
      <View style={sectionStyles.rowContent}>{children}</View>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: {
    marginBottom: spacer['32'],
    paddingHorizontal: spacer['16'],
  },
  title: {
    ...textStyles.title01Medium,
    color: colors.text.bold,
    marginBottom: spacer['16'],
  },
  row: {
    marginBottom: spacer['12'],
  },
  label: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
    marginBottom: spacer['8'],
  },
  rowContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacer['8'],
  },
});

// ─── Main App ────────────────────────────────────────────

export default function App() {
  const [selectedTab, setSelectedTab] = useState<0 | 1 | 2 | 3>(0);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.pageTitle}>Component Test</Text>

        {/* ── BUTTON ──────────────────────────────── */}

        <Section title="Button">
          <Row label="Bold / Medium + Trailing Arrow Icon">
            <Button
              emphasis="Bold"
              textStyle="Medium"
              label="Join Club"
              trailingIcon={({ color, size }) => <Ionicons name="arrow-forward" color={color} size={size} />}
            />
          </Row>
          <Row label="Bold / Light">
            <Button emphasis="Bold" textStyle="Light" label="Share" />
          </Row>
          <Row label="Subtle / Medium + Trailing Arrow Icon">
            <Button
              emphasis="Subtle"
              textStyle="Medium"
              label="Join Club"
              trailingIcon={({ color, size }) => <Ionicons name="arrow-forward" color={color} size={size} />}
            />
          </Row>
          <Row label="Subtle / Light + Trailing Share Icon">
            <Button
              emphasis="Subtle"
              textStyle="Light"
              label="Share"
              trailingIcon={({ color, size }) => <Ionicons name="share-outline" color={color} size={size} />}
            />
          </Row>
          <Row label="Minimal / Medium">
            <Button emphasis="Minimal" textStyle="Medium" label="Share" />
          </Row>
          <Row label="Minimal / Light + Trailing Share Icon">
            <Button
              emphasis="Minimal"
              textStyle="Light"
              label="Share"
              trailingIcon={({ color, size }) => <Ionicons name="share-outline" color={color} size={size} />}
            />
          </Row>
          <Row label="State: Loading">
            <Button emphasis="Bold" state="Loading" label="Loading..." />
            <Button emphasis="Subtle" state="Loading" label="Loading..." />
          </Row>
          <Row label="State: Disabled">
            <Button emphasis="Bold" disabled label="Disabled" />
            <Button emphasis="Subtle" disabled label="Disabled" />
            <Button emphasis="Minimal" disabled label="Disabled" />
          </Row>
          <Row label="With Leading Icon">
            <Button
              emphasis="Bold"
              label="Create Club"
              leadingIcon={({ color, size }) => <Ionicons name="add" color={color} size={size} />}
            />
          </Row>
          <Row label="Icon Only — Md">
            <Button
              emphasis="Bold"
              content="Icon"
              size="Md"
              icon={({ color, size }) => <Ionicons name="add" color={color} size={size} />}
            />
            <Button
              emphasis="Subtle"
              content="Icon"
              size="Md"
              icon={({ color, size }) => <Ionicons name="add" color={color} size={size} />}
            />
            <Button
              emphasis="Minimal"
              content="Icon"
              size="Md"
              icon={({ color, size }) => <Ionicons name="add" color={color} size={size} />}
            />
          </Row>
          <Row label="Icon Only — Sm">
            <Button
              emphasis="Bold"
              content="Icon"
              size="Sm"
              icon={({ color, size }) => <Ionicons name="add" color={color} size={size} />}
            />
            <Button
              emphasis="Subtle"
              content="Icon"
              size="Sm"
              icon={({ color, size }) => <Ionicons name="add" color={color} size={size} />}
            />
          </Row>
        </Section>

        {/* ── AVATAR ──────────────────────────────── */}

        <Section title="Avatar">
          <Row label="Text — All Sizes (Xs 16, Sm 24, Md 36, Lg 48, Xl 140)">
            <Avatar type="Text" size="Xs" label="AB" />
            <Avatar type="Text" size="Sm" label="AB" />
            <Avatar type="Text" size="Md" label="AB" />
            <Avatar type="Text" size="Lg" label="AB" />
            <Avatar type="Text" size="Xl" label="AB" />
          </Row>
          <Row label="Image — SVG mask shape (no source = placeholder)">
            <Avatar type="Image" size="Xs" />
            <Avatar type="Image" size="Sm" />
            <Avatar type="Image" size="Md" />
            <Avatar type="Image" size="Lg" />
            <Avatar type="Image" size="Xl" />
          </Row>
          <Row label="Image — with remote source (SVG masked)">
            <Avatar
              type="Image"
              size="Xl"
              source={{ uri: 'https://i.pravatar.cc/280' }}
            />
            <Avatar
              type="Image"
              size="Lg"
              source={{ uri: 'https://i.pravatar.cc/96' }}
            />
            <Avatar
              type="Image"
              size="Md"
              source={{ uri: 'https://i.pravatar.cc/72' }}
            />
            <Avatar
              type="Image"
              size="Sm"
              source={{ uri: 'https://i.pravatar.cc/48' }}
            />
          </Row>
          <Row label="With +a badge">
            <Avatar
              type="Image"
              size="Lg"
              source={{ uri: 'https://i.pravatar.cc/96' }}
              showCount
              count={3}
            />
            <Avatar
              type="Image"
              size="Md"
              source={{ uri: 'https://i.pravatar.cc/72' }}
              showCount
              count={5}
            />
            <Avatar type="Text" size="Lg" label="AB" showCount count={2} />
          </Row>
        </Section>

        {/* ── AVATAR GROUP ───────────────────────── */}

        <Section title="Avatar Group">
          <Row label="2 avatars (Sm)">
            <AvatarGroup
              avatars={[
                { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=1' } },
                { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=2' } },
              ]}
            />
          </Row>
          <Row label="4 avatars (Sm)">
            <AvatarGroup
              avatars={[
                { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=3' } },
                { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=4' } },
                { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=5' } },
                { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=6' } },
              ]}
            />
          </Row>
          <Row label="6 avatars, max 3 (Sm — shows +3)">
            <AvatarGroup
              max={3}
              avatars={[
                { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=7' } },
                { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=8' } },
                { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=9' } },
                { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=10' } },
                { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=11' } },
                { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=12' } },
              ]}
            />
          </Row>
          <Row label="Mixed types (Md)">
            <AvatarGroup
              size="Md"
              avatars={[
                { type: 'Image', source: { uri: 'https://i.pravatar.cc/72?img=13' } },
                { type: 'Text', label: 'JK' },
                { type: 'Image', source: { uri: 'https://i.pravatar.cc/72?img=14' } },
              ]}
            />
          </Row>
          <Row label="Text only (Sm)">
            <AvatarGroup
              avatars={[
                { type: 'Text', label: 'AB' },
                { type: 'Text', label: 'CD' },
                { type: 'Text', label: 'EF' },
              ]}
            />
          </Row>
        </Section>

        {/* ── BOTTOM NAV ──────────────────────────── */}

        <Section title="Bottom Nav">
          <Row label="Tap icons below — color changes only, no fill/bar">
            <Text style={{ ...textStyles.body03Light, color: colors.text.subtle }}>
              Selected tab: {selectedTab}
            </Text>
          </Row>
        </Section>

        {/* Extra space so content isn't hidden behind BottomNav */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* BottomNav is absolute positioned at bottom */}
      <BottomNav
        selected={selectedTab}
        onSelect={(index) => setSelectedTab(index)}
      />
    </SafeAreaView>
  );
}

// ─── Root Styles ─────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface.bold,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacer['16'],
    paddingBottom: spacer['48'],
  },
  pageTitle: {
    ...textStyles.headline02Medium,
    color: colors.text.bold,
    paddingHorizontal: spacer['16'],
    marginBottom: spacer['24'],
  },
});
