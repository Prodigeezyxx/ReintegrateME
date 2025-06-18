
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserRole } from '../models/types';

const RoleSelection = () => {
  const navigate = useNavigate();
  
  const handleRoleSelection = (role: UserRole) => {
    localStorage.setItem('selectedRole', role);
    navigate('/auth', { state: { role, mode: 'signup' } });
  };
  
  return (
    <div className="mobile-container p-6">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="h-20 w-20 rounded-2xl overflow-hidden mb-10">
          <img 
            src="/lovable-uploads/8c0cc7ea-9ba0-44bd-8baf-1606a7e2bdb8.png" 
            alt="ReME Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-3">Welcome to ReME</h1>
        <p className="text-gray-600 text-center mb-10">Tell us who you are to get started</p>
        
        <div className="space-y-4 w-full">
          <Button
            className="w-full py-6 text-lg bg-reme-orange hover:bg-orange-600 transition-colors"
            onClick={() => handleRoleSelection('hirer')}
          >
            I want to hire talent
          </Button>
          
          <Button
            className="w-full py-6 text-lg bg-reme-purple hover:bg-purple-700 transition-colors"
            onClick={() => handleRoleSelection('seeker')}
          >
            I'm looking for a job
          </Button>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-2">Already have an account?</p>
            <button 
              className="text-reme-orange font-medium"
              onClick={() => navigate('/auth', { state: { mode: 'login' } })}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
