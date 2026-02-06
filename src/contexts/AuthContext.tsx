import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (role: UserRole, credentials: { phone?: string; email?: string; guardId?: string }) => Promise<void>;
  logout: () => void;
  selectRole: (role: UserRole) => void;
  selectedRole: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
  customer: { id: 'cust-001', name: 'Rahul Sharma', phone: '+91 98765 43210', role: 'customer' },
  admin: { id: 'admin-001', name: 'Priya Patel', email: 'admin@quickcart.com', role: 'admin' },
  guard: { id: 'guard-001', name: 'Vikram Singh', role: 'guard' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    role: null,
  });
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const selectRole = (role: UserRole) => setSelectedRole(role);

  const login = async (role: UserRole) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setAuthState({ user: mockUsers[role], isAuthenticated: true, role });
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false, role: null });
    setSelectedRole(null);
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, selectRole, selectedRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
