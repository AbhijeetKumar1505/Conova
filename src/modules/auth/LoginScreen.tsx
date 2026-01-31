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

type LoginScreenProps = {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

interface LoginFormValues {
    [key: string]: string;
    email: string;
    password: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const { signIn } = useAuth();
    const [generalError, setGeneralError] = useState('');

    const { values, errors, isSubmitting, handleChange, handleSubmit } =
        useForm<LoginFormValues>(
            {
                email: '',
                password: '',
            },
            {
                email: (value) => {
                    if (!value) return 'Email is required';
                    if (!validateEmail(value)) return 'Invalid email format';
                    return undefined;
                },
                password: (value) => {
                    if (!value) return 'Password is required';
                    if (value.length < 6) return 'Password must be at least 6 characters';
                    return undefined;
                },
            },
            async (formValues) => {
                try {
                    setGeneralError('');
                    await signIn(formValues.email, formValues.password);
                } catch (error: any) {
                    setGeneralError(error.message || 'Invalid email or password');
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
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue to Conova</Text>
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
                            placeholder="Enter your password"
                            value={values.password}
                            onChangeText={handleChange('password')}
                            error={errors.password}
                            secureTextEntry
                            autoCapitalize="none"
                        />

                        <TouchableOpacity
                            onPress={() => navigation.navigate('ForgotPassword')}
                            style={styles.forgotPassword}
                        >
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <Button
                            title="Sign In"
                            onPress={handleSubmit}
                            loading={isSubmitting}
                            style={styles.submitButton}
                        />
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.signupLink}>Sign Up</Text>
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
    },
    form: {
        marginBottom: theme.spacing.xl,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: theme.spacing.lg,
    },
    forgotPasswordText: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.primary,
        fontWeight: '600',
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
    signupLink: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.primary,
        fontWeight: '600',
    },
});
