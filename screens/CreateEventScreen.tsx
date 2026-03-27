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

import React, { useState, useCallback } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer, borderRadius } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import {
  Avatar,
  Button,
  ButtonSelect,
  ButtonMultiSelect,
  ColorPicker,
  Divider,
  Icon,
  Input,
  Levels,
  ClubItem,
  LocationItem,
  MembersItem,
  Search,
  SearchContentItem,
  Switch,
  Tag,
} from '../components/ui';
import {
  CURRENT_USER,
  EVENTS,
  CLUBS,
  CLUB_DETAILS,
  USERS,
  getFriends,
  getFriendSuggestions,
  FRIEND_DESCRIPTIONS,
  SUGGESTION_DESCRIPTIONS,
} from '../lib/data/mockData';

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

// ─── Mock location data ────────────────────────────────

type LocationData = {
  id: string;
  name: string;
  address: string;
  city: string;
};

const LOCATIONS: LocationData[] = [
  {
    id: 'loc-1',
    name: 'Gantry Park Handball Court',
    address: '4-09 47th Rd, Long Island City, NY 11101',
    city: 'New York',
  },
  {
    id: 'loc-2',
    name: 'Central Park Tennis Center',
    address: 'Central Park West, New York, NY 10024',
    city: 'New York',
  },
  {
    id: 'loc-3',
    name: 'Prospect Park Pickleball',
    address: 'Prospect Park SW, Brooklyn, NY 11215',
    city: 'New York',
  },
  {
    id: 'loc-4',
    name: 'Liberty State Park Courts',
    address: '200 Morris Pesin Dr, Jersey City, NJ 07305',
    city: 'New Jersey',
  },
  {
    id: 'loc-5',
    name: 'Hoboken Waterfront Fields',
    address: '1301 Sinatra Dr N, Hoboken, NJ 07030',
    city: 'New Jersey',
  },
];

// ─── Component ──────────────────────────────────────────

