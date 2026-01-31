export const colors = {
    // Primary Colors
    primary: '#6366F1', // Indigo
    primaryDark: '#4F46E5',
    primaryLight: '#818CF8',

    // Secondary Colors
    secondary: '#EC4899', // Pink
    secondaryDark: '#DB2777',
    secondaryLight: '#F472B6',

    // Accent Colors
    accent: '#14B8A6', // Teal
    accentDark: '#0D9488',
    accentLight: '#2DD4BF',

    // Neutral Colors
    background: '#FFFFFF',
    backgroundDark: '#0F172A', // Dark mode background
    surface: '#F8FAFC',
    surfaceDark: '#1E293B',

    // Text Colors
    text: '#0F172A',
    textSecondary: '#64748B',
    textLight: '#94A3B8',
    textDark: '#FFFFFF',
    textDarkSecondary: '#CBD5E1',

    // Status Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // UI Elements
    border: '#E2E8F0',
    borderDark: '#334155',
    divider: '#F1F5F9',
    shadow: '#00000015',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const typography = {
    fontFamily: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
    },
    fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 24,
        xxl: 32,
        xxxl: 40,
    },
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
};

export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
};

export const shadows = {
    sm: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    lg: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
};

// Combined theme object
export const theme = {
    colors: {
        ...colors,
        // Add gray scale for easier access
        gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
        },
        white: '#FFFFFF',
        black: '#000000',
        // Status light colors for backgrounds
        successLight: '#D1FAE5',
        errorLight: '#FEE2E2',
        warningLight: '#FEF3C7',
        infoLight: '#DBEAFE',
    },
    spacing,
    typography: {
        ...typography,
        sizes: typography.fontSize, // Alias for easier access
    },
    borderRadius,
    shadows,
};
