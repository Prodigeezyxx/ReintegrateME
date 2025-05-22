
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { skills } from '../../../services/api';

interface SkillsSelectorProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedSkills: string[];
  onToggleSkill: (skill: string) => void;
}

const SkillsSelector: React.FC<SkillsSelectorProps> = ({ 
  isOpen, 
  setIsOpen, 
  selectedSkills, 
  onToggleSkill 
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
                onClick={() => onToggleSkill(skill)}
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
            onClick={() => setIsOpen(false)}
          >
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SkillsSelector;
