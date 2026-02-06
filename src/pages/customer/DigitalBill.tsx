import React from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Check, Calendar, MapPin, ShoppingBag, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockBills } from '@/data/mockData';

export default function DigitalBill() {
  const bill = mockBills[0];

  return (
    <div className="px-4 py-6 pb-24">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success mb-4"><Check className="w-4 h-4" /><span className="text-sm font-medium">Payment Verified</span></div>
        <h1 className="text-2xl font-bold mb-1">Digital Bill</h1>
        <p className="text-muted-foreground">Bill ID: {bill.id}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative p-6 bg-white rounded-2xl shadow-lg mx-auto w-64 h-64 mb-8">
        <div className="absolute inset-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl flex items-center justify-center">
          <div className="relative w-40 h-40">
            <div className="grid grid-cols-8 gap-1 w-full h-full">
              {Array.from({ length: 64 }).map((_, i) => <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-foreground' : ''}`} />)}
            </div>
            <div className="absolute inset-0 flex items-center justify-center"><div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center"><QrCode className="w-5 h-5 text-white" /></div></div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card border border-border overflow-hidden mb-6">
        <div className="p-4 bg-muted/30 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><MapPin className="w-5 h-5 text-primary" /></div>
            <div><h3 className="font-semibold">{bill.mallName}</h3><div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="w-3 h-3" /><span>{new Date(bill.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div></div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Items ({bill.items.length})</h4>
          {bill.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><ShoppingBag className="w-4 h-4 text-muted-foreground" /></div><div><p className="text-sm font-medium">{item.product.name}</p><p className="text-xs text-muted-foreground">{item.quantity} × ₹{item.product.price}</p></div></div>
              <p className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="p-4 bg-muted/30 border-t border-border space-y-2">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>₹{bill.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax</span><span>₹{bill.totalTax.toFixed(2)}</span></div>
          <div className="h-px bg-border" />
          <div className="flex justify-between text-lg font-bold"><span>Total Paid</span><span className="text-primary">₹{bill.total.toFixed(2)}</span></div>
        </div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button variant="outline" className="flex-1"><Download className="w-4 h-4" />Download</Button>
          <Button variant="outline" className="flex-1"><Share2 className="w-4 h-4" />Share</Button>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">Show this QR at exit gate</p>
    </div>
  );
}
