import { Stack, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkOnboarding() {
      // await AsyncStorage.clear(); // REMOVE THIS WHEN DONE TESTING
      const value = await AsyncStorage.getItem("onboardingComplete");
      setOnboarded(value === "true");
    }

    checkOnboarding();
  }, []);

  useEffect(() => {
    if (onboarded === null) return;

    if (onboarded) {
      router.replace("/(tabs)");
    } else {
      router.replace("/getStarted");
    }
  }, [onboarded]);

  if (onboarded === null) {
    return null;
  }

  return (
    <Stack screenOptions={{ animation: "none" }}>
      <Stack.Screen
        name="getStarted"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="onboarding"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}