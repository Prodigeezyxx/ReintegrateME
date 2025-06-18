
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
    <div className="mobile-container bg-gradient-to-br from-blue-50 to-orange-50 min-h-screen">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-6 px-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-orange-500 flex items-center justify-center animate-pulsate">
              <span className="text-lg font-bold text-white">RM</span>
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              ReintegrateMe
            </span>
          </div>
        </header>
        
        {/* Hero Section */}
        <main className="flex-1 px-6 flex flex-col">
          <div className="py-12 flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4 leading-tight text-gray-900">
              Rebuilding Lives Through <span className="text-blue-600">Meaningful</span> <span className="text-orange-500">Employment</span>
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              ReintegrateMe connects justice-involved individuals with employers who believe in second chances and fresh starts.
            </p>
            
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 transition-all duration-300 shadow-lg"
            >
              Get Started
            </Button>
            
            <p className="text-gray-500 text-center mt-4">
              Already have an account?{" "}
              <button 
                onClick={() => navigate('/auth', { state: { mode: 'login' } })}
                className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                Log in
              </button>
            </p>
          </div>
          
          {/* Features */}
          <div className="py-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Why ReintegrateMe?</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Safe & Supportive</h3>
                <p className="text-gray-600">A judgment-free platform designed specifically for the reintegration community.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Inclusive Employers</h3>
                <p className="text-gray-600">Connect with employers committed to fair chance hiring and workplace inclusion.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Transparent Matching</h3>
                <p className="text-gray-600">Honest disclosure and mutual understanding before any commitments are made.</p>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="py-6 px-6 text-center text-gray-500 text-sm">
          <p>&copy; 2024 ReintegrateMe. Building better futures together.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
