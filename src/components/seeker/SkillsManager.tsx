
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface SkillsManagerProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  isEditing?: boolean;
}

const SkillsManager = ({ skills, onSkillsChange, isEditing = false }: SkillsManagerProps) => {
  const [newSkill, setNewSkill] = useState('');

  const suggestedSkills = [
    'Communication', 'Teamwork', 'Problem Solving', 'Time Management',
    'Customer Service', 'Leadership', 'Organization', 'Computer Skills',
    'Warehouse Operations', 'Data Entry', 'Sales', 'Retail Experience',
    'Food Service', 'Cleaning', 'Security', 'Construction'
  ];

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onSkillsChange([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  const addSuggestedSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      onSkillsChange([...skills, skill]);
    }
  };

  if (!isEditing) {
    return (
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
              {skill}
            </Badge>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No skills added yet. Click Edit to add skills.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a skill..."
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
        />
        <Button onClick={addSkill} size="icon" disabled={!newSkill.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Skills */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 flex items-center gap-1">
            {skill}
            <button onClick={() => removeSkill(skill)} className="ml-1 hover:bg-blue-200 rounded-full">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Suggested Skills */}
      <div>
        <p className="text-sm font-medium mb-2">Suggested Skills:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedSkills
            .filter(skill => !skills.includes(skill))
            .slice(0, 8)
            .map((skill, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => addSuggestedSkill(skill)}
              >
                + {skill}
              </Badge>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsManager;
