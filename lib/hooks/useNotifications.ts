/**
 * Notification hooks — fetch, mark read, real-time subscription
 */

import { useState, useEffect, useCallback } from 'react';
import { useSupabaseQuery } from './useSupabaseQuery';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabase';
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead as markReadApi,
  markAllNotificationsRead as markAllReadApi,
  markNotificationActedOn as markActedOnApi,
} from '../api/notifications';
import type { DbNotification } from '../database/types';

/** Fetch notifications for the current user */
export function useNotifications() {
  const { user } = useAuth();
  return useSupabaseQuery(
    () => (user ? getNotifications(user.id) : Promise.resolve([])),
    [user?.id],
  );
}

/** Fetch unread notification count (with real-time updates) */
export function useUnreadNotificationCount() {
  const { user } = useAuth();
  const query = useSupabaseQuery(
    () => (user ? getUnreadNotificationCount(user.id) : Promise.resolve(0)),
    [user?.id],
  );

  // Subscribe to real-time notification inserts to auto-refresh count
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications-count')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          query.refetch();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return query;
}

/** Mark a single notification as read */
export function useMarkNotificationRead() {
  const { refetch } = useNotifications();

  return useCallback(
    async (notificationId: string) => {
      await markReadApi(notificationId);
      refetch();
    },
    [refetch],
  );
}

/** Mark all notifications as read */
export function useMarkAllNotificationsRead() {
  const { user } = useAuth();
  const notifications = useNotifications();
  const unreadCount = useUnreadNotificationCount();

  return useCallback(async () => {
    if (!user) return;
    await markAllReadApi(user.id);
    notifications.refetch();
    unreadCount.refetch();
  }, [user?.id, notifications.refetch, unreadCount.refetch]);
}
