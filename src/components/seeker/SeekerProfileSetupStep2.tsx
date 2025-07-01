
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { profileSetupManager } from '../../utils/profileSetupManager';
import AnimatedButton from '../ui/animated-button';
import SetupStepHeader from './SetupStepHeader';
import GDPRStatement from './GDPRStatement';
import CriminalConvictionForm from './CriminalConvictionForm';
import SafeguardingQuestions from './SafeguardingQuestions';

const SeekerProfileSetupStep2 = () => {
  const navigate = useNavigate();
  const [seekerProfile, setSeekerProfile] = useState({
    sentenceCompleted: undefined as boolean | undefined,
    convictionTypes: [] as string[],
    convictionStatus: undefined as string | undefined,
    barredFromRegulatedWork: undefined as boolean | undefined,
    onDbsBarringList: undefined as boolean | undefined,
    mappaLevel: undefined as string | undefined,
    relevantForSafeguardingChecks: undefined as boolean | undefined,
    convictionOtherDetails: ''
  });

  useEffect(() => {
    const savedData = profileSetupManager.getAllData();
    setSeekerProfile(prev => ({
      sentenceCompleted: savedData.sentenceCompleted,
      convictionTypes: savedData.convictionTypes || [],
      convictionStatus: savedData.convictionStatus,
      barredFromRegulatedWork: savedData.barredFromRegulatedWork,
      onDbsBarringList: savedData.onDbsBarringList,
      mappaLevel: savedData.mappaLevel,
      relevantForSafeguardingChecks: savedData.relevantForSafeguardingChecks,
      convictionOtherDetails: savedData.convictionOtherDetails || ''
    }));
  }, []);

  const handleBooleanChange = (field: string, value: string) => {
    const boolValue = value === 'true' ? true : value === 'false' ? false : value === 'unknown' ? undefined : undefined;
    setSeekerProfile(prev => ({ ...prev, [field]: boolValue }));
    profileSetupManager.saveStepData(2, { [field]: boolValue });
  };

  const handleFieldChange = (field: string, value: any) => {
    setSeekerProfile(prev => ({ ...prev, [field]: value }));
    profileSetupManager.saveStepData(2, { [field]: value });
  };

  const handleConvictionTypeChange = (convictionType: string, checked: boolean) => {
    setSeekerProfile(prev => {
      const currentTypes = prev.convictionTypes || [];
      const newTypes = checked 
        ? [...currentTypes, convictionType]
        : currentTypes.filter(type => type !== convictionType);
      
      profileSetupManager.saveStepData(2, { convictionTypes: newTypes });
      return { ...prev, convictionTypes: newTypes };
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    profileSetupManager.saveStepData(2, seekerProfile);
    toast({
      title: "Information Saved",
      description: "Your legal information has been saved successfully.",
    });
    navigate('/seeker-setup-step3');
  };

  const handleBack = () => {
    navigate('/seeker-skills-step');
  };

  return (
    <div className="mobile-container gradient-bg-primary min-h-screen">
      <div className="min-h-screen flex flex-col p-4 sm:p-6 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full animate-float animate-delay-100" />
        <div className="absolute bottom-20 left-10 w-16 h-16 bg-white/5 rounded-full animate-float animate-delay-300" />
        <div className="absolute top-1/2 right-5 w-12 h-12 bg-white/10 rounded-full animate-float animate-delay-500" />

        <SetupStepHeader
          title="Legal Information"
          description="This helps us match you with suitable opportunities - Step 2 of 4"
          progress={50}
          onBack={handleBack}
        />

        <form onSubmit={handleNext} className="flex-1 space-y-4 sm:space-y-6">
          <GDPRStatement
            title="Criminal Convictions Disclosure (GDPR Statement)"
            whyWeAsk="We ask about criminal convictions to connect you with employers and opportunities that are open to people with previous convictions. This helps us to avoid unsuitable referrals and advocate on your behalf where needed."
            howWeHandle="This information is classified as criminal offence data under the UK GDPR. It will only be accessed by authorised staff and will be used strictly to provide relevant support and opportunities. We will not share this data with any third party without your permission unless legally required."
            delay={50}
          />

          <CriminalConvictionForm
            seekerProfile={seekerProfile}
            setSeekerProfile={setSeekerProfile}
            onBooleanChange={handleBooleanChange}
            onConvictionTypeChange={handleConvictionTypeChange}
            onFieldChange={handleFieldChange}
          />

          <SafeguardingQuestions
            seekerProfile={seekerProfile}
            onBooleanChange={handleBooleanChange}
            onFieldChange={handleFieldChange}
          />

          {/* Navigation buttons */}
          <div className="mt-6 sm:mt-8 animate-slide-up-stagger animate-delay-500 flex flex-col sm:flex-row gap-3">
            <AnimatedButton
              type="button"
              variant="outline"
              onClick={handleBack}
              className="w-full sm:flex-1 py-4 sm:py-6 text-base sm:text-lg font-bold rounded-2xl
                bg-white/90 hover:bg-white border-2 border-slate-200
                text-slate-700 hover:text-slate-900 font-geist min-h-[44px]"
              ripple={true}
            >
              Back
            </AnimatedButton>
            
            <AnimatedButton
              type="submit"
              className="w-full sm:flex-2 py-4 sm:py-6 text-base sm:text-lg font-bold rounded-2xl
                bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500
                hover:from-blue-600 hover:via-purple-600 hover:to-orange-600
                text-white shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]
                transition-all duration-500 font-geist min-h-[44px]"
              ripple={true}
              glow={true}
            >
              Next: Health & Accessibility Information
            </AnimatedButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeekerProfileSetupStep2;
