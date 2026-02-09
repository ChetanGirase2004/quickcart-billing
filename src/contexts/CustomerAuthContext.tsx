import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { checkAdminStatus } from '@/services/adminAuth';
import { checkGuardStatus } from '@/services/guardAuth';

type CustomerRole = 'customer' | 'admin' | 'guard' | null;

interface CustomerAuthContextType {
  currentUser: User | null;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<CustomerRole>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      setRole(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      setCurrentUser(user);
      try {
        const [adminStatus, guardStatus] = await Promise.all([
          checkAdminStatus(user.uid),
          checkGuardStatus(user.uid)
        ]);

        if (adminStatus.isAdmin) {
          setRole('admin');
        } else if (guardStatus.isGuard) {
          setRole('guard');
        } else {
          setRole('customer');
        }
      } catch (error) {
        console.error('Error determining user role:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      role,
      isCustomer: role === 'customer',
      loading,
      logout
    }),
    [currentUser, role, loading]
  );

  return (
    <CustomerAuthContext.Provider value={value}>
      {!loading && children}
    </CustomerAuthContext.Provider>
  );
};
