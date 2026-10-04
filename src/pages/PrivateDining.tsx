import { motion, type Variants } from 'framer-motion';
import { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';

const PrivateDining = () => {
  const { showNotification } = useNotification();
  const { direction, t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suites = [
    {
      name: language === 'ar' ? 'المجلس الملكي' : 'The Royal Majlis',
      capacity: language === 'ar' ? '12 ضيفاً' : '12 Guests',
      desc: language === 'ar'
        ? 'ملاذ فاخر مزين بأقمشة الحرير المصنوعة يدوياً مع إطلالة بانورامية خاصة على الحدائق الملكية.'
        : 'A grand sanctuary draped in raw handwoven silks with private panoramic vistas of the royal gardens.',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be4cce97?auto=format&fit=crop&q=80'
    },
    {
      name: language === 'ar' ? 'جناح الأوبسيديان' : 'The Obsidian Suite',
      capacity: language === 'ar' ? '6 ضيوف' : '6 Guests',
      desc: language === 'ar'
        ? 'تصميم فندقي عصري ومستقل للاجتماعات الخاصة وتجارب التذوق الراقية بأقصى درجات الخصوصية.'
        : 'A minimalist architectural chamber engineered for discrete summits and intimate gastronomic discourse.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80'
    },
    {
      name: language === 'ar' ? 'أتيليه التذوق الخاص' : "The Sommelier's Atelier",
      capacity: language === 'ar' ? '4 ضيوف' : '4 Guests',
      desc: language === 'ar'
        ? 'تجربة حصرية حميمية في أجواء هادئة مصممة خصيصاً للتذوق الدقيق والعشاء الرومانسي الفاخر.'
        : 'An intimate tasting salon enveloped in temperature-controlled private cellars for exclusive pairing rituals.',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitting(false);
    showNotification(
      language === 'ar'
        ? 'تم إرسال طلب الجناح الخاص بنجاح! سيتواصل معكم المضيف الملكي قريباً.'
        : 'Suite inquiry submitted successfully. Concierge will reach out shortly.',
      'success'
    );
    (e.target as HTMLFormElement).reset();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <div className="min-h-screen pt-12 pb-24 bg-background overflow-hidden font-headline" dir={direction}>
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 md:px-12 max-w-[1600px] mx-auto mb-16 text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-3"
        >
          <span className="text-tertiary text-xs font-bold tracking-[0.3em] uppercase flex items-center justify-center gap-4">
            <span className="w-8 h-[2px] bg-tertiary" />
            {t('suites.tag')}
            <span className="w-8 h-[2px] bg-tertiary" />
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase leading-[0.95] text-on-surface">
            {t('suites.title')}
          </h1>
        </motion.div>
        <p className="text-white/50 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed">
          {t('suites.desc')}
        </p>
      </section>

      {/* ── Suites Grid ──────────────────────────────────────────────────────── */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-4 sm:px-8 md:px-12 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
      >
        {suites.map((suite) => (
          <motion.div
            key={suite.name}
            variants={cardVariants}
            className="group bg-surface-container-low rounded-3xl overflow-hidden border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/11] overflow-hidden bg-surface relative">
                <img 
                  src={suite.image} 
                  alt={suite.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block bg-tertiary text-on-tertiary text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    {suite.capacity}
                  </span>
                </div>
              </div>
              
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-bold uppercase text-white tracking-tight leading-snug">
                  {suite.name}
                </h3>
                <p className="text-white/50 text-xs leading-relaxed font-light">
                  {suite.desc}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <a 
                href="#inquiry"
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-primary hover:text-on-primary text-white/80 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>{t('suites.request_btn')}</span>
                <span className="material-symbols-outlined text-sm">
                  {direction === 'rtl' ? 'arrow_backward' : 'arrow_forward'}
                </span>
              </a>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* ── Bespoke Inquiry Form ────────────────────────────────────────────── */}
      <section id="inquiry" className="py-16 sm:py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="px-4 sm:px-8 md:px-12 max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-on-surface">
              {t('suites.inquiry_title')}
            </h2>
            <p className="text-tertiary uppercase text-xs tracking-wider font-bold">
              {t('suites.inquiry_sub')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface-container-high border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/50">{t('suites.host_name')}</label>
                <input required type="text" placeholder={language === 'ar' ? 'محمد السعد' : 'Alexander Wright'} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-primary outline-none transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/50">{t('suites.host_email')}</label>
                <input required type="email" placeholder="name@luxury.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-primary outline-none transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/50">{t('suites.host_phone')}</label>
                <input required type="tel" placeholder="05XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-primary outline-none transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/50">{t('suites.preferred_suite')}</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-primary outline-none transition-colors">
                  <option className="bg-surface" value="majlis">The Royal Majlis</option>
                  <option className="bg-surface" value="obsidian">The Obsidian Suite</option>
                  <option className="bg-surface" value="atelier">The Sommelier's Atelier</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white/50">{t('suites.custom_notes')}</label>
              <textarea placeholder={language === 'ar' ? 'عدد الضيوف، الترتيبات الموسيقية، طلبات الشيف الخاصة...' : 'Party size, acoustic preference, chef manifestations...'} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-primary outline-none transition-colors resize-none" />
            </div>
            
            <div className="pt-2">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-wider text-xs hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {isSubmitting ? t('suites.submitting') : t('suites.submit_btn')}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default PrivateDining;
