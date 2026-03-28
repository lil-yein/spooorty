/**
 * CreateClubScreen — form to create a new club
 *
 * Layout:
 *   Hero cover (full viewport, gray placeholder / user-picked image)
 *   Top nav: back button (left), camera edit button (right, below hero)
 *   Section 1: Club Name, Sports, Location (city search), Admin, Fee (all in one card)
 *   Section 2: Invite Members (separate card)
 *   Section 3: Levels
 *   Section 4: Description
 *   Section 5: Other Settings (expandable) — Vibe, Color Theme,
 *              Public/Private, Admin Approval, Capacity
 *   Bottom action: "Create Club" button + error state
 */

import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  SectionList,
  Pressable,
  Modal,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  type ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer, borderRadius } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import {
  Avatar,
  Button,
  ColorPicker,
  CoverPhotoModal,
  Divider,
  Icon,
  Levels,
  MembersItem,
  Search,
  SearchContentItem,
  LocationSearchModal,
  Switch,
  Tag,
} from '../components/ui';
import type { SelectedLocation } from '../components/ui/LocationSearchModal';
import {
  CURRENT_USER,
  CLUBS,
  USERS,
  SPORTS,
  getFriends,
  getFriendSuggestions,
  FRIEND_DESCRIPTIONS,
  SUGGESTION_DESCRIPTIONS,
} from '../lib/data/mockData';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const VIBE_OPTIONS = ['Casual', 'Competitive', 'Teamwork', 'Professional'];

// ─── Alphabet ───────────────────────────────────────────
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// ─── Sports helpers ─────────────────────────────────────
type SportsSection = { title: string; data: string[] };

