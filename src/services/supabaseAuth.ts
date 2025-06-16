
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  role?: 'hirer' | 'seeker';
  profileId?: string;
  createdAt: Date;
}

export interface AuthError {
  message: string;
}

export const supabaseAuth = {
  // Sign up with email and password
  signUp: async (email: string, password: string): Promise<{ user: AuthUser | null; error: AuthError | null }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        return { user: null, error: { message: error.message } };
      }

      if (data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email!,
          createdAt: new Date(data.user.created_at)
        };
        return { user: authUser, error: null };
      }

      return { user: null, error: { message: 'Unknown error occurred' } };
    } catch (err) {
      return { user: null, error: { message: 'Network error occurred' } };
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<{ user: AuthUser | null; error: AuthError | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { user: null, error: { message: error.message } };
      }

      if (data.user) {
        // Get the user's profile to check their role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email!,
          role: profile?.role,
          createdAt: new Date(data.user.created_at)
        };
        return { user: authUser, error: null };
      }

      return { user: null, error: { message: 'Unknown error occurred' } };
    } catch (err) {
      return { user: null, error: { message: 'Network error occurred' } };
    }
  },

  // Update user role
  updateUserRole: async (role: 'hirer' | 'seeker'): Promise<{ user: AuthUser | null; error: AuthError | null }> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { user: null, error: { message: 'No user logged in' } };
      }

      // Update the profile with the role
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', user.id);

      if (error) {
        return { user: null, error: { message: error.message } };
      }

      const authUser: AuthUser = {
        id: user.id,
        email: user.email!,
        role,
        createdAt: new Date(user.created_at)
      };

      return { user: authUser, error: null };
    } catch (err) {
      return { user: null, error: { message: 'Network error occurred' } };
    }
  },

  // Sign out
  signOut: async (): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: { message: error.message } };
      }
      return { error: null };
    } catch (err) {
      return { error: { message: 'Network error occurred' } };
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthUser | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      // Get the user's profile to check their role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email!,
        role: profile?.role,
        createdAt: new Date(user.created_at)
      };
    } catch (err) {
      return null;
    }
  },

  // Get auth session
  getSession: async (): Promise<Session | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (err) {
      return null;
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};
