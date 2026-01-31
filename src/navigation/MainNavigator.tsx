import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../modules/feed/HomeScreen';
import { CirclesScreen } from '../modules/circles/CirclesScreen';
import { NotificationsScreen } from '../modules/notifications/NotificationsScreen';
import { ProfileScreen } from '../modules/profile/ProfileScreen';
import { theme } from '../config/theme';

export type MainTabParamList = {
    Home: undefined;
    Circles: undefined;
    Notifications: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabIcon: React.FC<{ emoji: string; focused: boolean }> = ({ emoji, focused }) => {
    return (
        <Text style={[
            iconStyles.icon,
            { color: focused ? theme.colors.primary : theme.colors.gray[500] }
        ]}>
            {emoji}
        </Text>
    );
};

export const MainNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.gray[500],
                tabBarStyle: iconStyles.tabBar,
                tabBarLabelStyle: iconStyles.tabBarLabel,
                headerStyle: iconStyles.header,
                headerTitleStyle: iconStyles.headerTitle,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
                    title: 'Feed',
                }}
            />
            <Tab.Screen
                name="Circles"
                component={CirclesScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon emoji="👥" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon emoji="🔔" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
                }}
            />
        </Tab.Navigator>
    );
};

const iconStyles = StyleSheet.create({
    icon: {
        fontSize: 24,
    },
    tabBar: {
        backgroundColor: theme.colors.white,
        borderTopColor: theme.colors.gray[200],
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: '600' as any,
    },
    header: {
        backgroundColor: theme.colors.white,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray[200],
    },
    headerTitle: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: 'bold' as any,
        color: theme.colors.gray[900],
    },
});
