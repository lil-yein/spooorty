/**
 * Component Test Screen — renders all UI component variants
 * Accessible via Profile → "Component Test" button (dev shortcut)
 */

import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../components/ui/Icon';

import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import AvatarGroup from '../components/ui/AvatarGroup';
import Input from '../components/ui/Input';
import Search from '../components/ui/Search';
import TextArea from '../components/ui/TextArea';
import Tag from '../components/ui/Tag';
import Tab from '../components/ui/Tab';
import Switch from '../components/ui/Switch';
import Levels from '../components/ui/Levels';
import Divider from '../components/ui/Divider';
import DateCell from '../components/ui/DateCell';
import Calendar from '../components/ui/Calendar';
import Range from '../components/ui/Range';
import ProgressBar from '../components/ui/ProgressBar';
import BottomAction from '../components/ui/BottomAction';
import Overlay from '../components/ui/Overlay';
import ColorPicker from '../components/ui/ColorPicker';
import MembersItem from '../components/ui/MembersItem';
import LocationItem from '../components/ui/LocationItem';
import NotificationItem from '../components/ui/NotificationItem';
import SearchContentItem from '../components/ui/SearchContentItem';
import ButtonMultiSelect from '../components/ui/ButtonMultiSelect';
import ButtonSelect from '../components/ui/ButtonSelect';

import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';

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

// ─── Component Test Screen ────────────────────────────────

