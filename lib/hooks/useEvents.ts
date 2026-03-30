/**
 * Event hooks — fetch events, calendar data, RSVP status
 */

import { useCallback } from 'react';
import { useSupabaseQuery } from './useSupabaseQuery';
import { useAuth } from '../AuthContext';
import {
  listEvents,
  listUpcomingEvents,
  getEventById,
  getEventsForMonth,
  getEventsForDate,
  getEventAttendees,
  getEventAttendeeCount,
  getEventRsvpStatus,
  getUserEvents,
  joinEvent as joinEventApi,
  leaveEvent as leaveEventApi,
} from '../api/events';

/** Fetch all active events */
export function useEvents() {
  return useSupabaseQuery(() => listEvents(), []);
}

/** Fetch upcoming events (from today) */
export function useUpcomingEvents() {
  return useSupabaseQuery(() => listUpcomingEvents(), []);
}

/** Fetch a single event by ID */
export function useEvent(eventId: string) {
  return useSupabaseQuery(() => getEventById(eventId), [eventId]);
}

/** Fetch events for a calendar month */
export function useMonthEvents(year: number, month: number) {
  return useSupabaseQuery(() => getEventsForMonth(year, month), [year, month]);
}

/** Fetch events for a specific date */
export function useDateEvents(date: string) {
  return useSupabaseQuery(() => getEventsForDate(date), [date]);
}

/** Fetch attendees of an event (with user profiles) */
export function useEventAttendees(eventId: string) {
  return useSupabaseQuery(() => getEventAttendees(eventId), [eventId]);
}

/** Fetch attendee count for an event */
export function useEventAttendeeCount(eventId: string) {
  return useSupabaseQuery(() => getEventAttendeeCount(eventId), [eventId]);
}

/** Fetch events the current user is attending */
export function useMyEvents() {
  const { user } = useAuth();
  return useSupabaseQuery(
    () => (user ? getUserEvents(user.id) : Promise.resolve([])),
    [user?.id],
  );
}

/** Fetch the current user's RSVP status for an event */
export function useEventRsvp(eventId: string) {
  const { user } = useAuth();
  const query = useSupabaseQuery(
    () => (user ? getEventRsvpStatus(eventId, user.id) : Promise.resolve(null)),
    [eventId, user?.id],
  );

  const join = useCallback(async () => {
    if (!user) return;
    await joinEventApi(eventId, user.id);
    query.refetch();
  }, [eventId, user?.id, query.refetch]);

  const leave = useCallback(async () => {
    if (!user) return;
    await leaveEventApi(eventId, user.id);
    query.refetch();
  }, [eventId, user?.id, query.refetch]);

  return { ...query, join, leave };
}
