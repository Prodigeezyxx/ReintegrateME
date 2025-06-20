
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
        className="text-slate-800 hover:text-slate-900 transition-colors disabled:opacity-50 font-medium text-base flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-lg hover:bg-slate-100 min-h-[44px]"
        disabled={isNavigating}
      >
        {isNavigating ? 'Loading...' : 'Back to Start'}
      </button>
    </div>
  );
};

export default BackButton;
