import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const OurStory = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-hidden font-headline">
      {/* ── Cinematic Hero ─────────────────────────────────────────────────── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80" 
            alt="The Heritage" 
            className="w-full h-full object-cover grayscale brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background"></div>
        </motion.div>

        <div className="relative z-10 text-center space-y-12 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="space-y-6"
          >
            <span className="text-tertiary text-[10px] font-black tracking-[0.8em] uppercase flex items-center justify-center gap-8">
               <span className="w-16 h-[1px] bg-tertiary/20"></span>
               The Genesis
               <span className="w-16 h-[1px] bg-tertiary/20"></span>
            </span>
            <h1 className="text-[clamp(3rem,12vw,10rem)] font-black tracking-tighter uppercase leading-[0.85] text-on-surface">
              A Legacy <br /> <span className="text-gradient-gold italic font-light">Refined</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
             <div className="w-[1px] h-20 bg-gradient-to-b from-primary to-transparent"></div>
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Scroll to Explore</span>
          </motion.div>
        </div>
      </section>

      {/* ── The Manifesto ──────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 max-w-[1920px] mx-auto py-60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <span className="text-tertiary text-[10px] font-black tracking-[0.4em] uppercase">Historical Context</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-on-surface">
                Bridging Eras <br /> of Excellence
              </h2>
            </div>
            <p className="text-white/40 text-xl leading-relaxed font-light italic max-w-xl">
              "Rawaq is not merely a destination; it is a living chronicle. A sanctuary where the architectural precision of the Golden Eagle meets the experimental boundary of modern gastronomy."
            </p>
            <div className="pt-8 space-y-8 border-t border-white/5">
              <p className="text-white/60 text-base leading-loose font-light">
                Founded in the heart of the Royal Resort, Rawaq was conceived as a multi-sensory homage to heritage. We curate experiences that transcend the table, transforming each meal into a historical dialogue.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1550966842-83907a70650c?auto=format&fit=crop&q=80" 
                alt="Imperial Cellar" 
                className="w-full h-full object-cover grayscale brightness-75 hover:scale-110 transition-transform duration-[4000ms]"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent"></div>
            </div>
            {/* Decorative Floating Element */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-surface border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center space-y-2 backdrop-blur-3xl p-8 text-center shadow-2xl">
               <span className="text-tertiary font-black text-2xl font-headline">Est.</span>
               <span className="text-on-surface font-black text-xs uppercase tracking-widest leading-none">MCMXCIV</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Pillars of the Eagle ───────────────────────────────────────────── */}
      <section className="bg-white/[0.01] py-80 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[250px] -mr-500"></div>
        <div className="px-6 md:px-12 max-w-[1920px] mx-auto text-center space-y-32">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-on-surface">The Eagle's <br/> <span className="italic font-light">Principles</span></h2>
            <p className="text-white/30 text-lg leading-relaxed font-light uppercase tracking-widest">A commitment to culinary architectural integrity.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'The Provenance', desc: 'Sourcing exclusively from regional organic cooperatives and artisan small-batches.', icon: 'stat_1' },
              { title: 'Molecular Precision', desc: 'Ancient fire hearths refined through the lens of modern chemical gastronomy.', icon: 'precision_manufacturing' },
              { title: 'Bespoke Curation', desc: 'Each service window is designed for complete behavioral and sensory focus.', icon: 'temp_preferences_custom' }
            ].map((pillar, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="group p-16 space-y-10 border border-white/5 bg-surface/40 backdrop-blur-md rounded-[3rem] hover:bg-white/[0.04] transition-all duration-700"
              >
                <div className="w-20 h-20 rounded-full border border-tertiary/20 flex items-center justify-center mx-auto group-hover:bg-tertiary/10 transition-all duration-700">
                  <span className="material-symbols-outlined text-tertiary text-3xl font-light">{pillar.icon}</span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-on-surface">{pillar.title}</h3>
                  <div className="w-10 h-[1px] bg-white/10 mx-auto group-hover:w-20 transition-all duration-700"></div>
                  <p className="text-white/30 text-sm leading-relaxed font-light">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cinematic Quote ────────────────────────────────────────────────── */}
      <section className="py-80 px-6 text-center">
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 2 }}
           className="space-y-16"
        >
          <div className="flex justify-center">
             <div className="w-20 h-20 rounded-full border border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-4xl font-light animate-pulse">restaurant_menu</span>
             </div>
          </div>
          <blockquote className="text-[clamp(2rem,6vw,5rem)] font-headline font-thin italic text-white/90 max-w-6xl mx-auto leading-[1.1] tracking-tight">
            "To dine at Rawaq is to step into a curated dream, where the scent of oud and the crackle of flame ignite the spirit of history."
          </blockquote>
          <div className="space-y-2">
             <footer className="text-tertiary font-black tracking-[0.6em] uppercase text-xs">— Imperial Executive Chef</footer>
             <div className="w-12 h-[1px] bg-tertiary/30 mx-auto"></div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default OurStory;
