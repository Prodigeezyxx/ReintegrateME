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
        <User className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
        <p className="text-muted-foreground">
          Let's start with your basic contact information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={cvData.personalInfo.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={cvData.personalInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="+44 123 456 7890"
                  value={cvData.personalInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="London, UK"
                  value={cvData.personalInfo.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Optional Links</h3>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/johndoe"
                  value={cvData.personalInfo.linkedin || ''}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Personal Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  placeholder="https://johndoe.com"
                  value={cvData.personalInfo.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center mt-8">
        <Button 
          onClick={onNext} 
          disabled={!isFormValid()}
          size="lg"
        >
          Continue to Professional Summary
        </Button>
      </div>
    </div>
  );
};