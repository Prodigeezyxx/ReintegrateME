
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
      {/* Header with black text */}
      <div className="flex items-centre mb-6 sm:mb-8 animate-slide-up-stagger">
        <AnimatedButton 
          variant="ghost" 
          size="icon" 
          onClick={onBack} 
          className="mr-3 text-white hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 min-h-[44px]"
          ripple={false}
        >
          Back
        </AnimatedButton>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-black font-geist animate-fade-in-scale">
            {title}
          </h1>
          <p className="text-black text-base sm:text-lg font-geist mt-1 animate-fade-in-scale animate-delay-100 font-medium">
            {description}
          </p>
        </div>
        <div className="ml-4">
          <img 
            src={getLogoUrl()} 
            alt="ReintegrateMe"
            className="h-10 w-10 sm:h-12 sm:w-12 animate-float"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Progress bar with black text */}
      <div className="mb-6 sm:mb-8 animate-slide-up-stagger animate-delay-200">
        <div className="flex items-centre justify-between mb-3">
          <span className="text-sm font-geist text-black font-medium">Profile Completion</span>
          <span className="text-sm font-bold text-black font-geist">{progress}%</span>
        </div>
        <AnimatedProgress value={progress} animate={true} />
      </div>
    </>
  );
};

export default SetupStepHeader;
