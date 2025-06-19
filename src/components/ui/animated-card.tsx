
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  title?: string;
  description?: string;
  onClick?: () => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className, 
  delay = 0,
  hover = true,
  title,
  description,
  onClick
}) => {
  return (
    <Card 
      className={cn(
        "transform transition-all duration-700 ease-out animate-slide-up backdrop-blur-sm",
        "bg-white/80 border-white/20 shadow-xl hover:shadow-2xl",
        hover && "hover:scale-[1.02] hover:-translate-y-1",
        "animate-fade-in",
        onClick && "cursor-pointer",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      {title && (
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-geist bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {title}
          </CardTitle>
          {description && (
            <p className="text-sm text-slate-600 font-geist">{description}</p>
          )}
        </CardHeader>
      )}
      <CardContent className={title ? "pt-0" : undefined}>
        {children}
      </CardContent>
    </Card>
  );
};

export default AnimatedCard;
