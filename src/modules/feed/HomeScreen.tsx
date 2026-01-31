import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../config/theme';

export const HomeScreen: React.FC = () => {
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Feed</Text>
            <Text style={styles.subtitle}>Welcome, {user?.profile?.display_name}!</Text>
            <Text style={styles.text}>Feed will be implemented in Phase 3 Part 2</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.background,
    },
    title: {
        fontSize: theme.typography.sizes.xxl,
        fontWeight: 'bold',
        color: theme.colors.gray[900],
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontSize: theme.typography.sizes.lg,
        color: theme.colors.gray[700],
        marginBottom: theme.spacing.md,
    },
    text: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.gray[600],
        textAlign: 'center',
    },
});
