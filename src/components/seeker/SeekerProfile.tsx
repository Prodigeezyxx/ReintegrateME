import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Camera, MapPin, Mail, Phone, Shield, AlertCircle, Briefcase, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { toast } from '@/hooks/use-toast';
import { profileSetupManager } from '../../utils/profileSetupManager';
import SkillsManager from './SkillsManager';

const SeekerProfile = () => {
  const navigate = useNavigate();
  const currentUser = authAPI.getCurrentUser();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: currentUser?.email || '',
    phone: '',
    locationCity: '',
    locationCountry: '',
    jobTitle: '',
    headline: '',
    bio: '',
    keySkills: [] as string[]
  });

  useEffect(() => {
    // Load profile data from profileSetupManager
    const savedData = profileSetupManager.getAllData();
    setProfile(prev => ({
      ...prev,
      firstName: savedData.firstName || '',
      lastName: savedData.lastName || '',
      jobTitle: savedData.jobTitle || '',
      headline: savedData.headline || '',
      keySkills: savedData.keySkills || []
    }));
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    // Save to profileSetupManager
    profileSetupManager.saveStepData(1, profile);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const getDisclosureStatus = () => {
    const savedData = profileSetupManager.getAllData();
    if (savedData.sentenceCompleted !== undefined || savedData.hasDisability !== undefined) {
      return "Complete";
    }
    return "Pending";
  };

  const getDisplayName = () => {
    if (profile.firstName || profile.lastName) {
      return `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
    }
    return 'Job Seeker';
  };

  const handleDisclosureClick = () => {
    navigate('/seeker-disclosure');
  };

  return (
    <div className="mobile-container p-6 pb-20">
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
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="ios-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg bg-gradient-to-br from-blue-100 to-orange-100 text-blue-600">
                    {getDisplayName().split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input 
                        value={profile.firstName || ''} 
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="First Name"
                        className="text-sm"
                      />
                      <Input 
                        value={profile.lastName || ''} 
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Last Name"
                        className="text-sm"
                      />
                    </div>
                    <Input 
                      value={profile.jobTitle || ''} 
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      placeholder="Job Title"
                      className="text-sm"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">{getDisplayName()}</h2>
                    <p className="text-blue-600 font-medium">{profile.jobTitle || 'Job Seeker'}</p>
                    {profile.headline && (
                      <p className="text-gray-600 text-sm mt-1">{profile.headline}</p>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {/* Disclosure Status */}
            <div 
              className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 cursor-pointer hover:bg-green-100 transition-colors"
              onClick={handleDisclosureClick}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">
                    Disclosure Status: {getDisclosureStatus()}
                  </span>
                </div>
                <ExternalLink className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-xs text-green-700 mt-1">
                {getDisclosureStatus() === "Complete" 
                  ? "Click to view your disclosure details and legal information."
                  : "Complete your profile setup to update your disclosure status."
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              {isEditing ? (
                <Input 
                  value={profile.email || ''} 
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  type="email"
                />
              ) : (
                <span>{profile.email}</span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              {isEditing ? (
                <Input 
                  value={profile.phone || ''} 
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Phone number"
                />
              ) : (
                <span>{profile.phone || 'Not provided'}</span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              {isEditing ? (
                <div className="flex gap-2 flex-1">
                  <Input 
                    value={profile.locationCity || ''} 
                    onChange={(e) => handleInputChange('locationCity', e.target.value)}
                    placeholder="City"
                  />
                  <Input 
                    value={profile.locationCountry || ''} 
                    onChange={(e) => handleInputChange('locationCountry', e.target.value)}
                    placeholder="Country"
                  />
                </div>
              ) : (
                <span>
                  {profile.locationCity && profile.locationCountry 
                    ? `${profile.locationCity}, ${profile.locationCountry}`
                    : 'Not provided'
                  }
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea 
                value={profile.bio || ''} 
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                placeholder="Tell employers about yourself..."
              />
            ) : (
              <p className="text-gray-600">
                {profile.bio || 'No bio provided yet. Click Edit to add information about yourself.'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillsManager 
              skills={profile.keySkills}
              onSkillsChange={(skills) => handleInputChange('keySkills', skills)}
              isEditing={isEditing}
            />
          </CardContent>
        </Card>

        {/* Work Preferences */}
        {profile.workPreferences && profile.workPreferences.length > 0 && (
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Work Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.workPreferences.map((pref, index) => (
                  <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700">
                    {pref.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Completion */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Profile completeness</span>
                <span>{profile.profileCompletionPercentage || 25}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-orange-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${profile.profileCompletionPercentage || 25}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Complete all setup steps to reach 100% and maximize your visibility to employers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeekerProfile;
