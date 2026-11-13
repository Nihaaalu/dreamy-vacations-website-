import { useEffect, useState } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Phone } from 'lucide-react';

const WHATSAPP_URL =
  'https://wa.me/919902960484?text=Hello%20Dreamy%20Vacations%2C%20I%20would%20like%20to%20enquire%20about%20room%20availability.';

const NON_HOME_ROUTES = [
  '/rooms',
  '/rooms/couples',
  '/rooms/families',
  '/rooms/group-booking',
  '/rooms/:id',
  '/group-booking',
  '/gallery',
  '/about',
  '/contact',
  '/booking',
  '/travel-guide',
  '/travel-guide/:slug',
  '/blog',
  '/blog/:slug',
  '/trip-planner',
  '/trip/:id',
];

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <path d="M9.5 9.2c.2-.4.5-.4.7-.4h.5c.2 0 .4.1.5.4l.6 1.4c.1.2.1.5-.1.7l-.4.5c-.1.1-.2.3-.1.5.3.7.9 1.4 1.6 1.8.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.7-.1l1.3.6c.3.1.4.3.4.6v.5c0 .4-.3.8-.8.9-.6.1-1.7.1-3-.6-1.5-.8-2.7-2-3.4-3.4-.7-1.2-.7-2.2-.6-2.8z" />
    </svg>
  );
}

export default function FloatingContactButtons() {
  const { pathname } = useLocation();
  const [heroScrollState, setHeroScrollState] = useState<{ pathname: string; passed: boolean }>({
    pathname: '',
    passed: false,
  });

  const isPublicSubRoute = NON_HOME_ROUTES.some((pattern) =>
    Boolean(matchPath({ path: pattern, end: true }, pathname))
  );

  useEffect(() => {
    if (isPublicSubRoute) {
      return;
    }

    setHeroScrollState({ pathname, passed: false });

    let observer: IntersectionObserver | null = null;
    let frameId: number | null = null;

    const attachObserver = () => {
      const heroEl = document.getElementById('hero-animation-container');
      if (!heroEl) {
        return false;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          // Visible only once the hero section's bottom boundary has completely exited above the viewport
          const passedHero = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
          setHeroScrollState({ pathname, passed: passedHero });
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0,
        }
      );

      observer.observe(heroEl);
      return true;
    };

    if (!attachObserver()) {
      frameId = window.requestAnimationFrame(() => {
        attachObserver();
      });
    }

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, [pathname, isPublicSubRoute]);

  const isVisible =
    isPublicSubRoute || (heroScrollState.pathname === pathname && heroScrollState.passed);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          key="floating-contact-actions"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Quick contact actions"
          className="fixed right-4 sm:right-6 z-30 flex items-center gap-2.5 sm:gap-3 max-w-[calc(100vw-2rem)]"
          style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          id="floating-contact-actions"
        >
          <a
            href="tel:+919902960484"
            aria-label="Call Dreamy Vacations at +91 99029 60484"
            className="min-h-[44px] px-4 sm:px-5 py-2.5 rounded-full bg-[#161412]/90 hover:bg-[#231f1b] text-[#e2d7c5] hover:text-white border border-[#e2d7c5]/25 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.45)] font-sub font-semibold text-[10px] sm:text-[11px] tracking-[0.16em] uppercase flex items-center justify-center gap-2 transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2d7c5]"
            id="floating-call-now-btn"
          >
            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
            <span>CALL NOW</span>
          </a>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book now via WhatsApp with Dreamy Vacations"
            className="min-h-[44px] px-4 sm:px-5 py-2.5 rounded-full bg-[#6b5b4b] hover:bg-[#85725f] text-white border border-[#e2d7c5]/25 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.45)] font-sub font-semibold text-[10px] sm:text-[11px] tracking-[0.16em] uppercase flex items-center justify-center gap-2 transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2d7c5]"
            id="floating-book-now-btn"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>BOOK NOW</span>
          </a>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
