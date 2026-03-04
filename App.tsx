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
import Input from './components/ui/Input';
import Search from './components/ui/Search';
import TextArea from './components/ui/TextArea';
import Tag from './components/ui/Tag';
import Tab from './components/ui/Tab';
import Switch from './components/ui/Switch';
import Levels from './components/ui/Levels';
import Divider from './components/ui/Divider';
import DateCell from './components/ui/DateCell';
import Calendar from './components/ui/Calendar';
import Range from './components/ui/Range';
import ProgressBar from './components/ui/ProgressBar';

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
  const [inputValue, setInputValue] = useState('');
  const [inputFilled, setInputFilled] = useState('Filled text');
  const [searchValue, setSearchValue] = useState('');
  const [searchFilled, setSearchFilled] = useState('Jane Doe');
  const [textAreaValue, setTextAreaValue] = useState('');
  const [textAreaFilled, setTextAreaFilled] = useState('Typed description that wraps to multiple lines in the text area');
  const [tabSelected, setTabSelected] = useState(0);
  const [switchOn, setSwitchOn] = useState(true);
  const [switchOff, setSwitchOff] = useState(false);
  const [calMonth, setCalMonth] = useState(0); // January
  const [calYear, setCalYear] = useState(2024);
  const [calDay, setCalDay] = useState<number | undefined>(1);
  const [rangeLow, setRangeLow] = useState(0);
  const [rangeHigh, setRangeHigh] = useState(100);

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

        {/* ── INPUT ──────────────────────────────── */}

        <Section title="Input">
          <Row label="Enabled (empty)">
            <Input
              placeholder="Enter club name"
              value={inputValue}
              onChangeText={setInputValue}
            />
          </Row>
          <Row label="Filled">
            <Input
              placeholder="Enter club name"
              value={inputFilled}
              onChangeText={setInputFilled}
            />
          </Row>
        </Section>

        {/* ── SEARCH ─────────────────────────────── */}

        <Section title="Search">
          <Row label="Enabled (empty)">
            <Search
              placeholder="Search Members for Admin"
              value={searchValue}
              onChangeText={setSearchValue}
            />
          </Row>
          <Row label="Filled">
            <Search
              placeholder="Search Members for Admin"
              value={searchFilled}
              onChangeText={setSearchFilled}
            />
          </Row>
          <Row label="Without icon">
            <Search
              placeholder="Search"
              showIcon={false}
            />
          </Row>
        </Section>

        {/* ── TEXT AREA ──────────────────────────── */}

        <Section title="Text Area">
          <Row label="Enabled (empty)">
            <TextArea
              placeholder="Add your description"
              value={textAreaValue}
              onChangeText={setTextAreaValue}
            />
          </Row>
          <Row label="Filled">
            <TextArea
              placeholder="Add your description"
              value={textAreaFilled}
              onChangeText={setTextAreaFilled}
            />
          </Row>
          <Row label="Without icon">
            <TextArea
              placeholder="Add your description"
              showIcon={false}
            />
          </Row>
        </Section>

        {/* ── TAG ────────────────────────────────── */}

        <Section title="Tag">
          <Row label="Lg — Selected / Unselected">
            <Tag label="Football" selected size="Lg" />
            <Tag label="Basketball" size="Lg" />
          </Row>
          <Row label="Sm — Selected / Unselected">
            <Tag label="Beginner" selected size="Sm" />
            <Tag label="Intermediate" size="Sm" />
            <Tag label="Advanced" size="Sm" />
          </Row>
        </Section>

        {/* ── TAB ────────────────────────────────── */}

        <Section title="Tab">
          <Row label="2 items">
            <Tab
              items={['Upcoming', 'Past']}
              selected={tabSelected}
              onSelect={setTabSelected}
            />
          </Row>
          <Row label="3 items">
            <Tab
              items={['Events', 'Members', 'About']}
              selected={tabSelected % 3}
              onSelect={setTabSelected}
            />
          </Row>
        </Section>

        {/* ── SWITCH ─────────────────────────────── */}

        <Section title="Switch">
          <Row label="On">
            <Switch value={switchOn} onToggle={setSwitchOn} />
          </Row>
          <Row label="Off">
            <Switch value={switchOff} onToggle={setSwitchOff} />
          </Row>
        </Section>

        {/* ── DIVIDER ─────────────────────────────── */}

        <Section title="Divider">
          <Row label="Subtle (default)">
            <Divider />
          </Row>
          <Row label="Bold">
            <Divider emphasis="Bold" />
          </Row>
        </Section>

        {/* ── DATE CELL ──────────────────────────── */}

        <Section title="DateCell">
          <Row label="Unselected / Selected / Today / Events">
            <DateCell day={5} />
            <DateCell day={12} selected />
            <DateCell day={18} today />
            <DateCell day={25} events />
          </Row>
          <Row label="Selected + Today + Events">
            <DateCell day={1} selected today events />
          </Row>
        </Section>

        {/* ── CALENDAR ──────────────────────────── */}

        <Section title="Calendar">
          <Calendar
            year={calYear}
            month={calMonth}
            selectedDay={calDay}
            todayDay={18}
            eventDays={[5, 12, 18, 25]}
            onSelectDay={setCalDay}
            onPrevMonth={() => {
              if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
              else setCalMonth(calMonth - 1);
            }}
            onNextMonth={() => {
              if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
              else setCalMonth(calMonth + 1);
            }}
          />
        </Section>

        {/* ── RANGE ─────────────────────────────── */}

        <Section title="Range">
          <Row label={`Low: $${rangeLow}  —  High: $${rangeHigh}`}>
            <Range
              min={0}
              max={100}
              low={rangeLow}
              high={rangeHigh}
              onChangeRange={([lo, hi]) => { setRangeLow(lo); setRangeHigh(hi); }}
            />
          </Row>
        </Section>

        {/* ── PROGRESS BAR ──────────────────────── */}

        <Section title="Progress Bar">
          <Row label="0%">
            <ProgressBar progress={0} />
          </Row>
          <Row label="25%">
            <ProgressBar progress={0.25} />
          </Row>
          <Row label="60%">
            <ProgressBar progress={0.6} />
          </Row>
          <Row label="100%">
            <ProgressBar progress={1} />
          </Row>
        </Section>

        {/* ── LEVELS ──────────────────────────────── */}

        <Section title="Levels">
          <Row label="Indicator = Item 1 (Beginner)">
            <Levels indicator={1} />
          </Row>
          <Row label="Indicator = Item 3 (Intermediate)">
            <Levels indicator={3} />
          </Row>
          <Row label="Indicator = Item 5 (Advanced)">
            <Levels indicator={5} />
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
