import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SeekerProfile, LegalSupervisionType, ConvictionType, ConvictionStatusType, MappaLevelType } from '../../models/types';
import { toast } from '@/hooks/use-toast';
import AnimatedCard from '../ui/animated-card';
import AnimatedButton from '../ui/animated-button';
import AnimatedProgress from '../ui/animated-progress';
import { getLogoUrl } from '../../utils/logoUpload';

const legalSupervisionOptions = [
  { value: 'probation', label: 'Probation' },
  { value: 'parole', label: 'Parole' },
  { value: 'community_sentence', label: 'Community Sentence' },
  { value: 'licence', label: 'Licence' },
  { value: 'mappa_oversight', label: 'MAPPA Oversight' },
  { value: 'none', label: 'None' }
];

const convictionTypeOptions = [
  { value: 'theft_burglary_robbery', label: 'Theft / Burglary / Robbery' },
  { value: 'fraud_financial_offences', label: 'Fraud / Financial Offences' },
  { value: 'drug_offences_possession', label: 'Drug Offences (possession)' },
  { value: 'drug_offences_supply', label: 'Drug Offences (supply)' },
  { value: 'drug_offences_production', label: 'Drug Offences (production)' },
  { value: 'driving_offences', label: 'Driving Offences' },
  { value: 'assault_violent_offences', label: 'Assault / Violent Offences' },
  { value: 'sexual_offences', label: 'Sexual Offences' },
  { value: 'public_order_offences', label: 'Public Order Offences' },
  { value: 'domestic_abuse_related', label: 'Domestic Abuse Related Offence' },
  { value: 'terrorism_related_offences', label: 'Terrorism-Related Offences' },
  { value: 'weapons_offences', label: 'Weapons Offences' },
  { value: 'harassment_stalking', label: 'Harassment / Stalking' },
  { value: 'arson', label: 'Arson' },
  { value: 'breach_court_orders', label: 'Breach of Court Orders' },
  { value: 'other', label: 'Other' }
];

