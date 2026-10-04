import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import SearchOverlay from './SearchOverlay';
import { useSession } from '../context/SessionContext';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const { totalItems, toggleCart } = useCart();
  const { user, signOut, isAdmin } = useAuth();
  const { tableId } = useSession();
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 30);
  });

  const navLinks = [
    { title: t('nav.menu'), path: '/menu' },
    { title: t('nav.reservations'), path: '/reservations' },
    { title: t('nav.private_dining'), path: '/private-dining' },
    { title: t('nav.gallery'), path: '/gallery' },
    { title: t('nav.our_story'), path: '/our-story' },
  ];

  return (
    <>
      <motion.header 
        initial={false}
        animate={{
          backgroundColor: isScrolled ? 'rgba(18, 20, 19, 0.92)' : 'rgba(18, 20, 19, 0.6)',
          backdropFilter: 'blur(16px)',
          borderBottomColor: isScrolled ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
        }}
        className="fixed top-0 w-full z-50 transition-colors duration-300 border-b"
      >
        <div className="flex justify-between items-center px-4 sm:px-8 md:px-12 py-3.5 sm:py-4 w-full max-w-[1920px] mx-auto font-headline">
          {/* Brand Logo & Table Badge */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/" className="flex flex-col group">
              <span className="text-xl sm:text-2xl font-black tracking-[0.15em] sm:tracking-[0.2em] text-tertiary uppercase leading-none transition-all group-hover:text-white">
                Golden Eagle
              </span>
              <span className="text-[9px] font-bold tracking-[0.3em] text-white/40 uppercase mt-0.5">
                Rawaq Resort
              </span>
            </Link>

            {tableId && (
              <div className="px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-lg hidden sm:flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs text-primary">restaurant</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">{tableId}</span>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 tracking-wide font-medium text-xs uppercase">
            {navLinks.map((link) => (
              <Link 
                key={link.title}
                to={link.path} 
                className={`transition-all duration-300 hover:text-primary ${
                  location.pathname === link.path ? 'text-tertiary border-b-2 border-tertiary pb-1 font-bold' : 'text-white/70'
                }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/90 hover:text-white transition-all duration-200"
              title={language === 'en' ? 'التحويل إلى العربية' : 'Switch to English'}
              aria-label="Toggle Language"
            >
              <span className="material-symbols-outlined text-[16px] text-tertiary">language</span>
              <span className="font-bold text-[11px] tracking-wider uppercase">
                {language === 'en' ? 'العربية' : 'EN'}
              </span>
            </button>

            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              title={language === 'en' ? 'Search menu' : 'بحث في المنيو'}
              aria-label="Search"
            >
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
            
            <button 
              onClick={toggleCart} 
              className="relative p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-colors group"
              title={t('cart.title')}
              aria-label="Cart"
            >
              <span className="material-symbols-outlined text-2xl group-hover:scale-105 transition-transform">
                shopping_bag
              </span>
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-tertiary text-on-tertiary text-[10px] font-black w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full ring-2 ring-surface animate-scale">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="p-2 text-tertiary hover:bg-tertiary/10 rounded-full transition-colors"
                    title={t('nav.admin')}
                  >
                    <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                  </Link>
                )}
                <button 
                  onClick={() => signOut()}
                  className="p-2 text-white/40 hover:text-error hover:bg-white/5 rounded-full transition-colors"
                  title={t('nav.sign_out')}
                >
                  <span className="material-symbols-outlined text-xl">logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <button className="bg-primary/90 hover:bg-primary text-on-primary px-4 sm:px-5 py-2 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-200">
                  {t('nav.sign_in')}
                </button>
              </Link>
            )}
            
            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              aria-label="Toggle mobile menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-surface-container-high/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6"
            >
              <nav className="flex flex-col gap-4 text-sm font-bold uppercase">
                {navLinks.map((link) => (
                  <Link
                    key={link.title}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`py-2 px-3 rounded-xl transition-all ${
                      location.pathname === link.path
                        ? 'bg-primary/10 text-tertiary font-black'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.title}
                  </Link>
                ))}

                <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                  <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl">
                    <span className="text-xs text-white/70">
                      {language === 'en' ? 'Interface Language' : 'لغة الواجهة'}
                    </span>
                    <button
                      onClick={toggleLanguage}
                      className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm text-tertiary">language</span>
                      <span>{language === 'en' ? 'العربية' : 'English'}</span>
                    </button>
                  </div>

                  {tableId && (
                    <div className="flex items-center gap-2 text-xs text-white/60 px-3">
                      <span className="material-symbols-outlined text-sm text-primary">restaurant</span>
                      <span>{t('nav.table')}: {tableId}</span>
                    </div>
                  )}

                  {!user && (
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full bg-primary text-on-primary py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider"
                    >
                      {t('nav.sign_in')}
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
