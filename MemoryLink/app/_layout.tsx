import { SplashScreen, Slot, useRouter, useSegments } from "expo-router";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "@/components/SafeScreen";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const segments = useSegments();
  const { user, token, isCheckingAuth, checkAuth } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  console.log(segments)

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isCheckingAuth || !mounted) return;

    const inAuthScreen = segments[0] === '(auth)';
    const isSignedIn = user && token;

    if (!inAuthScreen && !isSignedIn) {
      router.replace('/(auth)');
    } else if (isSignedIn && inAuthScreen) {
      router.replace('/(tabs)');
    }
    SplashScreen.hideAsync();
  }, [user, token, segments, isCheckingAuth, router, mounted]);

  if (isCheckingAuth) {
    return <View />;
  }
  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </SafeAreaProvider>
  )
}
