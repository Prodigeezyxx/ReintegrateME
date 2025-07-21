
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
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-6 w-6 text-slate-700" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2 font-geist">Personal Information</h1>
        <p className="text-slate-600 font-geist">
          Let's start with your basic contact information
        </p>
      </div>

      <Card className="ios-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900 font-geist">Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-slate-700 font-geist">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={cvData.personalInfo.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="pl-10 h-11 touch-manipulation border-slate-300 focus:border-slate-900 focus:ring-slate-900 font-geist"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700 font-geist">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={cvData.personalInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 h-11 touch-manipulation border-slate-300 focus:border-slate-900 focus:ring-slate-900 font-geist"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-slate-700 font-geist">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+44 123 456 7890"
                  value={cvData.personalInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="pl-10 h-11 touch-manipulation border-slate-300 focus:border-slate-900 focus:ring-slate-900 font-geist"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-slate-700 font-geist">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="location"
                  placeholder="London, UK"
                  value={cvData.personalInfo.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="pl-10 h-11 touch-manipulation border-slate-300 focus:border-slate-900 focus:ring-slate-900 font-geist"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-base font-medium mb-4 text-slate-900 font-geist">Optional Links</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-sm font-medium text-slate-700 font-geist">LinkedIn Profile</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/johndoe"
                    value={cvData.personalInfo.linkedin || ''}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className="pl-10 h-11 touch-manipulation border-slate-300 focus:border-slate-900 focus:ring-slate-900 font-geist"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium text-slate-700 font-geist">Personal Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://johndoe.com"
                    value={cvData.personalInfo.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="pl-10 h-11 touch-manipulation border-slate-300 focus:border-slate-900 focus:ring-slate-900 font-geist"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pb-6">
        <Button 
          onClick={onNext} 
          disabled={!isFormValid()}
          size="lg"
          className="touch-manipulation w-full max-w-xs disabled:opacity-50 font-geist"
        >
          Continue to Professional Summary
        </Button>
      </div>
    </div>
  );
};
