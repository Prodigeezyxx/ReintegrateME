
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Edit2, Save, X, User, Mail, Phone, MapPin, Briefcase, Star } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getSkillById } from '../../data/skillsDatabase';
import SkillsManager from './SkillsManager';
import ImageUpload from '../ui/image-upload';
import { authAPI } from '../../services/auth';
import { imageStorageAPI } from '../../services/storage';

interface SeekerProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  job_title?: string;
  headline?: string;
  bio?: string;
  location_city?: string;
  location_country?: string;
  key_skills: string[];
  profile_image_url?: string;
  availability_status: string;
  profile_completion_percentage: number;
}

const SeekerProfile = () => {
  const [profile, setProfile] = useState<SeekerProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<SeekerProfileData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Helper function to detect if we're using mock auth
  const isUsingMockAuth = (): boolean => {
    try {
      const mockUser = authAPI.getCurrentUser();
      return mockUser !== null;
    } catch (error) {
      return true;
    }
  };

  const fetchProfile = async () => {
    try {
      // Check if we're using mock auth system
      if (isUsingMockAuth()) {
        console.log('SeekerProfile: Mock auth detected - loading from localStorage');
        
        // Try to get completed profile data first
        const completedProfile = localStorage.getItem('seekerProfileComplete');
        if (completedProfile) {
          const profileData = JSON.parse(completedProfile);
          const mockUser = authAPI.getCurrentUser();
          
          // Convert saved data to SeekerProfileData format
          const mockProfile: SeekerProfileData = {
            id: mockUser?.id || 'mock-id',
            first_name: profileData.firstName || 'User',
            last_name: profileData.lastName || '',
            email: mockUser?.email || '',
            phone_number: profileData.phoneNumber || '',
            job_title: profileData.jobTitle || '',
            headline: profileData.headline || '',
            bio: profileData.bio || '',
            location_city: profileData.locationCity || '',
            location_country: profileData.locationCountry || '',
            key_skills: profileData.keySkills || [],
            profile_image_url: profileData.profileImageUrl || '',
            availability_status: 'available',
            profile_completion_percentage: profileData.profile_completion_percentage || 0
          };
          
          setProfile(mockProfile);
          setEditedProfile(mockProfile);
          console.log('SeekerProfile: Loaded mock profile data');
          return;
        }
        
        // If no completed profile, show setup needed message
        console.log('SeekerProfile: No profile data found for mock user');
        return;
      }

      // Original Supabase code for real auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to view your profile",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('seeker_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setProfile(data);
        setEditedProfile(data);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      // Check if we're using mock auth system
      if (isUsingMockAuth()) {
        console.log('SeekerProfile: Mock auth detected - saving to localStorage');
        
        // Update localStorage with new profile data
        const updatedProfile = { ...profile, ...editedProfile };
        localStorage.setItem('seekerProfileComplete', JSON.stringify({
          firstName: updatedProfile.first_name,
          lastName: updatedProfile.last_name,
          email: updatedProfile.email,
          phoneNumber: updatedProfile.phone_number,
          jobTitle: updatedProfile.job_title,
          headline: updatedProfile.headline,
          bio: updatedProfile.bio,
          locationCity: updatedProfile.location_city,
          locationCountry: updatedProfile.location_country,
          keySkills: updatedProfile.key_skills,
          profileImageUrl: updatedProfile.profile_image_url,
          profile_completion_percentage: updatedProfile.profile_completion_percentage,
          saved_at: new Date().toISOString(),
          auth_type: 'mock'
        }));
        
        setProfile(updatedProfile as SeekerProfileData);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        return;
      }

      // Original Supabase code for real auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('seeker_profiles')
        .update({
          ...editedProfile,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive"
        });
        return;
      }

      setProfile({...profile, ...editedProfile} as SeekerProfileData);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleSkillsChange = (skills: string[]) => {
    setEditedProfile(prev => ({ ...prev, key_skills: skills }));
  };

  const handleImageChange = (url: string | null) => {
    setEditedProfile(prev => ({ ...prev, profile_image_url: url || undefined }));
  };

  const handleCancel = () => {
    setEditedProfile(profile || {});
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="mobile-container p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mobile-container p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-gray-600">
              It looks like you haven't completed your profile setup yet.
            </p>
            <Button className="mt-4" onClick={() => window.location.href = '/seeker-setup-step1'}>
              Complete Profile Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mobile-container p-4 sm:p-6 pb-24 space-y-6">
      {/* Header Card */}
      <Card className="glassmorphism-strong">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isEditing ? (
                <ImageUpload
                  currentImageUrl={editedProfile.profile_image_url}
                  onImageChange={handleImageChange}
                  bucketName="profile-images"
                  uploadPath="seekers"
                  size="md"
                  placeholder="Update your photo"
                />
              ) : (
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                  <AvatarImage src={profile.profile_image_url} />
                  <AvatarFallback className="bg-blue-500 text-white text-lg">
                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {profile.first_name} {profile.last_name}
                </h1>
                {profile.job_title && (
                  <p className="text-sm sm:text-base text-slate-600 font-medium">
                    {profile.job_title}
                  </p>
                )}
                {profile.location_city && (
                  <div className="flex items-center text-sm text-slate-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {profile.location_city}{profile.location_country && `, ${profile.location_country}`}
                  </div>
                )}
              </div>
            </div>
            <Button
              variant={isEditing ? "outline" : "ghost"}
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
              className="shrink-0"
            >
              {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        
        {profile.headline && (
          <CardContent className="pt-0">
            <p className="text-slate-700 italic">"{profile.headline}"</p>
          </CardContent>
        )}
      </Card>

      {/* Contact Information */}
      <Card className="glassmorphism-strong">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Mail className="h-5 w-5 mr-2 text-blue-500" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedProfile.email || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={editedProfile.phone_number || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, phone_number: e.target.value }))}
                  className="bg-white"
                  placeholder="Enter your phone number"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <span>{profile.email}</span>
              </div>
              {profile.phone_number && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{profile.phone_number}</span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card className="glassmorphism-strong">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
            Professional Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                  id="job_title"
                  value={editedProfile.job_title || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, job_title: e.target.value }))}
                  className="bg-white"
                  placeholder="e.g., Warehouse Assistant"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headline">Professional Headline</Label>
                <Input
                  id="headline"
                  value={editedProfile.headline || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, headline: e.target.value }))}
                  className="bg-white"
                  placeholder="Brief professional summary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={editedProfile.bio || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                  className="bg-white min-h-[100px]"
                  placeholder="Tell employers about yourself..."
                />
              </div>
            </>
          ) : (
            <>
              {profile.job_title && (
                <div>
                  <h4 className="font-medium text-slate-700">Current Role</h4>
                  <p className="text-slate-600">{profile.job_title}</p>
                </div>
              )}
              {profile.bio && (
                <div>
                  <h4 className="font-medium text-slate-700">About</h4>
                  <p className="text-slate-600 whitespace-pre-wrap">{profile.bio}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="glassmorphism-strong">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Star className="h-5 w-5 mr-2 text-blue-500" />
            Skills & Abilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <SkillsManager
              skills={editedProfile.key_skills || []}
              onSkillsChange={handleSkillsChange}
              isEditing={true}
              jobCategories={[]}
            />
          ) : (
            <div className="space-y-4">
              {profile.key_skills && profile.key_skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.key_skills.map(skillId => {
                    const skill = getSkillById(skillId);
                    if (!skill) return null;
                    
                    return (
                      <Badge
                        key={skillId}
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        {skill.name}
                      </Badge>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-500 italic">No skills added yet</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Completion */}
      <Card className="glassmorphism-strong">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Profile Completion</span>
            <span className="text-sm font-bold text-slate-900">
              {profile.profile_completion_percentage || 0}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${profile.profile_completion_percentage || 0}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Complete your profile to increase your chances of being discovered by employers
          </p>
        </CardContent>
      </Card>

      {/* Save/Cancel buttons for editing */}
      {isEditing && (
        <div className="flex gap-3 pb-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default SeekerProfile;
