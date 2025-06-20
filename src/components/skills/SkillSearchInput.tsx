
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { searchSkills, getSkillById, type Skill } from '../../data/skillsDatabase';

interface SkillSearchInputProps {
  selectedSkills: string[];
  onSkillAdd: (skillId: string) => void;
  onSkillRemove: (skillId: string) => void;
  placeholder?: string;
  maxSuggestions?: number;
}

const SkillSearchInput: React.FC<SkillSearchInputProps> = ({
  selectedSkills,
  onSkillAdd,
  onSkillRemove,
  placeholder = "Search for skills...",
  maxSuggestions = 8
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Skill[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const results = searchSkills(query)
        .filter(skill => !selectedSkills.includes(skill.id))
        .slice(0, maxSuggestions);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, selectedSkills, maxSuggestions]);

  const handleSkillSelect = (skill: Skill) => {
    onSkillAdd(skill.id);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault();
      handleSkillSelect(suggestions[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            ref={inputRef}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleSkillSelect(skill)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-xs text-gray-500 capitalize">
                    {skill.type.replace('_', ' ')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSkills.map(skillId => {
            const skill = getSkillById(skillId);
            if (!skill) return null;
            
            return (
              <Badge
                key={skillId}
                variant="secondary"
                className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                {skill.name}
                <button
                  onClick={() => onSkillRemove(skillId)}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SkillSearchInput;
