
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserRole } from '../models/types';
import { toast } from '@/hooks/use-toast';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import SocialAuthButton from './SocialAuthButton';

interface AuthState {
  role?: UserRole;
  mode: 'login' | 'signup';
}

const Authentication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const state = location.state as AuthState || { mode: 'login' };
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>(state.mode || 'login');
  const role = state.role || localStorage.getItem('selectedRole') as UserRole || undefined;

  // Redirect authenticated users
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'hirer') {
        navigate('/hirer-dashboard');
      } else {
        navigate('/seeker-dashboard');
      }
    }
  }, [user, isLoading, navigate]);
  
  useEffect(() => {
    if (state.mode) {
      setMode(state.mode);
    }
  }, [state.mode]);
  
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsAuthLoading(true);
    
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
        
        await authService.signUpWithEmail(role, email, password);
        
        toast({
          title: "Success",
          description: "Account created! Please check your email to verify your account.",
        });
      } else {
        await authService.signInWithEmail(email, password);
        
        toast({
          title: "Success",
          description: "Successfully signed in!",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsAuthLoading(false);
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

  if (isLoading) {
    return (
      <div className="mobile-container p-6">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }
  
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
          <h1 className="text-3xl font-bold text-center mb-8">{getTitle()}</h1>
          
          <form onSubmit={handleEmailAuth} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="ios-input"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-gray-700 font-medium">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="ios-input"
                required
              />
            </div>
            
            {mode === 'login' && (
              <div className="text-right">
                <button type="button" className="text-sm text-reme-orange">
                  Forgot Password?
                </button>
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full py-6 text-lg bg-reme-orange hover:bg-orange-600 transition-colors"
              disabled={isAuthLoading}
            >
              {isAuthLoading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Sign Up'}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="text-reme-orange font-medium"
                onClick={toggleMode}
              >
                {mode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
          
          <div className="mt-8">
            <div className="relative flex items-center justify-center">
              <hr className="w-full border-gray-300" />
              <span className="absolute bg-white px-3 text-gray-500 text-sm">
                or continue with
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-6">
              <SocialAuthButton provider="google" role={role}>
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4"/>
                </svg>
                Google
              </SocialAuthButton>
              
              <SocialAuthButton provider="linkedin_oidc" role={role}>
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path d="M19 3H5C3.895 3 3 3.895 3 5V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19V5C21 3.895 20.105 3 19 3ZM9 17H6.477V10H9V17ZM7.694 8.717C6.923 8.717 6.408 8.203 6.408 7.517C6.408 6.831 6.922 6.317 7.779 6.317C8.55 6.317 9.065 6.831 9.065 7.517C9.065 8.203 8.551 8.717 7.694 8.717ZM18 17H15.558V13.174C15.558 12.116 14.907 11.872 14.663 11.872C14.419 11.872 13.605 12.035 13.605 13.174C13.605 13.337 13.605 17 13.605 17H11.082V10H13.605V10.977C13.93 10.407 14.581 10 15.802 10C17.023 10 18 10.977 18 13.174V17Z" fill="#0077B5"/>
                </svg>
                LinkedIn
              </SocialAuthButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
