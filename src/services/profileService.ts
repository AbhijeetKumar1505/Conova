import { supabase } from '../config/supabase';
import type { Profile } from '../types';

/**
 * Profile Service
 * Handles user profile operations
 */

export const profileService = {
    /**
     * Get a user profile by user ID
     */
    getProfile: async (userId: string): Promise<Profile | null> => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        return data;
    },

    /**
     * Get current user's profile
     */
    getCurrentProfile: async (): Promise<Profile | null> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return null;

        return profileService.getProfile(user.id);
    },

    /**
     * Update user profile
     */
    updateProfile: async (
        userId: string,
        updates: Partial<Pick<Profile, 'display_name' | 'bio' | 'avatar_url'>>
    ): Promise<Profile> => {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Upload avatar image
     */
    uploadAvatar: async (userId: string, file: File | Blob): Promise<string> => {
        const fileExt = file instanceof File ? file.name.split('.').pop() : 'jpg';
        const fileName = `${userId}/${Date.now()}.${fileExt}`;

        // Upload file to storage
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true,
            });

        if (uploadError) throw uploadError;

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from('avatars').getPublicUrl(fileName);

        // Update profile with new avatar URL
        await profileService.updateProfile(userId, { avatar_url: publicUrl });

        return publicUrl;
    },

    /**
     * Delete avatar image
     */
    deleteAvatar: async (userId: string, avatarUrl: string): Promise<void> => {
        // Extract file path from URL
        const urlParts = avatarUrl.split('/');
        const fileName = urlParts.slice(-2).join('/'); // userId/timestamp.ext

        const { error } = await supabase.storage.from('avatars').remove([fileName]);

        if (error) throw error;

        // Update profile to remove avatar URL
        await profileService.updateProfile(userId, { avatar_url: null as any });
    },

    /**
     * Search profiles by display name
     */
    searchProfiles: async (query: string, limit = 10): Promise<Profile[]> => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .ilike('display_name', `%${query}%`)
            .limit(limit);

        if (error) {
            console.error('Error searching profiles:', error);
            return [];
        }

        return data || [];
    },
};
