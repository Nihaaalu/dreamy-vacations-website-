import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  HelpCircle,
  MapPin,
  CheckCircle2,
  Compass,
  Navigation,
  MessageSquare,
} from 'lucide-react';
import { ACCOMMODATION_CATEGORIES, handleRoomImageError } from '../data';

const WHATSAPP_ENQUIRE_URL =
  'https://wa.me/919902960484?text=Hello%20Dreamy%20Vacations%2C%20I%20would%20like%20to%20enquire%20about%20room%20availability.';
const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9';

const VERIFIED_FACILITIES = [
  'Filtered outdoor swimming pool with safe family access',
  'Musical rain dance arena for families and groups',
  'Indoor games hall (carrom, chess, table tennis)',
  'Evening campfire setups in our courtyard (where available)',
  'Complimentary high-speed fiber Wi-Fi across rooms & common zones',
  'Spacious gated on-site parking for cars, tempo travellers & coaches',
];

const KUSHALNAGAR_DISTANCES = [
  { place: 'Kaveri Nisargadhama', distance: '~4 km · 8 mins' },
  { place: 'Namdroling Monastery (Golden Temple), Bylakuppe', distance: '~6 km · 12 mins' },
  { place: 'Harangi Dam & Tree Park', distance: '~9 km · 15 mins' },
  { place: 'Dubare Elephant Camp', distance: '~14 km · 20 mins' },
  { place: 'Chiklihole Reservoir', distance: '~16 km · 22 mins' },
  { place: 'Madikeri (Abbey Falls, Fort & Raja’s Seat)', distance: '~30 km · 45–55 mins' },
];

const PLANNING_GUIDES = [
  { label: '25 Best Places to Visit in Coorg', to: '/blog/places-to-visit-in-coorg' },
  { label: 'Coorg Trip Plan for 2 Days', to: '/blog/coorg-trip-plan-2-days' },
  { label: 'Best Time to Visit Coorg', to: '/blog/best-time-to-visit-coorg' },
  { label: 'Where to Stay in Coorg', to: '/blog/where-to-stay-in-coorg' },
  { label: 'Kushalnagar Tourist Places', to: '/blog/kushalnagar-tourist-places' },
  { label: 'Bylakuppe Tibetan Settlement Guide', to: '/blog/bylakuppe-tibetan-settlement-guide' },
];

interface RoomsProps {
  onOpenBooking?: (roomName: string) => void;
}

