
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Briefcase, MessageSquare, Plus, Building2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CompanyProfile {
  id: string;
  company_name: string;
  logo_url?: string;
  profile_completion_percentage: number;
}

const HirerDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        .select('id, company_name, logo_url, profile_completion_percentage')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        // No profile found, redirect to setup
        navigate('/hirer-setup');
        return;
      }

      setProfile(data);
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

  if (isLoading) {
    return (
      <div className="mobile-container p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null; // Will redirect to setup
  }

  return (
    <div className="mobile-container p-6 max-w-4xl mx-auto">
      {/* Header with Company Info */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
            {profile.logo_url ? (
              <img 
                src={profile.logo_url} 
                alt="Company logo" 
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="h-6 w-6 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.company_name}</h1>
            <p className="text-gray-600">Hirer Dashboard</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/hirer-profile')}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          Profile
        </Button>
      </div>

      {/* Profile Completion */}
      {profile.profile_completion_percentage < 100 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Complete Your Profile</h3>
              <Badge variant="outline">{profile.profile_completion_percentage}%</Badge>
            </div>
            <Progress value={profile.profile_completion_percentage} className="mb-3" />
            <p className="text-sm text-gray-600 mb-4">
              Complete your company profile to attract the best candidates
            </p>
            <Button 
              size="sm" 
              onClick={() => navigate('/hirer-profile')}
              className="bg-gradient-to-r from-blue-500 to-purple-500"
            >
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/hirer-create-job')}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Post New Job</h3>
            <p className="text-sm text-gray-600">Create a new job posting to find candidates</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/hirer-discover')}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Discover Talent</h3>
            <p className="text-sm text-gray-600">Browse and connect with job seekers</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/hirer-jobs')}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">My Jobs</h3>
            <p className="text-sm text-gray-600">Manage your job postings</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/hirer-applicants')}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold mb-2">Applicants</h3>
            <p className="text-sm text-gray-600">Review job applications</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/hirer-messages')}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold mb-2">Messages</h3>
            <p className="text-sm text-gray-600">Chat with candidates</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HirerDashboard;
