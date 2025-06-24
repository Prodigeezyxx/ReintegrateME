
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Edit3, Save, X, Building2, Globe, MapPin } from 'lucide-react';
import { companyAPI } from '../../services/api';
import { CompanyProfile } from '../../models/types';
import ImageUpload from '../ui/image-upload';

const HirerProfile = () => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<Partial<CompanyProfile>>({});
  const navigate = useNavigate();

  const industries = [
    'Construction',
    'Manufacturing', 
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Hospitality',
    'Transportation',
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

  const countries = [
    'United Kingdom',
    'Ireland',
    'France',
    'Germany',
    'Spain',
    'Italy',
    'Netherlands',
    'Belgium',
    'Sweden',
    'Denmark'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await companyAPI.getProfile();
      setProfile(profileData);
      setEditData(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load company profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profile || {});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profile || {});
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedProfile = await companyAPI.updateProfile(editData);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Company profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update company profile",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoChange = (url: string | null) => {
    setEditData(prev => ({
      ...prev,
      logoUrl: url || undefined
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 pb-20">
        <div className="mobile-container mx-auto p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-slate-500 font-geist">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="mobile-container mx-auto beautiful-shadow">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/hirer-dashboard')}
                className="beautiful-shadow-subtle hover:beautiful-shadow rounded-xl"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 font-geist">Company Profile</h1>
                <p className="text-slate-500 text-sm">Manage your company information</p>
              </div>
            </div>
            {!isEditing ? (
              <Button
                onClick={handleEdit}
                className="beautiful-shadow-subtle hover:beautiful-shadow rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="beautiful-shadow-subtle hover:beautiful-shadow rounded-xl"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="beautiful-shadow-subtle hover:beautiful-shadow rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            )}
          </div>

          {/* Profile Content */}
          <div className="space-y-6">
            {/* Company Logo and Basic Info */}
            <Card className="beautiful-shadow border-0">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-lg font-geist text-slate-800 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-500" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Logo */}
                  <div className="flex justify-center">
                    {isEditing ? (
                      <ImageUpload
                        currentImageUrl={editData.logoUrl}
                        onImageChange={handleLogoChange}
                        bucketName="company-logos"
                        uploadPath="logos"
                        size="lg"
                        placeholder="Upload company logo"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-lg border-2 border-slate-200 flex items-center justify-center bg-slate-50">
                        {profile?.logoUrl ? (
                          <img 
                            src={profile.logoUrl} 
                            alt="Company logo" 
                            className="h-full w-full object-contain rounded-lg"
                          />
                        ) : (
                          <Building2 className="h-12 w-12 text-slate-400" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Company Name</Label>
                    {isEditing ? (
                      <Input
                        value={editData.companyName || ''}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Enter company name"
                        className="bg-white beautiful-shadow-subtle"
                      />
                    ) : (
                      <p className="text-slate-800 font-geist text-lg">{profile?.companyName || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Industry */}
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Industry</Label>
                    {isEditing ? (
                      <Select
                        value={editData.industry || ''}
                        onValueChange={(value) => handleInputChange('industry', value)}
                      >
                        <SelectTrigger className="bg-white beautiful-shadow-subtle">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map(industry => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-slate-600">{profile?.industry || 'Not specified'}</p>
                    )}
                  </div>

                  {/* Company Size */}
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Company Size</Label>
                    {isEditing ? (
                      <Select
                        value={editData.companySize || ''}
                        onValueChange={(value) => handleInputChange('companySize', value)}
                      >
                        <SelectTrigger className="bg-white beautiful-shadow-subtle">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizes.map(size => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-slate-600">{profile?.companySize || 'Not specified'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Location */}
            <Card className="beautiful-shadow border-0">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-lg font-geist text-slate-800 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-500" />
                  Contact & Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Website */}
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData.websiteUrl || ''}
                        onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                        placeholder="https://www.yourcompany.com"
                        className="bg-white beautiful-shadow-subtle"
                      />
                    ) : (
                      <p className="text-slate-600">
                        {profile?.websiteUrl ? (
                          <a 
                            href={profile.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 underline"
                          >
                            {profile.websiteUrl}
                          </a>
                        ) : (
                          'Not provided'
                        )}
                      </p>
                    )}
                  </div>

                  {/* Location City */}
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">City</Label>
                    {isEditing ? (
                      <Input
                        value={editData.locationCity || ''}
                        onChange={(e) => handleInputChange('locationCity', e.target.value)}
                        placeholder="Enter city"
                        className="bg-white beautiful-shadow-subtle"
                      />
                    ) : (
                      <p className="text-slate-600">{profile?.locationCity || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Location Country */}
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Country</Label>
                    {isEditing ? (
                      <Select
                        value={editData.locationCountry || ''}
                        onValueChange={(value) => handleInputChange('locationCountry', value)}
                      >
                        <SelectTrigger className="bg-white beautiful-shadow-subtle">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map(country => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-slate-600">{profile?.locationCountry || 'Not specified'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Description */}
            <Card className="beautiful-shadow border-0">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-lg font-geist text-slate-800">About Company</CardTitle>
                <CardDescription className="text-slate-500">
                  Tell potential candidates about your company
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {isEditing ? (
                  <Textarea
                    value={editData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your company, culture, and what makes it a great place to work..."
                    rows={4}
                    className="bg-white beautiful-shadow-subtle resize-none"
                  />
                ) : (
                  <p className="text-slate-600 whitespace-pre-wrap">
                    {profile?.description || 'No company description provided yet.'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card className="beautiful-shadow border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Profile Completion</p>
                    <p className="text-xs text-slate-500">Complete your profile to attract more candidates</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600 font-geist">
                      {profile?.profileCompletionPercentage || 0}%
                    </p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${profile?.profileCompletionPercentage || 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HirerProfile;
