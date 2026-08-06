import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: '#ffffff' },
                tabBarActiveTintColor: '#4bd600',
                tabBarInactiveTintColor: '#6b6d80',
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                title: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name='home' size={size} color={color} />
                ),
                }}
            />
            <Tabs.Screen 
                name="calendar" 
                options={{ 
                title: 'Calendar',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name='calendar' size={size} color={color} />
                ),
                }} 
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='settings-sharp' size={size} color={color} />
                    )
                }}
            />
        </Tabs>
    );
}
