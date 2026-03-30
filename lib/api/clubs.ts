/**
 * Clubs API — CRUD operations for clubs and club_memberships
 */

import { supabase } from '../supabase';
import type {
  DbClub,
  DbClubMembership,
  DbUser,
  InsertClub,
  UpdateClub,
  MembershipStatus,
} from '../database/types';

// ─── Club CRUD ────────────────────────────────────────────

/** List active clubs, newest first */
export async function listClubs(limit = 50): Promise<DbClub[]> {
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/** Get a single club by ID */
export async function getClubById(clubId: string): Promise<DbClub | null> {
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('id', clubId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

/** Create a new club (and auto-add creator as admin) */
export async function createClub(club: InsertClub): Promise<DbClub> {
  const { data, error } = await supabase
    .from('clubs')
    .insert(club)
    .select()
    .single();

  if (error) throw error;

  // Auto-add creator as approved admin
  await supabase.from('club_memberships').insert({
    user_id: club.created_by,
    club_id: data.id,
    role: 'admin',
    status: 'approved',
  });

  return data;
}

/** Update a club (must be admin) */
export async function updateClub(clubId: string, updates: UpdateClub): Promise<DbClub> {
  const { data, error } = await supabase
    .from('clubs')
    .update(updates)
    .eq('id', clubId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Soft-delete a club */
export async function deleteClub(clubId: string): Promise<void> {
  const { error } = await supabase
    .from('clubs')
    .update({ is_active: false })
    .eq('id', clubId);

  if (error) throw error;
}

// ─── Club Memberships ─────────────────────────────────────

/** Get all approved members of a club (with user profiles) */
export async function getClubMembers(
  clubId: string,
): Promise<(DbClubMembership & { user: DbUser })[]> {
  const { data, error } = await supabase
    .from('club_memberships')
    .select('*, user:users(*)')
    .eq('club_id', clubId)
    .eq('status', 'approved');

  if (error) throw error;
  return data ?? [];
}

/** Get pending join requests for a club (admin view) */
export async function getClubPendingRequests(
  clubId: string,
): Promise<(DbClubMembership & { user: DbUser })[]> {
  const { data, error } = await supabase
    .from('club_memberships')
    .select('*, user:users(*)')
    .eq('club_id', clubId)
    .eq('status', 'pending');

  if (error) throw error;
  return data ?? [];
}

/** Request to join a club */
export async function joinClub(clubId: string, userId: string): Promise<DbClubMembership> {
  const { data, error } = await supabase
    .from('club_memberships')
    .insert({ user_id: userId, club_id: clubId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Leave a club */
export async function leaveClub(clubId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('club_memberships')
    .delete()
    .eq('club_id', clubId)
    .eq('user_id', userId);

  if (error) throw error;
}

/** Approve or reject a membership request (admin action) */
export async function respondToClubRequest(
  membershipId: string,
  status: 'approved' | 'rejected',
  respondedBy: string,
): Promise<DbClubMembership> {
  const { data, error } = await supabase
    .from('club_memberships')
    .update({
      status,
      responded_at: new Date().toISOString(),
      responded_by: respondedBy,
    })
    .eq('id', membershipId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Get clubs the current user is a member of */
export async function getUserClubs(userId: string): Promise<DbClub[]> {
  const { data, error } = await supabase
    .from('club_memberships')
    .select('club:clubs(*)')
    .eq('user_id', userId)
    .eq('status', 'approved');

  if (error) throw error;
  // Extract the nested club objects
  return (data ?? []).map((row: any) => row.club).filter(Boolean);
}

/** Get the current user's membership status for a club */
export async function getClubMembershipStatus(
  clubId: string,
  userId: string,
): Promise<DbClubMembership | null> {
  const { data, error } = await supabase
    .from('club_memberships')
    .select('*')
    .eq('club_id', clubId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/** Get member count for a club */
export async function getClubMemberCount(clubId: string): Promise<number> {
  const { count, error } = await supabase
    .from('club_memberships')
    .select('*', { count: 'exact', head: true })
    .eq('club_id', clubId)
    .eq('status', 'approved');

  if (error) throw error;
  return count ?? 0;
}
