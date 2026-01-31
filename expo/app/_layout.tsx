import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { UserProvider, useUser } from '@/contexts/UserContext';
import { SoulworxColors } from '@/constants/colors';
import { setupDeepLinkListener } from '@/lib/auth';
import { setupNotificationListeners } from '@/lib/push-notifications';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Soulworx brown/beige theme - matching web app
const SoulworxTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: SoulworxColors.gold,
    background: SoulworxColors.beige, // Brown background
    card: SoulworxColors.charcoal, // Dark brown cards
    text: SoulworxColors.textPrimary, // Light text
    border: SoulworxColors.border,
    notification: SoulworxColors.gold,
  },
};

// Loading screen shown while auth is initializing
function AuthLoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Image
        source={require('@/assets/images/logo-white.png')}
        style={styles.loadingLogo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color={SoulworxColors.gold} style={styles.loadingSpinner} />
    </View>
  );
}

// Inner component that uses the UserContext
function RootLayoutContent() {
  const { isInitialized } = useUser();

  // Setup deep link listener for auth callbacks
  useEffect(() => {
    const cleanup = setupDeepLinkListener();
    return cleanup;
  }, []);

  // Setup notification listeners for push notifications
  useEffect(() => {
    const cleanup = setupNotificationListeners(
      (notification) => {
        console.log('Notification received:', notification);
      },
      (response) => {
        console.log('Notification tapped:', response);
        const data = response.notification.request.content.data;
        
        // Handle deep links from notifications
        if (data?.deepLink) {
          // Parse deep link (e.g., soulworx://personalized-programs/[programId])
          const url = data.deepLink.replace('soulworx://', '/');
          router.push(url as any);
        } else if (data?.programId) {
          // Navigate to program detail
          router.push(`/personalized-programs/${data.programId}` as any);
        }
      }
    );
    return cleanup;
  }, []);

  // Show loading screen until auth state is determined
  if (!isInitialized) {
    return (
      <>
        <AuthLoadingScreen />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/interest" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/questions" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/tiers" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/pro-plus-questionnaire" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/book-call" options={{ headerShown: false }} />
        <Stack.Screen name="upgrade" options={{ headerShown: false }} />
        <Stack.Screen name="personalized-programs/index" options={{ headerShown: false }} />
        <Stack.Screen name="personalized-programs/[programId]" options={{ headerShown: false }} />
        <Stack.Screen name="admin/personalized-programs" options={{ headerShown: false }} />
        <Stack.Screen name="admin/personalized-programs/[userId]" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="program/[id]" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="channel/[slug]" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="video/[id]" 
            options={{ 
              presentation: 'modal',
              headerShown: false,
              animation: 'slide_from_bottom',
            }} 
          />
          <Stack.Screen 
            name="settings/notifications" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="settings/privacy" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="resources/career/[title]" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="journal" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="journal/new" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="journal/[id]" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="journal/timeline" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="admin" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="admin/programs" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="admin/programs/[id]" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="admin/channels" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="admin/channels/[id]" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="admin/videos" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="admin/videos/[id]" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="admin/events" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="admin/events/[id]" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="admin/stories" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="admin/stories/[id]" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="admin/shop" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="admin/shop/[id]" 
            options={{ 
              presentation: 'card',
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}

export default function RootLayout() {
  return (
    <UserProvider>
      <ThemeProvider value={SoulworxTheme}>
        <RootLayoutContent />
      </ThemeProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SoulworxColors.beige,
  },
  loadingLogo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  loadingSpinner: {
    marginTop: 16,
  },
});
