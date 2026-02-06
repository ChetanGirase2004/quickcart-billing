import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Check, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockTransactions } from '@/data/mockData';

const statusConfig = {
  completed: { icon: Check, color: 'text-success', bg: 'bg-success/10', label: 'Completed' },
  pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending' },
  failed: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Failed' },
};

export default function TransactionsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Transactions</h1><p className="text-muted-foreground">View and manage payments</p></div>
        <Button variant="outline"><Download className="w-4 h-4" />Export</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search transactions..." className="pl-10" /></div>
        <Button variant="outline"><Filter className="w-4 h-4" />Filters</Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Transaction ID</TableHead><TableHead>Customer</TableHead><TableHead>Mall / Shop</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
          <TableBody>
            {mockTransactions.map((txn) => {
              const status = statusConfig[txn.status];
              const StatusIcon = status.icon;
              return (
                <TableRow key={txn.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{txn.billId}</TableCell>
                  <TableCell>{txn.customerName}</TableCell>
                  <TableCell><div><p>{txn.mallName}</p><p className="text-xs text-muted-foreground">{txn.shopName}</p></div></TableCell>
                  <TableCell className="font-semibold">₹{txn.amount.toFixed(2)}</TableCell>
                  <TableCell><div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${status.bg}`}><StatusIcon className={`w-3 h-3 ${status.color}`} /><span className={`text-xs font-medium ${status.color}`}>{status.label}</span></div></TableCell>
                  <TableCell className="text-muted-foreground">{new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}
