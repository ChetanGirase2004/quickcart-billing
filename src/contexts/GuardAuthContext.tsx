import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkGuardStatus, clearUserSession, getCurrentUserSession } from '@/services/guardAuth';
import { Guard } from '@/types/guard';

interface SessionUser {
  uid: string;
  role: 'customer' | 'guard';
  displayName?: string;
  phoneNumber?: string;
}

interface GuardAuthContextType {
  currentUser: SessionUser | null;
  guardData: Guard | null;
  isGuard: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const GuardAuthContext = createContext<GuardAuthContextType | undefined>(undefined);

export const useGuardAuth = () => {
  const context = useContext(GuardAuthContext);
  if (context === undefined) {
    throw new Error('useGuardAuth must be used within a GuardAuthProvider');
  }
  return context;
};

interface GuardAuthProviderProps {
  children: ReactNode;
}

export const GuardAuthProvider: React.FC<GuardAuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [guardData, setGuardData] = useState<Guard | null>(null);
  const [isGuard, setIsGuard] = useState(false);
  const [loading, setLoading] = useState(true);

  const syncGuardSession = async () => {
    const sessionUser = getCurrentUserSession();

    if (!sessionUser || sessionUser.role !== 'guard') {
      setCurrentUser(null);
      setGuardData(null);
      setIsGuard(false);
      setLoading(false);
      return;
    }

    const guardStatus = await checkGuardStatus(sessionUser.uid);
    if (guardStatus.isGuard && guardStatus.guardData) {
      setCurrentUser(sessionUser);
      setGuardData(guardStatus.guardData);
      setIsGuard(true);
    } else {
      setCurrentUser(null);
      setGuardData(null);
      setIsGuard(false);
    }

    setLoading(false);
  };

  const logout = async () => {
    await clearUserSession();
    await syncGuardSession();
  };

  useEffect(() => {
    syncGuardSession();

    const handleAuthChange = () => {
      syncGuardSession();
    };

    window.addEventListener('quickcart-auth-changed', handleAuthChange);
    return () => {
      window.removeEventListener('quickcart-auth-changed', handleAuthChange);
    };
  }, []);

  const value = {
    currentUser,
    guardData,
    isGuard,
    loading,
    logout
  };

  return <GuardAuthContext.Provider value={value}>{!loading && children}</GuardAuthContext.Provider>;
};
