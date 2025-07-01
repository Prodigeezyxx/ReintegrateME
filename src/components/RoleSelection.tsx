
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoSection from './role-selection/LogoSection';
import RoleCard from './role-selection/RoleCard';
import HelpSection from './role-selection/HelpSection';
import BackButton from './role-selection/BackButton';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);

  // Prevent navigation loops
  useEffect(() => {
    console.log('RoleSelection component mounted');
    
    // Reset navigation state after component mount
    const resetTimer = setTimeout(() => {
      setHasNavigated(false);
    }, 1000);

    return () => clearTimeout(resetTimer);
  }, []);

  const handleRoleSelect = (role: 'seeker' | 'hirer') => {
    if (isNavigating || hasNavigated) {
      console.log('Navigation already in progress or completed');
      return;
    }

    try {
      console.log(`Role selected: ${role}`);
      setIsNavigating(true);
      setHasNavigated(true);
      localStorage.setItem('selectedRole', role);
      navigate('/auth', { state: { role }, replace: true });
    } catch (error) {
      console.error('Error selecting role:', error);
      setIsNavigating(false);
      setHasNavigated(false);
    }
  };

  const handleBackToHome = () => {
    if (isNavigating || hasNavigated) {
      console.log('Navigation already in progress or completed');
      return;
    }

    try {
      console.log('Navigating back to splash screen');
      setIsNavigating(true);
      setHasNavigated(true);
      navigate('/splash', { replace: true });
    } catch (error) {
      console.error('Error navigating to splash:', error);
      setIsNavigating(false);
      setHasNavigated(false);
    }
  };

  const handleLogoError = () => {
    console.log('Primary logo failed to load, trying fallback');
    setLogoError(true);
  };

  const handleLogoLoad = () => {
    console.log('Logo loaded successfully');
    setLogoError(false);
  };

  return (
    <div className="mobile-container bg-white min-h-screen">
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <LogoSection 
            logoError={logoError}
            onLogoError={handleLogoError}
            onLogoLoad={handleLogoLoad}
          />

          <div className="space-y-4">
            <RoleCard
              role="seeker"
              title="I'm Looking for Work"
              description="Find employers who believe in second chances and are committed to inclusive hiring practices."
              buttonText="Get Started as Job Seeker"
              colorScheme="blue"
              onSelect={handleRoleSelect}
              isNavigating={isNavigating}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

            <RoleCard
              role="hirer"
              title="I'm Hiring"
              description="Connect with talented individuals ready to contribute meaningfully to your organisation."
              buttonText="Get Started as Employer"
              colorScheme="orange"
              onSelect={handleRoleSelect}
              isNavigating={isNavigating}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0H3m2 0v-5a2 2 0 012-2h10a2 2 0 012 2v5M9 7h6m-6 4h6m-2 4h2" />
                </svg>
              }
            />

            <HelpSection />
          </div>

          <BackButton 
            onClick={handleBackToHome}
            isNavigating={isNavigating}
          />
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
