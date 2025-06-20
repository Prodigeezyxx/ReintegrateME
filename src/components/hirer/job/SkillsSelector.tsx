
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SkillSearchInput from '../../skills/SkillSearchInput';
import CategorySkillsSelector from '../../skills/CategorySkillsSelector';

interface SkillsSelectorProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedSkills: string[];
  onToggleSkill: (skill: string) => void;
  jobCategory?: string;
}

const SkillsSelector: React.FC<SkillsSelectorProps> = ({ 
  isOpen, 
  setIsOpen, 
  selectedSkills, 
  onToggleSkill,
  jobCategory
}) => {
  const [activeTab, setActiveTab] = useState('search');

  const handleSkillAdd = (skillId: string) => {
    if (!selectedSkills.includes(skillId)) {
      onToggleSkill(skillId);
    }
  };

  const handleSkillRemove = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      onToggleSkill(skillId);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Select Required Skills</SheetTitle>
          <p className="text-sm text-gray-600">
            Choose the skills that are required or preferred for this position.
          </p>
        </SheetHeader>
        
        <div className="mt-6 h-full flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Search Skills</TabsTrigger>
              <TabsTrigger value="browse">Browse Categories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="flex-1 mt-4">
              <SkillSearchInput
                selectedSkills={selectedSkills}
                onSkillAdd={handleSkillAdd}
                onSkillRemove={handleSkillRemove}
                placeholder="Search for required skills..."
              />
            </TabsContent>
            
            <TabsContent value="browse" className="flex-1 mt-4 overflow-y-auto">
              <CategorySkillsSelector
                selectedSkills={selectedSkills}
                onSkillToggle={onToggleSkill}
                jobCategory={jobCategory}
                showAllCategories={true}
              />
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 pt-4 border-t">
            <Button
              className="w-full bg-reme-orange hover:bg-orange-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Done ({selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected)
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SkillsSelector;
