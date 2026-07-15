import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, X, ChevronLeft, ChevronRight, 
  ZoomIn, ZoomOut, RotateCcw, ImageIcon, Sparkles 
} from 'lucide-react';
import { GALLERY_ITEMS } from '../data';

interface GalleryProps {
  onOpenBooking?: (roomName: string) => void;
}

export default function Gallery({ onOpenBooking }: GalleryProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isSlideshowActive, setIsSlideshowActive] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [pinchStartDist, setPinchStartDist] = useState<number | null>(null);

  // Auto-play timer for slideshow
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSlideshowActive && lightboxIndex !== null) {
      interval = setInterval(() => {
        setLightboxIndex((prev) => {
          if (prev === null) return null;
          return (prev + 1) % filteredImages.length;
        });
        // Reset zoom on slide change
        setZoomScale(1);
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSlideshowActive, lightboxIndex, activeFilter]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, activeFilter]);

  // Extract all categories dynamically from the images
  const availableCategoriesSet = new Set<string>();
  GALLERY_ITEMS.forEach(item => {
    if (item.category && item.category !== 'all') {
      availableCategoriesSet.add(item.category);
    }
  });
  const availableCategories = Array.from(availableCategoriesSet).sort();

  // Category mapping dictionary
  const categoryDisplayNames: Record<string, string> = {
    'all': 'All',
    'rooms': 'Rooms',
    'pool': 'Pool',
    'gardens': 'Gardens',
    'architecture': 'Architecture',
    'night-views': 'Night Views',
    'night_views': 'Night Views',
    'night': 'Night Views',
    'family-spaces': 'Family Spaces',
    'family_spaces': 'Family Spaces',
    'family': 'Family Spaces'
  };

  const getDisplayName = (cat: string) => {
    return categoryDisplayNames[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  // Filter images based on selected tab
  const filteredImages = GALLERY_ITEMS.filter(item => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const openLightbox = (index: number, startSlideshow: boolean = false) => {
    setLightboxIndex(index);
    setZoomScale(1);
    setIsSlideshowActive(startSlideshow);
    // Lock scrolling
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setIsSlideshowActive(false);
    setZoomScale(1);
    // Restore scrolling
    document.body.style.overflow = '';
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    setZoomScale(1);
  };

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    setZoomScale(1);
  };

  // Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 60) {
      handleNext();
    } else if (diff < -60) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  // Pinch-to-zoom support
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      
      if (pinchStartDist === null) {
        setPinchStartDist(dist);
      } else {
        const factor = dist / pinchStartDist;
        setZoomScale(Math.max(1, Math.min(4, zoomScale * factor)));
      }
    }
  };

  const handleTouchEndPinch = () => {
    setPinchStartDist(null);
  };

  const zoomIn = () => {
    setZoomScale(prev => Math.min(4, prev + 0.5));
  };

  const zoomOut = () => {
    setZoomScale(prev => Math.max(1, prev - 0.5));
  };

  const resetZoom = () => {
    setZoomScale(1);
  };

  // Get index of neighboring images for preloading
  const prevIndex = lightboxIndex !== null ? (lightboxIndex - 1 + filteredImages.length) % filteredImages.length : null;
  const nextIndex = lightboxIndex !== null ? (lightboxIndex + 1) % filteredImages.length : null;

  return (
    <div className="w-full bg-[#0d0d0d] text-white font-sans py-24 min-h-screen" id="gallery-page-container">
      
      {/* 1. HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 pb-8">
        <div className="max-w-3xl space-y-5" id="gallery-hero">
          <span className="text-xs font-sub font-semibold tracking-[0.25em] text-[#e2d7c5] uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#e2d7c5] animate-pulse" /> CAPTURING MEMORIES
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-light text-white tracking-tight leading-tight">
            Resort Gallery
          </h1>
          <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-2xl">
            Explore every corner of Dreamy Vacations—from elegant accommodations to serene outdoor spaces, family experiences, and the natural beauty surrounding our resort.
          </p>
        </div>

        {/* 2. TOP ACTIONS BAR */}
        <div 
          className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6" 
          id="gallery-actions-bar"
        >
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-light text-[#e2d7c5]" id="total-photos-count">
              {filteredImages.length}
            </span>
            <span className="text-xs font-sub font-medium tracking-widest text-white/50 uppercase">
              {filteredImages.length === 1 ? 'Photograph' : 'Photographs'}
            </span>
          </div>

          <button
            onClick={() => openLightbox(0, true)}
            className="self-start sm:self-auto px-6 py-3 border border-[#e2d7c5]/30 hover:border-[#e2d7c5] text-[#e2d7c5] hover:bg-[#e2d7c5]/5 text-[11px] font-sub font-semibold tracking-[0.18em] uppercase rounded-full shadow-sm transition-all duration-300 ease-out flex items-center gap-2"
            id="btn-start-slideshow"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> View Slideshow
          </button>
        </div>

        {/* 3. CATEGORY FILTER (Show pills dynamically, fallback to All if no folders/categories exist yet) */}
        {availableCategories.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2.5 pb-2" id="gallery-category-filters">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-sub font-semibold tracking-wider transition-all duration-300 ${
                activeFilter === 'all'
                  ? 'bg-[#e2d7c5] text-[#0d0d0d]'
                  : 'bg-white/5 hover:bg-white/10 text-white/85 hover:text-white border border-white/5'
              }`}
              id="filter-pill-all"
            >
              All
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-sub font-semibold tracking-wider transition-all duration-300 ${
                  activeFilter === cat
                    ? 'bg-[#e2d7c5] text-[#0d0d0d]'
                    : 'bg-white/5 hover:bg-white/10 text-white/85 hover:text-white border border-white/5'
                }`}
                id={`filter-pill-${cat}`}
              >
                {getDisplayName(cat)}
              </button>
            ))}
          </div>
        )}

        {/* 4. EDITORIAL MASONRY GRID */}
        {filteredImages.length === 0 ? (
          <div className="mt-16 py-20 text-center border border-dashed border-white/10 rounded-2xl bg-zinc-950/50 flex flex-col items-center justify-center space-y-4">
            <ImageIcon className="w-10 h-10 text-white/20 stroke-[1.2]" />
            <h3 className="text-lg font-display font-light text-white/70">No photos found</h3>
            <p className="text-xs text-white/40 max-w-sm">No photographs are currently available in this category folder.</p>
          </div>
        ) : (
          <div 
            className="mt-12 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 [column-fill:_balance]"
            id="gallery-masonry-grid"
          >
            {filteredImages.map((item, index) => (
              <motion.div
                key={item.src + index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => openLightbox(index, false)}
                className="break-inside-avoid mb-6 group cursor-pointer relative overflow-hidden rounded-2xl border border-white/5 bg-[#121212]"
                id={`gallery-card-${index}`}
              >
                {/* Image element with disabled dragging/downloads */}
                <div className="w-full relative overflow-hidden">
                  <img
                    src={item.src}
                    alt={`Dreamy Vacations Resort visual portfolio ${index + 1}`}
                    loading="lazy"
                    onContextMenu={(e) => e.preventDefault()}
                    draggable="false"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover select-none group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Subtle Image Indicator on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-[10px] font-sub font-semibold tracking-[0.2em] text-[#e2d7c5] uppercase bg-[#0d0d0d]/80 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                    Enlarge Photo
                  </span>
                </div>

                {/* Tiny counter bottom right */}
                <div className="absolute bottom-3 right-3 text-[9px] font-mono text-white/35 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* 5. BOTTOM BOOKING CTA */}
      <section className="mt-28 py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden" id="gallery-bottom-cta">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(107,91,75,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <span className="text-[10px] font-sub font-semibold tracking-[0.3em] text-[#e2d7c5] uppercase block opacity-70">
            EXPERIENCE COORG IN LUXURY
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-white tracking-tight leading-tight max-w-2xl mx-auto">
            Ready to experience Dreamy Vacations?
          </h2>
          <p className="text-sm md:text-base text-white/60 font-light max-w-lg mx-auto">
            Secure your tranquil stay in Coorg today. Let us make your family vacation or corporate event truly extraordinary.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenBooking('Gallery Inquiry')}
              className="w-full sm:w-auto px-10 py-4.5 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-[11px] font-sub font-semibold tracking-[0.18em] uppercase rounded-full shadow-lg transition-all duration-300 ease-out cursor-pointer text-center"
              id="btn-gallery-cta-book"
            >
              Book Now
            </button>
            <a
              href="tel:+919902960484"
              className="w-full sm:w-auto px-10 py-4.5 border border-white/10 hover:bg-white/5 text-white text-[11px] font-sub font-semibold tracking-[0.18em] uppercase rounded-full shadow-md transition-all duration-300 ease-out text-center"
            >
              Contact Reception
            </a>
          </div>
        </div>
      </section>

      {/* 6. FULLSCREEN ACCESSIBLE LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/98 z-50 flex flex-col justify-between backdrop-blur-xl"
            id="lightbox-backdrop"
          >
            {/* Background close click area */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={closeLightbox} />

            {/* LIGHTBOX TOOLBAR */}
            <div className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-white/5 bg-black/45 backdrop-blur-md">
              <div className="flex flex-col">
                <span className="text-xs font-sub font-semibold tracking-wider text-white/90">
                  Resort Visual Archive
                </span>
                {filteredImages[lightboxIndex]?.category && (
                  <span className="text-[10px] font-mono text-[#e2d7c5] uppercase tracking-widest mt-0.5">
                    Category: {getDisplayName(filteredImages[lightboxIndex].category!)}
                  </span>
                )}
              </div>

              {/* Lightbox Controls */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Slideshow play/pause indicators */}
                {isSlideshowActive ? (
                  <button
                    onClick={() => setIsSlideshowActive(false)}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#6b5b4b] text-white hover:bg-[#85725f] text-[10px] font-sub font-semibold tracking-widest uppercase flex items-center gap-1.5 transition-all"
                    title="Pause Slideshow"
                  >
                    <Pause className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Playing</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsSlideshowActive(true)}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-white/5 text-white/80 hover:bg-white/10 hover:text-white text-[10px] font-sub font-semibold tracking-widest uppercase flex items-center gap-1.5 transition-all border border-white/5"
                    title="Play Slideshow"
                  >
                    <Play className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Slideshow</span>
                  </button>
                )}

                {/* Zoom Controls */}
                <div className="hidden sm:flex items-center bg-white/5 border border-white/5 rounded-lg overflow-hidden">
                  <button 
                    onClick={zoomOut}
                    disabled={zoomScale <= 1}
                    className="p-2 text-white/70 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={resetZoom}
                    disabled={zoomScale === 1}
                    className="p-2 text-white/70 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={zoomIn}
                    disabled={zoomScale >= 4}
                    className="p-2 text-white/70 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={closeLightbox}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-all border border-white/5 cursor-pointer"
                  title="Close Lightbox (ESC)"
                  id="btn-lightbox-close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* LIGHTBOX MAIN VIEWER */}
            <div 
              className="relative flex-grow flex items-center justify-center px-4 sm:px-12 md:px-20 py-2 select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
              onTouchEndCapture={handleTouchEndPinch}
            >
              {/* Left Navigation Chevron Button */}
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-4 sm:left-8 z-20 p-3.5 sm:p-5 rounded-full bg-black/40 hover:bg-[#6b5b4b] text-white/80 hover:text-white border border-white/5 backdrop-blur-md transition-all duration-300 transform -translate-y-1/2 top-1/2"
                title="Previous Image (Left Arrow)"
                id="btn-lightbox-prev"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Main Image Viewport Wrapper */}
              <div className="relative max-w-full max-h-[75vh] flex flex-col items-center justify-center overflow-hidden">
                
                {/* Floating "Slideshow Paused - Click to Resume" Indicator */}
                {!isSlideshowActive && lightboxIndex !== null && (
                  <div className="absolute top-4 z-20">
                    <button
                      onClick={() => setIsSlideshowActive(true)}
                      className="px-4 py-2 bg-[#6b5b4b]/90 hover:bg-[#6b5b4b] text-white text-[10px] font-sub font-semibold tracking-[0.18em] uppercase rounded-full shadow-md backdrop-blur-sm transition-all flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-current" /> Resume Slideshow
                    </button>
                  </div>
                )}

                <motion.img
                  key={lightboxIndex}
                  src={filteredImages[lightboxIndex]?.src}
                  alt={`Dreamy Vacations fullscreen resort view ${lightboxIndex + 1}`}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.8)] select-none cursor-pointer"
                  style={{
                    transform: `scale(${zoomScale})`,
                    transition: pinchStartDist !== null ? 'none' : 'transform 200ms ease-out',
                  }}
                  onClick={() => {
                    // Tap on image pauses the active slideshow, or resets zoom
                    if (isSlideshowActive) {
                      setIsSlideshowActive(false);
                    } else if (zoomScale > 1) {
                      setZoomScale(1);
                    } else {
                      setZoomScale(1.8); // Simple tap to zoom toggle
                    }
                  }}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: zoomScale, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                />
              </div>

              {/* Right Navigation Chevron Button */}
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 sm:right-8 z-20 p-3.5 sm:p-5 rounded-full bg-black/40 hover:bg-[#6b5b4b] text-white/80 hover:text-white border border-white/5 backdrop-blur-md transition-all duration-300 transform -translate-y-1/2 top-1/2"
                title="Next Image (Right Arrow)"
                id="btn-lightbox-next"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* LIGHTBOX FOOTER / COUNTER */}
            <div className="relative z-10 w-full px-6 py-5 bg-black/45 border-t border-white/5 text-center flex items-center justify-center gap-4">
              <span className="text-xs font-mono text-white/50 tracking-wider">
                Photo <span className="text-white font-medium">{lightboxIndex + 1}</span> of <span className="text-white/80">{filteredImages.length}</span>
              </span>
            </div>

            {/* Offscreen / Hidden Images for preloading the adjacent pictures */}
            {prevIndex !== null && filteredImages[prevIndex] && (
              <img 
                src={filteredImages[prevIndex].src} 
                className="hidden" 
                aria-hidden="true" 
                referrerPolicy="no-referrer"
              />
            )}
            {nextIndex !== null && filteredImages[nextIndex] && (
              <img 
                src={filteredImages[nextIndex].src} 
                className="hidden" 
                aria-hidden="true" 
                referrerPolicy="no-referrer"
              />
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
