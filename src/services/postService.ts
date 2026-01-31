import { supabase } from '../config/supabase';
import type { Post } from '../types';

/**
 * Post Service
 * Handles post operations
 */

export const postService = {
    /**
     * Create a new post
     */
    createPost: async (
        content: string,
        imageFile?: File | Blob,
        circleId?: string
    ): Promise<Post> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error('User not authenticated');

        let imageUrl: string | undefined;

        // Upload image if provided
        if (imageFile) {
            imageUrl = await postService.uploadPostImage(user.id, imageFile);
        }

        // Create post
        const { data, error } = await supabase
            .from('posts')
            .insert({
                author_id: user.id,
                content,
                image_url: imageUrl,
                circle_id: circleId,
            })
            .select(
                `
        *,
        author:profiles!posts_author_id_fkey(*)
      `
            )
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get posts with pagination
     */
    getPosts: async (
        circleId?: string,
        limit = 20,
        offset = 0
    ): Promise<Post[]> => {
        let query = supabase
            .from('posts')
            .select(
                `
        *,
        author:profiles!posts_author_id_fkey(*)
      `
            )
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (circleId) {
            query = query.eq('circle_id', circleId);
        } else {
            // Get posts without a circle (public feed)
            query = query.is('circle_id', null);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching posts:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Get a single post by ID
     */
    getPost: async (postId: string): Promise<Post | null> => {
        const { data, error } = await supabase
            .from('posts')
            .select(
                `
        *,
        author:profiles!posts_author_id_fkey(*)
      `
            )
            .eq('id', postId)
            .single();

        if (error) {
            console.error('Error fetching post:', error);
            return null;
        }

        return data;
    },

    /**
     * Update a post
     */
    updatePost: async (
        postId: string,
        updates: Partial<Pick<Post, 'content' | 'image_url'>>
    ): Promise<Post> => {
        const { data, error } = await supabase
            .from('posts')
            .update(updates)
            .eq('id', postId)
            .select(
                `
        *,
        author:profiles!posts_author_id_fkey(*)
      `
            )
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a post
     */
    deletePost: async (postId: string): Promise<void> => {
        const { error } = await supabase.from('posts').delete().eq('id', postId);

        if (error) throw error;
    },

    /**
     * Upload post image
     */
    uploadPostImage: async (userId: string, file: File | Blob): Promise<string> => {
        const fileExt = file instanceof File ? file.name.split('.').pop() : 'jpg';
        const fileName = `${userId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('post-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) throw uploadError;

        const {
            data: { publicUrl },
        } = supabase.storage.from('post-images').getPublicUrl(fileName);

        return publicUrl;
    },

    /**
     * Get posts by user
     */
    getPostsByUser: async (userId: string, limit = 20): Promise<Post[]> => {
        const { data, error } = await supabase
            .from('posts')
            .select(
                `
        *,
        author:profiles!posts_author_id_fkey(*)
      `
            )
            .eq('author_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching user posts:', error);
            return [];
        }

        return data || [];
    },
};
