import { supabase } from '../config/supabase';
import type { Reaction, Comment } from '../types';

/**
 * Interaction Service
 * Handles reactions and comments
 */

export const interactionService = {
    // ===== REACTIONS =====

    /**
     * Add a reaction to a post
     */
    addReaction: async (
        postId: string,
        reactionType: 'like' | 'love' | 'celebrate'
    ): Promise<Reaction> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('reactions')
            .insert({
                post_id: postId,
                user_id: user.id,
                reaction_type: reactionType,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Remove a reaction from a post
     */
    removeReaction: async (postId: string): Promise<void> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('reactions')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id);

        if (error) throw error;
    },

    /**
     * Get reactions for a post
     */
    getReactions: async (postId: string): Promise<Reaction[]> => {
        const { data, error } = await supabase
            .from('reactions')
            .select('*')
            .eq('post_id', postId);

        if (error) {
            console.error('Error fetching reactions:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Get reaction count for a post
     */
    getReactionCount: async (postId: string): Promise<number> => {
        const { count, error } = await supabase
            .from('reactions')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', postId);

        if (error) {
            console.error('Error fetching reaction count:', error);
            return 0;
        }

        return count || 0;
    },

    /**
     * Check if current user has reacted to a post
     */
    hasUserReacted: async (postId: string): Promise<Reaction | null> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return null;

        const { data, error } = await supabase
            .from('reactions')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', user.id)
            .single();

        if (error) return null;
        return data;
    },

    // ===== COMMENTS =====

    /**
     * Add a comment to a post
     */
    addComment: async (postId: string, content: string): Promise<Comment> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('comments')
            .insert({
                post_id: postId,
                user_id: user.id,
                content,
            })
            .select(
                `
        *,
        author:profiles!comments_user_id_fkey(*)
      `
            )
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get comments for a post
     */
    getComments: async (postId: string): Promise<Comment[]> => {
        const { data, error } = await supabase
            .from('comments')
            .select(
                `
        *,
        author:profiles!comments_user_id_fkey(*)
      `
            )
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching comments:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Update a comment
     */
    updateComment: async (commentId: string, content: string): Promise<Comment> => {
        const { data, error } = await supabase
            .from('comments')
            .update({ content })
            .eq('id', commentId)
            .select(
                `
        *,
        author:profiles!comments_user_id_fkey(*)
      `
            )
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a comment
     */
    deleteComment: async (commentId: string): Promise<void> => {
        const { error } = await supabase.from('comments').delete().eq('id', commentId);

        if (error) throw error;
    },

    /**
     * Get comment count for a post
     */
    getCommentCount: async (postId: string): Promise<number> => {
        const { count, error } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', postId);

        if (error) {
            console.error('Error fetching comment count:', error);
            return 0;
        }

        return count || 0;
    },
};
