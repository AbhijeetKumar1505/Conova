import { supabase } from '../config/supabase';
import type { Circle, CircleMember } from '../types';

/**
 * Circle Service
 * Handles circle (community) operations
 */

export const circleService = {
    /**
     * Create a new circle
     */
    createCircle: async (
        name: string,
        description?: string,
        isPrivate = false
    ): Promise<Circle> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('circles')
            .insert({
                name,
                description,
                creator_id: user.id,
                is_private: isPrivate,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get all public circles or circles user is a member of
     */
    getCircles: async (limit = 20, offset = 0): Promise<Circle[]> => {
        const { data, error } = await supabase
            .from('circles')
            .select('*')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Error fetching circles:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Get a single circle by ID
     */
    getCircle: async (circleId: string): Promise<Circle | null> => {
        const { data, error } = await supabase
            .from('circles')
            .select('*')
            .eq('id', circleId)
            .single();

        if (error) {
            console.error('Error fetching circle:', error);
            return null;
        }

        return data;
    },

    /**
     * Update a circle
     */
    updateCircle: async (
        circleId: string,
        updates: Partial<Pick<Circle, 'name' | 'description' | 'is_private'>>
    ): Promise<Circle> => {
        const { data, error } = await supabase
            .from('circles')
            .update(updates)
            .eq('id', circleId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a circle
     */
    deleteCircle: async (circleId: string): Promise<void> => {
        const { error } = await supabase.from('circles').delete().eq('id', circleId);

        if (error) throw error;
    },

    /**
     * Join a circle
     */
    joinCircle: async (circleId: string): Promise<CircleMember> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('circle_members')
            .insert({
                circle_id: circleId,
                user_id: user.id,
                role: 'member',
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Leave a circle
     */
    leaveCircle: async (circleId: string): Promise<void> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('circle_members')
            .delete()
            .eq('circle_id', circleId)
            .eq('user_id', user.id);

        if (error) throw error;
    },

    /**
     * Get circle members
     */
    getCircleMembers: async (circleId: string): Promise<CircleMember[]> => {
        const { data, error } = await supabase
            .from('circle_members')
            .select('*')
            .eq('circle_id', circleId)
            .order('joined_at', { ascending: true });

        if (error) {
            console.error('Error fetching circle members:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Get member count for a circle
     */
    getMemberCount: async (circleId: string): Promise<number> => {
        const { count, error } = await supabase
            .from('circle_members')
            .select('*', { count: 'exact', head: true })
            .eq('circle_id', circleId);

        if (error) {
            console.error('Error fetching member count:', error);
            return 0;
        }

        return count || 0;
    },

    /**
     * Check if user is a member of a circle
     */
    isUserMember: async (circleId: string): Promise<boolean> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return false;

        const { data, error } = await supabase
            .from('circle_members')
            .select('id')
            .eq('circle_id', circleId)
            .eq('user_id', user.id)
            .single();

        return !error && !!data;
    },

    /**
     * Get circles user is a member of
     */
    getUserCircles: async (): Promise<Circle[]> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return [];

        const { data, error } = await supabase
            .from('circle_members')
            .select('circle_id, circles(*)')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching user circles:', error);
            return [];
        }

        return (data || []).map(item => item.circles).filter(Boolean) as Circle[];
    },

    /**
     * Search circles by name
     */
    searchCircles: async (query: string, limit = 10): Promise<Circle[]> => {
        const { data, error } = await supabase
            .from('circles')
            .select('*')
            .ilike('name', `%${query}%`)
            .eq('is_private', false)
            .limit(limit);

        if (error) {
            console.error('Error searching circles:', error);
            return [];
        }

        return data || [];
    },
};
