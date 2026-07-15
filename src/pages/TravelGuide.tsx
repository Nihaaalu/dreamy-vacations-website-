import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, ArrowRight, Clock, MapPin, Navigation, 
  Calendar, Check, HelpCircle, Star, Sparkles, ChevronRight, X,
  Waves, UtensilsCrossed, Home, Car, Coffee, Sun, TreePine, Leaf, Mountain, Users, Baby
} from 'lucide-react';

function getIconComponent(emoji: string) {
  switch (emoji) {
    case '📍':
      return <MapPin className="w-4 h-4 text-[#D6C6B2]" />;
    case '👥':
    case '👨‍👩‍👧‍👦':
      return <Users className="w-4 h-4 text-[#D6C6B2]" />;
    case '👶':
    case 'Child':
    case 'Baby':
      return <Baby className="w-4 h-4 text-[#D6C6B2]" />;
    case '🍽':
    case '🍛':
      return <UtensilsCrossed className="w-4 h-4 text-[#D6C6B2]" />;
    case '🥗':
    case '🌱':
    case '🎋':
      return <Leaf className="w-4 h-4 text-[#D6C6B2]" />;
    case '🌊':
    case '💦':
      return <Waves className="w-4 h-4 text-[#D6C6B2]" />;
    case '🏡':
      return <Home className="w-4 h-4 text-[#D6C6B2]" />;
    case '🚗':
      return <Car className="w-4 h-4 text-[#D6C6B2]" />;
    case '🌅':
    case '☀️':
      return <Sun className="w-4 h-4 text-[#D6C6B2]" />;
    case '🌲':
      return <TreePine className="w-4 h-4 text-[#D6C6B2]" />;
    case '🏔️':
    case '⛰️':
      return <Mountain className="w-4 h-4 text-[#D6C6B2]" />;
    case '☕':
      return <Coffee className="w-4 h-4 text-[#D6C6B2]" />;
    default:
      return <Sparkles className="w-4 h-4 text-[#D6C6B2]" />;
  }
}

import { GUIDES_DATA, DEFAULT_GUIDE } from '../guidesData';
import type { GuideData } from '../guidesData';

// Full list of attractions to display in the attraction card section
interface Attraction {
  name: string;
  img: string;
  alt: string;
  distance: string;
  time: string;
  timeAway: string;
  rating: string;
  bestHours: string;
  description: string;
  nearby: string[];
  mapLink: string;
  travelTip: string;
}

