/**
 * MyProfileScreen — logged-in user's profile (Figma node 1141:50021)
 *
 * Layout:
 *   Header: settings + edit icon buttons (top right, gap spacer/8)
 *   Profile hero: Avatar Xl + camera overlay, name, handle, stats
 *   Club section: title + "See All" + CardLg list
 *   Friends section: title + Search + MembersItem list
 *   Friend Suggestion: title + Search + alphabetical MembersItem list
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import {
  Avatar,
  Button,
  CardLg,
  Divider,
  Icon,
  MembersItem,
  Search,
} from '../components/ui';
import {
  CURRENT_USER,
  FRIEND_DESCRIPTIONS,
  SUGGESTION_DESCRIPTIONS,
  getUserClubs,
  getFriends,
  getFriendSuggestions,
  type UserProfile,
} from '../lib/data/mockData';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// ─── Component ──────────────────────────────────────────

export default function MyProfileScreen() {
  const navigation = useNavigation<any>();
  const [friendSearch, setFriendSearch] = useState('');
  const [suggestionSearch, setSuggestionSearch] = useState('');
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [showAllClubs, setShowAllClubs] = useState(false);
  const [pendingRequestIds, setPendingRequestIds] = useState<Set<string>>(new Set());

  const clubs = useMemo(() => getUserClubs(CURRENT_USER.id), []);
  const friends = useMemo(() => getFriends(), []);
  const suggestions = useMemo(() => getFriendSuggestions(), []);

  // Filtered lists
  const filteredFriends = useMemo(() => {
    if (!friendSearch.trim()) return friends;
    const q = friendSearch.toLowerCase();
    return friends.filter((f) => f.name.toLowerCase().includes(q));
  }, [friends, friendSearch]);

  const filteredSuggestions = useMemo(() => {
    let list = suggestions;
    if (suggestionSearch.trim()) {
      const q = suggestionSearch.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    // Group alphabetically
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [suggestions, suggestionSearch]);

  // Group suggestions by first letter
  const groupedSuggestions = useMemo(() => {
    const groups: { letter: string; users: UserProfile[] }[] = [];
    let current: { letter: string; users: UserProfile[] } | null = null;
    filteredSuggestions.forEach((u) => {
      const letter = u.name[0].toUpperCase();
      if (!current || current.letter !== letter) {
        current = { letter, users: [] };
        groups.push(current);
      }
      current.users.push(u);
    });
    return groups;
  }, [filteredSuggestions]);

  const handleCtaPress = useCallback((id: string) => {
    setJoinedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSendFriendRequest = useCallback((userId: string) => {
    setPendingRequestIds((prev) => {
      const next = new Set(prev);
      next.add(userId);
      return next;
    });
  }, []);

  const navigateToUser = useCallback(
    (userId: string) => {
      navigation.navigate('OtherUserProfile', { userId });
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Header Row ─────────────────────────────────── */}
        <View style={styles.headerRow}>
          <View style={styles.headerSpacer} />
          <View style={styles.headerButtons}>
            <Button
              emphasis="Subtle"
              content="Icon"
              size="Sm"
              icon={({ color, size }) => (
                <Icon type="edit" size={size} color={color} />
              )}
            />
            <Button
              emphasis="Subtle"
              content="Icon"
              size="Sm"
              icon={({ color, size }) => (
                <Icon type="setting" size={size} color={color} />
              )}
            />
          </View>
        </View>

        {/* ── Profile Hero ───────────────────────────────── */}
        <View style={styles.profileHero}>
          <View style={styles.avatarContainer}>
            <Avatar type="Image" size="Xl" />
            <View style={styles.cameraOverlay}>
              <Button
                emphasis="Subtle"
                content="Icon"
                size="Sm"
                icon={({ color, size }) => (
                  <Icon type="camera" size={size} color={color} />
                )}
              />
            </View>
          </View>
          <Text style={styles.profileName}>{CURRENT_USER.name}</Text>
          <View style={styles.handleRow}>
            <Icon type="Instagram" size={12} color={colors.icon.bold} />
            <Text style={styles.profileHandle}>{CURRENT_USER.handle}</Text>
          </View>
          <View style={styles.statsRow}>
            <Pressable style={styles.statsItem}>
              <Icon type="people" size={12} color={colors.icon.subtle} />
              <Text style={styles.statsText}>
                {CURRENT_USER.friendIds.length} friends
              </Text>
            </Pressable>
            <Text style={styles.statsDot}> · </Text>
            <Pressable style={styles.statsItem}>
              <Icon type="soccer" size={12} color={colors.icon.subtle} />
              <Text style={styles.statsText}>
                {CURRENT_USER.clubIds.length} clubs
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ── Divider: stats → Club ────────────────────── */}
        <View style={styles.dividerFullWidth}>
          <Divider emphasis="Subtle" />
        </View>

        {/* ── Club Section ───────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Club</Text>
          <View style={styles.cardsList}>
            {(showAllClubs ? clubs : clubs.slice(0, 2)).map((club) => (
              <CardLg
                key={club.id}
                name={club.name}
                dateTime={club.dateTime}
                location={club.location}
                level={club.level}
                avatar={
                  <Avatar type="Image" size="Lg" showCount count={3} />
                }
                mutualHighlight={club.mutualHighlight}
                mutualBody={club.mutualBody}
                price={club.price}
                state={joinedIds.has(club.id) ? 'Joined' : 'Enabled'}
                ctaLabel={club.ctaLabel}
                ctaColor={club.ctaColor}
                ctaTextColor={club.ctaTextColor}
                onCtaPress={() => handleCtaPress(club.id)}
                onPress={() => navigation.navigate('Club', { clubId: club.id })}
              />
            ))}
          </View>
          {clubs.length > 2 && (
            <Button
              emphasis="Subtle"
              content="Text"
              size="Md"
              label={showAllClubs ? 'Show Less' : 'See All'}
              onPress={() => setShowAllClubs((prev) => !prev)}
            />
          )}
        </View>

        <View style={styles.dividerFullWidth}>
          <Divider emphasis="Subtle" />
        </View>

        {/* ── Friends Section ────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Friends</Text>
          <View style={styles.sectionBody}>
            <Search
              value={friendSearch}
              onChangeText={setFriendSearch}
              placeholder="Search Friends"
            />
            <View style={styles.membersList}>
              {filteredFriends.map((friend) => (
                <MembersItem
                  key={friend.id}
                  avatar={<Avatar type="Image" size="Lg" />}
                  name={friend.name}
                  description={FRIEND_DESCRIPTIONS[friend.id]}
                  showIcon={false}
                  onPress={() => navigateToUser(friend.id)}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.dividerFullWidth}>
          <Divider emphasis="Subtle" />
        </View>

        {/* ── Friend Suggestion Section ──────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Friend Suggestion</Text>
          <View style={styles.sectionBody}>
            <Search
              value={suggestionSearch}
              onChangeText={setSuggestionSearch}
              placeholder="Search people"
            />
            <View style={styles.suggestionContainer}>
              {/* Members list */}
              <View style={styles.suggestionList}>
                {groupedSuggestions.map((group) => (
                  <View key={group.letter} style={styles.groupBlock}>
                    <Text style={styles.groupLetter}>{group.letter}</Text>
                    {group.users.map((user) => {
                      const isPending = pendingRequestIds.has(user.id);
                      return (
                        <MembersItem
                          key={user.id}
                          avatar={<Avatar type="Image" size="Lg" />}
                          name={user.name}
                          description={
                            SUGGESTION_DESCRIPTIONS[user.id] ?? 'From your contacts'
                          }
                          showIcon
                          icon={({ size }) =>
                            isPending ? (
                              <Icon
                                type="clock"
                                size={size}
                                color={colors.icon.subtle}
                              />
                            ) : (
                              <Icon
                                type="add friend"
                                size={size}
                                color={colors.icon.bold}
                              />
                            )
                          }
                          onIconPress={
                            isPending
                              ? undefined
                              : () => handleSendFriendRequest(user.id)
                          }
                          onPress={() => navigateToUser(user.id)}
                        />
                      );
                    })}
                  </View>
                ))}
              </View>

              {/* Alphabet navigator */}
              <View style={styles.alphabetNav}>
                <View style={styles.alphabetTrack} />
                <View style={styles.alphabetLetters}>
                  {ALPHABET.map((letter) => {
                    const isActive = groupedSuggestions.some(
                      (g) => g.letter === letter,
                    );
                    return (
                      <Text
                        key={letter}
                        style={[
                          styles.alphabetLetter,
                          isActive && styles.alphabetLetterActive,
                        ]}
                      >
                        {letter}
                      </Text>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.bold,
  },

  content: {
    paddingTop: spacer['64'],
    paddingBottom: 94,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacer['24'],
  },

  headerSpacer: {
    flex: 1,
  },

  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
  },

  // Profile hero
  profileHero: {
    alignItems: 'center',
    paddingHorizontal: spacer['24'],
    marginTop: spacer['24'],
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: spacer['24'],
  },

  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  profileName: {
    ...textStyles.headline02Light,
    color: colors.text.bold,
    textAlign: 'center',
  },

  handleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['4'],
    marginTop: spacer['8'],
  },

  profileHandle: {
    ...textStyles.body03Light,
    color: colors.text.bold,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacer['8'],
  },

  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['4'],
  },

  statsText: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
  },

  statsDot: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
  },

  // Sections
  section: {
    paddingHorizontal: spacer['24'],
    marginTop: spacer['24'],
    gap: spacer['24'],
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    ...textStyles.title01Medium,
    color: colors.text.bold,
  },

  seeAll: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
  },

  cardsList: {
    gap: spacer['24'],
  },

  dividerFullWidth: {
    marginTop: spacer['24'],
  },

  sectionBody: {
    gap: spacer['12'],
  },

  membersList: {
    gap: spacer['12'],
  },

  suggestionContainer: {
    flexDirection: 'row',
  },

  suggestionList: {
    flex: 1,
    gap: spacer['12'],
  },

  groupBlock: {
    gap: spacer['12'],
  },

  groupLetter: {
    ...textStyles.title02Medium,
    color: colors.text.bold,
  },

  // Alphabet navigator
  alphabetNav: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginLeft: spacer['8'],
    gap: spacer['4'],
  },

  alphabetTrack: {
    width: 0.5,
    backgroundColor: colors.border.subtle,
  },

  alphabetLetters: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacer['4'],
  },

  alphabetLetter: {
    fontSize: 8,
    lineHeight: 8,
    color: colors.text.subtle,
    textAlign: 'center',
  },

  alphabetLetterActive: {
    color: colors.text.bold,
  },
});
