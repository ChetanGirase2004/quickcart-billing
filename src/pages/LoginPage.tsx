import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Zap, ArrowLeft, Smartphone, Mail, Shield, Loader2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

const roles = [
  { role: 'customer' as UserRole, title: 'Customer', description: 'Scan products, pay via UPI, and get digital bills', icon: ShoppingCart, color: 'text-primary', bg: 'from-primary/10 to-primary/5' },
  { role: 'admin' as UserRole, title: 'Admin / Mall / Shop', description: 'Manage malls, shops, products, and view analytics', icon: Building2, color: 'text-accent', bg: 'from-accent/10 to-accent/5' },
  { role: 'guard' as UserRole, title: 'Exit Guard', description: 'Verify customer bills at exit gates', icon: Shield, color: 'text-success', bg: 'from-success/10 to-success/5' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { selectedRole, selectRole, login } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');

  const handleContinue = () => selectedRole && setShowLoginForm(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'admin') {
      setIsLoading(true);
      await login(selectedRole, {});
      navigate('/admin/auth');
    } else if (step === 'credentials') {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 1000));
      setIsLoading(false);
      setStep('otp');
    } else {
      setIsLoading(true);
      await login(selectedRole!, {});
      if (selectedRole === 'customer') {
        navigate('/customer');
      } else if (selectedRole === 'guard') {
        navigate('/guard/auth');
      }
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

          <AnimatePresence mode="wait">
            {!showLoginForm ? (
              <motion.div key="role" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
                <p className="text-muted-foreground mb-8">Select your role to continue</p>
                <div className="space-y-4 mb-8">
                  {roles.map((r) => (
                    <motion.button key={r.role} whileTap={{ scale: 0.98 }} onClick={() => selectRole(r.role)}
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
            ) : (
              <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => { setShowLoginForm(false); setStep('credentials'); }} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
                  <ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">Back to role selection</span>
                </button>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {selectedRole === 'customer' ? 'Customer Login' : selectedRole === 'admin' ? 'Admin Login' : 'Guard Login'}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {selectedRole === 'customer' ? 'Enter your mobile number' : selectedRole === 'admin' ? 'Sign in to your dashboard' : 'Enter your Guard ID'}
                </p>
                <form onSubmit={handleLogin} className="space-y-6">
                  {step === 'credentials' ? (
                    <>
                      {selectedRole === 'customer' && (
                        <div className="space-y-2">
                          <Label>Mobile Number</Label>
                          <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input placeholder="+91 98765 43210" className="pl-11 h-12" required />
                          </div>
                        </div>
                      )}
                      {selectedRole === 'admin' && (
                        <>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                              <Input type="email" placeholder="admin@quickcart.com" className="pl-11 h-12" required />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Password</Label>
                            <Input type="password" placeholder="••••••••" className="h-12" required />
                          </div>
                        </>
                      )}
                      {selectedRole === 'guard' && (
                        <div className="space-y-2">
                          <Label>Guard ID</Label>
                          <div className="relative">
                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input placeholder="GRD-001" className="pl-11 h-12" required />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <p className="text-sm text-muted-foreground">We've sent a 6-digit OTP to your {selectedRole === 'customer' ? 'phone' : 'device'}</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Enter OTP</Label>
                        <Input placeholder="000000" className="h-12 text-center text-2xl tracking-[0.5em] font-mono" maxLength={6} required />
                      </div>
                    </div>
                  )}
                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />{step === 'credentials' ? 'Sending...' : 'Verifying...'}</> : step === 'credentials' ? (selectedRole === 'admin' ? 'Sign In' : 'Send OTP') : 'Verify & Continue'}
                  </Button>
                </form>
                <p className="mt-8 text-center text-xs text-muted-foreground">Demo: Any credentials work</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
