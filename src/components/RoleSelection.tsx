
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, MessageCircle, Phone } from 'lucide-react';
import { getLogoUrl, getFallbackLogoUrl } from '../utils/logoUpload';

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

  const logoUrl = logoError ? getFallbackLogoUrl() : getLogoUrl();

  return (
    <div className="mobile-container bg-white min-h-screen">
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="h-20 w-20 mx-auto mb-4">
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
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              ReintegrateMe
            </h1>
            <p className="text-slate-600">Choose how you'd like to get started</p>
          </div>

          <div className="space-y-4">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300" onClick={() => handleRoleSelect('seeker')}>
              <CardHeader className="text-center">
                <div className="h-12 w-12 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <CardTitle className="text-blue-600">I'm Looking for Work</CardTitle>
                <CardDescription>
                  Find employers who believe in second chances and are committed to inclusive hiring practices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  onClick={() => handleRoleSelect('seeker')}
                  disabled={isNavigating}
                >
                  {isNavigating ? 'Loading...' : 'Get Started as Job Seeker'}
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-300" onClick={() => handleRoleSelect('hirer')}>
              <CardHeader className="text-center">
                <div className="h-12 w-12 mx-auto mb-2 rounded-full bg-orange-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0H3m2 0v-5a2 2 0 012-2h10a2 2 0 012 2v5M9 7h6m-6 4h6m-2 4h2" />
                  </svg>
                </div>
                <CardTitle className="text-orange-600">I'm Hiring</CardTitle>
                <CardDescription>
                  Connect with talented individuals ready to contribute meaningfully to your organization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700" 
                  onClick={() => handleRoleSelect('hirer')}
                  disabled={isNavigating}
                >
                  {isNavigating ? 'Loading...' : 'Get Started as Employer'}
                </Button>
              </CardContent>
            </Card>

            {/* Get Help Section */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader className="text-center pb-3">
                <div className="h-12 w-12 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                  <HelpCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-green-600">Need Help?</CardTitle>
                <CardDescription className="text-green-700">
                  Get support and guidance for your reintegration journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400"
                    onClick={() => window.open('tel:1-800-REME-HELP', '_blank')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400"
                    onClick={() => window.open('mailto:support@reintegrateme.com', '_blank')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Email Us
                  </Button>
                </div>
                <div className="text-xs text-green-600 text-center space-y-1">
                  <p><strong>Support Hours:</strong> Mon-Fri 9AM-6PM EST</p>
                  <p><strong>Crisis Line:</strong> Available 24/7</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={handleBackToHome}
              className="text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
              disabled={isNavigating}
            >
              ← {isNavigating ? 'Loading...' : 'Back to Start'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
