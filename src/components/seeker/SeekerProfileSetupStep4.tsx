
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle, Sparkles, Trophy, Rocket } from 'lucide-react';
import { seekerAPI } from '../../services/api';
import { toast } from '@/hooks/use-toast';
import { WorkPreferenceType } from '../../models/types';
import { profileSetupManager } from '../../utils/profileSetupManager';
import { calculateProfileCompletion } from '../../utils/profileCompletionCalculator';
import AnimatedCard from '../ui/animated-card';
import AnimatedButton from '../ui/animated-button';
import AnimatedCheckbox from '../ui/animated-checkbox';
import AnimatedProgress from '../ui/animated-progress';
import { getLogoUrl } from '../../utils/logoUpload';

const SeekerProfileSetupStep4 = () => {
  const navigate = useNavigate();
  const [hasDrivingLicence, setHasDrivingLicence] = useState<boolean | null>(null);
  const [workPreferences, setWorkPreferences] = useState<WorkPreferenceType[]>([]);
  const [openToRelocation, setOpenToRelocation] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(75);

  const workPreferenceOptions: { value: WorkPreferenceType; label: string; icon: string }[] = [
    { value: 'full_time', label: 'Full-time (35+ hours/week)', icon: '💼' },
    { value: 'part_time', label: 'Part-time (16-34 hours/week)', icon: '⏰' },
    { value: 'zero_hours', label: 'Zero hours contract', icon: '🔄' },
    { value: 'weekends', label: 'Weekend work', icon: '📅' },
    { value: 'nights', label: 'Night shifts', icon: '🌙' }
  ];

  useEffect(() => {
    // Load saved data
    const savedData = profileSetupManager.getAllData();
    if (savedData.hasDrivingLicence !== undefined) setHasDrivingLicence(savedData.hasDrivingLicence);
    if (savedData.workPreferences && Array.isArray(savedData.workPreferences)) {
      // Ensure the saved data is properly typed
      const validPreferences = savedData.workPreferences.filter((pref): pref is WorkPreferenceType => 
        typeof pref === 'string' && ['full_time', 'part_time', 'zero_hours', 'weekends', 'nights'].includes(pref)
      );
      setWorkPreferences(validPreferences);
    }
    if (savedData.openToRelocation !== undefined) setOpenToRelocation(savedData.openToRelocation);
    
    // Calculate completion percentage
    const completion = calculateProfileCompletion();
    setCompletionPercentage(completion);
  }, []);

  useEffect(() => {
    // Update completion percentage when fields change
    const completion = Math.min(75 + (
      (hasDrivingLicence !== null ? 8 : 0) +
      (workPreferences.length > 0 ? 9 : 0) +
      (openToRelocation !== null ? 8 : 0)
    ), 100);
    setCompletionPercentage(completion);
  }, [hasDrivingLicence, workPreferences, openToRelocation]);

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
      
      // Get all the setup data from previous steps
      const allSetupData = profileSetupManager.getAllData();
      
      // Validate required fields
      const validation = profileSetupManager.validateRequiredFields();
      if (!validation.isValid) {
        toast({
          title: "Missing Information",
          description: `Please complete: ${validation.missingFields.join(', ')}`,
          variant: "destructive"
        });
        return;
      }
      
      // Add current step data
      const finalData = {
        ...allSetupData,
        hasDrivingLicence,
        workPreferences,
        openToRelocation
      };
      
      console.log('Completing profile setup with data:', finalData);
      
      // Complete the profile setup with all collected data
      await seekerAPI.completeProfileSetup(finalData);
      
      // Clear the setup data since profile is now complete
      profileSetupManager.clearData();

      // Show celebration animation
      setShowCelebration(true);
      setCompletionPercentage(100);

      toast({
        title: "Profile completed! 🎉",
        description: "Your profile has been successfully created. Welcome to ReintegrateMe!",
      });

      // Navigate after celebration
      setTimeout(() => {
        navigate('/seeker-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Profile completion error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    // Save current step data before going back
    profileSetupManager.saveStepData(4, {
      hasDrivingLicence,
      workPreferences,
      openToRelocation
    });
    navigate('/seeker-setup-step3');
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
              Work Preferences
            </h1>
            <p className="text-white/80 font-geist mt-1 animate-fade-in-scale animate-delay-100">
              Final step - Step 4 of 4 ✨
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

        {/* Progress bar with celebration */}
        <div className="mb-8 animate-slide-up-stagger animate-delay-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-geist text-white/80">Profile Completion</span>
            <span className="text-sm font-bold text-white font-geist">
              {completionPercentage}%
            </span>
          </div>
          <AnimatedProgress 
            value={completionPercentage} 
            className={showCelebration ? "animate-celebration" : ""}
            animate={true}
          />
          {completionPercentage === 100 && (
            <div className="flex items-center justify-center mt-2 text-white animate-bounce-once">
              <Trophy className="h-4 w-4 mr-1" />
              <span className="text-xs font-geist">Complete!</span>
            </div>
          )}
        </div>

        {/* Content cards with staggered animations */}
        <div className="flex-1 space-y-6">
          <AnimatedCard 
            title="Driving Licence"
            description="Do you have a valid UK driving licence?"
            delay={100}
            className="glassmorphism-strong"
          >
            <RadioGroup 
              value={hasDrivingLicence?.toString() || ''} 
              onValueChange={(value) => setHasDrivingLicence(value === 'true')}
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                <RadioGroupItem 
                  value="true" 
                  id="licence-yes"
                  className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
                />
                <Label htmlFor="licence-yes" className="text-white font-geist cursor-pointer flex-1">
                  🚗 Yes, I have a valid UK driving licence
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                <RadioGroupItem 
                  value="false" 
                  id="licence-no"
                  className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
                />
                <Label htmlFor="licence-no" className="text-white font-geist cursor-pointer flex-1">
                  🚶 No, I don't have a driving licence
                </Label>
              </div>
            </RadioGroup>
          </AnimatedCard>

          <AnimatedCard 
            title="Work Preferences"
            description="What type of work arrangements suit you? (Select all that apply)"
            delay={200}
            className="glassmorphism-strong"
          >
            <div className="space-y-3">
              {workPreferenceOptions.map((option, index) => (
                <AnimatedCheckbox
                  key={option.value}
                  id={option.value}
                  checked={workPreferences.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleWorkPreferenceChange(option.value, checked as boolean)
                  }
                  label={`${option.icon} ${option.label}`}
                  className="p-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-white"
                  delay={300 + index * 100}
                />
              ))}
            </div>
          </AnimatedCard>

          <AnimatedCard 
            title="Relocation"
            description="Are you open to relocating for the right opportunity?"
            delay={300}
            className="glassmorphism-strong"
          >
            <RadioGroup 
              value={openToRelocation?.toString() || ''} 
              onValueChange={(value) => setOpenToRelocation(value === 'true')}
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                <RadioGroupItem 
                  value="true" 
                  id="relocation-yes"
                  className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
                />
                <Label htmlFor="relocation-yes" className="text-white font-geist cursor-pointer flex-1">
                  ✈️ Yes, I'm open to relocating for work
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                <RadioGroupItem 
                  value="false" 
                  id="relocation-no"
                  className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
                />
                <Label htmlFor="relocation-no" className="text-white font-geist cursor-pointer flex-1">
                  🏠 No, I prefer to work locally
                </Label>
              </div>
            </RadioGroup>
          </AnimatedCard>

          {/* Success preview card */}
          <AnimatedCard 
            delay={400}
            className="glassmorphism border-2 border-emerald-400/30 bg-gradient-to-r from-emerald-50/80 to-green-50/80"
          >
            <div className="flex items-start space-x-4">
              <div className="relative">
                <CheckCircle className="h-8 w-8 text-emerald-600 animate-bounce-once" />
                <div className="absolute inset-0 bg-emerald-400 rounded-full opacity-20 animate-ping" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-emerald-800 font-geist mb-2 flex items-center">
                  Almost there! 
                  <Sparkles className="h-5 w-5 ml-2 text-emerald-600 animate-pulse" />
                </h3>
                <p className="text-emerald-700 font-geist leading-relaxed">
                  Complete your profile to start connecting with employers who value what you bring to the table. 
                  Your journey to meaningful employment starts here! 🚀
                </p>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Enhanced completion button */}
        <div className="mt-8 animate-slide-up-stagger animate-delay-500">
          <AnimatedButton 
            onClick={handleComplete} 
            disabled={isLoading}
            className={`
              w-full py-6 text-lg font-bold rounded-2xl
              bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500
              hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600
              text-white shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]
              transition-all duration-500 font-geist
              ${showCelebration ? 'animate-celebration celebration-confetti' : ''}
              ${completionPercentage === 100 ? 'animate-glow-pulse' : ''}
            `}
            ripple={true}
            glow={true}
            pulse={completionPercentage === 100}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                Creating Your Profile...
              </div>
            ) : showCelebration ? (
              <div className="flex items-center justify-center">
                <Trophy className="mr-3 h-6 w-6 animate-bounce" />
                Profile Complete! 🎉
              </div>
            ) : (
              <div className="flex items-center justify-center">
                Complete Profile & Start Matching
                <Rocket className="ml-3 h-6 w-6 animate-pulse" />
              </div>
            )}
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfileSetupStep4;
