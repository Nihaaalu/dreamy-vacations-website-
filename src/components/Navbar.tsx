import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  onBookNow: () => void;
}

export default function Navbar({ onBookNow }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  // Dynamic background opacity based on scroll state
  const backgroundColor = isScrolled 
    ? 'rgba(13, 13, 13, 0.95)' 
    : 'rgba(13, 13, 13, 0.85)';

  return (
    <motion.header 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-40 font-sans border-b border-white/5 transition-colors duration-300"
      style={{
        background: backgroundColor,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}
      id="main-navbar"
    >
      {/* Outer row wrapper with exact height specifications (80px desktop, 72px mobile) */}
      <div 
        className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 flex items-center justify-between h-[72px] md:h-[80px]"
        id="navbar-inner-container"
      >
        
        {/* LOGO AREA */}
        <Link 
          to="/" 
          className="flex items-center justify-center"
          id="logo-brand-link"
        >
          <Logo className="h-[32px] md:h-[40px]" fallbackSizeClass="w-9 h-9 text-xs" />
        </Link>

        {/* DESKTOP ROUTING LINKS */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className="relative py-1 text-[11px] font-sub font-semibold tracking-[0.18em] uppercase transition-colors hover:text-white"
                style={{ color: isActive ? '#e2d7c5' : 'rgba(255,255,255,0.7)' }}
                id={`nav-link-${item.name.toLowerCase()}`}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#e2d7c5] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT SIDE BUTTON (DESKTOP) */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onBookNow}
            className="px-8 py-3.5 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-[11px] font-sub font-semibold tracking-[0.18em] uppercase rounded-full shadow-md transition-all duration-300 ease-out cursor-pointer flex items-center gap-1.5"
            id="btn-nav-book"
          >
            Book Now <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex items-center md:hidden gap-3">
          <button
            onClick={onBookNow}
            className="px-5 py-2 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-[11px] font-sub font-semibold tracking-[0.18em] uppercase rounded-full shadow-md transition-all duration-300 ease-out cursor-pointer flex items-center gap-1"
            id="btn-nav-book-mobile"
          >
            Book <ArrowRight className="w-3 h-3 flex-shrink-0" />
          </button>
          
          <button
            onClick={() => setIsMobileOpen(prev => !prev)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            style={{ color: '#ffffff' }}
            aria-label="Toggle Menu"
            id="btn-nav-toggle-mobile"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden w-full bg-[#0d0d0d] border-t border-white/5 overflow-hidden shadow-xl"
            id="mobile-drawer"
          >
            <div className="px-6 pt-3 pb-8 space-y-2 flex flex-col">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-4 py-3.5 rounded-xl text-xs font-sub font-semibold tracking-[0.18em] uppercase flex items-center justify-between ${
                      isActive 
                        ? 'bg-white/[0.08] text-white' 
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                    style={{ transition: 'all 250ms ease' }}
                    id={`nav-link-mobile-${item.name.toLowerCase()}`}
                  >
                    <span>{item.name}</span>
                    <ArrowRight className="w-4 h-4 transition-transform text-[#e2d7c5]" />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
