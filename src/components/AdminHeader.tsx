const AdminHeader = () => {
  return (
    <header className="w-full sticky top-0 z-40 bg-surface/60 backdrop-blur-xl flex items-center justify-between px-8 py-4 border-b border-white/5 font-headline" dir="rtl">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative w-full max-w-sm ml-4">
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm">search</span>
          <input 
            className="w-full bg-white/[0.03] border border-white/5 rounded-full pr-10 pl-4 py-2.5 text-xs text-white placeholder-white/20 focus:ring-1 focus:ring-tertiary transition-all" 
            placeholder="بحث عن طاولة، طلب، أو صنف..." 
            type="text" 
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <button className="p-3 text-white/40 hover:text-white hover:bg-white/5 transition-all rounded-full relative group">
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-3 left-3 w-1.5 h-1.5 bg-error rounded-full ring-2 ring-surface"></span>
          </button>
          <button className="p-3 text-white/40 hover:text-white hover:bg-white/5 transition-all rounded-full group">
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>
        
        <div className="h-10 w-[1px] bg-white/5 mx-6"></div>
        
        <div className="flex items-center space-x-4">
          <div className="text-left hidden sm:block ml-4">
            <p className="text-xs font-black text-white uppercase tracking-wider">إبراهيم س.</p>
            <p className="text-[9px] text-primary uppercase font-bold tracking-[0.2em] mt-0.5">مدير النظام</p>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 ring-2 ring-primary/20 shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
