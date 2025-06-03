
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
}

export interface AuthSession {
  user: AuthUser | null;
  isLoading: boolean;
}

export const authService = {
  // Sign up with email and password
  signUpWithEmail: async (role: UserRole, email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/auth`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          role,
          provider: 'email'
        }
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
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get session
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }
};
