
import React, { useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Show splash screen for 2 seconds, then check auth status
    const timer = setTimeout(() => {
      setIsAnimating(false);
      const isAuthenticated = authAPI.isAuthenticated();
      
      if (isAuthenticated) {
        const user = authAPI.getCurrentUser();
        if (user?.role === 'hirer') {
          navigate('/hirer-dashboard');
        } else if (user?.role === 'seeker') {
          navigate('/seeker-dashboard');
        } else {
          // User is authenticated but hasn't selected a role yet
          navigate('/role-selection');
        }
      } else {
        // User not authenticated, go to unified auth
        navigate('/unified-auth');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className={`transform transition-all duration-1000 ${isAnimating ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-2xl overflow-hidden mb-6">
            <img 
              src="/lovable-uploads/8c0cc7ea-9ba0-44bd-8baf-1606a7e2bdb8.png" 
              alt="ReME Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ReME</h1>
          <p className="text-gray-500">Connect. Apply. Hire.</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
