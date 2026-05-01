import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import SearchOverlay from './SearchOverlay';
import { useSession } from '../context/SessionContext';

const Header = () => {
  const { totalItems, toggleCart } = useCart();
  const { user, signOut, isAdmin } = useAuth();
  const { tableId } = useSession();
  const location = useLocation();

  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { title: 'Menu', path: '/menu' },
    { title: 'Reservations', path: '/reservations' },
    { title: 'Private Dining', path: '/private-dining' },
    { title: 'Gallery', path: '/gallery' },
  ];

  return (
    <>
      <motion.header 
        initial={false}
        animate={{
          backgroundColor: isScrolled ? 'rgba(18, 20, 19, 0.8)' : 'rgba(18, 20, 19, 0)',
          backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
          borderBottomColor: isScrolled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0)',
        }}
        className="fixed top-0 w-full z-50 transition-colors duration-500 border-b"
      >
        <div className="flex justify-between items-center px-8 md:px-12 py-6 w-full max-w-[1920px] mx-auto font-headline">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex flex-col group">
              <span className="text-3xl font-black tracking-[0.25em] text-tertiary uppercase leading-none mb-1 transition-all group-hover:tracking-[0.3em]">
                Rawaq
              </span>
              <div className="h-[2px] w-8 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </Link>
            {tableId && (
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg hidden md:flex items-center gap-2">
                <span className="material-symbols-outlined text-[10px] text-primary">restaurant</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Table {tableId}</span>
              </div>
            )}
          </div>

          
          <nav className="hidden lg:flex items-center gap-10 tracking-tight font-medium uppercase text-sm">
            {navLinks.map((link) => (
              <Link 
                key={link.title}
                to={link.path} 
                className={`transition-all duration-500 ease-in-out hover:opacity-80 ${
                  location.pathname === link.path ? 'text-tertiary border-b-2 border-tertiary pb-1' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="material-symbols-outlined text-white/70 hover:text-white transition-colors text-xl font-light"
            >
              search
            </button>
            
            <button onClick={toggleCart} className="relative group">
              <span className="material-symbols-outlined text-white/70 group-hover:text-white transition-colors text-2xl font-light">shopping_bag</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-tertiary text-on-tertiary text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-surface">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link to="/admin" className="text-tertiary material-symbols-outlined hover:scale-110 transition-transform">
                    admin_panel_settings
                  </Link>
                )}
                <button 
                  onClick={() => signOut()}
                  className="text-white/40 hover:text-white transition-colors material-symbols-outlined"
                >
                  logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <button className="bg-primary text-on-primary px-8 py-2.5 rounded-lg font-bold uppercase tracking-widest text-xs scale-98-on-click-slow-ease transition-all duration-300 hover:opacity-90">
                  Join Us
                </button>
              </Link>
            )}
            
            <button className="lg:hidden material-symbols-outlined text-white/70">menu</button>
          </div>
        </div>
      </motion.header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
