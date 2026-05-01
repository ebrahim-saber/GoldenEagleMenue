import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Orders', icon: 'receipt_long', path: '/admin' },
    { name: 'Menu', icon: 'restaurant_menu', path: '/admin/menu' },
    { name: 'Inventory', icon: 'inventory_2', path: '/admin/inventory' },
    { name: 'Reports', icon: 'bar_chart', path: '/admin/reports' },
  ];

  return (
    <div className="flex h-screen bg-[#121413] text-on-surface font-body overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#121413] flex flex-col py-8 border-r border-[#404943]/15 z-40">
        <div className="px-6 mb-10">
          <h1 className="text-2xl font-black text-tertiary tracking-tighter logo-font">Golden Eagle</h1>
          <p className="text-[10px] text-white/40 font-headline tracking-widest uppercase mt-1">Management Platform</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 group ${
                  isActive 
                    ? 'text-tertiary bg-primary-container/20 border-r-2 border-tertiary' 
                    : 'text-white/40 hover:text-primary hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined mr-3 text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-auto space-y-1 pt-8 border-t border-[#404943]/15">
          <Link to="/" className="flex items-center px-4 py-3 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
            <span className="material-symbols-outlined mr-3 text-xl">visibility</span>
            <span>View Site</span>
          </Link>
          <button className="w-full flex items-center px-4 py-3 text-error/60 hover:text-error hover:bg-error/5 rounded-lg transition-all">
            <span className="material-symbols-outlined mr-3 text-xl">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-[#121413]/60 backdrop-blur-xl border-bottom border-[#404943]/15 flex items-center justify-between px-8 z-30">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 text-sm">search</span>
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="bg-surface-container-lowest border-none rounded-full pl-10 pr-4 py-1.5 text-xs w-64 focus:ring-1 focus:ring-primary/30 transition-all font-label text-white/80"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2 text-white/40 hover:text-white transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-tertiary rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-[#404943]/20">
              <div className="text-right">
                <p className="text-[11px] font-bold text-white leading-tight">Admin User</p>
                <p className="text-[9px] text-tertiary font-label uppercase tracking-wider">Manager</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-container border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
