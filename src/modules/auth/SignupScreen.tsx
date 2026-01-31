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
import { validateEmail, validatePassword } from '../../utils/helpers';

type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
};

type SignupScreenProps = {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Signup'>;
};

interface SignupFormValues {
    [key: string]: string;
    displayName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
    const { signUp } = useAuth();
    const [generalError, setGeneralError] = useState('');

    const { values, errors, isSubmitting, handleChange, handleSubmit } =
        useForm<SignupFormValues>(
            {
                displayName: '',
                email: '',
                password: '',
                confirmPassword: '',
            },
            {
                displayName: (value) => {
                    if (!value) return 'Display name is required';
                    if (value.length < 2) return 'Display name must be at least 2 characters';
                    if (value.length > 50) return 'Display name must be less than 50 characters';
                    return undefined;
                },
                email: (value) => {
                    if (!value) return 'Email is required';
                    if (!validateEmail(value)) return 'Invalid email format';
                    return undefined;
                },
                password: (value) => {
                    if (!value) return 'Password is required';
                    const result = validatePassword(value);
                    if (!result.valid) {
                        return result.message || 'Password is too weak';
                    }
                    return undefined;
                },
                confirmPassword: (value, allValues) => {
                    if (!value) return 'Please confirm your password';
                    if (value !== allValues.password) return 'Passwords do not match';
                    return undefined;
                },
            },
            async (formValues) => {
                try {
                    setGeneralError('');
                    await signUp(formValues.email, formValues.password, formValues.displayName);
                } catch (error: any) {
                    setGeneralError(error.message || 'Failed to create account');
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
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join Conova and connect with others</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {generalError && (
                            <ErrorMessage
                                message={generalError}
                                onDismiss={() => setGeneralError('')}
                            />
                        )}

                        <Input
                            label="Display Name"
                            placeholder="Enter your name"
                            value={values.displayName}
                            onChangeText={handleChange('displayName')}
                            error={errors.displayName}
                            autoCapitalize="words"
                        />

                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            error={errors.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Input
                            label="Password"
                            placeholder="Create a password"
                            value={values.password}
                            onChangeText={handleChange('password')}
                            error={errors.password}
                            secureTextEntry
                            autoCapitalize="none"
                        />

                        <Input
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={values.confirmPassword}
                            onChangeText={handleChange('confirmPassword')}
                            error={errors.confirmPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />

                        <Button
                            title="Sign Up"
                            onPress={handleSubmit}
                            loading={isSubmitting}
                            style={styles.submitButton}
                        />
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Sign In</Text>
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
    },
    form: {
        marginBottom: theme.spacing.xl,
    },
    submitButton: {
        marginTop: theme.spacing.md,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.gray[600],
    },
    loginLink: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.primary,
        fontWeight: '600',
    },
});
