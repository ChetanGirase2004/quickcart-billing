import React from 'react';
import { useGuardAuth } from '@/contexts/GuardAuthContext';
import { Navigate } from 'react-router-dom';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useGuardAuth();

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

  return <>{children}</>;
};

export default AuthGuard;