
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { jobCategories } from '../../../../data/jobCategories';
import { employmentTypes } from '../../../../services/api';

interface BasicJobFieldsProps {
  jobData: {
    title: string;
    description: string;
    category: string;
    employmentType: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const BasicJobFields: React.FC<BasicJobFieldsProps> = ({ jobData, onChange }) => {
  return (
    <>
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
    </>
  );
};

export default BasicJobFields;