export default function Rooms({}: RoomsProps) {
  return (
    <div
      className="w-full bg-[#0d0d0d] text-white font-sans py-24 min-h-screen"
      id="rooms-list-container"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-8">
        {/* HEADER SECTION */}
        <header className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <span className="text-xs font-sub font-semibold tracking-[0.22em] text-[#e2d7c5] uppercase inline-flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#e2d7c5]" /> Accommodations · Kushalnagar, Coorg
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-white tracking-tight">
            Accommodations in Coorg
          </h1>
          <p className="text-sm md:text-base text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
            Dreamy Vacations is a quiet family and group accommodation property in Chikkathur Village near Kushalnagar. Select your stay category below to view room photographs, capacities, facilities, and direct availability enquiries.
          </p>
        </header>

        {/* THREE CONCISE CATEGORY CARDS */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-9"
          id="rooms-feed"
        >
          {ACCOMMODATION_CATEGORIES.map((card, index) => (
            <motion.article
              key={card.id}
              id={`room-category-card-${card.id}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="flex flex-col bg-[#121212] rounded-[24px] overflow-hidden border border-white/10 shadow-lg hover:shadow-[0_14px_34px_rgba(0,0,0,0.45)] hover:border-[#6b5b4b]/50 transition-all duration-300"
            >
              {/* COVER PHOTOGRAPH */}
              <Link
                to={card.route}
                className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950 group block flex-shrink-0"
                aria-label={`Explore ${card.title}`}
              >
                <img
                  src={card.coverImage}
                  alt={card.coverAlt}
                  width={480}
                  height={360}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={handleRoomImageError}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
              </Link>

              {/* CARD BODY: Title, short intro, EXPLORE ROOMS button */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow gap-6">
                <div className="space-y-3">
                  <h2 className="text-2xl font-display font-light text-white tracking-tight leading-snug">
                    <Link
                      to={card.route}
                      className="hover:text-[#e2d7c5] transition-colors"
                    >
                      {card.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-white/65 font-sans font-light leading-relaxed">
                    {card.roomsPageIntro}
                  </p>
                </div>

                <Link
                  to={card.route}
                  className="w-full inline-flex items-center justify-center gap-2 h-12 px-6 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-[11px] font-sub font-semibold tracking-[0.18em] uppercase rounded-[14px] shadow-md transition-all duration-300 ease-out whitespace-nowrap cursor-pointer"
                  id={`btn-explore-category-${card.id}`}
                >
                  EXPLORE ROOMS <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* WHY CHOOSE A STAY NEAR KUSHALNAGAR, COORG? */}
        <section
          className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8"
          aria-labelledby="why-kushalnagar-heading"
        >
          <div className="lg:col-span-7 bg-[#121212] border border-white/10 rounded-[24px] p-7 sm:p-9 space-y-5">
            <span className="text-[11px] font-sub font-semibold tracking-[0.2em] text-[#e2d7c5] uppercase inline-flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#e2d7c5]" /> Chikkathur Village · Eastern Coorg
            </span>
            <h2
              id="why-kushalnagar-heading"
              className="text-2xl sm:text-3xl font-display font-light text-white tracking-tight"
            >
              Why Choose a Stay Near Kushalnagar, Coorg?
            </h2>
            <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed">
              Explore the cultural and natural side of eastern Coorg from Kushalnagar, then continue towards Madikeri’s waterfalls, hills, and viewpoints without changing hotels mid-trip. Because Kushalnagar sits right where the Mysuru–Bengaluru highway (NH 275) enters Kodagu on level plateau roads, families with children, senior citizens, and road-trip groups arrive comfortably without steep late-evening hill climbs.
            </p>
            <p className="text-sm text-white/65 font-light leading-relaxed">
              Our property in Chikkathur Village (#51/5, Behind Chikkathur Govt School, Kudumangalore, Karnataka 571232) keeps you away from busy main-street noise while placing Bylakuppe’s Tibetan monasteries, Cauvery river islands, and wildlife camps minutes away.
            </p>

            <div className="pt-2 space-y-2.5">
              <h3 className="text-xs font-sub font-semibold tracking-[0.16em] uppercase text-[#e2d7c5]">
                Verified On-Site Facilities
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-white/75 font-light">
                {VERIFIED_FACILITIES.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#e2d7c5] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 flex flex-wrap gap-3">
              <a
                href={WHATSAPP_ENQUIRE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-[11px] font-sub font-semibold tracking-[0.16em] uppercase rounded-xl transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Enquire on WhatsApp
              </a>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/85 text-[11px] font-sub font-semibold tracking-[0.16em] uppercase rounded-xl transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#e2d7c5]" /> Google Maps Directions
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#121212] border border-white/10 rounded-[24px] p-7 sm:p-9 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] font-sub font-semibold tracking-[0.2em] text-[#e2d7c5] uppercase inline-flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#e2d7c5]" /> Approximate Drives From Our Property
              </span>
              <h3 className="text-xl font-display font-light text-white">
                Nearby Coorg Landmarks
              </h3>
              <ul className="divide-y divide-white/5 text-xs sm:text-sm">
                {KUSHALNAGAR_DISTANCES.map((row) => (
                  <li key={row.place} className="py-2.5 flex items-center justify-between gap-4">
                    <span className="text-white/75 font-light">{row.place}</span>
                    <span className="text-[#e2d7c5] font-mono text-xs shrink-0">{row.distance}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <h3 className="text-xs font-sub font-semibold tracking-[0.16em] uppercase text-[#e2d7c5]">
                Plan Your Coorg Itinerary
              </h3>
              <div className="flex flex-wrap gap-2">
                {PLANNING_GUIDES.map((guide) => (
                  <Link
                    key={guide.to}
                    to={guide.to}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-white/80 hover:text-[#e2d7c5] transition-colors"
                  >
                    <span>{guide.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM HOUSE ADVISORY CARD */}
        <div className="mt-10 bg-[#121212] border border-white/5 rounded-2xl overflow-hidden p-8 flex gap-4">
          <HelpCircle className="w-6 h-6 text-[#e2d7c5] flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-base font-display font-light text-white">
              Important General Terms &amp; Check-In Details
            </h3>
            <p
              className="text-white/60 font-sans font-light"
              style={{ fontSize: '15px', lineHeight: '1.7', letterSpacing: '0.01em' }}
            >
              Standard check-in time is 12:00 PM and check-out is 11:00 AM. Government-authorized photo ID verification is mandatory for all adult guests at reception. Direct stay enquiries can be made via WhatsApp or phone at +91 99029 60484 to confirm current room availability and group meal preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

