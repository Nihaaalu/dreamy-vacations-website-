import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Building, Flame, UtensilsCrossed, Music, ArrowRight, Apple, Check } from 'lucide-react';

export default function GroupBooking() {
  const [totalGuests, setTotalGuests] = useState<number>(15);
  const [adults, setAdults] = useState<number>(12);
  const [children, setChildren] = useState<number>(3);
  const [groupType, setGroupType] = useState<'Family' | 'Friends' | 'Corporate'>('Corporate');
  const [foodPreference, setFoodPreference] = useState<'with-food' | 'without-food'>('with-food');
  const [vegGuests, setVegGuests] = useState<string>('');
  const [separateCouples, setSeparateCouples] = useState<boolean>(false);
  const [couplesCount, setCouplesCount] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const message = `Hello Dreamy Vacations,

I am interested in a group booking.

Group Type:
${groupType}

Total Guests:
${totalGuests} (Adults: ${adults}, Children: ${children})

Meal Preference:
${foodPreference === 'with-food' ? 'With food' : 'Without food'}${foodPreference === 'with-food' && vegGuests ? `\nVegetarian Guests: ${vegGuests}` : ''}

Separate Rooms for Couples:
${separateCouples ? `Yes (${couplesCount || 'N/A'} couples)` : 'No'}

Please share availability and pricing.`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919902960484?text=${encodedText}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsSubmitting(false);
  };

  // Group stay advantages
  const benefits = [
    {
      icon: UtensilsCrossed,
      title: 'Premium Dining Experience',
      desc: 'Enjoy freshly prepared vegetarian and non-vegetarian cuisine with dedicated cooking arrangements for vegetarian guests, ensuring comfort, hygiene, and a delightful dining experience for every group.'
    },
    {
      icon: Flame,
      title: 'Bonfire & Rain Dance',
      desc: 'Private bonfire evenings, rain dance sessions, and open spaces designed for celebrations, reunions, and memorable group experiences.'
    },
    {
      icon: Music,
      title: 'Event Facilitation',
      desc: 'Flexible indoor and outdoor spaces suitable for family gatherings, celebrations, team activities, and special occasions.'
    }
  ];

  const globRoomImages = (import.meta as any).glob('../../images/rooms/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', { eager: true });
  const globGalleryImages = (import.meta as any).glob('../../images/gallery/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', { eager: true });

  const scannedRoomUrls = Object.keys(globRoomImages).map(key => {
    const mod = globRoomImages[key] as any;
    return mod.default || mod;
  });
  const scannedGalleryUrls = Object.keys(globGalleryImages).map(key => {
    const mod = globGalleryImages[key] as any;
    return mod.default || mod;
  });

  const allRealImages = [...scannedRoomUrls, ...scannedGalleryUrls];
  
  // Choose 3 distinct real images dynamically
  const groupImages = allRealImages.length >= 3 
    ? allRealImages.slice(0, 3) 
    : [
        '/images/rooms/sd2/sd2.jpeg',
        '/images/rooms/sf1/sf1.jpeg',
        '/images/rooms/df1/df1.jpeg'
      ];

  const isValidationMismatch = totalGuests !== (adults + children);

  return (
    <div className="w-full bg-[#0d0d0d] text-white font-sans py-24 min-h-screen" id="group-booking-container">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-8">
        
        {/* HERO TITLE SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-sub font-semibold tracking-[0.18em] text-[#e2d7c5] uppercase flex items-center justify-center gap-1.5">
            <Users className="w-4 h-4 text-[#e2d7c5]" /> Customized Group Escapes
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-white tracking-tight">
            Corporate &amp; Group Booking
          </h1>
          <p className="text-sm md:text-base text-white/70 font-light max-w-xl mx-auto leading-relaxed">
            Planning a corporate retreat, family reunion, or friends get-together in Coorg? Secure complete resort blocks, dormitory units, customizable catering, and private facilities.
          </p>
        </div>

        {/* TWO COLUMN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Benefits and Collage */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* COLLAGE GALLERY */}
            <div className="grid grid-cols-3 gap-3">
              {groupImages.map((img, idx) => (
                <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-zinc-900 shadow-premium">
                  <img src={img} alt="Group stay" referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-500 hover:scale-101" />
                </div>
              ))}
            </div>

            {/* BENEFITS BULLETS */}
            <div className="space-y-6">
              <h3 className="text-2xl font-display font-light text-white">Why Group Stays are Exceptional Here</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={idx} className="bg-[#121212] border border-white/5 p-5 rounded-2xl space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-[#6b5b4b] text-[#e2d7c5] flex items-center justify-center shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-display font-light text-white text-base leading-snug">{benefit.title}</h4>
                      <p className="text-xs text-white/60 font-light leading-relaxed">{benefit.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT: High-Converting Group Inquiry Form Card */}
          <div className="lg:col-span-5 bg-[#121212] rounded-2xl p-6 md:p-8 border border-white/5 shadow-xl space-y-6">
            
            <div className="border-b border-white/5 pb-5">
              <h3 className="text-xl md:text-2xl font-display font-light text-white">Group Inquiry</h3>
              <p className="text-xs text-white/50 font-light mt-1">Complete your estimates below. Clicking submits to our WhatsApp desk.</p>
            </div>

            <form onSubmit={handleReserve} className="space-y-6">
              
              {/* Total Guests Count Input */}
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#e2d7c5]" /> Total Guests
                </label>
                <input
                  type="number"
                  min="1"
                  value={totalGuests}
                  onChange={e => {
                    const val = parseInt(e.target.value) || 0;
                    setTotalGuests(val);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#6b5b4b] focus:outline-none text-white text-sm shadow-sm font-medium"
                />
                {isValidationMismatch && (
                  <p className="text-xs text-amber-500/90 font-light mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                    Total guests should match Adults + Children.
                  </p>
                )}
              </div>

              {/* Adults & Children Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-2">
                    Adults
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={adults}
                    onChange={e => {
                      const val = parseInt(e.target.value) || 0;
                      setAdults(val);
                      setTotalGuests(val + children);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#6b5b4b] focus:outline-none text-white text-sm shadow-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-2">
                    Children
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={children}
                    onChange={e => {
                      const val = parseInt(e.target.value) || 0;
                      setChildren(val);
                      setTotalGuests(adults + val);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#6b5b4b] focus:outline-none text-white text-sm shadow-sm font-medium"
                  />
                  <span className="text-[10px] text-white/40 block mt-1.5">Children below 12 years</span>
                </div>
              </div>

              {/* Group Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#e2d7c5]" /> Group Stay Category
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['Family', 'Friends', 'Corporate'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setGroupType(type)}
                      className={`py-2.5 px-1 text-center rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        groupType === type
                          ? 'border-[#6b5b4b] bg-white/10 text-white ring-2 ring-[#6b5b4b]/30 font-semibold'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/70'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Catering preference */}
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <Apple className="w-3.5 h-3.5 text-[#e2d7c5]" /> Meal Preference
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFoodPreference('without-food')}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left cursor-pointer ${
                      foodPreference === 'without-food'
                        ? 'border-[#6b5b4b] bg-white/10 text-white ring-2 ring-[#6b5b4b]/30 font-medium'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/70 text-xs'
                    }`}
                  >
                    <span>Without Food</span>
                    {foodPreference === 'without-food' && <Check className="w-4 h-4 text-[#e2d7c5]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFoodPreference('with-food')}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left cursor-pointer ${
                      foodPreference === 'with-food'
                        ? 'border-[#6b5b4b] bg-white/10 text-white ring-2 ring-[#6b5b4b]/30 font-medium'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/70 text-xs'
                    }`}
                  >
                    <span>With Food</span>
                    {foodPreference === 'with-food' && <Check className="w-4 h-4 text-[#e2d7c5]" />}
                  </button>
                </div>
              </div>

              {/* Vegetarian Guests (Optional) - only visible when With Food is active */}
              <AnimatePresence initial={false}>
                {foodPreference === 'with-food' && (
                  <motion.div
                    key="veg-guests-section"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-2">
                      Vegetarian Guests (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 5"
                      value={vegGuests}
                      onChange={e => setVegGuests(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#6b5b4b] focus:outline-none text-white text-sm shadow-sm font-medium"
                    />
                    <span className="text-[10px] text-white/40 block mt-1.5">Leave blank if not applicable.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Separate Rooms for Couples */}
              <div className="border-t border-white/5 pt-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-widest">
                    Separate Rooms for Couples
                  </label>
                  <div className="flex bg-white/5 border border-white/10 rounded-xl p-0.5">
                    <button
                      type="button"
                      onClick={() => setSeparateCouples(false)}
                      className={`px-3 py-1 rounded-lg text-[10px] uppercase font-sub font-semibold tracking-wider transition-all ${
                        !separateCouples
                          ? 'bg-[#6b5b4b] text-white shadow-sm'
                          : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      OFF
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeparateCouples(true)}
                      className={`px-3 py-1 rounded-lg text-[10px] uppercase font-sub font-semibold tracking-wider transition-all ${
                        separateCouples
                          ? 'bg-[#6b5b4b] text-white shadow-sm'
                          : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      ON
                    </button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {separateCouples && (
                    <motion.div
                      key="couples-count-section"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden mt-4"
                    >
                      <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-2">
                        Approximate Number of Couples
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 4"
                        value={couplesCount}
                        onChange={e => setCouplesCount(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:bg-[#1a1a1a] focus:ring-2 focus:ring-[#6b5b4b] focus:outline-none text-white text-sm shadow-sm font-medium"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-8 bg-[#6b5b4b] hover:bg-[#85725f] text-white font-sub font-semibold text-[11px] tracking-[0.18em] uppercase rounded-full shadow-md transition-all duration-300 ease-out cursor-pointer flex items-center justify-center gap-2"
                id="btn-group-reserve-submit"
              >
                INQUIRE VIA WHATSAPP <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <p className="text-[9px] text-center text-white/40 font-light mt-2 tracking-wide leading-none">
                Establishes a direct, priority line with our resort general manager
              </p>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
