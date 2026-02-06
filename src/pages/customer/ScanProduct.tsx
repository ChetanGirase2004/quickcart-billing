import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Plus, Minus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { mockProducts } from '@/data/mockData';
import { Product } from '@/types';

export default function ScanProduct() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isScanning && !scannedProduct) {
      const timer = setTimeout(() => {
        setScannedProduct(mockProducts[Math.floor(Math.random() * mockProducts.length)]);
        setIsScanning(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isScanning, scannedProduct]);

  const handleAdd = () => {
    if (scannedProduct) {
      addToCart(scannedProduct, quantity);
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); setScannedProduct(null); setQuantity(1); setIsScanning(true); }, 1500);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-900 relative">
      <div className="relative aspect-square w-full max-w-md mx-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="relative w-full aspect-square">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
            {isScanning && <motion.div className="absolute left-0 right-0 h-0.5 bg-primary" animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 2, repeat: Infinity }} />}
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><Camera className="w-16 h-16 text-white/20" /></div>
        <div className="absolute bottom-12 left-0 right-0 text-center"><p className="text-white/70 text-sm">{isScanning ? 'Align barcode within frame' : 'Product detected!'}</p></div>
      </div>

      <AnimatePresence>
        {scannedProduct && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl p-6">
            <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-6" />
            {showSuccess ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center py-8">
                <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center mb-4"><Check className="w-10 h-10 text-white" /></div>
                <h3 className="text-xl font-bold">Added to Cart!</h3>
              </motion.div>
            ) : (
              <>
                <div className="flex gap-4 mb-6">
                  <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center"><Camera className="w-8 h-8 text-muted-foreground" /></div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">{scannedProduct.shopName}</p>
                    <h3 className="text-lg font-semibold mb-1">{scannedProduct.name}</h3>
                    <p className="text-sm text-muted-foreground">{scannedProduct.category}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-4 border-y border-border mb-6">
                  <div><p className="text-2xl font-bold">₹{scannedProduct.price.toFixed(2)}</p><p className="text-xs text-muted-foreground">+₹{scannedProduct.tax.toFixed(2)} tax</p></div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                    <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => { setScannedProduct(null); setIsScanning(true); }}>Scan Again</Button>
                  <Button className="flex-1" onClick={handleAdd}>Add to Cart</Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => navigate('/customer')} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white"><X className="w-5 h-5" /></button>
    </div>
  );
}
