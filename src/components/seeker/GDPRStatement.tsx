
import React from 'react';
import { Shield } from 'lucide-react';
import AnimatedCard from '../ui/animated-card';

interface GDPRStatementProps {
  title: string;
  whyWeAsk: string;
  howWeHandle: string;
  delay?: number;
}

const GDPRStatement: React.FC<GDPRStatementProps> = ({
  title,
  whyWeAsk,
  howWeHandle,
  delay = 50
}) => {
  return (
    <AnimatedCard
      delay={delay}
      className="glassmorphism border-2 border-blue-400/30 bg-gradient-to-r from-blue-50/90 to-blue-100/90"
    >
      <div className="flex items-start space-x-3">
        <Shield className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            {title}
          </h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-1">Why we ask for this:</h4>
              <p>{whyWeAsk}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">How we handle this:</h4>
              <p>{howWeHandle}</p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default GDPRStatement;
