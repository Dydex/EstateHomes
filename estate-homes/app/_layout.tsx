import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/context/auth';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const { isLoading, hasSeenOnboarding, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const inOnboarding = segments[0] === 'onboarding';
    const inAuth = segments[0] === '(auth)';
    const inTabs = segments[0] === '(tabs)';

    if (!hasSeenOnboarding) {
      if (!inOnboarding && !inAuth) {
        router.replace('/onboarding');
      }
    } else {
      if (!isLoggedIn) {
        if (!inAuth) {
          router.replace('/welcome');
        }
      } else {
        if (!inTabs && segments[1] !== 'addProperty' && segments[1] !== 'propertySuccess' && segments[1] !== 'addTenant') {
          router.replace('/(tabs)');
        }
      }
    }
  }, [hasSeenOnboarding, isLoggedIn, isLoading, segments]);

  if (isLoading) {
    return null; // Keep splash screen or return simple loader
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="onboarding/index" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}



