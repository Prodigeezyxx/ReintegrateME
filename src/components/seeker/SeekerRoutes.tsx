
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SeekerProfileSetupStep1 from './SeekerProfileSetupStep1';
import SeekerSkillsStep from './SeekerSkillsStep';
import SeekerProfileSetupStep2 from './SeekerProfileSetupStep2';
import SeekerProfileSetupStep3 from './SeekerProfileSetupStep3';
import SeekerProfileSetupStep4 from './SeekerProfileSetupStep4';

const SeekerRoutes = () => {
  return (
    <Routes>
      <Route path="/seeker-setup-step1" element={<SeekerProfileSetupStep1 />} />
      <Route path="/seeker-skills-step" element={<SeekerSkillsStep />} />
      <Route path="/seeker-setup-step2" element={<SeekerProfileSetupStep2 />} />
      <Route path="/seeker-setup-step3" element={<SeekerProfileSetupStep3 />} />
      <Route path="/seeker-setup-step4" element={<SeekerProfileSetupStep4 />} />
    </Routes>
  );
};

export default SeekerRoutes;
