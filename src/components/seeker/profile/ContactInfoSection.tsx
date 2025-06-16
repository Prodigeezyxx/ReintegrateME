
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactInfoSectionProps {
  profile: any;
  isEditing: boolean;
  onUpdate: (updates: any) => void;
}

export const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  profile,
  isEditing,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    email: profile.email || '',
    phone_number: profile.phone_number || '',
    location_city: profile.location_city || ''
  });

  const handleSave = () => {
    onUpdate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="ios-card">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <Mail className="h-5 w-5 text-blue-600 mr-2" />
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input 
                type="email"
                placeholder="your.email@example.com"
                value={formData.email} 
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <Input 
                type="tel"
                placeholder="07123 456 789"
                value={formData.phone_number} 
                onChange={(e) => handleChange('phone_number', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input 
                placeholder="City or Region"
                value={formData.location_city} 
                onChange={(e) => handleChange('location_city', e.target.value)}
              />
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <a href={`mailto:${formData.email}`} className="text-blue-600 hover:underline">
                {formData.email || 'Email not provided'}
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{formData.phone_number || 'Phone not provided'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{formData.location_city || 'Location not provided'}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
