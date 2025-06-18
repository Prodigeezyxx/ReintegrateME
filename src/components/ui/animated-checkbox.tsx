
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AnimatedCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  className?: string;
  delay?: number;
}

const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  id,
  checked,
  onCheckedChange,
  label,
  className,
  delay = 0
}) => {
  return (
    <div 
      className={cn("flex items-center space-x-3 group animate-slide-up-stagger", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={cn(
            "transition-all duration-300 ease-out transform",
            "hover:scale-110 data-[state=checked]:scale-110",
            "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500",
            "border-2 hover:border-blue-400",
            checked && "animate-bounce-once"
          )}
        />
        {checked && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm opacity-20 animate-ping" />
        )}
      </div>
      <Label 
        htmlFor={id} 
        className={cn(
          "text-sm font-geist transition-all duration-300 cursor-pointer",
          "group-hover:text-blue-600 group-hover:translate-x-1",
          checked && "text-blue-700 font-medium"
        )}
      >
        {label}
      </Label>
    </div>
  );
};

export default AnimatedCheckbox;
