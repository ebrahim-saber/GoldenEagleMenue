import { motion, type Variants } from 'framer-motion';
import { useState } from 'react';
import { useNotification } from '../context/NotificationContext';

const PrivateDining = () => {
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suites = [
    {
      name: 'The Royal Majlis',
      capacity: '12 Guests',
      desc: 'An opulent sanctuary featuring handcrafted silk tapestries and a private terrace overlooking the botanical gardens.',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be4cce97?auto=format&fit=crop&q=80'
    },
    {
      name: 'The Obsidian Suite',
      capacity: '6 Guests',
      desc: 'A minimalist, tech-integrated vault designed for discrete business summits and high-stakes culinary experiences.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80'
    },
    {
      name: 'The Sommelier’s Atelier',
      capacity: '4 Guests',
      desc: 'Dine amongst the world’s rarest vintages in an intimate, temperature-controlled environment of understated luxury.',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    showNotification('Inquiry dispatched. Our Maître d’ will contact you soon.', 'success');
    (e.target as HTMLFormElement).reset();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-40 bg-background overflow-hidden font-headline">
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 max-w-[1920px] mx-auto mb-40 text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="space-y-6"
        >
          <span className="text-tertiary text-[10px] font-black tracking-[0.6em] uppercase flex items-center justify-center gap-6">
            <span className="w-12 h-[1px] bg-tertiary/30"></span>
            Exclusivity Redefined
            <span className="w-12 h-[1px] bg-tertiary/30"></span>
          </span>
          <h1 className="text-[clamp(3.5rem,12vw,10rem)] font-black tracking-tighter uppercase leading-[0.85] text-on-surface">
            Private <br /> <span className="text-gradient-gold italic font-light">Suites</span>
          </h1>
        </motion.div>
        <p className="text-white/30 max-w-3xl mx-auto text-xl font-light leading-relaxed">
          From diplomatic summits to intimate celebrations, our private dining suites offer complete discretion and bespoke culinary choreography.
        </p>
      </section>

      {/* ── Suites Grid ──────────────────────────────────────────────────────── */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-6 md:px-12 max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16 mb-80"
      >
        {suites.map((suite) => (
          <motion.div
            key={suite.name}
            variants={cardVariants}
            className="group"
          >
            <div className="aspect-[3/4.5] rounded-[3rem] overflow-hidden mb-12 shadow-2xl bg-surface border border-white/5 relative">
              <img 
                src={suite.image} 
                alt={suite.name} 
                className="w-full h-full object-cover transition-all duration-[3000ms] group-hover:scale-110 grayscale group-hover:grayscale-0 brightness-75 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
              
              <div className="absolute bottom-12 left-12 right-12 space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                 <span className="text-tertiary text-[10px] font-black tracking-[0.4em] uppercase">{suite.capacity}</span>
                 <h3 className="text-4xl font-black uppercase text-white tracking-tighter leading-none">{suite.name}</h3>
              </div>
              
              {/* Corner Decorative Element */}
              <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-all duration-1000 scale-50 group-hover:scale-100">
                 <div className="w-12 h-12 rounded-full border border-primary/40 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-sm">lock_open</span>
                 </div>
              </div>
            </div>
            
            <div className="px-6 space-y-6">
              <p className="text-white/30 text-base leading-relaxed font-light">{suite.desc}</p>
              <div className="w-20 h-[1px] bg-white/10 group-hover:w-full transition-all duration-[1500ms]"></div>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* ── Bespoke Inquiry Form ────────────────────────────────────────────── */}
      <section className="relative py-60 border-t border-white/5 bg-white/[0.01]">
        {/* Background Ambient Lights */}
        <div className="absolute top-0 inset-x-0 h-full pointer-events-none opacity-20">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 blur-[200px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-tertiary/5 blur-[200px] rounded-full"></div>
        </div>

        <div className="relative px-6 md:px-12 max-w-5xl mx-auto space-y-24">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-on-surface">Bespoke Inquiry</h2>
            <p className="text-tertiary uppercase text-[10px] tracking-[0.6em] font-black flex items-center justify-center gap-6">
               <span className="w-10 h-[1px] bg-tertiary/30"></span>
               Imperial Guest Relations
               <span className="w-10 h-[1px] bg-tertiary/30"></span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Host Identity</label>
              <input required type="text" placeholder="FULL LEGAL NAME" className="w-full bg-transparent border-b-2 border-white/5 py-4 text-base tracking-widest text-on-surface focus:border-primary outline-none transition-all placeholder:text-white/5 font-light" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Direct Contact</label>
              <input required type="email" placeholder="EMAIL ADDRESS" className="w-full bg-transparent border-b-2 border-white/5 py-4 text-base tracking-widest text-on-surface focus:border-primary outline-none transition-all placeholder:text-white/5 font-light" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Perspective Date</label>
              <input required type="text" placeholder="SERVICE DATE (DD.MM.YY)" className="w-full bg-transparent border-b-2 border-white/5 py-4 text-base tracking-widest text-on-surface focus:border-primary outline-none transition-all placeholder:text-white/5 font-light" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Suite Preference</label>
              <select className="w-full bg-transparent border-b-2 border-white/5 py-4 text-base tracking-widest text-white/40 focus:border-primary outline-none transition-all appearance-none cursor-pointer font-light">
                  <option className="bg-background">SELECT SUITE ARCHIVE</option>
                  <option className="bg-background">THE ROYAL MAJLIS</option>
                  <option className="bg-background">THE OBSIDIAN SUITE</option>
                  <option className="bg-background">THE SOMMELIER'S ATELIER</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-4">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Custom Manifestations</label>
              <textarea placeholder="OPTIONAL REQUIREMENTS, DECOR, OR ALLERGIES..." className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-8 text-base tracking-widest text-on-surface focus:border-primary/40 outline-none transition-all min-h-[160px] resize-none placeholder:text-white/5 font-light"></textarea>
            </div>
            
            <div className="md:col-span-2 pt-16 flex justify-center">
              <button 
                disabled={isSubmitting}
                className="bg-primary text-on-primary px-32 py-7 rounded-3xl font-black uppercase tracking-[0.5em] text-[10px] hover:brightness-110 transition-all active:scale-95 shadow-[0_30px_60px_-15px_rgba(255,255,255,0.1)] grayscale-0 disabled:opacity-50"
              >
                {isSubmitting ? 'Dispatching Manifest...' : 'Submit Inquiry'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default PrivateDining;