export default function ComponentTestScreen() {
  const navigation = useNavigation();

  const [inputValue, setInputValue] = useState('');
  const [inputFilled, setInputFilled] = useState('Filled text');
  const [searchValue, setSearchValue] = useState('');
  const [searchFilled, setSearchFilled] = useState('Jane Doe');
  const [textAreaValue, setTextAreaValue] = useState('');
  const [textAreaFilled, setTextAreaFilled] = useState('Typed description that wraps to multiple lines in the text area');
  const [tabSelected, setTabSelected] = useState(0);
  const [switchOn, setSwitchOn] = useState(true);
  const [switchOff, setSwitchOff] = useState(false);
  const [calMonth, setCalMonth] = useState(0);
  const [calYear, setCalYear] = useState(2024);
  const [calDay, setCalDay] = useState<number | undefined>(1);
  const [rangeLow, setRangeLow] = useState(0);
  const [rangeHigh, setRangeHigh] = useState(100);
  const [showOverlay, setShowOverlay] = useState<'dark' | 'blur' | null>(null);
  const [pickerHue, setPickerHue] = useState(0);
  const [searchSelected, setSearchSelected] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(['Football', 'Beginner']));
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set(['Gantry Park Handball Court']));
  const [multiSelected, setMultiSelected] = useState<number[]>([0]);
  const [singleSelected, setSingleSelected] = useState(0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Back button */}
        <View style={styles.header}>
          <Button
            emphasis="Subtle"
            content="Icon"
            size="Sm"
            icon={({ color, size }) => <Icon type="arrow backward" color={color} size={size} />}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.pageTitle}>Component Test</Text>
        </View>

        {/* ── BUTTON ──────────────────────────────── */}

        <Section title="Button">
          <Row label="Bold / Medium + Trailing Arrow Icon">
            <Button
              emphasis="Bold"
              textStyle="Medium"
              label="Join Club"
              trailingIcon={({ color, size }) => <Icon type="arrow forward" color={color} size={size} />}
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
              trailingIcon={({ color, size }) => <Icon type="arrow forward" color={color} size={size} />}
            />
          </Row>
          <Row label="Subtle / Light + Trailing Share Icon">
            <Button
              emphasis="Subtle"
              textStyle="Light"
              label="Share"
              trailingIcon={({ color, size }) => <Icon type="share" color={color} size={size} />}
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
              trailingIcon={({ color, size }) => <Icon type="share" color={color} size={size} />}
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
              leadingIcon={({ color, size }) => <Icon type="add" color={color} size={size} />}
            />
          </Row>
          <Row label="Icon Only — Md">
            <Button emphasis="Bold" content="Icon" size="Md" icon={({ color, size }) => <Icon type="add" color={color} size={size} />} />
            <Button emphasis="Subtle" content="Icon" size="Md" icon={({ color, size }) => <Icon type="add" color={color} size={size} />} />
            <Button emphasis="Minimal" content="Icon" size="Md" icon={({ color, size }) => <Icon type="add" color={color} size={size} />} />
          </Row>
          <Row label="Icon Only — Sm">
            <Button emphasis="Bold" content="Icon" size="Sm" icon={({ color, size }) => <Icon type="add" color={color} size={size} />} />
            <Button emphasis="Subtle" content="Icon" size="Sm" icon={({ color, size }) => <Icon type="add" color={color} size={size} />} />
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
            <Avatar type="Image" size="Xl" source={{ uri: 'https://i.pravatar.cc/280' }} />
            <Avatar type="Image" size="Lg" source={{ uri: 'https://i.pravatar.cc/96' }} />
            <Avatar type="Image" size="Md" source={{ uri: 'https://i.pravatar.cc/72' }} />
            <Avatar type="Image" size="Sm" source={{ uri: 'https://i.pravatar.cc/48' }} />
          </Row>
          <Row label="With +a badge">
            <Avatar type="Image" size="Lg" source={{ uri: 'https://i.pravatar.cc/96' }} showCount count={3} />
            <Avatar type="Image" size="Md" source={{ uri: 'https://i.pravatar.cc/72' }} showCount count={5} />
            <Avatar type="Text" size="Lg" label="AB" showCount count={2} />
          </Row>
        </Section>

        {/* ── AVATAR GROUP ───────────────────────── */}

        <Section title="Avatar Group">
          <Row label="2 avatars (Sm)">
            <AvatarGroup avatars={[
              { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=1' } },
              { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=2' } },
            ]} />
          </Row>
          <Row label="4 avatars (Sm)">
            <AvatarGroup avatars={[
              { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=3' } },
              { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=4' } },
              { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=5' } },
              { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=6' } },
            ]} />
          </Row>
          <Row label="6 avatars, max 3 (Sm — shows +3)">
            <AvatarGroup max={3} avatars={[
              { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=7' } },
              { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=8' } },
              { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=9' } },
              { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=10' } },
              { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=11' } },
              { type: 'Image', source: { uri: 'https://i.pravatar.cc/48?img=12' } },
            ]} />
          </Row>
        </Section>

        {/* ── INPUT ──────────────────────────────── */}

        <Section title="Input">
          <Row label="Enabled (empty)">
            <Input placeholder="Enter club name" value={inputValue} onChangeText={setInputValue} />
          </Row>
          <Row label="Filled">
            <Input placeholder="Enter club name" value={inputFilled} onChangeText={setInputFilled} />
          </Row>
        </Section>

        {/* ── SEARCH ─────────────────────────────── */}

        <Section title="Search">
          <Row label="Enabled (empty)">
            <Search placeholder="Search Members for Admin" value={searchValue} onChangeText={setSearchValue} />
          </Row>
          <Row label="Filled">
            <Search placeholder="Search Members for Admin" value={searchFilled} onChangeText={setSearchFilled} />
          </Row>
        </Section>

        {/* ── TEXT AREA ──────────────────────────── */}

        <Section title="Text Area">
          <Row label="Enabled (empty)">
            <TextArea placeholder="Add your description" value={textAreaValue} onChangeText={setTextAreaValue} />
          </Row>
          <Row label="Filled">
            <TextArea placeholder="Add your description" value={textAreaFilled} onChangeText={setTextAreaFilled} />
          </Row>
        </Section>

        {/* ── TAG ────────────────────────────────── */}

        <Section title="Tag">
          <Row label="Lg — Tap to toggle">
            {['Football', 'Basketball'].map((t) => (
              <Tag key={t} label={t} size="Lg" selected={selectedTags.has(t)} onPress={() => {
                setSelectedTags((prev) => { const next = new Set(prev); next.has(t) ? next.delete(t) : next.add(t); return next; });
              }} />
            ))}
          </Row>
          <Row label="Sm — Tap to toggle">
            {['Beginner', 'Intermediate', 'Advanced'].map((t) => (
              <Tag key={t} label={t} size="Sm" selected={selectedTags.has(t)} onPress={() => {
                setSelectedTags((prev) => { const next = new Set(prev); next.has(t) ? next.delete(t) : next.add(t); return next; });
              }} />
            ))}
          </Row>
        </Section>

        {/* ── TAB ────────────────────────────────── */}

        <Section title="Tab">
          <Row label="2 items">
            <Tab items={['Upcoming', 'Past']} selected={tabSelected} onSelect={setTabSelected} />
          </Row>
          <Row label="3 items">
            <Tab items={['Events', 'Members', 'About']} selected={tabSelected % 3} onSelect={setTabSelected} />
          </Row>
        </Section>

        {/* ── SWITCH ─────────────────────────────── */}

        <Section title="Switch">
          <Row label="On"><Switch value={switchOn} onToggle={setSwitchOn} /></Row>
          <Row label="Off"><Switch value={switchOff} onToggle={setSwitchOff} /></Row>
        </Section>

        {/* ── DIVIDER ─────────────────────────────── */}

        <Section title="Divider">
          <Row label="Subtle (default)"><Divider /></Row>
          <Row label="Bold"><Divider emphasis="Bold" /></Row>
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
            year={calYear} month={calMonth} selectedDay={calDay} todayDay={18}
            eventDays={[5, 12, 18, 25]} onSelectDay={setCalDay}
            onPrevMonth={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }}
            onNextMonth={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }}
          />
        </Section>

        {/* ── RANGE ─────────────────────────────── */}

        <Section title="Range">
          <Row label={`Low: $${rangeLow}  —  High: $${rangeHigh}`}>
            <Range min={0} max={100} low={rangeLow} high={rangeHigh} onChangeRange={([lo, hi]) => { setRangeLow(lo); setRangeHigh(hi); }} />
          </Row>
        </Section>

        {/* ── PROGRESS BAR ──────────────────────── */}

        <Section title="Progress Bar">
          <Row label="0%"><ProgressBar progress={0} /></Row>
          <Row label="25%"><ProgressBar progress={0.25} /></Row>
          <Row label="60%"><ProgressBar progress={0.6} /></Row>
          <Row label="100%"><ProgressBar progress={1} /></Row>
        </Section>

        {/* ── LEVELS ──────────────────────────────── */}

        <Section title="Levels">
          <Row label="Indicator = Item 1 (Beginner)"><Levels indicator={1} /></Row>
          <Row label="Indicator = Item 3 (Intermediate)"><Levels indicator={3} /></Row>
          <Row label="Indicator = Item 5 (Advanced)"><Levels indicator={5} /></Row>
        </Section>

        {/* ── BOTTOM ACTION ──────────────────────── */}

        <Section title="Bottom Action">
          <BottomAction showHomeIndicator={false}>
            <Button emphasis="Bold" textStyle="Medium" label="Join Club" trailingIcon={({ color, size }) => <Icon type="arrow forward" color={color} size={size} />} />
            <Button emphasis="Minimal" textStyle="Light" label="Share" trailingIcon={({ color, size }) => <Icon type="share" color={color} size={size} />} />
          </BottomAction>
        </Section>

        {/* ── OVERLAY ──────────────────────────────── */}

        <Section title="Overlay">
          <Row label="Tap to toggle">
            <Button emphasis="Subtle" label="Dark Overlay" onPress={() => setShowOverlay('dark')} />
            <Button emphasis="Subtle" label="Blur Overlay" onPress={() => setShowOverlay('blur')} />
          </Row>
        </Section>

        {/* ── COLOR PICKER ─────────────────────────── */}

        <Section title="Color Picker">
          <Row label={`Hue: ${pickerHue}\u00b0`}>
            <ColorPicker hue={pickerHue} onChangeHue={setPickerHue} />
          </Row>
        </Section>

        {/* ── MEMBERS ITEM ─────────────────────────── */}

        <Section title="Members Item">
          <Row label="With description + icon">
            <MembersItem
              avatar={<Avatar type="Image" size="Lg" source={{ uri: 'https://i.pravatar.cc/96?img=20' }} showCount count={3} />}
              name="Ling Cao" description="Went to Cool Pickleball Event together"
            />
          </Row>
          <Row label="Without description">
            <MembersItem avatar={<Avatar type="Image" size="Lg" source={{ uri: 'https://i.pravatar.cc/96?img=21' }} />} name="Jordan Williams" showIcon={false} />
          </Row>
        </Section>

        {/* ── LOCATION ITEM ──────────────────────────── */}

        <Section title="Location Item">
          <Row label="Tap to toggle selection">
            <LocationItem
              avatar={<Avatar type="Image" size="Lg" source={{ uri: 'https://i.pravatar.cc/96?img=22' }} showCount count={3} />}
              name="Gantry Park Handball Court" description="4812 34 blvd, Long Island City, NY 11101"
              selected={selectedLocations.has('Gantry Park Handball Court')}
              onPress={() => { setSelectedLocations((prev) => { const next = new Set(prev); next.has('Gantry Park Handball Court') ? next.delete('Gantry Park Handball Court') : next.add('Gantry Park Handball Court'); return next; }); }}
            />
          </Row>
          <Row label="Tap to toggle selection">
            <LocationItem
              avatar={<Avatar type="Image" size="Lg" source={{ uri: 'https://i.pravatar.cc/96?img=23' }} />}
              name="Central Park Tennis Courts"
              selected={selectedLocations.has('Central Park Tennis Courts')}
              onPress={() => { setSelectedLocations((prev) => { const next = new Set(prev); next.has('Central Park Tennis Courts') ? next.delete('Central Park Tennis Courts') : next.add('Central Park Tennis Courts'); return next; }); }}
            />
          </Row>
        </Section>

        {/* ── NOTIFICATION ITEM ──────────────────────── */}

        <Section title="Notification Item">
          <Row label="Friend request (accept / decline)">
            <NotificationItem
              avatar={<Avatar type="Image" size="Lg" source={{ uri: 'https://i.pravatar.cc/96?img=24' }} showCount count={3} />}
              text="Ling has joined Cool Pickleball Club" onAccept={() => {}} onDecline={() => {}}
            />
          </Row>
          <Row label="Without friend request buttons">
            <NotificationItem
              avatar={<Avatar type="Image" size="Lg" source={{ uri: 'https://i.pravatar.cc/96?img=25' }} />}
              text="Mike liked your post about the marathon" friendRequest={false}
            />
          </Row>
        </Section>

        {/* ── SEARCH CONTENT ITEM ────────────────────── */}

        <Section title="Search Content Item">
          {['Football', 'Basketball', 'Tennis'].map((sport, i) => (
            <Row key={sport} label={searchSelected === i ? 'Selected' : 'Tap to select'}>
              <SearchContentItem label={sport} selected={searchSelected === i} onPress={() => setSearchSelected(searchSelected === i ? null : i)} />
            </Row>
          ))}
        </Section>

        {/* ── BUTTON MULTI-SELECT ────────────────────── */}

        <Section title="Button Multi-Select">
          <Row label="Fill — Tap to toggle multiple">
            <ButtonMultiSelect
              items={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
              selected={multiSelected}
              onToggle={(i) => {
                setMultiSelected((prev) =>
                  prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
                );
              }}
            />
          </Row>
          <Row label="Hug">
            <ButtonMultiSelect
              display="Hug"
              items={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
              selected={multiSelected}
              onToggle={(i) => {
                setMultiSelected((prev) =>
                  prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
                );
              }}
            />
          </Row>
        </Section>

        {/* ── BUTTON SELECT ──────────────────────────── */}

        <Section title="Button Select">
          <Row label="Fill — Tap to select one">
            <ButtonSelect
              items={['Weekly', 'Monthly', 'Yearly']}
              selected={singleSelected}
              onSelect={setSingleSelected}
            />
          </Row>
          <Row label="Hug">
            <ButtonSelect
              display="Hug"
              items={['Weekly', 'Monthly', 'Yearly']}
              selected={singleSelected}
              onSelect={setSingleSelected}
            />
          </Row>
        </Section>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Overlay demo */}
      {showOverlay && (
        <Overlay variant={showOverlay} onPress={() => setShowOverlay(null)}>
          <Text style={{ ...textStyles.title02Medium, color: showOverlay === 'dark' ? colors.text.inverse : colors.text.bold }}>
            Tap to dismiss
          </Text>
        </Overlay>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['12'],
    paddingHorizontal: spacer['16'],
    marginBottom: spacer['24'],
  },
  pageTitle: {
    ...textStyles.headline02Medium,
    color: colors.text.bold,
  },
});
