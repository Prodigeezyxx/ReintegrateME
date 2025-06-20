
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { skillsDatabase, getSkillById, type SkillCategory } from '../../data/skillsDatabase';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CategorySkillsSelectorProps {
  selectedSkills: string[];
  onSkillToggle: (skillId: string) => void;
  jobCategory?: string;
  showAllCategories?: boolean;
}

const CategorySkillsSelector: React.FC<CategorySkillsSelectorProps> = ({
  selectedSkills,
  onSkillToggle,
  jobCategory,
  showAllCategories = true
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderSkillCategory = (category: SkillCategory) => {
    const isExpanded = expandedCategories.has(category.id);
    const categorySelectedSkills = category.skills.filter(skill => selectedSkills.includes(skill.id));
    
    return (
      <Card key={category.id} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
              {categorySelectedSkills.length > 0 && (
                <p className="text-sm text-blue-600 mt-1">
                  {categorySelectedSkills.length} skill{categorySelectedSkills.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCategory(category.id)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {category.skills.map(skill => (
                <div
                  key={skill.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedSkills.includes(skill.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => onSkillToggle(skill.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{skill.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {skill.type.replace('_', ' ')}
                        </Badge>
                        {skill.level && (
                          <Badge variant="secondary" className="text-xs">
                            {skill.level}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {selectedSkills.includes(skill.id) && (
                      <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  if (!showAllCategories) {
    // Show only relevant categories for the job type
    const relevantCategories = skillsDatabase.filter(category => {
      // Logic to determine relevant categories based on job category could go here
      return true; // For now, show all
    });

    return (
      <div className="space-y-4">
        {relevantCategories.map(renderSkillCategory)}
      </div>
    );
  }

  return (
    <Tabs defaultValue="technical" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="technical">Technical Skills</TabsTrigger>
        <TabsTrigger value="soft">Soft Skills</TabsTrigger>
        <TabsTrigger value="certifications">Certifications</TabsTrigger>
      </TabsList>
      
      <TabsContent value="technical" className="space-y-4 mt-4">
        {skillsDatabase
          .filter(category => category.skills.some(skill => skill.type === 'Technical'))
          .map(renderSkillCategory)}
      </TabsContent>
      
      <TabsContent value="soft" className="space-y-4 mt-4">
        {skillsDatabase
          .filter(category => category.skills.some(skill => skill.type === 'Soft Skill'))
          .map(renderSkillCategory)}
      </TabsContent>
      
      <TabsContent value="certifications" className="space-y-4 mt-4">
        {skillsDatabase
          .filter(category => category.skills.some(skill => skill.type === 'Certification' || skill.type === 'License'))
          .map(renderSkillCategory)}
      </TabsContent>
    </Tabs>
  );
};

export default CategorySkillsSelector;
