
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { getSkillById } from '../../../../data/skillsDatabase';

interface SkillsSectionProps {
  selectedSkills: string[];
  onOpenSkillsSheet: () => void;
  onRemoveSkill: (skill: string) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
  selectedSkills,
  onOpenSkillsSheet,
  onRemoveSkill
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Required Skills</label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onOpenSkillsSheet}
        >
          Add Skills
        </Button>
      </div>
      
      {selectedSkills.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedSkills.map(skillId => {
            const skill = getSkillById(skillId);
            const skillName = skill ? skill.name : skillId;
            
            return (
              <Badge
                key={skillId}
                variant="secondary"
                className="bg-blue-50 text-blue-700 flex items-center gap-1"
              >
                {skillName}
                <button
                  type="button"
                  onClick={() => onRemoveSkill(skillId)}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No skills selected</p>
      )}
    </div>
  );
};

export default SkillsSection;
