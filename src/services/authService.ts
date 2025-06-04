
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '../models/types';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  provider?: string;
  isGuest?: boolean;
}

export interface AuthSession {
  user: AuthUser | null;
  isLoading: boolean;
}

// Guest user for testing purposes
const GUEST_USER: AuthUser = {
  id: 'guest-user',
  email: 'guest@test.com',
  role: 'seeker',
  firstName: 'Guest',
  lastName: 'User',
  displayName: 'Guest User',
  isGuest: true,
  provider: 'guest'
};

// Guest hirer for testing purposes
const GUEST_HIRER: AuthUser = {
  id: 'guest-hirer',
  email: 'hirer@test.com',
  role: 'hirer',
  firstName: 'Guest',
  lastName: 'Hirer',
  displayName: 'Guest Hirer',
  isGuest: true,
  provider: 'guest'
};

export const authService = {
  // Sign up with email and password (skip email confirmation)
  signUpWithEmail: async (role: UserRole, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
        data: {
          role,
          provider: 'email'
        },
        emailRedirectTo: undefined // Skip email confirmation
      }
    });

    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  signInWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  // Continue as guest (for testing)
  continueAsGuest: async (role: UserRole = 'seeker') => {
    // Store guest user in localStorage for persistence
    const guestUser = role === 'hirer' ? { ...GUEST_HIRER } : { ...GUEST_USER, role };
    localStorage.setItem('guestUser', JSON.stringify(guestUser));
    return { user: guestUser };
  },

  // Sign in with OAuth provider
  signInWithOAuth: async (provider: 'google' | 'linkedin_oidc', role?: UserRole) => {
    const redirectUrl = `${window.location.origin}/auth`;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          role: role || 'seeker',
          provider
        }
      }
    });

    if (error) throw error;
    return data;
  },

  // Get current user with profile data
  getCurrentUser: async (): Promise<AuthUser | null> => {
    // Check for guest user first
    const guestUserStr = localStorage.getItem('guestUser');
    if (guestUserStr) {
      try {
        return JSON.parse(guestUserStr);
      } catch (error) {
        localStorage.removeItem('guestUser');
      }
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Get user profile from our profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
      role: profile.role as UserRole,
      firstName: profile.first_name,
      lastName: profile.last_name,
      displayName: profile.display_name,
      avatarUrl: profile.avatar_url,
      provider: profile.provider
    };
  },

  // Sign out
  signOut: async () => {
    // Clear guest user
    localStorage.removeItem('guestUser');
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get session
  getSession: async () => {
    // Check for guest user first
    const guestUserStr = localStorage.getItem('guestUser');
    if (guestUserStr) {
      return { user: JSON.parse(guestUserStr) };
    }

    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }
};
