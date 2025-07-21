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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Skills & Education</h2>
        <p className="text-muted-foreground">
          Showcase your skills, education, and certifications
        </p>
      </div>

      <div className="space-y-8">
        {/* Skills Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Skills *
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="skillName">Skill Name</Label>
                <Input
                  id="skillName"
                  placeholder="React"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skillCategory">Category</Label>
                <Select value={newSkillCategory} onValueChange={setNewSkillCategory}>
                  <SelectTrigger>
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
                  <SelectTrigger>
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
              <div className="flex items-end">
                <Button onClick={addSkill} disabled={!newSkillName.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            {cvData.skills.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Your Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-2">
                      <span>{skill.name}</span>
                      <span className="text-xs opacity-70">({skill.level})</span>
                      <button
                        onClick={() => removeSkill(index)}
                        className="ml-1 hover:text-destructive"
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </CardTitle>
              <Button variant="outline" size="sm" onClick={addEducation}>
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {cvData.education.map((education) => (
              <Card key={education.id} className="p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Degree/Qualification</Label>
                    <Input
                      placeholder="Bachelor of Science in Computer Science"
                      value={education.degree}
                      onChange={(e) => updateEducation(education.id, { degree: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input
                      placeholder="University of Example"
                      value={education.institution}
                      onChange={(e) => updateEducation(education.id, { institution: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="London, UK"
                      value={education.location}
                      onChange={(e) => updateEducation(education.id, { location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="month"
                        value={education.startDate}
                        onChange={(e) => updateEducation(education.id, { startDate: e.target.value })}
                      />
                      <span className="text-muted-foreground text-sm">to</span>
                      <Input
                        type="month"
                        value={education.endDate}
                        onChange={(e) => updateEducation(education.id, { endDate: e.target.value })}
                        disabled={education.current}
                        placeholder={education.current ? "Present" : ""}
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
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Certifications Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certifications
              </CardTitle>
              <Button variant="outline" size="sm" onClick={addCertification}>
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {cvData.certifications.map((certification) => (
              <Card key={certification.id} className="p-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Certification Name</Label>
                    <Input
                      placeholder="AWS Certified Solutions Architect"
                      value={certification.name}
                      onChange={(e) => updateCertification(certification.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Issuing Organization</Label>
                    <Input
                      placeholder="Amazon Web Services"
                      value={certification.issuer}
                      onChange={(e) => updateCertification(certification.id, { issuer: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date Obtained</Label>
                    <Input
                      type="month"
                      value={certification.date}
                      onChange={(e) => updateCertification(certification.id, { date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCertification(certification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-8">
        <Button 
          onClick={onNext} 
          disabled={!isFormValid()}
          size="lg"
        >
          Continue to Preview & Export
        </Button>
      </div>
    </div>
  );
};