
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SeekerProfile, LegalSupervisionType, ConvictionType, ConvictionStatusType, MappaLevelType } from '../../models/types';
import { toast } from '@/hooks/use-toast';

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

  return (
    <div className="mobile-container p-6">
      <div className="flex flex-col min-h-screen">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-500 self-start mb-6"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h1 className="text-2xl font-bold mb-2">Legal Information</h1>
        <p className="text-gray-600 mb-6">This information helps us match you with suitable opportunities</p>
        
        <div className="progress-bar mb-8">
          <div className="progress-fill" style={{ width: '40%' }}></div>
        </div>
        
        <form onSubmit={handleNext} className="space-y-8 flex-1">
          {/* Sentence Status */}
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">Sentence Completed</Label>
            <RadioGroup 
              value={seekerProfile.sentenceCompleted?.toString() || ''} 
              onValueChange={(value) => handleBooleanChange('sentenceCompleted', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="sentence-yes" />
                <Label htmlFor="sentence-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="sentence-no" />
                <Label htmlFor="sentence-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Current Legal Supervision */}
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">Current Legal Supervision</Label>
            <RadioGroup 
              value={seekerProfile.currentLegalSupervision || ''} 
              onValueChange={handleSupervisionChange}
            >
              {legalSupervisionOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`supervision-${option.value}`} />
                  <Label htmlFor={`supervision-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Conviction Types */}
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">Conviction Type (select all that apply)</Label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {convictionTypeOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`conviction-${option.value}`}
                    checked={seekerProfile.convictionTypes?.includes(option.value as ConvictionType) || false}
                    onCheckedChange={(checked) => 
                      handleConvictionTypeChange(option.value as ConvictionType, checked as boolean)
                    }
                  />
                  <Label htmlFor={`conviction-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            
            {seekerProfile.convictionTypes?.includes('other') && (
              <div className="mt-3">
                <Label htmlFor="conviction-other" className="text-sm text-gray-600">Please specify:</Label>
                <Textarea
                  id="conviction-other"
                  value={seekerProfile.convictionOtherDetails || ''}
                  onChange={(e) => setSeekerProfile(prev => ({ ...prev, convictionOtherDetails: e.target.value }))}
                  className="mt-1"
                  placeholder="Please provide details..."
                />
              </div>
            )}
          </div>

          {/* Conviction Status */}
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">Conviction Status</Label>
            <RadioGroup 
              value={seekerProfile.convictionStatus || ''} 
              onValueChange={handleConvictionStatusChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spent" id="status-spent" />
                <Label htmlFor="status-spent">Spent (under Rehabilitation of Offenders Act 1974)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unspent" id="status-unspent" />
                <Label htmlFor="status-unspent">Unspent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="status-pending" />
                <Label htmlFor="status-pending">Pending</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Safeguarding Flags */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Safeguarding & Regulated Work</h3>
            
            <div className="space-y-3">
              <Label className="text-gray-700 font-medium">Barred from regulated work with children or vulnerable adults</Label>
              <RadioGroup 
                value={seekerProfile.barredFromRegulatedWork?.toString() || ''} 
                onValueChange={(value) => handleBooleanChange('barredFromRegulatedWork', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="barred-yes" />
                  <Label htmlFor="barred-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="barred-no" />
                  <Label htmlFor="barred-no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unknown" id="barred-unknown" />
                  <Label htmlFor="barred-unknown">Unknown</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-gray-700 font-medium">Subject to DBS Barring List</Label>
              <RadioGroup 
                value={seekerProfile.onDbsBarringList?.toString() || ''} 
                onValueChange={(value) => handleBooleanChange('onDbsBarringList', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="dbs-yes" />
                  <Label htmlFor="dbs-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="dbs-no" />
                  <Label htmlFor="dbs-no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unknown" id="dbs-unknown" />
                  <Label htmlFor="dbs-unknown">Unknown</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-gray-700 font-medium">MAPPA Level</Label>
              <RadioGroup 
                value={seekerProfile.mappaLevel || ''} 
                onValueChange={handleMappaChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="level_1" id="mappa-1" />
                  <Label htmlFor="mappa-1">Level 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="level_2" id="mappa-2" />
                  <Label htmlFor="mappa-2">Level 2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="level_3" id="mappa-3" />
                  <Label htmlFor="mappa-3">Level 3</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not_applicable" id="mappa-na" />
                  <Label htmlFor="mappa-na">N/A</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-gray-700 font-medium">Relevant for safeguarding checks</Label>
              <RadioGroup 
                value={seekerProfile.relevantForSafeguardingChecks?.toString() || ''} 
                onValueChange={(value) => handleBooleanChange('relevantForSafeguardingChecks', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="safeguarding-yes" />
                  <Label htmlFor="safeguarding-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="safeguarding-no" />
                  <Label htmlFor="safeguarding-no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unknown" id="safeguarding-unknown" />
                  <Label htmlFor="safeguarding-unknown">Unknown</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full py-6 text-lg bg-reme-orange hover:bg-orange-600 transition-colors mt-8"
          >
            Next: Health & Disability Information
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SeekerProfileSetupStep2;
