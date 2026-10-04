import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { direction, t, language } = useLanguage();

  return (
    <footer className="bg-surface relative w-full pt-16 pb-12 overflow-hidden border-t border-white/5 font-headline" dir={direction}>
      {/* Decorative background light */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="px-4 sm:px-8 md:px-12 max-w-[1920px] mx-auto space-y-12 relative z-10">
        
        {/* Top Section: Brand + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1">
              <span className="text-tertiary font-black text-2xl tracking-[0.15em] uppercase">
                Golden Eagle
              </span>
              <p className="text-white/40 text-xs leading-relaxed max-w-sm">
                {t('footer.about')}
              </p>
            </div>
            
            <div className="flex gap-2 pt-2">
               {['photo_camera', 'share', 'public'].map((icon, i) => (
                 <motion.button 
                   key={i}
                   whileHover={{ y: -2 }}
                   className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-colors"
                   aria-label="Social link"
                 >
                   <span className="material-symbols-outlined text-base">{icon}</span>
                 </motion.button>
               ))}
            </div>
          </div>

          {/* Newsletter Club signup */}
          <div className="lg:col-span-7 bg-surface-container-low border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="space-y-1 text-center md:text-start">
                <h3 className="text-base font-bold uppercase text-white tracking-wider">
                  {t('footer.club_title')}
                </h3>
                <p className="text-xs text-white/40">
                  {t('footer.club_desc')}
                </p>
             </div>
             <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder={t('footer.club_placeholder')} 
                  className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs text-white focus:border-primary outline-none transition-all placeholder:text-white/20 min-w-[220px]"
                />
                <button className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shrink-0">
                  {t('footer.club_join')}
                </button>
             </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/5 text-xs">
          <div className="space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-tertiary">
              {t('footer.links_main')}
            </span>
            <nav className="flex flex-col gap-2 text-white/50">
              <Link to="/menu" className="hover:text-white transition-colors">{t('nav.menu')}</Link>
              <Link to="/reservations" className="hover:text-white transition-colors">{t('nav.reservations')}</Link>
              <Link to="/private-dining" className="hover:text-white transition-colors">{t('nav.private_dining')}</Link>
              <Link to="/gallery" className="hover:text-white transition-colors">{t('nav.gallery')}</Link>
            </nav>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-tertiary">
              {t('footer.links_resort')}
            </span>
            <nav className="flex flex-col gap-2 text-white/50">
              <Link to="/our-story" className="hover:text-white transition-colors">{t('nav.our_story')}</Link>
              <span className="text-white/30 cursor-default">
                {language === 'ar' ? 'الموقع والإطلالة' : 'Location & Views'}
              </span>
              <span className="text-white/30 cursor-default">
                {language === 'ar' ? 'معايير الجودة والاستدامة' : 'Sustainability Standards'}
              </span>
            </nav>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-tertiary">
              {t('footer.links_contact')}
            </span>
            <div className="flex flex-col gap-2 text-white/50">
               <p>{language === 'ar' ? 'هاتف: 0500000000' : 'Phone: +966 50 000 0000'}</p>
               <p>concierge@goldeneagle.resort</p>
               <p>{language === 'ar' ? 'صالة الإمبراطورية الملكية' : 'Imperial Royal Lounge'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-tertiary">
              {t('footer.links_staff')}
            </span>
            <div className="flex flex-col gap-2">
               <Link to="/admin" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-primary hover:text-on-primary text-white/70 rounded-lg transition-all w-fit">
                 <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                 <span>{t('footer.admin_portal')}</span>
               </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <p>© {new Date().getFullYear()} GOLDEN EAGLE SIGNATURE DINING. {t('footer.rights')}</p>
          <div className="flex gap-6">
             <span className="hover:text-white cursor-pointer">
               {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
             </span>
             <span className="hover:text-white cursor-pointer">
               {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
             </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
