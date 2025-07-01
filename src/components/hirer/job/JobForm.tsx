
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import BasicJobFields from './fields/BasicJobFields';
import LocationFields from './fields/LocationFields';
import DbsBarringField from './fields/DbsBarringField';
import SkillsSection from './fields/SkillsSection';
import JobFormActions from './fields/JobFormActions';

interface JobFormProps {
  jobData: {
    title: string;
    description: string;
    category: string;
    employmentType: string;
    experienceLevel: string;
    locationCity: string;
    locationCountry: string;
    subjectToDbsBarring: boolean;
  };
  selectedSkills: string[];
  isSubmitting: boolean;
  onOpenSkillsSheet: () => void;
  onRemoveSkill: (skill: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSaveDraft: () => void;
}

const JobForm: React.FC<JobFormProps> = ({
  jobData,
  selectedSkills,
  isSubmitting,
  onOpenSkillsSheet,
  onRemoveSkill,
  onChange,
  onSubmit,
  onSaveDraft
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-4 space-y-4">
          <BasicJobFields jobData={jobData} onChange={onChange} />
          <LocationFields jobData={jobData} onChange={onChange} />
          <DbsBarringField 
            subjectToDbsBarring={jobData.subjectToDbsBarring} 
            onChange={onChange} 
          />
          <SkillsSection 
            selectedSkills={selectedSkills}
            onOpenSkillsSheet={onOpenSkillsSheet}
            onRemoveSkill={onRemoveSkill}
          />
        </CardContent>
      </Card>
      
      <JobFormActions isSubmitting={isSubmitting} onSaveDraft={onSaveDraft} />
    </form>
  );
};

export default JobForm;
