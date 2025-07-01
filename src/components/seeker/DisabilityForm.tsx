
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AnimatedCard from '../ui/animated-card';

interface DisabilityFormProps {
  hasDisability: boolean | null;
  setHasDisability: (value: boolean | null) => void;
  disabilityTypes: string[];
  disabilityOtherDetails: string;
  setDisabilityOtherDetails: (value: string) => void;
  workplaceAdjustments: string[];
  onDisabilityTypeChange: (type: string, checked: boolean) => void;
  onAdjustmentChange: (adjustment: string, checked: boolean) => void;
}

const disabilityOptions: { value: string; label: string }[] = [
  { value: 'mobility_physical_access', label: 'Mobility / physical access needs' },
  { value: 'sensory_hearing_vision_processing', label: 'Sensory (hearing / vision / processing)' },
  { value: 'long_term_medical_condition', label: 'Long-term medical condition (e.g. diabetes, epilepsy, HIV, etc.)' },
  { value: 'neurodivergence', label: 'Neurodivergence (e.g. ADHD, Autism, Dyslexia, Dyspraxia, etc.)' },
  { value: 'learning_difficulty', label: 'Learning difficulty' },
  { value: 'mental_health', label: 'Mental health' },
  { value: 'communication_needs', label: 'Communication needs' },
  { value: 'cognitive_memory_difficulties', label: 'Cognitive or memory difficulties' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_specify', label: 'Prefer not to specify' }
];

const adjustmentOptions: { value: string; label: string }[] = [
  { value: 'flexible_working_hours', label: 'Flexible working hours' },
  { value: 'remote_work_option', label: 'Remote work options' },
  { value: 'additional_training_support', label: 'Additional training or support' },
  { value: 'assistive_technology', label: 'Assistive technology' },
  { value: 'modified_physical_work_environment', label: 'Modified physical work environment' },
  { value: 'communication_support', label: 'Communication support' },
  { value: 'none', label: 'None required' }
];

const DisabilityForm: React.FC<DisabilityFormProps> = ({
  hasDisability,
  setHasDisability,
  disabilityTypes,
  disabilityOtherDetails,
  setDisabilityOtherDetails,
  workplaceAdjustments,
  onDisabilityTypeChange,
  onAdjustmentChange
}) => {
  return (
    <>
      {/* Disability Status section */}
      <AnimatedCard
        title="Disability Status"
        delay={100}
        className="glassmorphism-strong"
      >
        <RadioGroup 
          value={hasDisability?.toString() || ''} 
          onValueChange={(value) => setHasDisability(value === 'true')}
        >
          <div className="flex items-centre space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-300">
            <RadioGroupItem 
              value="true" 
              id="disability-yes"
              className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
            />
            <Label htmlFor="disability-yes" className="text-slate-800 font-geist cursor-pointer">Yes, I have a disability</Label>
          </div>
          <div className="flex items-centre space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-300">
            <RadioGroupItem 
              value="false" 
              id="disability-no"
              className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
            />
            <Label htmlFor="disability-no" className="text-slate-800 font-geist cursor-pointer">No, I do not have a disability</Label>
          </div>
        </RadioGroup>
      </AnimatedCard>

      {/* Type of Disability section */}
      {hasDisability && (
        <AnimatedCard
          title="Type of Disability"
          description="If 'Yes', select any that apply:"
          delay={200}
          className="glassmorphism-strong"
        >
          <div className="space-y-3">
            {disabilityOptions.map((option) => (
              <div key={option.value} className="flex items-centre space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300">
                <Checkbox
                  id={option.value}
                  checked={disabilityTypes.includes(option.value)}
                  onCheckedChange={(checked) => 
                    onDisabilityTypeChange(option.value, checked as boolean)
                  }
                  className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <Label htmlFor={option.value} className="text-sm text-slate-800 font-geist cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
          
          {disabilityTypes.includes('other') && (
            <div className="mt-4">
              <Label htmlFor="disability-other" className="text-slate-800 font-geist text-sm">Please specify</Label>
              <Textarea
                id="disability-other"
                value={disabilityOtherDetails}
                onChange={(e) => setDisabilityOtherDetails(e.target.value)}
                placeholder="Please provide details..."
                className="mt-2 bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-blue-400"
              />
            </div>
          )}
        </AnimatedCard>
      )}

      {/* Workplace Adjustments section */}
      <AnimatedCard
        title="Workplace Adjustments"
        description="What adjustments might you need? (optional)"
        delay={300}
        className="glassmorphism-strong"
      >
        <div className="space-y-3">
          {adjustmentOptions.map((option) => (
            <div key={option.value} className="flex items-centre space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300">
              <Checkbox
                id={option.value}
                checked={workplaceAdjustments.includes(option.value)}
                onCheckedChange={(checked) => 
                  onAdjustmentChange(option.value, checked as boolean)
                }
                className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <Label htmlFor={option.value} className="text-sm text-slate-800 font-geist cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </>
  );
};

export default DisabilityForm;
