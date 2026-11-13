import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

const globDf1Images = (import.meta as any).glob(
  '../../images/rooms/df1/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true }
);

function resolveDf1Image(filename: string): string {
  const entry = Object.entries(globDf1Images).find(([key]) =>
    key.toLowerCase().endsWith(`/${filename.toLowerCase()}`)
  );
  if (entry) {
    const mod = entry[1] as any;
    return mod.default || mod;
  }
  return `/images/rooms/df1/${filename}`;
}

interface AccommodationCategoryCard {
  id: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  route: string;
}

const CATEGORY_CARDS: AccommodationCategoryCard[] = [
  {
    id: 'couples',
    title: 'Rooms for Couples',
    intro:
      'Private cottages with king-size double bedding, warm wood finishes, and serene garden surroundings tailored for two.',
    image: resolveDf1Image('df1.jpeg'),
    imageAlt: 'Double bedroom for couples with warm wooden ceiling and crisp linens at Dreamy Vacations Coorg',
    route: '/rooms/couples',
  },
  {
    id: 'families',
    title: 'Rooms for Families',
    intro:
      'Spacious multi-bed accommodations with cozy sofa lounges and ground-level access steps from our pool and play areas.',
    image: '/images/rooms/sd2/sd2.jpeg',
    imageAlt: 'Spacious family suite with two double beds and seating lounge at Dreamy Vacations',
    route: '/rooms/families',
  },
  {
    id: 'group-booking',
    title: 'Group Booking',
    intro:
      'Adjoining cottages and multi-bed units arranged around our private courtyard with custom Coorg dining and evening campfires.',
    image: resolveDf1Image('WhatsApp Image 2026-07-14 at 12.07.32 PM (4).jpeg'),
    imageAlt: 'Aerial view of Dreamy Vacations cottage cluster and open central courtyard for group stays in Coorg',
    route: '/rooms/group-booking',
  },
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
          <p className="text-sm md:text-base text-white/70 font-light max-w-xl mx-auto leading-relaxed">
            Select your stay style below to explore room photographs, facilities, capacities, and availability enquiries in Kushalnagar.
          </p>
        </header>

        {/* THREE CONCISE CATEGORY CARDS */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-9"
          id="rooms-feed"
        >
          {CATEGORY_CARDS.map((card, index) => (
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
                  src={card.image}
                  alt={card.imageAlt}
                  width={480}
                  height={360}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  referrerPolicy="no-referrer"
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
                    {card.intro}
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

        {/* BOTTOM HOUSE ADVISORY CARD */}
        <div className="mt-16 bg-[#121212] border border-white/5 rounded-2xl overflow-hidden p-8 flex gap-4">
          <HelpCircle className="w-6 h-6 text-[#e2d7c5] flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-base font-display font-light text-white">
              Important General Terms &amp; Conditions
            </h3>
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