export default function CreateEventScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialClubId = route.params?.associatedClubId ?? null;

  // ── Form state ──
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

  // Location
  const [locationSearch, setLocationSearch] = useState('');
  const [locationExpanded, setLocationExpanded] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );

  // Public/Private, Admin Approval, Capacity
  const [isPublic, setIsPublic] = useState(false);
  const [adminApproval, setAdminApproval] = useState(false);
  const [capacity, setCapacity] = useState('');

  // Associated Club
  const [clubSearch, setClubSearch] = useState('');
  const [clubExpanded, setClubExpanded] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(initialClubId);

  // Validation
  const [showError, setShowError] = useState(false);

  // ── Helpers ──

  const allUsers = [CURRENT_USER, ...USERS];

  const selectedClub = CLUBS.find((c) => c.id === selectedClubId);

  // Only show clubs where the current user is an admin
  const myAdminClubs = CLUBS.filter((c) => {
    const detail = CLUB_DETAILS[c.id];
    return detail?.adminIds.includes(CURRENT_USER.id);
  });

  const filteredClubs = clubSearch.trim()
    ? myAdminClubs.filter((c) =>
        c.name.toLowerCase().includes(clubSearch.toLowerCase()),
      )
    : myAdminClubs;

  const friends = getFriends();
  const otherMembers = getFriendSuggestions();

  const filteredFriends = adminSearch.trim()
    ? friends.filter((u) =>
        u.name.toLowerCase().includes(adminSearch.toLowerCase()),
      )
    : friends;

  const filteredOtherMembers = adminSearch.trim()
    ? otherMembers.filter((u) =>
        u.name.toLowerCase().includes(adminSearch.toLowerCase()),
      )
    : otherMembers;

  const selectedAdminNames = Array.from(selectedAdminIds)
    .map((id) => {
      const user = allUsers.find((u) => u.id === id);
      return user?.name ?? '';
    })
    .filter(Boolean)
    .join(', ');

  const selectedLocation = LOCATIONS.find((l) => l.id === selectedLocationId);

  const filteredLocations = locationSearch.trim()
    ? LOCATIONS.filter(
        (l) =>
          l.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
          l.address.toLowerCase().includes(locationSearch.toLowerCase()),
      )
    : LOCATIONS;

  const locationsByCity = filteredLocations.reduce<
    Record<string, LocationData[]>
  >((acc, loc) => {
    if (!acc[loc.city]) acc[loc.city] = [];
    acc[loc.city].push(loc);
    return acc;
  }, {});

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

  const handleCreate = useCallback(() => {
    // Required: Name, Date/Days, Time, Fee
    const hasDate = isRecurring ? selectedDays.length > 0 : dateValue.trim() !== '';
    const hasTime = isRecurring
      ? selectedDays.every((d) => {
          const t = getDayTime(d);
          return t.hour.trim() !== '' && t.minute.trim() !== '';
        })
      : hourValue.trim() !== '' && minuteValue.trim() !== '';

    if (!eventName.trim() || !hasDate || !hasTime || !feeValue.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);

    // Build time string
    let dateTimeStr: string;
    if (isRecurring) {
      const dayNames = selectedDays.map((d) => DAY_LABELS_SHORT[d]).join(', ');
      const firstDay = selectedDays[0];
      const t = getDayTime(firstDay);
      dateTimeStr = `Every ${dayNames} ${t.hour}:${t.minute} ${t.amPm === 0 ? 'AM' : 'PM'}`;
    } else {
      const timeStr = `${hourValue}:${minuteValue} ${amPm === 0 ? 'AM' : 'PM'}`;
      dateTimeStr = `${dateValue} ${timeStr}`;
    }

    const locationName = selectedLocation?.name ?? (locationSearch.trim() || 'TBD');

    // Create new club and navigate
    const newClub = {
      id: `club-new-${Date.now()}`,
      name: eventName.toUpperCase(),
      dateTime: dateTimeStr,
      location: locationName,
      level: levelIndicator as 1 | 2 | 3 | 4 | 5,
      mutualHighlight: `${CURRENT_USER.name.split(' ')[0]}`,
      mutualBody: 'is the admin',
      price: `$${feeValue}`,
      ctaLabel: 'Join Event',
      ctaColor: ctaColor,
      ctaTextColor: colors.text.onhighlight,
    };

    // Add to EVENTS array (in-memory)
    EVENTS.push(newClub);

    // Navigate to the new event page
    navigation.navigate('Discover', {
      screen: 'Event',
      params: { eventId: newClub.id },
    });
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
    locationSearch,
    selectedLocation,
    levelIndicator,
    ctaColor,
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
            setShowError(false);
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
            setShowError(false);
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

  const selectedAdminUsers = Array.from(selectedAdminIds)
    .map((id) => allUsers.find((u) => u.id === id))
    .filter(Boolean) as typeof allUsers;

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
            <View style={styles.memberGroup}>
              <Text style={styles.memberGroupTitle}>You</Text>
              <MembersItem
                avatar={<Avatar type="Image" size="Lg" />}
                name={CURRENT_USER.name}
                description="That's you!"
                showIcon={selectedAdminIds.has(CURRENT_USER.id)}
                icon={({ size }) => (
                  <Icon type="check" color={colors.icon.bold} size={size} />
                )}
                onPress={() => toggleAdmin(CURRENT_USER.id)}
              />
            </View>

            {/* Friends — no add-friend icon, show check if selected */}
            {filteredFriends.length > 0 && (
              <View style={styles.memberGroup}>
                <Text style={styles.memberGroupTitle}>Friends</Text>
                {filteredFriends.map((user) => (
                  <MembersItem
                    key={user.id}
                    avatar={<Avatar type="Image" size="Lg" />}
                    name={user.name}
                    description={FRIEND_DESCRIPTIONS[user.id] ?? user.handle}
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
                      SUGGESTION_DESCRIPTIONS[user.id] ?? user.handle
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
    </View>
  );

  const renderLocationModal = () => (
    <Modal
      visible={locationExpanded}
      transparent
      animationType="fade"
      onRequestClose={() => setLocationExpanded(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setLocationExpanded(false)} />
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
              onPress={() => setLocationExpanded(false)}
            />
          </View>

          <View style={styles.modalSearchWrap}>
            <Search
              value={locationSearch}
              onChangeText={setLocationSearch}
              placeholder="Search Location"
            />
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {Object.entries(locationsByCity).map(([city, locs]) => (
              <View key={city} style={styles.memberGroup}>
                <Text style={styles.memberGroupTitle}>{city}</Text>
                {locs.map((loc) => (
                  <LocationItem
                    key={loc.id}
                    avatar={<Avatar type="Image" size="Lg" />}
                    name={loc.name}
                    description={loc.address}
                    selected={selectedLocationId === loc.id}
                    onPress={() => {
                      setSelectedLocationId(loc.id);
                      setLocationSearch('');
                    }}
                  />
                ))}
              </View>
            ))}
          </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
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
                    subtitle={club.sports}
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
        source={{ uri: 'https://picsum.photos/800/1200' }}
        style={styles.heroCover}
        resizeMode="cover"
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
                    setShowError(false);
                  }}
                />
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
                        setShowError(false);
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
                    setShowError(false);
                  }}
                  keyboardType="number-pad"
                />
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
                      onChangeText={setCapacity}
                      keyboardType="number-pad"
                    />
                    <Text style={styles.helperText}>
                      Set max number of attendees for your event
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom Action ──────────────────────────────────── */}
      <View style={styles.bottomActionWrap}>
        {showError && (
          <View style={styles.errorRow}>
            <Icon type="info" size={12} color={colors.icon.error} />
            <Text style={styles.errorText}>
              Please fill out Name, Date, Time and Fee
            </Text>
          </View>
        )}
        <View style={styles.bottomActionInner}>
          <View style={styles.bottomActionRow}>
            <Button
              emphasis="Bold"
              label="Create Event"
              leadingIcon={({ color, size }) => (
                <Icon type="add" size={size} color={color} />
              )}
              onPress={handleCreate}
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
    borderWidth: 0.5,
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
    borderWidth: 0.5,
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
    borderWidth: 0.5,
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
    borderWidth: 0.5,
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
    marginBottom: spacer['16'],
  },

  clubModalList: {
    gap: spacer['16'],
  },
});
