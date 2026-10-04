import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { direction, language, t } = useLanguage();

  const menuItems = [
    { title: language === 'ar' ? 'لوحة التحكم' : 'Dashboard', icon: 'dashboard', path: '/admin' },
    { title: language === 'ar' ? 'الطلبات المباشرة' : 'Live Orders', icon: 'receipt_long', path: '/admin/orders' },
    { title: language === 'ar' ? 'الحجوزات' : 'Reservations', icon: 'event_available', path: '/admin/reservations' },
    { title: language === 'ar' ? 'إدارة المنيو' : 'Menu Management', icon: 'restaurant_menu', path: '/admin/menu' },
    { title: language === 'ar' ? 'التصنيفات' : 'Categories', icon: 'category', path: '/admin/categories' },
    { title: language === 'ar' ? 'الإعدادات' : 'Settings', icon: 'settings', path: '/admin/settings' },
  ];

  return (
    <aside 
      className={`bg-[#121413] h-screen w-64 flex flex-col py-6 font-headline z-50 shrink-0 ${
        direction === 'rtl' ? 'border-l border-white/5' : 'border-r border-white/5'
      }`} 
      dir={direction}
    >
      {/* Brand Header */}
      <div className="px-6 mb-6">
        <Link to="/" className="block group">
          <h1 className="text-xl font-black text-tertiary tracking-wider group-hover:text-white transition-colors">
            GOLDEN EAGLE
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-0.5 font-bold">
            {language === 'ar' ? 'بوابة الإدارة الملكية' : 'Imperial Admin Portal'}
          </p>
        </Link>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'text-tertiary bg-tertiary/10 font-bold border-s-2 border-tertiary shadow-sm' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-xs tracking-wider">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Customer Preview Link */}
      <div className="px-4 py-3 border-t border-white/5">
        <Link 
          to="/menu" 
          className="w-full bg-white/5 hover:bg-white/10 text-white/80 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all border border-white/5"
        >
          <span className="material-symbols-outlined text-sm">visibility</span>
          <span>{language === 'ar' ? 'معاينة واجهة الزبائن' : 'View Customer Menu'}</span>
        </Link>
      </div>

      {/* Footer Controls */}
      <div className="px-4 pt-3 border-t border-white/5 space-y-1">
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-2.5 text-error/60 hover:text-error hover:bg-error/5 rounded-xl transition-colors w-full text-xs font-bold"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>{t('nav.sign_out')}</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
