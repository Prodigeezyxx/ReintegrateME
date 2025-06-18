
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { seekerAPI } from '../../services/api';
import { toast } from '@/hooks/use-toast';
import { DisabilityType, WorkplaceAdjustmentType } from '../../models/types';

const SeekerProfileSetupStep3 = () => {
  const navigate = useNavigate();
  const [hasDisability, setHasDisability] = useState<boolean | null>(null);
  const [disabilityTypes, setDisabilityTypes] = useState<DisabilityType[]>([]);
  const [disabilityOtherDetails, setDisabilityOtherDetails] = useState('');
  const [workplaceAdjustments, setWorkplaceAdjustments] = useState<WorkplaceAdjustmentType[]>([]);
  const [workplaceAdjustmentsOther, setWorkplaceAdjustmentsOther] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const disabilityOptions: { value: DisabilityType; label: string }[] = [
    { value: 'mobility_physical_access', label: 'Mobility or physical access needs' },
    { value: 'sensory_hearing_vision_processing', label: 'Sensory (hearing, vision, processing)' },
    { value: 'long_term_medical_condition', label: 'Long-term medical condition' },
    { value: 'neurodivergence', label: 'Neurodivergence (ADHD, Autism, etc.)' },
    { value: 'learning_difficulty', label: 'Learning difficulty' },
    { value: 'mental_health', label: 'Mental health condition' },
    { value: 'communication_needs', label: 'Communication needs' },
    { value: 'cognitive_memory_difficulties', label: 'Cognitive or memory difficulties' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_specify', label: 'Prefer not to specify' }
  ];

  const adjustmentOptions: { value: WorkplaceAdjustmentType; label: string }[] = [
    { value: 'flexible_working_hours', label: 'Flexible working hours' },
    { value: 'remote_work_option', label: 'Remote work options' },
    { value: 'additional_training_support', label: 'Additional training or support' },
    { value: 'assistive_technology', label: 'Assistive technology' },
    { value: 'modified_physical_work_environment', label: 'Modified physical work environment' },
    { value: 'communication_support', label: 'Communication support' },
    { value: 'none', label: 'None required' },
    { value: 'other', label: 'Other' }
  ];

  const handleDisabilityTypeChange = (type: DisabilityType, checked: boolean) => {
    if (checked) {
      setDisabilityTypes(prev => [...prev, type]);
    } else {
      setDisabilityTypes(prev => prev.filter(t => t !== type));
    }
  };

  const handleAdjustmentChange = (adjustment: WorkplaceAdjustmentType, checked: boolean) => {
    if (checked) {
      setWorkplaceAdjustments(prev => [...prev, adjustment]);
    } else {
      setWorkplaceAdjustments(prev => prev.filter(a => a !== adjustment));
    }
  };

  const handleNext = async () => {
    try {
      setIsLoading(true);
      
      await seekerAPI.updateProfile({
        hasDisability,
        disabilityTypes: hasDisability ? disabilityTypes : undefined,
        disabilityOtherDetails: disabilityTypes.includes('other') ? disabilityOtherDetails : undefined,
        workplaceAdjustments,
        workplaceAdjustmentsOther: workplaceAdjustments.includes('other') ? workplaceAdjustmentsOther : undefined,
      });

      toast({
        title: "Progress saved",
        description: "Your disability and health information has been saved.",
      });

      navigate('/seeker-setup-step4');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/seeker-setup-step2');
  };

  const handleSkip = () => {
    navigate('/seeker-setup-step4');
  };

  return (
    <div className="mobile-container bg-gradient-to-br from-blue-50 to-orange-50 min-h-screen">
      <div className="min-h-screen flex flex-col p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Health & Accessibility</h1>
            <p className="text-gray-600">Step 3 of 4</p>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Disability Status</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={hasDisability?.toString() || ''} 
                onValueChange={(value) => setHasDisability(value === 'true')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="disability-yes" />
                  <Label htmlFor="disability-yes">Yes, I have a disability</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="disability-no" />
                  <Label htmlFor="disability-no">No, I do not have a disability</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {hasDisability && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Type of Disability</CardTitle>
                <p className="text-sm text-gray-600">Select all that apply (optional)</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {disabilityOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.value}
                        checked={disabilityTypes.includes(option.value)}
                        onCheckedChange={(checked) => 
                          handleDisabilityTypeChange(option.value, checked as boolean)
                        }
                      />
                      <Label htmlFor={option.value} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
                
                {disabilityTypes.includes('other') && (
                  <div className="mt-4">
                    <Label htmlFor="disability-other">Please specify</Label>
                    <Textarea
                      id="disability-other"
                      value={disabilityOtherDetails}
                      onChange={(e) => setDisabilityOtherDetails(e.target.value)}
                      placeholder="Please provide details..."
                      className="mt-1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workplace Adjustments</CardTitle>
              <p className="text-sm text-gray-600">What adjustments might you need? (optional)</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {adjustmentOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={workplaceAdjustments.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleAdjustmentChange(option.value, checked as boolean)
                      }
                    />
                    <Label htmlFor={option.value} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
              
              {workplaceAdjustments.includes('other') && (
                <div className="mt-4">
                  <Label htmlFor="adjustments-other">Please specify</Label>
                  <Textarea
                    id="adjustments-other"
                    value={workplaceAdjustmentsOther}
                    onChange={(e) => setWorkplaceAdjustmentsOther(e.target.value)}
                    placeholder="Please describe the adjustments you might need..."
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Your privacy matters:</strong> This information helps us match you with inclusive employers. 
              You control what you share and when.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={handleSkip} className="flex-1">
            Skip for Now
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
          >
            {isLoading ? 'Saving...' : 'Continue'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfileSetupStep3;
