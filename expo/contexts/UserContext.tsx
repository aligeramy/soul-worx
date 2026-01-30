import type { User as AuthUser } from '@supabase/supabase-js';
import { router } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getUserMembership } from '../lib/queries';
import { registerLogoutHandler, supabase } from '../lib/supabase';
import type { MembershipTier, User } from '../lib/types';

interface UserContextType {
  user: User | null;
  tier: MembershipTier | null;
  accessLevel: number;
  isLoading: boolean;
  isInitialized: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<MembershipTier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const isRefreshing = useRef(false);
  const lastRefreshTime = useRef(0);

  const signOut = useCallback(async () => {
    console.log('[UserContext] Signing out...');
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[UserContext] Error during signOut:', err);
    }
    setUser(null);
    setTier(null);
    router.replace('/signin');
  }, []);

  // Helper to check for refresh token errors
  const isRefreshTokenError = useCallback((error: any): boolean => {
    if (!error) return false;
    const message = error.message || error.toString() || '';
    return (
      message.includes('Invalid Refresh Token') ||
      message.includes('Refresh Token Not Found') ||
      message.includes('refresh_token_not_found')
    );
  }, []);

  // Load mock user for development without auth
  const loadMockUser = useCallback(async () => {
    const mockUser: User = {
      id: '73f7691f-2ecf-4d0f-955e-89659ec4caa3',
      name: 'Realeyes',
      email: 'ali@softx.ca',
      emailVerified: new Date(),
      image: null,
      role: 'user',
      discordId: null,
      discordUsername: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setUser(mockUser);
    
    // Load tier for mock user
    try {
      const userTier = await getUserMembership(mockUser.id);
      setTier(userTier);
    } catch (error) {
      console.error('Error loading mock user tier:', error);
      setTier({
        id: 'free-tier',
        name: 'Free',
        slug: 'free',
        level: 'free',
        description: 'Free tier',
        features: [],
        accessLevel: 2, // Give premium access for testing
        price: '0',
        billingPeriod: null,
        stripePriceId: null,
        discordRoleId: null,
        dmAccessEnabled: false,
        isActive: true,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    setIsLoading(false);
  }, []);

  // Load user data from database
  const loadUserData = useCallback(async (authUser: AuthUser) => {
    try {
      // Fetch full user data from user table
      const { data: userData, error: userError } = await supabase
        .from('user')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userError) {
        // Check for refresh token errors
        const errorMessage = userError.message || '';
        if (errorMessage.includes('Invalid Refresh Token') || errorMessage.includes('Refresh Token Not Found')) {
          console.log('Refresh token invalid during data load, signing out...');
          await signOut();
          return;
        }
        throw userError;
      }

      if (userData) {
        setUser(userData as User);
        
        // Load user's tier
        const userTier = await getUserMembership(authUser.id);
        setTier(userTier);
      }
    } catch (error: any) {
      // Check for refresh token errors in catch block
      const errorMessage = error?.message || '';
      if (errorMessage.includes('Invalid Refresh Token') || errorMessage.includes('Refresh Token Not Found')) {
        console.log('Refresh token invalid, signing out...');
        await signOut();
        return;
      }
      
      console.error('Error loading user data:', error);
      // Default to free tier on error
      setTier({
        id: 'free-tier',
        name: 'Free',
        slug: 'free',
        level: 'free',
        description: 'Free tier',
        features: [],
        accessLevel: 1,
        price: '0',
        billingPeriod: null,
        stripePriceId: null,
        discordRoleId: null,
        dmAccessEnabled: false,
        isActive: true,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [signOut]);

  // Function to refresh session - can be called externally
  const refreshSession = useCallback(async () => {
    // Prevent multiple simultaneous refresh calls
    if (isRefreshing.current) {
      console.log('[UserContext] Already refreshing, skipping...');
      return;
    }
    
    // Rate limit refreshes to once per 5 seconds
    const now = Date.now();
    if (now - lastRefreshTime.current < 5000) {
      console.log('[UserContext] Rate limiting refresh...');
      return;
    }
    
    isRefreshing.current = true;
    lastRefreshTime.current = now;
    
    console.log('[UserContext] Refreshing session...');
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('[UserContext] Session error:', error.message);
        if (isRefreshTokenError(error)) {
          await signOut();
          return;
        }
      }
      
      if (session?.user) {
        // Try to refresh the token
        const { data, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('[UserContext] Refresh error:', refreshError.message);
          if (isRefreshTokenError(refreshError)) {
            await signOut();
            return;
          }
        }
        
        if (data.session?.user) {
          console.log('[UserContext] Session refreshed, reloading user data...');
          await loadUserData(data.session.user);
        }
      }
    } catch (err: any) {
      console.error('[UserContext] Error during refresh:', err);
      if (isRefreshTokenError(err)) {
        await signOut();
      }
    } finally {
      isRefreshing.current = false;
    }
  }, [signOut, isRefreshTokenError, loadUserData]);

  useEffect(() => {
    // Register logout handler so global error handlers can trigger logout
    registerLogoutHandler(signOut);
    
    let isMounted = true;
    
    async function initializeAuth() {
      console.log('[UserContext] Initializing auth...');
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        // Check for refresh token errors
        if (error) {
          console.error('[UserContext] Initial session error:', error.message);
          if (isRefreshTokenError(error)) {
            console.log('[UserContext] Refresh token invalid, signing out...');
            await signOut();
            return;
          }
        }
        
        if (session?.user) {
          console.log('[UserContext] Found existing session for:', session.user.email);
          await loadUserData(session.user);
        } else {
          console.log('[UserContext] No session found, loading mock user for dev...');
          // For development: Load mock user if no auth
          await loadMockUser();
        }
      } catch (error: any) {
        console.error('[UserContext] Error during init:', error);
        if (isRefreshTokenError(error)) {
          await signOut();
          return;
        }
        // Fallback to mock user on error
        await loadMockUser();
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    }
    
    initializeAuth();
    
    // Register for push notifications after user is loaded
    if (user?.id) {
      import('@/lib/push-notifications').then(({ registerForPushNotificationsAsync }) => {
        registerForPushNotificationsAsync(user.id);
      });
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[UserContext] Auth state changed:', event);
      
      if (!isMounted) return;
      
      // Handle specific events
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            console.log('[UserContext] User signed in:', session.user.email);
            await loadUserData(session.user);
          }
          break;
          
        case 'SIGNED_OUT':
          console.log('[UserContext] User signed out');
          setUser(null);
          setTier(null);
          setIsLoading(false);
          break;
          
        case 'TOKEN_REFRESHED':
          if (session?.user) {
            console.log('[UserContext] Token refreshed for:', session.user.email);
            // Don't reload full user data on token refresh to avoid flicker
            // Just log that it happened
          } else {
            console.log('[UserContext] Token refresh failed, signing out...');
            await signOut();
          }
          break;
          
        case 'USER_UPDATED':
          if (session?.user) {
            console.log('[UserContext] User updated, reloading data...');
            await loadUserData(session.user);
          }
          break;
          
        default:
          // Handle other events (INITIAL_SESSION, etc.)
          // Only load if we don't have a user yet
          break;
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [signOut, isRefreshTokenError, loadMockUser, loadUserData]);

  const accessLevel = tier?.accessLevel || 1;

  return (
    <UserContext.Provider value={{ user, tier, accessLevel, isLoading, isInitialized, signOut, refreshSession }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

