import { motion } from 'motion/react';
import { MessageCircle, Phone } from 'lucide-react';

interface HeroAnimationProps {
  onBookNow: () => void;
}

export default function HeroAnimation({ onBookNow }: HeroAnimationProps) {
  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center text-center font-sans select-none bg-[#0d0d0d]" 
      id="hero-animation-container"
    >
      {/* THE CINEMATIC VIDEO BACKGROUND */}
      <video
        src="/video/dramy.mp4"
        autoPlay
        muted
        playsInline
        loop
        preload="metadata"
        poster="/images/rooms/sf1/sf1.jpeg"
        aria-label="Cinematic video tour of Dreamy Vacations resort grounds, pool, and accommodations in Kushalnagar, Coorg"
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{
          objectPosition: 'center',
          filter: 'none',
        }}
        id="hero-bg-video"
      >
        <p className="sr-only">
          Cinematic video showcasing Dreamy Vacations resort grounds, outdoor swimming pool, and peaceful natural surroundings in Kushalnagar, Coorg.
        </p>
      </video>

      {/* CINEMATIC OVERLAY */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        id="hero-cinematic-overlay"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.48) 100%)'
        }}
      />

      {/* SUBTLE VIGNETTE OVERLAY */}
      <div 
        className="absolute inset-0 z-12 pointer-events-none"
        id="hero-vignette-overlay"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.22) 100%)'
        }}
      />

      {/* MINI LOGO (Fades in at 0.3s) - Minimalist wordmark at top center */}
      <div className="absolute top-8 left-0 right-0 z-20 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.5,
            ease: 'easeOut'
          }}
          className="text-[10px] tracking-[6px] font-sub font-semibold text-white uppercase opacity-90 select-none"
          id="hero-mini-wordmark"
        >
          DREAMY VACATIONS
        </motion.div>
      </div>

      {/* MAIN HERO CONTENT (Vertically centered, shifted slightly lower for premium composition) */}
      <div className="relative z-20 px-6 sm:px-12 max-w-4xl flex flex-col items-center justify-center h-full pt-[8vh]">
        
        {/* MAIN HEADING (Fades in at 0.6s) */}
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6,
            duration: 0.5,
            ease: 'easeOut'
          }}
          className="text-[34px] sm:text-[44px] md:text-[60px] font-display font-medium text-white tracking-tight leading-[1.15] mb-0 text-center select-none"
          style={{ textShadow: '0 4px 20px rgba(0,0,0,0.35)' }}
          id="hero-title"
        >
          <span className="block">Dreamy Vacations</span>
          <span className="block text-sm sm:text-lg md:text-xl font-sub font-normal text-[#e2d7c5] mt-2 tracking-wide uppercase">
            Family Resort in Kushalnagar, Coorg
          </span>
        </motion.h1>

        {/* TAGLINE (Fades in at 0.9s) */}
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.9,
            duration: 0.5,
            ease: 'easeOut'
          }}
          className="text-[11px] sm:text-[12px] font-sub font-medium text-[#e2d7c5] uppercase text-center block leading-none select-none"
          style={{ letterSpacing: '0.25em', opacity: 0.75, marginTop: '12px', marginBottom: '32px' }}
          id="hero-tagline"
        >
          WHERE DREAMS UNFOLD
        </motion.span>

        {/* DESCRIPTION (Fades in at 1.2s) */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.2,
            duration: 0.5,
            ease: 'easeOut'
          }}
          className="text-[15px] text-white/80 w-full max-w-[340px] sm:max-w-md leading-[1.65] font-sans font-light text-center select-none"
          style={{ marginTop: '12px' }}
          id="hero-description"
        >
          Comfortable family and group accommodation in Kushalnagar, Coorg.
        </motion.p>

        {/* BOOK NOW ACTION BUTTON (Fades in at 1.4s) */}
        {/* HERO BOOKING BUTTONS */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    delay: 1.4,
    duration: 0.5,
    ease: 'easeOut'
  }}
  className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
  id="hero-book-now-container"
>
  <a
    href="https://wa.me/919902960484?text=Hello%20Dreamy%20Vacations%2C%20I%20would%20like%20to%20enquire%20about%20room%20availability%20and%20booking."
    target="_blank"
    rel="noopener noreferrer"
    className="px-8 py-3.5 bg-[#6b5b4b] text-white font-sub font-semibold rounded-full text-[11px] tracking-[0.18em] uppercase transition-all duration-300 ease-out hover:bg-[#85725f] shadow-md flex items-center justify-center gap-2 cursor-pointer"
  >
    <MessageCircle className="w-4 h-4" />
    BOOK NOW
  </a>

  <a
    href="tel:+919902960484"
    className="px-8 py-3.5 bg-[#6b5b4b] text-white font-sub font-semibold rounded-full text-[11px] tracking-[0.18em] uppercase transition-all duration-300 ease-out hover:bg-[#85725f] shadow-md flex items-center justify-center gap-2 cursor-pointer"
  >
    <Phone className="w-4 h-4" />
    CALL NOW
  </a>
</motion.div>
      </div>
    </div>
  );
}
