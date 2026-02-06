import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Check, AlertTriangle, ShoppingBag, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Step = 'scanning' | 'result' | 'note';

export default function GuardScanPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('scanning');
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const billSummary = { billId: 'BILL-2024-001', paymentStatus: 'paid' as const, itemCount: 5, categories: [{ category: 'Groceries', count: 2 }, { category: 'Electronics', count: 1 }, { category: 'Apparel', count: 2 }], priceRange: '₹1,000 - ₹5,000' };

  useEffect(() => {
    if (step === 'scanning') {
      const timer = setTimeout(() => setStep('result'), 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleAllow = async () => { setIsProcessing(true); await new Promise((r) => setTimeout(r, 1000)); navigate('/guard'); };
  const handleFlag = async () => { setIsProcessing(true); await new Promise((r) => setTimeout(r, 1000)); navigate('/guard'); };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-900 relative">
      {step === 'scanning' && (
        <div className="relative aspect-square w-full max-w-md mx-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800" />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="relative w-full aspect-square">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-success rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-success rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-success rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-success rounded-br-lg" />
              <motion.div className="absolute left-0 right-0 h-0.5 bg-success" animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 2, repeat: Infinity }} />
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><Camera className="w-16 h-16 text-white/20" /></div>
          <div className="absolute bottom-12 left-0 right-0 text-center"><p className="text-white/70 text-sm">Scan customer's bill QR code</p></div>
        </div>
      )}

      <AnimatePresence>
        {(step === 'result' || step === 'note') && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl">
            <div className="w-10 h-1 rounded-full bg-muted mx-auto mt-4 mb-6" />
            {step === 'result' ? (
              <div className="px-6 pb-8">
                <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${billSummary.paymentStatus === 'paid' ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'}`}>
                  {billSummary.paymentStatus === 'paid' ? <Check className="w-8 h-8 text-success" /> : <AlertTriangle className="w-8 h-8 text-destructive" />}
                  <div><h3 className="font-bold">{billSummary.paymentStatus === 'paid' ? 'Payment Verified' : 'Payment Pending'}</h3><p className="text-sm text-muted-foreground">Bill ID: {billSummary.billId}</p></div>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50"><div className="flex items-center gap-3"><ShoppingBag className="w-5 h-5 text-muted-foreground" /><span>Item Count</span></div><span className="font-bold">{billSummary.itemCount} items</span></div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50"><div className="flex items-center gap-3"><CreditCard className="w-5 h-5 text-muted-foreground" /><span>Price Range</span></div><span className="font-bold">{billSummary.priceRange}</span></div>
                  <div className="p-4 rounded-xl bg-muted/50"><p className="text-sm text-muted-foreground mb-3">Categories</p><div className="flex flex-wrap gap-2">{billSummary.categories.map((cat) => <span key={cat.category} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">{cat.category} ({cat.count})</span>)}</div></div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep('note')} disabled={isProcessing}><AlertTriangle className="w-4 h-4" />Hold & Flag</Button>
                  <Button className="flex-1 bg-success hover:bg-success/90" onClick={handleAllow} disabled={isProcessing}>{isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}Allow Exit</Button>
                </div>
              </div>
            ) : (
              <div className="px-6 pb-8">
                <h3 className="text-lg font-bold mb-4">Add Note</h3>
                <Textarea placeholder="Describe the issue..." value={note} onChange={(e) => setNote(e.target.value)} className="mb-4" rows={4} />
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep('result')}>Back</Button>
                  <Button variant="destructive" className="flex-1" onClick={handleFlag} disabled={isProcessing}>{isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}Flag Bill</Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => navigate('/guard')} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white"><X className="w-5 h-5" /></button>
    </div>
  );
}
