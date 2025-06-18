
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLogoUrl } from '../utils/logoUpload';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Animate logo appearance
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 300);

    // Navigate after animation
    const navigationTimer = setTimeout(() => {
      navigate('/role-selection');
    }, 2500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);

  return (
    <div className="mobile-container bg-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className={`transition-all duration-1000 ${showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="h-24 w-24 mx-auto mb-6 animate-pulse-gentle">
            <img
              src={getLogoUrl()}
              alt="ReintegrateMe Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to local logo if Supabase fails
                e.currentTarget.src = "/lovable-uploads/354e6306-e216-4b62-9bbc-24433bcbcc1f.png";
              }}
            />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">ReintegrateMe</h1>
          <p className="text-slate-600 text-lg">Building Better Futures</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
