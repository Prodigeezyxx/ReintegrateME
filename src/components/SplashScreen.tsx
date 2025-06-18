
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLogoUrl, getFallbackLogoUrl } from '../utils/logoUpload';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [showLogo, setShowLogo] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    console.log('SplashScreen mounted');
    
    // Animate logo appearance
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 300);

    // Navigate after animation with safety check
    const navigationTimer = setTimeout(() => {
      if (!hasNavigated) {
        console.log('SplashScreen: Navigating to role selection');
        setHasNavigated(true);
        navigate('/role-selection', { replace: true });
      }
    }, 2500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigate, hasNavigated]);

  const handleLogoError = () => {
    console.log('Primary logo failed to load on splash, trying fallback');
    setLogoError(true);
  };

  const handleLogoLoad = () => {
    console.log('Logo loaded successfully on splash');
    setLogoError(false);
  };

  const logoUrl = logoError ? getFallbackLogoUrl() : getLogoUrl();

  return (
    <div className="mobile-container bg-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className={`transition-all duration-1000 ${showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="h-32 w-32 mx-auto mb-6 animate-pulse-gentle">
            <img
              src={logoUrl}
              alt="ReintegrateMe Logo"
              className="w-full h-full object-contain"
              onError={handleLogoError}
              onLoad={handleLogoLoad}
              loading="eager"
              style={{ imageRendering: 'auto' }}
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
