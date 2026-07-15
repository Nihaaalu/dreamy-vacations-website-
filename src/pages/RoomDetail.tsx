import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Users, ShieldAlert, Sparkles, Home as HomeIcon, MapPin, Compass, AlertCircle, MessageSquare, Phone } from 'lucide-react';
import { ROOMS } from '../data';
import DynamicRoomGallery from '../components/DynamicRoomGallery';

interface RoomDetailProps {
  onOpenBooking?: (roomName: string) => void;
}

export default function RoomDetail({ onOpenBooking }: RoomDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the exact room matching the id (robust fallback to handle -room suffix differences)
  const room = ROOMS.find(r => {
    const normalId = r.id.toLowerCase();
    const targetId = id?.toLowerCase() || '';
    return normalId === targetId || 
           normalId.replace('-room', '') === targetId || 
           targetId.replace('-room', '') === normalId;
  });

  if (!room) {
    return (
      <div className="w-full bg-[#0d0d0d] text-white font-sans py-32 flex flex-col items-center justify-center min-h-screen text-center px-6">
        <ShieldAlert className="w-16 h-16 text-[#e2d7c5] mb-4" />
        <h1 className="text-3xl font-display font-light text-white">Room Not Found</h1>
        <p className="text-sm text-white/60 mt-2 max-w-sm font-light">
          The requested room category does not exist. Please browse our active Booking listings.
        </p>
        <Link
          to="/rooms"
          className="mt-6 px-8 py-3.5 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-[11px] font-sub font-semibold tracking-[0.18em] uppercase rounded-full shadow-md transition-all duration-300 ease-out"
        >
          View All Rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0d0d0d] text-white font-sans py-24 min-h-screen" id={`room-detail-${room.id}`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-8">
        
        {/* BREADCRUMB NAVIGATION */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 text-xs font-sub font-semibold tracking-[0.15em] uppercase text-white/70 hover:text-[#e2d7c5] transition-colors"
            id="btn-back-to-rooms"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Rooms
          </Link>
          
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/40 font-mono">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link to="/rooms" className="hover:underline">Rooms</Link>
            <span>/</span>
            <span className="text-[#e2d7c5] font-medium">{room.name}</span>
          </div>
        </div>

        {/* HERO TITLE BLOCK */}
        <div className="mb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-white/5 border border-white/5 text-[#e2d7c5] rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider">
              {room.size} Suite
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/60">
              <Users className="w-3.5 h-3.5 text-white/40" /> Max Occupancy: {room.occupancy}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-white tracking-tight">
            {room.name}
          </h1>
        </div>

        {/* TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Dynamic Image Loader & Detailed Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* DYNAMIC IMAGE LOADER SYSTEM */}
            <div className="bg-[#121212] p-4 rounded-2xl border border-white/5">
              <DynamicRoomGallery 
                roomId={room.id} 
                roomName={room.name} 
                localImages={room.images} 
              />
            </div>

            {/* DESCRIPTION BOX */}
            <div className="bg-[#121212] rounded-2xl p-6 md:p-8 border border-white/5 space-y-4">
              <h3 className="text-xl font-display font-light text-white border-b border-white/5 pb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#e2d7c5]" /> Room Overview
              </h3>
              <p className="text-sm md:text-base text-white/70 leading-relaxed font-light">
                {room.longDescription}
              </p>
            </div>

            {/* DETAILED AMENITIES LISTING */}
            <div className="bg-[#121212] rounded-2xl p-6 md:p-8 border border-white/5 space-y-6">
              <div>
                <h3 className="text-xl font-display font-light text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#e2d7c5]" /> Premium Included Amenities
                </h3>
                <p className="text-xs text-white/50 mt-1 font-light">Everything listed below is thoroughly cleaned and fully prepared prior to your arrival.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-colors">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-sm text-white/80 font-normal">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Reservation Sidebar Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            {/* STICKY RATE CARD */}
            <div className="bg-[#121212] rounded-2xl p-6 md:p-8 border border-white/5 shadow-xl space-y-6">
              
              <div className="border-b border-white/5 pb-5">
                <span className="text-[10px] font-mono text-white/40 uppercase block tracking-wider">Estimated room rate</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl md:text-4xl font-display font-semibold text-white">₹{room.price}</span>
                  <span className="text-sm text-white/50 font-medium">/ night</span>
                </div>
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase font-bold">
                  Free Cancellation Available
                </div>
              </div>

              {/* Specs parameters */}
              <div className="space-y-3 text-xs font-medium text-white/80">
                <div className="spec-item-row flex items-center justify-between h-11 px-3.5 bg-white/5 rounded-xl">
                  <span className="spec-label text-white/40 font-light" style={{ lineHeight: '1.2', margin: 0 }}>Max Occupancy</span>
                  <span className="spec-value text-white font-semibold" style={{ lineHeight: '1.2', margin: 0 }}>{room.occupancy}</span>
                </div>
                <div className="spec-item-row flex items-center justify-between h-11 px-3.5 bg-white/5 rounded-xl">
                  <span className="spec-label text-white/40 font-light" style={{ lineHeight: '1.2', margin: 0 }}>Room Dimension</span>
                  <span className="spec-value text-white font-semibold" style={{ lineHeight: '1.2', margin: 0 }}>{room.size}</span>
                </div>
                <div className="spec-item-row flex items-center justify-between h-11 px-3.5 bg-white/5 rounded-xl">
                  <span className="spec-label text-white/40 font-light" style={{ lineHeight: '1.2', margin: 0 }}>Bathroom Config</span>
                  <span className="spec-value text-white font-semibold" style={{ lineHeight: '1.2', margin: 0 }}>Attached Ensuite</span>
                </div>
              </div>

              {/* Booking CTA Section */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/booking', { state: { roomId: room.id } })}
                  className="w-full h-12 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-[11px] font-sub font-semibold tracking-[0.15em] uppercase rounded-xl transition-all duration-300 ease-out cursor-pointer text-center flex items-center justify-center gap-2"
                  id="btn-detail-reserve-now"
                >
                  Book Now
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`https://wa.me/919902960484?text=Hello%20Dreamy%20Vacations,%20I'd%20like%20to%20reserve%20the%20${encodeURIComponent(room.name)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-12 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white text-[11px] font-sub font-semibold tracking-[0.15em] uppercase rounded-xl transition-all duration-300 ease-out text-center flex items-center justify-center gap-2"
                    id="btn-detail-whatsapp"
                  >
                    <MessageSquare className="w-4 h-4 text-[#25D366]" />
                    WhatsApp
                  </a>
                  <a
                    href="tel:+919902960484"
                    className="w-full h-12 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white text-[11px] font-sub font-semibold tracking-[0.15em] uppercase rounded-xl transition-all duration-300 ease-out text-center flex items-center justify-center gap-2"
                    id="btn-detail-call"
                  >
                    <Phone className="w-4 h-4 text-white" />
                    Call Support
                  </a>
                </div>
              </div>

              <div className="p-3 bg-[#6b5b4b]/5 rounded-xl border border-white/5 flex gap-2">
                <AlertCircle className="w-4 h-4 text-[#e2d7c5] flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-white/60 leading-normal font-light">
                  No payment is captured now. Clicking opens WhatsApp to directly verify dates and secure the room.
                </p>
              </div>

            </div>

            {/* SECURITY/ADVISORY BADGE */}
            <div 
              className="address-card p-5 flex gap-3.5"
              style={{
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.18)'
              }}
            >
              <MapPin className="w-5 h-5 text-[#e2d7c5] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-display font-light text-white">Resort Physical Address</h4>
                <p className="text-[10px] text-white/60 leading-relaxed font-light">
                  Chikkathur Village, Kushalnagar, Coorg, Karnataka. Close proximity to Golden Temple Bylakuppe &amp; Nisargadhama.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