function groupByLetter(items: string[]): SportsSection[] {
  const map = new Map<string, string[]>();
  items.forEach((item) => {
    const letter = item[0].toUpperCase();
    if (!map.has(letter)) map.set(letter, []);
    map.get(letter)!.push(item);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([title, data]) => ({ title, data }));
}

// ─── Component ──────────────────────────────────────────

export default function CreateClubScreen() {
  const navigation = useNavigation<any>();

  // ── Form state ──
  const [coverImageUri, setCoverImageUri] = useState<string | null>(null);
  const [coverModalVisible, setCoverModalVisible] = useState(false);
  const [clubName, setClubName] = useState('');

  // Sports
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [sportsModalVisible, setSportsModalVisible] = useState(false);
  const [sportsSearch, setSportsSearch] = useState('');

  // Location (Google Places)
  const [locationExpanded, setLocationExpanded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

  // Fee
  const [isYearlyFee, setIsYearlyFee] = useState(false);
  const [feeValue, setFeeValue] = useState('');

  // Levels
  const [levelIndicator, setLevelIndicator] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Description
  const [description, setDescription] = useState('');

  // Invite Members
  const [memberSearch, setMemberSearch] = useState('');
  const [memberExpanded, setMemberExpanded] = useState(false);
  const [invitedMemberIds, setInvitedMemberIds] = useState<Set<string>>(
    new Set(),
  );
  const [sentInviteIds, setSentInviteIds] = useState<Set<string>>(new Set());

  // Admin
  const [adminSearch, setAdminSearch] = useState('');
  const [adminExpanded, setAdminExpanded] = useState(false);
  const [selectedAdminIds, setSelectedAdminIds] = useState<Set<string>>(
    new Set(),
  );

  // Other Settings
  const [otherSettingsOpen, setOtherSettingsOpen] = useState(true);
  const [selectedVibe, setSelectedVibe] = useState('Casual');
  const [ctaColor, setCtaColor] = useState('#000000');
  const [colorHue, setColorHue] = useState(0);
  const [isPublic, setIsPublic] = useState(false);
  const [adminApproval, setAdminApproval] = useState(false);
  const [capacity, setCapacity] = useState('');

  // Validation
  const [showError, setShowError] = useState(false);

  // Sports SectionList ref
  const sportsSectionListRef = useRef<SectionList>(null);

  // ── Helpers ──

  const allUsers = [CURRENT_USER, ...USERS];

  const friends = getFriends();
  const otherMembers = getFriendSuggestions();

  const filteredFriends = memberSearch.trim()
    ? friends.filter((u) =>
        u.name.toLowerCase().includes(memberSearch.toLowerCase()),
      )
    : friends;

  const filteredOtherMembers = memberSearch.trim()
    ? otherMembers.filter((u) =>
        u.name.toLowerCase().includes(memberSearch.toLowerCase()),
      )
    : otherMembers;

  const invitedMemberUsers = Array.from(invitedMemberIds)
    .map((id) => allUsers.find((u) => u.id === id))
    .filter(Boolean) as typeof allUsers;

  // Sports filtering
  const filteredSports = useMemo(
    () =>
      sportsSearch.length === 0
        ? SPORTS
        : SPORTS.filter((s) =>
            s.toLowerCase().includes(sportsSearch.toLowerCase()),
          ),
    [sportsSearch],
  );

  const sportsSections = useMemo(
    () => groupByLetter(filteredSports),
    [filteredSports],
  );

  const activeSportsLetters = useMemo(
    () => new Set(sportsSections.map((s) => s.title)),
    [sportsSections],
  );

  const toggleSport = useCallback((sport: string) => {
    setSelectedSports((prev) => {
      if (prev.includes(sport)) {
        return prev.filter((s) => s !== sport);
      } else {
        return [...prev, sport];
      }
    });
  }, []);

  const handleSportsAlphabetPress = useCallback(
    (letter: string) => {
      const index = sportsSections.findIndex((s) => s.title === letter);
      if (index >= 0 && sportsSectionListRef.current) {
        sportsSectionListRef.current.scrollToLocation({
          sectionIndex: index,
          itemIndex: 0,
          animated: true,
        });
      }
    },
    [sportsSections],
  );

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

  const selectedAdminUsers = Array.from(selectedAdminIds)
    .map((id) => allUsers.find((u) => u.id === id))
    .filter(Boolean) as typeof allUsers;

  const selectedAdminNames = selectedAdminUsers
    .map((u) => u.name)
    .join(', ');

  const filteredAdminFriends = adminSearch.trim()
    ? friends.filter((u) =>
        u.name.toLowerCase().includes(adminSearch.toLowerCase()),
      )
    : friends;

  const filteredAdminOtherMembers = adminSearch.trim()
    ? otherMembers.filter((u) =>
        u.name.toLowerCase().includes(adminSearch.toLowerCase()),
      )
    : otherMembers;

  const toggleMember = (userId: string) => {
    setInvitedMemberIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleInvite = (userId: string) => {
    const alreadySent = sentInviteIds.has(userId);
    setInvitedMemberIds((prev) => {
      const next = new Set(prev);
      if (alreadySent) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
    setSentInviteIds((prev) => {
      const next = new Set(prev);
      if (alreadySent) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleColorHueChange = useCallback((hue: number) => {
    setColorHue(hue);
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
    if (!clubName.trim() || !feeValue.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);

    const locationName = selectedLocation?.name ?? 'TBD';

    const memberCount = invitedMemberIds.size + 1; // +1 for creator

    const newClub = {
      id: `club-new-${Date.now()}`,
      name: clubName.toUpperCase(),
      members: `${memberCount} Member${memberCount > 1 ? 's' : ''}`,
      location: locationName,
      level: levelIndicator as 1 | 2 | 3 | 4 | 5,
      mutualHighlight: `${CURRENT_USER.name.split(' ')[0]}`,
      mutualBody: 'is the admin',
      price: `$${feeValue}`,
      ctaLabel: 'Join Club',
      ctaColor: ctaColor,
      ctaTextColor: colors.text.onhighlight,
    };

    CLUBS.push(newClub);

    navigation.navigate('Discover', {
      screen: 'Club',
      params: { clubId: newClub.id },
    });
  }, [
    clubName,
    feeValue,
    selectedLocation,
    invitedMemberIds,
    levelIndicator,
    ctaColor,
    navigation,
  ]);

  // ── Render helpers ──

  const renderLocationModal = () => (
    <LocationSearchModal
      visible={locationExpanded}
      onClose={() => setLocationExpanded(false)}
      onLocationSelected={(loc) => setSelectedLocation(loc)}
      placeholder="Search City or Address"
    />
  );

  const renderSportsModal = () => (
    <Modal
      visible={sportsModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setSportsModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setSportsModalVisible(false)}
        />
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
                onPress={() => setSportsModalVisible(false)}
              />
            </View>

            <View style={styles.modalSearchWrap}>
              <Search
                value={sportsSearch}
                onChangeText={setSportsSearch}
                placeholder="Search Type of Organization"
              />
            </View>

            {/* Body: SectionList + Alphabet sidebar */}
            <View style={styles.sportsBody}>
              <SectionList
                ref={sportsSectionListRef}
                style={styles.sportsSectionList}
                sections={sportsSections}
                keyExtractor={(item) => item}
                stickySectionHeadersEnabled={false}
                renderSectionHeader={({ section }) => (
                  <Text style={styles.sportsSectionHeader}>{section.title}</Text>
                )}
                renderItem={({ item }) => (
                  <SearchContentItem
                    label={item}
                    selected={selectedSports.includes(item)}
                    onPress={() => toggleSport(item)}
                  />
                )}
                renderSectionFooter={() => (
                  <View style={styles.sportsSectionFooter} />
                )}
                ItemSeparatorComponent={() => (
                  <View style={styles.sportsItemGap} />
                )}
                contentContainerStyle={styles.sportsListContent}
                getItemLayout={undefined}
                onScrollToIndexFailed={() => {}}
              />

              {/* Alphabet sidebar */}
              <View style={styles.alphabetSidebar}>
                <View style={styles.alphabetLine} />
                <View style={styles.alphabetLetters}>
                  {ALPHABET.map((letter) => {
                    const isActive = activeSportsLetters.has(letter);
                    return (
                      <Pressable
                        key={letter}
                        onPress={() => handleSportsAlphabetPress(letter)}
                        hitSlop={4}
                      >
                        <Text
                          style={[
                            styles.alphabetLetter,
                            isActive && styles.alphabetLetterActive,
                          ]}
                        >
                          {letter}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderMemberModal = () => (
    <Modal
      visible={memberExpanded}
      transparent
      animationType="fade"
      onRequestClose={() => setMemberExpanded(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setMemberExpanded(false)}
        />
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
                onPress={() => setMemberExpanded(false)}
              />
            </View>

            <View style={styles.modalSearchChipsWrap}>
              <Search
                value={memberSearch}
                onChangeText={setMemberSearch}
                placeholder="Search Members to Invite"
              />
              {invitedMemberUsers.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.selectedScrollContent}
                >
                  {invitedMemberUsers.map((user) => (
                    <Pressable
                      key={user.id}
                      style={styles.memberChip}
                      onPress={() => toggleMember(user.id)}
                    >
                      <Avatar type="Image" size="Lg" />
                      <Text style={styles.memberChipName} numberOfLines={1}>
                        {user.name.split(' ')[0]}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Friends */}
              {filteredFriends.length > 0 && (
                <View style={styles.memberGroup}>
                  <Text style={styles.memberGroupTitle}>Friends</Text>
                  {filteredFriends.map((user) => {
                    const isSent = sentInviteIds.has(user.id);
                    const isInvited = invitedMemberIds.has(user.id);
                    return (
                      <View key={user.id} style={styles.inviteRow}>
                        <View style={styles.inviteRowContent}>
                          <Avatar type="Image" size="Lg" />
                          <View style={styles.inviteTextCol}>
                            <Text style={styles.inviteName} numberOfLines={1}>
                              {user.name}
                            </Text>
                            <Text
                              style={styles.inviteDescription}
                              numberOfLines={1}
                            >
                              {FRIEND_DESCRIPTIONS[user.id] ?? user.handle}
                            </Text>
                          </View>
                        </View>
                        {isSent ? (
                          <Pressable
                            style={styles.sentButton}
                            onPress={() => handleInvite(user.id)}
                          >
                            <Text style={styles.sentButtonText}>Sent</Text>
                          </Pressable>
                        ) : (
                          <Pressable
                            style={styles.inviteButton}
                            onPress={() => handleInvite(user.id)}
                          >
                            <Text style={styles.inviteButtonText}>Invite</Text>
                          </Pressable>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Other Members */}
              {filteredOtherMembers.length > 0 && (
                <View style={styles.memberGroup}>
                  <Text style={styles.memberGroupTitle}>Other Members</Text>
                  {filteredOtherMembers.map((user) => {
                    const isSent = sentInviteIds.has(user.id);
                    const isInvited = invitedMemberIds.has(user.id);
                    return (
                      <View key={user.id} style={styles.inviteRow}>
                        <View style={styles.inviteRowContent}>
                          <Avatar type="Image" size="Lg" />
                          <View style={styles.inviteTextCol}>
                            <Text style={styles.inviteName} numberOfLines={1}>
                              {user.name}
                            </Text>
                            <Text
                              style={styles.inviteDescription}
                              numberOfLines={1}
                            >
                              {SUGGESTION_DESCRIPTIONS[user.id] ?? user.handle}
                            </Text>
                          </View>
                        </View>
                        {isSent ? (
                          <Pressable
                            style={styles.sentButton}
                            onPress={() => handleInvite(user.id)}
                          >
                            <Text style={styles.sentButtonText}>Sent</Text>
                          </Pressable>
                        ) : (
                          <Pressable
                            style={styles.inviteButton}
                            onPress={() => handleInvite(user.id)}
                          >
                            <Text style={styles.inviteButtonText}>Invite</Text>
                          </Pressable>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
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
        context="club"
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

          {/* ── Section 1: Club Info (Name + Sports + Location + Admin + Fee) ── */}
          <View style={styles.cardOuter}>
            <View style={styles.cardInner}>
              {/* Club Name */}
              <View style={styles.titleInputWrap}>
                <TextInput
                  style={[
                    styles.titleInput,
                    !clubName ? styles.titleInputPlaceholder : null,
                  ]}
                  placeholder="Club Name"
                  placeholderTextColor={colors.text.subtle}
                  value={clubName}
                  onChangeText={(text) => {
                    setClubName(text);
                    setShowError(false);
                  }}
                />
              </View>

              <Divider />

              {/* Sports */}
              <View style={styles.fieldSection}>
                <Text style={styles.fieldLabel}>Type</Text>
                <Pressable onPress={() => setSportsModalVisible(true)}>
                  <View pointerEvents="none">
                    <Search
                      value={selectedSports.length > 0 ? selectedSports.join(', ') : ''}
                      onChangeText={() => {}}
                      placeholder="Search Type of Organization"
                      editable={false}
                    />
                  </View>
                </Pressable>
              </View>

              <Divider />

              {/* Location (Google Places) */}
              <View style={styles.fieldSection}>
                <Text style={styles.fieldLabel}>Location</Text>
                <Pressable onPress={() => setLocationExpanded(true)}>
                  <View style={styles.inputFullWidth}>
                    <Search
                      value={selectedLocation?.name ?? ''}
                      onChangeText={() => {}}
                      placeholder="Search City or Address"
                      editable={false}
                    />
                  </View>
                </Pressable>
                {selectedLocation?.address ? (
                  <Text style={styles.locationAddress}>{selectedLocation.address}</Text>
                ) : null}
              </View>

              <Divider />

              {/* Admin */}
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

          {/* ── Section 2: Invite Members (separate card) ──── */}
          <View style={styles.cardOuter}>
            <View style={styles.cardInner}>
              <View style={styles.fieldSection}>
                <Text style={styles.fieldLabel}>Invite Members</Text>
                <Pressable onPress={() => setMemberExpanded(true)}>
                  <View style={styles.inputFullWidth}>
                    <Search
                      value={
                        invitedMemberUsers.length > 0
                          ? invitedMemberUsers
                              .map((u) => u.name)
                              .join(', ')
                          : ''
                      }
                      onChangeText={() => {}}
                      placeholder="Search Members to Invite"
                      editable={false}
                    />
                  </View>
                </Pressable>
              </View>
            </View>
          </View>

          {/* ── Section 3: Levels ──────────────────────────── */}
          <View style={styles.cardOuter}>
            <View style={[styles.cardInner, { borderBottomWidth: 0 }]}>
              <View style={styles.levelsWrap}>
                <Levels indicator={levelIndicator} onSelect={setLevelIndicator} />
              </View>
            </View>
          </View>

          {/* ── Section 4: Description ─────────────────────── */}
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

          {/* ── Section 5: Other Settings ──────────────────── */}
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
                      Anyone can discover your club vs. Shared link only
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
                      Anyone can join your club vs. Need admin approval
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
                      Set max number of members for your club
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
              Please fill out Name and Fee
            </Text>
          </View>
        )}
        <View style={styles.bottomActionInner}>
          <View style={styles.bottomActionRow}>
            <Button
              emphasis="Bold"
              label="Create Club"
              leadingIcon={({ color, size }) => (
                <Icon type="add" size={size} color={color} />
              )}
              onPress={handleCreate}
            />
          </View>
        </View>
      </View>

      {/* ── Modals ──────────────────────────────────────────── */}
      {renderLocationModal()}
      {renderSportsModal()}
      {renderMemberModal()}

      {/* Admin modal */}
      <Modal
        visible={adminExpanded}
        transparent
        animationType="fade"
        onRequestClose={() => setAdminExpanded(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setAdminExpanded(false)}
          />
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
                  onPress={() => setAdminExpanded(false)}
                />
              </View>

              <View style={styles.modalSearchChipsWrap}>
                <Search
                  value={adminSearch}
                  onChangeText={setAdminSearch}
                  placeholder="Search Members for Admin"
                />
                {selectedAdminUsers.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.selectedScrollContent}
                  >
                    {selectedAdminUsers.map((user) => (
                      <Pressable
                        key={user.id}
                        style={styles.memberChip}
                        onPress={() => toggleAdmin(user.id)}
                      >
                        <Avatar type="Image" size="Lg" />
                        <Text style={styles.memberChipName} numberOfLines={1}>
                          {user.name.split(' ')[0]}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
              </View>

              <ScrollView
                style={styles.modalScroll}
                showsVerticalScrollIndicator={false}
              >
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

                {/* Friends */}
                {filteredAdminFriends.length > 0 && (
                  <View style={styles.memberGroup}>
                    <Text style={styles.memberGroupTitle}>Friends</Text>
                    {filteredAdminFriends.map((user) => (
                      <MembersItem
                        key={user.id}
                        avatar={<Avatar type="Image" size="Lg" />}
                        name={user.name}
                        description={
                          FRIEND_DESCRIPTIONS[user.id] ?? user.handle
                        }
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
                {filteredAdminOtherMembers.length > 0 && (
                  <View style={styles.memberGroup}>
                    <Text style={styles.memberGroupTitle}>Other Members</Text>
                    {filteredAdminOtherMembers.map((user) => (
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

  // Sports search input (pill-shaped)
  sportsSearchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
    borderWidth: 0.5,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacer['12'],
    paddingVertical: spacer['12'],
    height: 36,
  },

  sportsSearchText: {
    ...textStyles.body03Light,
    color: colors.text.bold,
    flex: 1,
  },

  sportsSearchPlaceholder: {
    color: colors.text.subtle,
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

  // Tags 2x2 grid
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

  // Invite chips (shown below search in section)
  inviteChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacer['8'],
  },

  // Modal overlay for city/member
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

  // Horizontal scroll for selected user chips (no flexWrap)
  selectedScrollContent: {
    flexDirection: 'row',
    gap: spacer['8'],
  },

  memberChip: {
    alignItems: 'center',
    gap: spacer['8'],
  },

  memberChipName: {
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

  // City list
  cityList: {
    gap: spacer['24'],
  },

  // Sports modal styles
  sportsBody: {
    flex: 1,
    flexDirection: 'row',
  },

  sportsSectionList: {
    flex: 1,
  },

  sportsListContent: {
    paddingBottom: spacer['24'],
    paddingRight: spacer['8'],
  },

  sportsSectionHeader: {
    ...textStyles.title02Medium,
    color: colors.text.bold,
    marginBottom: spacer['12'],
  },

  sportsSectionFooter: {
    height: spacer['24'],
  },

  sportsItemGap: {
    height: spacer['12'],
  },

  // Alphabet sidebar
  alphabetSidebar: {
    width: 20,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacer['4'],
  },

  alphabetLine: {
    width: 0.5,
    height: '100%',
    backgroundColor: colors.border.subtle,
  },

  alphabetLetters: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 0,
  },

  alphabetLetter: {
    ...textStyles.body04Light,
    color: colors.text.subtle,
  },

  alphabetLetterActive: {
    color: colors.text.bold,
  },

  // Invite modal member item styles
  inviteRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['16'],
  },

  inviteRowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['16'],
  },

  inviteTextCol: {
    flex: 1,
    gap: spacer['4'],
    justifyContent: 'center',
  },

  inviteName: {
    ...textStyles.body01Light,
    color: colors.text.bold,
  },

  inviteDescription: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
  },

  inviteButton: {
    backgroundColor: colors.text.bold,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacer['10'],
    paddingVertical: spacer['10'],
    minWidth: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },

  inviteButtonText: {
    ...textStyles.body03Light,
    color: colors.text.inverse,
  },

  sentButton: {
    backgroundColor: colors.surface.bold,
    borderRadius: borderRadius.round,
    borderWidth: 0.5,
    borderColor: colors.border.subtle,
    paddingHorizontal: spacer['10'],
    paddingVertical: spacer['10'],
    minWidth: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sentButtonText: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
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
});
