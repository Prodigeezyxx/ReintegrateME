
import React from 'react';
import { getLogoUrl, getFallbackLogoUrl } from '../../utils/logoUpload';

interface LogoSectionProps {
  logoError: boolean;
  onLogoError: () => void;
  onLogoLoad: () => void;
}

const LogoSection: React.FC<LogoSectionProps> = ({ logoError, onLogoError, onLogoLoad }) => {
  const logoUrl = logoError ? getFallbackLogoUrl() : getLogoUrl();

  return (
    <div className="text-center mb-8">
      <div className="h-20 w-20 mx-auto mb-4">
        <img
          src={logoUrl}
          alt="ReintegrateMe Logo"
          className="w-full h-full object-contain"
          onError={onLogoError}
          onLoad={onLogoLoad}
          loading="eager"
          style={{ imageRendering: 'auto' }}
        />
      </div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">
        ReintegrateMe
      </h1>
      <p className="text-slate-600">Choose how you'd like to get started</p>
    </div>
  );
};

export default LogoSection;
