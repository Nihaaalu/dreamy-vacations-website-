import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Coffee, Trees, Waves, Users, Gamepad2, Sparkles, Clock, Compass, Car } from 'lucide-react';

const routes = [
  {
    id: 1,
    name: "Kushalnagar Explorer",
    duration: "Full-Day Scenic Route",
    description: "Discover the highlights surrounding Dreamy Vacations on a thoughtfully planned full-day journey, combining cultural landmarks, wildlife experiences, scenic reservoirs, and nature retreats—all within a comfortable driving route.",
    includes: [
      "Harangi Dam",
      "Namdroling Monastery (Golden Temple)",
      "Kaveri Nisargadhama",
      "Dubare Elephant Camp",
      "Chiklihole Reservoir"
    ],
    plan: {
      label: "Ideal Plan",
      value: "Begin after breakfast and comfortably return by evening."
    },
    icon: Compass
  },
  {
    id: 2,
    name: "Madikeri Scenic Drive",
    duration: "Approx. Full-Day Tour",
    description: "Journey through Coorg's beautiful highlands and mist-covered lookouts, taking you from stunning waterfalls to panoramic mountaintops.",
    includes: [
      "Raja's Seat",
      "Abbey Falls",
      "Mandalpatti Peak"
    ],
    extension: "Continue onward to Bhagamandala and Talacauvery if you wish to experience Coorg's scenic highlands and spiritual landmarks during the same journey.",
    icon: Car
  }
];


