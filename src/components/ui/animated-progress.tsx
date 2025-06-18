
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface AnimatedProgressProps {
  value: number;
  className?: string;
  showPercentage?: boolean;
  animate?: boolean;
}

const AnimatedProgress: React.FC<AnimatedProgressProps> = ({ 
  value, 
  className, 
  showPercentage = true,
  animate = true 
}) => {
  return (
    <div className={cn("relative w-full", className)}>
      <Progress 
        value={value} 
        className={cn(
          "h-3 bg-gradient-to-r from-slate-100 to-slate-200 overflow-hidden",
          animate && "transition-all duration-1000 ease-out"
        )}
      />
      <div 
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-full transition-all duration-1000 ease-out"
        style={{
          width: `${value}%`,
          background: value === 100 
            ? 'linear-gradient(45deg, #10b981, #059669, #047857)' 
            : 'linear-gradient(45deg, #3b82f6, #8b5cf6, #f97316)'
        }}
      />
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-white mix-blend-difference">
            {value}%
          </span>
        </div>
      )}
    </div>
  );
};

export default AnimatedProgress;
