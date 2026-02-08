import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { checkGuardStatus } from '@/services/guardAuth';
import { Guard } from '@/types/guard';

interface GuardAuthContextType {
  currentUser: User | null;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [guardData, setGuardData] = useState<Guard | null>(null);
  const [isGuard, setIsGuard] = useState(false);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      setGuardData(null);
      setIsGuard(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        
        // Check if user is guard
        const guardStatus = await checkGuardStatus(user.uid);
        if (guardStatus.isGuard && guardStatus.guardData) {
          setGuardData(guardStatus.guardData);
          setIsGuard(true);
        } else {
          setGuardData(null);
          setIsGuard(false);
        }
      } else {
        setCurrentUser(null);
        setGuardData(null);
        setIsGuard(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    guardData,
    isGuard,
    loading,
    logout
  };

  return (
    <GuardAuthContext.Provider value={value}>
      {!loading && children}
    </GuardAuthContext.Provider>
  );
};