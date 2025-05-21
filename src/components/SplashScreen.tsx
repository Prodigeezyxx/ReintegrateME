
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
        } else {
          navigate('/seeker-dashboard');
        }
      } else {
        navigate('/role-selection');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className={`transform transition-all duration-1000 ${isAnimating ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-r from-reme-orange to-reme-purple flex items-center justify-center mb-6">
            <span className="text-4xl font-bold text-white">ReME</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ReME</h1>
          <p className="text-gray-500">Connect. Apply. Hire.</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
