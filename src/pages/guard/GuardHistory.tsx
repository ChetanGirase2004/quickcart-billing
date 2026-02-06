import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, Calendar } from 'lucide-react';
import { mockVerificationRecords } from '@/data/mockData';

export default function GuardHistory() {
  return (
    <div className="px-4 py-6 space-y-4">
      {mockVerificationRecords.map((record, i) => (
        <motion.div key={record.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.status === 'allowed' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                {record.status === 'allowed' ? <Check className="w-5 h-5 text-success" /> : <AlertTriangle className="w-5 h-5 text-destructive" />}
              </div>
              <div><p className="font-semibold">{record.billId}</p><div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full mt-1 ${record.paymentStatus === 'paid' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}><span className="text-xs font-medium">{record.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}</span></div></div>
            </div>
            <div className="text-right"><p className="font-bold">₹{record.totalAmount.toFixed(2)}</p><p className="text-xs text-muted-foreground">{record.itemCount} items</p></div>
          </div>
          {record.note && <div className="p-3 rounded-lg bg-muted/50 mb-3"><p className="text-sm text-muted-foreground">{record.note}</p></div>}
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="w-3 h-3" /><span>{new Date(record.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>
        </motion.div>
      ))}
    </div>
  );
}
