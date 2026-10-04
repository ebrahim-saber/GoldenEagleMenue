import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const { direction, t, language } = useLanguage();

  const images = [
    {
      url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
      title: language === 'ar' ? 'المدخل الملكي' : 'The Grand Entrance',
      category: 'Ambiance'
    },
    {
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80',
      title: language === 'ar' ? 'لحم الضأن بالزعفران' : 'Saffron Lamb',
      category: 'Cuisine'
    },
    {
      url: 'https://images.unsplash.com/photo-1550966842-83907a70650c?auto=format&fit=crop&q=80',
      title: language === 'ar' ? 'دراسة قبو العصائر' : 'Wine Cellar Study',
      category: 'Ambiance'
    },
    {
      url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80',
      title: language === 'ar' ? 'طبق النسر الذهبي' : 'The Golden Eagle Platter',
      category: 'Cuisine'
    },
    {
      url: 'https://images.unsplash.com/photo-1551218808-94e220e03ca9?auto=format&fit=crop&q=80',
      title: language === 'ar' ? 'الجناح الخاص الثالث' : 'Private Suite III',
      category: 'Interiors'
    },
    {
      url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80',
      title: language === 'ar' ? 'موكتيل الأعشاب العطرية' : 'Botanical Infusion',
      category: 'Cocktails'
    },
    {
      url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80',
      title: language === 'ar' ? 'أتيليه الحلويات الفاخرة' : 'The Dessert Atelier',
      category: 'Cuisine'
    },
    {
      url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80',
      title: language === 'ar' ? 'صالة الطعام الرئيسية' : 'Main Dining Hall',
      category: 'Ambiance'
    },
    {
      url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80',
      title: language === 'ar' ? 'الإضاءة الإمبراطورية' : 'Imperial Lighting',
      category: 'Interiors'
    },
    {
      url: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80',
      title: language === 'ar' ? 'اللاونج التنفيذي' : 'Executive Bar',
      category: 'Ambiance'
    },
  ];

  const categoryLabels: Record<string, string> = {
    'All': t('gallery.all'),
    'Cuisine': t('gallery.cuisine'),
    'Ambiance': t('gallery.ambiance'),
    'Interiors': t('gallery.interiors'),
    'Cocktails': t('gallery.cocktails'),
  };

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
    <div className="min-h-screen pt-12 pb-24 overflow-hidden bg-background font-headline" dir={direction}>
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 md:px-12 max-w-[1920px] mx-auto mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            <span className="text-tertiary text-xs font-extrabold tracking-[0.3em] uppercase flex items-center gap-3">
              <span className="w-8 h-[2px] bg-tertiary" />
              {t('gallery.tag')}
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-headline font-black tracking-tighter uppercase leading-[0.9] text-on-surface">
              {t('gallery.title')}
            </h1>
          </motion.div>
          
          <div className="flex flex-wrap gap-4 sm:gap-6 text-xs font-bold uppercase tracking-wider text-white/40 border-b border-white/5 pb-3">
            {['All', 'Cuisine', 'Ambiance', 'Interiors', 'Cocktails'].map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`transition-all duration-300 hover:text-white relative pb-3 ${
                  activeCategory === cat ? 'text-tertiary font-black' : ''
                }`}
              >
                {categoryLabels[cat] || cat}
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
        className="px-4 sm:px-8 md:px-12 max-w-[1920px] mx-auto columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
      >
        {filteredImages.map((image, i) => (
          <motion.div
            key={image.url}
            variants={itemVariants}
            onClick={() => setSelectedImage(i)}
            className="group relative break-inside-avoid rounded-[2rem] overflow-hidden shadow-2xl bg-surface-container-low cursor-zoom-in"
          >
            <img 
              src={image.url} 
              alt={image.title} 
              className="w-full h-auto object-cover transition-all duration-[2000ms] group-hover:scale-105 group-hover:brightness-110 grayscale-[0.2] group-hover:grayscale-0"
              loading="lazy"
            />
            
            {/* Overlay Info */}
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="relative z-10 space-y-2">
                <span className="text-tertiary text-[9px] font-black tracking-[0.4em] uppercase">
                  {categoryLabels[image.category] || image.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-headline font-black uppercase text-white tracking-tighter leading-none">
                  {image.title}
                </h3>
              </div>
            </div>

            {/* Scale indicator icon */}
            <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 scale-50 group-hover:scale-100">
               <span className="material-symbols-outlined text-white/60 text-sm">fullscreen</span>
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
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-3xl flex items-center justify-center p-4 sm:p-12 md:p-20"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-6xl aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden shadow-2xl bg-surface"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={filteredImages[selectedImage].url} 
                alt={filteredImages[selectedImage].title}
                className="w-full h-full object-cover"
              />
              
              {/* Image Info Panel */}
              <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 flex justify-between items-end">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="relative z-10 space-y-2">
                  <span className="text-tertiary text-[10px] font-black uppercase tracking-[0.6em]">
                    {categoryLabels[filteredImages[selectedImage].category] || filteredImages[selectedImage].category}
                  </span>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-headline font-black uppercase text-white tracking-tighter leading-none">
                    {filteredImages[selectedImage].title}
                  </h2>
                </div>
                
                <div className="relative z-10 flex gap-3">
                  <button 
                    onClick={() => setSelectedImage(prev => prev! > 0 ? prev! - 1 : filteredImages.length - 1)}
                    className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
                    aria-label="Previous"
                  >
                    <span className="material-symbols-outlined text-white">
                      {direction === 'rtl' ? 'arrow_forward' : 'arrow_back'}
                    </span>
                  </button>
                  <button 
                    onClick={() => setSelectedImage(prev => prev! < filteredImages.length - 1 ? prev! + 1 : 0)}
                    className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
                    aria-label="Next"
                  >
                    <span className="material-symbols-outlined text-white">
                      {direction === 'rtl' ? 'arrow_back' : 'arrow_forward'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all z-20 group"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-white/80 group-hover:text-white transition-colors">close</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cinematic Outro ──────────────────────────────────────────────────── */}
      <section className="mt-20 sm:mt-28 px-4 text-center space-y-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="space-y-3"
        >
          <p className="text-tertiary text-xs font-bold uppercase tracking-[0.3em]">{t('gallery.outro_tag')}</p>
          <h2 className="text-2xl sm:text-4xl font-headline font-black uppercase tracking-tight text-on-surface max-w-3xl mx-auto">
             {t('gallery.outro_title')}
          </h2>
        </motion.div>
        
        <div className="flex justify-center">
           <motion.div 
             initial={{ height: 0 }}
             whileInView={{ height: 48 }}
             className="w-[1px] bg-gradient-to-b from-tertiary to-transparent"
           />
        </div>
      </section>
    </div>
  );
};

export default Gallery;
