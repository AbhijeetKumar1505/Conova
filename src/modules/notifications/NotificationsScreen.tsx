import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../config/theme';

export const NotificationsScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.text}>Notifications will be implemented in Phase 3 Part 4</Text>
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
        marginBottom: theme.spacing.md,
    },
    text: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.gray[600],
        textAlign: 'center',
    },
});
