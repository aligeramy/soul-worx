import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import type { User as AuthUser } from '@supabase/supabase-js';
import type { User, MembershipTier } from '../lib/types';
import { getUserMembership } from '../lib/queries';
import { supabase } from '../lib/supabase';

interface UserContextType {
  user: User | null;
  tier: MembershipTier | null;
  accessLevel: number;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<MembershipTier | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserData(session.user);
      } else {
        // For development: Load mock user if no auth
        loadMockUser();
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserData(session.user);
      } else {
        setUser(null);
        setTier(null);
        // Uncomment to require auth: router.replace('/signin');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadMockUser() {
    // Use mock user for development without auth
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
  }

  async function loadUserData(authUser: AuthUser) {
    try {
      // Fetch full user data from user table
      const { data: userData, error: userError } = await supabase
        .from('user')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userError) throw userError;

      if (userData) {
        setUser(userData as User);
        
        // Load user's tier
        const userTier = await getUserMembership(authUser.id);
        setTier(userTier);
      }
    } catch (error) {
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
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/signin');
  }

  const accessLevel = tier?.accessLevel || 1;

  return (
    <UserContext.Provider value={{ user, tier, accessLevel, isLoading, signOut }}>
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

