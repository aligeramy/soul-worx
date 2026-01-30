import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, AppStateStatus } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Track app state for session refresh on foreground
let appStateSubscription: { remove: () => void } | null = null;

// Refresh session when app comes to foreground
function setupAppStateListener() {
  if (appStateSubscription) return;
  
  appStateSubscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      // App came to foreground - refresh the session
      console.log('[Supabase] App active, refreshing session...');
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.log('[Supabase] Session refresh error:', error.message);
          if (isRefreshTokenError(error)) {
            await handleRefreshTokenError();
          }
          return;
        }
        
        // If we have a session, try to refresh the token proactively
        if (data.session) {
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.log('[Supabase] Token refresh error:', refreshError.message);
            if (isRefreshTokenError(refreshError)) {
              await handleRefreshTokenError();
            }
          } else {
            console.log('[Supabase] Session refreshed successfully');
          }
        }
      } catch (err: any) {
        console.error('[Supabase] Error during session refresh:', err);
        if (isRefreshTokenError(err)) {
          await handleRefreshTokenError();
        }
      }
    }
  });
}

// Initialize the listener
setupAppStateListener();

// Global error handler for refresh token errors
let isHandlingRefreshError = false;
let logoutHandler: (() => Promise<void>) | null = null;

// Function to check if an error is a refresh token error
function isRefreshTokenError(error: any): boolean {
  if (!error) return false;
  
  // Check error message
  const message = error.message || error.toString() || '';
  const hasRefreshTokenMessage = 
    message.includes('Invalid Refresh Token') ||
    message.includes('Refresh Token Not Found') ||
    message.includes('refresh_token_not_found');
  
  // Check error code/status
  const code = error.code || error.status || '';
  const hasRefreshTokenCode = 
    code === 'refresh_token_not_found' ||
    code === 'invalid_refresh_token';
  
  // Check error name (AuthApiError with refresh token message)
  const name = error.name || '';
  const isAuthApiError = name === 'AuthApiError' && hasRefreshTokenMessage;
  
  return hasRefreshTokenMessage || hasRefreshTokenCode || isAuthApiError;
}

// Function to handle refresh token errors
async function handleRefreshTokenError() {
  if (isHandlingRefreshError) return;
  
  isHandlingRefreshError = true;
  console.log('Refresh token error detected, signing out...');
  
  try {
    await supabase.auth.signOut();
    // If a logout handler is registered (from UserContext), call it
    if (logoutHandler) {
      await logoutHandler();
    }
  } catch (err) {
    console.error('Error during sign out:', err);
  } finally {
    // Reset after a delay to allow for retries if needed
    setTimeout(() => {
      isHandlingRefreshError = false;
    }, 1000);
  }
}

// Intercept console errors to catch refresh token errors that might be logged but not thrown
// This is the primary mechanism since Supabase logs these errors to console
if (typeof console !== 'undefined' && console.error) {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    // Check each argument for refresh token errors
    let foundRefreshTokenError = false;
    
    for (const arg of args) {
      // Check if it's an error object
      if (arg && typeof arg === 'object') {
        // Direct check using our function
        if (isRefreshTokenError(arg)) {
          foundRefreshTokenError = true;
          break;
        }
        
        // Also check nested properties that might contain the error
        if (arg.error && isRefreshTokenError(arg.error)) {
          foundRefreshTokenError = true;
          break;
        }
      }
      
      // Check string representation (handles cases where error is stringified)
      const argString = typeof arg === 'string' ? arg : 
                       (arg?.toString ? arg.toString() : '') || 
                       JSON.stringify(arg || '');
      
      if (argString.includes('Invalid Refresh Token') || 
          argString.includes('Refresh Token Not Found') ||
          argString.includes('refresh_token_not_found') ||
          argString.includes('AuthApiError') && argString.includes('Refresh Token')) {
        foundRefreshTokenError = true;
        break;
      }
    }
    
    if (foundRefreshTokenError) {
      // Use setTimeout to avoid blocking the console.error call
      setTimeout(() => {
        handleRefreshTokenError();
      }, 100);
    }
    
    // Call original console.error
    originalError.apply(console, args);
  };
}

// Set up a global listener for auth state changes to catch refresh token errors
supabase.auth.onAuthStateChange(async (event, session) => {
  // Handle token refresh errors - when refresh fails, session becomes null
  if (event === 'TOKEN_REFRESHED' && !session) {
    await handleRefreshTokenError();
    return;
  }
  
  // Check for error events (Supabase might emit error events)
  if (event === 'SIGNED_OUT' && !session) {
    // Check if this was due to an error by checking storage
    try {
      const storedSession = await AsyncStorage.getItem(`sb-${supabaseUrl.split('//')[1]?.split('.')[0]}-auth-token`);
      if (!storedSession) {
        // Session was cleared, might be due to refresh error
        // We'll let the error handlers catch it
      }
    } catch (err) {
      // Ignore storage errors
    }
  }
});

// Export function to register logout handler from UserContext
export function registerLogoutHandler(handler: () => Promise<void>) {
  logoutHandler = handler;
}

// Periodic session check to catch refresh token errors that might not trigger events
// Check every 30 seconds
let sessionCheckInterval: ReturnType<typeof setInterval> | null = null;

export function startSessionMonitoring() {
  if (sessionCheckInterval) return; // Already monitoring
  
  sessionCheckInterval = setInterval(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error && isRefreshTokenError(error)) {
        await handleRefreshTokenError();
        return;
      }
      
      // If we had a session before but now don't, and it's not a manual sign out,
      // it might be due to refresh token error
      if (!session && logoutHandler) {
        // Check if there's an error in storage or if session was cleared unexpectedly
        // This is a fallback check
      }
    } catch (error: any) {
      if (isRefreshTokenError(error)) {
        await handleRefreshTokenError();
      }
    }
  }, 30000); // Check every 30 seconds
}

export function stopSessionMonitoring() {
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval);
    sessionCheckInterval = null;
  }
}

// Start monitoring when module loads
if (typeof window !== 'undefined' || typeof global !== 'undefined') {
  startSessionMonitoring();
}