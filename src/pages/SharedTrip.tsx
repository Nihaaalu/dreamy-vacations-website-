import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Calendar, Clock, Users, ShieldCheck, Compass, Share2, 
  MapPin, Printer, ArrowRight, Sparkles, CheckCircle2, ChevronLeft, HelpCircle 
} from 'lucide-react';
import { decodeTrip, generateItinerary } from '../lib/tripHelper';

export default function SharedTrip() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const params = id ? decodeTrip(id) : null;
  const itinerary = params ? generateItinerary(params) : null;

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Shared Coorg Itinerary',
        text: 'Custom Coorg itinerary mapped for our family trip.',
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert('Shared trip link copied to clipboard!');
    }
  };

  const handleWhatsAppShare = () => {
    const url = window.location.href;
    const text = encodeURIComponent(`Take a look at our Coorg trip itinerary! Planned beautifully via Dreamy Vacations: ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (!params || !itinerary || !id) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] font-sans text-white/90 flex flex-col items-center justify-center p-6 text-center space-y-6" id="shared-trip-error-state">
        <Compass className="w-12 h-12 text-[#e2d7c5] animate-spin" />
        <h1 className="text-2xl font-display font-light text-white">
          Itinerary Not Found
        </h1>
        <p className="text-sm text-white/50 max-w-md mx-auto">
          This itinerary code might be expired, formatted incorrectly, or corrupted. Generate your own custom Coorg trip planner in just 10 seconds!
        </p>
        <Link
          to="/trip-planner"
          className="px-6 py-3 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-xs font-mono uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          id="btn-goto-planner"
        >
          Go to Trip Planner
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] font-sans text-white/90 pb-24 pt-28" id="shared-trip-root">
      
      {/* Back to Planner button */}
      <div className="max-w-4xl mx-auto px-6 mb-8 flex items-center justify-between">
        <Link
          to="/trip-planner"
          className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-[#e2d7c5] transition-colors"
          id="btn-back-to-planner"
        >
          <ChevronLeft className="w-4 h-4" /> Create Your Own Trip
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-wider text-white/30 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
          Shared Trip Code: #{id}
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-6 space-y-10">
        
        {/* Title / Header summary */}
        <div className="space-y-4 text-center sm:text-left">
          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#e2d7c5] font-semibold block">
            Coorg Custom Travel Itinerary
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-white tracking-tight leading-tight">
            Coorg Getaway Planner
          </h1>
          <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-light">
            Custom-tailored for <strong className="text-white font-medium">{params.adults} Adults</strong> and <strong className="text-white font-medium">{params.children} Children</strong>, spanning <strong className="text-[#e2d7c5] font-medium">{params.arrivalDate}</strong> to <strong className="text-[#e2d7c5] font-medium">{params.departureDate}</strong>.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#e2d7c5]">
              Quick Actions
            </span>
            <p className="text-xs text-white/50 font-light">Share with family, open in maps, or print a hard copy.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="px-4 py-2.5 bg-[#25d366]/20 hover:bg-[#25d366]/30 text-[#25d366] text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              id="btn-whatsapp-share-shared"
            >
              <Share2 className="w-3.5 h-3.5" /> WhatsApp Share
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 text-xs font-semibold rounded-xl border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
              id="btn-link-share-shared"
            >
              <Share2 className="w-3.5 h-3.5" /> Share Link
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              id="btn-print-shared"
            >
              <Printer className="w-3.5 h-3.5" /> Print PDF
            </button>
          </div>
        </div>

        {/* Resort Base Wording */}
        <div className="bg-[#121212] border border-[#6b5b4b]/30 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#e2d7c5]">
              Coorg Base Resort
            </span>
            {params.staying ? (
              <>
                <h3 className="text-base font-display font-medium text-white flex items-center justify-center md:justify-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Staying at Dreamy Vacations, Kushalnagar
                </h3>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  Excellent choice. Basing in Kushalnagar ensures flat highway driving, instant access to Dubare Elephant Camp and Golden Temple, plus cozy family pool retreats in the evening.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-base font-display font-medium text-white">
                  Enhance this plan at Dreamy Vacations Kushalnagar
                </h3>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  Stay comfortably at our premium gateway resort! Enjoy a massive outdoor swimming pool, high-tech rain dance, campfires, and spacious double deluxe cottages.
                </p>
              </>
            )}
          </div>
          <Link
            to="/rooms"
            className="px-6 py-3 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-[11px] font-semibold uppercase tracking-wider rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
            id="btn-explore-rooms-shared"
          >
            Explore Rooms <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Itinerary Timeline */}
        <div className="space-y-12">
          {itinerary.map((day, idx) => (
            <div key={idx} className="space-y-6" id={`shared-day-${day.dayNum}`}>
              
              {/* Day Header */}
              <div className="flex items-center gap-4 border-b border-white/5 pb-3">
                <span className="w-10 h-10 bg-[#e2d7c5]/10 border border-[#e2d7c5]/20 rounded-full flex items-center justify-center text-xs font-mono font-bold text-[#e2d7c5]">
                  {day.dayNum}
                </span>
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-white/40 block">Day {day.dayNum} Outline</span>
                  <h3 className="text-lg font-display font-light text-white">{day.dayName}</h3>
                </div>
              </div>

              {/* Day Activities */}
              <div className="relative border-l border-white/10 pl-6 ml-5 space-y-8">
                {day.activities.map((act, actIdx) => (
                  <div key={actIdx} className="relative group" id={`shared-activity-${actIdx}`}>
                    
                    {/* Circle marker */}
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 bg-[#6b5b4b] group-hover:bg-[#e2d7c5] rounded-full transition-colors border border-[#0d0d0d]" />

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-mono text-[#e2d7c5] font-semibold">
                          {act.time}
                        </span>
                        <a
                          href={act.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-mono text-white/40 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <MapPin className="w-3 h-3 text-white/30" /> Open in Google Maps
                        </a>
                      </div>
                      
                      <h4 className="text-sm sm:text-base font-display font-light text-white group-hover:text-[#e2d7c5] transition-colors leading-tight">
                        {act.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-light">
                        {act.desc}
                      </p>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
