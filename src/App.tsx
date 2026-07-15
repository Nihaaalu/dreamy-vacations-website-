import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Phone, Mail, MapPin, MessageSquare, Heart, Sparkles, Clock, Globe } from 'lucide-react';
import Navbar from './components/Navbar';
import SEOManager from './components/SEOManager';
import Logo from './components/Logo';

// Pages imports
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import GroupBooking from './pages/GroupBooking';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import TravelGuide from './pages/TravelGuide';
import BlogList from './pages/BlogList';
import BlogPostDetail from './pages/BlogPostDetail';
import TripPlanner from './pages/TripPlanner';
import SharedTrip from './pages/SharedTrip';

// ScrollToTop helper on route updates (complies with smooth Apple style transitions)
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function AppContent() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d] selection:bg-[#6b5b4b] selection:text-white text-white">
      
      {/* NAVBAR */}
      <Navbar onBookNow={() => navigate('/booking')} />

      {/* MAIN ROUTER BODY */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/group-booking" element={<GroupBooking />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/travel-guide" element={<TravelGuide />} />
          <Route path="/travel-guide/:slug" element={<TravelGuide />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
          <Route path="/trip-planner" element={<TripPlanner />} />
          <Route path="/trip/:id" element={<SharedTrip />} />
          
          {/* Catch-all fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0b0b0b] text-white/70 font-sans border-t border-white/5" id="main-footer">
        
        {/* Main 4-Column Section */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10">
          
          {/* Column 1: About & Legal (span 4) */}
          <div className="md:col-span-4 space-y-5" id="footer-col-about">
            <h4 className="font-display font-medium text-[11px] tracking-[0.22em] text-[#e2d7c5] uppercase">
              Dreamy Vacations
            </h4>
            <p className="text-[13px] text-white/60 leading-[1.7] font-light">
              Dreamy Vacations offers premium family and group accommodation in Kushalnagar, Coorg. With spacious rooms, outdoor swimming pool, high-tech rain dance, and cozy campfire setups.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-light text-white/40 pt-1">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
          
          {/* Column 2: Resort (span 2) */}
          <div className="md:col-span-2 space-y-5" id="footer-col-resort">
            <h4 className="font-display font-medium text-[11px] tracking-[0.22em] text-[#e2d7c5] uppercase">
              Resort
            </h4>
            <ul className="space-y-3 text-xs font-light text-white/60">
              <li><Link to="/rooms" className="hover:text-white transition-colors">Rooms</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Travel Guides & Planners (span 3) */}
          <div className="md:col-span-3 space-y-5" id="footer-col-travel">
            <h4 className="font-display font-medium text-[11px] tracking-[0.22em] text-[#e2d7c5] uppercase">
              Travel & Planning
            </h4>
            <ul className="space-y-3 text-xs font-light text-white/60">
              <li><Link to="/blog" className="hover:text-white transition-colors">Travel Guides</Link></li>
              <li><Link to="/trip-planner" className="hover:text-white font-semibold text-[#e2d7c5] transition-colors">Trip Planner</Link></li>
              <li><Link to="/blog/coorg-trip-plan-2-days" className="hover:text-white transition-colors">2 Day Itinerary</Link></li>
              <li><Link to="/blog/coorg-trip-plan-3-days" className="hover:text-white transition-colors">3 Day Itinerary</Link></li>
              <li><Link to="/blog/best-place-to-stay-in-coorg" className="hover:text-white transition-colors">Where to Stay</Link></li>
              <li><Link to="/blog/kushalnagar-tourist-places" className="hover:text-white transition-colors">Nearby Attractions</Link></li>
            </ul>
          </div>

          {/* Column 4: Location & Contact (span 3) */}
          <div className="md:col-span-3 space-y-5" id="footer-col-contact">
            <h4 className="font-display font-medium text-[11px] tracking-[0.22em] text-[#e2d7c5] uppercase">
              Reach Us
            </h4>
            <ul className="space-y-3 text-xs font-light text-white/60">
              <li>
                <a href="tel:+919902960484" className="font-mono hover:text-white transition-colors block">
                  +91 99029 60484
                </a>
              </li>
              <li>
                <a href="https://wa.me/919902960484" target="_blank" rel="noopener noreferrer" className="hover:text-[#e2d7c5] transition-colors font-semibold block">
                  WhatsApp Support
                </a>
              </li>
              <li className="leading-relaxed text-white/50 pt-1">
                Kushalnagar, Coorg, Karnataka, India
              </li>
              <li>
                <a 
                  href="https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#e2d7c5] hover:underline block font-light"
                >
                  Open in Google Maps &rarr;
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Credit bar */}
        <div className="bg-[#080808] py-8 border-t border-white/5">
          <div className="footer-copyright px-6 text-center text-[10px] md:text-[11px] text-white/30 leading-[1.6] max-w-4xl mx-auto space-y-1">
            <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5">
              <span className="whitespace-nowrap">&copy; {new Date().getFullYear()} Dreamy Vacations.</span>
              <span className="whitespace-nowrap">All Rights Reserved.</span>
            </p>
            <p className="text-white/20 font-light text-[9px] md:text-[10px]">
              Crafted for authentic family stay experiences in Coorg.
            </p>
          </div>
        </div>

      </footer>

    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <SEOManager />
      <AppContent />
    </Router>
  );
}
