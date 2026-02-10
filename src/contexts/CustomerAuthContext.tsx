import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { clearUserSession, getCurrentUserSession } from '@/services/guardAuth';

type CustomerRole = 'customer' | 'admin' | 'guard' | null;

interface SessionUser {
  uid: string;
  role: 'customer' | 'guard';
  displayName?: string;
  phoneNumber?: string;
}

interface CustomerAuthContextType {
  currentUser: SessionUser | null;
  role: CustomerRole;
  isCustomer: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};

export const CustomerAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [role, setRole] = useState<CustomerRole>(null);
  const [loading, setLoading] = useState(true);

  const syncCustomerSession = () => {
    const sessionUser = getCurrentUserSession();

    if (!sessionUser) {
      setCurrentUser(null);
      setRole(null);
      setLoading(false);
      return;
    }

    setCurrentUser(sessionUser);
    setRole(sessionUser.role);
    setLoading(false);
  };

  const logout = async () => {
    await clearUserSession();
    syncCustomerSession();
  };

  useEffect(() => {
    syncCustomerSession();

    const handleAuthChange = () => {
      syncCustomerSession();
    };

    window.addEventListener('quickcart-auth-changed', handleAuthChange);
    return () => {
      window.removeEventListener('quickcart-auth-changed', handleAuthChange);
    };
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      role,
      isCustomer: role === 'customer',
      loading,
      logout
    }),
    [currentUser, role, loading, logout]
  );

  return <CustomerAuthContext.Provider value={value}>{!loading && children}</CustomerAuthContext.Provider>;
};
