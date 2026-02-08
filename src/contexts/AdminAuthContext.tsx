import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { checkAdminStatus } from '@/services/adminAuth';
import { Admin } from '@/types/admin';

interface AdminAuthContextType {
  currentUser: User | null;
  adminData: Admin | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminData, setAdminData] = useState<Admin | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      setAdminData(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        
        // Check if user is admin
        const adminStatus = await checkAdminStatus(user.uid);
        if (adminStatus.isAdmin && adminStatus.adminData) {
          setAdminData(adminStatus.adminData);
          setIsAdmin(true);
        } else {
          setAdminData(null);
          setIsAdmin(false);
        }
      } else {
        setCurrentUser(null);
        setAdminData(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    adminData,
    isAdmin,
    loading,
    logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {!loading && children}
    </AdminAuthContext.Provider>
  );
};