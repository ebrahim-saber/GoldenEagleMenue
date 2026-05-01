import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRAWAQ } from '../../hooks/useRAWAQ';
import { Link } from 'react-router-dom';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { menuItems, categories, loading } = useRAWAQ();

  const filteredProducts = useMemo(() => {
    let items = activeCategory === 'all'
      ? menuItems
      : menuItems.filter(p => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(p =>
        (p.name?.toLowerCase() || '').includes(q) ||
        (p.description?.toLowerCase() || '').includes(q) ||
        (Array.isArray(p.ingredients) && p.ingredients.some(i => i.toLowerCase().includes(q)))
      );
    }
    return items;
  }, [menuItems, activeCategory, searchQuery]);

  const popularItems = useMemo(() => menuItems.filter(p => p.is_popular).slice(0, 3), [menuItems]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">Curating your experience</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-end pb-20 px-6 md:px-12 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/60 to-surface z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(156,210,181,0.08),transparent)]" />

        {/* Decorative lines */}
        <div className="absolute top-16 left-8 md:left-16 flex flex-col gap-2 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ width: `${40 + i * 15}px` }} className="h-[1px] bg-primary" />
          ))}
        </div>

        <div className="relative z-20 w-full max-w-[1920px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-6"
          >
            <p className="text-tertiary text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-4">
              <span className="w-12 h-[1px] bg-tertiary" />
              Signature Dining Experience
            </p>
            <h1 className="text-[clamp(3rem,10vw,9rem)] font-headline font-black tracking-tighter text-on-surface leading-[0.85] uppercase">
              The Art<br />
              <span className="text-gradient-gold">of Flavor</span>
            </h1>
            <p className="text-white/40 max-w-xl font-light text-lg leading-relaxed">
              A curated selection of signature dishes — where heritage meets modern culinary precision.
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute right-0 bottom-0 flex flex-col items-center gap-2 text-white/20"
          >
            <span className="text-[8px] font-black uppercase tracking-[0.4em] rotate-90 origin-center translate-y-6">Scroll</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ── Popular Picks ────────────────────────────────────────────────────── */}
      {popularItems.length > 0 && (
        <section className="px-6 md:px-12 pb-20 max-w-[1920px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Chef's Picks</h2>
            <div className="h-[1px] flex-1 mx-6 bg-white/5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={`/product/${item.id}`}
                  className="group block relative rounded-2xl overflow-hidden aspect-[4/3] bg-surface-container-low"
                >
                  <img
                    src={item.image_url || '/placeholder-food.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
                    <div>
                      <span className="text-tertiary text-[9px] font-black uppercase tracking-[0.3em] block mb-1">Popular</span>
                      <h3 className="text-white font-headline font-black uppercase tracking-tight">{item.name}</h3>
                    </div>
                    <span className="text-primary font-bold text-sm">SAR {item.price}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Menu Section ─────────────────────────────────────────────────────── */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-16">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 flex-shrink-0 lg:sticky lg:top-40 h-fit">
          <div className="space-y-10">
            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm pointer-events-none">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search dishes..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>

            {/* Categories */}
            <div>
              <h2 className="text-tertiary font-headline font-extrabold text-[10px] tracking-[0.2em] uppercase mb-6">Categories</h2>
              <ul className="space-y-5">
                <li>
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`group flex items-center justify-between w-full transition-colors duration-300 ${
                      activeCategory === 'all' ? 'text-primary' : 'text-white/40 hover:text-primary'
                    }`}
                  >
                    <span className={`font-headline text-lg tracking-tight ${activeCategory === 'all' ? 'font-bold border-b border-primary/30 pb-1' : 'font-medium'}`}>All Dishes</span>
                    <span className={`text-[10px] font-label font-bold transition-opacity ${activeCategory === 'all' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {menuItems.length.toString().padStart(2, '0')}
                    </span>
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setActiveCategory(category.id)}
                      className={`group flex items-center justify-between w-full transition-colors duration-300 ${
                        activeCategory === category.id ? 'text-primary' : 'text-white/40 hover:text-primary'
                      }`}
                    >
                      <span className={`font-headline text-lg tracking-tight ${activeCategory === category.id ? 'font-bold border-b border-primary/30 pb-1' : 'font-medium'}`}>
                        {category.name}
                      </span>
                      <span className={`text-[10px] font-label font-bold transition-opacity ${activeCategory === category.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {menuItems.filter(p => p.category === category.id).length.toString().padStart(2, '0')}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-surface-container-low rounded-xl border border-white/5">
              <p className="text-[10px] text-white/30 font-label leading-relaxed uppercase tracking-wider">
                Prices include VAT. Inform our Maître D' of any allergies.
              </p>
            </div>
          </div>
        </aside>

        {/* Menu Grid */}
        <section className="flex-grow">
          <header className="mb-12 flex items-end justify-between">
            <div>
              <motion.h1
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface mb-2 uppercase"
              >
                {activeCategory === 'all' ? 'Signature Menu' : categories.find(c => c.id === activeCategory)?.name ?? 'Menu'}
              </motion.h1>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'dish' : 'dishes'}
              </p>
            </div>
          </header>

          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-24"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-24 text-white/20"
                >
                  <span className="material-symbols-outlined text-5xl block mb-4">search_off</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">No dishes found</p>
                </motion.div>
              ) : (
                filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="group flex flex-col"
                  >
                    <Link to={`/product/${product.id}`} className="block relative overflow-hidden rounded-xl mb-8 aspect-[3/2] bg-surface-container-low shadow-2xl">
                      <img
                        src={product.image_url || '/placeholder-food.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-all duration-[1.5s] ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-105 group-hover:brightness-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      {!product.is_available && (
                        <div className="absolute inset-0 bg-surface/80 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Unavailable</span>
                        </div>
                      )}
                      {product.is_popular && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-tertiary text-on-tertiary text-[9px] font-black uppercase tracking-wider rounded-full">
                          Popular
                        </div>
                      )}
                    </Link>

                    <div className="space-y-4 flex-grow flex flex-col">
                      <div className="flex justify-between items-baseline gap-4">
                        <Link to={`/product/${product.id}`}>
                          <h3 className="text-xl font-headline font-black text-on-surface tracking-tight group-hover:text-primary transition-colors uppercase">
                            {product.name}
                          </h3>
                        </Link>
                        <span className="text-tertiary font-label font-bold text-[12px] tracking-tight whitespace-nowrap">
                          SAR {product.price}
                        </span>
                      </div>

                      <p className="text-white/40 font-light leading-relaxed text-[13px] line-clamp-2">
                        {product.description}
                      </p>

                      <div className="pt-2 border-t border-white/5">
                        <p className="text-[10px] text-white/20 font-label italic uppercase tracking-widest">
                          {Array.isArray(product.ingredients) ? product.ingredients.slice(0, 3).join(' · ') : ''}
                        </p>
                      </div>

                      <div className="mt-auto pt-6">
                        <Link
                          to={`/product/${product.id}`}
                          className="w-full flex items-center justify-center space-x-3 border-b border-white/10 pb-4 hover:border-primary transition-all duration-700 group/btn"
                        >
                          <span className="material-symbols-outlined text-[10px] opacity-0 group-hover/btn:opacity-100 transform -translate-x-2 group-hover/btn:translate-x-0 transition-all">add</span>
                          <span className="uppercase text-[10px] font-black tracking-[0.4em] opacity-60 group-hover/btn:opacity-100 transition-opacity">Explore & Add</span>
                        </Link>
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
