
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, User, Shield, Heart, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PersonalInfoSection } from './profile/PersonalInfoSection';
import { ContactInfoSection } from './profile/ContactInfoSection';
import { LegalInfoSection } from './profile/LegalInfoSection';
import { EmploymentInfoSection } from './profile/EmploymentInfoSection';
import { SkillsSection } from './profile/SkillsSection';
import { AboutSection } from './profile/AboutSection';
import { Database } from '@/integrations/supabase/types';

type SeekerProfileRow = Database['public']['Tables']['seeker_profiles']['Row'];
type SeekerProfileUpdate = Database['public']['Tables']['seeker_profiles']['Update'];

interface SeekerProfileData extends SeekerProfileRow {
  // This interface now directly extends the database row type
}

const SeekerProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<SeekerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('seeker_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive"
        });
      } else if (data) {
        setProfile(data);
      } else {
        // Create initial profile if it doesn't exist
        await createInitialProfile();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInitialProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('seeker_profiles')
        .insert({
          user_id: user?.id,
          email: user?.email,
          profile_completion_percentage: 10
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error creating initial profile:', error);
    }
  };

  const updateProfile = async (updates: SeekerProfileUpdate) => {
    try {
      const { data, error } = await supabase
        .from('seeker_profiles')
        .update(updates)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive"
        });
      } else {
        setProfile(data);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="mobile-container p-6 pb-20">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mobile-container p-6 pb-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Profile Not Found</h2>
          <Button onClick={() => navigate('/seeker-dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const completionPercentage = profile.profile_completion_percentage || 10;

  return (
    <div className="mobile-container p-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/seeker-dashboard')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>
        <Button 
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="h-4 w-4 mr-2" />
          {isEditing ? 'Save' : 'Edit'}
        </Button>
      </div>

      {/* Profile Completion */}
      <Card className="ios-card mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm text-gray-500">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile Sections */}
      <div className="space-y-6">
        {/* Personal Information */}
        <PersonalInfoSection 
          profile={profile} 
          isEditing={isEditing} 
          onUpdate={updateProfile}
        />

        {/* Contact Information */}
        <ContactInfoSection 
          profile={profile} 
          isEditing={isEditing} 
          onUpdate={updateProfile}
        />

        {/* Legal Information */}
        <LegalInfoSection 
          profile={profile} 
          isEditing={isEditing} 
          onUpdate={updateProfile}
        />

        {/* Employment Information & Preferences */}
        <EmploymentInfoSection 
          profile={profile} 
          isEditing={isEditing} 
          onUpdate={updateProfile}
        />

        {/* Skills */}
        <SkillsSection 
          profile={profile} 
          isEditing={isEditing} 
          onUpdate={updateProfile}
        />

        {/* About Me */}
        <AboutSection 
          profile={profile} 
          isEditing={isEditing} 
          onUpdate={updateProfile}
        />
      </div>
    </div>
  );
};

export default SeekerProfile;