export default function About() {
  const [hoveredRoute, setHoveredRoute] = useState<number | null>(null);
  const chooseUsItems = [
    {
      icon: Coffee,
      title: 'Freshly Prepared Cuisine',
      desc: 'Enjoy freshly prepared vegetarian and non-vegetarian meals made with quality ingredients, thoughtfully served to provide a comfortable dining experience for every guest.'
    },
    {
      icon: Trees,
      title: 'Peaceful Environment',
      desc: 'Nestled in a serene village setting in Kushalnagar, away from high-density commercial noise.'
    },
    {
      icon: Waves,
      title: 'Swimming Pool',
      desc: 'An expansive outdoor swimming pool and active rain dance setup for safe family recreation.'
    },
    {
      icon: MapPin,
      title: 'Prime Location',
      desc: 'Convenient travel proximity to the Golden Temple, Kaveri Nisargadhama, and Dubare Elephant Camp.'
    },
    {
      icon: Users,
      title: 'Family Friendly',
      desc: 'A safe, peaceful resort environment thoughtfully designed for multi-generational comfort.'
    },
    {
      icon: Gamepad2,
      title: 'Indoor Activities',
      desc: 'Spacious common areas and recreational options to keep everyone entertained during leisure hours.'
    }
  ];

  return (
    <div className="w-full bg-[#0d0d0d] text-white font-sans min-h-screen" id="about-page-container">
      
      {/* 1. DEDICATED EDITORIAL HERO SECTION */}
      <header 
        className="w-full"
        style={{ 
          paddingTop: '160px', 
          paddingBottom: '70px',
          borderBottom: '1px solid rgba(255,255,255,0.06)' 
        }}
      >
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-4">
          <span 
            className="uppercase font-sub block" 
            style={{
              letterSpacing: '0.20em',
              fontSize: '12px',
              opacity: 0.7,
              color: '#e2d7c5',
              fontWeight: 600
            }}
          >
            OUR STORY
          </span>
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-white tracking-tight"
            style={{ lineHeight: '1.1' }}
          >
            Where Comfort Meets Hospitality
          </h1>
          <p 
            className="text-sm md:text-base text-white/70 font-light max-w-2xl mx-auto" 
            style={{ lineHeight: '1.8' }}
          >
            Nestled in Kushalnagar, Dreamy Vacations offers thoughtfully designed accommodations, family experiences, and memorable stays in Coorg.
          </p>
        </div>
      </header>

      {/* 2. THE STORY SECTION */}
      <section 
        className="w-full"
        style={{
          paddingTop: '80px',
          paddingBottom: '80px'
        }}
      >
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Heading */}
          <div className="text-center" style={{ marginBottom: '32px' }}>
            <span 
              className="uppercase font-sub block mb-2" 
              style={{
                letterSpacing: '0.20em',
                fontSize: '12px',
                opacity: 0.7,
                color: '#e2d7c5',
                fontWeight: 600
              }}
            >
              ABOUT DREAMY VACATIONS
            </span>
            <h2 
              className="text-2xl sm:text-3xl font-display font-light text-white tracking-tight"
              style={{ lineHeight: '1.1' }}
            >
              Our Heritage & Philosophy
            </h2>
          </div>

          {/* Editorial Paragraphs (Max 2-3 sentences per paragraph, left aligned, max-width 650px) */}
          <div className="space-y-6">
            <p 
              className="text-sm md:text-base text-white/70 font-light"
              style={{
                textAlign: 'left',
                maxWidth: '650px',
                margin: '0 auto 24px auto',
                lineHeight: '1.8'
              }}
            >
              Dreamy Vacations is located in Kushalnagar, Coorg, Karnataka. We provide comfortable accommodation options for families, groups, and travelers looking for a convenient stay experience with essential amenities and recreational facilities.
            </p>

            <p 
              className="text-sm md:text-base text-white/70 font-light"
              style={{
                textAlign: 'left',
                maxWidth: '650px',
                margin: '0 auto 24px auto',
                lineHeight: '1.8'
              }}
            >
              Set in the serene village of Chikkathur near Kushalnagar, our property is structured specifically to accommodate those seeking a peaceful rest away from high-density commercial hubs. We offer a perfect balance of tranquility and accessibility, remaining within close driving distance of Coorg's most popular travel sights.
            </p>

            <p 
              className="text-sm md:text-base text-white/70 font-light"
              style={{
                textAlign: 'left',
                maxWidth: '650px',
                margin: '0 auto 24px auto',
                lineHeight: '1.8'
              }}
            >
              Our facilities are thoughtfully designed for families, couples, and groups, featuring an expansive outdoor swimming pool, rain dance area, spacious family accommodations, and comfortable recreational spaces. We are committed to maintaining high standards of cleanliness, attentive service, and a peaceful atmosphere to ensure a relaxing and memorable stay.
            </p>
          </div>

        </div>
      </section>

      {/* 3. NEARBY ATTRACTIONS (Scenic Travel Circuits) */}
      <section 
        className="w-full bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden"
        style={{
          paddingTop: '90px',
          paddingBottom: '90px',
        }}
        id="nearby-attractions-section"
      >
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span 
              className="uppercase font-sub block mb-3 text-[11px] text-[#e2d7c5] tracking-[0.25em] font-light opacity-80"
            >
              EXPLORE THE SURROUNDINGS
            </span>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-white tracking-tight mb-4 leading-tight"
            >
              Perfectly Positioned<br />
              <span className="text-[#e2d7c5]">Near Coorg's Best Attractions</span>
            </h2>
            <p className="text-sm md:text-base text-white/50 font-light leading-relaxed">
              Stay in a peaceful location while remaining within easy driving distance of Coorg's most celebrated destinations.
            </p>
          </div>

          {/* Centralized Resort Hub Marker */}
          <div className="flex flex-col items-center mb-16 relative z-20">
            <div className="relative">
              {/* Outer pulsing ring */}
              <div className="absolute -inset-4 bg-[#8a7460]/20 rounded-full blur-lg animate-pulse" />
              <div className="absolute -inset-1 bg-[#8a7460]/30 rounded-full animate-ping duration-1000" />
              <div className="w-14 h-14 rounded-full bg-[#0a0a0a] border-2 border-[#8A7460] flex items-center justify-center relative z-10 shadow-2xl text-[#e2d7c5]">
                <MapPin className="w-6 h-6 stroke-[1.75]" />
              </div>
            </div>
            <h3 className="mt-4 text-base font-display font-medium text-white tracking-wide">Dreamy Vacations</h3>
            <span className="text-[10px] uppercase font-sub tracking-[0.2em] text-[#8a7460] mt-1 font-semibold">Our Resort (Kushalnagar)</span>
          </div>

          {/* Desktop Curated Routes Grid Container */}
          <div className="relative max-w-5xl mx-auto mt-24 hidden md:grid grid-cols-2 gap-16 items-stretch">
            
            {/* Absolute Overhead branching lines */}
            {/* Central vertical trunk line from resort hub marker down to the horizontal branch */}
            <motion.div 
              className="absolute left-1/2 -translate-x-1/2 top-[-76px] w-[1px] z-0"
              style={{ originY: 0 }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              animate={{ 
                height: "124px",
                backgroundColor: (hoveredRoute === 1 || hoveredRoute === 2) ? "#8a7460" : "rgba(138, 116, 96, 0.3)" 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Left horizontal branching arm */}
            <motion.div 
              className="absolute right-1/2 left-[25%] top-[48px] h-[1px] z-0 origin-right"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              animate={{ 
                scaleX: 1,
                backgroundColor: hoveredRoute === 1 ? "#8a7460" : "rgba(138, 116, 96, 0.2)",
                height: hoveredRoute === 1 ? "2px" : "1px"
              }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />

            {/* Left downward dropping vertical arm */}
            <motion.div 
              className="absolute left-[25%] top-[48px] w-[1px] z-0 origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              animate={{ 
                height: "48px",
                backgroundColor: hoveredRoute === 1 ? "#8a7460" : "rgba(138, 116, 96, 0.2)",
                width: hoveredRoute === 1 ? "2px" : "1px"
              }}
              transition={{ duration: 0.4, delay: 0.6 }}
            />

            {/* Right horizontal branching arm */}
            <motion.div 
              className="absolute left-1/2 right-[25%] top-[48px] h-[1px] z-0 origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              animate={{ 
                scaleX: 1,
                backgroundColor: hoveredRoute === 2 ? "#8a7460" : "rgba(138, 116, 96, 0.2)",
                height: hoveredRoute === 2 ? "2px" : "1px"
              }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />

            {/* Right downward dropping vertical arm */}
            <motion.div 
              className="absolute right-[25%] top-[48px] w-[1px] z-0 origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              animate={{ 
                height: "48px",
                backgroundColor: hoveredRoute === 2 ? "#8a7460" : "rgba(138, 116, 96, 0.2)",
                width: hoveredRoute === 2 ? "2px" : "1px"
              }}
              transition={{ duration: 0.4, delay: 0.6 }}
            />

            {routes.map((route, idx) => {
              const RouteIcon = route.icon;
              return (
                <motion.div
                  key={idx}
                  className="w-full relative z-10 pt-12"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.25, ease: "easeOut" }}
                  onMouseEnter={() => setHoveredRoute(route.id)}
                  onMouseLeave={() => setHoveredRoute(null)}
                >
                  <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md p-8 rounded-2xl transition-all duration-300 hover:bg-white/[0.04] hover:border-[#8a7460]/30 hover:-translate-y-1.5 shadow-xl text-left h-full flex flex-col justify-between cursor-default group">
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#8a7460]/10 border border-[#8a7460]/20 flex items-center justify-center text-[#e2d7c5] group-hover:bg-[#8a7460]/20 group-hover:text-white transition-all duration-300">
                          <RouteIcon className="w-6 h-6 stroke-[1.5]" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-sub tracking-widest text-[#8a7460] font-semibold block">
                            {route.duration}
                          </span>
                          <h4 className="text-xl font-display font-light text-white leading-snug mt-0.5">
                            {route.name}
                          </h4>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-white/60 font-light leading-relaxed mb-6">
                        {route.description}
                      </p>

                      {/* Included Attractions Section */}
                      <div className="border-t border-white/5 pt-5">
                        <span className="text-[10px] uppercase font-sub tracking-wider text-white/40 block mb-4 font-semibold">
                          Attractions Included
                        </span>
                        <div className="space-y-3">
                          {route.includes.map((attraction, aIdx) => (
                            <div key={aIdx} className="flex items-start gap-3 text-xs text-white/80 group/item">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8a7460] mt-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200" />
                              <span className="font-light">{attraction}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {route.plan && (
                        <div className="mt-5 pt-4 border-t border-white/5">
                          <span className="text-[10px] uppercase font-sub tracking-wider text-[#8a7460] block mb-1.5 font-semibold">
                            {route.plan.label}
                          </span>
                          <p className="text-xs text-white/65 font-light leading-relaxed">
                            {route.plan.value}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Optional Extension Note for Route 2 */}
                    {route.extension && (
                      <div className="mt-8 pt-5 border-t border-white/5 bg-[#8a7460]/5 rounded-xl p-4 border border-[#8a7460]/10">
                        <span className="text-[10px] uppercase font-sub tracking-widest text-[#e2d7c5] block mb-1 font-semibold">
                          Optional Extension
                        </span>
                        <p className="text-[11px] text-white/60 leading-relaxed font-light">
                          Continue onward to <strong className="text-white font-medium">Bhagamandala</strong> and <strong className="text-white font-medium">Talacauvery</strong> if you wish to experience Coorg's scenic highlands and spiritual landmarks during the same journey.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

          </div>

          {/* Mobile Layout - Vertical route cards list */}
          <div className="md:hidden relative z-10 space-y-12 pl-12 pr-4 mt-16">
            
            {/* Mobile Vertical line */}
            <motion.div 
              className="absolute left-6 top-0 bottom-[-24px] w-[1px] bg-gradient-to-b from-[#8a7460] via-[#8a7460]/50 to-transparent"
              style={{ originY: 0 }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {routes.map((route, idx) => {
              const RouteIcon = route.icon;
              return (
                <div key={idx} className="relative">
                  
                  {/* Connection Node */}
                  <motion.div 
                    className="absolute -left-[30px] w-3 h-3 rounded-full bg-[#0a0a0a] border border-[#8a7460] z-20 top-[26px] -translate-y-1/2 pointer-events-none"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ type: "spring", stiffness: 200, delay: idx * 0.15 }}
                  />

                  {/* Horizontal Connector Line */}
                  <motion.div 
                    className="absolute -left-[20px] top-[26px] -translate-y-1/2 h-[1px] bg-[#8a7460]/50 z-10 pointer-events-none"
                    style={{ width: "20px", originX: 0 }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.3, delay: idx * 0.15 + 0.05 }}
                  />

                  {/* Mobile Card Item */}
                  <motion.div
                    className="w-full"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.15 + 0.1 }}
                  >
                    <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-md p-6 rounded-2xl transition-all duration-300 hover:bg-white/[0.04] hover:border-[#8a7460]/30 shadow-md text-left flex flex-col">
                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#8a7460]/10 border border-[#8a7460]/20 flex items-center justify-center text-[#e2d7c5] flex-shrink-0">
                          <RouteIcon className="w-5 h-5 stroke-[1.5]" />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-sub tracking-widest text-[#8a7460] font-semibold block">
                            {route.duration}
                          </span>
                          <h4 className="text-base font-display font-light text-white leading-snug mt-0.5">
                            {route.name}
                          </h4>
                        </div>
                      </div>

                      <p className="text-xs text-white/60 font-light leading-relaxed mb-4">
                        {route.description}
                      </p>

                      <div className="space-y-2.5 border-t border-white/5 pt-4">
                        <span className="text-[9px] uppercase font-sub tracking-wider text-white/40 block mb-2 font-semibold">
                          Attractions Included
                        </span>
                        {route.includes.map((attraction, aIdx) => (
                          <div key={aIdx} className="flex items-center gap-2 text-xs text-white/70">
                            <span className="w-1 h-1 rounded-full bg-[#8a7460]/60 flex-shrink-0" />
                            <span className="font-light">{attraction}</span>
                          </div>
                        ))}
                      </div>

                      {route.plan && (
                        <div className="mt-4 pt-3.5 border-t border-white/5">
                          <span className="text-[9px] uppercase font-sub tracking-wider text-[#8a7460] block mb-1 font-semibold">
                            {route.plan.label}
                          </span>
                          <p className="text-xs text-white/65 font-light leading-relaxed">
                            {route.plan.value}
                          </p>
                        </div>
                      )}

                      {route.extension && (
                        <div className="mt-5 pt-4 border-t border-white/5 bg-[#8a7460]/5 rounded-xl p-3 border border-[#8a7460]/10">
                          <span className="text-[9px] uppercase font-sub tracking-widest text-[#e2d7c5] block mb-1 font-semibold">
                            Optional Extension
                          </span>
                          <p className="text-[10px] text-white/60 leading-relaxed font-light">
                            Continue onward to <strong className="text-white font-medium">Bhagamandala</strong> and <strong className="text-white font-medium">Talacauvery</strong> if you wish to experience Coorg's scenic highlands and spiritual landmarks during the same journey.
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>

                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* 3. WHY CHOOSE US SECTION (2-column luxury grid) */}
      <section 
        className="w-full"
        style={{
          paddingTop: '80px',
          paddingBottom: '80px',
          borderTop: '1px solid rgba(255,255,255,0.04)'
        }}
      >
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Heading */}
          <div className="text-center" style={{ marginBottom: '32px' }}>
            <span 
              className="uppercase font-sub block mb-2" 
              style={{
                letterSpacing: '0.20em',
                fontSize: '12px',
                opacity: 0.7,
                color: '#e2d7c5',
                fontWeight: 600
              }}
            >
              OUR VALUES
            </span>
            <h2 
              className="text-2xl sm:text-3xl font-display font-light text-white tracking-tight"
              style={{ lineHeight: '1.1' }}
            >
              Why Choose Us
            </h2>
          </div>

          {/* 2-Column Luxury Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-3xl mx-auto mt-12">
            {chooseUsItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="p-2 bg-transparent space-y-2"
                >
                  <div className="feature-item flex items-center gap-[14px]">
                    <div className="feature-icon w-5 h-5 flex-shrink-0 flex items-center justify-center relative" style={{ top: '-0.5px' }}>
                      <Icon className="text-[#e2d7c5]" style={{ width: '20px', height: '20px' }} />
                    </div>
                    <h3 className="feature-title text-[#e2d7c5] text-sm font-semibold m-0" style={{ fontWeight: 600, margin: 0, lineHeight: '1.2' }}>
                      {item.title}
                    </h3>
                  </div>
                  <div style={{ paddingLeft: '34px' }}>
                    <p className="text-white/60 leading-relaxed font-light" style={{ fontSize: '14px', lineHeight: '1.8' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
