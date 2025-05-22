
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import JobForm from './job/JobForm';
import SkillsSelector from './job/SkillsSelector';
import { useJobForm } from './job/useJobForm';

const HirerCreateJob = () => {
  const navigate = useNavigate();
  const { 
    jobData, 
    isSubmitting, 
    selectedSkills, 
    isSkillsSheetOpen, 
    setIsSkillsSheetOpen, 
    handleChange, 
    handleToggleSkill, 
    handleRemoveSkill, 
    handleSaveDraft, 
    handleSubmit 
  } = useJobForm();
  
  return (
    <div className="mobile-container p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Create Job Posting</h1>
      </div>
      
      <JobForm 
        jobData={jobData}
        selectedSkills={selectedSkills}
        isSubmitting={isSubmitting}
        onOpenSkillsSheet={() => setIsSkillsSheetOpen(true)}
        onRemoveSkill={handleRemoveSkill}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
      />
      
      <SkillsSelector
        isOpen={isSkillsSheetOpen}
        setIsOpen={setIsSkillsSheetOpen}
        selectedSkills={selectedSkills}
        onToggleSkill={handleToggleSkill}
      />
    </div>
  );
};

export default HirerCreateJob;
