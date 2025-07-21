
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Briefcase, Calendar, MapPin, Building } from 'lucide-react';
import { CVData, WorkExperience } from '@/types/cv';
import { v4 as uuidv4 } from 'uuid';

interface WorkExperienceStepProps {
  cvData: CVData;
  updateCVData: (updates: Partial<CVData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const WorkExperienceStep: React.FC<WorkExperienceStepProps> = ({
  cvData,
  updateCVData,
  onNext,
}) => {
  const [expandedExperience, setExpandedExperience] = useState<string | null>(
    cvData.workExperience[0]?.id || null
  );

  const addWorkExperience = () => {
    const newExperience: WorkExperience = {
      id: uuidv4(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      achievements: [''],
    };

    updateCVData({
      workExperience: [...cvData.workExperience, newExperience],
    });
    setExpandedExperience(newExperience.id);
  };

  const updateExperience = (id: string, updates: Partial<WorkExperience>) => {
    updateCVData({
      workExperience: cvData.workExperience.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    updateCVData({
      workExperience: cvData.workExperience.filter((exp) => exp.id !== id),
    });
  };

  const addAchievement = (experienceId: string) => {
    const experience = cvData.workExperience.find((exp) => exp.id === experienceId);
    if (experience) {
      updateExperience(experienceId, {
        achievements: [...experience.achievements, ''],
      });
    }
  };

  const updateAchievement = (experienceId: string, index: number, value: string) => {
    const experience = cvData.workExperience.find((exp) => exp.id === experienceId);
    if (experience) {
      const newAchievements = [...experience.achievements];
      newAchievements[index] = value;
      updateExperience(experienceId, { achievements: newAchievements });
    }
  };

  const removeAchievement = (experienceId: string, index: number) => {
    const experience = cvData.workExperience.find((exp) => exp.id === experienceId);
    if (experience && experience.achievements.length > 1) {
      const newAchievements = experience.achievements.filter((_, i) => i !== index);
      updateExperience(experienceId, { achievements: newAchievements });
    }
  };

  const isFormValid = () => {
    return cvData.workExperience.length > 0 && 
           cvData.workExperience.every(exp => 
             exp.jobTitle && exp.company && exp.startDate && 
             exp.achievements.some(achievement => achievement.trim())
           );
  };

  // Auto-add first experience if none exist
  React.useEffect(() => {
    if (cvData.workExperience.length === 0) {
      addWorkExperience();
    }
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">Work Experience</h2>
        <p className="text-sm text-muted-foreground">
          Add your professional experience, starting with your most recent role
        </p>
      </div>

      <div className="space-y-4">
        {cvData.workExperience.map((experience, index) => (
          <Card key={experience.id} className="relative beautiful-shadow">
            <CardHeader 
              className="cursor-pointer touch-manipulation"
              onClick={() => setExpandedExperience(
                expandedExperience === experience.id ? null : experience.id
              )}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {experience.jobTitle || `Position ${index + 1}`}
                  {experience.company && (
                    <span className="text-sm font-normal text-muted-foreground block">
                      at {experience.company}
                    </span>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {index === 0 && (
                    <span className="text-xs bg-reintegrate-blue/10 text-reintegrate-blue px-2 py-1 rounded">
                      Most Recent
                    </span>
                  )}
                  {cvData.workExperience.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExperience(experience.id);
                      }}
                      className="h-8 w-8 p-0 touch-manipulation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            {expandedExperience === experience.id && (
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`jobTitle-${experience.id}`}>Job Title *</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id={`jobTitle-${experience.id}`}
                        placeholder="Software Developer"
                        value={experience.jobTitle}
                        onChange={(e) => updateExperience(experience.id, { jobTitle: e.target.value })}
                        className="pl-10 h-11 touch-manipulation"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`company-${experience.id}`}>Company *</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id={`company-${experience.id}`}
                        placeholder="Tech Company Ltd"
                        value={experience.company}
                        onChange={(e) => updateExperience(experience.id, { company: e.target.value })}
                        className="pl-10 h-11 touch-manipulation"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`location-${experience.id}`}>Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id={`location-${experience.id}`}
                        placeholder="London, UK"
                        value={experience.location}
                        onChange={(e) => updateExperience(experience.id, { location: e.target.value })}
                        className="pl-10 h-11 touch-manipulation"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Employment Period *</Label>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="month"
                            value={experience.startDate}
                            onChange={(e) => updateExperience(experience.id, { startDate: e.target.value })}
                            className="pl-10 h-11 touch-manipulation"
                          />
                        </div>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="month"
                            value={experience.endDate}
                            onChange={(e) => updateExperience(experience.id, { endDate: e.target.value })}
                            disabled={experience.current}
                            placeholder={experience.current ? "Present" : ""}
                            className="pl-10 h-11 touch-manipulation"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`current-${experience.id}`}
                          checked={experience.current}
                          onCheckedChange={(checked) => 
                            updateExperience(experience.id, { 
                              current: checked as boolean,
                              endDate: checked ? '' : experience.endDate
                            })
                          }
                        />
                        <Label htmlFor={`current-${experience.id}`} className="text-sm">
                          I currently work here
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Key Achievements & Responsibilities *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addAchievement(experience.id)}
                      className="h-9 touch-manipulation"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  {experience.achievements.map((achievement, achIndex) => (
                    <div key={achIndex} className="flex gap-2">
                      <Textarea
                        placeholder="• Developed and maintained web applications using React and Node.js, resulting in 30% improved user engagement"
                        value={achievement}
                        onChange={(e) => updateAchievement(experience.id, achIndex, e.target.value)}
                        className="flex-1 min-h-16 resize-none touch-manipulation"
                        rows={2}
                      />
                      {experience.achievements.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAchievement(experience.id, achIndex)}
                          className="h-8 w-8 p-0 touch-manipulation flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <p><strong className="text-reintegrate-orange">Tip:</strong> Start with action verbs (Developed, Led, Implemented) and include quantifiable results where possible.</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addWorkExperience}
          className="w-full h-11 touch-manipulation"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Position
        </Button>
      </div>

      <div className="flex justify-center mt-6 pb-6">
        <Button 
          onClick={onNext} 
          disabled={!isFormValid()}
          size="lg"
          className="min-h-11 touch-manipulation w-full max-w-xs bg-reintegrate-orange hover:bg-reintegrate-orange/90 disabled:opacity-50"
        >
          Continue to Skills & Education
        </Button>
      </div>
    </div>
  );
};
