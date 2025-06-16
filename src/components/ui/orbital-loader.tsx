
import React from 'react';
import { OrbitAnimation, OrbitalElement } from './orbital-animation';
import { cn } from '@/lib/utils';

interface OrbitalLoaderProps {
  size?: number;
  className?: string;
  message?: string;
}

const OrbitalLoader: React.FC<OrbitalLoaderProps> = ({ 
  size = 200, 
  className,
  message = "Loading..."
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <OrbitAnimation size={size} className="mb-4">
        {/* Center pulsing element */}
        <div className="w-12 h-12 bg-reme-orange rounded-full flex items-center justify-center animate-pulse">
          <div className="w-6 h-6 bg-white rounded-full opacity-80" />
        </div>
        
        {/* Orbital elements */}
        <OrbitalElement radius={80} duration={8} delay={0}>
          <div className="w-3 h-3 bg-reme-orange/60 rounded-full" />
        </OrbitalElement>
        
        <OrbitalElement radius={120} duration={12} delay={2}>
          <div className="w-2 h-2 bg-reme-purple/60 rounded-full" />
        </OrbitalElement>
        
        <OrbitalElement radius={160} duration={16} delay={4}>
          <div className="w-2 h-2 bg-reme-orange/40 rounded-full" />
        </OrbitalElement>
      </OrbitAnimation>
      
      {message && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default OrbitalLoader;
