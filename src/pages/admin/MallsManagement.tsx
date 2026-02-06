import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MoreVertical, MapPin, Clock, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { mockMalls } from '@/data/mockData';

export default function MallsManagement() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Malls</h1><p className="text-muted-foreground">Manage mall configurations</p></div>
        <Button><Plus className="w-4 h-4" />Add Mall</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search malls..." className="pl-10" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMalls.map((mall, i) => (
          <motion.div key={mall.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"><Store className="w-12 h-12 text-primary/40" /></div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div><h3 className="font-semibold">{mall.name}</h3><div className="flex items-center gap-1 text-sm text-muted-foreground mt-1"><MapPin className="w-3 h-3" /><span>{mall.location}</span></div></div>
                  <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"><MoreVertical className="w-4 h-4 text-muted-foreground" /></button>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4"><Clock className="w-3 h-3" /><span>{mall.operatingHours}</span></div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div><p className="text-2xl font-bold">{mall.shopCount}</p><p className="text-xs text-muted-foreground">Shops</p></div>
                  <div><p className="text-2xl font-bold">{mall.gateCount}</p><p className="text-xs text-muted-foreground">Exit Gates</p></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
