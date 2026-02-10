import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkAdminStatus, getCurrentAdminSession, logoutAdmin } from '@/services/adminAuth';
import { Admin } from '@/types/admin';

interface AdminSessionUser {
  uid: string;
  email: string;
}

interface AdminAuthContextType {
  currentUser: AdminSessionUser | null;
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
  const [currentUser, setCurrentUser] = useState<AdminSessionUser | null>(null);
  const [adminData, setAdminData] = useState<Admin | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const syncAdminSession = async () => {
    const sessionAdmin = getCurrentAdminSession();

    if (!sessionAdmin) {
      setCurrentUser(null);
      setAdminData(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const adminStatus = await checkAdminStatus(sessionAdmin.uid);
    if (adminStatus.isAdmin && adminStatus.adminData) {
      setCurrentUser({ uid: sessionAdmin.uid, email: sessionAdmin.email });
      setAdminData(adminStatus.adminData);
      setIsAdmin(true);
    } else {
      setCurrentUser(null);
      setAdminData(null);
      setIsAdmin(false);
    }

    setLoading(false);
  };

  const logout = async () => {
    await logoutAdmin();
    await syncAdminSession();
  };

  useEffect(() => {
    syncAdminSession();

    const handleAuthChange = () => {
      syncAdminSession();
    };

    window.addEventListener('quickcart-auth-changed', handleAuthChange);
    return () => {
      window.removeEventListener('quickcart-auth-changed', handleAuthChange);
    };
  }, []);

  const value = {
    currentUser,
    adminData,
    isAdmin,
    loading,
    logout
  };

  return <AdminAuthContext.Provider value={value}>{!loading && children}</AdminAuthContext.Provider>;
};
