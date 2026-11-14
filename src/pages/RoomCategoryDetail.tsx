import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Users,
  BedDouble,
  Sparkles,
  Compass,
  MapPin,
  MessageSquare,
  Phone,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
  Info,
  Building2,
} from 'lucide-react';
import {
  ROOMS,
  resolveRoomPhoto,
  resolveGalleryPhoto,
  handleRoomImageError,
} from '../data';

const WHATSAPP_ENQUIRE_URL =
  'https://wa.me/919902960484?text=Hello%20Dreamy%20Vacations%2C%20I%20would%20like%20to%20enquire%20about%20room%20availability.';

const df1Img = resolveRoomPhoto;
const galleryImg = resolveGalleryPhoto;

export type CategorySlug = 'couples' | 'families' | 'group-booking';

interface GalleryPhotoItem {
  src: string;
  alt: string;
  caption: string;
  orientation: 'portrait' | 'landscape';
}

interface LinkedRoomOption {
  roomId: string;
  bedConfig: string;
  note: string;
}

interface CategoryConfig {
  slug: CategorySlug;
  eyebrow: string;
  title: string;
  subtitle: string;
  metaSummary: string[];
  overviewParagraphs: string[];
  specs: { label: string; value: string }[];
  facilities: string[];
  photos: GalleryPhotoItem[];
  linkedRooms: LinkedRoomOption[];
  linkedRoomsHeading: string;
  enquiryHeading: string;
  enquiryNotes: string[];
  enquiryActionPath: string;
  enquiryActionLabel: string;
}

