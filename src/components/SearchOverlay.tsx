import { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRAWAQ, getDishName, getDishDescription } from '../hooks/useRAWAQ';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const { menuItems } = useRAWAQ();
  const { direction, t, language } = useLanguage();

  const results = useMemo(() => {
    if (query.trim() === '') return menuItems.slice(0, 6);
    const q = query.toLowerCase();
    return menuItems.filter(p => {
      const nameEn = (p.name_en || p.name || '').toLowerCase();
      const nameAr = (p.name_ar || '').toLowerCase();
      const descEn = (p.description_en || p.description || '').toLowerCase();
      const descAr = (p.description_ar || '').toLowerCase();
      const ingEn = (p.ingredients_en || p.ingredients || []).join(' ').toLowerCase();
      const ingAr = (p.ingredients_ar || []).join(' ').toLowerCase();
      return (
        nameEn.includes(q) ||
        nameAr.includes(q) ||
        descEn.includes(q) ||
        descAr.includes(q) ||
        ingEn.includes(q) ||
        ingAr.includes(q)
      );
    });
  }, [query, menuItems]);

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
          className="fixed inset-0 bg-background/95 backdrop-blur-2xl z-[100] p-6 sm:p-10 md:p-16 overflow-y-auto font-headline"
          dir={direction}
        >
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
              <span className="text-tertiary font-bold uppercase tracking-wider text-xs">
                {t('search.title')}
              </span>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all"
                aria-label="Close search"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Search Input Box */}
            <div className="relative mb-10">
              <input 
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 sm:py-5 text-lg sm:text-2xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-all ${
                  direction === 'rtl' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'
                }`}
              />
              <span className={`absolute top-1/2 -translate-y-1/2 material-symbols-outlined text-2xl text-white/30 pointer-events-none ${
                direction === 'rtl' ? 'right-4' : 'left-4'
              }`}>
                search
              </span>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {results.length > 0 ? (
                  results.map((product) => {
                    const dishName = getDishName(product, language);
                    const dishDesc = getDishDescription(product, language);
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group"
                      >
                        <Link 
                          to={`/product/${product.id}`} 
                          onClick={onClose}
                          className="flex gap-4 items-center p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container-high border border-white/5 hover:border-white/15 transition-all"
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface">
                            <img 
                              src={product.image_url} 
                              alt={dishName} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex justify-between items-center gap-2">
                              <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">
                                {dishName}
                              </h4>
                              <span className="text-primary text-xs font-black shrink-0">
                                {product.price} {t('currency')}
                              </span>
                            </div>
                            <p className="text-xs text-white/40 line-clamp-1">{dishDesc}</p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-16 text-center text-white/30 space-y-2">
                    <span className="material-symbols-outlined text-4xl">search_off</span>
                    <p className="text-xs font-bold uppercase tracking-wider">{t('search.no_matches')}</p>
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
