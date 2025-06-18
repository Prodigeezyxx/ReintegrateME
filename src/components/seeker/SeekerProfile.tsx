
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Camera, MapPin, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { toast } from '@/hooks/use-toast';

const SeekerProfile = () => {
  const navigate = useNavigate();
  const currentUser = authAPI.getCurrentUser();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Job Seeker',
    email: currentUser?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Frontend Developer',
    bio: 'Passionate frontend developer with 3+ years of experience in React, TypeScript, and modern web technologies.',
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js', 'Git']
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
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
                  <AvatarFallback className="text-lg">JS</AvatarFallback>
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
                    <Input 
                      value={profile.name} 
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="font-semibold"
                    />
                    <Input 
                      value={profile.title} 
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">{profile.name}</h2>
                    <p className="text-gray-600">{profile.title}</p>
                  </>
                )}
              </div>
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
                  value={profile.email} 
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
                  value={profile.phone} 
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <span>{profile.phone}</span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              {isEditing ? (
                <Input 
                  value={profile.location} 
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              ) : (
                <span>{profile.location}</span>
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
                value={profile.bio} 
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
              />
            ) : (
              <p className="text-gray-600">{profile.bio}</p>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="ios-card">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
              {isEditing && (
                <Badge variant="outline" className="cursor-pointer">
                  + Add Skill
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeekerProfile;
