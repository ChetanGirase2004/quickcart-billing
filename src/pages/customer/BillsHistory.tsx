import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Check, Clock, AlertTriangle } from 'lucide-react';
import { mockBills } from '@/data/mockData';

const statusConfig = {
  verified: { icon: Check, color: 'text-success', bg: 'bg-success/10', label: 'Verified' },
  pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending' },
  flagged: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Flagged' },
};

export default function BillsHistory() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6 space-y-4">
      {mockBills.map((bill, i) => {
        const status = statusConfig[bill.verificationStatus];
        const StatusIcon = status.icon;
        return (
          <motion.button key={bill.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => navigate(`/customer/bill/${bill.id}`)}
            className="w-full p-4 rounded-xl bg-card border border-border hover:border-primary/50 text-left">
            <div className="flex items-start justify-between mb-3">
              <div><h3 className="font-semibold">{bill.mallName}</h3><div className="flex items-center gap-2 text-sm text-muted-foreground mt-1"><Calendar className="w-3 h-3" /><span>{new Date(bill.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div></div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${status.bg}`}><StatusIcon className={`w-3 h-3 ${status.color}`} /><span className={`text-xs font-medium ${status.color}`}>{status.label}</span></div>
            </div>
            <div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{bill.items.reduce((sum, item) => sum + item.quantity, 0)} items</p><p className="text-lg font-bold">₹{bill.total.toFixed(2)}</p></div><ChevronRight className="w-5 h-5 text-muted-foreground" /></div>
          </motion.button>
        );
      })}
    </div>
  );
}
