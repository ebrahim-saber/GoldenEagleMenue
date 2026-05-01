import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useState } from 'react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const images = [
    { url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80', title: 'The Grand Entrance', category: 'Ambiance' },
    { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80', title: 'Saffron Lamb', category: 'Cuisine' },
    { url: 'https://images.unsplash.com/photo-1550966842-83907a70650c?auto=format&fit=crop&q=80', title: 'Wine Cellar Study', category: 'Ambiance' },
    { url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80', title: 'The Golden Eagle Platter', category: 'Cuisine' },
    { url: 'https://images.unsplash.com/photo-1551218808-94e220e03ca9?auto=format&fit=crop&q=80', title: 'Private Suite III', category: 'Interiors' },
    { url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80', title: 'Botanical Infusion', category: 'Cocktails' },
    { url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80', title: 'The Dessert Atelier', category: 'Cuisine' },
    { url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80', title: 'Main Dining Hall', category: 'Ambiance' },
    { url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80', title: 'Imperial Lighting', category: 'Interiors' },
    { url: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80', title: 'Executive Bar', category: 'Ambiance' },
  ];

  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-40 overflow-hidden bg-background">
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 max-w-[1920px] mx-auto mb-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <span className="text-tertiary text-[10px] font-extrabold tracking-[0.5em] uppercase flex items-center gap-4">
              <span className="w-12 h-[1px] bg-tertiary"></span>
              Visual Immersion
            </span>
            <h1 className="text-[clamp(3rem,10vw,8rem)] font-headline font-black tracking-tighter uppercase leading-[0.85] text-on-surface">
              The <br /> <span className="text-gradient-gold italic font-light">Gallery</span>
            </h1>
          </motion.div>
          
          <div className="flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4">
            {['All', 'Cuisine', 'Ambiance', 'Interiors', 'Cocktails'].map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`transition-all duration-500 hover:text-white relative pb-4 ${
                  activeCategory === cat ? 'text-tertiary' : ''
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-tertiary"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Masonry Grid ──────────────────────────────────────────────────────── */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={activeCategory}
        className="px-6 md:px-12 max-w-[1920px] mx-auto columns-1 md:columns-2 lg:columns-3 gap-12 space-y-12"
      >
        {filteredImages.map((image, i) => (
          <motion.div
            key={image.url}
            variants={itemVariants}
            onClick={() => setSelectedImage(i)}
            className="group relative break-inside-avoid rounded-[2rem] overflow-hidden shadow-2xl bg-surface-container-low cursor-zoom-in group"
          >
            <img 
              src={image.url} 
              alt={image.title} 
              className="w-full h-auto object-cover transition-all duration-[2000ms] group-hover:scale-105 group-hover:brightness-110 grayscale-[0.2] group-hover:grayscale-0"
              loading="lazy"
            />
            
            {/* Overlay Info */}
            <div className="absolute inset-x-0 bottom-0 p-10 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
              <div className="relative z-10 space-y-2">
                <span className="text-tertiary text-[9px] font-black tracking-[0.4em] uppercase">{image.category}</span>
                <h3 className="text-2xl font-headline font-black uppercase text-white tracking-tighter leading-none">{image.title}</h3>
              </div>
            </div>

            {/* Scale indicator icon */}
            <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 scale-50 group-hover:scale-100">
               <span className="material-symbols-outlined text-white/60 text-base font-light">fullscreen</span>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* ── Lightbox Overlay ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-3xl flex items-center justify-center p-6 md:p-20"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-6xl aspect-[4/3] md:aspect-video rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] bg-surface"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={filteredImages[selectedImage].url} 
                alt={filteredImages[selectedImage].title}
                className="w-full h-full object-cover"
              />
              
              {/* Image Info Panel */}
              <div className="absolute inset-x-0 bottom-0 p-12 flex justify-between items-end">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
                <div className="relative z-10 space-y-4">
                  <span className="text-tertiary text-[10px] font-black uppercase tracking-[0.6em]">{filteredImages[selectedImage].category}</span>
                  <h2 className="text-4xl md:text-6xl font-headline font-black uppercase text-white tracking-tighter leading-none">
                    {filteredImages[selectedImage].title}
                  </h2>
                </div>
                
                <div className="relative z-10 flex gap-4">
                  <button 
                    onClick={() => setSelectedImage(prev => prev! > 0 ? prev! - 1 : filteredImages.length - 1)}
                    className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90"
                  >
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  <button 
                    onClick={() => setSelectedImage(prev => prev! < filteredImages.length - 1 ? prev! + 1 : 0)}
                    className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90"
                  >
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-10 right-10 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all z-20 group"
              >
                <span className="material-symbols-outlined text-white/60 group-hover:text-white transition-colors">close</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cinematic Outro ──────────────────────────────────────────────────── */}
      <section className="mt-80 px-6 text-center space-y-16">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="space-y-8"
        >
          <p className="text-tertiary text-[10px] font-black uppercase tracking-[0.5em]">The Craft of Ambiance</p>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-headline font-black uppercase tracking-tighter leading-none text-on-surface max-w-4xl mx-auto">
             Where every frame becomes <br /> a part of <span className="text-primary italic font-light">History</span>.
          </h2>
        </motion.div>
        
        <div className="flex justify-center">
           <motion.div 
             initial={{ height: 0 }}
             whileInView={{ height: 120 }}
             className="w-[1px] bg-gradient-to-b from-tertiary to-transparent"
           />
        </div>
      </section>
    </div>
  );
};

export default Gallery;
