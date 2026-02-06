import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Shield, Check, Loader2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const upiApps = [
  { id: 'gpay', name: 'Google Pay', color: '#4285F4' },
  { id: 'phonepe', name: 'PhonePe', color: '#5F259F' },
  { id: 'paytm', name: 'Paytm', color: '#00BAF2' },
  { id: 'other', name: 'Other UPI', color: '#00897B' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'processing' | 'success'>('select');

  const handlePay = async () => {
    if (!selected) return;
    setStep('processing');
    await new Promise((r) => setTimeout(r, 2500));
    setStep('success');
    setTimeout(() => { clearCart(); navigate('/customer/bill/new'); }, 2000);
  };

  if (cart.items.length === 0) { navigate('/customer/cart'); return null; }

  return (
    <div className="px-4 py-6">
      {step === 'select' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-xl bg-card border border-border p-4 mb-6">
            <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">Order Summary</h3><span className="text-sm text-muted-foreground">{cart.totalItems} items</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Total</span><span className="text-2xl font-bold">₹{cart.total.toFixed(2)}</span></div>
          </div>
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">Pay with UPI</h3>
            <div className="grid grid-cols-2 gap-3">
              {upiApps.map((app) => (
                <motion.button key={app.id} whileTap={{ scale: 0.98 }} onClick={() => setSelected(app.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${selected === app.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  {selected === app.id && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"><Check className="w-3 h-3 text-white" /></motion.div>}
                  <div className="w-10 h-10 rounded-lg mb-2 flex items-center justify-center" style={{ backgroundColor: `${app.color}20` }}><Wallet className="w-5 h-5" style={{ color: app.color }} /></div>
                  <p className="font-medium text-sm">{app.name}</p>
                </motion.button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-success/5 border border-success/20 mb-8"><Shield className="w-5 h-5 text-success" /><p className="text-sm text-muted-foreground">Secured with bank-grade encryption</p></div>
          <Button size="lg" className="w-full bg-accent hover:bg-accent/90" onClick={handlePay} disabled={!selected}><CreditCard className="w-5 h-5" />Pay ₹{cart.total.toFixed(2)}</Button>
        </motion.div>
      )}
      {step === 'processing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"><Smartphone className="w-12 h-12 text-primary" /></div>
            <motion.div className="absolute inset-0 rounded-full border-4 border-primary" animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          </div>
          <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
          <p className="text-muted-foreground mb-4">Complete on your UPI app</p>
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </motion.div>
      )}
      {step === 'success' && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="w-24 h-24 rounded-full bg-success flex items-center justify-center mb-6"><Check className="w-12 h-12 text-white" /></motion.div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground">Your digital bill is ready</p>
        </motion.div>
      )}
    </div>
  );
}
