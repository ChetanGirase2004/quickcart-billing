import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </motion.div>
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground text-center mb-8">Start scanning products to add them</p>
        <Button onClick={() => navigate('/customer/scan')}>Scan Products</Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">{cart.totalItems} item{cart.totalItems > 1 ? 's' : ''}</p>
        <button onClick={clearCart} className="flex items-center gap-2 text-sm text-destructive"><Trash2 className="w-4 h-4" />Clear</button>
      </div>

      <div className="space-y-4 mb-8">
        <AnimatePresence>
          {cart.items.map((item, i) => (
            <motion.div key={item.product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ delay: i * 0.05 }}
              className="flex gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0"><ShoppingBag className="w-6 h-6 text-muted-foreground" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{item.product.shopName}</p>
                <h3 className="font-medium truncate">{item.product.name}</h3>
                <p className="text-sm font-semibold text-primary mt-1">₹{(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-full border border-border flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                  <span className="w-6 text-center font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="rounded-xl bg-card border border-border p-4 mb-6">
        <h3 className="font-semibold mb-4">Price Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{cart.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Tax (GST)</span><span>₹{cart.totalTax.toFixed(2)}</span></div>
          <div className="h-px bg-border" />
          <div className="flex justify-between text-base font-semibold"><span>Total</span><span className="text-primary">₹{cart.total.toFixed(2)}</span></div>
        </div>
      </div>

      <Button size="lg" className="w-full" onClick={() => navigate('/customer/checkout')}>Proceed to Checkout<ChevronRight className="w-5 h-5" /></Button>
      <button onClick={() => navigate('/customer/scan')} className="w-full text-center text-sm text-primary mt-4">+ Add more items</button>
    </div>
  );
}
