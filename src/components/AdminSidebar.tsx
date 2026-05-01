import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { title: 'لوحة التحكم', icon: 'dashboard', path: '/admin' },
    { title: 'الطلبات المباشرة', icon: 'receipt_long', path: '/admin/orders' },
    { title: 'الحجوزات', icon: 'event_available', path: '/admin/reservations' },
    { title: 'إدارة المنيو', icon: 'restaurant_menu', path: '/admin/menu' },
    { title: 'التصنيفات', icon: 'category', path: '/admin/categories' },
    { title: 'الإعدادات', icon: 'settings', path: '/admin/settings' },
  ];

  return (
    <aside className="bg-[#121413] h-screen w-64 flex flex-col py-8 space-y-4 font-headline z-50 border-r border-white/5">
      <div className="px-6 mb-8 group">
        <h1 className="text-2xl font-black text-[#e9c349] tracking-tighter">GOLDEN EAGLE</h1>
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 mt-1 font-bold">إدارة المنتجع</p>
      </div>
      
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-4 space-x-3 transition-all duration-300 ${
                isActive 
                  ? 'text-[#e9c349] border-r-2 border-[#e9c349] bg-primary/5 font-bold' 
                  : 'text-white/40 hover:text-primary hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-xs font-bold tracking-wider">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 pt-4 border-t border-white/5">
        <button className="w-full bg-primary text-on-primary font-headline font-extrabold py-4 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/10 text-[10px] uppercase tracking-widest">
          <span className="material-symbols-outlined text-lg">add</span>
          <span>طلب يدوي</span>
        </button>
      </div>

      <div className="px-6 mt-auto space-y-1">
        <button className="flex items-center py-3 space-x-3 text-white/30 hover:text-white transition-colors w-full">
          <span className="material-symbols-outlined text-lg">help_outline</span>
          <span className="text-xs font-bold uppercase tracking-widest">الدعم الفني</span>
        </button>
        <button className="flex items-center py-3 space-x-3 text-error/50 hover:text-error transition-colors w-full">
          <span className="material-symbols-outlined text-lg">logout</span>
          <span className="text-xs font-bold uppercase tracking-widest">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
