import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../config/theme';

export const CirclesScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Circles</Text>
            <Text style={styles.text}>Circles will be implemented in Phase 3 Part 3</Text>
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
