import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Building2, Receipt, LogOut, ShoppingCart, Menu, X, ChevronLeft } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Malls', icon: Building2, path: '/admin/malls' },
  { label: 'Transactions', icon: Receipt, path: '/admin/transactions' },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminData, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const displayName = adminData?.adminName || 'Admin';
  const email = adminData?.email || '';

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Desktop Sidebar */}
      <aside className={cn('hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300', sidebarOpen ? 'w-64' : 'w-20')}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {sidebarOpen && <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center"><ShoppingCart className="w-4 h-4 text-sidebar-primary-foreground" /></div><span className="font-bold text-sidebar-foreground">QuickCart</span></div>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-8 h-8 rounded-lg hover:bg-sidebar-accent flex items-center justify-center text-sidebar-foreground">
            <ChevronLeft className={cn('w-4 h-4 transition-transform', !sidebarOpen && 'rotate-180')} />
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors', isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent')}>
                <item.icon className="w-5 h-5 shrink-0" />{sidebarOpen && <span className="text-sm font-medium truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center"><span className="text-sm font-semibold text-sidebar-foreground">{displayName.charAt(0)}</span></div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-sidebar-foreground truncate">{displayName}</p><p className="text-xs text-sidebar-foreground/60 truncate">{email}</p></div>
              <button onClick={handleLogout} className="w-8 h-8 rounded-lg hover:bg-sidebar-accent flex items-center justify-center text-sidebar-foreground"><LogOut className="w-4 h-4" /></button>
            </div>
          ) : <button onClick={handleLogout} className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground"><LogOut className="w-5 h-5" /></button>}
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><ShoppingCart className="w-4 h-4 text-white" /></div><span className="font-bold">QuickCart</span></div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center">{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:hidden fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />}
      <motion.aside initial={{ x: '-100%' }} animate={{ x: mobileMenuOpen ? 0 : '-100%' }} className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-sidebar flex flex-col">
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center"><ShoppingCart className="w-4 h-4 text-sidebar-primary-foreground" /></div><span className="font-bold text-sidebar-foreground">QuickCart</span></div>
          <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-lg hover:bg-sidebar-accent flex items-center justify-center text-sidebar-foreground"><X className="w-4 h-4" /></button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors', isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent')}>
                <item.icon className="w-5 h-5" /><span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </motion.aside>

      <main className="flex-1 lg:pt-0 pt-16 overflow-auto"><Outlet /></main>
    </div>
  );
}
