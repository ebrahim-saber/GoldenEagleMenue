import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { direction, t, language } = useLanguage();

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
            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: direction === 'rtl' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: direction === 'rtl' ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            dir={direction}
            className={`fixed top-0 h-full w-full max-w-md bg-surface-container-high z-[70] shadow-2xl flex flex-col font-headline ${
              direction === 'rtl' ? 'left-0 border-r border-white/10' : 'right-0 border-l border-white/10'
            }`}
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-white/5 flex justify-between items-center">
              <div className="space-y-0.5">
                <h2 className="text-xl font-black uppercase text-on-surface">{t('cart.title')}</h2>
                <p className="text-[11px] text-white/40 font-bold">{t('cart.tagline')}</p>
              </div>
              <button 
                onClick={closeCart}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white/70 hover:text-white"
                aria-label="Close cart"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-5 sm:p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                  <span className="material-symbols-outlined text-5xl text-white/20">shopping_bag</span>
                  <p className="text-white/40 text-xs font-bold leading-relaxed">
                    {t('cart.empty_title')} <br/>{t('cart.empty_desc')}
                  </p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <motion.div 
                    key={`${item.id}-${idx}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 p-3 bg-white/[0.02] rounded-2xl border border-white/5 group items-center"
                  >
                    <div className="h-20 w-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface border border-white/5">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                    </div>
                    
                    <div className="flex-grow min-w-0 space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-xs font-bold uppercase text-on-surface truncate group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <button 
                          onClick={() => removeFromCart(item.id, item.customizations)}
                          className="text-white/30 hover:text-error transition-colors p-1"
                          title={language === 'ar' ? 'حذف' : 'Remove'}
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                      
                      {item.customizations?.ingredients && item.customizations.ingredients.length > 0 && (
                        <p className="text-[10px] text-white/40 truncate">
                          {item.customizations.ingredients.join(' · ')}
                        </p>
                      )}

                      <div className="flex justify-between items-center pt-1">
                        <div className="flex items-center bg-white/5 rounded-lg border border-white/5">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.customizations)}
                            className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white"
                          >
                            <span className="material-symbols-outlined text-xs">remove</span>
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.customizations)}
                            className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white"
                          >
                            <span className="material-symbols-outlined text-xs">add</span>
                          </button>
                        </div>
                        <span className="text-xs font-black text-tertiary">
                          {(item.price * item.quantity).toFixed(0)} {t('currency')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout Action */}
            {cart.length > 0 && (
              <div className="p-5 sm:p-6 border-t border-white/10 bg-surface-container-low space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-white/50">
                    <span>{t('cart.subtotal')}</span>
                    <span className="font-bold text-white/80">{totalPrice.toFixed(2)} {t('currency')}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/50">
                    <span>{t('cart.service_vat')}</span>
                    <span className="text-primary font-bold">{t('cart.calculated_at_checkout')}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-xs uppercase font-black text-on-surface">{t('cart.estimated_total')}</span>
                    <span className="text-lg font-black text-tertiary">{totalPrice.toFixed(2)} {t('currency')}</span>
                  </div>
                </div>

                <Link to="/checkout" onClick={closeCart} className="block">
                  <button className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold uppercase tracking-wider text-xs shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>{t('cart.proceed_checkout')}</span>
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
