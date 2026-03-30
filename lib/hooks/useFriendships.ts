/**
 * Friendship hooks — friends list, requests, actions
 */

import { useCallback } from 'react';
import { useSupabaseQuery } from './useSupabaseQuery';
import { useAuth } from '../AuthContext';
import {
  getFriends,
  getFriendCount,
  getFriendshipStatus,
  getMutualFriends,
  getPendingFriendRequests,
  sendFriendRequest as sendFriendRequestApi,
  acceptFriendRequest as acceptFriendRequestApi,
  declineFriendRequest as declineFriendRequestApi,
  removeFriend as removeFriendApi,
} from '../api/friendships';

/** Fetch the current user's friends */
export function useMyFriends() {
  const { user } = useAuth();
  return useSupabaseQuery(
    () => (user ? getFriends(user.id) : Promise.resolve([])),
    [user?.id],
  );
}

/** Fetch friend count for the current user */
export function useMyFriendCount() {
  const { user } = useAuth();
  return useSupabaseQuery(
    () => (user ? getFriendCount(user.id) : Promise.resolve(0)),
    [user?.id],
  );
}

/** Fetch pending friend requests received by current user */
export function usePendingFriendRequests() {
  const { user } = useAuth();
  return useSupabaseQuery(
    () => (user ? getPendingFriendRequests(user.id) : Promise.resolve([])),
    [user?.id],
  );
}

/** Fetch friendship status between current user and another user */
export function useFriendshipStatus(otherUserId: string) {
  const { user } = useAuth();
  const query = useSupabaseQuery(
    () => (user ? getFriendshipStatus(user.id, otherUserId) : Promise.resolve(null)),
    [user?.id, otherUserId],
  );

  const sendRequest = useCallback(async () => {
    if (!user) return;
    await sendFriendRequestApi(user.id, otherUserId);
    query.refetch();
  }, [user?.id, otherUserId, query.refetch]);

  const accept = useCallback(async () => {
    if (!query.data) return;
    await acceptFriendRequestApi(query.data.id);
    query.refetch();
  }, [query.data?.id, query.refetch]);

  const decline = useCallback(async () => {
    if (!query.data) return;
    await declineFriendRequestApi(query.data.id);
    query.refetch();
  }, [query.data?.id, query.refetch]);

  const remove = useCallback(async () => {
    if (!user) return;
    await removeFriendApi(user.id, otherUserId);
    query.refetch();
  }, [user?.id, otherUserId, query.refetch]);

  return { ...query, sendRequest, accept, decline, remove };
}

/** Fetch mutual friends between current user and another user */
export function useMutualFriends(otherUserId: string) {
  const { user } = useAuth();
  return useSupabaseQuery(
    () => (user ? getMutualFriends(user.id, otherUserId) : Promise.resolve([])),
    [user?.id, otherUserId],
  );
}
