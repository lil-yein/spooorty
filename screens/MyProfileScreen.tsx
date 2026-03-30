/**
 * MyProfileScreen — logged-in user's profile (Figma node 1141:50021)
 *
 * Layout:
 *   Header: settings + edit icon buttons (top right, gap spacer/8)
 *   Profile hero: Avatar Xl + camera overlay, name, handle, stats
 *   Club section: title + "See All" + CardLg list
 *   Friends section: title + Search + MembersItem list
 *   Friend Suggestion: title + Search + alphabetical MembersItem list
 *
 * Data: fetches profile, clubs, friends from Supabase.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import {
  Avatar,
  Button,
  ClubCardLg,
  CoverPhotoModal,
  Divider,
  Icon,
  MembersItem,
  Search,
} from '../components/ui';
import { useCurrentProfile } from '../lib/hooks/useProfile';
import { useMyClubs } from '../lib/hooks/useClubs';
import { useMyFriends, useMyFriendCount } from '../lib/hooks/useFriendships';
import { useAuth } from '../lib/AuthContext';
import { clubToCardProps } from '../lib/api/transforms';
import { uploadAvatar, uriToBlob, detectContentType, isRemoteUrl } from '../lib/api/storage';
import { updateCurrentUserProfile } from '../lib/api/users';
import type { DbUser } from '../lib/database/types';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// ─── Component ──────────────────────────────────────────

export default function MyProfileScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [friendSearch, setFriendSearch] = useState('');
  const [cardStates, setCardStates] = useState<Record<string, 'Pending' | 'Joined'>>({});
  const [showAllClubs, setShowAllClubs] = useState(false);
  const [pendingRequestIds, setPendingRequestIds] = useState<Set<string>>(new Set());
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // Fetch real data
  const { data: profile, loading: profileLoading } = useCurrentProfile();
  const { data: dbClubs, loading: clubsLoading } = useMyClubs();
  const { data: friends, loading: friendsLoading } = useMyFriends();
  const { data: friendCount } = useMyFriendCount();

  // Transform clubs to card props
  const clubs = useMemo(
    () => (dbClubs ?? []).map((club, i) => clubToCardProps(club, i)),
    [dbClubs],
  );

  // Filtered friends
  const filteredFriends = useMemo(() => {
    if (!friends) return [];
    if (!friendSearch.trim()) return friends;
    const q = friendSearch.toLowerCase();
    return friends.filter((f) => f.display_name.toLowerCase().includes(q));
  }, [friends, friendSearch]);

  const handleCtaPress = useCallback((id: string, adminApproval?: boolean) => {
    setCardStates((prev) => {
      const current = prev[id];
      if (current === 'Joined') {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      if (current === 'Pending') return prev;
      return { ...prev, [id]: adminApproval ? 'Pending' : 'Joined' };
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

  // Use uploaded avatar, then profile photo, then null (default)
  const currentAvatarUri = avatarUri ?? profile?.profile_photo_url ?? null;

  const handlePhotoSelected = useCallback(async (uri: string) => {
    setAvatarUri(uri); // show immediately in UI
    if (!user) return;
    try {
      let publicUrl: string;
      if (isRemoteUrl(uri)) {
        // Unsplash URL — store directly
        publicUrl = uri;
      } else {
        // Local file — upload to Supabase Storage
        const contentType = detectContentType(uri);
        const blob = await uriToBlob(uri);
        publicUrl = await uploadAvatar(user.id, blob, contentType);
      }
      await updateCurrentUserProfile({ profile_photo_url: publicUrl });
    } catch (err) {
      console.warn('Avatar upload failed:', err);
      Alert.alert('Upload Failed', 'Could not update your profile photo. Please try again.');
    }
  }, [user]);

  const displayName = profile?.display_name ?? 'User';
  const handle = profile?.social_handle ?? '';
  const clubCount = clubs.length;

  if (profileLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.text.subtle} />
      </View>
    );
  }

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
            <Avatar
              type="Image"
              size="Xl"
              source={currentAvatarUri ? { uri: currentAvatarUri } : undefined}
            />
            <View style={styles.cameraOverlay}>
              <Button
                emphasis="Subtle"
                content="Icon"
                size="Sm"
                icon={({ color, size }) => (
                  <Icon type="add image" size={size} color={color} />
                )}
                onPress={() => setPhotoModalVisible(true)}
              />
            </View>
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
          {handle ? (
            <View style={styles.handleRow}>
              <Icon type="Instagram" size={12} color={colors.icon.bold} />
              <Text style={styles.profileHandle}>{handle}</Text>
            </View>
          ) : null}
          <View style={styles.statsRow}>
            <Pressable style={styles.statsItem}>
              <Icon type="people" size={12} color={colors.icon.subtle} />
              <Text style={styles.statsText}>
                {friendCount ?? 0} friends
              </Text>
            </Pressable>
            <Text style={styles.statsDot}> · </Text>
            <Pressable style={styles.statsItem}>
              <Icon type="soccer" size={12} color={colors.icon.subtle} />
              <Text style={styles.statsText}>
                {clubCount} clubs
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
          {clubsLoading ? (
            <ActivityIndicator size="small" color={colors.text.subtle} />
          ) : (
            <View style={styles.cardsList}>
              {(showAllClubs ? clubs : clubs.slice(0, 2)).map((club) => (
                <ClubCardLg
                  key={club.id}
                  name={club.name}
                  members={club.members}
                  sports={club.sports}
                  location={club.location}
                  level={club.level}
                  avatar={
                    <Avatar type="Image" size="Lg" showCount count={3} />
                  }
                  price={club.price}
                  state={cardStates[club.id] ?? 'Enabled'}
                  ctaLabel={club.ctaLabel}
                  ctaColor={club.ctaColor}
                  ctaTextColor={club.ctaTextColor}
                  adminApproval={club.adminApproval}
                  onCtaPress={() => handleCtaPress(club.id, club.adminApproval)}
                  onPress={() => navigation.navigate('Club', { clubId: club.id })}
                />
              ))}
            </View>
          )}
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
            {friendsLoading ? (
              <ActivityIndicator size="small" color={colors.text.subtle} />
            ) : (
              <View style={styles.membersList}>
                {filteredFriends.map((friend) => (
                  <MembersItem
                    key={friend.id}
                    avatar={<Avatar type="Image" size="Lg" />}
                    name={friend.display_name}
                    showIcon={false}
                    onPress={() => navigateToUser(friend.id)}
                  />
                ))}
                {filteredFriends.length === 0 && (
                  <Text style={styles.emptyText}>No friends yet</Text>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* ── Photo picker modal ───────────────────────────── */}
      <CoverPhotoModal
        visible={photoModalVisible}
        onClose={() => setPhotoModalVisible(false)}
        onImageSelected={handlePhotoSelected}
        context="club"
      />
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

  sectionTitle: {
    ...textStyles.title01Medium,
    color: colors.text.bold,
  },

  cardsList: {
    gap: spacer['24'],
  },

  dividerFullWidth: {
    marginTop: spacer['24'],
  },

  sectionBody: {
    gap: spacer['24'],
  },

  membersList: {
    gap: spacer['12'],
  },

  emptyText: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
    textAlign: 'center',
    paddingVertical: spacer['12'],
  },
});
