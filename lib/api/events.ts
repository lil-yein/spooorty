/**
 * Events API — CRUD operations for events and event_rsvps
 */

import { supabase } from '../supabase';
import type {
  DbEvent,
  DbEventRsvp,
  DbUser,
  InsertEvent,
  UpdateEvent,
} from '../database/types';

// ─── Event CRUD ───────────────────────────────────────────

/** List active events, nearest date first */
export async function listEvents(limit = 50): Promise<DbEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('event_date', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/** List upcoming events (from today onward) */
export async function listUpcomingEvents(limit = 50): Promise<DbEvent[]> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .gte('event_date', today)
    .order('event_date', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/** Get events for a specific month (for calendar) */
export async function getEventsForMonth(
  year: number,
  month: number,
): Promise<DbEvent[]> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .gte('event_date', startDate)
    .lte('event_date', endDate)
    .order('event_date', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/** Get events for a specific date */
export async function getEventsForDate(date: string): Promise<DbEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .eq('event_date', date)
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/** Get a single event by ID */
export async function getEventById(eventId: string): Promise<DbEvent | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

/** Get events belonging to a club */
export async function getClubEvents(clubId: string): Promise<DbEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('club_id', clubId)
    .eq('is_active', true)
    .order('event_date', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/** Create a new event (and auto-add creator as admin) */
export async function createEvent(event: InsertEvent): Promise<DbEvent> {
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single();

  if (error) throw error;

  // Auto-add creator as approved admin
  await supabase.from('event_rsvps').insert({
    user_id: event.created_by,
    event_id: data.id,
    role: 'admin',
    status: 'approved',
  });

  return data;
}

/** Update an event (must be admin) */
export async function updateEvent(eventId: string, updates: UpdateEvent): Promise<DbEvent> {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', eventId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Soft-delete an event */
export async function deleteEvent(eventId: string): Promise<void> {
  const { error } = await supabase
    .from('events')
    .update({ is_active: false })
    .eq('id', eventId);

  if (error) throw error;
}

// ─── Event RSVPs ──────────────────────────────────────────

/** Get all approved attendees of an event (with user profiles) */
export async function getEventAttendees(
  eventId: string,
): Promise<(DbEventRsvp & { user: DbUser })[]> {
  const { data, error } = await supabase
    .from('event_rsvps')
    .select('*, user:users(*)')
    .eq('event_id', eventId)
    .eq('status', 'approved');

  if (error) throw error;
  return data ?? [];
}

/** RSVP to an event */
export async function joinEvent(eventId: string, userId: string): Promise<DbEventRsvp> {
  const { data, error } = await supabase
    .from('event_rsvps')
    .insert({ user_id: userId, event_id: eventId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Leave an event */
export async function leaveEvent(eventId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('event_rsvps')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId);

  if (error) throw error;
}

/** Approve or reject an event RSVP (admin action) */
export async function respondToEventRsvp(
  rsvpId: string,
  status: 'approved' | 'rejected',
  respondedBy: string,
): Promise<DbEventRsvp> {
  const { data, error } = await supabase
    .from('event_rsvps')
    .update({
      status,
      responded_at: new Date().toISOString(),
      responded_by: respondedBy,
    })
    .eq('id', rsvpId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Get the current user's RSVP status for an event */
export async function getEventRsvpStatus(
  eventId: string,
  userId: string,
): Promise<DbEventRsvp | null> {
  const { data, error } = await supabase
    .from('event_rsvps')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/** Get events the user has RSVP'd to */
export async function getUserEvents(userId: string): Promise<DbEvent[]> {
  const { data, error } = await supabase
    .from('event_rsvps')
    .select('event:events(*)')
    .eq('user_id', userId)
    .eq('status', 'approved');

  if (error) throw error;
  return (data ?? []).map((row: any) => row.event).filter(Boolean);
}

/** Get attendee count for an event */
export async function getEventAttendeeCount(eventId: string): Promise<number> {
  const { count, error } = await supabase
    .from('event_rsvps')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)
    .eq('status', 'approved');

  if (error) throw error;
  return count ?? 0;
}