const ATTRACTIONS: Attraction[] = [
  {
    name: 'Golden Temple (Namdroling Monastery)',
    img: '/images/places/gold.jpeg',
    alt: 'Golden Temple in Kushalnagar, Coorg',
    distance: '8 km from Dreamy Vacations',
    time: '12–15 mins drive',
    timeAway: '15 mins away',
    rating: '★★★★★ Most Visited',
    bestHours: '09:00 AM – 12:00 PM',
    description: 'One of the largest Tibetan settlements and monasteries in India, housing three magnificent 40-foot tall golden statues of Buddha Shakyamuni, Padmasambhava, and Amitayus. A deeply serene cultural sanctuary.',
    nearby: ['Bylakuppe Tibetan Settlement', 'Tibetan Shopping Arcade', 'Local Tibetan Cafés'],
    mapLink: 'https://maps.google.com/?q=Namdroling+Monastery+Kushalnagar',
    travelTip: 'Visit before 9:00 AM to hear the monks chanting and enjoy the ultimate morning serenity without any tour bus crowds.'
  },
  {
    name: 'Dubare Elephant Camp',
    img: '/images/places/dubare.jpeg',
    alt: 'Dubare Elephant Camp on Cauvery River, Coorg',
    distance: '14 km from Dreamy Vacations',
    time: '20–25 mins drive',
    timeAway: '20 mins away',
    rating: '★★★★★ Highly Recommended',
    bestHours: '08:30 AM – 11:00 AM',
    description: 'A historic river camp set on the banks of the Cauvery River. Visitors can cross the river by motorboat, participate in elephant feeding and grooming, and enjoy peaceful river rafting.',
    nearby: ['Cauvery River Rafting', 'Chiklihole Reservoir', 'Deciduous Forests'],
    mapLink: 'https://maps.google.com/?q=Dubare+Elephant+Camp+Coorg',
    travelTip: 'Arrive by 8:15 AM to secure your boat tickets early and catch the elephant bathing ritual in the natural river waters.'
  },
  {
    name: 'Kaveri Nisargadhama',
    img: '/images/places/nisa.jpeg',
    alt: 'Kaveri Nisargadhama Forest Reserve, Coorg',
    distance: '4 km from Dreamy Vacations',
    time: '7–10 mins drive',
    timeAway: '10 mins away',
    rating: '★★★★★ Perfect for Families',
    bestHours: '09:00 AM – 04:30 PM',
    description: 'A beautiful 64-acre island forest formed by the river Cauvery, featuring dense bamboo groves, a deer park, orchid gardens, and a thrilling suspension bridge walkway.',
    nearby: ['Rope Suspension Bridge', 'Deer Park Walkway', 'Bamboo Tree Houses'],
    mapLink: 'https://maps.google.com/?q=Kaveri+Nisargadhama+Kushalnagar',
    travelTip: 'Cross the suspension bridge early in the morning for the best birdwatching and a misty, quiet walk under the bamboo canopy.'
  },
  {
    name: 'Harangi Dam',
    img: '/images/places/harangi.jpeg',
    alt: 'Harangi Dam and Backwaters in Kushalnagar, Coorg',
    distance: '9 km from Dreamy Vacations',
    time: '15 mins drive',
    timeAway: '15 mins away',
    rating: '★★★★★ Scenic & Peaceful',
    bestHours: '08:00 AM – 10:30 AM',
    description: 'A spectacular masonry reservoir built across the Harangi tributary. The backwaters are surrounded by dense forests and offer an incredibly peaceful escape with minimal tourist crowds.',
    nearby: ['Harangi Tree Park', 'Chiklihole Dam', 'Birdwatching Path'],
    mapLink: 'https://maps.google.com/?q=Harangi+Dam+Coorg',
    travelTip: 'Combine this with Harangi Tree Park nearby for a wonderful, shaded midday picnic under high-canopy trees.'
  },
  {
    name: 'Chiklihole Reservoir',
    img: '/images/places/chick.jpeg',
    alt: 'Chiklihole Reservoir near Kushalnagar, Coorg',
    distance: '11 km from Dreamy Vacations',
    time: '18 mins drive',
    timeAway: '20 mins away',
    rating: '★★★★★ Offbeat Gem',
    bestHours: '03:00 PM – 05:30 PM',
    description: 'A beautiful, semi-circular dam surrounded by lush green forests. With no commercial stalls and very few tourists, it is the perfect spot for quiet photography and enjoying the sounds of nature.',
    nearby: ['Dubare Forest Range', 'Siddapur Coffee Estates'],
    mapLink: 'https://maps.google.com/?q=Chiklihole+Reservoir+Coorg',
    travelTip: 'There are no shops or toilets here, so carry your own drinking water and snacks to fully enjoy the undisturbed wilderness.'
  },
  {
    name: 'Abbey Falls',
    img: '/images/places/ab.jpeg',
    alt: 'Abbey Falls waterfall in Madikeri, Coorg',
    distance: '34 km from Dreamy Vacations',
    time: '50 mins drive',
    timeAway: '50 mins away',
    rating: '★★★★★ Most Photographed',
    bestHours: '01:30 PM – 04:00 PM',
    description: 'One of Coorg’s most famous landmarks, where mountain streams cascade down 70 feet over black rocks. Enjoying the shaded coffee estate walk and roaring waterfall during the afternoon makes it a wonderful post-lunch stop.',
    nearby: ['Hanging Bridge View', 'Coffee Estate Walk', 'Madikeri Fort'],
    mapLink: 'https://maps.google.com/?q=Abbey+Falls+Madikeri',
    travelTip: 'The path down to the falls has about 150 concrete steps; take your time on the walk back up and enjoy the cool, spice-scented afternoon shade.'
  },
  {
    name: 'Raja’s Seat',
    img: '/images/places/raja.jpeg',
    alt: 'Rajas Seat viewpoint in Madikeri, Coorg',
    distance: '31 km from Dreamy Vacations',
    time: '45 mins drive',
    timeAway: '45 mins away',
    rating: '★★★★★ Best Sunset Spot',
    bestHours: '05:00 PM – 06:30 PM',
    description: 'A spectacular public garden perched on a high ridge in Madikeri, intentionally scheduled for the early evening because it is one of Coorg’s absolute best sunset viewpoints. Historically, the Kings of Coorg sat here to enjoy sunset views.',
    nearby: ['Toy Train Station', 'Madikeri Viewpoint', 'Musical Fountain'],
    mapLink: 'https://maps.google.com/?q=Rajas+Seat+Madikeri',
    travelTip: 'Arrive at least 45 minutes before sunset to secure a good spot along the stone railing for the ultimate panoramic sunset and mist-filled valley photo.'
  },
  {
    name: 'Mandalpatti Peak',
    img: '/images/places/md.jpeg',
    alt: 'Mandalpatti Peak viewpoint in Coorg',
    distance: '50 km from Dreamy Vacations',
    time: '1 hr 30 mins (inc. 4x4 Jeep)',
    timeAway: '1.5 hrs away',
    rating: '★★★★★ Epic Adventure',
    bestHours: '08:00 AM – 11:30 AM',
    description: 'An absolute must-visit mountain ridge. Accessed via a thrilling 4x4 off-road jeep safari, it is best visited in the morning for the clearest mountain views, pleasant weather, and to beat the heavy afternoon crowds.',
    nearby: ['Pushpagiri Forest Reserve', 'Off-road Jeep Trails'],
    mapLink: 'https://maps.google.com/?q=Mandalpatti+Peak+Coorg',
    travelTip: 'A windcheater or light jacket is essential. Early morning visibility is outstanding, providing spectacular 360-degree views of the Western Ghats.'
  }
];

// Related articles list
const RELATED_ARTICLES = [
  { name: '2 Day Coorg Itinerary', path: '/travel-guide/coorg-trip-plan-2-days' },
  { name: 'Ultimate 3 Day Travel Guide', path: '/travel-guide/coorg-trip-plan-3-days' },
  { name: 'Where to Stay: Kushalnagar vs Madikeri', path: '/travel-guide/best-place-to-stay-in-coorg' },
  { name: 'Best Resorts & Attractions Near Kushalnagar', path: '/travel-guide/resorts-near-kushalnagar' }
];

interface PremiumBookingCardProps {
  label: string;
  title: string;
  description: string;
  buttonText: string;
  targetPath?: string;
}

