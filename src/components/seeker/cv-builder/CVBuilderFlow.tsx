import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CVData } from '@/types/cv';
import { TemplateSelection } from './TemplateSelection';
import { PersonalInfoStep } from './PersonalInfoStep';
import { ProfessionalSummaryStep } from './ProfessionalSummaryStep';
import { WorkExperienceStep } from './WorkExperienceStep';
import { SkillsEducationStep } from './SkillsEducationStep';
import { PreviewExportStep } from './PreviewExportStep';

const STEPS = [
  { id: 1, name: 'Template', component: TemplateSelection },
  { id: 2, name: 'Personal Info', component: PersonalInfoStep },
  { id: 3, name: 'Summary', component: ProfessionalSummaryStep },
  { id: 4, name: 'Experience', component: WorkExperienceStep },
  { id: 5, name: 'Skills & Education', component: SkillsEducationStep },
  { id: 6, name: 'Preview & Export', component: PreviewExportStep },
];

interface CVBuilderFlowProps {
  onClose: () => void;
}

export const CVBuilderFlow: React.FC<CVBuilderFlowProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
    },
    professionalSummary: {
      content: '',
    },
    skills: [],
    workExperience: [],
    education: [],
    certifications: [],
    template: 'modern',
  });

  const CurrentStepComponent = STEPS.find(step => step.id === currentStep)?.component;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const updateCVData = (updates: Partial<CVData>) => {
    setCvData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with progress */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 mx-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => handleStepClick(step.id)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    currentStep === step.id
                      ? 'bg-primary text-primary-foreground'
                      : currentStep > step.id
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.id}
                </button>
                {index < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="text-sm font-medium">{STEPS[currentStep - 1]?.name}</span>
          </div>
        </div>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {CurrentStepComponent && (
          <CurrentStepComponent
            cvData={cvData}
            updateCVData={updateCVData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center p-4 border-t bg-background">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {STEPS.length}
        </span>

        <Button
          onClick={handleNext}
          disabled={currentStep === STEPS.length}
        >
          {currentStep === STEPS.length ? 'Finish' : 'Next'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};