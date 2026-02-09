import React from 'react';
import { useGuardAuth } from '@/contexts/GuardAuthContext';
import { Navigate } from 'react-router-dom';

const GuardRoleGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isGuard, loading } = useGuardAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/guard/auth" replace />;
  }

  if (!isGuard) {
    // If user is logged in but not a guard, redirect to appropriate dashboard
    // In a real app, you might check their actual role and redirect accordingly
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default GuardRoleGuard;