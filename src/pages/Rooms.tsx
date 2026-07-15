import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, LayoutGrid, Check, ChevronRight, HelpCircle, ArrowRight, Building, Sparkles, Image as ImageIcon, BedDouble } from 'lucide-react';
import { ROOMS } from '../data';

interface RoomsProps {
  onOpenBooking?: (roomName: string) => void;
}

export default function Rooms({ onOpenBooking }: RoomsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [highlightedRoomId, setHighlightedRoomId] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.scrollToRoomId) {
      const targetId = location.state.scrollToRoomId;
      const timer = setTimeout(() => {
        const el = document.getElementById(`room-card-${targetId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightedRoomId(targetId);
          
          const clearTimer = setTimeout(() => {
            setHighlightedRoomId(null);
          }, 1500);
          return () => clearTimeout(clearTimer);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.state]);
  return (
    <div className="w-full bg-[#0d0d0d] text-white font-sans py-24 min-h-screen" id="rooms-list-container">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-8">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-sub font-semibold tracking-[0.18em] text-[#e2d7c5] uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#e2d7c5]" /> Rooms &amp; Rates
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-white tracking-tight">
            Accommodations in Coorg
          </h1>
          <p className="text-sm md:text-base text-white/70 font-light max-w-xl mx-auto leading-relaxed">
            Dreamy Vacations offers clean, comfortable, and well-maintained room options in Kushalnagar. Explore starting rates and select your perfect fit.
          </p>
        </div>

        {/* GROUP BOOKING PROMOTIONAL HERO BOX */}
        <div className="mb-16 bg-[#121212] rounded-2xl p-8 text-[#ffffff] border border-white/5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#e2d7c5] text-[10px] font-mono tracking-widest uppercase">
              <Building className="w-3.5 h-3.5" /> Corporate &amp; Friends Group stay
            </div>
            <h3 className="text-xl md:text-2xl font-display font-light">
              Looking for Corporate or Group Booking?
            </h3>
            <p className="text-xs md:text-sm text-white/60 font-light leading-relaxed">
              We offer exclusive rates, complete meal customization (traditional Coorg cuisine), private bonfire access, and dedicated team-building coordinators for corporate seminars, family reunions, or friend gatherings.
            </p>
          </div>
          <Link
            to="/group-booking"
            className="px-8 py-3.5 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-[11px] font-sub font-semibold tracking-[0.18em] uppercase rounded-full shadow-md transition-all duration-300 ease-out flex items-center gap-2 flex-shrink-0 cursor-pointer"
            id="btn-trigger-group-booking"
          >
            Explore Group Stay <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>

        {/* ROOM LISTINGS (Editorial Split-Cards Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10" id="rooms-feed">
          {ROOMS.map((room, index) => {
            const displayImg = room.images[0];
            
            // Bed configuration mappings for each room
            const getBedConfig = (roomId: string) => {
              switch (roomId) {
                case 'standard-family-room':
                  return '1 Double Bed';
                case 'deluxe-family-room':
                  return '1 Double Bed';
                case 'superior-deluxe-double':
                  return '2 Double Beds';
                case 'triple-room':
                  return '3 Double Beds';
                default:
                  return '1 Double Bed';
              }
            };

            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`h-[550px] w-full flex flex-col bg-[#121212] rounded-[24px] overflow-hidden border transition-all duration-1000 ease-out ${
                  highlightedRoomId === room.id 
                    ? 'border-[#6b5b4b] ring-2 ring-[#6b5b4b]/40 shadow-[0_0_30px_rgba(107,91,75,0.4)]' 
                    : 'border-white/5 shadow-md hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[#6b5b4b]/30'
                }`}
                id={`room-card-${room.id}`}
              >
                
                {/* TOP SECTION (40%): Image block with Badge Overlay */}
                <div className="h-[220px] w-full relative overflow-hidden bg-zinc-950 group flex-shrink-0 flex items-center justify-center">
                  {!displayImg ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-white/40 font-sans">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50 text-[#e2d7c5]" />
                      <span className="text-[10px] uppercase tracking-widest font-mono text-[#e2d7c5]/60">Room image unavailable</span>
                    </div>
                  ) : (
                    <img
                      src={displayImg}
                      alt={room.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          let placeholder = parent.querySelector('.fallback-placeholder');
                          if (!placeholder) {
                            placeholder = document.createElement('div');
                            placeholder.className = 'fallback-placeholder absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-white/40 font-sans';
                            placeholder.innerHTML = `
                              <svg class="w-8 h-8 mb-2 opacity-50 text-[#e2d7c5] stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:32px; height:32px; margin-bottom:8px; opacity:0.5; color:#e2d7c5;">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                              </svg>
                              <span style="font-size:10px; text-transform:uppercase; font-family:var(--font-mono, monospace); letter-spacing:0.1em; color:rgba(226, 215, 197, 0.6)">Room image unavailable</span>
                            `;
                            parent.appendChild(placeholder);
                          }
                        }
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                  
                  {/* Luxury Price Badge Overlay in Top-Right */}
                  <div 
                    className="absolute top-4 right-4 bg-black/65 px-[14px] py-[8px] rounded-full text-center flex flex-col items-center justify-center pointer-events-none"
                    style={{ backdropFilter: 'blur(4px)' }}
                  >
                    <span className="text-sm sm:text-base font-display font-medium text-white leading-tight">₹{room.price}</span>
                    <span className="text-[9px] text-white/50 font-sans tracking-wide leading-none uppercase mt-0.5">Starting from</span>
                  </div>
                </div>

                {/* BOTTOM SECTION (60%): Informative luxury details */}
                <div className="h-[330px] p-6 sm:p-8 flex flex-col justify-between flex-grow">
                  
                  <div className="space-y-4">
                    
                    {/* Room Title */}
                    <h2 className="text-[22px] md:text-[28px] font-display font-light text-white leading-tight">
                      {room.name}
                    </h2>

                    {/* Room Meta Data: Single horizontal row, small luxury sans-serif */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50 font-sans font-light tracking-wide">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#e2d7c5] flex-shrink-0" /> {room.occupancy}
                      </span>
                      <span className="text-white/10 hidden sm:inline">•</span>
                      <span className="flex items-center gap-1.5">
                        <LayoutGrid className="w-3.5 h-3.5 text-[#e2d7c5] flex-shrink-0" /> {room.size}
                      </span>
                      <span className="text-white/10 hidden sm:inline">•</span>
                      <span className="flex items-center gap-1.5">
                        <BedDouble className="w-3.5 h-3.5 text-[#e2d7c5] flex-shrink-0" /> {getBedConfig(room.id)}
                      </span>
                    </div>

                    {/* Description: Maximum 2 lines */}
                    <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-sans font-light line-clamp-2">
                      {room.description}
                    </p>

                    {/* Amenities: Display only 3 premium highlights in a single line (no badges, pills, or cards) */}
                    <div className="text-xs text-white/40 tracking-wider font-sans font-light flex items-center gap-x-2 whitespace-nowrap overflow-hidden text-ellipsis">
                      <span>Swimming Pool</span>
                      <span>•</span>
                      <span>Free Wi-Fi</span>
                      <span>•</span>
                      <span>Indoor Games</span>
                    </div>

                  </div>

                  {/* Buttons Row: Only one Book Now CTA */}
                  <div className="w-full mt-4 flex-shrink-0">
                    <button
                      onClick={() => navigate(`/rooms/${room.id}`)}
                      className="w-full flex items-center justify-center h-12 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-[11px] font-sub font-semibold tracking-[0.18em] uppercase rounded-[14px] shadow-md transition-all duration-300 ease-out cursor-pointer text-center"
                      id={`btn-reserve-instant-${room.id}`}
                    >
                      Book Now
                    </button>
                  </div>

                </div>

              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM HELPFUL FAQ / HOUSE ADVISORY CARD */}
        <div className="mt-20 bg-[#121212] border border-white/5 rounded-2xl overflow-hidden p-8 flex gap-4">
          <HelpCircle className="w-6 h-6 text-[#e2d7c5] flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="text-base font-display font-light text-white">Important General Terms &amp; Conditions</h4>
            <p 
              className="text-white/60 font-sans font-light"
              style={{ fontSize: '15px', lineHeight: '1.7', letterSpacing: '0.01em' }}
            >
              Standard check-in time is 12:00 PM and check-out is 11:30 AM. Government authorized photo ID verification is mandatory for all checking guests at the resort reception desk. Complimentary high-speed fiber internet is accessible across all room categories and outdoor recreation areas. 
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
