/**
 * CreateEventScreen — form to create a new event
 *
 * Layout (mirrors EventScreen hero + card sections):
 *   Hero cover (full viewport, gray placeholder / user-picked image)
 *   Top nav: back button (left), camera edit button (right, below hero)
 *   Section 1: Event Name, Date, Time, Location, Admin, Fee
 *   Section 2: Levels
 *   Section 3: Description
 *   Section 4: Other Settings (expandable) — Vibe, Color Theme,
 *              Public/Private, Admin Approval, Capacity
 *   Bottom action: "Create Event" button + error state
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  type ViewStyle,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { CreateStackParamList } from '../navigation/CreateStack';
import { colors } from '../lib/tokens/colors';
import { spacer, borderRadius, borderWidth } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import {
  Avatar,
  Button,
  ButtonSelect,
  ButtonMultiSelect,
  ColorPicker,
  CoverPhotoModal,
  Divider,
  Icon,
  Input,
  Levels,
  ClubItem,
  LocationSearchModal,
  MembersItem,
  Search,
  SearchContentItem,
  Switch,
  Tag,
} from '../components/ui';
import type { SelectedLocation } from '../components/ui/LocationSearchModal';
import { useAuth } from '../lib/AuthContext';
import { createEvent, updateEvent, getEventById } from '../lib/api/events';
import { useMyClubs } from '../lib/hooks/useClubs';
import { uploadCoverFromUri } from '../lib/api/storage';
import { skillLevelToNumber } from '../lib/api/transforms';
import type { SkillLevel, VibeTag } from '../lib/database/types';
import {
  validateEventForm,
  hasEventErrors,
  type EventFormErrors,
} from '../lib/validation';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const VIBE_OPTIONS = ['Casual', 'Competitive', 'Teamwork', 'Professional'];

const DAY_LABELS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_LABELS_COMPACT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DAY_LABELS_FULL = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// ─── Component ──────────────────────────────────────────

const SKILL_LEVEL_MAP: Record<number, SkillLevel> = {
  1: 'beginner',
  2: 'beg_int',
  3: 'intermediate',
  4: 'int_adv',
  5: 'advanced',
};

export default function CreateEventScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<CreateStackParamList, 'CreateEvent'>>();
  const initialClubId = route.params?.associatedClubId ?? null;
  const editEventId = route.params?.editEventId;
  const isEditMode = !!editEventId;
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);
  const [editLoaded, setEditLoaded] = useState(false);

  // ── Form state ──
  const [coverImageUri, setCoverImageUri] = useState<string | null>(null);
  const [coverModalVisible, setCoverModalVisible] = useState(false);
  const [eventName, setEventName] = useState('');

  // Date mode: isRecurring false = One Time, true = Recurring
  const [isRecurring, setIsRecurring] = useState(false);
  const [dateValue, setDateValue] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  // Time state
  const [addEndTime, setAddEndTime] = useState(false);

  // For One Time: single time row
  const [hourValue, setHourValue] = useState('');
  const [minuteValue, setMinuteValue] = useState('');
  const [amPm, setAmPm] = useState<0 | 1>(0); // 0 = AM, 1 = PM
  const [endHourValue, setEndHourValue] = useState('');
  const [endMinuteValue, setEndMinuteValue] = useState('');
  const [endAmPm, setEndAmPm] = useState<0 | 1>(1);

  // For Recurring: per-day time state
  const [dayTimes, setDayTimes] = useState<
    Record<
      number,
      {
        hour: string;
        minute: string;
        amPm: 0 | 1;
        endHour: string;
        endMinute: string;
        endAmPm: 0 | 1;
      }
    >
  >({});

  // Admin
  const [adminSearch, setAdminSearch] = useState('');
  const [adminExpanded, setAdminExpanded] = useState(false);
  const [selectedAdminIds, setSelectedAdminIds] = useState<Set<string>>(
    new Set(),
  );

  // Fee: isYearlyFee false = Monthly, true = Yearly
  const [isYearlyFee, setIsYearlyFee] = useState(false);
  const [feeValue, setFeeValue] = useState('');

  // Levels
  const [levelIndicator, setLevelIndicator] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Description
  const [description, setDescription] = useState('');

  // Other Settings
  const [otherSettingsOpen, setOtherSettingsOpen] = useState(true);
  const [selectedVibe, setSelectedVibe] = useState('Casual');
  const [ctaColor, setCtaColor] = useState('#000000');
  const [colorHue, setColorHue] = useState(0);

  // Location (Google Places)
  const [locationExpanded, setLocationExpanded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

  // Public/Private, Admin Approval, Capacity
  const [isPublic, setIsPublic] = useState(false);
  const [adminApproval, setAdminApproval] = useState(false);
  const [capacity, setCapacity] = useState('');

  // Associated Club
  const [clubSearch, setClubSearch] = useState('');
  const [clubExpanded, setClubExpanded] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(initialClubId);

  // Validation
  const [fieldErrors, setFieldErrors] = useState<EventFormErrors>({
    name: null,
    date: null,
    time: null,
    fee: null,
    capacity: null,
    description: null,
  });
  const [submitted, setSubmitted] = useState(false);

  // ── Pre-populate form for edit mode ──
  useEffect(() => {
    if (!isEditMode || editLoaded) return;
    (async () => {
      try {
        const event = await getEventById(editEventId!);
        if (!event) return;
        setCoverImageUri(event.cover_photo_url ?? null);
        setEventName(event.name);
        setIsRecurring(event.is_recurring ?? false);
        if (event.event_date) {
          const d = new Date(event.event_date);
          setDateValue(`${d.getMonth() + 1}/${d.getDate()}`);
        }
        if (event.start_time) {
          // Parse 24h "HH:MM" → 12h hour, minute, amPm
          const [hh, mm] = event.start_time.split(':').map(Number);
          const isPm = hh >= 12;
          const h12 = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;
          setHourValue(String(h12));
          setMinuteValue(String(mm).padStart(2, '0'));
          setAmPm(isPm ? 1 : 0);
        }
        if (event.end_time) {
          const [hh, mm] = event.end_time.split(':').map(Number);
          const isPm = hh >= 12;
          const h12 = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;
          setEndHourValue(String(h12));
          setEndMinuteValue(String(mm).padStart(2, '0'));
          setEndAmPm(isPm ? 1 : 0);
          setAddEndTime(true);
        }
        if (event.recurrence_rule) {
          const dayNames = event.recurrence_rule.split(',');
          const indices = dayNames
            .map((name: string) => DAY_LABELS_FULL.findIndex((d) => d.toLowerCase() === name.trim()))
            .filter((i: number) => i >= 0);
          setSelectedDays(indices);
        }
        if (event.location_name) {
          setSelectedLocation({
            placeId: '',
            name: event.location_name,
            address: event.location_name,
            latitude: event.location_lat ?? 0,
            longitude: event.location_lng ?? 0,
          });
        }
        if (event.club_id) setSelectedClubId(event.club_id);
        setFeeValue(event.fee_amount ? String(event.fee_amount) : '0');
        setLevelIndicator(skillLevelToNumber(event.skill_level ?? 'beginner'));
        setDescription(event.description ?? '');
        if (event.vibe) {
          setSelectedVibe(event.vibe.charAt(0).toUpperCase() + event.vibe.slice(1));
        }
        setAdminApproval(event.requires_approval ?? true);
        setCapacity(event.capacity ? String(event.capacity) : '');
        setEditLoaded(true);
      } catch (err) {
        console.error('Failed to load event for editing:', err);
      }
    })();
  }, [isEditMode, editEventId, editLoaded]);

  // ── Helpers ──

  const { data: myClubs } = useMyClubs();
  const myAdminClubs = myClubs ?? [];

  const selectedClub = myAdminClubs.find((c) => c.id === selectedClubId);

  const filteredClubs = clubSearch.trim()
    ? myAdminClubs.filter((c) =>
        c.name.toLowerCase().includes(clubSearch.toLowerCase()),
      )
    : myAdminClubs;

  const friends: any[] = [];
  const otherMembers: any[] = [];
  const filteredFriends = friends;
  const filteredOtherMembers = otherMembers;

  // All available users for admin selection
  const allUsers: { id: string; name: string; handle?: string }[] = useMemo(() => {
    const list: { id: string; name: string; handle?: string }[] = [];
    if (user) list.push({ id: user.id, name: user.user_metadata?.display_name ?? 'You' });
    list.push(...friends, ...otherMembers);
    return list;
  }, [user, friends, otherMembers]);

  const selectedAdminUsers = Array.from(selectedAdminIds)
    .map((id: string) => allUsers.find((u: { id: string }) => u.id === id))
    .filter(Boolean) as typeof allUsers;

  const selectedAdminNames = selectedAdminUsers
    .map((u: { name: string }) => u.name)
    .join(', ');

  const toggleAdmin = (userId: string) => {
    setSelectedAdminIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const toggleDay = (index: number) => {
    setSelectedDays((prev) => {
      if (prev.includes(index)) {
        return prev.filter((d) => d !== index);
      }
      return [...prev, index].sort((a, b) => a - b);
    });
  };

  const getDayTime = (dayIndex: number) =>
    dayTimes[dayIndex] ?? {
      hour: '',
      minute: '',
      amPm: 0 as 0 | 1,
      endHour: '',
      endMinute: '',
      endAmPm: 1 as 0 | 1,
    };

  const updateDayTime = (
    dayIndex: number,
    field: string,
    value: string | number,
  ) => {
    setDayTimes((prev) => ({
      ...prev,
      [dayIndex]: {
        ...getDayTime(dayIndex),
        [field]: value,
      },
    }));
  };

  const handleColorHueChange = useCallback((hue: number) => {
    setColorHue(hue);
    // Convert hue to hex color for CTA
    const h = hue / 360;
    const s = 1,
      l = 0.5;
    const a2 = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h * 12) % 12;
      const c = l - a2 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * c)
        .toString(16)
        .padStart(2, '0');
    };
    setCtaColor(`#${f(0)}${f(8)}${f(4)}`);
  }, []);

  const handleSubmit = useCallback(async () => {
    setSubmitted(true);

    // Build dayTimes map for recurring validation
    const dayTimesMap: Record<number, { hour: string; minute: string }> = {};
    for (const d of selectedDays) {
      const t = getDayTime(d);
      dayTimesMap[d] = { hour: t.hour, minute: t.minute };
    }

    const errors = validateEventForm({
      name: eventName,
      isRecurring,
      dateValue,
      selectedDays,
      hourValue,
      minuteValue,
      dayTimes: dayTimesMap,
      feeValue,
      capacity,
      description,
    });
    setFieldErrors(errors);
    if (hasEventErrors(errors)) return;
    if (!user) return;
    setCreating(true);

    try {
      // Build start_time in 24h format
      let startTime: string;
      if (isRecurring) {
        const firstDay = selectedDays[0];
        const t = getDayTime(firstDay);
        const h = parseInt(t.hour, 10);
        const h24 = t.amPm === 1 ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h);
        startTime = `${String(h24).padStart(2, '0')}:${t.minute.padStart(2, '0')}`;
      } else {
        const h = parseInt(hourValue, 10);
        const h24 = amPm === 1 ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h);
        startTime = `${String(h24).padStart(2, '0')}:${minuteValue.padStart(2, '0')}`;
      }

      // Build event_date (YYYY-MM-DD) — for one-time, parse dateValue; for recurring use today
      let eventDate: string;
      if (!isRecurring && dateValue.trim()) {
        // Expect dateValue like "04/05" or "2026-04-05"
        const parts = dateValue.split('/');
        if (parts.length >= 2) {
          const now = new Date();
          const m = parts[0].padStart(2, '0');
          const d = parts[1].padStart(2, '0');
          eventDate = `${now.getFullYear()}-${m}-${d}`;
        } else {
          eventDate = dateValue;
        }
      } else {
        eventDate = new Date().toISOString().split('T')[0];
      }

      const formData = {
        name: eventName.trim(),
        club_id: selectedClubId ?? null,
        event_date: eventDate,
        start_time: startTime,
        sport: null as string | null,
        description: description.trim() || null,
        location_name: selectedLocation?.name ?? null,
        location_lat: selectedLocation?.latitude ?? null,
        location_lng: selectedLocation?.longitude ?? null,
        skill_level: SKILL_LEVEL_MAP[levelIndicator] ?? ('beginner' as const),
        fee_amount: parseFloat(feeValue) || 0,
        fee_frequency: (parseFloat(feeValue) > 0 ? 'per_event' : 'free') as 'per_event' | 'free',
        vibe: (selectedVibe.toLowerCase() as VibeTag) ?? null,
        capacity: capacity ? parseInt(capacity, 10) : null,
        requires_approval: adminApproval,
        is_recurring: isRecurring,
        recurrence_rule: isRecurring
          ? selectedDays.map((d) => DAY_LABELS_FULL[d].toLowerCase()).join(',')
          : null,
      };

      let eventId: string;

      if (isEditMode && editEventId) {
        // ── Update existing event ──
        await updateEvent(editEventId, formData);
        eventId = editEventId;
      } else {
        // ── Create new event ──
        const newEvent = await createEvent({
          ...formData,
          created_by: user.id,
        });
        eventId = newEvent.id;
      }

      // Upload cover photo if changed
      if (coverImageUri) {
        try {
          const coverUrl = await uploadCoverFromUri('event', eventId, coverImageUri);
          if (coverUrl) {
            await updateEvent(eventId, { cover_photo_url: coverUrl });
          }
        } catch (uploadErr) {
          console.warn('Cover photo upload failed:', uploadErr);
        }
      }

      navigation.navigate('Discover', {
        screen: 'Event',
        params: { eventId },
      });
    } catch (err) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} event:`, err);
      setFieldErrors((prev) => ({ ...prev, name: 'Something went wrong. Please try again.' }));
    } finally {
      setCreating(false);
    }
  }, [
    eventName,
    dateValue,
    hourValue,
    minuteValue,
    feeValue,
    amPm,
    isRecurring,
    selectedDays,
    dayTimes,
    selectedLocation,
    selectedClubId,
    levelIndicator,
    selectedVibe,
    description,
    capacity,
    adminApproval,
    coverImageUri,
    isEditMode,
    editEventId,
    user,
    navigation,
  ]);

  // ── Render helpers ──

  const renderTimeRow = (
    hVal: string,
    onHChange: (t: string) => void,
    mVal: string,
    onMChange: (t: string) => void,
    amPmVal: 0 | 1,
    onAmPmChange: (v: 0 | 1) => void,
  ) => (
    <View style={styles.timeRow}>
      <View style={styles.timeInput}>
        <Input
          value={hVal}
          onChangeText={(text) => {
            onHChange(text);
            if (submitted) setFieldErrors((prev) => ({ ...prev, time: null }));
          }}
          placeholder="HH"
          keyboardType="number-pad"
        />
      </View>
      <Text style={styles.timeSeparator}>:</Text>
      <View style={styles.timeInput}>
        <Input
          value={mVal}
          onChangeText={(text) => {
            onMChange(text);
            if (submitted) setFieldErrors((prev) => ({ ...prev, time: null }));
          }}
          placeholder="MM"
          keyboardType="number-pad"
        />
      </View>
      <ButtonSelect
        items={['AM', 'PM']}
        selected={amPmVal}
        onSelect={(index) => onAmPmChange(index as 0 | 1)}
        display="Hug"
      />
    </View>
  );

  const renderAdminSection = () => (
    <View style={styles.fieldSection}>
      <Text style={styles.fieldLabel}>Admin</Text>
      <Pressable onPress={() => setAdminExpanded(true)}>
        <View style={styles.inputFullWidth}>
          <Search
            value={selectedAdminNames}
            onChangeText={() => {}}
            placeholder="Search Members for Admin"
            editable={false}
          />
        </View>
      </Pressable>
    </View>
  );

  const renderAdminModal = () => (
    <Modal
      visible={adminExpanded}
      transparent
      animationType="fade"
      onRequestClose={() => setAdminExpanded(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setAdminExpanded(false)} />
        <View style={styles.modalCard}>
          <View style={styles.modalCardInner}>
          {/* Back button — top left */}
          <View style={styles.modalBackRow}>
            <Button
              emphasis="Subtle"
              content="Icon"
              size="Sm"
              icon={({ color, size }) => (
                <Icon type="arrow backward" size={size} color={color} />
              )}
              onPress={() => setAdminExpanded(false)}
            />
          </View>

          <View style={styles.modalSearchChipsWrap}>
            <Search
              value={adminSearch}
              onChangeText={setAdminSearch}
              placeholder="Search Members for Admin"
            />
            {/* Selected admins */}
            {selectedAdminUsers.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.adminChipsRow}
              >
                {selectedAdminUsers.map((user) => (
                  <Pressable
                    key={user.id}
                    style={styles.adminChip}
                    onPress={() => toggleAdmin(user.id)}
                  >
                    <Avatar type="Image" size="Lg" />
                    <Text style={styles.adminChipName} numberOfLines={1}>
                      {user.name.split(' ')[0]}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {/* You */}
            {user && (
            <View style={styles.memberGroup}>
              <Text style={styles.memberGroupTitle}>You</Text>
              <MembersItem
                avatar={<Avatar type="Image" size="Lg" />}
                name={user.user_metadata?.display_name ?? 'You'}
                description="That's you!"
                showIcon={selectedAdminIds.has(user.id)}
                icon={({ size }) => (
                  <Icon type="check" color={colors.icon.bold} size={size} />
                )}
                onPress={() => toggleAdmin(user.id)}
              />
            </View>
            )}

            {/* Friends — no add-friend icon, show check if selected */}
            {filteredFriends.length > 0 && (
              <View style={styles.memberGroup}>
                <Text style={styles.memberGroupTitle}>Friends</Text>
                {filteredFriends.map((user) => (
                  <MembersItem
                    key={user.id}
                    avatar={<Avatar type="Image" size="Lg" />}
                    name={user.name}
                    description={user.handle ?? ''}
                    showIcon={selectedAdminIds.has(user.id)}
                    icon={({ size }) => (
                      <Icon type="check" color={colors.icon.bold} size={size} />
                    )}
                    onPress={() => toggleAdmin(user.id)}
                  />
                ))}
              </View>
            )}

            {/* Other Members */}
            {filteredOtherMembers.length > 0 && (
              <View style={styles.memberGroup}>
                <Text style={styles.memberGroupTitle}>Other Members</Text>
                {filteredOtherMembers.map((user) => (
                  <MembersItem
                    key={user.id}
                    avatar={<Avatar type="Image" size="Lg" />}
                    name={user.name}
                    description={
                      user.handle ?? ''
                    }
                    showIcon
                    icon={
                      selectedAdminIds.has(user.id)
                        ? ({ size }) => (
                            <Icon type="check" color={colors.icon.bold} size={size} />
                          )
                        : undefined
                    }
                    onPress={() => toggleAdmin(user.id)}
                  />
                ))}
              </View>
            )}
          </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderLocationSection = () => (
    <View style={styles.fieldSection}>
      <Text style={styles.fieldLabel}>Location</Text>
      <Pressable onPress={() => setLocationExpanded(true)}>
        <View style={styles.inputFullWidth}>
          <Search
            value={selectedLocation?.name ?? ''}
            onChangeText={() => {}}
            placeholder="Search Location"
            editable={false}
          />
        </View>
      </Pressable>
      {selectedLocation?.address ? (
        <Text style={styles.locationAddress}>{selectedLocation.address}</Text>
      ) : null}
    </View>
  );

  const renderLocationModal = () => (
    <LocationSearchModal
      visible={locationExpanded}
      onClose={() => setLocationExpanded(false)}
      onLocationSelected={(loc) => setSelectedLocation(loc)}
      placeholder="Search Location"
    />
  );

  const renderClubModal = () => (
    <Modal
      visible={clubExpanded}
      transparent
      animationType="fade"
      onRequestClose={() => setClubExpanded(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setClubExpanded(false)} />
        <View style={styles.modalCard}>
          <View style={styles.modalCardInner}>
            <View style={styles.modalBackRow}>
              <Button
                emphasis="Subtle"
                content="Icon"
                size="Sm"
                icon={({ color, size }) => (
                  <Icon type="arrow backward" size={size} color={color} />
                )}
                onPress={() => setClubExpanded(false)}
              />
            </View>

            <View style={styles.modalSearchWrap}>
              <Search
                value={clubSearch}
                onChangeText={setClubSearch}
                placeholder="Search Clubs"
              />
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.clubModalSectionTitle}>My Clubs</Text>
              <View style={styles.clubModalList}>
                {filteredClubs.map((club) => (
                  <ClubItem
                    key={club.id}
                    name={club.name}
                    subtitle={club.sport ?? ''}
                    selected={selectedClubId === club.id}
                    onPress={() => {
                      setSelectedClubId(club.id);
                      setClubSearch('');
                      setClubExpanded(false);
                    }}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* ── Hero Cover ────────────────────────────────────── */}
      <Image
        source={{ uri: coverImageUri || 'https://picsum.photos/800/1200' }}
        style={styles.heroCover}
        resizeMode="cover"
      />

      {/* ── Cover Photo Modal ───────────────────────────── */}
      <CoverPhotoModal
        visible={coverModalVisible}
        onClose={() => setCoverModalVisible(false)}
        onImageSelected={setCoverImageUri}
        context="event"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ── Top Nav ───────────────────────────────────────── */}
        <View style={styles.topNav}>
          <Button
            emphasis="Subtle"
            content="Icon"
            size="Sm"
            icon={({ color, size }) => (
              <Icon type="arrow backward" size={size} color={color} />
            )}
            onPress={() => navigation.goBack()}
          />
          <View />
        </View>

        {/* ── Sections ─────────────────────────────────────── */}
        <View style={styles.sections}>
          {/* Edit image button (right-aligned) */}
          <View style={styles.editButtonRow}>
            <Button
              emphasis="Subtle"
              content="Icon"
              size="Sm"
              icon={({ color, size }) => (
                <Icon type="add image" size={size} color={color} />
              )}
              onPress={() => setCoverModalVisible(true)}
            />
          </View>

          {/* ── Section 1: Club Info ────────────────────────── */}
          <View style={styles.cardOuter}>
            <View style={styles.cardInner}>
              {/* Club Name */}
              <View style={styles.titleInputWrap}>
                <TextInput
                  style={[
                    styles.titleInput,
                    !eventName ? styles.titleInputPlaceholder : null,
                  ]}
                  placeholder="Event Name"
                  placeholderTextColor={colors.text.subtle}
                  value={eventName}
                  onChangeText={(text) => {
                    setEventName(text);
                    if (submitted) setFieldErrors((prev) => ({ ...prev, name: null }));
                  }}
                  maxLength={80}
                />
                {submitted && fieldErrors.name && (
                  <Text style={styles.fieldError}>{fieldErrors.name}</Text>
                )}
              </View>

              <Divider />

              {/* Date */}
              <View style={styles.fieldSection}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Date</Text>
                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>
                      {isRecurring ? 'Recurring' : 'One Time'}
                    </Text>
                    <Switch value={isRecurring} onToggle={setIsRecurring} />
                  </View>
                </View>
                {!isRecurring ? (
                  /* One Time: date text input with calendar icon */
                  <View style={styles.inputFullWidth}>
                    <Input
                      value={dateValue}
                      onChangeText={(text) => {
                        setDateValue(text);
                        if (submitted) setFieldErrors((prev) => ({ ...prev, date: null }));
                      }}
                      placeholder="01/18/2024"
                    />
                  </View>
                ) : (
                  /* Recurring: ButtonMultiSelect with days */
                  <ButtonMultiSelect
                    items={DAY_LABELS_SHORT}
                    compactItems={DAY_LABELS_COMPACT}
                    compactBreakpoint={355}
                    selected={selectedDays}
                    onToggle={toggleDay}
                  />
                )}
              </View>

              <Divider />

              {/* Time */}
              <View style={styles.fieldSection}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Time</Text>
                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Add End Time</Text>
                    <Switch value={addEndTime} onToggle={setAddEndTime} />
                  </View>
                </View>

                {!isRecurring ? (
                  /* One Time: single time block */
                  <>
                    {renderTimeRow(
                      hourValue,
                      setHourValue,
                      minuteValue,
                      setMinuteValue,
                      amPm,
                      setAmPm,
                    )}
                    {addEndTime && (
                      <View style={styles.endTimeRow}>
                        <Text style={styles.timeTilde}>~</Text>
                        <View style={{ flex: 1 }}>
                          {renderTimeRow(
                            endHourValue,
                            setEndHourValue,
                            endMinuteValue,
                            setEndMinuteValue,
                            endAmPm,
                            setEndAmPm,
                          )}
                        </View>
                      </View>
                    )}
                  </>
                ) : (
                  /* Recurring: per-selected-day time blocks */
                  <>
                    {selectedDays.map((dayIdx) => {
                      const dt = getDayTime(dayIdx);
                      return (
                        <View key={dayIdx} style={styles.dayTimeBlock}>
                          <Text style={styles.dayTimeLabel}>
                            {DAY_LABELS_FULL[dayIdx]}
                          </Text>
                          {renderTimeRow(
                            dt.hour,
                            (v) => updateDayTime(dayIdx, 'hour', v),
                            dt.minute,
                            (v) => updateDayTime(dayIdx, 'minute', v),
                            dt.amPm,
                            (v) => updateDayTime(dayIdx, 'amPm', v),
                          )}
                          {addEndTime && (
                            <View style={styles.endTimeRow}>
                              <Text style={styles.timeTilde}>~</Text>
                              <View style={{ flex: 1 }}>
                                {renderTimeRow(
                                  dt.endHour,
                                  (v) => updateDayTime(dayIdx, 'endHour', v),
                                  dt.endMinute,
                                  (v) => updateDayTime(dayIdx, 'endMinute', v),
                                  dt.endAmPm,
                                  (v) => updateDayTime(dayIdx, 'endAmPm', v),
                                )}
                              </View>
                            </View>
                          )}
                        </View>
                      );
                    })}
                    {selectedDays.length === 0 && (
                      <Text style={styles.helperText}>
                        Select days above to set times
                      </Text>
                    )}
                  </>
                )}
              </View>

              {/* Location (always in Section 1) */}
              <Divider />
              {renderLocationSection()}

              {/* Admin */}
              <Divider />
              {renderAdminSection()}

              <Divider />

              {/* Fee */}
              <View style={styles.fieldSection}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Fee</Text>
                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>
                      {isYearlyFee ? 'Yearly' : 'Monthly'}
                    </Text>
                    <Switch value={isYearlyFee} onToggle={setIsYearlyFee} />
                  </View>
                </View>
                <TextInput
                  style={styles.feeInput}
                  placeholder="$00"
                  placeholderTextColor={colors.text.subtle}
                  value={feeValue}
                  onChangeText={(text) => {
                    setFeeValue(text);
                    if (submitted) setFieldErrors((prev) => ({ ...prev, fee: null }));
                  }}
                  keyboardType="number-pad"
                />
                {submitted && fieldErrors.fee && (
                  <Text style={styles.fieldError}>{fieldErrors.fee}</Text>
                )}
              </View>
            </View>
          </View>

          {/* ── Section 2: Levels ──────────────────────────── */}
          <View style={styles.cardOuter}>
            <View style={[styles.cardInner, { borderBottomWidth: 0 }]}>
              <View style={styles.levelsWrap}>
                <Levels indicator={levelIndicator} onSelect={setLevelIndicator} />
              </View>
            </View>
          </View>

          {/* ── Section 3: Description ─────────────────────── */}
          <View style={styles.cardOuter}>
            <View style={styles.cardInner}>
              <View style={styles.fieldSection}>
                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={styles.descriptionInput}
                  placeholder="Add your description"
                  placeholderTextColor={colors.text.subtle}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          {/* ── Section 4: Other Settings ──────────────────── */}
          <View style={styles.cardOuter}>
            <View style={styles.cardInner}>
              {/* Collapsible header */}
              <Pressable
                style={styles.otherSettingsHeader}
                onPress={() => setOtherSettingsOpen((prev) => !prev)}
              >
                <Text style={styles.fieldLabel}>Other Settings</Text>
                <Icon
                  type={otherSettingsOpen ? 'expanded' : 'collapsed'}
                  size={16}
                  color={colors.icon.bold}
                />
              </Pressable>

              {otherSettingsOpen && (
                <>
                  {/* Associated Club */}
                  <View style={styles.fieldSection}>
                    <Text style={styles.fieldLabel}>Associated Club</Text>
                    <Pressable onPress={() => setClubExpanded(true)}>
                      <View style={styles.inputFullWidth}>
                        <Search
                          value={selectedClub?.name ?? ''}
                          onChangeText={() => {}}
                          placeholder="Search Clubs"
                          editable={false}
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Vibe */}
                  <View style={styles.fieldSection}>
                    <Text style={styles.fieldLabel}>What is the vibe?</Text>
                    <View style={styles.tagsGrid}>
                      <View style={styles.tagsRow}>
                        {VIBE_OPTIONS.slice(0, 2).map((vibe) => (
                          <Tag
                            key={vibe}
                            label={vibe}
                            selected={selectedVibe === vibe}
                            onPress={() => setSelectedVibe(vibe)}
                            size="Sm"
                            style={{ flex: 1 }}
                          />
                        ))}
                      </View>
                      <View style={styles.tagsRow}>
                        {VIBE_OPTIONS.slice(2, 4).map((vibe) => (
                          <Tag
                            key={vibe}
                            label={vibe}
                            selected={selectedVibe === vibe}
                            onPress={() => setSelectedVibe(vibe)}
                            size="Sm"
                            style={{ flex: 1 }}
                          />
                        ))}
                      </View>
                    </View>
                  </View>

                  {/* Color Theme */}
                  <View style={styles.fieldSection}>
                    <Text style={styles.fieldLabel}>Color Theme</Text>
                    <ColorPicker
                      hue={colorHue}
                      onChangeHue={handleColorHueChange}
                    />
                  </View>

                  {/* Public/Private */}
                  <View style={styles.fieldSection}>
                    <View style={styles.fieldHeader}>
                      <Text style={styles.fieldLabel}>Public/ Private</Text>
                      <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>
                          {isPublic ? 'Public' : 'Private'}
                        </Text>
                        <Switch value={isPublic} onToggle={setIsPublic} />
                      </View>
                    </View>
                    <Text style={styles.helperText}>
                      Anyone can discover your event vs. Shared link only
                    </Text>
                  </View>

                  {/* Admin Approval */}
                  <View style={styles.fieldSection}>
                    <View style={styles.fieldHeader}>
                      <Text style={styles.fieldLabel}>
                        Admin Approval to Join
                      </Text>
                      <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>
                          {adminApproval ? 'Required' : 'None'}
                        </Text>
                        <Switch
                          value={adminApproval}
                          onToggle={setAdminApproval}
                        />
                      </View>
                    </View>
                    <Text style={styles.helperText}>
                      Anyone can join your event vs. Need admin approval
                    </Text>
                  </View>

                  {/* Capacity */}
                  <View style={styles.fieldSection}>
                    <Text style={styles.fieldLabel}>Capacity</Text>
                    <TextInput
                      style={styles.feeInput}
                      placeholder="00"
                      placeholderTextColor={colors.text.subtle}
                      value={capacity}
                      onChangeText={(text) => {
                        setCapacity(text);
                        if (submitted) setFieldErrors((prev) => ({ ...prev, capacity: null }));
                      }}
                      keyboardType="number-pad"
                    />
                    {submitted && fieldErrors.capacity ? (
                      <Text style={styles.fieldError}>{fieldErrors.capacity}</Text>
                    ) : (
                      <Text style={styles.helperText}>
                        Set max number of attendees for your event
                      </Text>
                    )}
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom Action ──────────────────────────────────── */}
      <View style={styles.bottomActionWrap}>
        {submitted && hasEventErrors(fieldErrors) && (
          <View style={styles.errorRow}>
            <Icon type="info" size={12} color={colors.icon.error} />
            <Text style={styles.errorText}>
              {Object.values(fieldErrors).find((e) => e !== null)}
            </Text>
          </View>
        )}
        <View style={styles.bottomActionInner}>
          <View style={styles.bottomActionRow}>
            <Button
              emphasis="Bold"
              label={isEditMode ? 'Save Changes' : 'Create Event'}
              leadingIcon={({ color, size }) => (
                <Icon type={isEditMode ? 'check' : 'add'} size={size} color={color} />
              )}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </View>

      {/* ── Modals ──────────────────────────────────────────── */}
      {renderAdminModal()}
      {renderLocationModal()}
      {renderClubModal()}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.bold,
  },

  scrollContent: {
    paddingBottom: 200,
  },

  heroCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: colors.border.subtle,
  },

  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 64,
    paddingHorizontal: spacer['24'],
  },

  sections: {
    paddingHorizontal: spacer['24'],
    gap: spacer['8'],
    paddingTop: spacer['280'],
  },

  editButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  // Card wrappers
  cardOuter: {
    padding: spacer['8'],
    borderRadius: borderRadius['16'],
    backgroundColor: colors.surface.subtle,
  },

  cardInner: {
    borderWidth: borderWidth.thin,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius['16'],
    overflow: 'hidden',
  },

  // Club name title input
  titleInputWrap: {
    padding: spacer['16'],
    height: 64,
    justifyContent: 'center',
  },

  titleInput: {
    ...textStyles.headline02Medium,
    color: colors.text.bold,
    padding: 0,
  },

  titleInputPlaceholder: {
    color: colors.text.subtle,
  },

  // Field sections
  fieldSection: {
    padding: spacer['16'],
    gap: spacer['8'],
  },

  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
  },

  fieldLabel: {
    ...textStyles.title02Medium,
    color: colors.text.bold,
    flex: 1,
  },

  locationAddress: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
    marginTop: spacer['4'],
  },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
  },

  switchLabel: {
    ...textStyles.body04Light,
    color: colors.text.bold,
  },

  inputFullWidth: {
    width: '100%',
  },

  // Time row
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
  },

  timeInput: {
    flex: 1,
  },

  timeSeparator: {
    ...textStyles.title02Medium,
    color: colors.text.bold,
  },

  timeTilde: {
    ...textStyles.title02Medium,
    color: colors.text.bold,
  },

  endTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
  },

  // Day time blocks (recurring)
  dayTimeBlock: {
    gap: spacer['8'],
  },

  dayTimeLabel: {
    ...textStyles.body03Medium,
    color: colors.text.bold,
  },

  // Fee input
  feeInput: {
    ...textStyles.body03Light,
    color: colors.text.bold,
    borderWidth: borderWidth.thin,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacer['12'],
    paddingVertical: spacer['12'],
    height: 36,
  },

  // Description input
  descriptionInput: {
    ...textStyles.body03Light,
    color: colors.text.bold,
    borderWidth: borderWidth.thin,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius['16'],
    paddingHorizontal: spacer['12'],
    paddingVertical: spacer['12'],
    height: 64,
    textAlignVertical: 'top',
  },

  // Levels
  levelsWrap: {
    paddingTop: spacer['16'],
    width: '100%',
  },

  // Other settings header
  otherSettingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacer['16'],
  },

  // Tags 2×2 grid
  tagsGrid: {
    gap: spacer['8'],
  },

  tagsRow: {
    flexDirection: 'row',
    gap: spacer['8'],
  },

  // Helper text
  helperText: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
  },

  // Modal overlay for admin/location
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'center',
    paddingHorizontal: spacer['24'],
  },

  modalCard: {
    width: '100%',
    height: 640,
    backgroundColor: colors.surface.subtle,
    borderRadius: borderRadius['16'],
    padding: spacer['8'],
    overflow: 'hidden',
  },

  modalCardInner: {
    flex: 1,
    borderWidth: borderWidth.thin,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius['16'],
    backgroundColor: colors.surface.subtle,
    padding: spacer['16'],
    overflow: 'hidden',
  },

  modalBackRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: spacer['12'],
  },

  modalSearchWrap: {
    width: '100%',
    marginBottom: spacer['24'],
  },

  modalSearchChipsWrap: {
    width: '100%',
    gap: spacer['12'],
    marginBottom: spacer['24'],
  },

  adminChipsRow: {
    flexDirection: 'row',
    gap: spacer['8'],
  },

  adminChip: {
    alignItems: 'center',
    gap: spacer['8'],
  },

  adminChipName: {
    ...textStyles.body03Light,
    color: colors.text.bold,
  },

  modalScroll: {
    flex: 1,
  },

  memberGroup: {
    gap: spacer['12'],
    marginBottom: spacer['24'],
  },

  memberGroupTitle: {
    ...textStyles.title02Medium,
    color: colors.text.bold,
  },

  // Bottom action
  bottomActionWrap: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: spacer['4'],
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['4'],
  },

  errorText: {
    ...textStyles.body03Light,
    color: colors.text.error,
  },

  fieldError: {
    ...textStyles.body03Light,
    color: colors.text.error,
    marginTop: spacer['4'],
  },

  bottomActionInner: {
    width: '100%',
    paddingHorizontal: spacer['24'],
  },

  bottomActionRow: {
    borderRadius: borderRadius['16'],
    backgroundColor: colors.surface.blur,
    overflow: 'hidden',
    paddingHorizontal: spacer['16'],
    paddingVertical: spacer['12'],
    ...(Platform.OS === 'web'
      ? { backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }
      : {}),
  } as ViewStyle,

  clubModalSectionTitle: {
    ...textStyles.title02Medium,
    color: colors.text.bold,
    marginBottom: spacer['12'],
  },

  clubModalList: {
    gap: spacer['12'],
  },
});
