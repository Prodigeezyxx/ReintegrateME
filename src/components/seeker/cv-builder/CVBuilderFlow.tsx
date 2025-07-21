
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
    <div className="mobile-container min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header with iOS-style glassmorphism */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-slate-200 safe-area-inset-top">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 touch-manipulation">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          {/* Progress indicator with app styling */}
          <div className="flex-1 mx-3 max-w-xs">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => handleStepClick(step.id)}
                    className={`w-6 h-6 rounded-full text-xs font-medium transition-all duration-200 touch-manipulation ${
                      currentStep === step.id
                        ? 'bg-slate-900 text-white scale-110'
                        : currentStep > step.id
                        ? 'bg-slate-600 text-white'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {step.id}
                  </button>
                  {index < STEPS.length - 1 && (
                    <div className={`w-4 h-0.5 mx-1 transition-colors duration-200 ${
                      currentStep > step.id ? 'bg-slate-600' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-1">
              <span className="text-xs font-medium text-slate-700 hidden sm:inline font-geist">
                {STEPS[currentStep - 1]?.name}
              </span>
            </div>
          </div>
          
          <div className="w-10 shrink-0" />
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1">
        {CurrentStepComponent && (
          <CurrentStepComponent
            cvData={cvData}
            updateCVData={updateCVData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </div>

      {/* Bottom navigation */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 safe-area-inset-bottom">
        <div className="flex justify-between items-center p-4">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            size="sm"
            className="touch-manipulation min-h-11 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium font-geist">
              {currentStep}/{STEPS.length}
            </span>
            <div className="w-16 bg-slate-200 rounded-full h-1">
              <div 
                className="bg-slate-900 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          <Button
            variant={currentStep === STEPS.length ? "default" : "default"}
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
    </div>
  );
};
