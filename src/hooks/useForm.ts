import { useState, useCallback } from 'react';

interface FormValues {
    [key: string]: string;
}

interface FormErrors {
    [key: string]: string;
}

interface ValidationRules {
    [key: string]: (value: string, values: FormValues) => string | undefined;
}

interface UseFormReturn<T extends FormValues> {
    values: T;
    errors: FormErrors;
    isSubmitting: boolean;
    handleChange: (name: keyof T) => (value: string) => void;
    handleSubmit: () => Promise<void>;
    setError: (name: keyof T, error: string) => void;
    clearError: (name: keyof T) => void;
    clearErrors: () => void;
    reset: () => void;
}

export function useForm<T extends FormValues>(
    initialValues: T,
    validationRules: ValidationRules,
    onSubmit: (values: T) => Promise<void>
): UseFormReturn<T> {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback(
        (name: keyof T) => (value: string) => {
            setValues(prev => ({ ...prev, [name]: value }));
            // Clear error when user starts typing
            if (errors[name as string]) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name as string];
                    return newErrors;
                });
            }
        },
        [errors]
    );

    const validate = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        Object.keys(validationRules).forEach(key => {
            const error = validationRules[key](values[key], values);
            if (error) {
                newErrors[key] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [values, validationRules]);

    const handleSubmit = useCallback(async () => {
        if (isSubmitting) return;

        const isValid = validate();
        if (!isValid) return;

        setIsSubmitting(true);
        try {
            await onSubmit(values);
        } catch (error: any) {
            // Handle submission errors
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [values, validate, onSubmit, isSubmitting]);

    const setError = useCallback((name: keyof T, error: string) => {
        setErrors(prev => ({ ...prev, [name as string]: error }));
    }, []);

    const clearError = useCallback((name: keyof T) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name as string];
            return newErrors;
        });
    }, []);

    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setIsSubmitting(false);
    }, [initialValues]);

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        setError,
        clearError,
        clearErrors,
        reset,
    };
}
