
import React, { useState } from 'react';
import { OrbitAnimation, OrbitalElement } from './orbital-animation';
import GlassmorphismCard from './glassmorphism-card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface OrbitalSkillSelectorProps {
  skills: Skill[];
  selectedSkills: string[];
  onToggleSkill: (skillId: string) => void;
  maxSkills?: number;
  className?: string;
}

const OrbitalSkillSelector: React.FC<OrbitalSkillSelectorProps> = ({
  skills,
  selectedSkills,
  onToggleSkill,
  maxSkills = 8,
  className
}) => {
  const [centerSkill, setCenterSkill] = useState<Skill | null>(null);
  
  const displaySkills = skills.slice(0, maxSkills);
  const orbitalPositions = [80, 120, 160, 200];
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <OrbitAnimation size={400} className="mb-6">
        {/* Center element */}
        <GlassmorphismCard className="w-20 h-20 flex items-center justify-center">
          {centerSkill ? (
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-800">
                {centerSkill.name}
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-reme-orange rounded-full animate-pulse" />
          )}
        </GlassmorphismCard>
        
        {/* Orbital skills */}
        {displaySkills.map((skill, index) => {
          const radiusIndex = index % orbitalPositions.length;
          const radius = orbitalPositions[radiusIndex];
          const duration = 15 + radiusIndex * 5;
          const delay = index * 2;
          const isSelected = selectedSkills.includes(skill.id);
          
          return (
            <OrbitalElement 
              key={skill.id}
              radius={radius} 
              duration={duration} 
              delay={delay}
            >
              <button
                onClick={() => onToggleSkill(skill.id)}
                onMouseEnter={() => setCenterSkill(skill)}
                onMouseLeave={() => setCenterSkill(null)}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110",
                  isSelected 
                    ? "bg-reme-orange text-white shadow-lg" 
                    : "bg-white/80 text-gray-700 hover:bg-white shadow-md"
                )}
              >
                {isSelected ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-medium">
                    {skill.name.charAt(0)}
                  </span>
                )}
              </button>
            </OrbitalElement>
          );
        })}
      </OrbitAnimation>
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Selected: {selectedSkills.length} skills
        </p>
        <p className="text-xs text-gray-500">
          Hover over orbiting skills to preview
        </p>
      </div>
    </div>
  );
};

export default OrbitalSkillSelector;
