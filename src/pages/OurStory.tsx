import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const OurStory = () => {
  const containerRef = useRef(null);
  const { direction, t, language } = useLanguage();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.2]);

  const pillars = [
    {
      title: t('story.p1_title'),
      desc: t('story.p1_desc'),
      icon: 'eco'
    },
    {
      title: t('story.p2_title'),
      desc: t('story.p2_desc'),
      icon: 'precision_manufacturing'
    },
    {
      title: t('story.p3_title'),
      desc: t('story.p3_desc'),
      icon: 'room_service'
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-hidden font-headline" dir={direction}>
      {/* ── Cinematic Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] sm:min-h-[75vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80" 
            alt="The Heritage" 
            className="w-full h-full object-cover grayscale brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background" />
        </motion.div>

        <div className="relative z-10 text-center space-y-6 px-4 sm:px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="text-tertiary text-xs font-bold tracking-[0.4em] uppercase flex items-center justify-center gap-4">
               <span className="w-10 h-[1px] bg-tertiary/40" />
               {t('story.tag')}
               <span className="w-10 h-[1px] bg-tertiary/40" />
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight uppercase leading-[0.95] text-on-surface">
              {t('story.title')}
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-3 pt-4"
          >
             <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
               {language === 'ar' ? 'قصتنا عبر الأجيال' : 'Generations of Refinement'}
             </span>
          </motion.div>
        </div>
      </section>

      {/* ── The Manifesto ──────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 md:px-12 max-w-[1600px] mx-auto py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="text-tertiary text-xs font-bold tracking-[0.3em] uppercase">{t('story.manifesto_tag')}</span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight text-on-surface">
                {t('story.manifesto_title')}
              </h2>
            </div>
            <p className="text-white/60 text-base sm:text-lg leading-relaxed font-light italic">
              {t('story.manifesto_quote')}
            </p>
            <div className="pt-4 border-t border-white/5 space-y-4">
              <p className="text-white/50 text-sm leading-relaxed font-light">
                {t('story.manifesto_body')}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1550966842-83907a70650c?auto=format&fit=crop&q=80" 
                alt="Imperial Cellar" 
                className="w-full h-full object-cover grayscale brightness-75 hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
            </div>
            
            <div className="absolute -bottom-6 -left-6 sm:bottom-6 sm:left-6 bg-surface border border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-1 p-5 shadow-2xl backdrop-blur-xl">
               <span className="text-tertiary font-black text-xl">Est.</span>
               <span className="text-on-surface font-black text-[11px] uppercase tracking-widest">MCMXCIV</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Pillars of the Eagle ───────────────────────────────────────────── */}
      <section className="bg-white/[0.01] py-16 sm:py-24 border-y border-white/5 relative overflow-hidden">
        <div className="px-4 sm:px-8 md:px-12 max-w-[1600px] mx-auto text-center space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto space-y-3"
          >
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-on-surface">
              {t('story.principles_tag')}
            </h2>
            <p className="text-white/40 text-xs sm:text-sm uppercase tracking-widest">
              {language === 'ar' ? 'ركائز الضيافة والإتقان في GOLDEN EAGLE' : 'The Pillars of Hospitality & Precision'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {pillars.map((pillar, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group p-8 space-y-4 border border-white/5 bg-surface-container-low rounded-2xl hover:border-white/15 transition-all text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center mx-auto text-tertiary">
                  <span className="material-symbols-outlined text-2xl">{pillar.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cinematic Quote ────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-4 text-center">
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
           className="space-y-8 max-w-4xl mx-auto"
        >
          <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center mx-auto text-primary">
            <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
          </div>
          <blockquote className="text-xl sm:text-3xl md:text-4xl font-thin italic text-white/90 leading-relaxed">
            {language === 'ar'
              ? '"أن تتناول طعامك في GOLDEN EAGLE يعني أن تعيش لحظات تاريخية تجمع بين عبق الماضي ورقي المستقبل."'
              : '"To dine at Golden Eagle is to witness heritage elevated into modern gastronomic poetry."'}
          </blockquote>
          <footer className="text-tertiary font-bold tracking-widest uppercase text-xs">
            {language === 'ar' ? '— الشيف التنفيذي لمطاعم GOLDEN EAGLE' : '— Executive Culinary Director'}
          </footer>
        </motion.div>
      </section>
    </div>
  );
};

export default OurStory;