const CATEGORY_DATA: Record<CategorySlug, CategoryConfig> = {
  couples: {
    slug: 'couples',
    eyebrow: 'TWO-GUEST RETREAT · KUSHALNAGAR, COORG',
    title: 'Rooms for Couples',
    subtitle:
      'Quiet private cottages designed for two guests seeking calm village mornings, warm wooden interiors, and unhurried resort leisure.',
    metaSummary: ['2 Adults', '1 Double Bed', 'Attached Ensuite', 'Private Cottage Access'],
    overviewParagraphs: [
      'Our couple-friendly cottages in Chikkathur Village offer a peaceful retreat tucked away from highway noise while remaining minutes from Bylakuppe Golden Temple, Nisargadhama, and Dubare.',
      'Step inside to find cozy double bedding dressed in crisp linens, custom wooden false ceilings with soft warm tray lighting, practical wardrobe & desk cabinetry, tea and coffee setup, and direct doorway access to our landscaped resort courtyard and swimming pool.',
    ],
    specs: [
      { label: 'Guest Capacity', value: '2 Adults' },
      { label: 'Bed Configuration', value: '1 Double Bed' },
      { label: 'Floor Area', value: '380 – 420 sq.ft.' },
      { label: 'Bathroom Config', value: 'Attached Ensuite' },
    ],
    facilities: [
      'King-size comfortable double bed with fresh linens',
      'Private cottage entrance & garden sit-out proximity',
      'Attached modern bathroom with 24/7 hot water geyser',
      'Wooden false ceiling & ambient evening lighting',
      'Complimentary high-speed fiber Wi-Fi',
      'Flat-screen LED TV',
      'Tea & coffee kettle setup with complimentary water',
      'Filtered outdoor swimming pool access',
      'Rain dance arena & indoor tabletop games',
      'Daily housekeeping & secure on-site parking',
    ],
    photos: [
      {
        src: df1Img('df1.jpeg'),
        alt: 'Double bedroom for couples with wood-panel false ceiling, desk, mirror, and wardrobe',
        caption: 'Double Bedroom Interior',
        orientation: 'portrait',
      },
      {
        src: df1Img('604426481.jpg'),
        alt: 'Cottage interior with open doorway overlooking green courtyard at Dreamy Vacations',
        caption: 'Private Courtyard Doorway',
        orientation: 'portrait',
      },
      {
        src: df1Img('604426551.jpg'),
        alt: 'Bedroom view showing window drapes, wooden TV console, and double bed',
        caption: 'Window & TV Lounge Angle',
        orientation: 'portrait',
      },
      {
        src: df1Img('604426750.jpg'),
        alt: 'Double bedroom interior with ambient ceiling glow lighting and wooden cabinetry',
        caption: 'Evening Room Ambiance',
        orientation: 'portrait',
      },
      {
        src: galleryImg('unnamed (1).webp'),
        alt: 'Outdoor cottage porch sit-out with two wooden chairs framed by bougainvillea',
        caption: 'Private Porch Sit-Out',
        orientation: 'landscape',
      },
      {
        src: galleryImg('WhatsApp Image 2026-07-14 at 9.44.27 AM (2).jpeg'),
        alt: 'Private black-brick resort cottage nestled beside garden palms in Kushalnagar',
        caption: 'Private Cottage Exterior',
        orientation: 'landscape',
      },
      {
        src: galleryImg('unnamed (4).webp'),
        alt: 'Illuminated outdoor resort swimming pool surrounded by palms at dusk',
        caption: 'Evening Swimming Pool',
        orientation: 'portrait',
      },
    ],
    linkedRoomsHeading: 'Available Couple Room Configurations',
    linkedRooms: [
      {
        roomId: 'deluxe-family-room',
        bedConfig: '1 Double Bed',
        note: 'Spacious wooden cabinetry, tray glow ceiling & pool/garden access',
      },
      {
        roomId: 'standard-family-room',
        bedConfig: '1 Double Bed',
        note: 'Quiet corner room with functional seating & cozy double bedding',
      },
    ],
    enquiryHeading: 'Couple Stay Availability',
    enquiryNotes: [
      'No advance portal fees are captured online. Send a quick message on WhatsApp to confirm open dates for your stay.',
      'Government-issued photo ID is required for both guests during check-in at reception (12:00 PM check-in · 11:30 AM check-out).',
    ],
    enquiryActionPath: '/booking',
    enquiryActionLabel: 'Stay Enquiry Form',
  },
  families: {
    slug: 'families',
    eyebrow: 'FAMILY HOLIDAYS · KUSHALNAGAR, COORG',
    title: 'Rooms for Families',
    subtitle:
      'Spacious multi-bed suites and ground-level cottages tailored for parents, children, and multi-generational Coorg vacations.',
    metaSummary: ['2 to 6 Guests', '1, 2 or 3 Double Beds', 'Indoor & Outdoor Recreation'],
    overviewParagraphs: [
      'Dreamy Vacations is built around safe, spacious family comfort. With flat roadways leading all the way into Kushalnagar and zero steep mountain hairpin bends, families arrive relaxed with grandparents and young children alike.',
      'Choose single double-bed rooms for smaller families or spacious two-bed and three-bed suites outfitted with living room sofa seating, wide green garden windows, and step-free ground-floor access right next to our filtered swimming pool, musical rain dance, and indoor games room.',
    ],
    specs: [
      { label: 'Guest Capacity', value: '2 – 6 Guests' },
      { label: 'Bed Options', value: '1, 2 or 3 Double Beds' },
      { label: 'Floor Area', value: '320 – 420 sq.ft.' },
      { label: 'Access Type', value: 'Ground-Level Cottages' },
    ],
    facilities: [
      'Spacious multi-bed layouts (1, 2, or 3 double beds)',
      'In-room sofa lounge & coffee table seating',
      'Filtered outdoor swimming pool suitable for adults & kids',
      'Musical rain dance arena for family fun',
      'Indoor recreation zone (carrom, chess, tabletop games)',
      '24/7 hot water geyser & modern ensuite washrooms',
      'Freshly prepared home-style vegetarian & non-veg meals',
      'Complimentary high-speed Wi-Fi & flat-screen LED TV',
      'Safe gated village grounds away from traffic',
      'Dedicated on-site family car parking',
    ],
    photos: [
      {
        src: df1Img('604426481.jpg'),
        alt: 'Spacious bedroom opening directly onto sunlit green resort pathways for easy family movement',
        caption: 'Spacious Courtyard Suite',
        orientation: 'portrait',
      },
      {
        src: galleryImg('WhatsApp Image 2026-07-14 at 12.07.31 PM (1).jpeg'),
        alt: 'Ground-level family cottage exterior framed by palms and landscaped garden',
        caption: 'Family Cottage Facade',
        orientation: 'landscape',
      },
      {
        src: df1Img('df1.jpeg'),
        alt: 'Clean double bedroom with wooden false ceiling, wardrobe, mirror, and crisp linens',
        caption: 'Wooden-Ceiling Interior',
        orientation: 'portrait',
      },
      {
        src: df1Img('604426551.jpg'),
        alt: 'Comfortable double bedding with curtained window and wooden TV panel',
        caption: 'Bedroom & TV Console',
        orientation: 'portrait',
      },
      {
        src: galleryImg('WhatsApp Image 2026-07-14 at 12.07.29 PM.jpeg'),
        alt: 'Shaded outdoor veranda bench seating overlooking the resort garden',
        caption: 'Veranda Family Sit-Out',
        orientation: 'portrait',
      },
      {
        src: galleryImg('unnamed (4).webp'),
        alt: 'Clean outdoor swimming pool ready for families and children',
        caption: 'Swimming Pool Area',
        orientation: 'portrait',
      },
      {
        src: galleryImg('WhatsApp Image 2026-07-14 at 12.07.22 PM.jpeg'),
        alt: 'Indoor recreation zone with table tennis, carrom, and family dining tables',
        caption: 'Indoor Games Hall',
        orientation: 'portrait',
      },
    ],
    linkedRoomsHeading: 'Available Family Room Configurations',
    linkedRooms: [
      {
        roomId: 'superior-deluxe-double',
        bedConfig: '2 Double Beds',
        note: 'Two double beds + sofa seating lounge for families up to 4 guests',
      },
      {
        roomId: 'triple-room',
        bedConfig: '3 Double Beds',
        note: 'Three double beds + lounge seating for larger families up to 6 guests',
      },
      {
        roomId: 'deluxe-family-room',
        bedConfig: '1 Double Bed',
        note: 'Comfortable couple & small-family cottage with wooden interiors',
      },
      {
        roomId: 'standard-family-room',
        bedConfig: '1 Double Bed',
        note: 'Spacious single-bed room with proximity to pool & play area',
      },
    ],
    enquiryHeading: 'Plan Your Family Stay',
    enquiryNotes: [
      'Share your travel dates and number of adults and children directly on WhatsApp for tailored family room recommendations.',
      'Custom home-style meals with dedicated vegetarian cooking arrangements can be requested for your stay.',
    ],
    enquiryActionPath: '/booking',
    enquiryActionLabel: 'Family Stay Enquiry',
  },
  'group-booking': {
    slug: 'group-booking',
    eyebrow: 'FRIENDS, REUNIONS & CORPORATE TEAMS · COORG',
    title: 'Group Booking',
    subtitle:
      'Reserve multi-bed suites and adjoining cottage blocks around our private open courtyard, complete with custom dining and evening campfire setups.',
    metaSummary: ['6 to 40+ Guests', 'Cottage Blocks & Multi-Bed Units', 'Campfire & Coach Parking'],
    overviewParagraphs: [
      'Whether you are organizing a corporate team offsite, a college friends reunion, or an extended family celebration in Coorg, Dreamy Vacations brings your entire group together across adjoining cottages and multi-bed rooms surrounding our central courtyard.',
      'Groups benefit from custom freshly prepared vegetarian and non-vegetarian Coorg meals (with dedicated vegetarian kitchen arrangements), private evening bonfire and rain dance sessions, indoor games, and effortless on-site parking for multiple cars, tempo travellers, and full-size tourist coaches.',
    ],
    specs: [
      { label: 'Group Capacity', value: '6 – 40+ Guests' },
      { label: 'Arrangements', value: 'Multi-Bed + Adjoining Cottages' },
      { label: 'Dining & Events', value: 'Custom Veg & Non-Veg Meals' },
      { label: 'Vehicle Parking', value: 'Cars, Vans & Tourist Buses' },
    ],
    facilities: [
      'Triple-bed (6-guest) & twin double-bed (4-guest) suites',
      'Separate adjoining cottages available for couples within groups',
      'Private evening campfire & acoustic courtyard gatherings',
      'Musical rain dance arena & filtered outdoor swimming pool',
      'Custom freshly prepared Veg & Non-Veg group dining',
      'Dedicated vegetarian cooking prep upon request',
      'Indoor recreation room (carrom, chess, table games)',
      'Dedicated open-air dining hall & veranda sit-outs',
      'High-speed fiber Wi-Fi across cottages & common zones',
      'Spacious, secure on-site parking for tourist buses & cars',
    ],
    photos: [
      {
        src: df1Img('WhatsApp Image 2026-07-14 at 12.07.32 PM (4).jpeg'),
        alt: 'Aerial view of Dreamy Vacations cottage cluster, central courtyard, and tropical palms',
        caption: 'Cottage Cluster & Courtyard',
        orientation: 'landscape',
      },
      {
        src: df1Img('WhatsApp Image 2026-07-14 at 12.07.33 PM (2).jpeg'),
        alt: 'Overhead aerial view of all guest cottages, dining hall, and parking area in Kushalnagar',
        caption: 'Full Resort Grounds Layout',
        orientation: 'landscape',
      },
      {
        src: galleryImg('WhatsApp Image 2026-07-14 at 9.44.27 AM (3).jpeg'),
        alt: 'Row of adjoining cottages along landscaped garden walkway for group stays',
        caption: 'Adjoining Cottage Row',
        orientation: 'landscape',
      },
      {
        src: df1Img('df1.jpeg'),
        alt: 'Clean guest cottage bedroom interior with wooden false ceiling and wardrobe',
        caption: 'Guest Cottage Interior',
        orientation: 'portrait',
      },
      {
        src: galleryImg('WhatsApp Image 2026-07-14 at 12.07.25 PM.jpeg'),
        alt: 'Evening group campfire gathering lit up in the central resort courtyard',
        caption: 'Evening Courtyard Campfire',
        orientation: 'portrait',
      },
      {
        src: galleryImg('WhatsApp Image 2026-07-14 at 12.07.24 PM.jpeg'),
        alt: 'Charcoal grill and warm fire ambiance for evening group gatherings',
        caption: 'Outdoor Grill Setup',
        orientation: 'portrait',
      },
      {
        src: galleryImg('unnamed (3).webp'),
        alt: 'Illuminated resort dining hall and garden walkway at night',
        caption: 'Group Dining Hall at Dusk',
        orientation: 'portrait',
      },
      {
        src: galleryImg('WhatsApp Image 2026-07-14 at 9.44.26 AM.jpeg'),
        alt: 'Private black-brick resort cottage exterior with red-tiled entrance pathway',
        caption: 'Cottage Exterior & Veranda',
        orientation: 'landscape',
      },
    ],
    linkedRoomsHeading: 'Room Units Included in Group Arrangements',
    linkedRooms: [
      {
        roomId: 'triple-room',
        bedConfig: '3 Double Beds',
        note: 'Primary group unit housing up to 6 guests with lounge & work desk',
      },
      {
        roomId: 'superior-deluxe-double',
        bedConfig: '2 Double Beds',
        note: 'Spacious 4-guest unit ideal for friend sub-groups or families',
      },
      {
        roomId: 'deluxe-family-room',
        bedConfig: '1 Double Bed',
        note: 'Private 2-guest cottage for couples, leads, or organizers',
      },
      {
        roomId: 'standard-family-room',
        bedConfig: '1 Double Bed',
        note: 'Additional private double-bed rooms for larger full-block buyouts',
      },
    ],
    enquiryHeading: 'Group Enquiry Information',
    enquiryNotes: [
      'Let us know your total guest count (adults & children), meal preference (with or without food, vegetarian guest count), and whether any couples require separate private cottages.',
      'Direct WhatsApp coordination connects you straight to our resort coordinator for block availability and itinerary meal planning.',
    ],
    enquiryActionPath: '/group-booking',
    enquiryActionLabel: 'Open Group Estimator',
  },
};

