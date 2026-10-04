import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  useRAWAQ,
  getDishName,
  getDishDescription,
  getDishIngredients,
  getDishTag,
  getDishCalories,
  getCategoryTitle
} from '../../hooks/useRAWAQ';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { menuItems, categories, loading } = useRAWAQ();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const { language, direction, t } = useLanguage();

  const filteredProducts = useMemo(() => {
    let items = activeCategory === 'all'
      ? menuItems
      : menuItems.filter(p => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(p => {
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
    }
    return items;
  }, [menuItems, activeCategory, searchQuery]);

  const popularItems = useMemo(() => menuItems.filter(p => p.is_popular).slice(0, 3), [menuItems]);

  const handleQuickAdd = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    const dishName = getDishName(item, language);
    addToCart({
      id: item.id,
      name: dishName,
      price: item.price,
      image: item.image_url,
      quantity: 1,
      customizations: {
        ingredients: getDishIngredients(item, language)
      }
    });
    showNotification(`"${dishName}" ${t('menu.added_notification')}`, 'success');
  };

  if (loading && menuItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em]">
          {language === 'ar' ? 'جاري تحميل قائمة الطعام الملكية...' : 'Loading Signature Menu...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-headline" dir={direction}>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[46vh] sm:min-h-[52vh] flex items-end pb-12 sm:pb-16 px-4 sm:px-8 md:px-12 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/70 to-surface z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(156,210,181,0.08),transparent)]" />

        <div className="relative z-20 w-full max-w-[1920px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-4 sm:space-y-6 max-w-3xl"
          >
            <div className="flex items-center gap-3 text-tertiary text-xs font-black uppercase tracking-[0.3em]">
              <span className="w-8 sm:w-12 h-[2px] bg-tertiary" />
              <span>{t('hero.tag')}</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-on-surface uppercase leading-[0.95]">
              {t('hero.title_part1')} <br />
              <span className="text-gradient-gold">{t('hero.title_part2')}</span>
            </h1>
            
            <p className="text-white/60 max-w-xl font-light text-sm sm:text-base md:text-lg leading-relaxed">
              {t('hero.desc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Popular Picks ────────────────────────────────────────────────────── */}
      {popularItems.length > 0 && !searchQuery && activeCategory === 'all' && (
        <section className="px-4 sm:px-8 md:px-12 pb-12 sm:pb-16 max-w-[1920px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary text-lg">star</span>
              <h2 className="text-xs sm:text-sm font-black text-white/60 uppercase tracking-[0.2em]">
                {t('menu.chefs_picks')}
              </h2>
            </div>
            <div className="h-[1px] flex-1 mx-4 sm:mx-6 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {popularItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={`/product/${item.id}`}
                  className="group block relative rounded-2xl overflow-hidden aspect-[16/11] bg-surface-container-low border border-white/5 shadow-xl hover:border-primary/30 transition-all"
                >
                  <img
                    src={item.image_url || '/placeholder-food.jpg'}
                    alt={getDishName(item, language)}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                  
                  <div className="absolute top-4 right-4 px-3 py-1 bg-tertiary text-on-tertiary text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                    {getDishTag(item, language)}
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-5 flex justify-between items-end gap-3">
                    <div className="min-w-0">
                      <span className="text-tertiary text-[10px] font-black uppercase tracking-wider block mb-1">
                        {getDishCalories(item, language)}
                      </span>
                      <h3 className="text-white font-bold text-sm sm:text-base uppercase tracking-tight truncate">
                        {getDishName(item, language)}
                      </h3>
                    </div>
                    <span className="text-primary font-black text-base whitespace-nowrap">
                      {item.price} <span className="text-xs font-normal text-white/50">{t('currency')}</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Mobile Category Horizontal Scroll Bar ────────────────────────────── */}
      <div className="lg:hidden px-4 sm:px-8 mb-6 sticky top-16 z-30 bg-surface/90 backdrop-blur-xl py-3 border-y border-white/5">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            {t('menu.all_dishes')} ({menuItems.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              <span>{getCategoryTitle(cat, language)}</span>
              <span className="text-[10px] opacity-70">
                ({menuItems.filter(p => p.category === cat.id).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Menu Section ─────────────────────────────────────────────────── */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 py-6 sm:py-10 flex flex-col lg:flex-row gap-10 lg:gap-14">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block lg:w-72 flex-shrink-0 lg:sticky lg:top-28 h-fit space-y-8">
          {/* Search Box */}
          <div className="relative">
            <span className={`material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-white/40 text-sm pointer-events-none ${
              direction === 'rtl' ? 'right-3.5' : 'left-3.5'
            }`}>
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('menu.search_placeholder')}
              className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors ${
                direction === 'rtl' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
              }`}
            />
          </div>

          {/* Desktop Categories List */}
          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6 space-y-4">
            <h2 className="text-tertiary font-black text-xs tracking-[0.2em] uppercase flex items-center justify-between">
              <span>{t('menu.categories')}</span>
              <span className="material-symbols-outlined text-sm">restaurant_menu</span>
            </h2>

            <ul className="space-y-2 pt-2">
              <li>
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                    activeCategory === 'all'
                      ? 'bg-primary/10 text-primary font-black border border-primary/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5 font-medium'
                  }`}
                >
                  <span>{t('menu.all_dishes')}</span>
                  <span className="text-[11px] font-bold opacity-80">{menuItems.length}</span>
                </button>
              </li>

              {categories.map((category) => {
                const count = menuItems.filter(p => p.category === category.id).length;
                return (
                  <li key={category.id}>
                    <button
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                        activeCategory === category.id
                          ? 'bg-primary/10 text-primary font-black border border-primary/20'
                          : 'text-white/60 hover:text-white hover:bg-white/5 font-medium'
                      }`}
                    >
                      <span className="truncate">{getCategoryTitle(category, language)}</span>
                      <span className="text-[11px] font-bold opacity-80">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Luxury Note Card */}
          <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-primary text-xs font-bold">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>{language === 'ar' ? 'خدمة ملكية مخصصة' : 'Signature Dining Service'}</span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              {t('menu.vat_note')}
            </p>
          </div>
        </aside>

        {/* Menu Grid Content */}
        <section className="flex-grow">
          {/* Header count & Active Title */}
          <div className="mb-8 flex items-baseline justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-on-surface uppercase tracking-tight">
                {activeCategory === 'all'
                  ? t('menu.all_dishes')
                  : categories.find(c => c.id === activeCategory)
                    ? getCategoryTitle(categories.find(c => c.id === activeCategory)!, language)
                    : t('menu.categories')}
              </h2>
              <p className="text-white/40 text-xs mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? t('menu.dish') : t('menu.dishes')}
              </p>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <span>{t('menu.clear_search')}</span>
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            )}
          </div>

          {/* Cards Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-24 text-white/30 space-y-3"
                >
                  <span className="material-symbols-outlined text-5xl">search_off</span>
                  <p className="text-xs font-bold uppercase tracking-widest">
                    {t('menu.no_dishes')}
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                    className="inline-block mt-2 text-xs text-primary underline"
                  >
                    {t('menu.view_all')}
                  </button>
                </motion.div>
              ) : (
                filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-surface-container-low border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all flex flex-col shadow-lg"
                  >
                    {/* Dish Image */}
                    <Link
                      to={`/product/${product.id}`}
                      className="block relative overflow-hidden aspect-[16/10] bg-surface"
                    >
                      <img
                        src={product.image_url || '/placeholder-food.jpg'}
                        alt={getDishName(product, language)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />

                      {!product.is_available && (
                        <div className="absolute inset-0 bg-surface/85 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-xs font-bold uppercase tracking-widest text-error">
                            {t('menu.unavailable')}
                          </span>
                        </div>
                      )}

                      {product.is_popular && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-tertiary text-on-tertiary text-[10px] font-black uppercase tracking-wider rounded-lg shadow-md">
                          {getDishTag(product, language)}
                        </div>
                      )}

                      {product.calories && (
                        <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-surface/80 backdrop-blur-md text-white/70 text-[10px] font-bold rounded">
                          {getDishCalories(product, language)}
                        </div>
                      )}
                    </Link>

                    {/* Card Body */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
                            <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                              {getDishName(product, language)}
                            </h3>
                          </Link>
                          <span className="text-primary font-black text-sm whitespace-nowrap">
                            {product.price} <span className="text-[11px] font-normal text-white/40">{t('currency')}</span>
                          </span>
                        </div>

                        <p className="text-white/50 text-xs font-light leading-relaxed line-clamp-2">
                          {getDishDescription(product, language)}
                        </p>

                        {Array.isArray(product.ingredients) && product.ingredients.length > 0 && (
                          <div className="pt-2 border-t border-white/5">
                            <p className="text-[11px] text-white/30 truncate">
                              {getDishIngredients(product, language).slice(0, 3).join(' · ')}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-3 border-t border-white/5 flex gap-2 items-center">
                        <Link
                          to={`/product/${product.id}`}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-bold text-center transition-colors"
                        >
                          {t('menu.details')}
                        </Link>
                        <button
                          onClick={(e) => handleQuickAdd(e, product)}
                          disabled={!product.is_available}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary text-on-primary hover:brightness-110 active:scale-95 text-xs font-bold transition-all disabled:opacity-40"
                          title={t('menu.add_to_order')}
                        >
                          <span className="material-symbols-outlined text-sm">shopping_bag</span>
                          <span>{t('menu.add_to_order')}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Home;
