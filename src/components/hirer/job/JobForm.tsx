
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { jobCategories } from '../../../data/jobCategories';
import { employmentTypes } from '../../../services/api';
import { getSkillById } from '../../../data/skillsDatabase';

interface JobFormProps {
  jobData: {
    title: string;
    description: string;
    category: string;
    employmentType: string;
    experienceLevel: string;
    locationCity: string;
    locationCountry: string;
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
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Job Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              name="title"
              value={jobData.title}
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
              placeholder="e.g. London"
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
              onChange={onChange}
              placeholder="e.g. United Kingdom"
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
                onClick={onOpenSkillsSheet}
              >
                Add Skills
              </Button>
            </div>
            
            {selectedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSkills.map(skillId => {
                  const skill = getSkillById(skillId);
                  const skillName = skill ? skill.name : skillId;
                  
                  return (
                    <Badge
                      key={skillId}
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 flex items-center gap-1"
                    >
                      {skillName}
                      <button
                        type="button"
                        onClick={() => onRemoveSkill(skillId)}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
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
          onClick={onSaveDraft}
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
  );
};

export default JobForm;
