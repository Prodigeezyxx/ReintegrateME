
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { profileSetupManager } from '../../utils/profileSetupManager';
import AnimatedCard from '../ui/animated-card';
import AnimatedButton from '../ui/animated-button';
import SetupStepHeader from './SetupStepHeader';
import GDPRStatement from './GDPRStatement';
import DisabilityForm from './DisabilityForm';

const SeekerProfileSetupStep3 = () => {
  const navigate = useNavigate();
  const [hasDisability, setHasDisability] = useState<boolean | null>(null);
  const [disabilityTypes, setDisabilityTypes] = useState<string[]>([]);
  const [disabilityOtherDetails, setDisabilityOtherDetails] = useState('');
  const [workplaceAdjustments, setWorkplaceAdjustments] = useState<string[]>([]);
  const [workplaceAdjustmentsOther, setWorkplaceAdjustmentsOther] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load existing data from setup manager
    const savedData = profileSetupManager.getAllData();
    if (savedData.hasDisability !== undefined) setHasDisability(savedData.hasDisability);
    if (savedData.disabilityTypes) setDisabilityTypes(savedData.disabilityTypes);
    if (savedData.disabilityOtherDetails) setDisabilityOtherDetails(savedData.disabilityOtherDetails);
    if (savedData.workplaceAdjustments) setWorkplaceAdjustments(savedData.workplaceAdjustments);
    if (savedData.workplaceAdjustmentsOther) setWorkplaceAdjustmentsOther(savedData.workplaceAdjustmentsOther);
  }, []);

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

  const handleNext = async () => {
    setIsLoading(true);
    
    try {
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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

        <SetupStepHeader
          title="Health & Accessibility"
          description="Optional information to help us support you - Step 3 of 4"
          progress={75}
          onBack={handleBack}
        />

        <div className="flex-1 space-y-6">
          <GDPRStatement
            title="Disability Disclosure (GDPR Statement)"
            whyWeAsk="We ask about disabilities to ensure that we provide the right support and make any reasonable adjustments needed to help you access training, employment, and services through ReintegrateMe. Sharing this information is entirely optional."
            howWeHandle="This data is considered special category personal data under the UK GDPR. It will only be used to tailor our services to meet your needs and will never be shared without your explicit consent unless required by law. You can choose not to disclose this information."
            delay={50}
          />

          <DisabilityForm
            hasDisability={hasDisability}
            setHasDisability={setHasDisability}
            disabilityTypes={disabilityTypes}
            disabilityOtherDetails={disabilityOtherDetails}
            setDisabilityOtherDetails={setDisabilityOtherDetails}
            workplaceAdjustments={workplaceAdjustments}
            onDisabilityTypeChange={handleDisabilityTypeChange}
            onAdjustmentChange={handleAdjustmentChange}
          />

          {/* Privacy notice section */}
          <AnimatedCard 
            delay={400}
            className="glassmorphism border-2 border-blue-400/30 bg-gradient-to-r from-blue-50/80 to-indigo-50/80"
          >
            <div className="text-center">
              <p className="text-sm text-slate-700 font-geist font-medium">
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
            disabled={isLoading}
            className="flex-1 bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white font-geist min-h-[44px] font-semibold"
            aria-label="Skip this step and proceed to final step"
          >
            Skip for Now
          </AnimatedButton>
          <AnimatedButton 
            onClick={handleNext} 
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500
              hover:from-blue-600 hover:via-purple-600 hover:to-orange-600
              text-white font-geist min-h-[44px] font-semibold shadow-lg"
            ripple={true}
            glow={true}
            aria-label="Save information and proceed to final step"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              'Next: Final Details'
            )}
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfileSetupStep3;
