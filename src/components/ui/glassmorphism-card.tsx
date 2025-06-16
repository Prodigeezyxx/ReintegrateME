
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'strong';
}

const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({ 
  children, 
  className,
  variant = 'default'
}) => {
  const variants = {
    default: 'bg-white/20 backdrop-blur-md border border-white/30',
    subtle: 'bg-white/10 backdrop-blur-sm border border-white/20',
    strong: 'bg-white/30 backdrop-blur-lg border border-white/40'
  };

  return (
    <div className={cn(
      "rounded-xl shadow-xl",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
};

export default GlassmorphismCard;
