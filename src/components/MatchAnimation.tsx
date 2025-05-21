
import React from 'react';

interface MatchAnimationProps {
  type: 'job' | 'seeker';
}

const MatchAnimation: React.FC<MatchAnimationProps> = ({ type }) => {
  return (
    <div className="match-animation">
      <div className="match-content">
        <div className="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-reme-orange mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c6.23 0 11-4.77 11-11S18.23 0 12 0 1 4.77 1 11s4.77 11 11 11zm0-20c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z"/>
            <path d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08L12 17.27z"/>
          </svg>
        </div>
        
        <p className="match-text">It's a Match!</p>
        
        <p className="mb-6 text-gray-600">
          {type === 'job' 
            ? "You've matched with this employer!" 
            : "You've matched with this candidate!"}
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="py-2 px-4 bg-reme-orange text-white rounded-full">
            Send Message
          </button>
          <button className="py-2 px-4 bg-gray-200 text-gray-800 rounded-full">
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchAnimation;
