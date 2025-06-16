
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, User } from 'lucide-react';

interface PersonalInfoSectionProps {
  profile: any;
  isEditing: boolean;
  onUpdate: (updates: any) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  profile,
  isEditing,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    job_title: profile.job_title || '',
    location_city: profile.location_city || '',
    location_country: profile.location_country || 'United Kingdom'
  });

  const handleSave = () => {
    onUpdate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getInitials = () => {
    const first = formData.first_name?.[0] || '';
    const last = formData.last_name?.[0] || '';
    return first + last || 'U';
  };

  return (
    <Card className="ios-card">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <User className="h-5 w-5 text-blue-600 mr-2" />
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Picture and Basic Info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.profile_image_url} />
              <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button 
                size="icon" 
                variant="secondary" 
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <Input 
                  placeholder="First Name"
                  value={formData.first_name} 
                  onChange={(e) => handleChange('first_name', e.target.value)}
                />
                <Input 
                  placeholder="Last Name"
                  value={formData.last_name} 
                  onChange={(e) => handleChange('last_name', e.target.value)}
                />
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold">
                  {formData.first_name} {formData.last_name}
                </h3>
                <p className="text-gray-600">{formData.job_title || 'Job Title'}</p>
              </>
            )}
          </div>
        </div>

        {/* Job Title and Location */}
        {isEditing && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <Input 
                placeholder="e.g. Customer Service Representative"
                value={formData.job_title} 
                onChange={(e) => handleChange('job_title', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Input 
                  placeholder="e.g. Birmingham"
                  value={formData.location_city} 
                  onChange={(e) => handleChange('location_city', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <Input 
                  value={formData.location_country} 
                  onChange={(e) => handleChange('location_country', e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </div>
        )}

        {!isEditing && (
          <div className="text-sm text-gray-600">
            <p>{formData.location_city}, {formData.location_country}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
