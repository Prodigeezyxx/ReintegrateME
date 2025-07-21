
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { CVData } from '@/types/cv';

interface PersonalInfoStepProps {
  cvData: CVData;
  updateCVData: (updates: Partial<CVData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  cvData,
  updateCVData,
  onNext,
}) => {
  const handleInputChange = (field: keyof typeof cvData.personalInfo, value: string) => {
    updateCVData({
      personalInfo: {
        ...cvData.personalInfo,
        [field]: value,
      },
    });
  };

  const isFormValid = () => {
    const { fullName, email, phone, location } = cvData.personalInfo;
    return fullName && email && phone && location;
  };

  return (
    <div className="p-4 max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-reintegrate-blue to-reintegrate-blue-light rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
          <User className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold mb-2 text-reintegrate-blue">Personal Information</h2>
        <p className="text-sm text-reintegrate-gray">
          Let's start with your basic contact information
        </p>
      </div>

      <Card className="mb-6 border-2 border-reintegrate-gray/20 shadow-lg bg-gradient-to-br from-white to-reintegrate-light-bg">
        <CardHeader className="pb-4 bg-gradient-to-r from-reintegrate-soft-blue to-transparent">
          <CardTitle className="text-lg text-reintegrate-blue">Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-reintegrate-blue">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-reintegrate-blue/60" />
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={cvData.personalInfo.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="pl-10 h-11 touch-manipulation border-reintegrate-gray/30 focus:border-reintegrate-blue focus:ring-reintegrate-blue/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-reintegrate-blue">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-reintegrate-blue/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={cvData.personalInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 h-11 touch-manipulation border-reintegrate-gray/30 focus:border-reintegrate-blue focus:ring-reintegrate-blue/20"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-reintegrate-blue">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-reintegrate-blue/60" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+44 123 456 7890"
                  value={cvData.personalInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="pl-10 h-11 touch-manipulation border-reintegrate-gray/30 focus:border-reintegrate-blue focus:ring-reintegrate-blue/20"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-reintegrate-blue">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-reintegrate-blue/60" />
                <Input
                  id="location"
                  placeholder="London, UK"
                  value={cvData.personalInfo.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="pl-10 h-11 touch-manipulation border-reintegrate-gray/30 focus:border-reintegrate-blue focus:ring-reintegrate-blue/20"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-reintegrate-gray/20 pt-4 mt-6">
            <h3 className="text-base font-medium mb-4 text-reintegrate-blue">Optional Links</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-sm font-medium text-reintegrate-blue">LinkedIn Profile</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-reintegrate-blue/60" />
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/johndoe"
                    value={cvData.personalInfo.linkedin || ''}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className="pl-10 h-11 touch-manipulation border-reintegrate-gray/30 focus:border-reintegrate-blue focus:ring-reintegrate-blue/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium text-reintegrate-blue">Personal Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-reintegrate-blue/60" />
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://johndoe.com"
                    value={cvData.personalInfo.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="pl-10 h-11 touch-manipulation border-reintegrate-gray/30 focus:border-reintegrate-blue focus:ring-reintegrate-blue/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pb-6">
        <Button 
          variant="brand-primary"
          onClick={onNext} 
          disabled={!isFormValid()}
          size="lg"
          className="min-h-11 touch-manipulation w-full max-w-xs disabled:opacity-50"
        >
          Continue to Professional Summary
        </Button>
      </div>
    </div>
  );
};
