
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SeekerProfile } from '../../models/types';
import { skills, jobCategories, employmentTypes } from '../../services/api';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const MultiSelectTags = ({ 
  items,
  selectedItems,
  onChange,
  placeholder
}: { 
  items: string[],
  selectedItems: string[],
  onChange: (items: string[]) => void,
  placeholder: string
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (inputValue) {
      setFilteredItems(
        items.filter(
          item => item.toLowerCase().includes(inputValue.toLowerCase()) && 
          !selectedItems.includes(item)
        )
      );
    } else {
      setFilteredItems([]);
    }
  }, [inputValue, items, selectedItems]);

  const addItem = (item: string) => {
    if (!selectedItems.includes(item)) {
      onChange([...selectedItems, item]);
    }
    setInputValue('');
    setIsDropdownOpen(false);
  };

  const removeItem = (item: string) => {
    onChange(selectedItems.filter(i => i !== item));
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-lg min-h-[50px]">
        {selectedItems.map(item => (
          <Badge 
            key={item} 
            className="bg-reme-purple text-white"
          >
            {item}
            <button 
              className="ml-1 hover:text-gray-200" 
              onClick={() => removeItem(item)}
              aria-label="Remove tag"
            >
              ×
            </button>
          </Badge>
        ))}
        
        <input
          type="text"
          className="flex-grow border-none bg-transparent focus:outline-none min-w-[120px]"
          placeholder={selectedItems.length === 0 ? placeholder : ''}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
        />
      </div>
      
      {isDropdownOpen && filteredItems.length > 0 && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white shadow-lg rounded-md py-1">
          {filteredItems.map(item => (
            <button
              key={item}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => addItem(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const MultiSelectGrid = ({
  items,
  selectedItems,
  onChange,
  columns = 2
}: {
  items: string[],
  selectedItems: string[],
  onChange: (items: string[]) => void,
  columns?: number
}) => {
  const toggleItem = (item: string) => {
    if (selectedItems.includes(item)) {
      onChange(selectedItems.filter(i => i !== item));
    } else {
      onChange([...selectedItems, item]);
    }
  };
  
  return (
    <div className={`grid grid-cols-${columns} gap-2`}>
      {items.map(item => (
        <button
          key={item}
          type="button"
          onClick={() => toggleItem(item)}
          className={`p-3 rounded-lg text-left ${
            selectedItems.includes(item) 
              ? 'bg-reme-orange text-white' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

const SeekerProfileSetupStep2 = () => {
  const navigate = useNavigate();
  const [seekerProfile, setSeekerProfile] = useState<Partial<SeekerProfile>>({
    keySkills: [],
    preferredJobCategories: [],
    preferredEmploymentTypes: []
  });

  // Load data from previous step
  useEffect(() => {
    const savedProfile = localStorage.getItem('seekerProfile');
    if (savedProfile) {
      setSeekerProfile(prev => ({
        ...prev,
        ...JSON.parse(savedProfile)
      }));
    }
  }, []);

  const handleSkillsChange = (newSkills: string[]) => {
    setSeekerProfile(prev => ({ ...prev, keySkills: newSkills }));
  };

  const handleCategoriesChange = (categories: string[]) => {
    setSeekerProfile(prev => ({ ...prev, preferredJobCategories: categories }));
  };

  const handleEmploymentTypesChange = (types: string[]) => {
    setSeekerProfile(prev => ({ ...prev, preferredEmploymentTypes: types }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!seekerProfile.keySkills?.length) {
      toast({
        title: "Tip",
        description: "Adding some skills will help employers find you",
        variant: "default"
      });
    }
    
    // Store the updated profile in localStorage
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
        
        <h1 className="text-2xl font-bold mb-2">Your Skills & Preferences</h1>
        <p className="text-gray-600 mb-6">Let us know what you're good at</p>
        
        <div className="progress-bar mb-8">
          <div className="progress-fill" style={{ width: '66%' }}></div>
        </div>
        
        <form onSubmit={handleNext} className="space-y-8 flex-1">
          <div className="space-y-3">
            <label htmlFor="keySkills" className="text-gray-700 font-medium block">Key Skills</label>
            <MultiSelectTags
              items={skills}
              selectedItems={seekerProfile.keySkills || []}
              onChange={handleSkillsChange}
              placeholder="Type to add skills..."
            />
            <p className="text-sm text-gray-500">Choose skills that best represent your expertise</p>
          </div>
          
          <div className="space-y-3">
            <label className="text-gray-700 font-medium block">Preferred Job Categories</label>
            <MultiSelectGrid
              items={jobCategories}
              selectedItems={seekerProfile.preferredJobCategories || []}
              onChange={handleCategoriesChange}
            />
            <p className="text-sm text-gray-500">Select job categories you're interested in</p>
          </div>
          
          <div className="space-y-3">
            <label className="text-gray-700 font-medium block">Preferred Employment Types</label>
            <MultiSelectGrid
              items={employmentTypes}
              selectedItems={seekerProfile.preferredEmploymentTypes || []}
              onChange={handleEmploymentTypesChange}
            />
            <p className="text-sm text-gray-500">Select employment types you're looking for</p>
          </div>
          
          <Button
            type="submit"
            className="w-full py-6 text-lg bg-reme-orange hover:bg-orange-600 transition-colors mt-8"
          >
            Next: Location & Photo
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SeekerProfileSetupStep2;
