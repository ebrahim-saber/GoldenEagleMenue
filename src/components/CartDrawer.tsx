import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface z-[70] shadow-2xl border-l border-white/5 flex flex-col font-headline"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tighter uppercase text-on-surface">Your Order</h2>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Rawaq Fine Dining</p>
              </div>
              <button 
                onClick={closeCart}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <span className="material-symbols-outlined text-6xl text-white/5 font-light">shopping_bag</span>
                  <p className="text-white/20 uppercase tracking-widest text-xs font-bold leading-relaxed">
                    Your collection is currently empty. <br/>Begin your journey in the menu.
                  </p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <motion.div 
                    key={`${item.id}-${idx}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-6 group"
                  >
                    <div className="h-24 w-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-low border border-white/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div className="flex-grow space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold uppercase tracking-tight text-on-surface group-hover:text-primary transition-colors">{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id, item.customizations)}
                          className="text-white/20 hover:text-error transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                      
                      {item.customizations?.ingredients && (
                        <p className="text-[9px] text-white/30 uppercase tracking-tighter line-clamp-1">
                          {item.customizations.ingredients.join(' • ')}
                        </p>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/5 scale-75 origin-left">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.customizations)}
                            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-primary"
                          >
                            <span className="material-symbols-outlined text-xs">remove</span>
                          </button>
                          <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.customizations)}
                            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-primary"
                          >
                            <span className="material-symbols-outlined text-xs">add</span>
                          </button>
                        </div>
                        <span className="text-xs font-bold text-tertiary">SAR {item.price * item.quantity}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-white/10 bg-surface-container-low space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Subtotal</span>
                    <span className="text-sm font-bold text-white/60">SAR {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Service & VAT</span>
                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Included</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-xs uppercase tracking-[0.3em] text-on-surface font-black">Total</span>
                    <span className="text-xl font-black text-tertiary tracking-tighter">SAR {totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/checkout" onClick={closeCart} className="block">
                  <button className="w-full bg-primary text-on-primary py-5 rounded-xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-4">
                    Place Reservation <span className="w-1.5 h-1.5 rounded-full bg-on-primary opacity-30"></span> Continue
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
