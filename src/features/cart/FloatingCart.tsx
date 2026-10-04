import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingCart = () => {
  const { cart, totalPrice, toggleCart } = useCart();
  const { direction, t } = useLanguage();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-6 sm:bottom-8 inset-x-0 mx-auto w-fit z-50 px-4"
        dir={direction}
      >
        <button 
          onClick={toggleCart}
          className="flex items-center gap-4 sm:gap-6 bg-surface-container-high/95 border border-primary/30 px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl shadow-2xl backdrop-blur-xl group hover:border-primary transition-all hover:scale-[1.02] active:scale-95 ring-4 ring-primary/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-md shrink-0">
              <span className="material-symbols-outlined text-xl">shopping_basket</span>
            </div>
            <div className={direction === 'rtl' ? 'text-right' : 'text-left'}>
              <p className="text-[10px] font-black uppercase tracking-wider text-primary leading-none">
                {t('cart.floating_selection')}
              </p>
              <p className="text-white font-bold text-xs uppercase mt-1">
                {totalItems} {t('cart.dishes_selected')}
              </p>
            </div>
          </div>
          
          <div className="h-7 w-[1px] bg-white/10" />
          
          <div className="flex items-center gap-3">
            <div className={direction === 'rtl' ? 'text-right' : 'text-left'}>
              <p className="text-[10px] text-white/40 uppercase leading-none">{t('cart.subtotal')}</p>
              <p className="text-tertiary font-black text-sm tracking-tight mt-1">
                {totalPrice.toFixed(0)} {t('currency')}
              </p>
            </div>
            <span className={`material-symbols-outlined text-white/30 group-hover:text-primary transition-colors text-base ${
              direction === 'rtl' ? 'rotate-180' : ''
            }`}>
              arrow_forward_ios
            </span>
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingCart;
