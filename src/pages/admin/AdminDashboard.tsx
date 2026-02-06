import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDashboardStats, revenueChartData, categoryDistribution } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const stats = [
  { label: 'Total Revenue', value: `₹${(mockDashboardStats.totalRevenue / 100000).toFixed(1)}L`, change: mockDashboardStats.revenueChange, icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
  { label: 'Transactions', value: mockDashboardStats.transactionCount.toLocaleString(), change: mockDashboardStats.transactionChange, icon: ShoppingCart, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Active Users', value: mockDashboardStats.activeUsers.toLocaleString(), change: mockDashboardStats.userChange, icon: Users, color: 'text-accent', bg: 'bg-accent/10' },
  { label: 'Peak Hours', value: mockDashboardStats.peakHour, icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
];

const COLORS = ['hsl(173, 58%, 39%)', 'hsl(15, 90%, 60%)', 'hsl(160, 84%, 39%)', 'hsl(38, 92%, 50%)', 'hsl(215, 15%, 46.9%)'];

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-muted-foreground">Welcome back! Here's what's happening.</p></div>
        <div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">Last updated:</span><span className="font-medium">Just now</span></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card><CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
                {stat.change !== undefined && <div className={`flex items-center gap-1 text-sm font-medium ${stat.change >= 0 ? 'text-success' : 'text-destructive'}`}>{stat.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}{Math.abs(stat.change)}%</div>}
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent></Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card><CardHeader><CardTitle className="flex items-center justify-between"><span>Revenue Overview</span><span className="text-sm font-normal text-muted-foreground">This week</span></CardTitle></CardHeader>
            <CardContent><div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs><linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                  <XAxis dataKey="name" stroke="hsl(215, 15%, 46.9%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 15%, 46.9%)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip contentStyle={{ background: 'hsl(0, 0%, 100%)', border: '1px solid hsl(214, 20%, 88%)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(173, 58%, 39%)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div></CardContent></Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full"><CardHeader><CardTitle>Categories</CardTitle></CardHeader>
            <CardContent><div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                  {categoryDistribution.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {categoryDistribution.map((cat, i) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} /><span className="text-muted-foreground">{cat.name}</span></div>
                  <span className="font-medium">{cat.value}%</span>
                </div>
              ))}
            </div></CardContent></Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-warning" />Recent Alerts</CardTitle></CardHeader>
          <CardContent><div className="space-y-3">
            {[{ message: 'Payment verification pending for 3 bills', time: '5 min ago', type: 'warning' }, { message: 'New guard registered at Phoenix MarketCity', time: '1 hour ago', type: 'info' }, { message: 'Unusual activity detected at Gate 2', time: '2 hours ago', type: 'alert' }].map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted">
                <div className="flex items-center gap-3"><div className={`w-2 h-2 rounded-full ${alert.type === 'warning' ? 'bg-warning' : alert.type === 'alert' ? 'bg-destructive' : 'bg-primary'}`} /><span className="text-sm">{alert.message}</span></div>
                <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{alert.time}</span><ArrowUpRight className="w-4 h-4 text-muted-foreground" /></div>
              </div>
            ))}
          </div></CardContent></Card>
      </motion.div>
    </div>
  );
}
