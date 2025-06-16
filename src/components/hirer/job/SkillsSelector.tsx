
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import OrbitalSkillSelector from '@/components/ui/orbital-skill-selector';
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
  // Transform skills array to match the expected format
  const skillsData = skills.map((skill, index) => ({
    id: skill,
    name: skill,
    category: 'general'
  }));

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full bg-gradient-to-br from-purple-50 to-blue-50">
        <SheetHeader className="mb-6">
          <SheetTitle>Select Skills</SheetTitle>
          <p className="text-gray-600 text-sm">
            Choose skills by clicking on the orbiting elements
          </p>
        </SheetHeader>
        
        <div className="flex flex-col items-center">
          <OrbitalSkillSelector
            skills={skillsData}
            selectedSkills={selectedSkills}
            onToggleSkill={onToggleSkill}
            maxSkills={12}
            className="mb-8"
          />
          
          <Button
            className="w-full bg-gradient-to-r from-reme-orange to-yellow-500 hover:from-orange-600 hover:to-yellow-600 transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            Done ({selectedSkills.length} selected)
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SkillsSelector;
