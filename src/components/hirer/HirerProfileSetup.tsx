
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { companyAPI } from '../../services/api';
import { CompanyProfile } from '../../models/types';
import { toast } from '@/hooks/use-toast';
import OrbitalLoader from '@/components/ui/orbital-loader';
import GlassmorphismCard from '@/components/ui/glassmorphism-card';

const HirerProfileSetup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<Partial<CompanyProfile>>({
    companyName: '',
    industry: '',
    companySize: '',
    websiteUrl: '',
    description: '',
    locationCity: '',
    locationCountry: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCompanyProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyProfile.companyName) {
      toast({
        title: "Error",
        description: "Company name is required",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await companyAPI.createInitialProfile(companyProfile);
      
      toast({
        title: "Success",
        description: "Company profile has been created"
      });
      
      navigate('/hirer-dashboard');
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

  if (isLoading) {
    return (
      <div className="mobile-container min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <OrbitalLoader 
          size={250}
          message="Creating your company profile..."
          className="text-center"
        />
      </div>
    );
  }

  return (
    <div className="mobile-container p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <div className="flex flex-col min-h-screen">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-500 self-start mb-6 hover:scale-110 transition-transform"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <GlassmorphismCard className="p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">Company Profile</h1>
          <p className="text-gray-600 mb-4">Let's set up your company information</p>
          
          <div className="progress-bar mb-6">
            <div className="progress-fill" style={{ width: '50%' }}></div>
          </div>
        </GlassmorphismCard>
        
        <form onSubmit={handleSubmit} className="space-y-6 flex-1">
          <GlassmorphismCard className="p-4">
            <label htmlFor="companyName" className="text-gray-700 font-medium mb-2 block">Company Name *</label>
            <Input
              id="companyName"
              name="companyName"
              value={companyProfile.companyName}
              onChange={handleChange}
              className="ios-input bg-white/50 backdrop-blur-sm"
              required
            />
          </GlassmorphismCard>
          
          <GlassmorphismCard className="p-4">
            <label htmlFor="industry" className="text-gray-700 font-medium mb-2 block">Industry</label>
            <Select 
              value={companyProfile.industry} 
              onValueChange={(value) => handleSelectChange('industry', value)}
            >
              <SelectTrigger className="ios-input bg-white/50 backdrop-blur-sm">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="media">Media & Entertainment</SelectItem>
                <SelectItem value="professional_services">Professional Services</SelectItem>
              </SelectContent>
            </Select>
          </GlassmorphismCard>
          
          <GlassmorphismCard className="p-4">
            <label htmlFor="companySize" className="text-gray-700 font-medium mb-2 block">Company Size</label>
            <Select 
              value={companyProfile.companySize} 
              onValueChange={(value) => handleSelectChange('companySize', value)}
            >
              <SelectTrigger className="ios-input bg-white/50 backdrop-blur-sm">
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 employees</SelectItem>
                <SelectItem value="11-50">11-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="201-500">201-500 employees</SelectItem>
                <SelectItem value="501-1000">501-1000 employees</SelectItem>
                <SelectItem value="1001+">1001+ employees</SelectItem>
              </SelectContent>
            </Select>
          </GlassmorphismCard>

          <GlassmorphismCard className="p-4">
            <label htmlFor="websiteUrl" className="text-gray-700 font-medium mb-2 block">Website URL</label>
            <Input
              id="websiteUrl"
              name="websiteUrl"
              type="url"
              placeholder="https://example.com"
              value={companyProfile.websiteUrl}
              onChange={handleChange}
              className="ios-input bg-white/50 backdrop-blur-sm"
            />
          </GlassmorphismCard>

          <GlassmorphismCard className="p-4">
            <label htmlFor="description" className="text-gray-700 font-medium mb-2 block">Company Description</label>
            <Textarea
              id="description"
              name="description"
              placeholder="Tell us about your company..."
              value={companyProfile.description}
              onChange={handleChange}
              className="ios-input min-h-[120px] bg-white/50 backdrop-blur-sm"
            />
          </GlassmorphismCard>

          <div className="grid grid-cols-2 gap-4">
            <GlassmorphismCard className="p-4">
              <label htmlFor="locationCity" className="text-gray-700 font-medium mb-2 block">City</label>
              <Input
                id="locationCity"
                name="locationCity"
                value={companyProfile.locationCity}
                onChange={handleChange}
                className="ios-input bg-white/50 backdrop-blur-sm"
              />
            </GlassmorphismCard>

            <GlassmorphismCard className="p-4">
              <label htmlFor="locationCountry" className="text-gray-700 font-medium mb-2 block">Country</label>
              <Select 
                value={companyProfile.locationCountry} 
                onValueChange={(value) => handleSelectChange('locationCountry', value)}
              >
                <SelectTrigger className="ios-input bg-white/50 backdrop-blur-sm">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Spain">Spain</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="Singapore">Singapore</SelectItem>
                  <SelectItem value="Japan">Japan</SelectItem>
                </SelectContent>
              </Select>
            </GlassmorphismCard>
          </div>
          
          <Button
            type="submit"
            className="w-full py-6 text-lg bg-gradient-to-r from-reme-orange to-yellow-500 hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Continue to Dashboard'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default HirerProfileSetup;
