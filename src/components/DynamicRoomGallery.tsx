import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from 'lucide-react';

interface DynamicRoomGalleryProps {
  roomId: string;
  roomName: string;
  localImages: string[];
}

export default function DynamicRoomGallery({ roomId, roomName, localImages }: DynamicRoomGalleryProps) {
  // Use the dynamically passed localImages from data.ts
  const [images, setImages] = useState<string[]>(localImages);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (index: number) => {
    // If a local image fails to load, remove it from the state array so it handles missing files dynamically
    setImages(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      // Ensure activeIndex is valid
      if (activeIndex >= updated.length) {
        setActiveIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
  };

  if (images.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-4 font-sans" id={`room-gallery-${roomId}`}>
      
      {/* MAIN VIEWPORT CARD */}
      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black shadow-lg group">
        
        {/* Dynamic Image Slideshow Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={`${roomName} - View ${activeIndex + 1}`}
              referrerPolicy="no-referrer"
              onError={() => handleImageError(activeIndex)}
              className="main-gallery-image w-full h-full object-cover select-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            />
          </AnimatePresence>
        </div>

        {/* Ambient Overlay Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* CONTROLS (Only visible if > 1 images exist) */}
        {images.length > 1 && (
          <>
            {/* Left Nav Arrow */}
            <button
              onClick={handlePrev}
              className="gallery-arrow gallery-arrow-btn absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center bg-black/40 hover:bg-black/75 text-white/90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Previous image"
              id="btn-gallery-prev"
            >
              <ChevronLeft 
                strokeWidth={1.75}
                style={{
                  width: '20px',
                  height: '20px',
                  position: 'relative',
                  top: '0',
                  left: '0'
                }} 
              />
            </button>
 
            {/* Right Nav Arrow */}
            <button
              onClick={handleNext}
              className="gallery-arrow gallery-arrow-btn absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center bg-black/40 hover:bg-black/75 text-white/90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Next image"
              id="btn-gallery-next"
            >
              <ChevronRight 
                strokeWidth={1.75}
                style={{
                  width: '20px',
                  height: '20px',
                  position: 'relative',
                  top: '0',
                  left: '0'
                }} 
              />
            </button>
          </>
        )}

        {/* FLOATING CORNER INFO CONTROLS */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
          <button
            onClick={() => setLightboxIndex(activeIndex)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-medium backdrop-blur shadow-md hover:scale-105 transition-transform"
            id="btn-gallery-maximize"
          >
            <Maximize2 className="w-3.5 h-3.5" /> Fullscreen
          </button>
        </div>

        <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-mono font-medium backdrop-blur">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* THUMBNAIL TRACK (Infinite dynamic support - 1, 5, 20 or unlimited) */}
      {images.length > 1 && (
        <div className="w-full overflow-x-auto py-1 px-0.5 flex gap-3 justify-start md:justify-center scrollbar-none" id="gallery-thumbnail-strip">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`room-thumbnail relative flex-shrink-0 w-20 md:w-24 aspect-[16/10] cursor-pointer focus:outline-none hover:opacity-100 ${activeIndex === idx ? 'active' : ''}`}
              style={{
                borderRadius: '12px',
                border: activeIndex === idx 
                  ? '1px solid rgba(226,215,197,0.9)' 
                  : '1px solid rgba(255,255,255,0.05)',
                opacity: activeIndex === idx ? 1 : 0.6,
                transform: activeIndex === idx ? 'scale(1.02)' : 'scale(1)',
                transition: 'border-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease'
              }}
            >
              <img 
                src={img} 
                alt="Thumbnail" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[11px]" 
              />
              <div className="absolute inset-0 bg-black/5" />
            </button>
          ))}
        </div>
      )}

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col justify-between p-4 font-sans select-none"
            id="gallery-lightbox-modal"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between w-full text-white/80 p-4 z-10">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#e2d7c5]" />
                <span className="text-xs md:text-sm font-medium tracking-wide uppercase">{roomName} Gallery</span>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white hover:scale-105 active:scale-95 transition-transform"
                id="btn-lightbox-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image Slider */}
            <div className="relative w-full flex-grow flex items-center justify-center">
              <button
                onClick={() => setLightboxIndex(prev => (prev! === 0 ? images.length - 1 : prev! - 1))}
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white hover:scale-105 active:scale-95 transition-transform z-10"
                id="btn-lightbox-prev"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="max-w-5xl max-h-[75vh] w-full h-full flex items-center justify-center p-2">
                <motion.img
                  key={lightboxIndex}
                  src={images[lightboxIndex]}
                  alt={`${roomName} - Expanded`}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <button
                onClick={() => setLightboxIndex(prev => (prev! === images.length - 1 ? 0 : prev! + 1))}
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white hover:scale-105 active:scale-95 transition-transform z-10"
                id="btn-lightbox-next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Indicator */}
            <div className="flex justify-center text-white/60 text-xs font-mono py-4">
              {lightboxIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
