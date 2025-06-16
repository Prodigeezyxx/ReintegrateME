
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if we should automatically redirect to splash screen
    const shouldAutoRedirect = !localStorage.getItem('hasSeenLanding');
    
    if (shouldAutoRedirect) {
      navigate('/splash');
    }
  }, [navigate]);
  
  const handleGetStarted = () => {
    localStorage.setItem('hasSeenLanding', 'true');
    navigate('/splash');
  };
  
  return (
    <div className="mobile-container">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-6 px-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-reme-orange to-reme-purple flex items-center justify-center">
              <span className="text-lg font-bold text-white">ReME</span>
            </div>
            <span className="ml-2 text-xl font-bold">ReME</span>
          </div>
        </header>
        
        {/* Hero Section */}
        <main className="flex-1 px-6 flex flex-col">
          <div className="py-12 flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Find Jobs & Talent with a <span className="text-reme-orange">Swipe</span>
            </h1>
            <p className="text-gray-600 mb-8">
              ReME connects job seekers with their dream jobs and employers with perfect talent matches.
            </p>
            
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="w-full py-6 text-lg bg-reme-orange hover:bg-orange-600 transition-colors"
            >
              Get Started
            </Button>
            
            <p className="text-gray-500 text-center mt-4">
              Already have an account?{" "}
              <button 
                onClick={() => navigate('/unified-auth')}
                className="text-reme-orange font-medium"
              >
                Log in
              </button>
            </p>
          </div>
          
          {/* Features */}
          <div className="py-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Why ReME?</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="h-12 w-12 rounded-full bg-reme-soft-purple flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-reme-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Simple & Fast</h3>
                <p className="text-gray-600">Swipe right on jobs or candidates you like, left on ones you don't.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="h-12 w-12 rounded-full bg-reme-soft-green flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Mutual Matching</h3>
                <p className="text-gray-600">Only connect when there's mutual interest, saving time for everyone.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="h-12 w-12 rounded-full bg-reme-soft-orange flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Direct Communication</h3>
                <p className="text-gray-600">Chat directly with matches to schedule interviews or discuss opportunities.</p>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="py-6 px-6 text-center text-gray-500 text-sm">
          <p>&copy; 2023 ReME. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
