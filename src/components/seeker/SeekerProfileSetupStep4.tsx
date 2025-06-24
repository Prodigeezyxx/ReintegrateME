import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { profileSetupManager } from '../../utils/profileSetupManager';
import AnimatedCard from '../ui/animated-card';
import AnimatedButton from '../ui/animated-button';
import AnimatedProgress from '../ui/animated-progress';
import { getLogoUrl } from '../../utils/logoUpload';

const workPreferenceOptions = [
  'full_time',
  'part_time', 
  'contract',
  'temporary',
  'flexible_hours',
  'remote_work',
  'shift_work',
  'zero_hours',
  'weekends',
  'nights'
];

const SeekerProfileSetupStep4 = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [seekerProfile, setSeekerProfile] = useState({
    hasDrivingLicence: undefined as boolean | undefined,
    workPreferences: [] as string[],
    openToRelocation: undefined as boolean | undefined
  });

  useEffect(() => {
    const savedData = profileSetupManager.getAllData();
    setSeekerProfile({
      hasDrivingLicence: savedData.hasDrivingLicence,
      workPreferences: savedData.workPreferences || [],
      openToRelocation: savedData.openToRelocation
    });
  }, []);

  const handleBooleanChange = (field: string, value: string) => {
    const boolValue = value === 'true' ? true : value === 'false' ? false : undefined;
    setSeekerProfile(prev => ({ ...prev, [field]: boolValue }));
    profileSetupManager.saveStepData(4, { [field]: boolValue });
  };

  const handleWorkPreferenceChange = (preference: string, checked: boolean) => {
    setSeekerProfile(prev => {
      const currentPrefs = prev.workPreferences || [];
      const newPrefs = checked 
        ? [...currentPrefs, preference]
        : currentPrefs.filter(p => p !== preference);
      
      profileSetupManager.saveStepData(4, { workPreferences: newPrefs });
      return { ...prev, workPreferences: newPrefs };
    });
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Save final step data
      profileSetupManager.saveStepData(4, seekerProfile);
      
      // Save all data to database
      const result = await profileSetupManager.saveToDatabase();
      
      if (result.success) {
        toast({
          title: "Profile Complete!",
          description: "Your profile has been successfully created. Welcome to ReintegrateMe!",
        });
        navigate('/seeker-dashboard');
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save profile. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Profile completion error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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
    <div className="mobile-container gradient-bg-primary min-h-screen">
      <div className="min-h-screen flex flex-col p-4 sm:p-6 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full animate-float animate-delay-100" />
        <div className="absolute bottom-20 left-10 w-16 h-16 bg-white/5 rounded-full animate-float animate-delay-300" />
        <div className="absolute top-1/2 right-5 w-12 h-12 bg-white/10 rounded-full animate-float animate-delay-500" />

        {/* Header */}
        <div className="flex items-center mb-6 sm:mb-8 animate-slide-up-stagger relative z-10">
          <AnimatedButton 
            variant="ghost" 
            size="sm" 
            onClick={handleBack} 
            className="mr-3 text-white hover:bg-white/20 backdrop-blur-md rounded-lg border border-white/20 px-3 py-2"
            ripple={false}
          >
            Back
          </AnimatedButton>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-black font-geist animate-fade-in-scale">
              Work Preferences
            </h1>
            <p className="text-black text-base sm:text-lg font-geist mt-1 animate-fade-in-scale animate-delay-100 font-medium">
              Final step - let's understand your preferences - Step 4 of 4 ✨
            </p>
          </div>
          <div className="ml-4">
            <img 
              src={getLogoUrl()} 
              alt="ReintegrateMe"
              className="h-10 w-10 sm:h-12 sm:w-12 animate-float drop-shadow-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 sm:mb-8 animate-slide-up-stagger animate-delay-200 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-geist text-black font-medium">Profile Completion</span>
            <span className="text-sm font-bold text-black font-geist">100%</span>
          </div>
          <AnimatedProgress value={100} animate={true} />
        </div>

        <form onSubmit={handleComplete} className="flex-1 space-y-4 sm:space-y-6 relative z-10">
          {/* Driving Licence */}
          <AnimatedCard
            title="Driving Licence"
            delay={100}
            className="glassmorphism-strong"
          >
            <div className="space-y-3">
              <Label className="text-slate-800 font-geist font-medium text-sm">Do you have a driving licence?</Label>
              <RadioGroup 
                value={seekerProfile.hasDrivingLicence?.toString() || ''} 
                onValueChange={(value) => handleBooleanChange('hasDrivingLicence', value)}
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-300">
                  <RadioGroupItem 
                    value="true" 
                    id="licence-yes"
                    className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
                  />
                  <Label htmlFor="licence-yes" className="text-slate-800 font-geist cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-300">
                  <RadioGroupItem 
                    value="false" 
                    id="licence-no"
                    className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
                  />
                  <Label htmlFor="licence-no" className="text-slate-800 font-geist cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>
          </AnimatedCard>

          {/* Work Preferences */}
          <AnimatedCard
            title="Work Preferences"
            description="Select all that apply"
            delay={200}
            className="glassmorphism-strong"
          >
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {workPreferenceOptions.map(option => (
                <div key={option} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300">
                  <Checkbox
                    id={`work-pref-${option}`}
                    checked={seekerProfile.workPreferences?.includes(option) || false}
                    onCheckedChange={(checked) => 
                      handleWorkPreferenceChange(option, checked as boolean)
                    }
                    className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <Label htmlFor={`work-pref-${option}`} className="text-sm text-slate-800 font-geist cursor-pointer">
                    {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </AnimatedCard>

          {/* Relocation */}
          <AnimatedCard
            title="Relocation"
            delay={300}
            className="glassmorphism-strong"
          >
            <div className="space-y-3">
              <Label className="text-slate-800 font-geist font-medium text-sm">Open to relocation?</Label>
              <RadioGroup 
                value={seekerProfile.openToRelocation?.toString() || ''} 
                onValueChange={(value) => handleBooleanChange('openToRelocation', value)}
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-300">
                  <RadioGroupItem 
                    value="true" 
                    id="relocation-yes"
                    className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
                  />
                  <Label htmlFor="relocation-yes" className="text-slate-800 font-geist cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-300">
                  <RadioGroupItem 
                    value="false" 
                    id="relocation-no"
                    className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
                  />
                  <Label htmlFor="relocation-no" className="text-slate-800 font-geist cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>
          </AnimatedCard>

          {/* Navigation buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 animate-slide-up-stagger animate-delay-400">
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
              disabled={isLoading}
              className="w-full sm:flex-2 py-4 sm:py-6 text-base sm:text-lg font-bold rounded-2xl
                bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500
                hover:from-blue-600 hover:via-purple-600 hover:to-orange-600
                text-white shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]
                transition-all duration-500 font-geist disabled:opacity-50 min-h-[44px]"
              ripple={true}
              glow={true}
            >
              {isLoading ? 'Creating Profile...' : 'Complete Profile'}
            </AnimatedButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeekerProfileSetupStep4;
