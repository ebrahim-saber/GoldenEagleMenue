import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingCart = () => {
  const { cart, totalPrice, toggleCart } = useCart();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-10 inset-x-0 mx-auto w-fit z-50 px-6"
      >
        <button 
          onClick={toggleCart}
          className="flex items-center gap-6 bg-[#121413]/80 border border-white/10 px-8 py-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl group hover:border-primary/50 transition-all hover:scale-[1.05] active:scale-95 ring-4 ring-primary/5"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined font-black">shopping_basket</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-0.5 leading-none">Your Selection</p>
              <p className="text-white font-headline font-black text-sm uppercase tracking-tighter">{totalItems} Signature {totalItems === 1 ? 'Dish' : 'Dishes'}</p>
            </div>
          </div>
          
          <div className="h-10 w-[1px] bg-white/10"></div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-0.5 leading-none">Subtotal</p>
              <p className="text-tertiary font-headline font-black text-sm tracking-tighter uppercase">SAR {totalPrice.toFixed(2)}</p>
            </div>
            <span className="material-symbols-outlined text-white/20 group-hover:text-primary transition-colors group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingCart;
