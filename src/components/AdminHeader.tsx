import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AdminHeader = () => {
  const { user } = useAuth();
  const { direction, toggleLanguage, language } = useLanguage();

  return (
    <header className="w-full sticky top-0 z-40 bg-surface/80 backdrop-blur-xl flex items-center justify-between px-6 sm:px-8 py-3.5 border-b border-white/5 font-headline" dir={direction}>
      {/* Search Input */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-sm">
          <span className={`material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none ${
            direction === 'rtl' ? 'right-3.5' : 'left-3.5'
          }`}>
            search
          </span>
          <input 
            className={`w-full bg-white/5 border border-white/10 rounded-xl py-2 text-xs text-white placeholder-white/30 focus:border-tertiary outline-none transition-all ${
              direction === 'rtl' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
            }`} 
            placeholder={language === 'ar' ? 'بحث عن طاولة، رقم طلب، أو صنف...' : 'Search table, order #, or dish...'} 
            type="text" 
          />
        </div>
      </div>
      
      {/* Admin Profile & Actions */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all"
          title={language === 'en' ? 'التحويل إلى العربية' : 'Switch to English'}
        >
          <span className="material-symbols-outlined text-sm text-tertiary">language</span>
          <span className="tracking-wider uppercase text-[11px]">
            {language === 'en' ? 'العربية' : 'EN'}
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button 
            className="p-2 text-white/50 hover:text-white hover:bg-white/5 transition-all rounded-xl relative"
            title={language === 'ar' ? 'الإشعارات' : 'Notifications'}
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </button>
        </div>
        
        <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-start">
            <p className="text-xs font-bold text-white">
              {user?.user_metadata?.full_name || (language === 'ar' ? 'مدير النظام' : 'Operations Director')}
            </p>
            <p className="text-[10px] text-tertiary font-bold tracking-wider">
              {user?.email || 'admin@goldeneagle.com'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-tertiary/10 border border-tertiary/30 flex items-center justify-center text-tertiary font-black text-sm shrink-0">
            {user?.user_metadata?.full_name?.[0] || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
