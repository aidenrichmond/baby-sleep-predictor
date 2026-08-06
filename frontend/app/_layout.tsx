import { Stack, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkOnboarding() {
      await AsyncStorage.clear(); // REMOVE THIS WHEN DONE TESTING
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
      router.replace("/onboarding");
    }
  }, [onboarded]);

  if (onboarded === null) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}