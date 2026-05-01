import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRAWAQ } from '../hooks/useRAWAQ';
import { useNotification } from '../context/NotificationContext';

const Checkout = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { showNotification } = useNotification();
  const { createOrder } = useRAWAQ();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [instructions, setInstructions] = useState('');

  const serviceFee = totalPrice * 0.1;
  const vat = (totalPrice + serviceFee) * 0.15;
  const finalTotal = totalPrice + serviceFee + vat;

  const handlePlaceOrder = async () => {
    if (!user) {
      showNotification('Please sign in to complete your order.', 'info');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      showNotification('Selection empty. Please return to the menu.', 'error');
      return;
    }

    try {
      const orderData = {
        customer_id: user.id,
        customer_name: user.user_metadata.full_name || 'Guest',
        customer_phone: user.user_metadata.phone || 'N/A',
        table_number: 'T-VIP', // Placeholder for actual selection
        total_amount: finalTotal,
        note: instructions
      };

      const orderItems = cart.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price
      }));

      await createOrder(orderData, orderItems);

      showNotification('Your masterpiece is being prepared.', 'success');
      clearCart();
      navigate('/');
    } catch (err) {
      console.error('Checkout error:', err);
      showNotification('There was an error placing your order.', 'error');
    }
  };

  return (
    <div className="pt-16 pb-32 px-6 md:px-12 max-w-[1920px] mx-auto min-h-screen font-headline">
      {/* Editorial Header */}
      <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-tertiary text-[10px] font-black tracking-[0.5em] uppercase">
            <span className="w-12 h-[1px] bg-tertiary"></span>
            <span>Final Review</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-on-surface uppercase leading-none">Order <br/>Summary</h1>
        </div>
        <div className="text-left md:text-right space-y-2">
          <p className="text-white/20 uppercase text-[10px] tracking-widest font-bold">Reservation ID: #RWQ-8829</p>
          <p className="text-white/40 uppercase text-xs tracking-tight font-medium italic">Rawaq Fine Dining — Imperial Plaza</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
        {/* Selection List */}
        <div className="lg:col-span-7 space-y-16">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-8 block">Selected Items</label>
            <div className="space-y-8">
              <AnimatePresence mode="popLayout">
                {cart.map((item, idx) => (
                  <motion.div
                    key={`${item.id}-${idx}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-8 group"
                  >
                    <div className="w-32 h-40 overflow-hidden rounded-2xl bg-[#121413] flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                      />
                    </div>
                    <div className="flex-1 space-y-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-black text-on-surface tracking-tighter uppercase">{item.name}</h3>
                          {item.customizations?.ingredients && (
                            <p className="text-[9px] text-white/30 uppercase tracking-widest mt-2 leading-relaxed">
                              {item.customizations.ingredients.join(' • ')}
                            </p>
                          )}
                        </div>
                        <span className="text-xl font-light text-primary">SAR {item.price * item.quantity}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                        <div className="flex items-center bg-white/[0.03] rounded-xl p-1 border border-white/5">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.customizations)}
                            className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="w-8 text-center font-black text-on-surface text-sm tracking-tighter">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.customizations)}
                            className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.customizations)}
                          className="text-white/10 hover:text-error transition-all p-2"
                        >
                          <span className="material-symbols-outlined text-xl">delete_sweep</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Maître d' Section */}
          <div className="space-y-8 bg-white/[0.01] p-12 rounded-3xl border border-white/5">
            <div className="flex items-center gap-4 text-tertiary">
              <span className="material-symbols-outlined text-xl">stylus</span>
              <label className="text-[10px] font-black uppercase tracking-[0.3em]">Special culinary requests</label>
            </div>
            <textarea 
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 p-0 text-on-surface placeholder:text-white/10 focus:border-primary h-24 resize-none text-lg font-light transition-all outline-none" 
              placeholder="Ex: No dairy in the appetisers, seating near the terrace..."
            ></textarea>
          </div>
        </div>

        {/* Billing Column */}
        <div className="lg:col-span-5 sticky top-36">
          <div className="bg-white/[0.02] p-12 rounded-[2rem] border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] space-y-12">
            <h2 className="text-3xl font-black text-on-surface uppercase tracking-tighter">Billing details</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Culinary Experience</span>
                <span className="text-sm font-bold text-on-surface">SAR {totalPrice.toFixed(2)}</span>
              </div>
              <div className="pt-10 border-t border-white/10 flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.5em] text-tertiary font-black block">Total Experience</span>
                  <p className="text-[9px] text-white/20 uppercase tracking-widest leading-none">Settlement at Venue</p>
                </div>
                <span className="text-5xl font-black text-on-surface tracking-tighter">SAR {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-6">
              <button 
                onClick={handlePlaceOrder}
                className="w-full bg-primary text-on-primary py-7 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] hover:brightness-110 active:scale-[0.98] transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-6"
              >
                Confirm Selection <span className="w-2 h-2 rounded-full bg-on-primary/30"></span> NOTIFY CHEF
              </button>

              <div className="flex items-center gap-6 p-6 bg-tertiary/[0.03] rounded-2xl border border-tertiary/10">
                <span className="material-symbols-outlined text-tertiary text-2xl">mail</span>
                <div className="space-y-1">
                  <p className="text-[10px] text-tertiary font-black uppercase tracking-[0.2em]">Imperial Confirmation</p>
                  <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">You will receive an email once the Chef confirms</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-8 border-t border-white/5 opacity-20">
              <span className="text-[8px] uppercase tracking-[0.3em] font-bold">Secure Reservation</span>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-xl">shield</span>
                <span className="material-symbols-outlined text-xl">verified_user</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
