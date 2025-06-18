
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { seekerAPI } from '../../services/api';
import { toast } from '@/hooks/use-toast';
import { WorkPreferenceType } from '../../models/types';

const SeekerProfileSetupStep4 = () => {
  const navigate = useNavigate();
  const [hasDrivingLicence, setHasDrivingLicence] = useState<boolean | null>(null);
  const [workPreferences, setWorkPreferences] = useState<WorkPreferenceType[]>([]);
  const [openToRelocation, setOpenToRelocation] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const workPreferenceOptions: { value: WorkPreferenceType; label: string }[] = [
    { value: 'full_time', label: 'Full-time (35+ hours/week)' },
    { value: 'part_time', label: 'Part-time (16-34 hours/week)' },
    { value: 'zero_hours', label: 'Zero hours contract' },
    { value: 'weekends', label: 'Weekend work' },
    { value: 'nights', label: 'Night shifts' }
  ];

  const handleWorkPreferenceChange = (preference: WorkPreferenceType, checked: boolean) => {
    if (checked) {
      setWorkPreferences(prev => [...prev, preference]);
    } else {
      setWorkPreferences(prev => prev.filter(p => p !== preference));
    }
  };

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      
      await seekerAPI.updateProfile({
        hasDrivingLicence,
        workPreferences,
        openToRelocation,
        availabilityStatus: 'actively_looking'
      });

      toast({
        title: "Profile completed!",
        description: "Your profile has been successfully created.",
      });

      navigate('/seeker-dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/seeker-setup-step3');
  };

  return (
    <div className="mobile-container bg-gradient-to-br from-blue-50 to-orange-50 min-h-screen">
      <div className="min-h-screen flex flex-col p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Work Preferences</h1>
            <p className="text-gray-600">Final step - Step 4 of 4</p>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Driving Licence</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={hasDrivingLicence?.toString() || ''} 
                onValueChange={(value) => setHasDrivingLicence(value === 'true')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="licence-yes" />
                  <Label htmlFor="licence-yes">Yes, I have a valid UK driving licence</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="licence-no" />
                  <Label htmlFor="licence-no">No, I don't have a driving licence</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Work Preferences</CardTitle>
              <p className="text-sm text-gray-600">What type of work arrangements suit you? (Select all that apply)</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workPreferenceOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={workPreferences.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleWorkPreferenceChange(option.value, checked as boolean)
                      }
                    />
                    <Label htmlFor={option.value} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Relocation</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={openToRelocation?.toString() || ''} 
                onValueChange={(value) => setOpenToRelocation(value === 'true')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="relocation-yes" />
                  <Label htmlFor="relocation-yes">Yes, I'm open to relocating for work</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="relocation-no" />
                  <Label htmlFor="relocation-no">No, I prefer to work locally</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-green-800 font-medium">Almost there!</p>
                <p className="text-sm text-green-700">
                  Complete your profile to start connecting with employers who value what you bring to the table.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button 
            onClick={handleComplete} 
            disabled={isLoading}
            className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
          >
            {isLoading ? 'Creating Profile...' : 'Complete Profile & Start Matching'}
            <CheckCircle className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfileSetupStep4;
