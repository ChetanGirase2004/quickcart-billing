import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';

const CustomerProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, role, loading } = useCustomerAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-foreground" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/customer/auth" replace />;
  }

  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (role === 'guard') {
    return <Navigate to="/guard" replace />;
  }

  return <>{children}</>;
};

export default CustomerProtectedRoute;
