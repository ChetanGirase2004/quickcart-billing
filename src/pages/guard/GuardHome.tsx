import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScanLine, History, Clock, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockVerificationRecords } from '@/data/mockData';

export default function GuardHome() {
  const navigate = useNavigate();
  const stats = { verified: 24, flagged: 2, pending: 3 };

  return (
    <div className="px-4 py-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-center"><Check className="w-5 h-5 text-success mx-auto mb-2" /><p className="text-2xl font-bold">{stats.verified}</p><p className="text-xs text-muted-foreground">Verified</p></div>
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center"><AlertTriangle className="w-5 h-5 text-destructive mx-auto mb-2" /><p className="text-2xl font-bold">{stats.flagged}</p><p className="text-xs text-muted-foreground">Flagged</p></div>
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 text-center"><Clock className="w-5 h-5 text-warning mx-auto mb-2" /><p className="text-2xl font-bold">{stats.pending}</p><p className="text-xs text-muted-foreground">Pending</p></div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8">
        <Button size="lg" className="w-32 h-32 rounded-full bg-primary shadow-lg mb-6" onClick={() => navigate('/guard/scan')}><ScanLine className="w-12 h-12" /></Button>
        <h2 className="text-xl font-bold mb-2">Scan Bill QR</h2>
        <p className="text-muted-foreground text-center text-sm">Scan customer's bill to verify payment</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Recent Verifications</h3><button onClick={() => navigate('/guard/history')} className="text-sm text-primary flex items-center gap-1"><History className="w-4 h-4" />View All</button></div>
        <div className="space-y-3">
          {mockVerificationRecords.slice(0, 3).map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.status === 'allowed' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  {record.status === 'allowed' ? <Check className="w-5 h-5 text-success" /> : <AlertTriangle className="w-5 h-5 text-destructive" />}
                </div>
                <div><p className="font-medium">{record.billId}</p><p className="text-xs text-muted-foreground">{new Date(record.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p></div>
              </div>
              <div className="text-right"><p className="font-semibold">₹{record.totalAmount.toFixed(2)}</p><p className="text-xs text-muted-foreground">{record.itemCount} items</p></div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
