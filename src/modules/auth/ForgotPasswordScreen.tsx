import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ErrorMessage } from '../../components/ErrorMessage';
import { theme } from '../../config/theme';
import { validateEmail } from '../../utils/helpers';

type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
};

type ForgotPasswordScreenProps = {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
};

interface ForgotPasswordFormValues {
    email: string;
    [key: string]: string;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
    navigation,
}) => {
    const { resetPassword } = useAuth();
    const [generalError, setGeneralError] = useState('');
    const [success, setSuccess] = useState(false);

    const { values, errors, isSubmitting, handleChange, handleSubmit } =
        useForm<ForgotPasswordFormValues>(
            {
                email: '',
            },
            {
                email: (value) => {
                    if (!value) return 'Email is required';
                    if (!validateEmail(value)) return 'Invalid email format';
                    return undefined;
                },
            },
            async (formValues) => {
                try {
                    setGeneralError('');
                    setSuccess(false);
                    await resetPassword(formValues.email);
                    setSuccess(true);
                } catch (error: any) {
                    setGeneralError(error.message || 'Failed to send reset email');
                    throw error;
                }
            }
        );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Forgot Password?</Text>
                        <Text style={styles.subtitle}>
                            Enter your email and we'll send you a link to reset your password
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {generalError && (
                            <ErrorMessage
                                message={generalError}
                                onDismiss={() => setGeneralError('')}
                            />
                        )}

                        {success && (
                            <View style={styles.successMessage}>
                                <Text style={styles.successIcon}>✓</Text>
                                <Text style={styles.successText}>
                                    Password reset link sent! Check your email.
                                </Text>
                            </View>
                        )}

                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            error={errors.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!success}
                        />

                        <Button
                            title={success ? 'Resend Link' : 'Send Reset Link'}
                            onPress={handleSubmit}
                            loading={isSubmitting}
                            style={styles.submitButton}
                        />
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.backLink}>← Back to Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: theme.spacing.xl,
        justifyContent: 'center',
    },
    header: {
        marginBottom: theme.spacing.xxl,
        alignItems: 'center',
    },
    title: {
        fontSize: theme.typography.sizes.xxl,
        fontWeight: 'bold',
        color: theme.colors.gray[900],
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.gray[600],
        textAlign: 'center',
        paddingHorizontal: theme.spacing.md,
    },
    form: {
        marginBottom: theme.spacing.xl,
    },
    successMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.successLight,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.success,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    successIcon: {
        fontSize: 20,
        marginRight: theme.spacing.sm,
        color: theme.colors.success,
    },
    successText: {
        flex: 1,
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.success,
        fontWeight: '500',
    },
    submitButton: {
        marginTop: theme.spacing.md,
    },
    footer: {
        alignItems: 'center',
    },
    backLink: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.primary,
        fontWeight: '600',
    },
});
