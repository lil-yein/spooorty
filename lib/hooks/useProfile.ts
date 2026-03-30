/**
 * Profile hooks — current user profile, other user profiles
 */

import { useSupabaseQuery } from './useSupabaseQuery';
import { useAuth } from '../AuthContext';
import { getCurrentUserProfile, getUserById, searchUsers } from '../api/users';
import type { DbUser, UpdateUser } from '../database/types';
import { updateCurrentUserProfile } from '../api/users';
import { useCallback, useState } from 'react';

/** Fetch the current user's profile from the users table */
export function useCurrentProfile() {
  const { user } = useAuth();
  return useSupabaseQuery(
    () => (user ? getCurrentUserProfile() : Promise.resolve(null)),
    [user?.id],
  );
}

/** Fetch another user's profile by ID */
export function useUserProfile(userId: string) {
  return useSupabaseQuery(() => getUserById(userId), [userId]);
}

/** Update the current user's profile */
export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (updates: UpdateUser): Promise<DbUser | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateCurrentUserProfile(updates);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

/** Search users by name */
export function useUserSearch(query: string) {
  return useSupabaseQuery(
    () => (query.length >= 2 ? searchUsers(query) : Promise.resolve([])),
    [query],
  );
}
