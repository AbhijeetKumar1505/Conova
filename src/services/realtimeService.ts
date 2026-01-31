import { supabase } from '../config/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Post, Comment, Notification } from '../types';

/**
 * Realtime Service
 * Handles realtime subscriptions for live updates
 */

export const realtimeService = {
    /**
     * Subscribe to new posts in the feed
     */
    subscribeToNewPosts: (
        callback: (post: Post) => void,
        circleId?: string
    ): RealtimeChannel => {
        const channel = supabase
            .channel('posts-channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'posts',
                    filter: circleId ? `circle_id=eq.${circleId}` : undefined,
                },
                async payload => {
                    // Fetch the complete post with author info
                    const { data } = await supabase
                        .from('posts')
                        .select(
                            `
              *,
              author:profiles!posts_author_id_fkey(*)
            `
                        )
                        .eq('id', payload.new.id)
                        .single();

                    if (data) {
                        callback(data);
                    }
                }
            )
            .subscribe();

        return channel;
    },

    /**
     * Subscribe to post updates
     */
    subscribeToPostUpdates: (
        postId: string,
        callback: (post: Post) => void
    ): RealtimeChannel => {
        const channel = supabase
            .channel(`post-${postId}-updates`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'posts',
                    filter: `id=eq.${postId}`,
                },
                async payload => {
                    const { data } = await supabase
                        .from('posts')
                        .select(
                            `
              *,
              author:profiles!posts_author_id_fkey(*)
            `
                        )
                        .eq('id', payload.new.id)
                        .single();

                    if (data) {
                        callback(data);
                    }
                }
            )
            .subscribe();

        return channel;
    },

    /**
     * Subscribe to new comments on a post
     */
    subscribeToComments: (
        postId: string,
        callback: (comment: Comment) => void
    ): RealtimeChannel => {
        const channel = supabase
            .channel(`post-${postId}-comments`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'comments',
                    filter: `post_id=eq.${postId}`,
                },
                async payload => {
                    // Fetch the complete comment with author info
                    const { data } = await supabase
                        .from('comments')
                        .select(
                            `
              *,
              author:profiles!comments_user_id_fkey(*)
            `
                        )
                        .eq('id', payload.new.id)
                        .single();

                    if (data) {
                        callback(data);
                    }
                }
            )
            .subscribe();

        return channel;
    },

    /**
     * Subscribe to reactions on a post
     */
    subscribeToReactions: (
        postId: string,
        onAdd: () => void,
        onRemove: () => void
    ): RealtimeChannel => {
        const channel = supabase
            .channel(`post-${postId}-reactions`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'reactions',
                    filter: `post_id=eq.${postId}`,
                },
                () => {
                    onAdd();
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'reactions',
                    filter: `post_id=eq.${postId}`,
                },
                () => {
                    onRemove();
                }
            )
            .subscribe();

        return channel;
    },

    /**
     * Subscribe to notifications for current user
     */
    subscribeToNotifications: (
        callback: (notification: Notification) => void
    ): RealtimeChannel | null => {
        // Get current user synchronously from session
        const session = supabase.auth.getSession();

        session.then(({ data: { session: currentSession } }) => {
            if (!currentSession?.user) return null;

            const channel = supabase
                .channel('notifications-channel')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${currentSession.user.id}`,
                    },
                    payload => {
                        callback(payload.new as Notification);
                    }
                )
                .subscribe();

            return channel;
        });

        return null;
    },

    /**
     * Subscribe to circle activity
     */
    subscribeToCircle: (
        circleId: string,
        onNewPost: (post: Post) => void,
        onNewMember: () => void
    ): RealtimeChannel => {
        const channel = supabase
            .channel(`circle-${circleId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'posts',
                    filter: `circle_id=eq.${circleId}`,
                },
                async payload => {
                    const { data } = await supabase
                        .from('posts')
                        .select(
                            `
              *,
              author:profiles!posts_author_id_fkey(*)
            `
                        )
                        .eq('id', payload.new.id)
                        .single();

                    if (data) {
                        onNewPost(data);
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'circle_members',
                    filter: `circle_id=eq.${circleId}`,
                },
                () => {
                    onNewMember();
                }
            )
            .subscribe();

        return channel;
    },

    /**
     * Unsubscribe from a channel
     */
    unsubscribe: async (channel: RealtimeChannel): Promise<void> => {
        await supabase.removeChannel(channel);
    },

    /**
     * Unsubscribe from all channels
     */
    unsubscribeAll: async (): Promise<void> => {
        await supabase.removeAllChannels();
    },
};
