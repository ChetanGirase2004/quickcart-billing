import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, Shield, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';

const roles = [
  { role: 'customer' as UserRole, title: 'Customer', description: 'Scan products, pay via UPI, and get digital bills', icon: ShoppingCart, color: 'text-primary', bg: 'from-primary/10 to-primary/5' },
  { role: 'admin' as UserRole, title: 'Admin / Mall / Shop', description: 'Manage malls, shops, products, and view analytics', icon: Building2, color: 'text-accent', bg: 'from-accent/10 to-accent/5' },
  { role: 'guard' as UserRole, title: 'Exit Guard', description: 'Verify customer bills at exit gates', icon: Shield, color: 'text-success', bg: 'from-success/10 to-success/5' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (!selectedRole) return;
    if (selectedRole === 'customer') {
      navigate('/customer/auth');
    } else if (selectedRole === 'admin') {
      navigate('/admin/auth');
    } else {
      navigate('/guard/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex">
      {/* Left branding (desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-center p-16">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">QuickCart</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Smart Billing for<br /><span className="text-white/80">Smart Shoppers</span>
          </h1>
          <p className="text-lg text-white/70 mb-12 max-w-md">
            Scan products, pay instantly via UPI, and breeze through exits with your digital bill.
          </p>
          <div className="space-y-4">
            {['Scan & pay in seconds', 'Digital bills with QR verification', 'No queues, no hassle'].map((f, i) => (
              <motion.div key={f} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><Zap className="w-3 h-3" /></div>
                <span>{f}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right auth */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">QuickCart</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground mb-8">Select your role to continue</p>
            <div className="space-y-4 mb-8">
              {roles.map((r) => (
                <motion.button key={r.role} whileTap={{ scale: 0.98 }} onClick={() => setSelectedRole(r.role)}
                  className={`relative w-full p-5 rounded-2xl border-2 transition-all text-left ${selectedRole === r.role ? 'border-primary bg-primary/5 shadow-lg' : 'border-border hover:border-primary/50'}`}>
                  {selectedRole === r.role && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </motion.div>
                  )}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${r.bg}`}>
                    <r.icon className={`w-6 h-6 ${r.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground">{r.title}</h3>
                  <p className="text-sm text-muted-foreground">{r.description}</p>
                </motion.button>
              ))}
            </div>
            <Button size="lg" className="w-full" disabled={!selectedRole} onClick={handleContinue}>Continue</Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
