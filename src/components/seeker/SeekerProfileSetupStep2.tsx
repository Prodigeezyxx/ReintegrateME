import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';
import { profileSetupManager } from '../../utils/profileSetupManager';
import AnimatedCard from '../ui/animated-card';
import AnimatedButton from '../ui/animated-button';
import AnimatedProgress from '../ui/animated-progress';
import { getLogoUrl } from '../../utils/logoUpload';

const convictionStatusOptions = [
  { value: 'spent', label: 'Spent (under Rehabilitation of Offenders Act 1974)' },
  { value: 'unspent', label: 'Unspent' },
  { value: 'pending', label: 'Pending' }
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

        {/* Header with black text */}
        <div className="flex items-centre mb-6 sm:mb-8 animate-slide-up-stagger">
          <AnimatedButton 
            variant="ghost" 
            size="icon" 
            onClick={handleBack} 
            className="mr-3 text-white hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 min-h-[44px]"
            ripple={false}
          >
            Back
          </AnimatedButton>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-black font-geist animate-fade-in-scale">
              Legal Information
            </h1>
            <p className="text-black text-base sm:text-lg font-geist mt-1 animate-fade-in-scale animate-delay-100 font-medium">
              This helps us match you with suitable opportunities - Step 2 of 4
            </p>
          </div>
          <div className="ml-4">
            <img 
              src={getLogoUrl()} 
              alt="ReintegrateMe"
              className="h-10 w-10 sm:h-12 sm:w-12 animate-float"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Progress bar with black text */}
        <div className="mb-6 sm:mb-8 animate-slide-up-stagger animate-delay-200">
          <div className="flex items-centre justify-between mb-3">
            <span className="text-sm font-geist text-black font-medium">Profile Completion</span>
            <span className="text-sm font-bold text-black font-geist">50%</span>
          </div>
          <AnimatedProgress value={50} animate={true} />
        </div>

        <form onSubmit={handleNext} className="flex-1 space-y-4 sm:space-y-6">
          {/* GDPR Statement for Criminal Convictions */}
          <AnimatedCard
            delay={50}
            className="glassmorphism border-2 border-blue-400/30 bg-gradient-to-r from-blue-50/90 to-blue-100/90"
          >
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  Criminal Convictions Disclosure (GDPR Statement)
                </h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <div>
                    <h4 className="font-medium mb-1">Why we ask for this:</h4>
                    <p>
                      We ask about criminal convictions to connect you with employers and opportunities that are open to people with previous convictions. This helps us to avoid unsuitable referrals and advocate on your behalf where needed.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">How we handle this:</h4>
                    <p>
                      This information is classified as criminal offence data under the UK GDPR. It will only be accessed by authorised staff and will be used strictly to provide relevant support and opportunities. We will not share this data with any third party without your permission unless legally required.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>

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
                <div className="flex items-centre space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-300">
                  <RadioGroupItem 
                    value="true" 
                    id="sentence-yes"
                    className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
                  />
                  <Label htmlFor="sentence-yes" className="text-slate-800 font-geist cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-centre space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-300">
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

          {/* Conviction Status */}
          <AnimatedCard
            title="Conviction Status"
            delay={200}
            className="glassmorphism-strong"
          >
            <RadioGroup 
              value={seekerProfile.convictionStatus || ''} 
              onValueChange={(value) => {
                setSeekerProfile(prev => ({ ...prev, convictionStatus: value }));
                profileSetupManager.saveStepData(2, { convictionStatus: value });
              }}
            >
              {convictionStatusOptions.map(option => (
                <div key={option.value} className="flex items-centre space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-300">
                  <RadioGroupItem 
                    value={option.value} 
                    id={`conviction-status-${option.value}`}
                    className="border-2 border-blue-400 text-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
                  />
                  <Label htmlFor={`conviction-status-${option.value}`} className="text-slate-800 font-geist cursor-pointer">{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </AnimatedCard>

          {/* Safeguarding Questions */}
          <AnimatedCard
            title="Safeguarding Information"
            delay={250}
            className="glassmorphism-strong"
          >
            <div className="space-y-6">
              {/* Barred from regulated work */}
              <div>
                <Label className="text-slate-800 font-geist font-medium text-sm mb-3 block">
                  Barred from regulated work with children or vulnerable adults
                </Label>
                <RadioGroup 
                  value={seekerProfile.barredFromRegulatedWork === undefined ? 'unknown' : seekerProfile.barredFromRegulatedWork.toString()} 
                  onValueChange={(value) => handleBooleanChange('barredFromRegulatedWork', value)}
                >
                  <div className="flex items-centre space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300">
                    <RadioGroupItem value="true" id="barred-yes" className="border-2 border-blue-400 text-blue-600" />
                    <Label htmlFor="barred-yes" className="text-slate-800 font-geist cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-centre space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300">
                    <RadioGroupItem value="false" id="barred-no" className="border-2 border-blue-400 text-blue-600" />
                    <Label htmlFor="barred-no" className="text-slate-800 font-geist cursor-pointer">No</Label>
                  </div>
                  <div className="flex items-centre space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300">
                    <RadioGroupItem value="unknown" id="barred-unknown" className="border-2 border-blue-400 text-blue-600" />
                    <Label htmlFor="barred-unknown" className="text-slate-800 font-geist cursor-pointer">Unknown</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* DBS Barring List */}
              <div>
                <Label className="text-slate-800 font-geist font-medium text-sm mb-3 block">
                  Subject to DBS Barring List
                </Label>
                <RadioGroup 
                  value={seekerProfile.onDbsBarringList === undefined ? 'unknown' : seekerProfile.onDbsBarringList.toString()} 
                  onValueChange={(value) => handleBooleanChange('onDbsBarringList', value)}
                >
                  <div className="flex items-centre space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300">
                    <RadioGroupItem value="true" id="dbs-yes" className="border-2 border-blue-400 text-blue-600" />
                    <Label htmlFor="dbs-yes" className="text-slate-800 font-geist cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-centre space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300">
                    <RadioGroupItem value="false" id="dbs-no" className="border-2 border-blue-400 text-blue-600" />
                    <Label htmlFor="dbs-no" className="text-slate-800 font-geist cursor-pointer">No</Label>
                  </div>
                  <div className="flex items-centre space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300">
                    <RadioGroupItem value="unknown" id="dbs-unknown" className="border-2 border-blue-400 text-blue-600" />
                    <Label htmlFor="dbs-unknown" className="text-slate-800 font-geist cursor-pointer">Unknown</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* MAPPA Level */}
              <div>
                <Label className="text-slate-800 font-geist font-medium text-sm mb-3 block">
                  MAPPA Level
                </Label>
                <RadioGroup 
                  value={seekerProfile.mappaLevel || ''} 
                  onValueChange={(value) => {
                    setSeekerProfile(prev => ({ ...prev, mappaLevel: value }));
                    profileSetupManager.saveStepData(2, { mappaLevel: value });
                  }}
                >
                  {['level_1', 'level_2', 'level_3', 'not_applicable'].map((level) => (
                    <div key={level} className="flex items-centre space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300">
                      <RadioGroupItem value={level} id={`mappa-${level}`} className="border-2 border-blue-400 text-blue-600" />
                      <Label htmlFor={`mappa-${level}`} className="text-slate-800 font-geist cursor-pointer">
                        {level === 'not_applicable' ? 'N/A' : `Level ${level.split('_')[1]}`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Relevant for safeguarding checks */}
              <div>
                <Label className="text-slate-800 font-geist font-medium text-sm mb-3 block">
                  Relevant for safeguarding checks
                </Label>
                <RadioGroup 
                  value={seekerProfile.relevantForSafeguardingChecks === undefined ? 'unknown' : seekerProfile.relevantForSafeguardingChecks.toString()} 
                  onValueChange={(value) => handleBooleanChange('relevantForSafeguardingChecks', value)}
                >
                  <div className="flex items-centre space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300">
                    <RadioGroupItem value="true" id="safeguarding-yes" className="border-2 border-blue-400 text-blue-600" />
                    <Label htmlFor="safeguarding-yes" className="text-slate-800 font-geist cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-centre space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300">
                    <RadioGroupItem value="false" id="safeguarding-no" className="border-2 border-blue-400 text-blue-600" />
                    <Label htmlFor="safeguarding-no" className="text-slate-800 font-geist cursor-pointer">No</Label>
                  </div>
                  <div className="flex items-centre space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300">
                    <RadioGroupItem value="unknown" id="safeguarding-unknown" className="border-2 border-blue-400 text-blue-600" />
                    <Label htmlFor="safeguarding-unknown" className="text-slate-800 font-geist cursor-pointer">Unknown</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
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
                <div key={option.value} className="flex items-centre space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-all duration-300">
                  <Checkbox
                    id={`conviction-${option.value}`}
                    checked={seekerProfile.convictionTypes?.includes(option.value) || false}
                    onCheckedChange={(checked) => 
                      handleConvictionTypeChange(option.value, checked as boolean)
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
                  onChange={(e) => {
                    setSeekerProfile(prev => ({ ...prev, convictionOtherDetails: e.target.value }));
                    profileSetupManager.saveStepData(2, { convictionOtherDetails: e.target.value });
                  }}
                  className="mt-2 bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-blue-400"
                  placeholder="Please provide details..."
                />
              </div>
            )}
          </AnimatedCard>

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
