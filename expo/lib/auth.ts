import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { supabase } from './supabase';

const WEB_APP_URL = 'https://beta.soulworx.ca';
const TOKEN_STORAGE_KEY = '@soulworx:access_token';
const REFRESH_TOKEN_STORAGE_KEY = '@soulworx:refresh_token';

/**
 * Open signup page in web browser
 */
export async function openSignup(): Promise<void> {
  const signupUrl = `${WEB_APP_URL}/signup?mobile=true`;
  await WebBrowser.openBrowserAsync(signupUrl);
}

/**
 * Open signin page in web browser
 */
export async function openSignIn(): Promise<void> {
  const signinUrl = `${WEB_APP_URL}/signin?mobile=true`;
  await WebBrowser.openBrowserAsync(signinUrl);
}

/**
 * Store auth tokens from deep link
 */
export async function storeAuthTokens(accessToken: string, refreshToken: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  await AsyncStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
}

/**
 * Get stored access token
 */
export async function getAccessToken(): Promise<string | null> {
  return await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
}

/**
 * Get stored refresh token
 */
export async function getRefreshToken(): Promise<string | null> {
  return await AsyncStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

/**
 * Clear auth tokens
 */
export async function clearAuth(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken();
  return !!token;
}

/**
 * Handle deep link callback from web auth
 */
export async function handleAuthCallback(url: string): Promise<void> {
  const parsed = Linking.parse(url);
  
  if (parsed.hostname === 'auth' && parsed.queryParams) {
    const { token, refreshToken } = parsed.queryParams;
    
    if (token && typeof token === 'string') {
      await storeAuthTokens(token, (refreshToken as string) || '');
      
      // Verify token with backend
      try {
        const response = await fetch(`${WEB_APP_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          // Token is valid, navigate to home
          router.replace('/(tabs)/programs');
        } else {
          // Token invalid, clear and redirect to signin
          await clearAuth();
          router.replace('/signin');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        await clearAuth();
        router.replace('/signin');
      }
    }
  }
}

/**
 * Setup deep link listener for auth callbacks
 */
export function setupDeepLinkListener(): () => void {
  // Handle initial URL (if app was opened via deep link)
  Linking.getInitialURL().then((url) => {
    if (url) {
      handleAuthCallback(url);
    }
  });

  // Handle deep links while app is running
  const subscription = Linking.addEventListener('url', (event) => {
    handleAuthCallback(event.url);
  });

  return () => {
    subscription.remove();
  };
}
