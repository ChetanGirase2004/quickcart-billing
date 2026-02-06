import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScanBarcode, ShoppingCart, CreditCard, Receipt, MapPin, Settings, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const actions = [
  { id: 'scan', label: 'Scan Product', desc: 'Scan barcode to add items', icon: ScanBarcode, path: '/customer/scan', primary: true },
  { id: 'cart', label: 'View Cart', desc: 'Review your items', icon: ShoppingCart, path: '/customer/cart' },
  { id: 'checkout', label: 'Checkout & Pay', desc: 'Pay via UPI', icon: CreditCard, path: '/customer/checkout' },
  { id: 'bills', label: 'My Bills', desc: 'Order history', icon: Receipt, path: '/customer/bills' },
];

export default function CustomerHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart } = useCart();

  return (
    <div className="px-4 py-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-primary p-6 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4" /><span className="text-sm text-white/80">Good afternoon</span></div>
          <h2 className="text-2xl font-bold mb-1">Hi, {user?.name?.split(' ')[0] || 'there'}! 👋</h2>
          <p className="text-white/70 text-sm">Ready to shop? Start scanning to add items.</p>
        </div>
      </motion.div>

      {cart.totalItems > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-accent/10 border border-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center"><ShoppingCart className="w-5 h-5 text-white" /></div>
              <div><p className="font-semibold">{cart.totalItems} items in cart</p><p className="text-sm text-muted-foreground">Total: ₹{cart.total.toFixed(2)}</p></div>
            </div>
            <Button size="sm" onClick={() => navigate('/customer/checkout')}>Checkout</Button>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((a, i) => (
            <motion.button key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => navigate(a.path)}
              className={`relative p-4 rounded-2xl text-left transition-all ${a.primary ? 'col-span-2 bg-primary text-white shadow-lg' : 'bg-card border border-border hover:border-primary/50'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${a.primary ? 'bg-white/20' : 'bg-primary/10'}`}>
                <a.icon className={`w-6 h-6 ${a.primary ? 'text-white' : 'text-primary'}`} />
              </div>
              <h4 className={`font-semibold mb-1 ${a.primary ? 'text-white' : 'text-foreground'}`}>{a.label}</h4>
              <p className={`text-sm ${a.primary ? 'text-white/70' : 'text-muted-foreground'}`}>{a.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {[{ label: 'Change Mall', icon: MapPin }, { label: 'Settings', icon: Settings }].map((item, i) => (
          <motion.button key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><item.icon className="w-5 h-5 text-muted-foreground" /></div>
              <span className="font-medium">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
