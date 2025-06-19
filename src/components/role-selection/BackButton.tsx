
import React from 'react';

interface BackButtonProps {
  onClick: () => void;
  isNavigating: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, isNavigating }) => {
  return (
    <div className="mt-8 text-center">
      <button 
        onClick={onClick}
        className="text-slate-800 hover:text-slate-900 transition-colors disabled:opacity-50 font-medium text-base flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-lg hover:bg-slate-100"
        disabled={isNavigating}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {isNavigating ? 'Loading...' : 'Back to Start'}
      </button>
    </div>
  );
};

export default BackButton;
