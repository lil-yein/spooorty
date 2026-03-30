/**
 * Friendships API — CRUD operations for the friendships table
 */

import { supabase } from '../supabase';
import type { DbFriendship, DbUser, FriendSource } from '../database/types';

/** Get all accepted friends for a user (with profiles) */
export async function getFriends(userId: string): Promise<DbUser[]> {
  // Friendships can be stored in either direction (user_id or friend_id)
  const { data, error } = await supabase
    .from('friendships')
    .select('user_id, friend_id, user:users!friendships_user_id_fkey(*), friend:users!friendships_friend_id_fkey(*)')
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .eq('status', 'accepted');

  if (error) throw error;

  // Extract the "other" user from each friendship
  return (data ?? []).map((row: any) => {
    if (row.user_id === userId) return row.friend;
    return row.user;
  }).filter(Boolean);
}

/** Get pending friend requests received by a user */
export async function getPendingFriendRequests(
  userId: string,
): Promise<(DbFriendship & { user: DbUser })[]> {
  const { data, error } = await supabase
    .from('friendships')
    .select('*, user:users!friendships_user_id_fkey(*)')
    .eq('friend_id', userId)
    .eq('status', 'pending');

  if (error) throw error;
  return data ?? [];
}

/** Get pending friend requests sent by a user */
export async function getSentFriendRequests(
  userId: string,
): Promise<(DbFriendship & { user: DbUser })[]> {
  const { data, error } = await supabase
    .from('friendships')
    .select('*, friend:users!friendships_friend_id_fkey(*)')
    .eq('user_id', userId)
    .eq('status', 'pending');

  if (error) throw error;
  return data ?? [];
}

/** Send a friend request */
export async function sendFriendRequest(
  userId: string,
  friendId: string,
  source?: FriendSource,
): Promise<DbFriendship> {
  const { data, error } = await supabase
    .from('friendships')
    .insert({
      user_id: userId,
      friend_id: friendId,
      source: source ?? 'manual',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Accept a friend request */
export async function acceptFriendRequest(friendshipId: string): Promise<DbFriendship> {
  const { data, error } = await supabase
    .from('friendships')
    .update({
      status: 'accepted',
      accepted_at: new Date().toISOString(),
    })
    .eq('id', friendshipId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Decline a friend request */
export async function declineFriendRequest(friendshipId: string): Promise<DbFriendship> {
  const { data, error } = await supabase
    .from('friendships')
    .update({ status: 'declined' })
    .eq('id', friendshipId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Remove a friend (delete the friendship row) */
export async function removeFriend(userId: string, friendId: string): Promise<void> {
  // Could be stored in either direction
  const { error } = await supabase
    .from('friendships')
    .delete()
    .or(
      `and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`,
    );

  if (error) throw error;
}

/** Get friendship status between two users */
export async function getFriendshipStatus(
  userId: string,
  otherUserId: string,
): Promise<DbFriendship | null> {
  const { data, error } = await supabase
    .from('friendships')
    .select('*')
    .or(
      `and(user_id.eq.${userId},friend_id.eq.${otherUserId}),and(user_id.eq.${otherUserId},friend_id.eq.${userId})`,
    )
    .maybeSingle();

  if (error) throw error;
  return data;
}

/** Get mutual friends between two users */
export async function getMutualFriends(
  userId: string,
  otherUserId: string,
): Promise<DbUser[]> {
  // Get both users' friend lists, then find intersection
  const [myFriends, theirFriends] = await Promise.all([
    getFriends(userId),
    getFriends(otherUserId),
  ]);

  const myFriendIds = new Set(myFriends.map((f) => f.id));
  return theirFriends.filter((f) => myFriendIds.has(f.id));
}

/** Get friend count */
export async function getFriendCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('friendships')
    .select('*', { count: 'exact', head: true })
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .eq('status', 'accepted');

  if (error) throw error;
  return count ?? 0;
}
