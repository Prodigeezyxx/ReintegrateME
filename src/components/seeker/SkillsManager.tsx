
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SkillSearchInput from '../skills/SkillSearchInput';
import CategorySkillsSelector from '../skills/CategorySkillsSelector';
import { getSkillById, getCategoriesByJobCategory, getSkillsByCategory } from '../../data/skillsDatabase';

interface SkillsManagerProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  isEditing?: boolean;
  jobCategories?: string[];
}

const SkillsManager = ({ 
  skills, 
  onSkillsChange, 
  isEditing = false,
  jobCategories = []
}: SkillsManagerProps) => {
  const [activeTab, setActiveTab] = useState('current');

  const handleSkillAdd = (skillId: string) => {
    if (!skills.includes(skillId)) {
      onSkillsChange([...skills, skillId]);
    }
  };

  const handleSkillRemove = (skillId: string) => {
    onSkillsChange(skills.filter(s => s !== skillId));
  };

  const handleSkillToggle = (skillId: string) => {
    if (skills.includes(skillId)) {
      handleSkillRemove(skillId);
    } else {
      handleSkillAdd(skillId);
    }
  };

  const getSuggestedSkills = () => {
    if (jobCategories.length === 0) return [];
    
    const relevantCategoryIds = jobCategories.flatMap(jobCat => 
      getCategoriesByJobCategory(jobCat)
    );
    
    const suggestedSkills = relevantCategoryIds
      .flatMap(catId => getSkillsByCategory(catId))
      .filter(skill => !skills.includes(skill.id))
      .slice(0, 12);
    
    return suggestedSkills;
  };

  if (!isEditing) {
    return (
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skillId) => {
            const skill = getSkillById(skillId);
            if (!skill) return null;
            
            return (
              <Badge key={skillId} variant="secondary" className="bg-blue-50 text-blue-700">
                {skill.name}
              </Badge>
            );
          })
        ) : (
          <p className="text-gray-500 text-sm">No skills added yet. Click Edit to add skills.</p>
        )}
      </div>
    );
  }

  const suggestedSkills = getSuggestedSkills();

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Your Skills</TabsTrigger>
          <TabsTrigger value="search">Search & Add</TabsTrigger>
          <TabsTrigger value="suggested">Suggested</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Skills ({skills.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skillId) => {
                    const skill = getSkillById(skillId);
                    if (!skill) return null;
                    
                    return (
                      <Badge 
                        key={skillId} 
                        variant="secondary" 
                        className="bg-blue-50 text-blue-700 flex items-center gap-1"
                      >
                        {skill.name}
                        <button 
                          onClick={() => handleSkillRemove(skillId)}
                          className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No skills added yet. Use the other tabs to add skills.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="search" className="space-y-4">
          <SkillSearchInput
            selectedSkills={skills}
            onSkillAdd={handleSkillAdd}
            onSkillRemove={handleSkillRemove}
            placeholder="Search for skills to add to your profile..."
          />
        </TabsContent>
        
        <TabsContent value="suggested" className="space-y-4">
          {suggestedSkills.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suggested Skills</CardTitle>
                <p className="text-sm text-gray-600">
                  Based on your job interests, these skills might be relevant:
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedSkills.map(skill => (
                    <Button
                      key={skill.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSkillAdd(skill.id)}
                      className="justify-start h-auto p-3 text-left"
                    >
                      <div>
                        <p className="font-medium">{skill.name}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {skill.type.replace('_', ' ')}
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">
                  No specific suggestions available. Use the search tab to find and add skills.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SkillsManager;
