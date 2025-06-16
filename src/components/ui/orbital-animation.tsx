
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OrbitalElementProps {
  radius: number;
  duration: number;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

const OrbitalElement: React.FC<OrbitalElementProps> = ({ 
  radius, 
  duration, 
  delay = 0, 
  children, 
  className 
}) => {
  return (
    <div
      className={cn("orbital-element", className)}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transformOrigin: '0 0',
        animation: `orbit-${radius} ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
        '--radius': `${radius}px`
      } as React.CSSProperties}
    >
      <div
        className="orbital-item"
        style={{
          position: 'absolute',
          transform: `translate(-50%, -50%) translateX(${radius}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

interface OrbitAnimationProps {
  size?: number;
  children?: React.ReactNode;
  className?: string;
  showOrbits?: boolean;
}

const OrbitAnimation: React.FC<OrbitAnimationProps> = ({ 
  size = 300, 
  children, 
  className,
  showOrbits = true 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create dynamic keyframes for different orbit sizes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes orbit-80 {
        from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
        to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
      }
      @keyframes orbit-120 {
        from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
        to { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
      }
      @keyframes orbit-160 {
        from { transform: rotate(0deg) translateX(160px) rotate(0deg); }
        to { transform: rotate(360deg) translateX(160px) rotate(-360deg); }
      }
      @keyframes orbit-200 {
        from { transform: rotate(0deg) translateX(200px) rotate(0deg); }
        to { transform: rotate(360deg) translateX(200px) rotate(-360deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn("relative", className)}
      style={{ width: size, height: size }}
    >
      {showOrbits && (
        <>
          <div className="absolute inset-0 rounded-full border border-white/20 opacity-30" />
          <div className="absolute inset-4 rounded-full border border-white/20 opacity-40" />
          <div className="absolute inset-8 rounded-full border border-white/20 opacity-50" />
          <div className="absolute inset-12 rounded-full border border-white/20 opacity-60" />
        </>
      )}
      
      {/* Center element */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        {children}
      </div>
    </div>
  );
};

export { OrbitAnimation, OrbitalElement };
