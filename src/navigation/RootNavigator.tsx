import React from 'react';
import { View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const RootNavigator: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner text="Loading..." />;
    }

    return user ? <MainNavigator /> : <AuthNavigator />;
};
