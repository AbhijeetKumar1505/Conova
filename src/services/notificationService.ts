import { supabase } from '../config/supabase';
import type { Notification } from '../types';

/**
 * Notification Service
 * Handles user notifications
 */

export const notificationService = {
    /**
     * Get notifications for current user
     */
    getNotifications: async (limit = 50, offset = 0): Promise<Notification[]> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return [];

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Get unread notification count
     */
    getUnreadCount: async (): Promise<number> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return 0;

        const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_read', false);

        if (error) {
            console.error('Error fetching unread count:', error);
            return 0;
        }

        return count || 0;
    },

    /**
     * Mark notification as read
     */
    markAsRead: async (notificationId: string): Promise<void> => {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId);

        if (error) throw error;
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async (): Promise<void> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);

        if (error) throw error;
    },

    /**
     * Delete a notification
     */
    deleteNotification: async (notificationId: string): Promise<void> => {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', notificationId);

        if (error) throw error;
    },

    /**
     * Delete all read notifications
     */
    deleteAllRead: async (): Promise<void> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('user_id', user.id)
            .eq('is_read', true);

        if (error) throw error;
    },
};
