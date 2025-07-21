
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, GraduationCap, Award, Brain, X } from 'lucide-react';
import { CVData, Skill, Education, Certification } from '@/types/cv';
import { v4 as uuidv4 } from 'uuid';

const skillCategories = [
  'Technical',
  'Programming Languages',
  'Frameworks & Libraries',
  'Tools & Software',
  'Soft Skills',
  'Languages',
  'Certifications',
  'Other'
];

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

interface SkillsEducationStepProps {
  cvData: CVData;
  updateCVData: (updates: Partial<CVData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const SkillsEducationStep: React.FC<SkillsEducationStepProps> = ({
  cvData,
  updateCVData,
  onNext,
}) => {
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Technical');
  const [newSkillLevel, setNewSkillLevel] = useState<typeof skillLevels[number]>('Intermediate');

  // Skills Management
  const addSkill = () => {
    if (!newSkillName.trim()) return;
    
    const newSkill: Skill = {
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel,
    };

    updateCVData({
      skills: [...cvData.skills, newSkill],
    });

    setNewSkillName('');
  };

  const removeSkill = (index: number) => {
    updateCVData({
      skills: cvData.skills.filter((_, i) => i !== index),
    });
  };

  // Education Management
  const addEducation = () => {
    const newEducation: Education = {
      id: uuidv4(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
    };

    updateCVData({
      education: [...cvData.education, newEducation],
    });
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    updateCVData({
      education: cvData.education.map((edu) =>
        edu.id === id ? { ...edu, ...updates } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    updateCVData({
      education: cvData.education.filter((edu) => edu.id !== id),
    });
  };

  // Certification Management
  const addCertification = () => {
    const newCertification: Certification = {
      id: uuidv4(),
      name: '',
      issuer: '',
      date: '',
    };

    updateCVData({
      certifications: [...cvData.certifications, newCertification],
    });
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    updateCVData({
      certifications: cvData.certifications.map((cert) =>
        cert.id === id ? { ...cert, ...updates } : cert
      ),
    });
  };

  const removeCertification = (id: string) => {
    updateCVData({
      certifications: cvData.certifications.filter((cert) => cert.id !== id),
    });
  };

  const isFormValid = () => {
    return cvData.skills.length > 0;
  };

  return (
    <div className="p-4 max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">Skills & Education</h2>
        <p className="text-sm text-muted-foreground">
          Showcase your skills, education, and certifications
        </p>
      </div>

      <div className="space-y-6">
        {/* Skills Section */}
        <Card className="beautiful-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-reintegrate-blue" />
              Skills *
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skillName">Skill Name</Label>
                <Input
                  id="skillName"
                  placeholder="React"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  className="h-11 touch-manipulation"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="skillCategory">Category</Label>
                  <Select value={newSkillCategory} onValueChange={setNewSkillCategory}>
                    <SelectTrigger className="h-11 touch-manipulation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skillLevel">Proficiency</Label>
                  <Select value={newSkillLevel} onValueChange={(value) => setNewSkillLevel(value as typeof skillLevels[number])}>
                    <SelectTrigger className="h-11 touch-manipulation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={addSkill} disabled={!newSkillName.trim()} className="w-full h-11 touch-manipulation bg-reintegrate-orange hover:bg-reintegrate-orange/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>

            {cvData.skills.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-reintegrate-blue">Your Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-2 touch-manipulation">
                      <span>{skill.name}</span>
                      <span className="text-xs opacity-70">({skill.level})</span>
                      <button
                        onClick={() => removeSkill(index)}
                        className="ml-1 hover:text-destructive touch-manipulation"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education Section */}
        <Card className="beautiful-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5 text-reintegrate-blue" />
                Education
              </CardTitle>
              <Button variant="outline" size="sm" onClick={addEducation} className="h-9 touch-manipulation">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {cvData.education.map((education) => (
              <Card key={education.id} className="p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Degree/Qualification</Label>
                    <Input
                      placeholder="Bachelor of Science in Computer Science"
                      value={education.degree}
                      onChange={(e) => updateEducation(education.id, { degree: e.target.value })}
                      className="h-11 touch-manipulation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input
                      placeholder="University of Example"
                      value={education.institution}
                      onChange={(e) => updateEducation(education.id, { institution: e.target.value })}
                      className="h-11 touch-manipulation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="London, UK"
                      value={education.location}
                      onChange={(e) => updateEducation(education.id, { location: e.target.value })}
                      className="h-11 touch-manipulation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="month"
                        value={education.startDate}
                        onChange={(e) => updateEducation(education.id, { startDate: e.target.value })}
                        className="h-11 touch-manipulation"
                      />
                      <Input
                        type="month"
                        value={education.endDate}
                        onChange={(e) => updateEducation(education.id, { endDate: e.target.value })}
                        disabled={education.current}
                        placeholder={education.current ? "Present" : ""}
                        className="h-11 touch-manipulation"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`current-edu-${education.id}`}
                        checked={education.current}
                        onCheckedChange={(checked) => 
                          updateEducation(education.id, { 
                            current: checked as boolean,
                            endDate: checked ? '' : education.endDate
                          })
                        }
                      />
                      <Label htmlFor={`current-edu-${education.id}`} className="text-sm">
                        Currently studying
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(education.id)}
                    className="h-9 w-9 p-0 touch-manipulation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Certifications Section */}
        <Card className="beautiful-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5 text-reintegrate-blue" />
                Certifications
              </CardTitle>
              <Button variant="outline" size="sm" onClick={addCertification} className="h-9 touch-manipulation">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {cvData.certifications.map((certification) => (
              <Card key={certification.id} className="p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Certification Name</Label>
                    <Input
                      placeholder="AWS Certified Solutions Architect"
                      value={certification.name}
                      onChange={(e) => updateCertification(certification.id, { name: e.target.value })}
                      className="h-11 touch-manipulation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Issuing Organization</Label>
                    <Input
                      placeholder="Amazon Web Services"
                      value={certification.issuer}
                      onChange={(e) => updateCertification(certification.id, { issuer: e.target.value })}
                      className="h-11 touch-manipulation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date Obtained</Label>
                    <Input
                      type="month"
                      value={certification.date}
                      onChange={(e) => updateCertification(certification.id, { date: e.target.value })}
                      className="h-11 touch-manipulation"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCertification(certification.id)}
                    className="h-9 w-9 p-0 touch-manipulation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-6 pb-6">
        <Button 
          onClick={onNext} 
          disabled={!isFormValid()}
          size="lg"
          className="min-h-11 touch-manipulation w-full max-w-xs bg-reintegrate-orange hover:bg-reintegrate-orange/90 disabled:opacity-50"
        >
          Continue to Preview & Export
        </Button>
      </div>
    </div>
  );
};
