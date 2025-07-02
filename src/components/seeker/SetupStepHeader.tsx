
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
          className="mr-3 text-white hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 min-h-[44px] font-semibold shadow-lg"
          ripple={false}
          aria-label="Go back to previous step"
        >
          Back
        </AnimatedButton>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-geist animate-fade-in-scale drop-shadow-lg">
            {title}
          </h1>
          <p className="text-white text-base sm:text-lg font-geist mt-1 animate-fade-in-scale animate-delay-100 font-medium drop-shadow-md">
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
          <span className="text-sm font-geist text-white font-medium drop-shadow-md">Profile Completion</span>
          <span className="text-sm font-bold text-white font-geist drop-shadow-md">{progress}%</span>
        </div>
        <AnimatedProgress value={progress} animate={true} />
      </div>
    </>
  );
};

export default SetupStepHeader;
