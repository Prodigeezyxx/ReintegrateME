
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SeekerProfile } from '../../models/types';
import { toast } from '@/hooks/use-toast';

const SeekerProfileSetupStep1 = () => {
  const navigate = useNavigate();
  const [seekerProfile, setSeekerProfile] = useState<Partial<SeekerProfile>>({
    firstName: '',
    lastName: '',
    headline: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSeekerProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!seekerProfile.firstName || !seekerProfile.lastName) {
      toast({
        title: "Error",
        description: "First name and last name are required",
        variant: "destructive"
      });
      return;
    }
    
    // Store the data in localStorage to use across setup steps
    localStorage.setItem('seekerProfile', JSON.stringify(seekerProfile));
    
    navigate('/seeker-setup-step2');
  };

  return (
    <div className="mobile-container p-6">
      <div className="flex flex-col min-h-screen">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-500 self-start mb-6"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h1 className="text-2xl font-bold mb-2">Tell us about yourself</h1>
        <p className="text-gray-600 mb-6">Let employers know who you are</p>
        
        <div className="progress-bar mb-8">
          <div className="progress-fill" style={{ width: '33%' }}></div>
        </div>
        
        <form onSubmit={handleNext} className="space-y-6 flex-1">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-gray-700 font-medium">First Name *</label>
            <Input
              id="firstName"
              name="firstName"
              value={seekerProfile.firstName}
              onChange={handleChange}
              className="ios-input"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-gray-700 font-medium">Last Name *</label>
            <Input
              id="lastName"
              name="lastName"
              value={seekerProfile.lastName}
              onChange={handleChange}
              className="ios-input"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="headline" className="text-gray-700 font-medium">Professional Headline</label>
            <Input
              id="headline"
              name="headline"
              placeholder="e.g., Senior Frontend Developer"
              value={seekerProfile.headline}
              onChange={handleChange}
              className="ios-input"
            />
            <p className="text-sm text-gray-500">A short summary of your professional identity</p>
          </div>
          
          <Button
            type="submit"
            className="w-full py-6 text-lg bg-reme-orange hover:bg-orange-600 transition-colors mt-8"
          >
            Next: Skills & Preferences
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SeekerProfileSetupStep1;