function PremiumBookingCard({ label, title, description, buttonText, targetPath = '/booking' }: PremiumBookingCardProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-[#121212] border border-white/5 rounded-[24px] p-6 sm:p-8 relative overflow-hidden text-center sm:text-left shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-6 my-12 max-w-4xl mx-auto">
      <div className="absolute top-0 left-0 w-[4px] h-full bg-[#6b5b4b]" />
      <div className="space-y-2 max-w-xl">
        <span className="text-[10px] font-sub font-semibold tracking-[0.2em] text-[#e2d7c5] uppercase block">
          {label}
        </span>
        <h3 className="text-lg sm:text-xl font-display font-light text-white leading-tight">
          {title}
        </h3>
        <p className="text-xs text-white/60 leading-relaxed font-light">
          {description}
        </p>
      </div>
      <button
        onClick={() => navigate(targetPath)}
        className="w-full sm:w-auto px-6 py-3 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-[10px] font-sub font-semibold tracking-[0.18em] uppercase rounded-full transition-all duration-300 ease-out shadow-md shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
      >
        {buttonText} <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function TravelGuide() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // Retrieve matching article or fallback
  const guide = slug && GUIDES_DATA[slug] ? GUIDES_DATA[slug] : DEFAULT_GUIDE;

  const getAttractionIdSafe = (title: string) => {
    if (/Golden Temple|Namdroling/i.test(title)) return 'attraction-golden-temple-namdroling-monastery';
    if (/Dubare/i.test(title)) return 'attraction-dubare-elephant-camp';
    if (/Nisargadhama/i.test(title)) return 'attraction-kaveri-nisargadhama';
    if (/Harangi/i.test(title)) return 'attraction-harangi-dam';
    if (/Chiklihole/i.test(title)) return 'attraction-chiklihole-reservoir';
    if (/Abbey/i.test(title)) return 'attraction-abbey-falls';
    if (/Raja/i.test(title)) return 'attraction-raja-s-seat';
    if (/Mandalpatti/i.test(title)) return 'attraction-mandalpatti-peak';
    return '';
  };

  const getTargetIdForPlannerItem = (name: string) => {
    if (/Golden Temple|Namdroling/i.test(name)) return 'attraction-golden-temple-namdroling-monastery';
    if (/Dubare/i.test(name)) return 'attraction-dubare-elephant-camp';
    if (/Nisargadhama/i.test(name)) return 'attraction-kaveri-nisargadhama';
    if (/Harangi/i.test(name)) return 'attraction-harangi-dam';
    if (/Chiklihole/i.test(name)) return 'attraction-chiklihole-reservoir';
    if (/Abbey/i.test(name)) return 'attraction-abbey-falls';
    if (/Raja/i.test(name)) return 'attraction-raja-s-seat';
    if (/Mandalpatti/i.test(name)) return 'attraction-mandalpatti-peak';
    return 'guide-itinerary'; // Fallback to timeline
  };

  const getPlannerDays = () => {
    if (slug === 'coorg-trip-plan-3-days') {
      return [
        {
          title: 'Day 1: Valley Gateway',
          items: ['Golden Temple', 'Harangi Dam', 'Kaveri Nisargadhama', 'Dubare Elephant Camp']
        },
        {
          title: 'DAY 2: RELAX & ENJOY KUSHALNAGAR',
          items: [
            'Breakfast',
            'Free Time / Revisit Favourite Attraction',
            'Lunch',
            'Swimming Pool & Rain Dance',
            'Resort Leisure',
            'Dinner'
          ]
        },
        {
          title: 'Day 3: Misty Highlands',
          items: ['Mandalpatti Peak', 'Abbey Falls', 'Raja’s Seat']
        }
      ];
    }
    
    return [
      {
        title: 'Day 1: Valley Gateway',
        items: ['Golden Temple', 'Harangi Dam', 'Kaveri Nisargadhama', 'Dubare Elephant Camp']
      },
      {
        title: 'Day 2: Misty Highlands',
        items: ['Mandalpatti Peak', 'Abbey Falls', 'Raja’s Seat']
      }
    ];
  };

  // Validate the travel sequence & geographical rules
  useEffect(() => {
    if (guide && guide.timeline) {
      try {
        guide.timeline.forEach((dayPlan) => {
          const activities = [...dayPlan.activities].sort((a, b) => a.order - b.order);
          
          const isKushalnagarDay = /Kushalnagar|Gateway|Circuit/i.test(dayPlan.day);
          const isMadikeriDay = /Madikeri|Highlands/i.test(dayPlan.day);

          if (isMadikeriDay) {
            // No Kushalnagar attraction appears in the Madikeri day
            const violatesKush = activities.filter(act => 
              /Golden Temple|Namdroling|Harangi|Nisargadhama|Dubare|Chiklihole/i.test(act.title)
            );
            if (violatesKush.length > 0) {
              console.error(`Geographical Error: Kushalnagar attraction [${violatesKush[0].title}] found in Madikeri day: ${dayPlan.day}`);
            }
          }

          if (isKushalnagarDay) {
            // No Madikeri attraction appears in the Kushalnagar day
            const violatesMadikeri = activities.filter(act => 
              /Abbey|Raja|Mandalpatti|Fort/i.test(act.title)
            );
            if (violatesMadikeri.length > 0) {
              console.error(`Geographical Error: Madikeri attraction [${violatesMadikeri[0].title}] found in Kushalnagar day: ${dayPlan.day}`);
            }
          }

          // Chiklihole Reservoir is always after Dubare Elephant Camp (if both exist)
          const dubareIdx = activities.findIndex(act => /Dubare/i.test(act.title));
          const chikliholeIdx = activities.findIndex(act => /Chiklihole/i.test(act.title));
          if (dubareIdx !== -1 && chikliholeIdx !== -1 && chikliholeIdx < dubareIdx) {
            console.error(`Routing Error: Chiklihole Reservoir is placed before Dubare Elephant Camp in ${dayPlan.day}`);
          }

          // Abbey Falls is always before Raja's Seat (if both exist)
          const abbeyIdx = activities.findIndex(act => /Abbey/i.test(act.title));
          const rajaIdx = activities.findIndex(act => /Raja/i.test(act.title));
          if (abbeyIdx !== -1 && rajaIdx !== -1 && rajaIdx < abbeyIdx) {
            console.error(`Routing Error: Abbey Falls is placed after Raja's Seat in ${dayPlan.day}`);
          }

          // Mandalpatti Peak is always before Raja's Seat (if both exist)
          const mandalpattiIdx = activities.findIndex(act => /Mandalpatti/i.test(act.title));
          if (mandalpattiIdx !== -1 && rajaIdx !== -1 && rajaIdx < mandalpattiIdx) {
            console.error(`Routing Error: Mandalpatti Peak is placed after Raja's Seat in ${dayPlan.day}`);
          }

          // Strict validations depending on the day and itinerary
          const isMadikeriDayValidations = (/Day 2/i.test(dayPlan.day) && slug === 'coorg-trip-plan-2-days') ||
                                           (/Day 3/i.test(dayPlan.day) && slug === 'coorg-trip-plan-3-days');
          if (isMadikeriDayValidations) {
            // 1. Coffee Plantation Drive does not exist anywhere in Madikeri Day
            const hasCoffeePlantationDrive = activities.some(act => /Coffee Plantation Drive/i.test(act.title));
            if (hasCoffeePlantationDrive) {
              console.error("Validation Error: Coffee Plantation Drive found in Madikeri Day!");
            }

            // 2. Chiklihole Reservoir does not appear in Madikeri Day
            const hasChiklihole = activities.some(act => /Chiklihole/i.test(act.title));
            if (hasChiklihole) {
              console.error("Validation Error: Chiklihole Reservoir found in Madikeri Day!");
            }

            // 3. Mandalpatti Peak is the first attraction of the day (excluding food/rest)
            const realAttractions = activities.filter(act => 
              !/Breakfast|Dinner|Relax|Lunch|Return/i.test(act.title)
            );
            if (realAttractions.length > 0 && !/Mandalpatti/i.test(realAttractions[0].title)) {
              console.error(`Validation Error: Mandalpatti Peak is not the first attraction of the day! First was: ${realAttractions[0].title}`);
            }

            // 4. Lunch comes immediately after Mandalpatti Peak
            const mandalpattiSeqIdx = activities.findIndex(act => /Mandalpatti/i.test(act.title));
            const lunchSeqIdx = activities.findIndex(act => /Lunch/i.test(act.title));
            if (mandalpattiSeqIdx !== -1 && lunchSeqIdx !== -1) {
              if (lunchSeqIdx !== mandalpattiSeqIdx + 1) {
                console.error("Validation Error: Lunch does not come immediately after Mandalpatti Peak!");
              }
            }

            // 5. Abbey Falls comes after lunch
            const abbeySeqIdx = activities.findIndex(act => /Abbey/i.test(act.title));
            if (lunchSeqIdx !== -1 && abbeySeqIdx !== -1 && abbeySeqIdx < lunchSeqIdx) {
              console.error("Validation Error: Abbey Falls is scheduled before lunch!");
            }

            // 6. Raja's Seat is always the final sightseeing stop before returning to the resort
            if (realAttractions.length > 0) {
              const lastSightseeing = realAttractions[realAttractions.length - 1];
              if (!/Raja/i.test(lastSightseeing.title)) {
                console.error(`Validation Error: Raja's Seat is not the final sightseeing stop! Final was: ${lastSightseeing.title}`);
              }
            }
          }

          // Strict 3-Day Itinerary Day 2 validations
          if (slug === 'coorg-trip-plan-3-days' && /Day 2/i.test(dayPlan.day)) {
            const hasNatureWalk = activities.some(act => /Nature Walk|Birdwatching/i.test(act.title));
            const hasPlantation = activities.some(act => /Plantation/i.test(act.title));
            if (hasNatureWalk || hasPlantation) {
              console.error("Validation Error: Day 2 contains forbidden activities (Nature Walk or Coffee Plantation Tour)!");
            }
          }
        });
      } catch (err) {
        console.error("Itinerary validation failed:", err);
      }
    }
  }, [guide]);

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // offset for nav/sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        navigate(href);
      }
    }
  };

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      
      // Find current active attraction card
      for (const att of ATTRACTIONS) {
        const idSafe = `attraction-${att.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        const el = document.getElementById(idSafe);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(att.name);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle local navigation smooth scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Dynamic FAQ list from current guide with default fallbacks
  const faqs = guide.faqs && guide.faqs.length > 0 ? guide.faqs : [
    {
      q: 'Is Kushalnagar a good base for Coorg?',
      a: 'Yes, Kushalnagar is the absolute best base for exploring Coorg. It is located right off the highway, features flat terrains, wide roads, and is extremely close to the Golden Temple, Dubare Elephant Camp, and Nisargadhama, while keeping Madikeri town a comfortable 45-minute drive away.'
    },
    {
      q: 'Where should families stay in Coorg?',
      a: 'Families should prefer staying at a premium resort in Kushalnagar like Dreamy Vacations, which offers spacious family rooms, a kids-friendly swimming pool, safe indoor play areas, rain dances, and evening campfires.'
    }
  ];

  return (
    <div className="w-full bg-[#0d0d0d] text-white font-sans min-h-screen relative overflow-x-hidden" id="travel-guide-root" onClick={handleContainerClick}>
      
      {/* JSON-LD FAQ SCHEMA FOR SEO ACCREDITATION */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        })}
      </script>

      {/* STICKY MINI PLANNER (Desktop Only) */}
      <div className="hidden lg:block fixed top-32 right-6 xl:right-12 w-60 bg-[#121212]/95 backdrop-blur-md border border-[#6b5b4b]/30 rounded-[24px] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-40">
        <div className="space-y-4">
          <div className="text-[10px] uppercase font-sub font-semibold tracking-widest text-[#e2d7c5] flex items-center gap-1.5 border-b border-white/5 pb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#e2d7c5]" /> Interactive Planner
          </div>
          
          <div className="space-y-4">
            {getPlannerDays().map((day, dIdx) => {
              return (
                <div key={dIdx}>
                  {dIdx > 0 && <div className="h-[1px] bg-white/5 my-3" />}
                  <div className="text-[9px] font-sub tracking-widest text-white/40 uppercase mb-2 font-semibold">
                    {day.title}
                  </div>
                  <ul className="space-y-2 text-xs font-light">
                    {day.items.map((name) => {
                      const targetId = getTargetIdForPlannerItem(name);
                      const isCurrent = targetId.startsWith('attraction-')
                        ? activeSection.toLowerCase().includes(name.split(' ')[0].toLowerCase())
                        : false;
                      return (
                        <li key={name} className="flex items-center justify-between text-white/70">
                          <span 
                            onClick={() => scrollToId(targetId)}
                            className={`cursor-pointer hover:text-[#e2d7c5] transition-colors text-left pr-2 ${isCurrent ? 'text-[#e2d7c5] font-normal' : 'text-white/60'}`}
                          >
                            {name}
                          </span>
                          <button 
                            onClick={() => scrollToId(targetId)}
                            className={`w-4 h-4 rounded-full border border-white/10 flex items-center justify-center text-[8px] transition-colors ${isCurrent ? 'bg-[#6b5b4b]/40 border-[#6b5b4b] text-[#e2d7c5]' : 'bg-transparent'}`}
                          >
                            {isCurrent ? <Check className="w-2 h-2 text-[#e2d7c5]" /> : ''}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 1. HERO HEADER */}
      <section className="relative h-[55vh] md:h-[75vh] w-full flex items-center justify-center overflow-hidden" id="guide-hero">
        <div className="absolute inset-0">
          <img 
            src={guide.heroImg} 
            alt={guide.title}
            className="w-full h-full object-cover opacity-35 scale-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] sm:text-xs font-sub font-semibold tracking-[0.25em] text-[#e2d7c5] uppercase block"
          >
            Smarter Coorg Exploration Guide
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-2xl sm:text-4xl md:text-5xl font-display font-light text-white tracking-wide leading-tight px-2"
          >
            {guide.title}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xs sm:text-base text-white/70 max-w-2xl mx-auto font-light leading-relaxed px-4"
          >
            {guide.subtitle}
          </motion.p>
        </div>

        {/* Floating background graphic element */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
      </section>

      {/* 2. AUTHENTIC LOCAL INTRO SECTION */}
      <section className="max-w-3xl mx-auto px-6 py-12 sm:py-20 space-y-6" id="guide-intro">
        <div className="flex items-center gap-3 text-xs text-[#e2d7c5] font-sub tracking-widest uppercase">
          <span className="w-6 h-[1px] bg-[#e2d7c5]/50" /> Written by Coorg Locals
        </div>
        
        <div className="prose prose-invert prose-stone space-y-5 text-sm sm:text-base text-white/80 leading-[1.7] font-light">
          {guide.introParagraphs.map((paragraph, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}
        </div>

        <div className="p-5 sm:p-6 bg-[#6b5b4b]/10 border border-[#6b5b4b]/20 rounded-2xl space-y-2 mt-6">
          <h3 className="text-sm font-sub font-semibold tracking-wider text-[#e2d7c5] uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#e2d7c5]" /> Smart Travel Strategy
          </h3>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
            {guide.localInsight}
          </p>
        </div>
      </section>

      <PremiumBookingCard 
        label="Durable Luxury base"
        title="Enjoy Spacious Luxury & Slower Commutes"
        description="Ditch the mountain bottle-necks. Stay in spacious comfort at Dreamy Vacations, Kushalnagar to enjoy deep swimming pools, rain dances, and cozy garden campfires."
        buttonText="View Our Premium Rooms"
        targetPath="/rooms"
      />

      {/* INTERACTIVE ROUTE TIMELINE */}
      <section className="max-w-3xl mx-auto px-6 py-8 border-t border-white/5" id="guide-route-map">
        <div className="space-y-4">
          <h3 className="text-sm font-sub font-semibold tracking-widest text-[#e2d7c5] uppercase text-center sm:text-left">
            Interactive Journey Route
          </h3>
          <p className="text-xs text-white/50 leading-relaxed font-light text-center sm:text-left">
            Explore the recommended sequence of your trip. Click any destination stop below to jump straight to its location specs.
          </p>
          
          <div className={`grid grid-cols-1 ${guide.timeline.length === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2'} gap-6 pt-4`}>
            {guide.timeline.map((dayPlan, dayIdx) => (
              <div key={dayIdx} className="bg-[#121212] border border-white/5 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#e2d7c5]">
                  {dayPlan.day.split(':')[0]}: {dayPlan.day.split(':').slice(1).join(':').trim() || dayPlan.title}
                </span>
                <div className="flex flex-col gap-1.5 text-xs font-light text-white/80 pl-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white/30" />
                    <span>Dreamy Vacations (Base)</span>
                  </div>
                  {dayPlan.activities.map((act, actIdx) => {
                    const attId = getAttractionIdSafe(act.title);
                    if (attId) {
                      return (
                        <div key={actIdx} className="contents">
                          <div className="text-white/30 pl-3">↓</div>
                          <button 
                            onClick={() => scrollToId(attId)}
                            className="flex items-center gap-2 text-left hover:text-[#e2d7c5] transition-colors group cursor-pointer animate-fade-in"
                          >
                            <span className="w-2 h-2 rounded-full bg-[#6b5b4b]" />
                            <span className="underline decoration-white/20 group-hover:decoration-[#e2d7c5]">{act.title}</span>
                          </button>
                        </div>
                      );
                    } else {
                      return (
                        <div key={actIdx} className="contents">
                          <div className="text-white/30 pl-3">↓</div>
                          <div className="flex items-center gap-2 text-white/60">
                            <span className="w-2 h-2 rounded-full bg-[#6b5b4b]/40" />
                            <span>{act.title}</span>
                          </div>
                        </div>
                      );
                    }
                  })}
                  <div className="text-white/30 pl-3">↓</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white/30" />
                    <span>Return to Resort</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PremiumBookingCard 
        label="Strategic Location"
        title="A Central Hub for Your Whole Family"
        description="Stay in one beautiful villa rather than changing hotels. Enjoy 12-minute access to the Golden Temple, 15 minutes to Nisargadhama, and 20 minutes to Dubare Elephants."
        buttonText="Check Availability"
        targetPath="/booking"
      />
      <section className="bg-[#0a0a0a] border-y border-white/5 py-12 sm:py-20" id="guide-itinerary">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center space-y-2 mb-10">
            <span className="text-[10px] font-sub font-semibold tracking-[0.2em] text-[#e2d7c5] uppercase block">
              Step-by-Step Blueprint
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-light text-white tracking-wide">
              The Recommended Timeline
            </h2>
            <p className="text-xs sm:text-sm text-white/50 max-w-md mx-auto font-light">
              Factual, hour-by-hour outline of how we recommend spacing out your Coorg holiday.
            </p>
          </div>

          <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-4 sm:before:left-1/2 before:w-[1px] before:bg-white/10">
            {guide.timeline.map((dayPlan, dIdx) => (
              <div key={dIdx} className="space-y-6">
                {/* Day Header badge */}
                <div className="flex sm:justify-center relative z-10">
                  <span className="bg-[#121212] border border-[#6b5b4b]/40 text-[#e2d7c5] font-sub font-semibold text-[11px] tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md">
                    {dayPlan.day}
                  </span>
                </div>

                <div className="space-y-6">
                  {[...dayPlan.activities].sort((a, b) => a.order - b.order).map((act, aIdx) => {
                    const isEven = aIdx % 2 === 0;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.5 }}
                        key={aIdx} 
                        className={`flex flex-col sm:flex-row gap-4 relative ${
                          isEven ? 'sm:flex-row-reverse' : ''
                        }`}
                      >
                        {/* Dot Indicator */}
                        <div className="absolute left-4 sm:left-1/2 top-4 w-2.5 h-2.5 rounded-full bg-[#e2d7c5] -translate-x-[5px] sm:-translate-x-[5px] z-10 shadow-[0_0_8px_#e2d7c5]" />

                        {/* Left/Right content block */}
                        <div className="w-full sm:w-1/2 pl-10 sm:pl-0 sm:px-6">
                          <div className={`p-5 rounded-xl bg-[#121212] border border-white/5 hover:border-[#6b5b4b]/30 transition-all duration-300 ${
                            isEven ? 'sm:text-right' : 'sm:text-left'
                          }`}>
                            <div className={`flex items-center gap-2 mb-2 text-xs font-mono text-[#e2d7c5] ${
                              isEven ? 'sm:justify-end' : 'justify-start'
                            }`}>
                              <span className="inline-flex items-center justify-center">{getIconComponent(act.icon)}</span>
                              <span>{act.time}</span>
                            </div>
                            <h4 className="text-sm sm:text-base font-display font-medium text-white mb-1.5 tracking-wide">
                              {act.title}
                            </h4>
                            <p className="text-xs text-white/60 leading-relaxed font-light">
                              {act.desc}
                            </p>
                          </div>
                        </div>

                        {/* Empty placeholder spacer on big screens */}
                        <div className="hidden sm:block w-1/2" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PremiumBookingCard 
        label="Group & Family Comfort"
        title="Plan Your Custom Group Getaway"
        description="From active corporate retreats to multi-generational family reunions, our Kushalnagar base offers flat, highly accessible luxury layouts with custom villa stays."
        buttonText="Inquire Group Bookings"
        targetPath="/group-booking"
      />
      <section className="max-w-5xl mx-auto px-6 py-12 sm:py-20" id="guide-attractions">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] font-sub font-semibold tracking-[0.2em] text-[#e2d7c5] uppercase block">
            Detailed Destinations
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-light text-white tracking-wide">
            Attraction Spotlights
          </h2>
          <p className="text-xs sm:text-sm text-white/50 max-w-md mx-auto font-light">
            Plan your visit with exact distance metrics, local travel times, and expert travel tips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {ATTRACTIONS.map((att, idx) => {
            const idSafe = `attraction-${att.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            return (
              <div key={idx} className="flex flex-col space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6 }}
                  id={idSafe}
                  className="bg-[#121212] border border-white/5 rounded-[24px] overflow-hidden hover:border-[#6b5b4b]/20 transition-all duration-300 flex flex-col group h-full relative"
                >
                  {/* Distance badge (top right, above the image) */}
                  <span className="absolute top-4 right-4 z-20 bg-black/75 backdrop-blur-md text-[#e2d7c5] px-3.5 py-1.5 rounded-full text-[10px] font-mono font-medium tracking-wide border border-white/10 shadow-lg">
                    {att.timeAway}
                  </span>

                  {/* Immersive landscape photo with subtle zoom hover */}
                  <div className="h-48 sm:h-56 w-full overflow-hidden relative">
                    <img 
                      src={att.img} 
                      alt={att.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-80"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent" />
                  </div>

                  <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-display font-medium text-white tracking-wide leading-snug">
                          {att.name}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-white/50 font-light font-mono">
                          {att.distance}
                        </p>
                      </div>

                      {/* Rating indicator */}
                      <div className="inline-flex items-center gap-1.5 bg-[#6b5b4b]/15 text-[#e2d7c5] px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-medium uppercase tracking-wide">
                        <Star className="w-3 h-3 fill-[#e2d7c5] text-[#e2d7c5]" /> {att.rating}
                      </div>
                      
                      <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                        {att.description}
                      </p>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-y-1.5 text-xs text-white/50 border-t border-white/5 pt-3 font-light">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-white/30 block mb-0.5">Best Hours</span>
                          <span className="text-white/80 font-medium">{att.bestHours}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-white/30 block mb-0.5">Travel Duration</span>
                          <span className="text-white/80 font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#e2d7c5]" /> {att.time}
                          </span>
                        </div>
                      </div>

                      {/* Nearby Places Section */}
                      <div className="space-y-1.5 pt-2 border-t border-white/5">
                        <span className="text-[9px] text-white/40 font-sub tracking-wider uppercase block">Nearby Highlights</span>
                        <ul className="flex flex-wrap gap-x-3.5 gap-y-1 text-xs text-white/70 font-light">
                          {att.nearby.map((n, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="inline-block w-1 h-1 rounded-full bg-[#e2d7c5]" />
                              {n}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Factual external travel link */}
                    <div className="pt-2">
                      <a
                        href={att.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-sub font-semibold tracking-wider text-[#e2d7c5] hover:text-white uppercase transition-all hover:bg-white/10"
                        id={`btn-navigate-${idx}`}
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#e2d7c5]" /> Open Maps / Navigate
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Travel Tip Luxury Card (Below attraction card) */}
                <div className="bg-[#e2d7c5]/5 border border-[#e2d7c5]/10 rounded-[20px] p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-sub font-semibold tracking-wider text-[#e2d7c5] uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-[#e2d7c5]" /> Expert Travel Tip
                  </div>
                  <p className="text-xs text-white/85 font-light leading-relaxed">
                    {att.travelTip}
                  </p>
                </div>

                {/* Section Divider between attraction cards */}
                {idx < ATTRACTIONS.length - 1 && (
                  <div className="flex items-center justify-center gap-4 py-8 text-[#e2d7c5]/20">
                    <div className="h-[1px] w-12 bg-[#e2d7c5]/10" />
                    <span className="text-[9px] font-sub uppercase tracking-[0.3em] font-medium text-[#e2d7c5]/40">
                      Continue Your Journey
                    </span>
                    <div className="h-[1px] w-12 bg-[#e2d7c5]/10" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <PremiumBookingCard 
        label="Durable Poolside Comfort"
        title="Your Perfect Coorg Base Awaits"
        description="Spend your days exploring pristine reservoirs and misty peaks, and your afternoons relaxing by our luxury outdoor swimming pool with your family."
        buttonText="Book Your Experience"
        targetPath="/booking"
      />
      <section className="bg-[#0a0a0a] border-y border-white/5 py-12 sm:py-20" id="guide-comparison">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center space-y-2 mb-10">
            <span className="text-[10px] font-sub font-semibold tracking-[0.2em] text-[#e2d7c5] uppercase block">
              Strategic Planning
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-light text-white tracking-wide">
              Where to Stay First: Factual Comparison
            </h2>
            <p className="text-xs sm:text-sm text-white/50 max-w-md mx-auto font-light">
              Why many travelers now prefer Kushalnagar as their initial stay over rushing straight up to Madikeri.
            </p>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-[24px] border border-white/5 bg-[#121212] shadow-2xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#181818] text-[#e2d7c5] font-sub uppercase tracking-wider text-[10px] sm:text-xs border-b border-white/5">
                <tr>
                  <th className="px-6 py-4.5 font-semibold">Consideration</th>
                  <th className="px-6 py-4.5 font-semibold text-[#e2d7c5]">Staying in Kushalnagar (Dreamy Base)</th>
                  <th className="px-6 py-4.5 font-semibold text-white/50">Staying in Madikeri (Hill Base)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/70 font-light">
                <tr>
                  <td className="px-6 py-4 font-medium text-white">Golden Temple Access</td>
                  <td className="px-6 py-4 text-[#e2d7c5] font-semibold">✓ Under 15-minute drive</td>
                  <td className="px-6 py-4">✗ Long 1-hour drive through narrow hills</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-white">Traffic Congestion</td>
                  <td className="px-6 py-4 text-[#e2d7c5] font-semibold">✓ Minimal traffic, flat terrain</td>
                  <td className="px-6 py-4">✗ Heavy traffic, narrow roads, difficult parking</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-white">Starting Location</td>
                  <td className="px-6 py-4 text-[#e2d7c5] font-semibold">✓ Perfect highway starting point</td>
                  <td className="px-6 py-4">✗ Requires extra 40 km steep hill driving</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-white">Dubare Camp Proximity</td>
                  <td className="px-6 py-4 text-[#e2d7c5] font-semibold">✓ Easy, direct access (20 mins)</td>
                  <td className="px-6 py-4">✗ Requires winding hills backtracking</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Comparison Cards View */}
          <div className="block md:hidden space-y-4">
            <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-[#e2d7c5] uppercase border-b border-white/5 pb-2">
                Golden Temple Access
              </h3>
              <div className="space-y-2 text-xs font-light">
                <div className="flex gap-2 items-start text-white/90">
                  <span className="text-[#e2d7c5] font-bold">✓</span>
                  <div>
                    <span className="font-medium">Kushalnagar Stay:</span> Under 15 minutes away
                  </div>
                </div>
                <div className="flex gap-2 items-start text-white/50 border-t border-white/5 pt-2">
                  <span className="text-white/30 font-bold">✗</span>
                  <div>
                    <span className="font-light">Madikeri Stay:</span> About 1 hour of narrow hill driving
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-[#e2d7c5] uppercase border-b border-white/5 pb-2">
                Road Traffic & Congestion
              </h3>
              <div className="space-y-2 text-xs font-light">
                <div className="flex gap-2 items-start text-white/90">
                  <span className="text-[#e2d7c5] font-bold">✓</span>
                  <div>
                    <span className="font-medium">Kushalnagar Stay:</span> Minimal traffic, flat terrain parking
                  </div>
                </div>
                <div className="flex gap-2 items-start text-white/50 border-t border-white/5 pt-2">
                  <span className="text-white/30 font-bold">✗</span>
                  <div>
                    <span className="font-light">Madikeri Stay:</span> Heavy gridlocks, tight parking spaces
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-[#e2d7c5] uppercase border-b border-white/5 pb-2">
                Starting Location Access
              </h3>
              <div className="space-y-2 text-xs font-light">
                <div className="flex gap-2 items-start text-white/90">
                  <span className="text-[#e2d7c5] font-bold">✓</span>
                  <div>
                    <span className="font-medium">Kushalnagar Stay:</span> Convenient point right off highway
                  </div>
                </div>
                <div className="flex gap-2 items-start text-white/50 border-t border-white/5 pt-2">
                  <span className="text-white/30 font-bold">✗</span>
                  <div>
                    <span className="font-light">Madikeri Stay:</span> Requires steep driving after long transit
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-[#e2d7c5] uppercase border-b border-white/5 pb-2">
                Dubare Camp Proximity
              </h3>
              <div className="space-y-2 text-xs font-light">
                <div className="flex gap-2 items-start text-white/90">
                  <span className="text-[#e2d7c5] font-bold">✓</span>
                  <div>
                    <span className="font-medium">Kushalnagar Stay:</span> Easy 20-minute direct driveway
                  </div>
                </div>
                <div className="flex gap-2 items-start text-white/50 border-t border-white/5 pt-2">
                  <span className="text-white/30 font-bold">✗</span>
                  <div>
                    <span className="font-light">Madikeri Stay:</span> Constant backtracking along hill slopes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RECOMMENDED STAY PLAN */}
      <section className="max-w-2xl mx-auto px-6 py-12 sm:py-20 text-center space-y-6" id="guide-plan">
        <div className="inline-flex items-center gap-1 text-[11px] font-sub font-semibold tracking-widest text-[#e2d7c5] uppercase bg-[#121212] border border-[#6b5b4b]/30 px-4 py-1.5 rounded-full">
          <Star className="w-3.5 h-3.5 fill-[#e2d7c5] text-[#e2d7c5]" /> Recommended Stay Plan
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-5 bg-[#121212] border border-white/5 rounded-2xl space-y-1 relative">
            <span className="absolute top-4 right-4 text-xs font-mono text-[#e2d7c5]">Step 1</span>
            <h4 className="font-display font-medium text-white text-sm tracking-wide">Stay in Kushalnagar</h4>
            <p className="text-xs text-white/50 leading-relaxed font-light">Establish your base early and explore eastern Coorg’s pristine rivers and monasteries comfortably.</p>
          </div>

          <div className="p-5 bg-[#121212] border border-white/5 rounded-2xl space-y-1 relative">
            <span className="absolute top-4 right-4 text-xs font-mono text-[#e2d7c5]">Step 2</span>
            <h4 className="font-display font-medium text-white text-sm tracking-wide">Drive to Madikeri</h4>
            <p className="text-xs text-white/50 leading-relaxed font-light">Take a scenic morning drive up into the western ghats to view waterfalls and historic viewpoints.</p>
          </div>

          <div className="p-5 bg-[#121212] border border-[#6b5b4b]/20 rounded-2xl space-y-1 relative">
            <span className="absolute top-4 right-4 text-xs font-mono text-[#e2d7c5]">Step 3</span>
            <h4 className="font-display font-medium text-[#e2d7c5] text-sm tracking-wide">Return Backwards</h4>
            <p className="text-xs text-white/50 leading-relaxed font-light">Drive back easily to the plain roads without taking heavy, tiring mountain routes twice.</p>
          </div>
        </div>
      </section>

      <PremiumBookingCard 
        label="Durable Transit Choice"
        title="Make the Smarter Base Choice"
        description="Bypassing Madikeri's heavy traffic gridlocks ensures a peaceful, restorative Coorg getaway. Secure your stay at Dreamy Vacations in Kushalnagar today."
        buttonText="Reserve Your Villa"
        targetPath="/booking"
      />

      {/* EXPERT ACCORDION FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-6 py-12 border-t border-white/5" id="guide-faq">
        <div className="text-center sm:text-left space-y-2 mb-8">
          <span className="text-[10px] font-sub font-semibold tracking-[0.2em] text-[#e2d7c5] uppercase block">
            Coorg Exploration Advice
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-light text-white">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-white/50 font-light">
            Read our verified answers to the most common queries regarding Coorg, Kushalnagar, and local itineraries.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, fIdx) => {
            const isOpen = openFaqIdx === fIdx;
            return (
              <div 
                key={fIdx} 
                className="border border-white/5 bg-[#121212]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : fIdx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                  id={`btn-faq-toggle-${fIdx}`}
                >
                  <span className="text-xs sm:text-sm font-medium text-white/90 tracking-wide pr-2">
                    {faq.q}
                  </span>
                  <HelpCircle className={`w-4 h-4 shrink-0 text-[#e2d7c5] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-white/60 font-light leading-relaxed border-t border-white/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. RELATED ARTICLES */}
      <section className="max-w-3xl mx-auto px-6 py-12 border-t border-white/5" id="guide-related">
        <h4 className="text-xs font-sub font-semibold tracking-[0.2em] text-[#e2d7c5] uppercase mb-6 text-center sm:text-left">
          Related Articles
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RELATED_ARTICLES.map((article, index) => (
            <Link
              key={index}
              to={article.path}
              className="p-4 bg-[#121212] border border-white/5 hover:border-[#e2d7c5]/30 rounded-xl flex items-center justify-between text-xs sm:text-sm text-white/70 hover:text-white transition-all duration-300 group"
              id={`link-related-${index}`}
            >
              <span className="font-light tracking-wide">{article.name}</span>
              <ChevronRight className="w-4 h-4 text-[#e2d7c5]/60 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
