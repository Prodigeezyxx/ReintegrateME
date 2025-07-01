
import React from 'react';
import { Input } from '@/components/ui/input';

interface LocationFieldsProps {
  jobData: {
    locationCity: string;
    locationCountry: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const LocationFields: React.FC<LocationFieldsProps> = ({ jobData, onChange }) => {
  return (
    <>
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
    </>
  );
};

export default LocationFields;
