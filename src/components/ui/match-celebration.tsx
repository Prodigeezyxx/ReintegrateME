
import React, { useEffect, useState } from 'react';
import { OrbitAnimation, OrbitalElement } from './orbital-animation';
import GlassmorphismCard from './glassmorphism-card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchCelebrationProps {
  isVisible: boolean;
  onClose: () => void;
  onSendMessage: () => void;
  matchType?: 'job' | 'seeker';
}

const MatchCelebration: React.FC<MatchCelebrationProps> = ({
  isVisible,
  onClose,
  onSendMessage,
  matchType = 'job'
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setAnimationPhase(0);
      const timer1 = setTimeout(() => setAnimationPhase(1), 500);
      const timer2 = setTimeout(() => setAnimationPhase(2), 1500);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/80 to-blue-900/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
      <GlassmorphismCard className="p-8 text-center max-w-sm w-full">
        <OrbitAnimation size={200} className="mb-6 mx-auto">
          {/* Center celebration icon */}
          <div className={cn(
            "w-16 h-16 bg-gradient-to-br from-reme-orange to-yellow-500 rounded-full flex items-center justify-center transition-all duration-1000",
            animationPhase >= 1 ? "scale-100 rotate-0" : "scale-0 rotate-180"
          )}>
            <Star className="w-8 h-8 text-white" />
          </div>
          
          {/* Celebration particles */}
          {animationPhase >= 1 && (
            <>
              <OrbitalElement radius={60} duration={6} delay={0}>
                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              </OrbitalElement>
              
              <OrbitalElement radius={80} duration={8} delay={1}>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              </OrbitalElement>
              
              <OrbitalElement radius={100} duration={10} delay={2}>
                <Star className="w-3 h-3 text-blue-400 animate-pulse" />
              </OrbitalElement>
              
              <OrbitalElement radius={120} duration={12} delay={3}>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </OrbitalElement>
            </>
          )}
        </OrbitAnimation>
        
        <div className={cn(
          "transition-all duration-800",
          animationPhase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <h2 className="text-2xl font-bold text-white mb-2">
            🎉 It's a Match!
          </h2>
          
          <p className="text-white/80 mb-6">
            {matchType === 'job' 
              ? "You've matched with this opportunity!" 
              : "You've matched with this candidate!"}
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={onSendMessage}
              className="w-full bg-reme-orange hover:bg-orange-600 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Keep Exploring
            </Button>
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  );
};

export default MatchCelebration;
