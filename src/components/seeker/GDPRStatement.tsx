
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
      className="glassmorphism border border-blue-400/20 bg-gradient-to-r from-blue-50/70 to-blue-100/70 py-3 px-4"
    >
      <div className="flex items-start space-x-2">
        <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            {title}
          </h3>
          <div className="space-y-2 text-xs text-blue-800">
            <div>
              <h4 className="font-normal mb-1">Why we ask for this:</h4>
              <p>{whyWeAsk}</p>
            </div>
            <div>
              <h4 className="font-normal mb-1">How we handle this:</h4>
              <p>{howWeHandle}</p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default GDPRStatement;
