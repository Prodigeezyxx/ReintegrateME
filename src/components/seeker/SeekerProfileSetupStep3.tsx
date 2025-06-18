
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { profileSetupManager } from '../../utils/profileSetupManager';
import AnimatedCard from '../ui/animated-card';
import AnimatedButton from '../ui/animated-button';
import AnimatedProgress from '../ui/animated-progress';
import { getLogoUrl } from '../../utils/logoUpload';

const SeekerProfileSetupStep3 = () => {
  const navigate = useNavigate();
  const [hasDisability, setHasDisability] = useState<boolean | null>(null);
  const [disabilityTypes, setDisabilityTypes] = useState<string[]>([]);
  const [disabilityOtherDetails, setDisabilityOtherDetails] = useState('');
  const [workplaceAdjustments, setWorkplaceAdjustments] = useState<string[]>([]);
  const [workplaceAdjustmentsOther, setWorkplaceAdjustmentsOther] = useState('');

  useEffect(() => {
    // Load existing data from setup manager
    const savedData = profileSetupManager.getAllData();
    if (savedData.hasDisability !== undefined) setHasDisability(savedData.hasDisability);
    if (savedData.disabilityTypes) setDisabilityTypes(savedData.disabilityTypes);
    if (savedData.disabilityOtherDetails) setDisabilityOtherDetails(savedData.disabilityOtherDetails);
    if (savedData.workplaceAdjustments) setWorkplaceAdjustments(savedData.workplaceAdjustments);
    if (savedData.workplaceAdjustmentsOther) setWorkplaceAdjustmentsOther(savedData.workplaceAdjustmentsOther);
  }, []);

  const disabilityOptions: { value: string; label: string }[] = [
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

  const adjustmentOptions: { value: string; label: string }[] = [
    { value: 'flexible_working_hours', label: 'Flexible working hours' },
    { value: 'remote_work_option', label: 'Remote work options' },
    { value: 'additional_training_support', label: 'Additional training or support' },
    { value: 'assistive_technology', label: 'Assistive technology' },
    { value: 'modified_physical_work_environment', label: 'Modified physical work environment' },
    { value: 'communication_support', label: 'Communication support' },
    { value: 'none', label: 'None required' },
    { value: 'other', label: 'Other' }
  ];

  const handleDisabilityTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setDisabilityTypes(prev => [...prev, type]);
    } else {
      setDisabilityTypes(prev => prev.filter(t => t !== type));
    }
  };

  const handleAdjustmentChange = (adjustment: string, checked: boolean) => {
    if (checked) {
      setWorkplaceAdjustments(prev => [...prev, adjustment]);
    } else {
      setWorkplaceAdjustments(prev => prev.filter(a => a !== adjustment));
    }
  };

  const handleNext = () => {
    // Save data to profile manager
    profileSetupManager.saveStepData(3, {
      hasDisability,
      disabilityTypes: hasDisability ? disabilityTypes : undefined,
      disabilityOtherDetails: disabilityTypes.includes('other') ? disabilityOtherDetails : undefined,
      workplaceAdjustments,
      workplaceAdjustmentsOther: workplaceAdjustments.includes('other') ? workplaceAdjustmentsOther : undefined,
    });

    toast({
      title: "Information Saved",
      description: "Your health and accessibility information has been saved.",
    });

    navigate('/seeker-setup-step4');
  };

  const handleBack = () => {
    // Save current data before going back
    profileSetupManager.saveStepData(3, {
      hasDisability,
      disabilityTypes,
      disabilityOtherDetails,
      workplaceAdjustments,
      workplaceAdjustmentsOther
    });
    navigate('/seeker-setup-step2');
  };

  const handleSkip = () => {
    navigate('/seeker-setup-step4');
  };

  return (
    <div className="mobile-container gradient-bg-primary min-h-screen">
      <div className="min-h-screen flex flex-col p-6 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full animate-float animate-delay-100" />
        <div className="absolute bottom-20 left-10 w-16 h-16 bg-white/5 rounded-full animate-float animate-delay-300" />
        <div className="absolute top-1/2 right-5 w-12 h-12 bg-white/10 rounded-full animate-float animate-delay-500" />

        {/* Header with enhanced styling */}
        <div className="flex items-center mb-8 animate-slide-up-stagger">
          <AnimatedButton 
            variant="ghost" 
            size="icon" 
            onClick={handleBack} 
            className="mr-3 text-white hover:bg-white/20 backdrop-blur-md rounded-full"
            ripple={false}
          >
            <ArrowLeft className="h-6 w-6" />
          </AnimatedButton>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white font-geist animate-fade-in-scale">
              Health & Accessibility
            </h1>
            <p className="text-white/80 font-geist mt-1 animate-fade-in-scale animate-delay-100">
              Optional information to help us support you - Step 3 of 4 ✨
            </p>
          </div>
          <div className="ml-4">
            <img 
              src={getLogoUrl()} 
              alt="ReintegrateMe"
              className="h-12 w-12 animate-float"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8 animate-slide-up-stagger animate-delay-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-geist text-white/80">Profile Completion</span>
            <span className="text-sm font-bold text-white font-geist">75%</span>
          </div>
          <AnimatedProgress value={75} animate={true} />
        </div>

        <div className="flex-1 space-y-6">
          <AnimatedCard
            title="Disability Status"
            delay={100}
            className="glassmorphism-strong"
          >
            <RadioGroup 
              value={hasDisability?.toString() || ''} 
              onValueChange={(value) => setHasDisability(value === 'true')}
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                <RadioGroupItem 
                  value="true" 
                  id="disability-yes"
                  className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
                />
                <Label htmlFor="disability-yes" className="text-white font-geist cursor-pointer">Yes, I have a disability</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                <RadioGroupItem 
                  value="false" 
                  id="disability-no"
                  className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
                />
                <Label htmlFor="disability-no" className="text-white font-geist cursor-pointer">No, I do not have a disability</Label>
              </div>
            </RadioGroup>
          </AnimatedCard>

          {hasDisability && (
            <AnimatedCard
              title="Type of Disability"
              description="Select all that apply (optional)"
              delay={200}
              className="glassmorphism-strong"
            >
              <div className="space-y-3">
                {disabilityOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-300">
                    <Checkbox
                      id={option.value}
                      checked={disabilityTypes.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleDisabilityTypeChange(option.value, checked as boolean)
                      }
                      className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <Label htmlFor={option.value} className="text-sm text-white font-geist cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
              
              {disabilityTypes.includes('other') && (
                <div className="mt-4">
                  <Label htmlFor="disability-other" className="text-white font-geist">Please specify</Label>
                  <Textarea
                    id="disability-other"
                    value={disabilityOtherDetails}
                    onChange={(e) => setDisabilityOtherDetails(e.target.value)}
                    placeholder="Please provide details..."
                    className="mt-2 bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-blue-400"
                  />
                </div>
              )}
            </AnimatedCard>
          )}

          <AnimatedCard
            title="Workplace Adjustments"
            description="What adjustments might you need? (optional)"
            delay={300}
            className="glassmorphism-strong"
          >
            <div className="space-y-3">
              {adjustmentOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-300">
                  <Checkbox
                    id={option.value}
                    checked={workplaceAdjustments.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleAdjustmentChange(option.value, checked as boolean)
                    }
                    className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <Label htmlFor={option.value} className="text-sm text-white font-geist cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            
            {workplaceAdjustments.includes('other') && (
              <div className="mt-4">
                <Label htmlFor="adjustments-other" className="text-white font-geist">Please specify</Label>
                <Textarea
                  id="adjustments-other"
                  value={workplaceAdjustmentsOther}
                  onChange={(e) => setWorkplaceAdjustmentsOther(e.target.value)}
                  placeholder="Please describe the adjustments you might need..."
                  className="mt-2 bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-blue-400"
                />
              </div>
            )}
          </AnimatedCard>

          <AnimatedCard 
            delay={400}
            className="glassmorphism border-2 border-blue-400/30 bg-gradient-to-r from-blue-50/80 to-indigo-50/80"
          >
            <div className="text-center">
              <p className="text-sm text-white font-geist">
                <strong>Your privacy matters:</strong> This information helps us match you with inclusive employers. 
                You control what you share and when.
              </p>
            </div>
          </AnimatedCard>
        </div>

        <div className="flex gap-3 mt-6 animate-slide-up-stagger animate-delay-500">
          <AnimatedButton 
            variant="outline" 
            onClick={handleSkip} 
            className="flex-1 bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white font-geist"
          >
            Skip for Now
          </AnimatedButton>
          <AnimatedButton 
            onClick={handleNext} 
            className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500
              hover:from-blue-600 hover:via-purple-600 hover:to-orange-600
              text-white font-geist"
            ripple={true}
            glow={true}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfileSetupStep3;
