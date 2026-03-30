/**
 * EventScreen — event detail page
 *
 * Layout (same as ClubScreen minus the tabs):
 *   Hero cover (full viewport height placeholder)
 *   Floating nav (back, notification, search; edit if host)
 *   Section 1: Event Info (title, date/time, location, host, fee)
 *   Section 2: Levels + Mutuals
 *   Section 3: Vibe + Description
 *   Section 4: Members list (no tabs — members only)
 *   Bottom action bar (Join/Joined + Share)
 *
 * Data: fetches event, attendees from Supabase.
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  Share,
  type ViewStyle,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer, borderRadius } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import {
  Avatar,
  AvatarGroup,
  Button,
  Divider,
  Icon,
  Levels,
  MembersItem,
  Search,
  Tag,
} from '../components/ui';
import { useAuth } from '../lib/AuthContext';
import { useEvent, useEventAttendees, useEventRsvp } from '../lib/hooks/useEvents';
import { skillLevelToNumber, formatFee, formatEventDateTime, getCtaColors } from '../lib/api/transforms';
import type { DiscoverStackParamList } from '../navigation/DiscoverStack';

const SCREEN_HEIGHT = Dimensions.get('window').height;

// ─── Component ──────────────────────────────────────────

export default function EventScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<DiscoverStackParamList, 'Event'>>();
  const { eventId } = route.params;
  const { user } = useAuth();

  // Fetch real data from Supabase
  const { data: event, loading: eventLoading } = useEvent(eventId);
  const { data: attendees, loading: attendeesLoading } = useEventAttendees(eventId);
  const { data: rsvp, join, leave } = useEventRsvp(eventId);

  // Derived data
  const hosts = useMemo(
    () => (attendees ?? []).filter((a) => a.role === 'admin').map((a) => a.user),
    [attendees],
  );
  const allMembers = useMemo(
    () => (attendees ?? []).map((a) => a.user),
    [attendees],
  );
  const memberCount = allMembers.length;

  const isJoined = rsvp?.status === 'approved';
  const isPending = rsvp?.status === 'pending';
  const isHost = hosts.some((h) => h.id === user?.id);

  const handleShare = useCallback(async () => {
    if (!event) return;
    try {
      await Share.share({
        message: `Check out ${event.name} on Spooorty!${event.location_name ? ` \u{1F4CD} ${event.location_name}` : ''}${event.event_date ? ` \u{1F4C5} ${event.event_date}` : ''}`,
        // url: `https://spooorty.app/event/${event.id}`, // enable when deep links are live
      });
    } catch (_) {}
  }, [event]);

  // State
  const [memberSearch, setMemberSearch] = useState('');
  const [pendingFriendIds, setPendingFriendIds] = useState<Set<string>>(new Set());

  const ctaColors = getCtaColors(1);

  // Filtered members
  const filteredMembers = useMemo(() => {
    const q = memberSearch.toLowerCase().trim();
    if (!q) return allMembers;
    return allMembers.filter((m) => m.display_name.toLowerCase().includes(q));
  }, [allMembers, memberSearch]);

  const handleJoinToggle = useCallback(async () => {
    if (isJoined) {
      await leave();
    } else if (!isPending) {
      await join();
    }
  }, [isJoined, isPending, join, leave]);

  const handleSendFriendRequest = useCallback((userId: string) => {
    setPendingFriendIds((prev) => {
      const next = new Set(prev);
      next.add(userId);
      return next;
    });
  }, []);

  const navigateToUser = useCallback(
    (userId: string) => {
      navigation.push('OtherUserProfile', { userId });
    },
    [navigation],
  );

  if (eventLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.text.subtle} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Event not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Hero Cover (absolute, behind all content) ───── */}
      <Image
        source={{ uri: event.cover_photo_url || 'https://picsum.photos/800/1200' }}
        style={styles.heroCover}
        resizeMode="cover"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ── Top Nav (in-flow, 64px top margin) ──────── */}
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
          <View style={styles.topNavRight}>
            <Button
              emphasis="Subtle"
              content="Icon"
              size="Sm"
              icon={({ color, size }) => (
                <Icon type="notification" size={size} color={color} />
              )}
              onPress={() => navigation.navigate('Notification')}
            />
            <Button
              emphasis="Subtle"
              content="Icon"
              size="Sm"
              icon={({ color, size }) => (
                <Icon type="search" size={size} color={color} />
              )}
              onPress={() => navigation.navigate('Search')}
            />
          </View>
        </View>

        {/* ── Content area (240px top padding) ─────────── */}
        <View style={styles.sections}>
          {/* ── Edit button (host only, above first card) */}
          {isHost && (
            <View style={styles.editButtonRow}>
              <Button
                emphasis="Subtle"
                content="Icon"
                size="Sm"
                icon={({ color, size }) => (
                  <Icon type="edit" size={size} color={color} />
                )}
                onPress={() =>
                  navigation.navigate('Create', {
                    screen: 'CreateEvent',
                    params: { editEventId: eventId },
                  })
                }
              />
            </View>
          )}

          {/* Section 1: Event Info */}
          <View style={styles.cardOuter}>
            <View style={styles.cardInner}>
              <View style={styles.titleSection}>
                <Text style={styles.titleText}>{event.name.toUpperCase()}</Text>
              </View>
              <Divider />
              <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Date/ Time</Text>
                  <Text style={styles.infoValue}>
                    {formatEventDateTime(event.event_date, event.start_time)}
                  </Text>
                </View>
                <View style={styles.verticalDividerWrap}>
                  <View style={styles.verticalDivider} />
                </View>
                <View style={styles.infoColRight}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{event.location_name ?? 'TBD'}</Text>
                </View>
              </View>
              <Divider />
              <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Host</Text>
                  <View style={styles.adminRow}>
                    <AvatarGroup
                      avatars={hosts.map(() => ({ type: 'Image' as const }))}
                      size="Sm"
                    />
                    <Text style={styles.infoValue}>
                      {hosts.map((h) => h.display_name).join(', ')}
                    </Text>
                  </View>
                </View>
                <View style={styles.verticalDividerWrap}>
                  <View style={styles.verticalDivider} />
                </View>
                <View style={styles.infoColRight}>
                  <Text style={styles.infoLabel}>Fee</Text>
                  <Text style={styles.infoValue}>
                    {formatFee(event.fee_amount, event.fee_frequency)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Section 2: Levels + Mutuals */}
          <View style={styles.cardOuter}>
            <View style={styles.cardInner}>
              <View style={styles.levelsWrap}>
                <Levels indicator={skillLevelToNumber(event.skill_level)} />
              </View>
              <View style={styles.mutualsRow}>
                <Avatar type="Image" size="Lg" showCount count={memberCount} />
                <Text style={styles.mutualTextWrap}>
                  <Text style={styles.mutualHighlight}>
                    {memberCount} attending
                  </Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Section 3: Vibe + Description */}
          <View style={styles.cardOuter}>
            <View style={styles.cardInner}>
              <View style={styles.vibeRow}>
                <Text style={styles.infoLabel}>Vibe</Text>
                <Tag
                  label={event.vibe ? event.vibe.charAt(0).toUpperCase() + event.vibe.slice(1) : 'Casual'}
                  selected
                  size="Sm"
                  style={{ minWidth: 145 }}
                />
              </View>
              <Divider />
              <View style={styles.descriptionWrap}>
                <Text style={styles.descriptionText}>
                  {event.description ?? 'No description yet.'}
                </Text>
              </View>
            </View>
          </View>

          {/* Section 4: Members (no tabs — direct list) */}
          <View style={styles.cardOuter}>
            <View style={styles.cardInner}>
              <View style={styles.membersContent}>
                <Search
                  value={memberSearch}
                  onChangeText={setMemberSearch}
                  placeholder="Search Members"
                />

                {attendeesLoading ? (
                  <ActivityIndicator size="small" color={colors.text.subtle} />
                ) : filteredMembers.length > 0 ? (
                  <View style={styles.membersSection}>
                    <Text style={styles.membersSectionTitle}>
                      Members ({filteredMembers.length})
                    </Text>
                    <View style={styles.membersList}>
                      {filteredMembers.map((member) => {
                        const isSelf = member.id === user?.id;
                        const isPendingFriend = pendingFriendIds.has(member.id);
                        return (
                          <MembersItem
                            key={member.id}
                            avatar={<Avatar type="Image" size="Lg" />}
                            name={member.display_name}
                            showIcon={!isSelf}
                            icon={
                              !isSelf
                                ? ({ size }) =>
                                    isPendingFriend ? (
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
                                : undefined
                            }
                            onIconPress={
                              !isSelf && !isPendingFriend
                                ? () => handleSendFriendRequest(member.id)
                                : undefined
                            }
                            onPress={() => !isSelf && navigateToUser(member.id)}
                          />
                        );
                      })}
                    </View>
                  </View>
                ) : (
                  <Text style={styles.emptyText}>No members found</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom Action Bar ─────────────────────────────── */}
      <View style={styles.bottomActionWrap}>
        <View style={styles.bottomActionInner}>
          <View style={styles.bottomActionRow}>
            {isJoined ? (
              <View style={styles.bottomActionButton}>
                <Button
                  emphasis="Subtle"
                  content="Text"
                  size="Md"
                  label="Joined"
                  trailingIcon={({ size }) => (
                    <Icon type="check" size={size} color={colors.text.subtle} />
                  )}
                  onPress={handleJoinToggle}
                />
              </View>
            ) : isPending ? (
              <View style={styles.bottomActionButton}>
                <Button
                  emphasis="Subtle"
                  content="Text"
                  size="Md"
                  label="Pending"
                  trailingIcon={({ size }) => (
                    <Icon type="clock" size={size} color={colors.text.subtle} />
                  )}
                />
              </View>
            ) : event.requires_approval ? (
              <Pressable
                style={[styles.joinButton, { backgroundColor: ctaColors.bg }]}
                onPress={handleJoinToggle}
              >
                <Text style={[styles.joinButtonText, { color: ctaColors.text }]}>
                  Request
                </Text>
                <Icon type="lock" size={16} color={ctaColors.text} />
              </Pressable>
            ) : (
              <Pressable
                style={[styles.joinButton, { backgroundColor: ctaColors.bg }]}
                onPress={handleJoinToggle}
              >
                <Text style={[styles.joinButtonText, { color: ctaColors.text }]}>
                  Join
                </Text>
                <Icon type="arrow forward" size={16} color={ctaColors.text} />
              </Pressable>
            )}
            <View style={styles.bottomActionButton}>
              <Button
                emphasis="Subtle"
                content="Text"
                size="Md"
                label="Share"
                trailingIcon={({ color, size }) => (
                  <Icon type="share" size={size} color={color} />
                )}
                onPress={handleShare}
              />
            </View>
          </View>
        </View>
      </View>
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
    backgroundColor: colors.surface.subtle,
  },

  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 64,
    paddingHorizontal: spacer['24'],
  },

  topNavRight: {
    flexDirection: 'row',
    gap: spacer['8'],
  },

  sections: {
    paddingHorizontal: spacer['24'],
    gap: spacer['12'],
    paddingTop: 240,
  },

  editButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

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
    backgroundColor: colors.surface.subtle,
  },

  titleSection: {
    padding: spacer['16'],
    justifyContent: 'center',
  },

  titleText: {
    ...textStyles.headline02Medium,
    color: colors.text.bold,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoCol: {
    flex: 1,
    paddingHorizontal: spacer['16'],
    paddingVertical: spacer['16'],
    justifyContent: 'center',
    gap: spacer['8'],
  },

  infoColRight: {
    flex: 1,
    paddingHorizontal: spacer['16'],
    paddingVertical: spacer['16'],
    justifyContent: 'center',
    gap: spacer['8'],
  },

  infoLabel: {
    ...textStyles.title02Medium,
    color: colors.text.bold,
  },

  infoValue: {
    ...textStyles.body03Light,
    color: colors.text.bold,
  },

  verticalDividerWrap: {
    height: 84,
    justifyContent: 'center',
    alignItems: 'center',
    width: 0,
  },

  verticalDivider: {
    width: 0.5,
    height: '100%',
    backgroundColor: colors.border.subtle,
  },

  adminRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['8'],
  },

  levelsWrap: {
    paddingTop: spacer['16'],
    width: '100%',
  },

  mutualsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacer['16'],
    gap: spacer['16'],
  },

  mutualTextWrap: {
    flex: 1,
    ...textStyles.body03Light,
    color: colors.text.bold,
  },

  mutualHighlight: {
    ...textStyles.body03Medium,
    color: colors.text.bold,
  },

  mutualBody: {
    ...textStyles.body03Light,
    color: colors.text.bold,
  },

  vibeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacer['16'],
  },

  descriptionWrap: {
    padding: spacer['16'],
  },

  descriptionText: {
    ...textStyles.body03Light,
    color: colors.text.bold,
  },

  // Members section (direct list, no tabs)
  membersContent: {
    paddingHorizontal: spacer['16'],
    paddingVertical: spacer['16'],
    gap: spacer['24'],
  },

  membersSection: {
    gap: spacer['12'],
  },

  membersSectionTitle: {
    ...textStyles.title02Medium,
    color: colors.text.bold,
  },

  membersList: {
    gap: spacer['12'],
  },

  emptyText: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
    textAlign: 'center',
    paddingVertical: spacer['24'],
  },

  // Bottom action
  bottomActionWrap: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    paddingHorizontal: spacer['24'],
  },

  bottomActionInner: {
    borderRadius: borderRadius['16'],
    backgroundColor: colors.surface.blur,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? { backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }
      : {}),
  } as ViewStyle,

  bottomActionRow: {
    flexDirection: 'row',
    paddingHorizontal: spacer['16'],
    paddingVertical: spacer['12'],
    gap: spacer['8'],
  },

  bottomActionButton: {
    flex: 1,
  },

  joinButton: {
    flex: 1,
    height: 48,
    borderRadius: borderRadius.round,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacer['8'],
  },

  joinButtonText: {
    ...textStyles.title02Medium,
  },

  notFound: {
    ...textStyles.title01Medium,
    color: colors.text.subtle,
    textAlign: 'center',
    marginTop: spacer['64'],
  },
});