interface RoomCategoryDetailProps {
  category: CategorySlug;
}

export default function RoomCategoryDetail({ category }: RoomCategoryDetailProps) {
  const config = CATEGORY_DATA[category];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    setActiveIndex(0);
    setLightboxIndex(null);
  }, [category]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % config.photos.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + config.photos.length) % config.photos.length
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, config.photos.length]);

  const currentPhoto = config.photos[activeIndex] || config.photos[0];
  const isCurrentPortrait = currentPhoto.orientation === 'portrait';

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? config.photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === config.photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="w-full bg-[#0d0d0d] text-white font-sans py-24 min-h-screen"
      id={`category-detail-${config.slug}`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-8">
        {/* BREADCRUMB & BACK NAVIGATION */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 text-xs font-sub font-semibold tracking-[0.15em] uppercase text-white/75 hover:text-[#e2d7c5] transition-colors"
            id="btn-back-to-rooms"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Rooms
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/40 font-mono">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/rooms" className="hover:text-white transition-colors">
              Rooms
            </Link>
            <span>/</span>
            <span className="text-[#e2d7c5] font-medium">{config.title}</span>
          </div>
        </div>

        {/* HERO TITLE BLOCK */}
        <header className="mb-10 space-y-3">
          <span className="text-[11px] font-sub font-semibold tracking-[0.22em] text-[#e2d7c5] uppercase block">
            {config.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-white tracking-tight">
            {config.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#e2d7c5]/80 font-sans tracking-wide">
            {config.metaSummary.join(' · ')}
          </p>
          <p className="text-sm md:text-base text-white/70 font-light max-w-3xl leading-relaxed pt-1">
            {config.subtitle}
          </p>
        </header>

        {/* TWO-COLUMN CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: GALLERY + FULL DESCRIPTION + ROOM OPTIONS + FACILITIES */}
          <div className="lg:col-span-8 space-y-8">
            {/* INTERACTIVE PHOTO GALLERY */}
            <section
              className="bg-[#121212] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4"
              aria-label={`${config.title} photo gallery`}
            >
              {/* MAIN STAGE: Preserves native portrait vs landscape proportions */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/5 flex items-center justify-center min-h-[340px] sm:min-h-[460px] group">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(activeIndex)}
                  className={`relative cursor-zoom-in focus:outline-none ${
                    isCurrentPortrait
                      ? 'w-full max-w-[360px] sm:max-w-[390px] aspect-[3/4] my-2 sm:my-4 rounded-xl overflow-hidden shadow-2xl'
                      : 'w-full aspect-[3/2] overflow-hidden'
                  }`}
                  aria-label={`Open ${currentPhoto.caption} in fullscreen`}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentPhoto.src}
                      src={currentPhoto.src}
                      alt={currentPhoto.alt}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={handleRoomImageError}
                      className="w-full h-full object-cover select-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    />
                  </AnimatePresence>
                </button>

                {/* Prev / Next Arrows */}
                {config.photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous photograph"
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-[#6b5b4b] text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer z-10"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next photograph"
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-[#6b5b4b] text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer z-10"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Top/Bottom Overlays */}
                <div className="absolute bottom-3 left-3 z-10">
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(activeIndex)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white text-xs font-medium border border-white/10 backdrop-blur-sm cursor-pointer transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#e2d7c5]" /> Fullscreen
                  </button>
                </div>
                <div className="absolute bottom-3 right-3 z-10 px-3 py-1.5 rounded-full bg-black/70 text-white/85 text-xs font-mono border border-white/10 backdrop-blur-sm">
                  {activeIndex + 1} / {config.photos.length}
                </div>
              </div>

              {/* THUMBNAIL STRIP */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {config.photos.map((photo, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={photo.caption + idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`group rounded-xl overflow-hidden border transition-all cursor-pointer text-left ${
                        isActive
                          ? 'border-[#e2d7c5] ring-1 ring-[#e2d7c5]/40 opacity-100'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                      aria-label={`View ${photo.caption}`}
                    >
                      <div className="aspect-[4/3] w-full bg-zinc-950 overflow-hidden">
                        <img
                          src={photo.src}
                          alt={photo.caption}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={handleRoomImageError}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* FULL DESCRIPTION */}
            <section className="bg-[#121212] rounded-2xl p-6 md:p-8 border border-white/10 space-y-4">
              <h2 className="text-xl font-display font-light text-white border-b border-white/5 pb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#e2d7c5]" /> Accommodation Overview
              </h2>
              <div className="space-y-4 text-sm md:text-base text-white/75 leading-relaxed font-light">
                {config.overviewParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </section>

            {/* AVAILABLE ROOM OPTIONS (PRESERVES & LINKS TO /rooms/:id DETAIL PAGES) */}
            <section className="bg-[#121212] rounded-2xl p-6 md:p-8 border border-white/10 space-y-5">
              <div>
                <h2 className="text-xl font-display font-light text-white flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-[#e2d7c5]" /> {config.linkedRoomsHeading}
                </h2>
                <p className="text-xs text-white/55 mt-1 font-light">
                  Select a specific suite below to review its individual dimensions and gallery.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {config.linkedRooms.map((opt) => {
                  const matched = ROOMS.find((r) => r.id === opt.roomId);
                  if (!matched) return null;
                  return (
                    <Link
                      key={matched.id}
                      to={`/rooms/${matched.id}`}
                      className="group p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[#e2d7c5]/40 transition-all flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-display font-light text-white group-hover:text-[#e2d7c5] transition-colors">
                            {matched.name}
                          </h3>
                          <ArrowRight className="w-4 h-4 text-[#e2d7c5] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <p className="text-[11px] font-mono text-[#e2d7c5]/80">
                          {matched.occupancy} · {opt.bedConfig} · {matched.size}
                        </p>
                        <p className="text-xs text-white/60 font-light leading-relaxed">
                          {opt.note}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* COMPLETE FACILITIES & AMENITIES */}
            <section className="bg-[#121212] rounded-2xl p-6 md:p-8 border border-white/10 space-y-6">
              <div>
                <h2 className="text-xl font-display font-light text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#e2d7c5]" /> Complete Facilities &amp; Amenities
                </h2>
                <p className="text-xs text-white/55 mt-1 font-light">
                  All rooms and resort grounds are thoroughly cleaned and prepared ahead of guest check-in.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {config.facilities.map((facility, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-sm text-white/80 font-light">{facility}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: STICKY ENQUIRY & SPECIFICATIONS SIDEBAR */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-[#121212] rounded-2xl p-6 md:p-8 border border-white/10 shadow-xl space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono text-[#e2d7c5] uppercase block tracking-wider">
                  Accommodation Specifications
                </span>
                <h2 className="text-xl md:text-2xl font-display font-light text-white mt-1">
                  {config.title}
                </h2>
              </div>

              <div className="space-y-3 text-xs font-medium text-white/80">
                {config.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between min-h-[44px] px-3.5 py-2 bg-white/5 rounded-xl gap-3"
                  >
                    <span className="text-white/45 font-light">{spec.label}</span>
                    <span className="text-white font-semibold text-right">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* ENQUIRY CTA BUTTONS */}
              <div className="space-y-3">
                <a
                  href={WHATSAPP_ENQUIRE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-[11px] font-sub font-semibold tracking-[0.16em] uppercase rounded-xl transition-all duration-300 ease-out cursor-pointer text-center flex items-center justify-center gap-2"
                  id={`btn-category-enquire-${config.slug}`}
                >
                  <MessageSquare className="w-4 h-4" />
                  ENQUIRE NOW
                </a>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={config.enquiryActionPath}
                    className="w-full h-12 px-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white text-[10px] sm:text-[11px] font-sub font-semibold tracking-[0.12em] uppercase rounded-xl transition-all duration-300 ease-out text-center flex items-center justify-center"
                  >
                    {config.enquiryActionLabel}
                  </Link>
                  <a
                    href="tel:+919902960484"
                    className="w-full h-12 px-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white text-[10px] sm:text-[11px] font-sub font-semibold tracking-[0.12em] uppercase rounded-xl transition-all duration-300 ease-out text-center flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-white shrink-0" />
                    CALL NOW
                  </a>
                </div>
              </div>

              {/* ENQUIRY DETAILS */}
              <div className="p-4 bg-[#6b5b4b]/10 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-sub font-semibold uppercase tracking-wider text-[#e2d7c5]">
                  {config.slug === 'group-booking' ? (
                    <Building2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <Info className="w-4 h-4 shrink-0" />
                  )}
                  <span>{config.enquiryHeading}</span>
                </div>
                <div className="space-y-1.5">
                  {config.enquiryNotes.map((note, idx) => (
                    <p
                      key={idx}
                      className="text-[11px] text-white/65 leading-relaxed font-light"
                    >
                      {note}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* LOCATION & BACK TO ROOMS LINKS */}
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-[#e2d7c5] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-xs font-display font-light text-white">
                    Dreamy Vacations Location
                  </h3>
                  <p className="text-[11px] text-white/60 leading-relaxed font-light">
                    Chikkathur Village, Kushalnagar, Coorg. Easy access near Golden Temple Bylakuppe &amp; Kaveri Nisargadhama.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                <Link
                  to="/rooms"
                  className="inline-flex items-center gap-1.5 text-[11px] font-sub font-semibold tracking-[0.14em] uppercase text-[#e2d7c5] hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> All Categories
                </Link>
                <Link
                  to="/gallery"
                  className="inline-flex items-center gap-1.5 text-[11px] font-sub font-semibold tracking-[0.14em] uppercase text-white/60 hover:text-[#e2d7c5] transition-colors"
                >
                  Full Gallery <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-between p-4 font-sans select-none backdrop-blur-md"
            id="category-gallery-lightbox"
          >
            <div className="flex items-center justify-between w-full text-white/80 p-3 sm:p-4 z-10">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#e2d7c5]" />
                <span className="text-xs md:text-sm font-medium tracking-wider uppercase">
                  {config.title} · {config.photos[lightboxIndex]?.caption}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close fullscreen gallery"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full flex-grow flex items-center justify-center">
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === null
                      ? null
                      : (prev - 1 + config.photos.length) % config.photos.length
                  )
                }
                className="absolute left-2 sm:left-6 p-3 rounded-full bg-white/10 hover:bg-[#6b5b4b] text-white transition-colors z-10 cursor-pointer"
                aria-label="Previous fullscreen image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="max-w-5xl max-h-[78vh] w-full h-full flex items-center justify-center p-2">
                <motion.img
                  key={lightboxIndex}
                  src={config.photos[lightboxIndex]?.src}
                  alt={config.photos[lightboxIndex]?.alt}
                  referrerPolicy="no-referrer"
                  onError={handleRoomImageError}
                  className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === null ? null : (prev + 1) % config.photos.length
                  )
                }
                className="absolute right-2 sm:right-6 p-3 rounded-full bg-white/10 hover:bg-[#6b5b4b] text-white transition-colors z-10 cursor-pointer"
                aria-label="Next fullscreen image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="flex justify-center text-white/60 text-xs font-mono py-3">
              {lightboxIndex + 1} / {config.photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
