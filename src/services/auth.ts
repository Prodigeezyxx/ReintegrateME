
import { User, UserRole } from '../models/types';
import { supabase } from '@/integrations/supabase/client';

export const authAPI = {
  signupEmail: async (role: UserRole, email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          role,
        }
      }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data.user) {
      throw new Error('Failed to create user');
    }
    
    return {
      id: data.user.id,
      email: data.user.email!,
      role,
      createdAt: new Date(data.user.created_at),
    };
  },
  
  login: async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data.user) {
      throw new Error('Login failed');
    }
    
    // Get user profile to determine role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();
    
    return {
      id: data.user.id,
      email: data.user.email!,
      role: (profile?.role as UserRole) || 'seeker',
      createdAt: new Date(data.user.created_at),
    };
  },
  
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },
  
  getCurrentUser: (): User | null => {
    // This will be handled by auth state management in components
    return null;
  },
  
  isAuthenticated: (): boolean => {
    // This will be handled by auth state management in components
    return false;
  }
};
