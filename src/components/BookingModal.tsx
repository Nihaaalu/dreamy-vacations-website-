import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Users, Apple, Check, AlertCircle } from 'lucide-react';
import { BookingDetails } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
}

export default function BookingModal({ isOpen, onClose, roomName }: BookingModalProps) {
  // Get tomorrow's date and the day after for default values
  const getFormattedDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const [booking, setBooking] = useState<BookingDetails>({
    checkIn: getFormattedDate(1),
    checkOut: getFormattedDate(2),
    adults: 2,
    children: 0,
    foodPreference: 'without-food'
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

  if (!isOpen) return null;

  const handleReserve = () => {
    if (validationError) return;

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

    // Encode URI parameter
    const encodedText = encodeURIComponent(textMessage);
    const whatsappUrl = `https://wa.me/919902960484?text=${encodedText}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id="booking-modal-overlay">
        
        {/* Backdrop glass blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-[#121212] rounded-2xl p-6 md:p-8 shadow-2xl border border-white/5 overflow-hidden font-sans z-10 text-white"
          id="booking-modal-box"
        >
          {/* Subtle wood design accent line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-[#6b5b4b]" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-white/60 hover:text-white transition-colors"
            id="btn-booking-modal-close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6 pr-6">
            <span className="text-[10px] font-sub font-semibold tracking-[0.18em] text-[#e2d7c5] uppercase block">Instant Booking Request</span>
            <h3 className="text-xl md:text-2xl font-display font-light text-white mt-1">
              Reserve Room
            </h3>
            <p className="text-sm text-white/60 mt-1 truncate max-w-sm font-light">
              Selected: <span className="text-[#e2d7c5] font-normal">{roomName}</span>
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            
            {/* Check-In & Check-Out Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#e2d7c5]" /> Check-In
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
                  <Calendar className="w-3 h-3 text-[#e2d7c5]" /> Check-Out
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
                  <Users className="w-3 h-3 text-[#e2d7c5]" /> Adults
                </label>
                <select
                  value={booking.adults}
                  onChange={e => setBooking(prev => ({ ...prev, adults: parseInt(e.target.value) }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#121212] focus:ring-2 focus:ring-[#6b5b4b] focus:outline-none text-white text-sm shadow-sm font-light cursor-pointer"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} {i + 1 === 1 ? 'Adult' : 'Adults'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-[#e2d7c5]" /> Children
                </label>
                <select
                  value={booking.children}
                  onChange={e => setBooking(prev => ({ ...prev, children: parseInt(e.target.value) }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#121212] focus:ring-2 focus:ring-[#6b5b4b] focus:outline-none text-white text-sm shadow-sm font-light cursor-pointer"
                >
                  {[...Array(6)].map((_, i) => (
                    <option key={i} value={i}>{i} {i === 1 ? 'Child' : 'Children'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Food Options */}
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                <Apple className="w-3 h-3 text-[#e2d7c5]" /> Food Option
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
                  id="btn-food-without"
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
                  id="btn-food-with"
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

          </div>

          {/* Footer CTA */}
          <div className="mt-6">
            <button
              onClick={handleReserve}
              disabled={!!validationError}
              className={`w-full py-3.5 px-8 text-white font-sub font-semibold text-[11px] tracking-[0.18em] uppercase rounded-full shadow-md transition-all duration-300 ease-out flex items-center justify-center gap-2 cursor-pointer ${
                validationError 
                  ? 'bg-zinc-800 text-white/40 cursor-not-allowed shadow-none' 
                  : 'bg-[#6b5b4b] hover:bg-[#85725f]'
              }`}
              id="btn-reserve-modal-submit"
            >
              Reserve Now via WhatsApp
            </button>
            <p className="text-[9px] text-center text-white/40 mt-2.5 tracking-wide font-light">
              Connects instantly with Dreamy Vacations representative
            </p>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
