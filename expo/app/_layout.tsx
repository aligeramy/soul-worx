import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { UserProvider } from '@/contexts/UserContext';
import { SoulworxColors } from '@/constants/colors';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Soulworx light theme
const SoulworxTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: SoulworxColors.gold,
    background: SoulworxColors.beige,
    card: SoulworxColors.white,
    text: SoulworxColors.textPrimary,
    border: SoulworxColors.border,
  },
};

export default function RootLayout() {
  return (
    <UserProvider>
      <ThemeProvider value={SoulworxTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="signin" options={{ headerShown: false }} />
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
      </Stack>
        <StatusBar style="dark" />
    </ThemeProvider>
    </UserProvider>
  );
}
