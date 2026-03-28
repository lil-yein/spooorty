/**
 * OtherUserProfileScreen — viewing another user's profile
 * (Figma nodes 1141:50810, 1141:50921, 1141:51032)
 *
 * Layout:
 *   Header: back arrow (top left)
 *   Profile hero: Avatar Xl, name, handle
 *   Friend request action (send / pending / friends)
 *   Club section: CardLg list + "See All"
 *   Mutual Friends section: MembersItem list with descriptions
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Avatar, Button, ClubCardLg, Divider, Icon, MembersItem } from '../components/ui';
import {
  USERS,
  INITIAL_FRIENDSHIP_STATUS,
  getUserClubs,
  getMutualFriends,
  type FriendshipStatus,
} from '../lib/data/mockData';
import type { ProfileStackParamList } from '../navigation/ProfileStack';

// ─── Component ──────────────────────────────────────────

export default function OtherUserProfileScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ProfileStackParamList, 'OtherUserProfile'>>();
  const { userId } = route.params;

  const user = useMemo(() => USERS.find((u) => u.id === userId), [userId]);
  const clubs = useMemo(() => getUserClubs(userId), [userId]);
  const mutualFriends = useMemo(() => getMutualFriends(userId), [userId]);

  const initialStatus = INITIAL_FRIENDSHIP_STATUS[userId] ?? 'none';
  const [friendshipStatus, setFriendshipStatus] =
    useState<FriendshipStatus>(initialStatus);
  const [cardStates, setCardStates] = useState<Record<string, 'Pending' | 'Joined'>>({});
  const [showAllClubs, setShowAllClubs] = useState(false);

  const handleSendRequest = useCallback(() => {
    setFriendshipStatus('pending');
  }, []);

  const handleCancelRequest = useCallback(() => {
    setFriendshipStatus('none');
  }, []);

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

  if (!user) {
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
          <Text style={styles.profileName}>{user.name}</Text>
          <View style={styles.handleRow}>
            <Icon type="Instagram" size={16} color={colors.text.subtle} />
            <Text style={styles.profileHandle}>{user.handle}</Text>
          </View>
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
              onPress={handleSendRequest}
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
              onPress={handleCancelRequest}
            />
          )}
        </View>

        {/* ── Club Section ───────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Club</Text>
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
                mutualHighlight={club.mutualHighlight}
                mutualBody={club.mutualBody}
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
        {mutualFriends.length > 0 && (
          <>
            <View style={styles.dividerFullWidth}>
              <Divider emphasis="Subtle" />
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mutual Friends</Text>
              <View style={styles.membersList}>
                {mutualFriends.map((mf) => (
                  <MembersItem
                    key={mf.userId}
                    avatar={<Avatar type="Image" size="Lg" />}
                    name={mf.user.name}
                    description={mf.description}
                    onPress={() => navigateToUser(mf.userId)}
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
    paddingTop: spacer['64'],
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

  membersList: {
    gap: spacer['12'],
  },

  notFound: {
    ...textStyles.title01Medium,
    color: colors.text.subtle,
    textAlign: 'center',
    marginTop: spacer['64'],
  },
});
