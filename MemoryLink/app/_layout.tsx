import { SplashScreen, Slot, useRouter, useSegments } from "expo-router";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "@/components/SafeScreen";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import COLORS from "@/constants/colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const segments = useSegments();
  const { user, token, isCheckingAuth, checkAuth, authCheckFailed } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  console.log(segments)
  // const getAll = async () => {
  //   const keys = await AsyncStorage.getAllKeys();
  //   const result = await AsyncStorage.multiGet(keys);
  //   const allValues = result.reduce((acc, [key, value]) => {
  //     try {
  //       // Parse if it's a JSON string, otherwise keep as raw string
  //       acc[key!] = value ? JSON.parse(value) : null;
  //     } catch {
  //       acc[key!] = value;
  //     }
  //     return acc;
  //   }, {} as Record<string, any>);
  //   console.log(allValues);
  // }
  // getAll();

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
    // const hasOnBoarded = user.hasOnBoarded && token;

    if (!inAuthScreen && !isSignedIn && !authCheckFailed) {
      // Check storage directly
      AsyncStorage.getItem('token').then(storedToken => {
        AsyncStorage.getItem('user').then(storedUser => {
          if (storedToken && storedUser) {
            // Has data in storage, don't redirect
            return;
          } else {
            router.replace('/(auth)');
          }
        }).catch(() => router.replace('/(auth)'));
      }).catch(() => router.replace('/(auth)'));
    } else if (isSignedIn && inAuthScreen) {
      router.replace('/(tabs)');
    }
    SplashScreen.hideAsync();
  }, [user, token, segments, isCheckingAuth, router, mounted, authCheckFailed]);

  if (isCheckingAuth) {
    return <View />;
  }
  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: COLORS.light.background.main}}>
      <SafeAreaProvider>
        <SafeScreen>
          <Slot />
        </SafeScreen>
      </SafeAreaProvider>
      </GestureHandlerRootView>
  )
}
