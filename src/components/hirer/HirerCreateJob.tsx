
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { jobAPI, jobCategories, employmentTypes, skills } from '../../services/api';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ArrowLeft } from 'lucide-react';

const HirerCreateJob = () => {
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
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSkillsSheetOpen, setIsSkillsSheetOpen] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };
  
  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
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
      
      // Update job data with selected skills
      const jobDataWithSkills = {
        ...jobData,
        requiredSkills: selectedSkills,
        status: 'draft'
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
      
      // Update job data with selected skills
      const jobDataWithSkills = {
        ...jobData,
        requiredSkills: selectedSkills,
        status: 'active'
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
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Job Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                placeholder="e.g. Construction Worker"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium">
                Job Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={jobData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select a category</option>
                {jobCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="employmentType" className="block text-sm font-medium">
                Employment Type <span className="text-red-500">*</span>
              </label>
              <select
                id="employmentType"
                name="employmentType"
                value={jobData.employmentType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select employment type</option>
                {employmentTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                Job Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                name="description"
                value={jobData.description}
                onChange={handleChange}
                placeholder="Describe the job responsibilities and requirements..."
                className="h-32"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="locationCity" className="block text-sm font-medium">
                City <span className="text-red-500">*</span>
              </label>
              <Input
                id="locationCity"
                name="locationCity"
                value={jobData.locationCity}
                onChange={handleChange}
                placeholder="e.g. Portland"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="locationCountry" className="block text-sm font-medium">
                Country <span className="text-red-500">*</span>
              </label>
              <Input
                id="locationCountry"
                name="locationCountry"
                value={jobData.locationCountry}
                onChange={handleChange}
                placeholder="e.g. United States"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Required Skills</label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsSkillsSheetOpen(true)}
                >
                  Add Skills
                </Button>
              </div>
              
              {selectedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSkills.map(skill => (
                    <span 
                      key={skill}
                      className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded flex items-center"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1.5 text-gray-500 hover:text-red-500"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No skills selected</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-reme-orange hover:bg-orange-600 transition-colors"
            disabled={isSubmitting}
          >
            Post Job
          </Button>
        </div>
      </form>
      
      <Sheet open={isSkillsSheetOpen} onOpenChange={setIsSkillsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Select Skills</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <div className="grid grid-cols-1 gap-2">
              {skills.map(skill => (
                <div 
                  key={skill}
                  className={`p-3 border rounded-md cursor-pointer ${
                    selectedSkills.includes(skill) 
                      ? 'border-reme-orange bg-orange-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => selectedSkills.includes(skill) 
                    ? handleRemoveSkill(skill) 
                    : handleAddSkill(skill)
                  }
                >
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{skill}</p>
                    </div>
                    {selectedSkills.includes(skill) && (
                      <div className="h-5 w-5 bg-reme-orange rounded-full flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <Button
              className="w-full mt-4 bg-reme-orange hover:bg-orange-600 transition-colors"
              onClick={() => setIsSkillsSheetOpen(false)}
            >
              Done
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HirerCreateJob;
