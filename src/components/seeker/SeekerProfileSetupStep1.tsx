
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { profileSetupManager } from '../../utils/profileSetupManager';
import AnimatedCard from '../ui/animated-card';
import AnimatedButton from '../ui/animated-button';
import AnimatedProgress from '../ui/animated-progress';
import { getLogoUrl } from '../../utils/logoUpload';

const SeekerProfileSetupStep1 = () => {
  const navigate = useNavigate();
  const [seekerProfile, setSeekerProfile] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    headline: ''
  });

  useEffect(() => {
    // Load existing data from setup manager
    const savedData = profileSetupManager.getAllData();
    setSeekerProfile(prev => ({
      firstName: savedData.firstName || '',
      lastName: savedData.lastName || '',
      jobTitle: savedData.jobTitle || '',
      headline: savedData.headline || ''
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSeekerProfile(prev => {
      const updated = { ...prev, [name]: value };
      // Save to profile manager on every change
      profileSetupManager.saveStepData(1, updated);
      return updated;
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!seekerProfile.firstName || !seekerProfile.lastName) {
      toast({
        title: "Error",
        description: "First name and last name are required",
        variant: "destructive"
      });
      return;
    }
    
    // Save the data using profile manager
    profileSetupManager.saveStepData(1, seekerProfile);
    
    toast({
      title: "Information Saved",
      description: "Your personal information has been saved successfully.",
    });
    
    navigate('/seeker-setup-step2');
  };

  const handleBack = () => {
    navigate('/role-selection');
  };

  return (
    <div className="mobile-container gradient-bg-primary min-h-screen">
      <div className="min-h-screen flex flex-col p-6 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full animate-float animate-delay-100" />
        <div className="absolute bottom-20 left-10 w-16 h-16 bg-white/5 rounded-full animate-float animate-delay-300" />
        <div className="absolute top-1/2 right-5 w-12 h-12 bg-white/10 rounded-full animate-float animate-delay-500" />

        {/* Header with better text visibility */}
        <div className="flex items-center mb-8 animate-slide-up-stagger relative z-10">
          <AnimatedButton 
            variant="ghost" 
            size="icon" 
            onClick={handleBack} 
            className="mr-3 text-white hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20"
            ripple={false}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </AnimatedButton>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white font-geist animate-fade-in-scale text-shadow-lg">
              Tell us about yourself
            </h1>
            <p className="text-white text-lg font-geist mt-1 animate-fade-in-scale animate-delay-100 text-shadow-md font-medium">
              Let employers know who you are - Step 1 of 4 ✨
            </p>
          </div>
          <div className="ml-4">
            <img 
              src={getLogoUrl()} 
              alt="ReintegrateMe"
              className="h-12 w-12 animate-float drop-shadow-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Progress bar with better visibility */}
        <div className="mb-8 animate-slide-up-stagger animate-delay-200 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-geist text-white font-medium text-shadow-sm">Profile Completion</span>
            <span className="text-sm font-bold text-white font-geist text-shadow-sm">25%</span>
          </div>
          <AnimatedProgress value={25} animate={true} />
        </div>

        {/* Content cards with staggered animations */}
        <form onSubmit={handleNext} className="flex-1 space-y-6 relative z-10">
          <AnimatedCard
            title="Personal Information"
            description="Your basic details for employers"
            delay={100}
            className="glassmorphism-strong"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-slate-800 font-geist font-medium text-sm">First Name *</label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={seekerProfile.firstName}
                  onChange={handleChange}
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-blue-400 focus:ring-blue-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-slate-800 font-geist font-medium text-sm">Last Name *</label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={seekerProfile.lastName}
                  onChange={handleChange}
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-blue-400 focus:ring-blue-400"
                  required
                />
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard
            title="Professional Details"
            description="Help employers understand your career goals"
            delay={200}
            className="glassmorphism-strong"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="jobTitle" className="text-slate-800 font-geist font-medium text-sm">Job Title</label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="e.g., Warehouse Assistant"
                  value={seekerProfile.jobTitle}
                  onChange={handleChange}
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-blue-400 focus:ring-blue-400"
                />
                <p className="text-xs text-slate-600">The type of role you're seeking</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="headline" className="text-slate-800 font-geist font-medium text-sm">Professional Headline</label>
                <Input
                  id="headline"
                  name="headline"
                  placeholder="e.g., Reliable team player seeking new opportunities"
                  value={seekerProfile.headline}
                  onChange={handleChange}
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-blue-400 focus:ring-blue-400"
                />
                <p className="text-xs text-slate-600">A short summary of your professional identity</p>
              </div>
            </div>
          </AnimatedCard>

          <div className="mt-8 animate-slide-up-stagger animate-delay-400">
            <AnimatedButton
              type="submit"
              className="w-full py-6 text-lg font-bold rounded-2xl
                bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500
                hover:from-blue-600 hover:via-purple-600 hover:to-orange-600
                text-white shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]
                transition-all duration-500 font-geist"
              ripple={true}
              glow={true}
            >
              Next: Legal Information
              <ArrowRight className="ml-3 h-6 w-6" />
            </AnimatedButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeekerProfileSetupStep1;
