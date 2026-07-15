import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Waves, Sparkles, Gamepad2, Users, Home as HomeIcon, 
  Car, Eye, ChevronRight, Phone, MapPin, ArrowRight,
  Wifi, Heart, Bed, Calendar
} from 'lucide-react';
import HeroAnimation from '../components/HeroAnimation';
import { ROOMS, GALLERY_ITEMS } from '../data';

const ROOM_SUBTITLES: Record<string, string> = {
  'standard-family-room': 'Perfect for families seeking comfort.',
  'deluxe-family-room': 'More space for memorable family stays.',
  'superior-deluxe-double': 'Our flagship premium accommodation.',
  'triple-room': 'Designed for friends and small groups.',
};

interface HomeProps {
  onOpenBooking?: (roomName: string) => void;
}

export default function Home({ onOpenBooking }: HomeProps) {
  const navigate = useNavigate();
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  
  const roomsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const galleryImages = GALLERY_ITEMS;

  const facilities = [
    { icon: Waves, name: 'Swimming Pool', desc: 'A pristine outdoor sanctuary to refresh and unwind.' },
    { icon: Sparkles, name: 'Rain Dance', desc: 'Immersive rhythmic mist system with private ambient sound.' },
    { icon: Gamepad2, name: 'Indoor Games', desc: 'Carrom, chess, and curated tabletop recreation for quiet afternoons.' },
    { icon: Heart, name: 'Family Friendly', desc: 'Sober, private, and exceptionally safe grounds for child-friendly leisure.' },
    { icon: Bed, name: 'Premium Bedding', desc: 'Spacious accommodations outfitted with exceptionally cozy, high-quality mattresses.' },
    { icon: Car, name: 'Secure Parking', desc: 'Spacious on-site private space for vehicles and travel buses.' },
    { icon: HomeIcon, name: 'Outdoor Seating', desc: 'Symmetric landscape sitting zones flanked by luxury native greenery.' },
    { icon: Wifi, name: 'Free WiFi', desc: 'High-speed fiber connectivity running seamlessly across all rooms.' }
  ];

  const reviews = [
    {
      name: "Suresh Kumar",
      location: "Bangalore",
      text: "Very comfortable stay with family. The suites are exceptionally clean, spacious, and the surrounding Coorg atmosphere is wonderfully peaceful."
    },
    {
      name: "Priyanka Patel",
      location: "Mumbai",
      text: "Excellent rooms and a pristine swimming pool. The children thoroughly loved the play areas. A trustworthy retreat for family reunions!"
    },
    {
      name: "Rohan D'Souza",
      location: "Mangalore",
      text: "Peaceful atmosphere and friendly staff. It feels like an exclusive luxury property while remaining deeply comfortable and authentic."
    }
  ];

  const roomCategories = ROOMS.map((room) => ({
    id: room.id,
    name: room.name,
    subtitle: ROOM_SUBTITLES[room.id] || '',
    price: room.price.toLocaleString('en-IN'),
    image: room.images[0]
  }));

  const scrollLeft = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#0d0d0d] text-white font-sans overflow-hidden" id="homepage-root">
      
      {/* 1. HERO VIDEO SECTION */}
      <HeroAnimation onBookNow={() => {
        navigate('/rooms');
      }} />

      {/* 2. TRUST BAR / SOCIAL PROOF STRIP */}
      <section 
        className="w-full bg-[#e2d7c5] text-[#0d0d0d] py-10 border-b border-[#6b5b4b]/10 relative z-30 flex flex-col items-center justify-center text-center px-6"
        id="home-trust-bar"
      >
        <p className="font-display font-medium text-lg sm:text-xl md:text-2xl tracking-tight leading-relaxed max-w-3xl text-[#111111]">
          "Welcoming guests to Coorg with comfort and care."
        </p>
        <span className="text-[11px] font-sub font-semibold tracking-[0.18em] text-[#6b5b4b]/80 uppercase block mt-4">
          Trusted by hundreds of families visiting Coorg
        </span>
      </section>

      {/* 3. ROOM CATEGORIES */}
      <section className="pt-12 pb-24 px-6 sm:px-12 lg:px-20 bg-[#0d0d0d]" id="home-rooms-section">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-4">
              <span className="text-[10px] font-sub font-semibold tracking-[0.3em] text-[#e2d7c5] uppercase block opacity-70">
                LUXURY ACCOMMODATION
              </span>
              <h2 className="text-[32px] sm:text-[46px] font-display font-medium text-white tracking-tight leading-tight">
                Our Accommodation
              </h2>
            </div>

            <div className="mt-8 md:mt-0 flex items-center gap-4">
              <button 
                onClick={() => scrollLeft(roomsRef)}
                className="p-4 rounded-full border border-white/10 hover:border-white/40 text-white transition-all hidden md:block cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <button 
                onClick={() => scrollRight(roomsRef)}
                className="p-4 rounded-full border border-white/10 hover:border-white/40 text-white transition-all hidden md:block cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Room Cards Row */}
          <div 
            ref={roomsRef}
            className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-none scroll-smooth touch-pan-x"
            id="rooms-carousel"
          >
            {roomCategories.map((room) => (
              <div
                key={room.id}
                className="w-[280px] sm:w-[350px] md:w-[370px] h-[440px] sm:h-[470px] flex-shrink-0 snap-start bg-[#121212] rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-white/10"
                id={`room-card-${room.id}`}
              >
                {/* Large Room Image */}
                <div className="relative h-[220px] sm:h-[250px] overflow-hidden bg-zinc-950 flex-shrink-0">
                  <img
                    src={room.image}
                    alt={room.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-101"
                  />
                  <div className="absolute top-4 right-4 bg-[#6b5b4b] px-4 py-2 rounded-full text-[11px] font-sub font-semibold text-white tracking-widest uppercase">
                    FROM ₹{room.price}
                  </div>
                </div>

                {/* Simplified Info Block */}
                <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
                  <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-xl sm:text-2xl font-display font-light text-white leading-tight">
                      {room.name}
                    </h3>
                    <p className="text-[13px] sm:text-sm text-white/55 font-sans font-light leading-relaxed tracking-wide">
                      {room.subtitle}
                    </p>
                  </div>

                  {/* Actions: One primary CTA */}
                  <div className="mt-4">
                    <button
                      onClick={() => navigate(`/rooms/${room.id}`)}
                      className="w-full py-3.5 bg-[#6b5b4b] text-white hover:bg-[#85725f] text-xs font-sub font-semibold tracking-[0.18em] uppercase rounded-full shadow-md transition-all duration-300 ease-out cursor-pointer flex items-center justify-center gap-1.5"
                      id={`btn-home-book-now-${room.id}`}
                    >
                      Book Now <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual swipe indicator for mobile */}
          <div className="text-center mt-6 text-xs text-white/40 font-light flex items-center justify-center gap-2 md:hidden">
            <span>Swipe to discover all configurations</span>
            <ArrowRight className="w-3.5 h-3.5 animate-pulse text-[#e2d7c5]" />
          </div>

          {/* Centered View All Rooms Button */}
          <div className="mt-14 flex flex-col items-center">
            <div className="w-full max-w-sm border-t border-white/5 my-6" />
            <Link
              to="/rooms"
              className="px-8 py-3 bg-transparent border border-[#e2d7c5]/30 hover:border-[#e2d7c5] hover:bg-[#e2d7c5]/5 text-[#e2d7c5] hover:text-white text-[10px] font-sub font-semibold tracking-[0.18em] uppercase rounded-full shadow-sm transition-all duration-300 ease-out flex items-center gap-2 cursor-pointer"
              id="btn-home-view-all-rooms"
            >
              View All Rooms <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <div className="w-full max-w-sm border-b border-white/5 my-6" />
          </div>

        </div>
      </section>

      {/* 4. RESORT FACILITIES */}
      <section className="py-28 px-6 sm:px-12 lg:px-20 bg-[#0d0d0d] border-t border-white/5" id="home-facilities-section">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="text-[10px] font-sub font-semibold tracking-[0.18em] text-[#e2d7c5] uppercase block opacity-70">
              EDITORIAL CURATION
            </span>
            <h2 className="text-[32px] sm:text-[42px] font-display font-light text-white tracking-tight">
              On-Site Resort Facilities
            </h2>
          </div>

          {/* Clean minimal list (no box-heavy borders, no box cards) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8" id="facilities-grid">
            {facilities.map((fac) => {
              const IconComp = fac.icon;
              return (
                <div
                  key={fac.name}
                  className="flex flex-col items-center text-center space-y-4 max-w-[220px] mx-auto"
                  id={`facility-item-${fac.name.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <div className="text-[#e2d7c5] flex-shrink-0">
                    <IconComp className="w-7 h-7 stroke-[1.2]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[15px] font-sub font-medium text-white tracking-wide">
                      {fac.name}
                    </h3>
                    <p className="text-xs text-white/60 font-light leading-relaxed">
                      {fac.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. GALLERY */}
      <section className="pt-12 pb-10 md:pt-16 md:pb-28 px-6 sm:px-12 lg:px-20 bg-[#0d0d0d] border-t border-white/5" id="home-gallery-section">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-7 md:mb-16">
            <div className="flex flex-col">
              <span className="text-[10px] font-sub font-light tracking-[0.25em] text-[#e2d7c5]/70 uppercase block mb-3 md:mb-4">
                FINE ARCHITECTURE
              </span>
              <h2 className="text-[32px] sm:text-[46px] font-display font-medium text-white tracking-tight leading-tight">
                Resort Gallery
              </h2>
            </div>
          </div>

          {/* Premium Preview Gallery: Mobile Horizontal Carousel / Desktop 3-Column Grid */}
          <div 
            className="flex md:grid md:grid-cols-3 gap-16 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none scroll-smooth w-full md:mx-0 md:px-0"
            id="gallery-preview-grid"
          >
            {galleryImages.slice(0, 3).map((img, index) => (
              <div
                key={index}
                className="w-full md:w-full flex-shrink-0 md:flex-shrink snap-center md:snap-align-none group relative overflow-hidden bg-zinc-950 rounded-2xl cursor-pointer shadow-xl h-[42vh] max-h-[400px] min-h-[300px] md:h-auto md:max-h-none md:min-h-0 md:aspect-[3/4] transition-all duration-300 hover:scale-[1.02] active:scale-[1.01]"
                onClick={() => setActiveGalleryIndex(index)}
                id={`gallery-slide-${index}`}
              >
                <div className="w-full h-full overflow-hidden">
                  <img
                    src={img.src}
                    alt={`Resort view ${index + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                    style={{ filter: 'saturate(0.85) contrast(1.05) brightness(0.97) sepia(0.04)' }}
                  />
                </div>
                {/* Minimal Elegant Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-[10px] flex items-center gap-1.5 text-[#e2d7c5] font-sub uppercase tracking-[0.18em] bg-[#0d0d0d]/85 px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-sm">
                    View Photo
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Luxury Action Button to go to Full Gallery */}
          <div className="flex justify-center mt-6 md:mt-12">
            <Link
              to="/gallery"
              className="px-10 py-4.5 bg-[#7d6958]/[0.18] border border-[#e2d7c5]/[0.18] hover:border-[#e2d7c5] hover:bg-[#e2d7c5] hover:text-[#0d0d0d] text-[#e2d7c5] text-[11px] font-sub font-semibold tracking-[0.2em] uppercase rounded-full shadow-md transition-all duration-300 ease-out flex items-center gap-2 cursor-pointer"
              id="btn-home-view-gallery"
            >
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 6. GUEST REVIEWS */}
      <section className="py-28 px-6 sm:px-12 lg:px-20 bg-[#0d0d0d] border-t border-white/5" id="home-reviews-section">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="space-y-4">
              <span className="text-[10px] font-sub font-semibold tracking-[0.3em] text-[#e2d7c5] uppercase block opacity-70">
                GUEST VOICES
              </span>
              <h2 className="text-[32px] sm:text-[46px] font-display font-medium text-white tracking-tight leading-tight">
                What Guests Say
              </h2>
            </div>

            <div className="mt-8 md:mt-0 flex items-center gap-4">
              <button 
                onClick={() => scrollLeft(reviewsRef)}
                className="p-4 rounded-full border border-white/10 hover:border-white/40 text-white transition-all hidden md:block cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <button 
                onClick={() => scrollRight(reviewsRef)}
                className="p-4 rounded-full border border-white/10 hover:border-white/40 text-white transition-all hidden md:block cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Minimal Editorial Guest Cards */}
          <div 
            ref={reviewsRef}
            className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-none scroll-smooth touch-pan-x"
            id="reviews-carousel"
          >
            {reviews.map((rev, index) => (
              <div
                key={index}
                className="w-[290px] sm:w-[380px] md:w-[410px] flex-shrink-0 snap-start bg-[#121212] p-8 sm:p-10 rounded-2xl overflow-hidden flex flex-col justify-between border border-white/5"
                id={`review-card-${index}`}
              >
                <div className="space-y-6">
                  {/* Rating star sequence */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-[#e2d7c5] tracking-[0.2em] uppercase font-sub font-semibold opacity-80">
                      STAY REVIEWS
                    </span>
                  </div>

                  <p className="text-base sm:text-lg text-white/90 leading-relaxed font-display font-light italic">
                    "{rev.text}"
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-sub font-semibold text-white tracking-wide">
                      {rev.name}
                    </h4>
                    <span className="text-[10px] font-mono text-white/40 block mt-0.5">
                      Verified Guest Stay • {rev.location}
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#1c1c1c] flex items-center justify-center text-xs text-[#e2d7c5] font-semibold">
                    {rev.name.charAt(0)}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. LOCATION */}
      <section className="py-28 px-6 sm:px-12 lg:px-20 bg-[#0d0d0d] border-t border-white/5" id="home-location-section">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="text-[10px] font-sub font-semibold tracking-[0.18em] text-[#e2d7c5] uppercase block opacity-70">
              KUSHALNAGAR, COORG
            </span>
            <h2 className="text-[32px] sm:text-[42px] font-display font-light text-white tracking-tight">
              Find Us
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch" id="location-panel">
            
            {/* Address & Actions */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-10 bg-[#121212] p-8 sm:p-10 rounded-2xl border border-white/5">
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-display font-light text-white mb-3">
                    Dreamy Vacations
                  </h3>
                  <div className="flex items-start gap-3 text-sm text-white/80 font-sans font-light leading-relaxed">
                    <MapPin className="w-5 h-5 text-[#e2d7c5] flex-shrink-0 mt-0.5" />
                    <span>
                      #51/5, Behind Chikkathur Govt School,<br />
                      Chikkathur Village,<br />
                      Kushalnagar, Kudumangalore,<br />
                      Karnataka 571232
                    </span>
                  </div>
                </div>

                <div className="h-[1px] bg-white/5" />

                <div className="space-y-4">
                  <span className="text-[9px] font-sub font-semibold tracking-widest text-[#e2d7c5] uppercase block">
                    TIMING REGIME
                  </span>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-white/40 block">CHECK-IN</span>
                      <span className="text-white font-semibold text-sm">12:00 PM</span>
                    </div>
                    <div>
                      <span className="text-white/40 block">CHECK-OUT</span>
                      <span className="text-white font-semibold text-sm">11:00 AM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-8 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-[11px] font-sub font-semibold tracking-[0.18em] uppercase rounded-full shadow-md transition-all duration-300 ease-out flex items-center justify-center gap-2 text-center"
                >
                  Get Directions
                </a>
                <a
                  href="tel:+919902960484"
                  className="flex-1 py-3.5 px-8 border border-white/15 hover:bg-white/5 text-white text-[11px] font-sub font-semibold tracking-[0.18em] uppercase rounded-full shadow-md transition-all duration-300 ease-out flex items-center justify-center gap-2 text-center"
                >
                  Call Resort
                </a>
              </div>

            </div>

            {/* Embedded Google Map */}
            <div 
              className="lg:col-span-7 h-[320px] lg:h-auto border border-white/5 bg-zinc-950 relative"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
              }}
              id="home-map-container"
            >
              <iframe
                title="Dreamy Vacations Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.312384724806!2d75.940539!3d12.486260!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDI5JzEwLjUiTiA3NfKwNTYnMjUuOSJF!5e0!3m2!1sen!2sin!4v1625000000000"
                className="w-full h-full border-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>

        </div>
      </section>

      {/* FULLSCREEN LIGHTBOX FOR GALLERY IMAGES */}
      <AnimatePresence>
        {activeGalleryIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/99 z-50 flex flex-col items-center justify-center p-4"
            id="lightbox-container"
          >
            {/* Close touch area */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setActiveGalleryIndex(null)} />

            <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col justify-center z-10 p-2">
              
              {/* Close Button */}
              <button
                onClick={() => setActiveGalleryIndex(null)}
                className="absolute -top-12 right-2 p-2 text-white/80 hover:text-white text-xs font-sub tracking-widest uppercase flex items-center gap-1 cursor-pointer"
                id="btn-lightbox-close"
              >
                Close [X]
              </button>

              <motion.img
                key={activeGalleryIndex}
                src={galleryImages[activeGalleryIndex].src}
                alt={`Resort view ${activeGalleryIndex + 1}`}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl mx-auto"
                initial={{ scale: 0.99 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.25 }}
              />

              <div className="text-center mt-4 text-white/40 text-xs font-mono">
                Image {activeGalleryIndex + 1} of {galleryImages.length}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
