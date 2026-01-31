import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../config/theme';

interface ErrorMessageProps {
    message: string;
    onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    onDismiss,
}) => {
    if (!message) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.icon}>⚠️</Text>
            <Text style={styles.message}>{message}</Text>
            {onDismiss && (
                <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
                    <Text style={styles.dismissText}>✕</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.errorLight,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.error,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    icon: {
        fontSize: 20,
        marginRight: theme.spacing.sm,
    },
    message: {
        flex: 1,
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.error,
        fontWeight: '500',
    },
    dismissButton: {
        padding: theme.spacing.xs,
    },
    dismissText: {
        fontSize: 18,
        color: theme.colors.error,
        fontWeight: 'bold',
    },
});
