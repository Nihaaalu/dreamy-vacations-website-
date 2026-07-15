import { motion } from 'motion/react';
import { Phone, MapPin, MessageSquare, Compass, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const address = `#51/5, Behind Chikkathur Govt School, Chikkathur Village, Kushalnagar, Kudumangalore, Karnataka 571232`;
  const coordinatesStr = `12.486260, 75.940539`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInGoogleMaps = () => {
    window.open('https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-[#0d0d0d] text-white font-sans py-24 min-h-screen" id="contact-page-container">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 pt-8 space-y-16">
        
        {/* HEADER SECTION */}
        <div className="text-center space-y-4">
          <span className="text-xs font-sub font-semibold tracking-[0.18em] text-[#e2d7c5] uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#e2d7c5]" /> Find Us
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-white tracking-tight">
            Contact &amp; Location
          </h1>
          <p className="text-sm md:text-base text-white/70 font-light max-w-xl mx-auto leading-relaxed">
            Get in touch with Dreamy Vacations. Reach us over standard phone calls, secure WhatsApp chats, or locate us easily on your journey to Coorg.
          </p>
        </div>

        {/* PRIMARY CONTACT DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* CARD 1: PHONE */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#121212] p-8 rounded-2xl border border-white/5 shadow-sm space-y-6 flex flex-col justify-between"
            id="contact-card-phone"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#6b5b4b] text-[#e2d7c5] flex items-center justify-center shadow-sm">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-display font-light text-white text-xl">Call Support</h3>
              <p className="text-xs text-white/60 font-light">For booking queries, reservations, or route guidance assistance.</p>
              <p className="font-mono text-base font-semibold text-[#e2d7c5] pt-1">+91 99029 60484</p>
            </div>
            <a 
              href="tel:+919902960484"
              className="w-full py-3.5 px-8 bg-[#6b5b4b] hover:bg-[#85725f] text-white font-sub font-semibold text-[11px] tracking-[0.18em] uppercase rounded-full shadow-md transition-all duration-300 ease-out text-center block"
              id="link-call-phone"
            >
              Call Directly
            </a>
          </motion.div>

          {/* CARD 2: WHATSAPP */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#121212] p-8 rounded-2xl border border-white/5 shadow-sm space-y-6 flex flex-col justify-between"
            id="contact-card-whatsapp"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-[#e2d7c5] flex items-center justify-center shadow-sm">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-display font-light text-white text-xl">WhatsApp Chat</h3>
              <p className="text-xs text-white/60 font-light">Message us on WhatsApp for rapid responses regarding room availability.</p>
              <p className="font-mono text-base font-semibold text-emerald-400 pt-1">+91 99029 60484</p>
            </div>
            <a 
              href="https://wa.me/919902960484?text=Hello%20Dreamy%20Vacations,%20I'd%20like%20to%20know%20more%20about%20staying%20with%20you."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-8 bg-emerald-700 hover:bg-emerald-800 text-white font-sub font-semibold text-[11px] tracking-[0.18em] uppercase rounded-full shadow-md transition-all duration-300 ease-out text-center block"
              id="link-whatsapp-chat"
            >
              Start WhatsApp
            </a>
          </motion.div>

          {/* CARD 3: ADDRESS */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#121212] p-8 rounded-2xl border border-white/5 shadow-sm space-y-6 flex flex-col justify-between md:col-span-1"
            id="contact-card-address"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#6b5b4b] text-[#e2d7c5] flex items-center justify-center shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-display font-light text-white text-xl">Resort Location</h3>
              <p className="text-xs text-white/60 leading-relaxed font-light line-clamp-3">
                {address}
              </p>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#e2d7c5] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full w-fit">
                <Compass className="w-3.5 h-3.5" /> Coordinates: {coordinatesStr}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={copyToClipboard}
                className="flex-1 py-3.5 px-8 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-sub font-semibold text-[11px] tracking-[0.1em] uppercase rounded-full shadow-md transition-all duration-300 ease-out flex items-center justify-center gap-1.5 cursor-pointer"
                id="btn-copy-address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button 
                onClick={openInGoogleMaps}
                className="flex-1 py-3.5 px-8 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-sub font-semibold text-[11px] tracking-[0.1em] uppercase rounded-full shadow-md transition-all duration-300 ease-out flex items-center justify-center gap-1.5 cursor-pointer"
                id="btn-maps-search"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#e2d7c5]" /> Maps
              </button>
            </div>
          </motion.div>

        </div>

        {/* MAPS INTERACTIVE SECTION (COORDINATES: 12.486260,75.940539) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-[#121212] rounded-2xl p-4 md:p-8 border border-white/5 shadow-xl overflow-hidden space-y-6"
          id="contact-map-frame"
        >
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-6">
            <div>
              <h3 className="text-xl font-display font-light text-white">Interactive Location Map</h3>
              <p className="text-xs text-white/50 font-light">Chikkathur Govt School is our primary visual landmark on the village approach road.</p>
            </div>
            <button
              onClick={openInGoogleMaps}
              className="px-6 py-2.5 bg-[#6b5b4b] hover:bg-[#85725f] text-white font-sub font-semibold text-[11px] tracking-[0.18em] uppercase rounded-full shadow-md transition-all duration-300 ease-out cursor-pointer flex items-center gap-1.5 self-start"
              id="btn-open-gps"
            >
              Navigate via GPS <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Iframe with exact coordinates */}
          <div 
            className="aspect-[16/9] w-full bg-zinc-950 border border-white/5"
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}
          >
            <iframe
              title="Dreamy Vacations Google Map Location"
              src={`https://maps.google.com/maps?q=12.486260,75.940539&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              id="google-maps-iframe"
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
