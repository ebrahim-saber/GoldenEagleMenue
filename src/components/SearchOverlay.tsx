import { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRAWAQ } from '../hooks/useRAWAQ';
import { Link } from 'react-router-dom';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const { menuItems } = useRAWAQ();

  // Derive results reactively — no setState in effect
  const results = useMemo(() => {
    if (query.trim() === '') return menuItems.slice(0, 4);
    const q = query.toLowerCase();
    return menuItems.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.ingredients.some(i => i.toLowerCase().includes(q))
    );
  }, [query, menuItems]);



  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/95 backdrop-blur-2xl z-[100] p-8 md:p-20 overflow-y-auto"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <span className="text-tertiary font-headline font-bold uppercase tracking-[0.3em] text-[10px]">Search the Collection</span>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all hover:border-white/30"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="relative mb-20">
              <input 
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you craving?"
                className="w-full bg-transparent border-b-2 border-white/10 py-6 text-3xl md:text-5xl font-headline font-extrabold text-white placeholder:text-white/10 focus:outline-none focus:border-primary transition-all pr-12"
              />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 material-symbols-outlined text-3xl text-white/20">search</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <AnimatePresence mode="popLayout">
                {results.length > 0 ? (
                  results.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <Link 
                        to={`/product/${product.id}`} 
                        onClick={onClose}
                        className="flex gap-6 items-center p-4 rounded-2xl hover:bg-white/5 transition-all divide-x divide-white/5"
                      >
                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-low">
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        </div>
                        <div className="pl-6 flex-1">
                          <h4 className="text-lg font-headline font-bold text-white mb-1 group-hover:text-primary transition-colors">{product.name}</h4>
                          <p className="text-xs text-white/40 line-clamp-1 mb-2">{product.description}</p>
                          <span className="text-tertiary text-xs font-headline font-bold tracking-tight">SAR {product.price}</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center opacity-20">
                    <p className="text-2xl font-headline italic">No matches found in our current archives.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
