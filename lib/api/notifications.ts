/**
 * Notifications API — CRUD operations for the notifications table
 */

import { supabase } from '../supabase';
import type { DbNotification, InsertNotification } from '../database/types';

/** Get notifications for the current user, newest first */
export async function getNotifications(
  userId: string,
  limit = 50,
): Promise<DbNotification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/** Get unread notification count */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .eq('is_read', false);

  if (error) throw error;
  return count ?? 0;
}

/** Mark a notification as read */
export async function markNotificationRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
}

/** Mark all notifications as read */
export async function markAllNotificationsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('recipient_id', userId)
    .eq('is_read', false);

  if (error) throw error;
}

/** Mark a notification as acted on (e.g., friend request accepted) */
export async function markNotificationActedOn(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_acted_on: true, is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
}

/** Create a notification (typically called from other API functions) */
export async function createNotification(
  notification: InsertNotification,
): Promise<DbNotification> {
  const { data, error } = await supabase
    .from('notifications')
    .insert(notification)
    .select()
    .single();

  if (error) throw error;
  return data;
}
