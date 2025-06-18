
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="mobile-container bg-gradient-to-br from-blue-600 to-orange-500 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className={`transition-all duration-1000 ${showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="h-24 w-24 mx-auto mb-6 rounded-2xl bg-white flex items-center justify-center shadow-2xl animate-pulsate">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              RM
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">ReintegrateMe</h1>
          <p className="text-blue-100 text-lg">Building Better Futures</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
