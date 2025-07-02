
import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
  ripple?: boolean;
  glow?: boolean;
  pulse?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  className, 
  ripple = true,
  glow = false,
  pulse = false,
  onClick,
  disabled,
  ...props 
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (ripple) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 600);
    }
    onClick?.(e);
  };

  return (
    <Button
      className={cn(
        // Base styles for mobile-first design
        "relative overflow-hidden transition-all duration-300 ease-out transform",
        "min-h-[44px] touch-manipulation", // Ensure minimum touch target size
        "hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2",
        "focus-visible:ring-2 focus-visible:ring-white/50",
        // Improved disabled state
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none",
        glow && !disabled && "hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]",
        pulse && !disabled && "animate-pulse-gentle",
        "font-geist font-semibold",
        isClicked && !disabled && "animate-pulse",
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {ripple && !disabled && (
        <span 
          className={cn(
            "absolute inset-0 bg-white/30 rounded-full transform scale-0 transition-transform duration-600 ease-out",
            isClicked && "scale-100 opacity-0"
          )}
        />
      )}
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </Button>
  );
};

export default AnimatedButton;
