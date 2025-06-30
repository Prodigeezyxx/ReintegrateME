import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Building } from 'lucide-react';
import { companyAPI, countries } from '../../services/api';
import { toast } from '@/hooks/use-toast';
import HirerSkillsPreferences from './HirerSkillsPreferences';

const HirerProfileSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    websiteUrl: '',
    description: '',
    locationCity: '',
    locationCountry: '',
    preferredSkills: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);

  const industries = [
    'Accommodation and Food Services',
    'Administrative and Support Services',
    'Agriculture, Forestry and Fishing',
    'Arts, Entertainment and Recreation',
    'Construction and Building',
    'Education and Training',
    'Energy and Utilities',
    'Financial and Insurance Services',
    'Government and Public Administration',
    'Healthcare and Social Assistance',
    'Information Technology',
    'Manufacturing',
    'Mining and Resources',
    'Professional Services',
    'Property and Real Estate',
    'Retail and Consumer Services',
    'Transportation and Logistics',
    'Wholesale Trade',
    'Non-Profit and Community Services',
    'Other'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];

  // Map industry to job categories for skills suggestions
  const getJobCategoriesForIndustry = (industry: string): string[] => {
    const categoryMap: Record<string, string[]> = {
      'Construction and Building': ['Construction'],
      'Manufacturing': ['Manufacturing'],
      'Transportation and Logistics': ['Transportation', 'Logistics'],
      'Retail and Consumer Services': ['Retail'],
      'Accommodation and Food Services': ['Hospitality'],
      'Healthcare and Social Assistance': ['Healthcare'],
      'Administrative and Support Services': ['Service Industry'],
      'Energy and Utilities': ['Maintenance'],
      'Agriculture, Forestry and Fishing': ['Agriculture']
    };
    return categoryMap[industry] || ['Service Industry'];
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillsChange = (skills: string[]) => {
    setFormData(prev => ({
      ...prev,
      preferredSkills: skills
    }));
  };

  const handleSubmit = async () => {
    if (!formData.companyName.trim()) {
      toast({
        title: "Company name required",
        description: "Please enter your company name to continue.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      // Create the company profile without skills (API doesn't support it yet)
      const { preferredSkills, ...apiData } = formData;
      await companyAPI.createInitialProfile(apiData);
      
      // TODO: Save preferred skills when API is updated to support it
      console.log('Preferred skills to save:', preferredSkills);
      
      toast({
        title: "Company profile created!",
        description: "Your company profile has been successfully set up.",
      });
      
      // Redirect to talent overview instead of dashboard
      navigate('/hirer-talent-overview');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create company profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/auth');
  };

  return (
    <div className="mobile-container bg-gradient-to-br from-blue-50 to-orange-50 min-h-screen">
      <div className="min-h-screen flex flex-col p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Company Setup</h1>
            <p className="text-gray-600">Tell us about your organization</p>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Building className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle>Company Information</CardTitle>
                  <p className="text-sm text-gray-600">Basic details about your organization</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter your company name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="companySize">Company Size</Label>
                <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  placeholder="https://www.yourcompany.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Tell us about your company, values, and commitment to inclusive hiring..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="locationCity">City</Label>
                  <Input
                    id="locationCity"
                    value={formData.locationCity}
                    onChange={(e) => handleInputChange('locationCity', e.target.value)}
                    placeholder="London"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="locationCountry">Country</Label>
                  <Select value={formData.locationCountry} onValueChange={(value) => handleInputChange('locationCountry', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Preferences Section */}
          <HirerSkillsPreferences
            selectedSkills={formData.preferredSkills}
            onSkillsChange={handleSkillsChange}
            jobCategories={formData.industry ? getJobCategoriesForIndustry(formData.industry) : []}
          />

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-800">
              <strong>Building inclusive workplaces:</strong> Your profile helps job seekers understand your commitment to diversity and second chances.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !formData.companyName.trim()}
            className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
          >
            {isLoading ? 'Creating Profile...' : 'Complete Setup & Discover Talent'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HirerProfileSetup;
