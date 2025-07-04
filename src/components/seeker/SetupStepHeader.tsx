
import React from 'react';
import AnimatedButton from '../ui/animated-button';
import AnimatedProgress from '../ui/animated-progress';
import { getLogoUrl } from '../../utils/logoUpload';

interface SetupStepHeaderProps {
  title: string;
  description: string;
  progress: number;
  onBack: () => void;
}

const SetupStepHeader: React.FC<SetupStepHeaderProps> = ({
  title,
  description,
  progress,
  onBack
}) => {
  return (
    <>
      {/* Header with improved text contrast */}
      <div className="flex items-center mb-6 sm:mb-8 animate-slide-up-stagger">
        <AnimatedButton 
          variant="ghost" 
          size="icon" 
          onClick={onBack} 
          className="mr-3 text-slate-900 hover:bg-slate-100 backdrop-blur-md rounded-full border border-slate-300 min-h-[44px] font-semibold shadow-lg bg-white/90"
          ripple={false}
          aria-label="Go back to previous step"
        >
          Back
        </AnimatedButton>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-geist animate-fade-in-scale drop-shadow-sm">
            {title}
          </h1>
          <p className="text-slate-700 text-base sm:text-lg font-geist mt-1 animate-fade-in-scale animate-delay-100 font-medium drop-shadow-sm">
            {description}
          </p>
        </div>
        <div className="ml-4">
          <img 
            src={getLogoUrl()} 
            alt="ReintegrateME"
            className="h-10 w-10 sm:h-12 sm:w-12 animate-float drop-shadow-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Progress bar with improved contrast */}
      <div className="mb-6 sm:mb-8 animate-slide-up-stagger animate-delay-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-geist text-slate-700 font-medium drop-shadow-sm">Profile Completion</span>
          <span className="text-sm font-bold text-slate-900 font-geist drop-shadow-sm">{progress}%</span>
        </div>
        <AnimatedProgress value={progress} animate={true} />
      </div>
    </>
  );
};

export default SetupStepHeader;
