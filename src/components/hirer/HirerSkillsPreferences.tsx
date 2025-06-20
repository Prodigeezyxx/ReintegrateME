
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import SkillSearchInput from '../skills/SkillSearchInput';
import CategorySkillsSelector from '../skills/CategorySkillsSelector';
import { getSkillById } from '../../data/skillsDatabase';

interface HirerSkillsPreferencesProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  jobCategories: string[];
}

const HirerSkillsPreferences = ({ 
  selectedSkills, 
  onSkillsChange, 
  jobCategories 
}: HirerSkillsPreferencesProps) => {
  const [activeTab, setActiveTab] = useState('search');

  const handleSkillAdd = (skillId: string) => {
    if (!selectedSkills.includes(skillId)) {
      onSkillsChange([...selectedSkills, skillId]);
    }
  };

  const handleSkillRemove = (skillId: string) => {
    onSkillsChange(selectedSkills.filter(s => s !== skillId));
  };

  const handleSkillToggle = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      handleSkillRemove(skillId);
    } else {
      handleSkillAdd(skillId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Skills You Value Most</CardTitle>
        <p className="text-sm text-gray-600">
          Select the skills that are most important for the roles you typically hire for. This helps us match you with the right candidates.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Skills</TabsTrigger>
            <TabsTrigger value="browse">Browse Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-4">
            <SkillSearchInput
              selectedSkills={selectedSkills}
              onSkillAdd={handleSkillAdd}
              onSkillRemove={handleSkillRemove}
              placeholder="Search for skills you value in candidates..."
            />
          </TabsContent>
          
          <TabsContent value="browse" className="mt-4">
            <CategorySkillsSelector
              selectedSkills={selectedSkills}
              onSkillToggle={handleSkillToggle}
              showAllCategories={true}
            />
          </TabsContent>
        </Tabs>

        {selectedSkills.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Selected Skills ({selectedSkills.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map(skillId => {
                const skill = getSkillById(skillId);
                if (!skill) return null;
                
                return (
                  <Badge
                    key={skillId}
                    variant="secondary"
                    className="flex items-center gap-1 bg-orange-50 text-orange-700 hover:bg-orange-100"
                  >
                    {skill.name}
                    <button
                      onClick={() => handleSkillRemove(skillId)}
                      className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Don't worry about being too specific - you can always adjust these preferences later. Focus on the core skills that matter most to your business.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HirerSkillsPreferences;
