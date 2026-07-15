import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Users, Apple, Check, AlertCircle, ArrowLeft, BedDouble, ChevronDown } from 'lucide-react';
import { ROOMS } from '../data';

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get selected room ID from state or URL query
  const initialRoomId = location.state?.roomId || searchParams.get('room') || '';
  const [selectedRoomId, setSelectedRoomId] = useState<string>(initialRoomId);

  // Synchronize state if URL query changes
  useEffect(() => {
    const qRoom = searchParams.get('room');
    if (qRoom) {
      setSelectedRoomId(qRoom);
    }
  }, [searchParams]);

  // Find selected room details
  const selectedRoom = ROOMS.find(r => r.id === selectedRoomId);

  // Get tomorrow's date and the day after for default values
  const getFormattedDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const [booking, setBooking] = useState({
    checkIn: getFormattedDate(1),
    checkOut: getFormattedDate(2),
    adults: 2,
    children: 0,
    foodPreference: 'without-food' as 'with-food' | 'without-food'
  });

  const [validationError, setValidationError] = useState('');

  // Validate dates
  useEffect(() => {
    if (booking.checkIn && booking.checkOut) {
      if (new Date(booking.checkIn) >= new Date(booking.checkOut)) {
        setValidationError('Check-out date must be after the check-in date.');
      } else {
        setValidationError('');
      }
    }
  }, [booking.checkIn, booking.checkOut]);

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (validationError) return;

    const roomName = selectedRoom ? selectedRoom.name : 'General Inquiry / Preferred Room';

    // Structure WhatsApp pre-filled message text
    const textMessage = `Hello Dreamy Vacations,

I would like to reserve a room.

Room Type:
${roomName}

Check-in:
${booking.checkIn}

Check-out:
${booking.checkOut}

Adults:
${booking.adults}

Children:
${booking.children}

Food Preference:
${booking.foodPreference === 'with-food' ? 'With Food (Traditional Coorg style meals)' : 'Without Food'}

Please share availability and final pricing.

Thank you.`;

    // Encode URI parameter and redirect
    const encodedText = encodeURIComponent(textMessage);
    const whatsappUrl = `https://wa.me/919902960484?text=${encodedText}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-[#0d0d0d] text-white font-sans py-24 min-h-screen"
      id="booking-page-root"
    >
      <div className="max-w-xl mx-auto px-6 sm:px-8 pt-8">
        
        {/* Back navigation button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-xs font-sub font-semibold tracking-[0.18em] text-[#e2d7c5] hover:text-white uppercase transition-colors cursor-pointer group"
          id="btn-booking-back"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back
        </button>

        {/* Title Header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-[10px] font-sub font-semibold tracking-[0.18em] text-[#e2d7c5] uppercase block">
            Exclusive Coorg Hideaway
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-light text-white mt-2">
            Secure Your Stay
          </h1>
          <p className="text-sm text-white/60 mt-2 font-light">
            Fill in your preferred dates. We will instantly verify availability and lock in seasonal pricing.
          </p>
        </div>

        {/* Selected Room Card or Dropdown (Located strictly above guest details) */}
        <div className="mb-8" id="selected-room-section">
          {selectedRoom ? (
            <div className="bg-[#121212] border border-[#6b5b4b]/30 rounded-2xl p-5 relative overflow-hidden shadow-premium">
              {/* Premium Card accent */}
              <div className="absolute top-0 inset-x-0 h-[3px] bg-[#6b5b4b]" />
              
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[9px] uppercase font-sub tracking-[0.18em] text-[#e2d7c5] font-semibold block mb-1">
                    Booking For
                  </span>
                  <h3 className="text-lg sm:text-xl font-display font-light text-white leading-tight">
                    {selectedRoom.name}
                  </h3>
                  <div className="flex items-center gap-4 mt-2.5 text-xs text-white/50 font-sans font-light">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#e2d7c5]" /> {selectedRoom.occupancy}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-[#e2d7c5]" /> {selectedRoom.size}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRoomId('');
                    setSearchParams({});
                  }}
                  className="text-[10px] font-sub font-semibold tracking-[0.1em] text-white/40 hover:text-[#e2d7c5] uppercase transition-colors self-start py-1 px-3 border border-white/5 hover:border-white/20 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer"
                  id="btn-change-room"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5 text-[#e2d7c5]" /> Select Your Preferred Room
              </label>
              <div className="relative">
                <select
                  value={selectedRoomId}
                  onChange={e => setSelectedRoomId(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-[#121212] text-white text-sm shadow-sm font-light cursor-pointer appearance-none focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#6b5b4b] focus:outline-none transition-all"
                  id="room-select-dropdown"
                >
                  <option value="">General Inquiry / Preferred Room</option>
                  {ROOMS.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} (from ₹{r.price.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/50">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOOKING DETAILS FORM */}
        <form onSubmit={handleReserve} className="bg-[#121212] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-base font-display font-light text-white tracking-wider border-b border-white/5 pb-3">
            Guest &amp; Stay Information
          </h2>

          {/* Check-In & Check-Out Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#e2d7c5]" /> Check-In
              </label>
              <input
                type="date"
                value={booking.checkIn}
                onChange={e => setBooking(prev => ({ ...prev, checkIn: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#6b5b4b] focus:outline-none text-white text-sm shadow-sm font-light"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#e2d7c5]" /> Check-Out
              </label>
              <input
                type="date"
                value={booking.checkOut}
                onChange={e => setBooking(prev => ({ ...prev, checkOut: e.target.value }))}
                min={booking.checkIn || new Date().toISOString().split('T')[0]}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#6b5b4b] focus:outline-none text-white text-sm shadow-sm font-light"
              />
            </div>
          </div>

          {validationError && (
            <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> {validationError}
            </p>
          )}

          {/* Occupants: Adults & Children */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#e2d7c5]" /> Adults
              </label>
              <select
                value={booking.adults}
                onChange={e => setBooking(prev => ({ ...prev, adults: parseInt(e.target.value) }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#121212] focus:ring-2 focus:ring-[#6b5b4b] focus:outline-none text-white text-sm shadow-sm font-light cursor-pointer"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i + 1 === 1 ? 'Adult' : 'Adults'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#e2d7c5]" /> Children
              </label>
              <select
                value={booking.children}
                onChange={e => setBooking(prev => ({ ...prev, children: parseInt(e.target.value) }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#121212] focus:ring-2 focus:ring-[#6b5b4b] focus:outline-none text-white text-sm shadow-sm font-light cursor-pointer"
              >
                {[...Array(6)].map((_, i) => (
                  <option key={i} value={i}>
                    {i} {i === 1 ? 'Child' : 'Children'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Food Options */}
          <div>
            <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <Apple className="w-3.5 h-3.5 text-[#e2d7c5]" /> Food Option
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Without Food */}
              <button
                type="button"
                onClick={() => setBooking(prev => ({ ...prev, foodPreference: 'without-food' }))}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left cursor-pointer ${
                  booking.foodPreference === 'without-food'
                    ? 'border-[#6b5b4b] bg-white/10 text-white ring-2 ring-[#6b5b4b]/30 font-medium'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/70 text-sm'
                }`}
                id="btn-page-food-without"
              >
                <span>Without Food</span>
                {booking.foodPreference === 'without-food' && (
                  <Check className="w-4 h-4 text-[#e2d7c5]" />
                )}
              </button>

              {/* With Food */}
              <button
                type="button"
                onClick={() => setBooking(prev => ({ ...prev, foodPreference: 'with-food' }))}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left cursor-pointer ${
                  booking.foodPreference === 'with-food'
                    ? 'border-[#6b5b4b] bg-white/10 text-white ring-2 ring-[#6b5b4b]/30 font-medium'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/70 text-sm'
                }`}
                id="btn-page-food-with"
              >
                <span>With Food</span>
                {booking.foodPreference === 'with-food' && (
                  <Check className="w-4 h-4 text-[#e2d7c5]" />
                )}
              </button>
            </div>
          </div>

          {/* Note */}
          <div className="p-4 bg-[#6b5b4b]/5 rounded-xl border border-white/5 flex gap-2.5 mt-2">
            <AlertCircle className="w-5 h-5 text-[#e2d7c5] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/60 leading-relaxed font-light">
              <span className="font-medium text-[#e2d7c5]">Please Note:</span> Final pricing may vary depending on selected food options, season rates, and special festival holidays. We will share exact availability immediately.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!!validationError}
              className={`w-full py-3.5 px-8 text-white font-sub font-semibold text-[11px] tracking-[0.18em] uppercase rounded-full shadow-md transition-all duration-300 ease-out flex items-center justify-center gap-2 cursor-pointer ${
                validationError 
                  ? 'bg-zinc-800 text-white/40 cursor-not-allowed shadow-none' 
                  : 'bg-[#6b5b4b] hover:bg-[#85725f]'
              }`}
              id="btn-booking-page-submit"
            >
              Reserve Now via WhatsApp
            </button>
            <p className="text-[9px] text-center text-white/40 mt-2.5 tracking-wide font-light">
              Connects instantly with Dreamy Vacations representative
            </p>
          </div>

        </form>

      </div>
    </motion.div>
  );
}
