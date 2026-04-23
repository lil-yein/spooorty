/**
 * OtherUserProfileScreen — viewing another user's profile
 * (Figma nodes 1141:50810, 1141:50921, 1141:51032)
 *
 * Layout:
 *   Header: back arrow (top left)
 *   Profile hero: Avatar Xl, name, handle
 *   Friend request action (send / pending / friends)
 *   Club section: CardLg list + "See All"
 *   Mutual Friends section: MembersItem list
 *
 * Data: fetches user profile, their clubs, friendship status,
 *       and mutual friends from Supabase.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Avatar, Button, ClubCardLg, Divider, Icon, MembersItem } from '../components/ui';
import { useUserProfile } from '../lib/hooks/useProfile';
import { useFriendshipStatus, useMutualFriends } from '../lib/hooks/useFriendships';
import { useSupabaseQuery } from '../lib/hooks/useSupabaseQuery';
import { getUserClubs } from '../lib/api/clubs';
import { clubToCardProps } from '../lib/api/transforms';
import type { ProfileStackParamList } from '../navigation/ProfileStack';

// ─── Component ──────────────────────────────────────────

export default function OtherUserProfileScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ProfileStackParamList, 'OtherUserProfile'>>();
  const { userId } = route.params;

  // Fetch real data
  const { data: userProfile, loading: profileLoading } = useUserProfile(userId);
  const { data: dbClubs, loading: clubsLoading } = useSupabaseQuery(
    () => getUserClubs(userId),
    [userId],
  );
  const { data: friendship, sendRequest, accept, decline, remove } = useFriendshipStatus(userId);
  const { data: mutualFriends, loading: mutualsLoading } = useMutualFriends(userId);

  const [cardStates, setCardStates] = useState<Record<string, 'Pending' | 'Joined'>>({});
  const [showAllClubs, setShowAllClubs] = useState(false);

  // Transform clubs
  const clubs = useMemo(
    () => (dbClubs ?? []).map((club, i) => clubToCardProps(club, i)),
    [dbClubs],
  );

  // Derive friendship status
  const friendshipStatus = useMemo(() => {
    if (!friendship) return 'none';
    if (friendship.status === 'accepted') return 'friends';
    if (friendship.status === 'pending') return 'pending';
    return 'none';
  }, [friendship]);

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

  const navigateToUser = useCallback(
    (targetId: string) => {
      navigation.push('OtherUserProfile', { userId: targetId });
    },
    [navigation],
  );

  if (profileLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.text.subtle} />
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Header Row ─────────────────────────────────── */}
        <View style={styles.headerRow}>
          <Button
            emphasis="Subtle"
            content="Icon"
            size="Sm"
            icon={({ color, size }) => (
              <Icon type="arrow backward" size={size} color={color} />
            )}
            onPress={() => navigation.goBack()}
          />
        </View>

        {/* ── Profile Hero ───────────────────────────────── */}
        <View style={styles.profileHero}>
          <Avatar type="Image" size="Xl" />
          <Text style={styles.profileName}>{userProfile.display_name}</Text>
          {userProfile.social_handle ? (
            <View style={styles.handleRow}>
              <Icon type="Instagram" size={16} color={colors.text.subtle} />
              <Text style={styles.profileHandle}>{userProfile.social_handle}</Text>
            </View>
          ) : null}
        </View>

        {/* ── Friend Request Action ──────────────────────── */}
        <View style={styles.actionSection}>
          {friendshipStatus === 'none' && (
            <Button
              emphasis="Bold"
              content="Text"
              size="Md"
              label="Send Friend Request"
              trailingIcon={({ color, size }) => (
                <Icon type="add friend" size={size} color={color} />
              )}
              onPress={sendRequest}
            />
          )}
          {friendshipStatus === 'pending' && (
            <Button
              emphasis="Subtle"
              content="Text"
              size="Md"
              label="Pending"
              overrideTextColor={colors.text.subtle}
              trailingIcon={({ size }) => (
                <Icon type="clock" size={size} color={colors.icon.subtle} />
              )}
              onPress={remove}
            />
          )}
          {friendshipStatus === 'friends' && (
            <Button
              emphasis="Subtle"
              content="Text"
              size="Md"
              label="Friends"
              trailingIcon={({ size }) => (
                <Icon type="check" size={size} color={colors.icon.subtle} />
              )}
            />
          )}
        </View>

        {/* ── Club Section ───────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Club</Text>
          {clubsLoading ? (
            <ActivityIndicator size="small" color={colors.text.subtle} />
          ) : clubs.length > 0 ? (
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
          ) : (
            <Text style={styles.emptyText}>No clubs yet</Text>
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

        {/* ── Mutual Friends Section ─────────────────────── */}
        {(mutualFriends ?? []).length > 0 && (
          <>
            <View style={styles.dividerFullWidth}>
              <Divider emphasis="Subtle" />
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mutual Friends</Text>
              <View style={styles.membersList}>
                {(mutualFriends ?? []).map((mf) => (
                  <MembersItem
                    key={mf.id}
                    avatar={<Avatar type="Image" size="Lg" />}
                    name={mf.display_name}
                    onPress={() => navigateToUser(mf.id)}
                  />
                ))}
              </View>
            </View>
          </>
        )}
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
    paddingTop: spacer['24'],
    paddingBottom: 94,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacer['24'],
  },

  // Profile hero
  profileHero: {
    alignItems: 'center',
    paddingHorizontal: spacer['24'],
    marginTop: spacer['16'],
  },

  profileName: {
    ...textStyles.headline02Light,
    color: colors.text.bold,
    textAlign: 'center',
    marginTop: spacer['24'],
  },

  handleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['4'],
    marginTop: spacer['8'],
  },

  profileHandle: {
    ...textStyles.body01Light,
    color: colors.text.subtle,
  },

  // Friend action
  actionSection: {
    paddingHorizontal: spacer['24'],
    marginTop: spacer['16'],
    alignItems: 'center',
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

  membersList: {
    gap: spacer['12'],
  },

  emptyText: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
    textAlign: 'center',
    paddingVertical: spacer['12'],
  },

  notFound: {
    ...textStyles.title01Medium,
    color: colors.text.subtle,
    textAlign: 'center',
    marginTop: spacer['64'],
  },
});
