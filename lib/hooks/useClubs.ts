/**
 * Club hooks — fetch clubs, club details, membership status
 */

import { useCallback } from 'react';
import { useSupabaseQuery } from './useSupabaseQuery';
import { useAuth } from '../AuthContext';
import {
  listClubs,
  getClubById,
  getClubMembers,
  getClubMemberCount,
  getUserClubs,
  getClubMembershipStatus,
  joinClub as joinClubApi,
  leaveClub as leaveClubApi,
} from '../api/clubs';
import { getClubEvents } from '../api/events';
import type { DbClub, DbClubMembership } from '../database/types';

/** Fetch all active clubs */
export function useClubs() {
  return useSupabaseQuery(() => listClubs(), []);
}

/** Fetch a single club by ID */
export function useClub(clubId: string) {
  return useSupabaseQuery(() => getClubById(clubId), [clubId]);
}

/** Fetch members of a club (with user profiles) */
export function useClubMembers(clubId: string) {
  return useSupabaseQuery(() => getClubMembers(clubId), [clubId]);
}

/** Fetch member count for a club */
export function useClubMemberCount(clubId: string) {
  return useSupabaseQuery(() => getClubMemberCount(clubId), [clubId]);
}

/** Fetch events belonging to a club */
export function useClubEvents(clubId: string) {
  return useSupabaseQuery(() => getClubEvents(clubId), [clubId]);
}

/** Fetch clubs the current user belongs to */
export function useMyClubs() {
  const { user } = useAuth();
  return useSupabaseQuery(
    () => (user ? getUserClubs(user.id) : Promise.resolve([])),
    [user?.id],
  );
}

/** Fetch the current user's membership status for a club */
export function useClubMembership(clubId: string) {
  const { user } = useAuth();
  const query = useSupabaseQuery(
    () => (user ? getClubMembershipStatus(clubId, user.id) : Promise.resolve(null)),
    [clubId, user?.id],
  );

  const join = useCallback(async () => {
    if (!user) return;
    await joinClubApi(clubId, user.id);
    query.refetch();
  }, [clubId, user?.id, query.refetch]);

  const leave = useCallback(async () => {
    if (!user) return;
    await leaveClubApi(clubId, user.id);
    query.refetch();
  }, [clubId, user?.id, query.refetch]);

  return { ...query, join, leave };
}
