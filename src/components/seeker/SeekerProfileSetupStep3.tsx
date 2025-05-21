
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SeekerProfile } from '../../models/types';
import { countries, seekerAPI } from '../../services/api';
import { toast } from '@/hooks/use-toast';

const SeekerProfileSetupStep3 = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [seekerProfile, setSeekerProfile] = useState<Partial<SeekerProfile>>({
    locationCity: '',
    locationCountry: '',
    profilePictureUrl: ''
  });

  // Load data from previous steps
  useEffect(() => {
    const savedProfile = localStorage.getItem('seekerProfile');
    if (savedProfile) {
      setSeekerProfile(prev => ({
        ...prev,
        ...JSON.parse(savedProfile)
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSeekerProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSeekerProfile(prev => ({ ...prev, [name]: value }));
  };

  // This would normally upload a file, but we'll simulate it for now
  const handleImageUpload = () => {
    const demoImageUrl = 'https://placehold.co/200x200?text=User';
    setSeekerProfile(prev => ({ 
      ...prev, 
      profilePictureUrl: demoImageUrl
    }));
    
    toast({
      title: "Profile Photo",
      description: "Demo profile photo has been added"
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, this would actually upload the profile picture
      
      // Create the seeker profile
      await seekerAPI.createInitialProfile(seekerProfile);
      
      toast({
        title: "Success",
        description: "Your profile has been created"
      });
      
      // Clear the stored profile data
      localStorage.removeItem('seekerProfile');
      
      navigate('/seeker-dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred creating your profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
        
        <h1 className="text-2xl font-bold mb-2">Location & Profile Photo</h1>
        <p className="text-gray-600 mb-6">Almost done! Add your location and photo</p>
        
        <div className="progress-bar mb-8">
          <div className="progress-fill" style={{ width: '100%' }}></div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 flex-1">
          <div className="space-y-2">
            <label htmlFor="locationCity" className="text-gray-700 font-medium">City</label>
            <Input
              id="locationCity"
              name="locationCity"
              value={seekerProfile.locationCity}
              onChange={handleChange}
              className="ios-input"
              placeholder="e.g., San Francisco"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="locationCountry" className="text-gray-700 font-medium">Country</label>
            <Select 
              value={seekerProfile.locationCountry} 
              onValueChange={(value) => handleSelectChange('locationCountry', value)}
            >
              <SelectTrigger className="ios-input">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4 mt-6">
            <label className="text-gray-700 font-medium">Profile Photo (Optional)</label>
            
            <div className="flex flex-col items-center">
              {seekerProfile.profilePictureUrl ? (
                <div className="relative">
                  <img 
                    src={seekerProfile.profilePictureUrl} 
                    alt="Profile preview" 
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
                    onClick={() => setSeekerProfile(prev => ({ ...prev, profilePictureUrl: '' }))}
                    aria-label="Remove photo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleImageUpload}
                    className="bg-white"
                  >
                    Upload Photo
                  </Button>
                </>
              )}
              
              <p className="text-sm text-gray-500 mt-2">Adding a photo increases your match rate</p>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full py-6 text-lg bg-reme-orange hover:bg-orange-600 transition-colors mt-10"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Profile...' : 'Complete Setup & Get Started'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SeekerProfileSetupStep3;
