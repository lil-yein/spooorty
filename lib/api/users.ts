/**
 * User API — CRUD operations for the users table
 */

import { supabase } from '../supabase';
import type { DbUser, UpdateUser } from '../database/types';

/** Get the current authenticated user's profile */
export async function getCurrentUserProfile(): Promise<DbUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
}

/** Get a user by ID */
export async function getUserById(userId: string): Promise<DbUser | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
}

/** Get multiple users by IDs */
export async function getUsersByIds(userIds: string[]): Promise<DbUser[]> {
  if (userIds.length === 0) return [];

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .in('id', userIds);

  if (error) throw error;
  return data ?? [];
}

/** Update the current user's profile */
export async function updateCurrentUserProfile(updates: UpdateUser): Promise<DbUser> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Deactivate the current user's account. Soft-disables the row so the user
 * can reactivate by signing in again (we flip is_active back on sign-in
 * elsewhere if/when we wire that up).
 */
export async function deactivateCurrentUser(): Promise<void> {
  await updateCurrentUserProfile({ is_active: false });
}

/**
 * Permanently delete the current user's account.
 *
 * Calls the `delete-account` Edge Function, which uses the service-role
 * key to remove the auth.users row. The ON DELETE CASCADE on
 * public.users.id then wipes the profile and all related rows.
 */
export async function deleteCurrentUser(): Promise<void> {
  const { data, error } = await supabase.functions.invoke('delete-account', {
    method: 'POST',
  });
  // FunctionsHttpError exposes a Response on `context` we can read for a real status/body
  if (error) {
    let detail = error.message ?? 'Unknown error';
    const ctx = (error as any).context;
    if (ctx && typeof ctx.text === 'function') {
      try {
        const body = await ctx.text();
        detail = `${detail} — ${ctx.status} ${body}`;
      } catch {}
    }
    throw new Error(`delete-account: ${detail}`);
  }
  if (data && typeof data === 'object' && (data as any).ok !== true) {
    throw new Error(`delete-account returned unexpected response: ${JSON.stringify(data)}`);
  }
}

/** Search users by display name (for friend search, member invite) */
export async function searchUsers(query: string, limit = 20): Promise<DbUser[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('display_name', `%${query}%`)
    .eq('is_active', true)
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
