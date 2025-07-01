
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { jobAPI } from '../../../services/api';
import { JobPosting } from '@/models/types';

export const useJobForm = () => {
  const navigate = useNavigate();
  
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    category: '',
    employmentType: '',
    experienceLevel: '',
    locationCity: '',
    locationCountry: '',
    requiredSkills: [] as string[],
    subjectToDbsBarring: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSkillsSheetOpen, setIsSkillsSheetOpen] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setJobData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };
  
  const handleToggleSkill = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(s => s !== skillId) 
        : [...prev, skillId]
    );
  };
  
  const handleAddSkill = (skillId: string) => {
    if (!selectedSkills.includes(skillId)) {
      setSelectedSkills(prev => [...prev, skillId]);
    }
  };
  
  const handleRemoveSkill = (skillId: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skillId));
  };
  
  const handleSaveDraft = async () => {
    if (!jobData.title) {
      toast({
        title: "Title required",
        description: "Please provide a job title to save as draft.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Update job data with selected skills and explicitly type the status
      const jobDataWithSkills: Partial<JobPosting> = {
        ...jobData,
        requiredSkills: selectedSkills,
        status: 'draft' as const
      };
      
      await jobAPI.createJob(jobDataWithSkills);
      
      toast({
        title: "Draft saved",
        description: "Your job posting draft has been saved.",
      });
      
      navigate('/hirer-jobs');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save job draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobData.title || !jobData.description || !jobData.category || !jobData.employmentType) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Update job data with selected skills and explicitly type the status
      const jobDataWithSkills: Partial<JobPosting> = {
        ...jobData,
        requiredSkills: selectedSkills,
        status: 'active' as const
      };
      
      await jobAPI.createJob(jobDataWithSkills);
      
      toast({
        title: "Job posted",
        description: "Your job posting has been published successfully.",
      });
      
      navigate('/hirer-jobs');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    jobData,
    isSubmitting,
    selectedSkills,
    isSkillsSheetOpen,
    setIsSkillsSheetOpen,
    handleChange,
    handleToggleSkill,
    handleAddSkill,
    handleRemoveSkill,
    handleSaveDraft,
    handleSubmit
  };
};
