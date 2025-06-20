
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { profileSetupManager } from '../../utils/profileSetupManager';
import AnimatedCard from '../ui/animated-card';
import AnimatedButton from '../ui/animated-button';
import AnimatedProgress from '../ui/animated-progress';
import { getLogoUrl } from '../../utils/logoUpload';
import SkillsManager from './SkillsManager';

const SeekerSkillsStep = () => {
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [jobCategories] = useState<string[]>([
    'Construction', 
    'Manufacturing',
    'Transportation',
    'Retail',
    'Hospitality',
    'Healthcare',
    'Service Industry',
    'Maintenance',
    'Logistics',
    'Agriculture'
  ]);

  useEffect(() => {
    // Load existing data from setup manager
    const savedData = profileSetupManager.getAllData();
    setSelectedSkills(savedData.keySkills || []);
  }, []);

  const handleSkillsChange = (skills: string[]) => {
    setSelectedSkills(skills);
    // Save to profile manager on every change
    profileSetupManager.saveStepData(1, { keySkills: skills });
  };

  const handleNext = () => {
    // Save the skills data
    profileSetupManager.saveStepData(1, { keySkills: selectedSkills });
    
    toast({
      title: "Skills Saved",
      description: `${selectedSkills.length} skills have been added to your profile.`,
    });
    
    navigate('/seeker-setup-step2');
  };

  const handleBack = () => {
    navigate('/seeker-setup-step1');
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
            size="icon" 
            onClick={handleBack} 
            className="mr-3 text-white hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20"
            ripple={false}
          >
            <ArrowLeft className="h-6 w-6" />
          </AnimatedButton>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-black font-geist animate-fade-in-scale">
              Your Skills & Experience
            </h1>
            <p className="text-black text-base sm:text-lg font-geist mt-1 animate-fade-in-scale animate-delay-100 font-medium">
              Let employers know what you can do - Step 1.5 of 4 ✨
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
            <span className="text-sm font-bold text-black font-geist">35%</span>
          </div>
          <AnimatedProgress value={35} animate={true} />
        </div>

        {/* Skills content */}
        <div className="flex-1 relative z-10">
          <AnimatedCard
            title="Skills & Abilities"
            description="Add your skills to help employers find you for the right opportunities"
            delay={100}
            className="glassmorphism-strong h-full"
          >
            <div className="space-y-4 h-full">
              <div className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p><strong>💡 Tip:</strong> Include both technical skills (like driving, construction work) and personal strengths (like teamwork, reliability). Employers value both!</p>
              </div>
              
              <SkillsManager
                skills={selectedSkills}
                onSkillsChange={handleSkillsChange}
                isEditing={true}
                jobCategories={jobCategories}
              />
              
              {selectedSkills.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Great!</strong> You've added {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} to your profile. You can always add more later.
                  </p>
                </div>
              )}
            </div>
          </AnimatedCard>
        </div>

        {/* Navigation buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 animate-slide-up-stagger animate-delay-400 relative z-10">
          <AnimatedButton
            variant="outline"
            onClick={handleBack}
            className="w-full sm:flex-1 py-4 sm:py-6 text-base sm:text-lg font-bold rounded-2xl
              bg-white/90 hover:bg-white border-2 border-slate-200
              text-slate-700 hover:text-slate-900 font-geist"
            ripple={true}
          >
            Back
          </AnimatedButton>
          
          <AnimatedButton
            onClick={handleNext}
            className="w-full sm:flex-2 py-4 sm:py-6 text-base sm:text-lg font-bold rounded-2xl
              bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500
              hover:from-blue-600 hover:via-purple-600 hover:to-orange-600
              text-white shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]
              transition-all duration-500 font-geist"
            ripple={true}
            glow={true}
          >
            Next: Legal Information
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};

export default SeekerSkillsStep;