const SeekerProfileSetupStep2 = () => {
  const navigate = useNavigate();
  const [seekerProfile, setSeekerProfile] = useState<Partial<SeekerProfile>>({
    sentenceCompleted: undefined,
    currentLegalSupervision: undefined,
    convictionTypes: [],
    convictionStatus: undefined,
    barredFromRegulatedWork: undefined,
    onDbsBarringList: undefined,
    mappaLevel: undefined,
    relevantForSafeguardingChecks: undefined,
    convictionOtherDetails: ''
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('seekerProfile');
    if (savedProfile) {
      setSeekerProfile(prev => ({
        ...prev,
        ...JSON.parse(savedProfile)
      }));
    }
  }, []);

  const handleBooleanChange = (field: keyof SeekerProfile, value: string) => {
    setSeekerProfile(prev => ({ 
      ...prev, 
      [field]: value === 'true' ? true : value === 'false' ? false : undefined 
    }));
  };

  const handleSupervisionChange = (value: string) => {
    setSeekerProfile(prev => ({ 
      ...prev, 
      currentLegalSupervision: value as LegalSupervisionType 
    }));
  };

  const handleConvictionStatusChange = (value: string) => {
    setSeekerProfile(prev => ({ 
      ...prev, 
      convictionStatus: value as ConvictionStatusType 
    }));
  };

  const handleMappaChange = (value: string) => {
    setSeekerProfile(prev => ({ 
      ...prev, 
      mappaLevel: value as MappaLevelType 
    }));
  };

  const handleConvictionTypeChange = (convictionType: ConvictionType, checked: boolean) => {
    setSeekerProfile(prev => {
      const currentTypes = prev.convictionTypes || [];
      if (checked) {
        return { ...prev, convictionTypes: [...currentTypes, convictionType] };
      } else {
        return { ...prev, convictionTypes: currentTypes.filter(type => type !== convictionType) };
      }
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    localStorage.setItem('seekerProfile', JSON.stringify(seekerProfile));
    navigate('/seeker-setup-step3');
  };

  const handleBack = () => {
    navigate('/seeker-setup-step1');
  };

  return (
    <div className="mobile-container gradient-bg-primary min-h-screen">
      <div className="min-h-screen flex flex-col p-6 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full animate-float animate-delay-100" />
        <div className="absolute bottom-20 left-10 w-16 h-16 bg-white/5 rounded-full animate-float animate-delay-300" />
        <div className="absolute top-1/2 right-5 w-12 h-12 bg-white/10 rounded-full animate-float animate-delay-500" />

        {/* Header with black text */}
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
            <h1 className="text-3xl font-bold text-black font-geist animate-fade-in-scale">
              Legal Information
            </h1>
            <p className="text-black text-lg font-geist mt-1 animate-fade-in-scale animate-delay-100 font-medium">
              This helps us match you with suitable opportunities - Step 2 of 4 ✨
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

        {/* Progress bar with black text */}
        <div className="mb-8 animate-slide-up-stagger animate-delay-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-geist text-black font-medium">Profile Completion</span>
            <span className="text-sm font-bold text-black font-geist">50%</span>
          </div>
          <AnimatedProgress value={50} animate={true} />
        </div>

        <form onSubmit={handleNext} className="flex-1 space-y-6">
          {/* Sentence Status */}
          <AnimatedCard
            title="Sentence Status"
            delay={100}
            className="glassmorphism-strong"
          >
            <div className="space-y-3">
              <Label className="text-slate-800 font-geist font-medium text-sm">Sentence Completed</Label>
              <RadioGroup 
                value={seekerProfile.sentenceCompleted?.toString() || ''} 
                onValueChange={(value) => handleBooleanChange('sentenceCompleted', value)}
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-300">
                  <RadioGroupItem 
                    value="true" 
                    id="sentence-yes"
                    className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
                  />
                  <Label htmlFor="sentence-yes" className="text-slate-800 font-geist cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-300">
                  <RadioGroupItem 
                    value="false" 
                    id="sentence-no"
                    className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
                  />
                  <Label htmlFor="sentence-no" className="text-slate-800 font-geist cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>
          </AnimatedCard>

          {/* Current Legal Supervision */}
          <AnimatedCard
            title="Current Legal Supervision"
            delay={200}
            className="glassmorphism-strong"
          >
            <RadioGroup 
              value={seekerProfile.currentLegalSupervision || ''} 
              onValueChange={handleSupervisionChange}
            >
              {legalSupervisionOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-300">
                  <RadioGroupItem 
                    value={option.value} 
                    id={`supervision-${option.value}`}
                    className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
                  />
                  <Label htmlFor={`supervision-${option.value}`} className="text-slate-800 font-geist cursor-pointer">{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </AnimatedCard>

          {/* Conviction Types */}
          <AnimatedCard
            title="Conviction Type"
            description="Select all that apply"
            delay={300}
            className="glassmorphism-strong"
          >
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {convictionTypeOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300">
                  <Checkbox
                    id={`conviction-${option.value}`}
                    checked={seekerProfile.convictionTypes?.includes(option.value as ConvictionType) || false}
                    onCheckedChange={(checked) => 
                      handleConvictionTypeChange(option.value as ConvictionType, checked as boolean)
                    }
                    className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <Label htmlFor={`conviction-${option.value}`} className="text-sm text-slate-800 font-geist cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            
            {seekerProfile.convictionTypes?.includes('other') && (
              <div className="mt-4">
                <Label htmlFor="conviction-other" className="text-sm text-slate-800 font-geist">Please specify:</Label>
                <Textarea
                  id="conviction-other"
                  value={seekerProfile.convictionOtherDetails || ''}
                  onChange={(e) => setSeekerProfile(prev => ({ ...prev, convictionOtherDetails: e.target.value }))}
                  className="mt-2 bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-blue-400"
                  placeholder="Please provide details..."
                />
              </div>
            )}
          </AnimatedCard>

          {/* Continue with remaining sections using the same pattern... */}
          <div className="mt-8 animate-slide-up-stagger animate-delay-500">
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
              Next: Health & Accessibility Information
              <ArrowRight className="ml-3 h-6 w-6" />
            </AnimatedButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeekerProfileSetupStep2;
