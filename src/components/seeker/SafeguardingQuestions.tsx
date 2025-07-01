
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import AnimatedCard from '../ui/animated-card';

interface SafeguardingQuestionsProps {
  seekerProfile: any;
  onBooleanChange: (field: string, value: string) => void;
  onFieldChange: (field: string, value: any) => void;
}

const SafeguardingQuestions: React.FC<SafeguardingQuestionsProps> = ({
  seekerProfile,
  onBooleanChange,
  onFieldChange
}) => {
  return (
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
            onValueChange={(value) => onBooleanChange('barredFromRegulatedWork', value)}
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
            onValueChange={(value) => onBooleanChange('onDbsBarringList', value)}
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
            onValueChange={(value) => onFieldChange('mappaLevel', value)}
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
            onValueChange={(value) => onBooleanChange('relevantForSafeguardingChecks', value)}
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
  );
};

export default SafeguardingQuestions;
