
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabaseAuth, AuthUser } from '@/services/supabaseAuth';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ user: AuthUser | null; error: any }>;
  signIn: (email: string, password: string) => Promise<{ user: AuthUser | null; error: any }>;
  signOut: () => Promise<void>;
  updateUserRole: (role: 'hirer' | 'seeker') => Promise<{ user: AuthUser | null; error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabaseAuth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          const currentUser = await supabaseAuth.getCurrentUser();
          setUser(currentUser);
        } else {
          setUser(null);
        }
        
        if (event === 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );

    // Get initial session
    supabaseAuth.getSession().then(session => {
      setSession(session);
      if (session?.user) {
        supabaseAuth.getCurrentUser().then(user => {
          setUser(user);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const result = await supabaseAuth.signUp(email, password);
    return result;
  };

  const signIn = async (email: string, password: string) => {
    const result = await supabaseAuth.signIn(email, password);
    return result;
  };

  const signOut = async () => {
    await supabaseAuth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateUserRole = async (role: 'hirer' | 'seeker') => {
    const result = await supabaseAuth.updateUserRole(role);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
