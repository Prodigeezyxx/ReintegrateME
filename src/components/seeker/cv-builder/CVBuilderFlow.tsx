
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
      {/* Enhanced header with brand colors */}
      <div className="flex items-center justify-between p-4 border-b border-reintegrate-blue/10 bg-gradient-to-r from-white via-reintegrate-soft-blue to-white backdrop-blur-lg sticky top-0 z-10 safe-area-inset-top">
        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 touch-manipulation hover:bg-reintegrate-blue/10 hover:text-reintegrate-blue">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        {/* Brand-colored progress indicator */}
        <div className="flex-1 mx-3 max-w-xs">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => handleStepClick(step.id)}
                  className={`w-6 h-6 rounded-full text-xs font-medium transition-all duration-200 touch-manipulation ${
                    currentStep === step.id
                      ? 'bg-reintegrate-blue text-white scale-110 shadow-lg'
                      : currentStep > step.id
                      ? 'bg-reintegrate-orange text-white shadow-md'
                      : 'bg-reintegrate-gray/20 text-reintegrate-gray hover:bg-reintegrate-blue/20 hover:text-reintegrate-blue'
                  }`}
                >
                  {step.id}
                </button>
                {index < STEPS.length - 1 && (
                  <div className={`w-4 h-0.5 mx-1 transition-colors duration-200 ${
                    currentStep > step.id ? 'bg-reintegrate-orange' : 'bg-reintegrate-gray/30'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-1">
            <span className="text-xs font-medium text-reintegrate-blue hidden sm:inline">
              {STEPS[currentStep - 1]?.name}
            </span>
          </div>
        </div>
        
        <div className="w-10 shrink-0" />
      </div>

      {/* Enhanced scrollable content with brand gradient */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-reintegrate-light-bg via-white to-reintegrate-soft-blue/30">
        {CurrentStepComponent && (
          <CurrentStepComponent
            cvData={cvData}
            updateCVData={updateCVData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </div>

      {/* Enhanced bottom navigation with brand colors */}
      <div className="flex justify-between items-center p-4 border-t border-reintegrate-blue/10 bg-gradient-to-r from-white via-reintegrate-soft-blue/50 to-white backdrop-blur-lg safe-area-inset-bottom">
        <Button
          variant="brand-outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          size="sm"
          className="touch-manipulation min-h-11 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-reintegrate-blue font-medium">
            {currentStep}/{STEPS.length}
          </span>
          <div className="w-16 bg-reintegrate-gray/20 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-reintegrate-blue to-reintegrate-orange h-1 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <Button
          variant={currentStep === STEPS.length ? "brand-primary" : "brand-secondary"}
          onClick={currentStep === STEPS.length ? () => window.location.href = '/seeker-dashboard' : handleNext}
          disabled={false}
          size="sm"
          className="touch-manipulation min-h-11"
        >
          {currentStep === STEPS.length ? 'Finish' : 'Next'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
