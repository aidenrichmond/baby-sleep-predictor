import { router, Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../styles/global";
import { Text, View, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function TabLayout() {
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadName = async () => {
            const storedName = await AsyncStorage.getItem("babyName");
            if (isMounted) setName(storedName || "Baby");
        };

        loadName();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerTitle: '',
                headerLeft: () => {
                    if (name === null) return null;

                    return (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16 }}>
                        <Ionicons 
                            name='person-circle-outline' 
                            size={25} 
                            color={colors.textPrimary} 
                        />
                        <Text style={{
                            fontSize: 15,
                            fontWeight: '600',
                            color: colors.textPrimary,
                            marginLeft: 8,
                        }}>
                            {name}
                        </Text>
                        </View>
                    );
                },

                headerStyle: {
                    backgroundColor: colors.background,
                    borderBottomColor: colors.border,
                    borderBottomWidth: 1,
                    elevation: 0, // Android: remove shadow
                    shadowOpacity: 0, // iOS: remove shadow
                },
                headerShadowVisible: false,

                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                },

                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textPrimary,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerRight: () => (
                        <Pressable
                            onPress={() => router.push("/settings")}
                            style={{ marginRight: 16 }}
                        >
                            <Ionicons
                            name="settings-outline"
                            size={25}
                            color={colors.textPrimary}
                            />
                        </Pressable>
                        ),
                    tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" size={size} color={color} />
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
        </Tabs>
    );
}
