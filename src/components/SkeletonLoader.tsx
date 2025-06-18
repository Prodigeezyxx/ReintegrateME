
import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'text' | 'avatar' | 'button';
  className?: string;
  lines?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  variant = 'text', 
  className = '',
  lines = 1
}) => {
  if (variant === 'card') {
    return (
      <div className={`ios-card overflow-hidden ${className}`}>
        <div className="h-64 skeleton-loader" />
        <div className="p-5 space-y-3">
          <div className="h-6 skeleton-loader w-3/4" />
          <div className="h-4 skeleton-loader w-1/2" />
          <div className="flex gap-2 mt-4">
            <div className="h-6 skeleton-loader w-16 rounded-full" />
            <div className="h-6 skeleton-loader w-20 rounded-full" />
            <div className="h-6 skeleton-loader w-14 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`flex items-center gap-3 p-4 ${className}`}>
        <div className="w-12 h-12 skeleton-loader rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 skeleton-loader w-3/4" />
          <div className="h-3 skeleton-loader w-1/2" />
        </div>
      </div>
    );
  }

  if (variant === 'avatar') {
    return <div className={`w-10 h-10 skeleton-loader rounded-xl ${className}`} />;
  }

  if (variant === 'button') {
    return <div className={`h-12 skeleton-loader rounded-xl ${className}`} />;
  }

  // Text variant
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className={`h-4 skeleton-loader ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`} 
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
