
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit3, Save, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../ui/image-upload';

interface CompanyProfileData {
  id: string;
  company_name: string;
  logo_url?: string;
  industry?: string;
  company_size?: string;
  website_url?: string;
  description?: string;
  location_city?: string;
  location_country?: string;
  profile_completion_percentage: number;
}

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
  'Retail', 'Construction', 'Transportation', 'Hospitality', 'Other'
];

const companySizes = [
  '1-10 employees', '11-50 employees', '51-200 employees', 
  '201-500 employees', '501-1000 employees', '1000+ employees'
];

const countries = [
  'United Kingdom', 'Ireland', 'France', 'Germany', 'Spain',
  'Italy', 'Netherlands', 'Belgium', 'Sweden', 'Denmark'
];

const HirerProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<CompanyProfileData | null>(null);
  const [editData, setEditData] = useState<Partial<CompanyProfileData>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data);
        setEditData(data);
      } else {
        // No profile found, redirect to setup
        navigate('/hirer-setup');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
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
    if (!profile) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Calculate completion percentage
      const totalFields = 8;
      let filledFields = 0;
      
      if (editData.company_name) filledFields++;
      if (editData.industry) filledFields++;
      if (editData.company_size) filledFields++;
      if (editData.website_url) filledFields++;
      if (editData.description) filledFields++;
      if (editData.location_city) filledFields++;
      if (editData.location_country) filledFields++;
      if (editData.logo_url) filledFields++;

      const completionPercentage = Math.round((filledFields / totalFields) * 100);

      const { error } = await supabase
        .from('company_profiles')
        .update({
          ...editData,
          profile_completion_percentage: completionPercentage,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) {
        throw error;
      }

      const updatedProfile = { 
        ...profile, 
        ...editData, 
        profile_completion_percentage: completionPercentage 
      };
      
      setProfile(updatedProfile);
      setIsEditing(false);

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof CompanyProfileData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (url: string | null) => {
    setEditData(prev => ({ ...prev, logo_url: url || undefined }));
  };

  if (isLoading) {
    return (
      <div className="mobile-container p-6 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mobile-container p-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">No profile found</p>
            <Button onClick={() => navigate('/hirer-setup')}>
              Complete Profile Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mobile-container p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/hirer-dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Company Profile</h1>
        </div>
        
        {!isEditing && (
          <Button onClick={handleEdit} className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Completion */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm text-gray-600">{profile.profile_completion_percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${profile.profile_completion_percentage}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Main Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Company Information
            {isEditing && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  <Save className="h-4 w-4 mr-1" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Logo */}
          <div className="flex flex-col items-center space-y-4">
            <Label>Company Logo</Label>
            {isEditing ? (
              <ImageUpload
                currentImageUrl={editData.logo_url}
                onImageChange={handleLogoChange}
                bucketName="company-logos"
                uploadPath="logos"
                size="lg"
                placeholder="Upload your company logo"
              />
            ) : (
              <div className="h-32 w-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                {profile.logo_url ? (
                  <img 
                    src={profile.logo_url} 
                    alt="Company logo" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No logo</span>
                )}
              </div>
            )}
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name *</Label>
            {isEditing ? (
              <Input
                id="company_name"
                value={editData.company_name || ''}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="Enter company name"
              />
            ) : (
              <p className="text-gray-900 font-medium">{profile.company_name}</p>
            )}
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            {isEditing ? (
              <Select
                value={editData.industry || ''}
                onValueChange={(value) => handleInputChange('industry', value)}
              >
                <SelectTrigger>
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
              <p className="text-gray-700">{profile.industry || 'Not specified'}</p>
            )}
          </div>

          {/* Company Size */}
          <div className="space-y-2">
            <Label htmlFor="company_size">Company Size</Label>
            {isEditing ? (
              <Select
                value={editData.company_size || ''}
                onValueChange={(value) => handleInputChange('company_size', value)}
              >
                <SelectTrigger>
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
              <p className="text-gray-700">{profile.company_size || 'Not specified'}</p>
            )}
          </div>

          {/* Website URL */}
          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            {isEditing ? (
              <Input
                id="website_url"
                type="url"
                value={editData.website_url || ''}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                placeholder="https://www.example.com"
              />
            ) : (
              profile.website_url ? (
                <a 
                  href={profile.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {profile.website_url}
                </a>
              ) : (
                <p className="text-gray-700">Not specified</p>
              )
            )}
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location_city">City</Label>
              {isEditing ? (
                <Input
                  id="location_city"
                  value={editData.location_city || ''}
                  onChange={(e) => handleInputChange('location_city', e.target.value)}
                  placeholder="Enter city"
                />
              ) : (
                <p className="text-gray-700">{profile.location_city || 'Not specified'}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location_country">Country</Label>
              {isEditing ? (
                <Select
                  value={editData.location_country || ''}
                  onValueChange={(value) => handleInputChange('location_country', value)}
                >
                  <SelectTrigger>
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
                <p className="text-gray-700">{profile.location_country || 'Not specified'}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={editData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tell us about your company..."
                rows={4}
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {profile.description || 'No description provided'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HirerProfile;
