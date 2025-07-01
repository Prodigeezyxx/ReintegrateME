
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AnimatedCard from '../ui/animated-card';

interface CriminalConvictionFormProps {
  seekerProfile: any;
  setSeekerProfile: (updater: (prev: any) => any) => void;
  onBooleanChange: (field: string, value: string) => void;
  onConvictionTypeChange: (convictionType: string, checked: boolean) => void;
  onFieldChange: (field: string, value: any) => void;
}

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

const CriminalConvictionForm: React.FC<CriminalConvictionFormProps> = ({
  seekerProfile,
  setSeekerProfile,
  onBooleanChange,
  onConvictionTypeChange,
  onFieldChange
}) => {
  return (
    <>
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
            onValueChange={(value) => onBooleanChange('sentenceCompleted', value)}
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
          onValueChange={(value) => onFieldChange('convictionStatus', value)}
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
                  onConvictionTypeChange(option.value, checked as boolean)
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
              onChange={(e) => onFieldChange('convictionOtherDetails', e.target.value)}
              className="mt-2 bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-blue-400"
              placeholder="Please provide details..."
            />
          </div>
        )}
      </AnimatedCard>
    </>
  );
};

export default CriminalConvictionForm;
