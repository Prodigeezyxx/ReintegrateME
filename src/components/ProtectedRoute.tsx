
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'hirer' | 'seeker';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/unified-auth" replace />;
  }

  if (requireRole && user.role !== requireRole) {
    if (!user.role) {
      return <Navigate to="/role-selection" replace />;
    }
    // Redirect to appropriate dashboard if user has wrong role
    return <Navigate to={user.role === 'hirer' ? '/hirer-dashboard' : '/seeker-dashboard'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
