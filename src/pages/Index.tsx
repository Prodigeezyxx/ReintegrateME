
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SplashScreen from '@/components/SplashScreen';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, redirect based on role
        if (user.role === 'hirer') {
          navigate('/hirer-dashboard');
        } else if (user.role === 'seeker') {
          navigate('/seeker-dashboard');
        } else {
          // User has no role assigned, go to role selection
          navigate('/role-selection');
        }
      } else {
        // User is not authenticated, go to auth
        navigate('/auth');
      }
    }
  }, [user, loading, navigate]);

  // Show splash screen while loading or redirecting
  return <SplashScreen />;
};

export default Index;
