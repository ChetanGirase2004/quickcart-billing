import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function GuardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-success flex items-center justify-center"><Shield className="w-4 h-4 text-white" /></div>
            <div><h1 className="text-sm font-semibold">QuickCart Guard</h1><p className="text-xs text-muted-foreground">Gate 1 - Phoenix MarketCity</p></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right mr-2"><p className="text-sm font-medium">{user?.name || 'Guard'}</p><p className="text-xs text-muted-foreground">On Duty</p></div>
            <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"><LogOut className="w-4 h-4 text-muted-foreground" /></button>
          </div>
        </div>
      </header>
      <main><Outlet /></main>
    </div>
  );
}
