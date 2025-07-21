
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authAPI } from '../services/api';
import { UserRole } from '../models/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  role?: UserRole;
  mode: 'login' | 'signup';
}

const Authentication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as AuthState || { mode: 'login' };
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>(state.mode || 'login');
  const role = state.role || localStorage.getItem('selectedRole') as UserRole || undefined;
  
  useEffect(() => {
    // Update mode if coming from navigation
    if (state.mode) {
      setMode(state.mode);
    }
  }, [state.mode]);
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'signup') {
        if (!role) {
          toast({
            title: "Error",
            description: "Please select a role first",
            variant: "destructive"
          });
          navigate('/role-selection');
          return;
        }
        
        console.log('Signing up user with role:', role);
        const user = await authAPI.signupEmail(role, email, password);
        console.log('Signup successful:', user);
        
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
        
        // Small delay to ensure state is properly set
        setTimeout(() => {
          if (role === 'hirer') {
            navigate('/hirer-setup', { replace: true });
          } else {
            navigate('/seeker-setup-step1', { replace: true });
          }
        }, 100);
      } else {
        console.log('Logging in user');
        const user = await authAPI.login(email, password);
        console.log('Login successful:', user);
        
        toast({
          title: "Success",
          description: "Welcome back!",
        });
        
        // Small delay to ensure state is properly set
        setTimeout(() => {
          if (user.role === 'hirer') {
            navigate('/hirer-talent-overview', { replace: true });
          } else {
            navigate('/seeker-dashboard', { replace: true });
          }
        }, 100);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsSocialLoading('google');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Google auth error:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to authenticate with Google. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Google auth error:', error);
      toast({
        title: "Authentication Error", 
        description: "An unexpected error occurred with Google authentication.",
        variant: "destructive"
      });
    } finally {
      setIsSocialLoading(null);
    }
  };

  const handleFacebookAuth = async () => {
    setIsSocialLoading('facebook');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Facebook auth error:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to authenticate with Facebook. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Facebook auth error:', error);
      toast({
        title: "Authentication Error",
        description: "An unexpected error occurred with Facebook authentication.",
        variant: "destructive"
      });
    } finally {
      setIsSocialLoading(null);
    }
  };
  
  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };
  
  const getTitle = () => {
    if (mode === 'login') return 'Log In';
    if (role === 'hirer') return 'Employer Sign Up';
    return 'Job Seeker Sign Up';
  };
  
  return (
    <div className="mobile-container p-6">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-gray-500"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8 font-geist text-slate-800">{getTitle()}</h1>
          
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-slate-700 font-medium font-geist">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="ios-input focus:ring-2 focus:ring-reintegrate-blue focus:border-reintegrate-blue"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-slate-700 font-medium font-geist">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="ios-input focus:ring-2 focus:ring-reintegrate-blue focus:border-reintegrate-blue"
                required
              />
            </div>
            
            {mode === 'login' && (
              <div className="text-right">
                <button type="button" className="text-sm text-reintegrate-orange hover:text-reintegrate-orange-dark">
                  Forgot Password?
                </button>
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full py-6 text-lg bg-reintegrate-orange hover:bg-reintegrate-orange-dark transition-colors font-geist font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Sign Up'}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-slate-600 font-geist">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="text-reintegrate-orange font-medium hover:text-reintegrate-orange-dark"
                onClick={toggleMode}
              >
                {mode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
          
          <div className="mt-8">
            <div className="relative flex items-center justify-center">
              <hr className="w-full border-slate-300" />
              <span className="absolute bg-white px-3 text-slate-500 text-sm font-geist">
                or continue with
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button 
                onClick={handleGoogleAuth}
                disabled={isSocialLoading !== null}
                className="flex justify-center items-center py-2.5 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSocialLoading === 'google' ? (
                  <div className="animate-spin h-5 w-5 border-2 border-slate-300 border-t-reintegrate-blue rounded-full"></div>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
              </button>
              
              <button 
                onClick={handleFacebookAuth}
                disabled={isSocialLoading !== null}
                className="flex justify-center items-center py-2.5 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSocialLoading === 'facebook' ? (
                  <div className="animate-spin h-5 w-5 border-2 border-slate-300 border-t-reintegrate-blue rounded-full"></div>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
