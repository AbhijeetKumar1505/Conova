import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../config/theme';

export const ProfileScreen: React.FC = () => {
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>{user?.profile?.display_name}</Text>
            <Text style={styles.email}>{user?.email}</Text>

            <View style={styles.content}>
                <Text style={styles.text}>Profile details will be implemented in Phase 3 Part 3</Text>
            </View>

            <Button
                title="Sign Out"
                onPress={handleSignOut}
                variant="outline"
                style={styles.signOutButton}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.background,
    },
    title: {
        fontSize: theme.typography.sizes.xxl,
        fontWeight: 'bold',
        color: theme.colors.gray[900],
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: '600',
        color: theme.colors.gray[700],
        textAlign: 'center',
        marginBottom: theme.spacing.xs,
    },
    email: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.gray[600],
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.gray[600],
        textAlign: 'center',
    },
    signOutButton: {
        marginTop: theme.spacing.lg,
    },
});
