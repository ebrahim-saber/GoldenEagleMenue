import { Link, Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CustomerLayout = () => {
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/30 selection:text-primary">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#121413]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-center px-6 md:px-12 py-6 w-full max-w-[1920px] mx-auto">
          <Link to="/" className="text-2xl font-black tracking-tighter text-tertiary logo-font">
            Golden Eagle
          </Link>
          
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="font-headline tracking-tight font-medium uppercase text-[11px] text-tertiary border-b border-tertiary/50 pb-1 transition-all">Menu</Link>
            <Link to="/reservations" className="font-headline tracking-tight font-medium uppercase text-[11px] text-white/60 hover:text-white transition-all">Reservations</Link>
            <Link to="/gallery" className="font-headline tracking-tight font-medium uppercase text-[11px] text-white/60 hover:text-white transition-all">Gallery</Link>
            <Link to="/story" className="font-headline tracking-tight font-medium uppercase text-[11px] text-white/60 hover:text-white transition-all">Our Story</Link>
          </div>
          
          <Link to="/checkout" className="bg-primary text-on-primary px-8 py-2.5 font-headline font-bold uppercase text-[10px] tracking-widest scale-98-on-click-slow-ease transition-all hover:bg-primary/90">
            Order Now
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>

      {/* Cart FAB */}
      <div className="fixed bottom-12 right-12 z-40">
        <Link to="/checkout" className="bg-primary text-on-primary w-16 h-16 flex items-center justify-center rounded-full shadow-2xl hover:scale-110 transition-transform group relative">
          <span className="material-symbols-outlined text-2xl">shopping_bag</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-tertiary text-on-tertiary text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-[#121413] w-full py-16 border-t border-[#404943]/15 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:justify-between items-start px-12 max-w-[1920px] mx-auto">
          <div className="mb-12 lg:mb-0">
            <div className="text-tertiary font-black text-2xl tracking-tighter mb-6 logo-font">Golden Eagle</div>
            <p className="text-white/40 font-headline text-[10px] tracking-widest uppercase max-w-xs leading-relaxed">
              Experiential dining redefined through the lens of heritage and modernism.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-16">
            <div>
              <h4 className="text-white font-headline font-bold text-[10px] tracking-[0.2em] uppercase mb-8">Navigation</h4>
              <ul className="space-y-4">
                <li><a className="text-white/40 font-headline text-[10px] tracking-widest uppercase hover:text-primary transition-colors" href="#">Contact Us</a></li>
                <li><a className="text-white/40 font-headline text-[10px] tracking-widest uppercase hover:text-primary transition-colors" href="#">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-headline font-bold text-[10px] tracking-[0.2em] uppercase mb-8">Legal</h4>
              <ul className="space-y-4">
                <li><a className="text-white/40 font-headline text-[10px] tracking-widest uppercase hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                <li><a className="text-white/40 font-headline text-[10px] tracking-widest uppercase hover:text-primary transition-colors" href="#">Terms Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 text-[10px] text-white/40 font-headline tracking-widest uppercase">
            © 2024 Golden Eagle Fine Dining. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
