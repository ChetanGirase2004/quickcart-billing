import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, ArrowLeft, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';

export default function CustomerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const { logout } = useCustomerAuth();
  const isHome = location.pathname === '/customer';
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getTitle = (path: string) => {
    if (path.includes('/scan')) return 'Scan Product';
    if (path.includes('/cart')) return 'Your Cart';
    if (path.includes('/checkout')) return 'Checkout';
    if (path.includes('/bill/')) return 'Digital Bill';
    if (path.includes('/bills')) return 'My Bills';
    return '';
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            {!isHome ? (
              <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted">
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold">QuickCart</h1>
                  <p className="text-xs text-muted-foreground">Phoenix MarketCity</p>
                </div>
              </div>
            )}
            {!isHome && <h1 className="text-lg font-semibold">{getTitle(location.pathname)}</h1>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/customer/cart')} className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted" aria-label="View cart">
              <ShoppingCart className="w-5 h-5" />
              {cart.totalItems > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                  {cart.totalItems}
                </motion.span>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
              aria-label="Sign out"
            >
              <User className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={handleLogout}
              className="hidden sm:flex w-10 h-10 rounded-full bg-muted items-center justify-center hover:bg-muted/80"
              aria-label="Sign out"
            >
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>
      <main><Outlet /></main>
    </div>
  );
}
