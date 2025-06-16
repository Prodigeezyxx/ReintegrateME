
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Plus, X } from 'lucide-react';

interface SkillsSectionProps {
  profile: any;
  isEditing: boolean;
  onUpdate: (updates: any) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  profile,
  isEditing,
  onUpdate
}) => {
  const [skills, setSkills] = useState(profile.key_skills || []);
  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => {
    onUpdate({ key_skills: skills });
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim()) && skills.length < 15) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill: string) => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Card className="ios-card">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <Star className="h-5 w-5 text-blue-600 mr-2" />
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Add a skill (max 15)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={skills.length >= 15}
              />
              <Button 
                onClick={addSkill} 
                size="icon"
                disabled={!newSkill.trim() || skills.includes(newSkill.trim()) || skills.length >= 15}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeSkill(skill)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            
            <p className="text-xs text-gray-500">
              {skills.length}/15 skills added
            </p>
            
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </div>
        ) : (
          <div>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No skills added yet</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
