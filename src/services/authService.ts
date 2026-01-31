import { supabase } from '../config/supabase';
import type { AuthUser } from '../types';

/**
 * Authentication Service
 * Handles user authentication operations
 */

export const authService = {
    /**
     * Sign up a new user
     */
    signUp: async (email: string, password: string, displayName: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: displayName,
                },
            },
        });

        if (error) throw error;
        return data;
    },

    /**
     * Sign in an existing user
     */
    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    },

    /**
     * Sign out the current user
     */
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /**
     * Send password recovery email
     */
    resetPassword: async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
    },

    /**
     * Update user password
     */
    updatePassword: async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) throw error;
    },

    /**
     * Get current user session
     */
    getCurrentUser: async (): Promise<AuthUser | null> => {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error || !user) return null;

        // Fetch user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

        return {
            id: user.id,
            email: user.email!,
            profile: profile || undefined,
        };
    },

    /**
     * Listen to auth state changes
     */
    onAuthStateChange: (callback: (user: AuthUser | null) => void) => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();

                callback({
                    id: session.user.id,
                    email: session.user.email!,
                    profile: profile || undefined,
                });
            } else {
                callback(null);
            }
        });

        return subscription;
    },

    /**
     * Get current session
     */
    getSession: async () => {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession();

        if (error) throw error;
        return session;
    },
};
