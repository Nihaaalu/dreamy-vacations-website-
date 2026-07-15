import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, Users, ShieldCheck, Compass, Share2, 
  MapPin, Printer, ArrowRight, Sparkles, CheckCircle2, ChevronRight, HelpCircle, Loader2, Phone, CalendarCheck
} from 'lucide-react';
import { encodeTrip, generateItinerary, ItineraryDay } from '../lib/tripHelper';
import { jsPDF } from 'jspdf';

// Places Data representing the gallery cards with correct filenames & descriptions
const PLACES_DATA = [
  {
    name: 'Bylakuppe Golden Temple',
    imgKey: '/images/places/gold.jpeg',
    drive: '12 min from Dreamy Vacations',
    desc: 'Three massive majestic golden statues of Buddha within serene, manicured lawns and temples.'
  },
  {
    name: 'Dubare Elephant Camp',
    imgKey: '/images/places/dubare.jpeg',
    drive: '20 min from Dreamy Vacations',
    desc: 'Witness elephants bathing, grooming, and feeding in their natural riverside habitat.'
  },
  {
    name: 'Kaveri Nisargadhama',
    imgKey: '/images/places/nisa.jpeg',
    drive: '8 min from Dreamy Vacations',
    desc: 'Bamboo-covered river island reached by a scenic hanging bridge, featuring deer and boat rides.'
  },
  {
    name: 'Harangi Dam & Reservoir',
    imgKey: '/images/places/harangi.jpeg',
    drive: '15 min from Dreamy Vacations',
    desc: 'Relaxing masonry dam reservoir with a quiet tree-filled garden park and water cascades.'
  },
  {
    name: 'Mandalpatti Peak',
    imgKey: '/images/places/md.jpeg',
    drive: '1h 15m from Dreamy Vacations',
    desc: 'Breathtaking green mountain ridge views reached via an exciting off-road 4x4 Jeep Safari.'
  },
  {
    name: 'Abbey Falls',
    imgKey: '/images/places/ab.jpeg',
    drive: '45 min from Dreamy Vacations',
    desc: 'Spectacular waterfall roaring down 70 feet amidst private coffee and spice estates.'
  },
  {
    name: 'Raja’s Seat',
    imgKey: '/images/places/raja.jpeg',
    drive: '45 min from Dreamy Vacations',
    desc: 'Royal sunset viewpoint surrounded by misty valleys and flower-covered landscaped gardens.'
  },
  {
    name: 'Chiklihole Reservoir',
    imgKey: '/images/places/chick.jpeg',
    drive: '18 min from Dreamy Vacations',
    desc: 'A pristine, offbeat semi-circular dam surrounded by the lush Dubare forest range.'
  }
];

// Memory cache for preloaded base64 image strings
const imageCache: Record<string, string> = {};

// Helper to convert relative URLs into clean base64 data strings safely with 16:9 cropping
const getBase64ImageFromUrl = async (url: string): Promise<string> => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const targetWidth = 800;
        const targetHeight = 450; // exactly 16:9 aspect ratio
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          resolve(url);
          return;
        }
        
        const imgAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;
        let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
        
        if (imgAspect > targetAspect) {
          sWidth = img.height * targetAspect;
          sx = (img.width - sWidth) / 2;
        } else {
          sHeight = img.width / targetAspect;
          sy = (img.height - sHeight) / 2;
        }
        
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
        const b64 = canvas.toDataURL('image/jpeg', 0.85);
        URL.revokeObjectURL(objectUrl);
        resolve(b64);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(url);
      };
      img.src = objectUrl;
    });
  } catch (e) {
    console.warn(`Could not load image ${url}, falling back`, e);
    return url;
  }
};

// Background preloader for instant PDF compile actions
const preloadAllImages = async () => {
  const urls = PLACES_DATA.map(p => p.imgKey);
  await Promise.all(
    urls.map(async (url) => {
      try {
        if (!imageCache[url]) {
          const b64 = await getBase64ImageFromUrl(url);
          imageCache[url] = b64;
        }
      } catch (e) {
        console.warn(`Could not preload ${url}, PDF will fall back to gold accents gracefully`, e);
      }
    })
  );
};

export default function TripPlanner() {
  const navigate = useNavigate();

  const getArrivalHour = (timeStr: string): number => {
    try {
      const parts = timeStr.trim().split(' ');
      const timeParts = parts[0].split(':');
      let hour = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1] || '0', 10);
      const isPM = parts[1]?.toUpperCase() === 'PM';
      if (isPM && hour !== 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      return hour + minutes / 60;
    } catch (e) {
      return 12;
    }
  };

  // Inputs state
  const [arrivalDate, setArrivalDate] = useState('2026-07-20');
  const [arrivalTime, setArrivalTime] = useState('09:00 AM');
  const [departureDate, setDepartureDate] = useState('2026-07-22');
  const [departureTime, setDepartureTime] = useState('05:00 PM');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [arrivalPreference, setArrivalPreference] = useState<'rest' | 'explore'>('rest');

  // Generation status state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastCode, setLastCode] = useState('');

  // Preload gallery images on mount for immediate response times
  useEffect(() => {
    preloadAllImages().catch(err => console.error('Image preloading failed', err));
  }, []);

  // PDF Compilation & Download execution
  const executePDFGeneration = (timeline: ItineraryDay[]) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      // Format dynamic dates in a clean compact way
      const formatDateCompact = (dateStr: string) => {
        try {
          const d = new Date(dateStr);
          const day = d.getDate();
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${day} ${months[d.getMonth()]}`;
        } catch (e) {
          return dateStr;
        }
      };

      // Helper to draw auto-scaling text to prevent clipping
      const drawSleekText = (pdfDoc: jsPDF, text: string, x: number, y: number, maxWidth: number, baseFontSize: number, isBold: boolean = false) => {
        pdfDoc.setFont('helvetica', isBold ? 'bold' : 'normal');
        let fontSize = baseFontSize;
        pdfDoc.setFontSize(fontSize);
        while (pdfDoc.getTextWidth(text) > maxWidth && fontSize > 5.5) {
          fontSize -= 0.5;
          pdfDoc.setFontSize(fontSize);
        }
        pdfDoc.text(text, x, y);
      };

      // Map place names to premium micro subtitles requested
      const getPlaceSubtext = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('golden temple') || n.includes('namdroling')) return 'Largest Tibetan Monastery';
        if (n.includes('dubare')) return 'Elephant Interaction';
        if (n.includes('nisargadhama')) return 'Bamboo Island & Deer Park';
        if (n.includes('harangi')) return 'Sunset & Reservoir';
        if (n.includes('mandalpatti')) return '4x4 Jeep Peak Safari';
        if (n.includes('abbey')) return 'Waterfall & Estate Walk';
        if (n.includes('raja')) return 'Royal Sunset Viewpoint';
        if (n.includes('chiklihole')) return 'Pristine Forest Dam';
        return 'Scenic Highlight of Coorg';
      };

      // Helper to parse clean activity titles
      const getCleanActivityTitle = (title: string) => {
        const lower = title.toLowerCase();
        if (lower.includes('golden temple') || lower.includes('namdroling')) return 'Golden Temple';
        if (lower.includes('dubare')) return 'Dubare Elephant Camp';
        if (lower.includes('nisargadhama')) return 'Kaveri Nisargadhama';
        if (lower.includes('harangi')) return 'Harangi Dam';
        if (lower.includes('mandalpatti')) return 'Mandalpatti Peak';
        if (lower.includes('abbey')) return 'Abbey Falls';
        if (lower.includes('raja')) return 'Raja’s Seat';
        if (lower.includes('chiklihole')) return 'Chiklihole Reservoir';
        if (lower.includes('shopping') || lower.includes('spices')) return 'Local Spice Shopping';
        if (lower.includes('monastery')) return 'Tibetan Monastery';
        if (lower.includes('rain dance') || lower.includes('poolside')) return 'Dreamy Vacations Resort';
        if (lower.includes('riverside')) return 'Kaveri River Walk';
        if (lower.includes('settle') || lower.includes('arrive')) return 'Dreamy Vacations (Base)';
        if (lower.includes('checkout') || lower.includes('departure')) return 'Departure';
        if (lower.includes('breakfast')) return 'Resort Breakfast';
        if (lower.includes('lunch')) return 'Local Coorg Lunch';
        if (lower.includes('dinner')) return 'Campfire & Dinner';
        
        let name = title;
        if (name.includes('at the')) name = name.split('at the')[1];
        else if (name.includes('at')) name = name.split('at')[1];
        else if (name.includes('to')) name = name.split('to')[1];
        return name.trim();
      };

      // ==========================================
      // PAGE 1 — PREMIUM TRAVEL PLAN
      // ==========================================
      // Rich Black Background
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 0, 595, 842, 'F');

      // Luxury Branding Header
      doc.setTextColor(226, 215, 197); // #e2d7c5 warm beige
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('DREAMY VACATIONS', 40, 60);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text('KUSHALNAGAR, COORG  •  LUXURY BASE RESORT GUIDE', 40, 72);

      // Gold-accent divider
      doc.setDrawColor(107, 91, 75); // #6b5b4b
      doc.setLineWidth(1);
      doc.line(40, 80, 555, 80);

      // Info Cards Grid: 4 columns (Section A)
      const cardY = 92;
      const cardH = 45;
      const cardW = 118;
      const gap = 14;

      const items = [
        { label: 'ARRIVAL', val1: formatDateCompact(arrivalDate), val2: arrivalTime },
        { label: 'DEPARTURE', val1: formatDateCompact(departureDate), val2: departureTime },
        { label: 'BASE HUB', val1: 'Dreamy Vacations', val2: 'Kushalnagar, Coorg' },
        { label: 'DURATION', val1: `${timeline.length} Days`, val2: 'Base: Kushalnagar' }
      ];

      items.forEach((item, idx) => {
        const cardX = 40 + idx * (cardW + gap);
        doc.setFillColor(18, 18, 18); // #121212
        doc.setDrawColor(35, 35, 35);
        doc.setLineWidth(0.5);
        doc.roundedRect(cardX, cardY, cardW, cardH, 4, 4, 'FD');

        // Label
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(188, 163, 140); // subdued beige
        doc.text(item.label, cardX + 10, cardY + 14);

        // Value 1
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(255, 255, 255);
        doc.text(item.val1, cardX + 10, cardY + 26);

        // Value 2
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(140, 140, 140);
        doc.text(item.val2, cardX + 10, cardY + 37);
      });

      // ------------------------------------------
      // DYNAMIC GRID LAYOUT FOR DAILY SECTIONS
      // ------------------------------------------
      const numCols = Math.min(timeline.length, 3);
      const totalWidth = 515; // from X: 40 to 555
      let colW = 160;
      let colGap = 17.5;
      if (numCols === 2) {
        colW = 245;
        colGap = 25;
      } else if (numCols === 1) {
        colW = 515;
        colGap = 0;
      }

      // Title Section B: Daily Timelines
      const secBY = 165;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(226, 215, 197);
      doc.text('DAILY TRAVEL TIMELINES', 40, secBY - 10);

      // Render Section B Cards
      timeline.slice(0, 3).forEach((day, idx) => {
        const colX = 40 + idx * (colW + colGap);
        const secBH = 210;

        // Draw Card Background
        doc.setFillColor(18, 18, 18);
        doc.setDrawColor(35, 35, 35);
        doc.setLineWidth(0.5);
        doc.roundedRect(colX, secBY, colW, secBH, 4, 4, 'FD');

        // Card Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(188, 163, 140);
        const dayLabel = `DAY ${day.dayNum}  •  ${day.dayName.split(',')[0].toUpperCase()}`;
        doc.text(dayLabel, colX + 12, secBY + 16);

        // Divider
        doc.setDrawColor(40, 40, 40);
        doc.line(colX + 12, secBY + 22, colX + colW - 12, secBY + 22);

        // Activities spacing
        const actList = day.activities.slice(0, 5); // fits up to 5 items comfortably
        const startActY = secBY + 36;
        const actStep = 32;

        actList.forEach((act, actIdx) => {
          const actY = startActY + actIdx * actStep;

          // Time text
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(226, 215, 197);
          doc.text(act.time, colX + 12, actY);

          // Dot separator
          doc.setFillColor(80, 80, 80);
          doc.circle(colX + 56, actY - 2.5, 1.5, 'F');

          // Place name text
          const cleanTitle = getCleanActivityTitle(act.title);
          drawSleekText(doc, cleanTitle, colX + 64, actY, colW - 76, 7.5, false);
        });
      });

      // Title Section C: Optimized Route Sequences
      const secCY = 405;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(226, 215, 197);
      doc.text('OPTIMIZED DAILY ROUTE SEQUENCES', 40, secCY - 10);

      // Render Section C Cards (Optimized route maps for every day!)
      timeline.slice(0, 3).forEach((day, idx) => {
        const colX = 40 + idx * (colW + colGap);
        const secCH = 295;

        // Draw Card Background
        doc.setFillColor(18, 18, 18);
        doc.setDrawColor(35, 35, 35);
        doc.setLineWidth(0.5);
        doc.roundedRect(colX, secCY, colW, secCH, 4, 4, 'FD');

        // Card Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(188, 163, 140);
        doc.text(`DAY ${day.dayNum} ROUTE`, colX + 12, secCY + 16);

        // Divider
        doc.setDrawColor(40, 40, 40);
        doc.line(colX + 12, secCY + 22, colX + colW - 12, secCY + 22);

        // Build route stops dynamically
        const stops: string[] = [];
        const isFirstDay = day.dayNum === 1;
        const isLastDay = day.dayNum === timeline.length;

        // Day 1 starts with Dubare directly if early, else starts with stay hub
        if (!isFirstDay || !day.activities[0]?.title.toLowerCase().includes('dubare')) {
          stops.push('Dreamy Vacations (Base)');
        }

        day.activities.forEach(act => {
          const cleanName = getCleanActivityTitle(act.title);
          if (cleanName === 'Dreamy Vacations Resort') {
            if (stops[stops.length - 1] !== 'Dreamy Vacations (Base)') {
              stops.push('Dreamy Vacations (Base)');
            }
          } else {
            stops.push(cleanName);
          }
        });

        if (isLastDay) {
          if (stops[stops.length - 1] !== 'Departure') {
            stops.push('Departure');
          }
        } else {
          if (stops[stops.length - 1] !== 'Dreamy Vacations (Base)') {
            stops.push('Dreamy Vacations (Base)');
          }
        }

        // Limit to 6 items to keep spacing beautiful
        const maxStops = Math.min(stops.length, 6);
        const startStopY = secCY + 40;
        // Calculate step size to use all space beautifully
        const stopStep = Math.min(42, Math.floor(220 / (maxStops - 1)));

        stops.slice(0, maxStops).forEach((stop, stopIdx) => {
          const itemY = startStopY + stopIdx * stopStep;

          // Circle indicator
          doc.setFillColor(188, 163, 140); // gold
          doc.circle(colX + 18, itemY - 2.5, 2.5, 'F');

          // Label
          drawSleekText(doc, stop, colX + 28, itemY, colW - 40, 7.5, true);

          // Connecting line
          if (stopIdx < maxStops - 1) {
            doc.setDrawColor(65, 55, 45);
            doc.setLineWidth(0.75);
            doc.line(colX + 18, itemY + 1, colX + 18, itemY + stopStep - 6);

            // Down arrow marker
            doc.setTextColor(107, 91, 75);
            doc.setFontSize(5);
            doc.text('v', colX + 16.5, itemY + stopStep / 2);
          }
        });
      });

      // --- BOTTOM STAY CARD (Y: 715 to 795) ---
      const bottomY = 715;
      doc.setFillColor(15, 14, 13); // deep dark bronze/brown
      doc.setDrawColor(107, 91, 75);
      doc.setLineWidth(0.75);
      doc.roundedRect(40, bottomY, 515, 80, 4, 4, 'FD');

      // Col 1: Resort Info
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(226, 215, 197);
      doc.text('DREAMY VACATIONS', 55, bottomY + 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(160, 160, 160);
      doc.text('Luxury Resort Base Gateway', 55, bottomY + 32);
      doc.text('Kushalnagar, Coorg, KA', 55, bottomY + 44);
      doc.text('The Strategic Gateway Base of Coorg', 55, bottomY + 56);

      // Col 2: Selected Amenities
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(188, 163, 140);
      doc.text('RESORT AMENITIES', 250, bottomY + 20);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(160, 160, 160);
      doc.text('• Deep Outdoor Swimming Pool', 250, bottomY + 32);
      doc.text('• High-Tech Rain Dance Arena', 250, bottomY + 44);
      doc.text('• Cozy Starry-Sky Campfire', 250, bottomY + 56);
      doc.text('• Multi-Cuisine Diner & Restaurant', 250, bottomY + 68);

      // Col 3: Bookings & Support
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(188, 163, 140);
      doc.text('BOOKINGS & SUPPORT', 430, bottomY + 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text('Phone: +91 99029 60484', 430, bottomY + 32);
      doc.text('WhatsApp: +91 99029 60484', 430, bottomY + 44);
      doc.setTextColor(188, 163, 140);
      doc.text('Web: www.dreamyvacations.in', 430, bottomY + 58);

      // Footer Page 1
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(80, 80, 80);
      doc.text('Page 1 of 2  •  Dreamy Vacations Kushalnagar  •  Luxury cottages with pool & campfire.', 40, 812);


      // ==========================================
      // PAGE 2 — PREMIUM PLACES GALLERY
      // ==========================================
      doc.addPage();
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 0, 595, 842, 'F');

      // Header Page 2
      doc.setTextColor(226, 215, 197);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('COORG SIGHTSEEING GALLERY', 40, 60);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(140, 140, 140);
      doc.text('EXPLORE THE BEST ATTRACTIONS ACCESSED FROM DREAMY VACATIONS KUSHALNAGAR', 40, 72);

      doc.setDrawColor(107, 91, 75);
      doc.setLineWidth(0.75);
      doc.line(40, 80, 555, 80);

      // Draw Sightseeing Cards (Page 2) - 8 cards in 4 rows of 2 columns
      PLACES_DATA.forEach((place, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const cardX = col === 0 ? 40 : 310;
        const cardY = 92 + row * 165; // rows: 92, 257, 422, 587 (total height 160 per card, plus 5 gap)

        // Draw Card Container
        doc.setFillColor(18, 18, 18);
        doc.setDrawColor(30, 30, 30);
        doc.setLineWidth(0.5);
        doc.roundedRect(cardX, cardY, 245, 160, 4, 4, 'FD');

        // Draw Image - maintaining correct 16:9 aspect ratio and centered
        const imgData = imageCache[place.imgKey];
        if (imgData) {
          try {
            doc.addImage(imgData, 'JPEG', cardX + 8, cardY + 8, 229, 129, undefined, 'FAST');
          } catch (err) {
            doc.setFillColor(25, 22, 20);
            doc.rect(cardX + 8, cardY + 8, 229, 129, 'F');
          }
        } else {
          doc.setFillColor(25, 22, 20);
          doc.rect(cardX + 8, cardY + 8, 229, 129, 'F');
        }

        // Left title
        drawSleekText(doc, place.name, cardX + 10, cardY + 145, 140, 8, true);

        // Right drive time (Gold-accent, right-aligned)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(226, 215, 197);
        const cleanDrive = place.drive.split('from')[0].trim();
        doc.text(cleanDrive, cardX + 235, cardY + 145, { align: 'right' });

        // Description / Subtext
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(140, 140, 140);
        doc.text(getPlaceSubtext(place.name), cardX + 10, cardY + 154);
      });

      // Footer Page 2
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(226, 215, 197);
      doc.text('DREAMY VACATIONS', 40, 792);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(140, 140, 140);
      doc.text('Luxury Stay in Kushalnagar, Coorg', 40, 804);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('www.dreamyvacations.in', 555, 792, { align: 'right' });
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(140, 140, 140);
      doc.text('+91 99029 60484', 555, 804, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(80, 80, 80);
      doc.text('Page 2 of 2  •  Experience curated Coorg tours directly from our resort gateway.', 40, 820);

      // Build safe filename and trigger instant background download
      const filename = `Dreamy_Vacations_Coorg_Itinerary.pdf`;
      doc.save(filename);
    } catch (e) {
      console.error('PDF compiling failed', e);
      alert('An error occurred while compiling your high-end PDF. Please try again.');
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const arrHour = getArrivalHour(arrivalTime);
    const showPref = arrHour >= 13 && arrHour <= 17;

    const params = {
      arrivalDate,
      arrivalTime,
      departureDate,
      departureTime,
      adults: Number(adults),
      children: Number(children),
      staying: true, // Strictly assumed stay at Dreamy Vacations as central hub
      arrivalPreference: showPref ? arrivalPreference : (arrHour > 17 ? 'rest' : undefined)
    };

    const code = encodeTrip(params);
    const timeline = generateItinerary(params);
    setLastCode(code);

    // Staggered interactive progress pipeline for high-end feel
    setTimeout(() => {
      setGeneratingStep('Basing route flows on Dreamy Vacations, Kushalnagar...');
      setTimeout(() => {
        setGeneratingStep('Personalizing day-by-day sequence to bypass highland traffic...');
        setTimeout(() => {
          setGeneratingStep('Structuring premium Places Visual Gallery (Page 2)...');
          setTimeout(() => {
            setGeneratingStep('Compiling ultra-light vector PDF structure (under 200 KB)...');
            setTimeout(() => {
              executePDFGeneration(timeline);
              setIsGenerating(false);
              setIsSuccess(true);
              setGeneratingStep('');

              // Smooth scroll down to success block
              setTimeout(() => {
                const el = document.getElementById('planner-success-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            }, 800);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleShareLink = () => {
    if (!lastCode) return;
    const url = `${window.location.origin}/trip/${lastCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Custom Coorg Itinerary',
        text: 'Custom road trip itinerary generated from Dreamy Vacations Kushalnagar.',
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert('Trip digital share link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] font-sans text-white/90 pb-24 pt-28" id="trip-planner-root">
      
      {/* 1. HERO HEADER */}
      <div className="max-w-4xl mx-auto px-6 text-center space-y-4 mb-16">
        <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#e2d7c5] font-semibold block animate-pulse">
          Bespoke Travel Generator
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-light text-white tracking-tight leading-none">
          Free Coorg Trip Planner
        </h1>
        <p className="text-sm md:text-base text-white/60 font-light max-w-xl mx-auto">
          Generate a personalized, factual Coorg itinerary based on your exact travel dates, arrival, and departure times, with a pre-compiled luxury PDF download.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 space-y-12">
        
        {/* 2. MAIN PLANNER FORM CARD */}
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[4px] bg-[#6b5b4b]" />
          
          <form onSubmit={handleGenerate} className="space-y-8" id="trip-planner-form">
            
            {/* Row 1: Arrival Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/40 block">
                  Arrival Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e2d7c5]" />
                  <input
                    type="date"
                    required
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-[#6b5b4b] transition-colors"
                    id="input-arrival-date"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/40 block">
                  Arrival Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e2d7c5]" />
                  <select
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-[#6b5b4b] transition-colors appearance-none"
                    id="input-arrival-time"
                  >
                    <option value="07:00 AM">07:00 AM (Early Morning)</option>
                    <option value="09:00 AM">09:00 AM (Morning)</option>
                    <option value="12:00 PM">12:00 PM (Midday)</option>
                    <option value="03:00 PM">03:00 PM (Afternoon)</option>
                    <option value="06:00 PM">06:00 PM (Evening)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Row 2: Departure Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/40 block">
                  Departure Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e2d7c5]" />
                  <input
                    type="date"
                    required
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-[#6b5b4b] transition-colors"
                    id="input-departure-date"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/40 block">
                  Departure Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e2d7c5]" />
                  <select
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full bg-[#181818] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-[#6b5b4b] transition-colors appearance-none"
                    id="input-departure-time"
                  >
                    <option value="09:00 AM">09:00 AM (Morning)</option>
                    <option value="12:00 PM">12:00 PM (Midday)</option>
                    <option value="03:00 PM">03:00 PM (Afternoon)</option>
                    <option value="05:00 PM">05:00 PM (Evening)</option>
                    <option value="08:00 PM">08:00 PM (Late Night)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Smart Arrival Preference Card */}
            {getArrivalHour(arrivalTime) >= 13 && getArrivalHour(arrivalTime) <= 17 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#181818] border border-white/10 rounded-2xl p-5 space-y-4 relative overflow-hidden"
                id="arrival-preference-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#e2d7c5]" />
                    <h3 className="text-xs uppercase font-mono tracking-wider text-white font-medium">
                      Arrival Preference
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#e2d7c5]/80 bg-[#e2d7c5]/10 px-2 py-0.5 rounded">
                    Evening Arrival
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-white/60 font-light leading-relaxed">
                    You'll reach Kushalnagar in the afternoon. Would you like to relax after your journey, or explore a nearby attraction before checking in?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setArrivalPreference('rest')}
                    className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                      arrivalPreference === 'rest'
                        ? 'bg-[#6b5b4b]/20 border-[#6b5b4b] text-white'
                        : 'bg-[#121212]/50 border-white/5 text-white/60 hover:border-white/15'
                    }`}
                    id="pref-rest"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center mt-0.5 transition-colors ${
                        arrivalPreference === 'rest' ? 'border-[#e2d7c5]' : 'border-white/20'
                      }`}>
                        {arrivalPreference === 'rest' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#e2d7c5]" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-medium block">Rest & Refresh</span>
                        <span className="text-[10px] text-white/40 block">Rest at Resort (Recommended)</span>
                      </div>
                    </div>
                    <span className="absolute top-2 right-2 text-[9px] font-mono tracking-wider text-[#e2d7c5]/80 bg-[#6b5b4b]/30 px-1.5 py-0.5 rounded">
                      Recommended
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setArrivalPreference('explore')}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      arrivalPreference === 'explore'
                        ? 'bg-[#6b5b4b]/20 border-[#6b5b4b] text-white'
                        : 'bg-[#121212]/50 border-white/5 text-white/60 hover:border-white/15'
                    }`}
                    id="pref-explore"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center mt-0.5 transition-colors ${
                        arrivalPreference === 'explore' ? 'border-[#e2d7c5]' : 'border-white/20'
                      }`}>
                        {arrivalPreference === 'explore' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#e2d7c5]" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-medium block">Explore Nearby</span>
                        <span className="text-[10px] text-white/40 block">Visit One Nearby Attraction</span>
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Travel Recommendation Section */}
            <div className="bg-[#181818] border border-[#e2d7c5]/15 rounded-2xl p-6 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[3px] h-full bg-[#e2d7c5]" />
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e2d7c5]" />
                <h3 className="text-xs uppercase font-mono tracking-wider text-[#e2d7c5] font-semibold">
                  Travel Tip
                </h3>
              </div>
              <div className="space-y-3 text-xs text-white/70 font-light leading-relaxed">
                <p>
                  For the most relaxed Coorg experience, we recommend arriving one evening before your sightseeing begins.
                </p>
                <ul className="space-y-1.5 pl-1">
                  <li className="flex items-start gap-2">
                    <span className="text-[#e2d7c5] font-semibold">✓</span>
                    <span>Check in to Dreamy Vacations in the evening</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#e2d7c5] font-semibold">✓</span>
                    <span>Enjoy dinner and a restful night's sleep</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#e2d7c5] font-semibold">✓</span>
                    <span>Start your journey early the next morning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#e2d7c5] font-semibold">✓</span>
                    <span>Explore Coorg without rushing between attractions</span>
                  </li>
                </ul>
                <p className="pt-1">
                  Beginning your trip well-rested makes the itinerary more comfortable and helps you enjoy every destination at a relaxed pace.
                </p>
              </div>
              <div className="pt-2 border-t border-white/5 text-[10px] text-white/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e2d7c5]/60 animate-pulse" />
                <span className="font-mono text-[#e2d7c5]/60">Recommended for the best Coorg experience.</span>
              </div>
            </div>

            {/* Action Buttons: Generate */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 bg-[#6b5b4b] hover:bg-[#85725f] disabled:bg-[#6b5b4b]/50 text-white rounded-xl text-xs font-semibold uppercase tracking-[0.2em] transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-lg"
                id="btn-generate-trip"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Personalizing Itinerary...
                  </>
                ) : (
                  <>
                    Generate My Trip <Sparkles className="w-4 h-4 text-[#e2d7c5]" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* 3. STUNNING DYNAMIC LOADING SEQUENCE OVERLAY */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#121212] border border-[#6b5b4b]/40 rounded-3xl p-8 text-center space-y-6 shadow-xl relative overflow-hidden"
              id="loader-status-section"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#6b5b4b]/10 rounded-full blur-2xl" />
              <Loader2 className="w-10 h-10 text-[#e2d7c5] animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-sm font-mono tracking-wider text-[#e2d7c5] uppercase font-semibold">
                  Compiling Luxury Travel Guide
                </h3>
                <p className="text-xs text-white/60 font-light animate-pulse max-w-md mx-auto">
                  {generatingStep || 'Assembling travel days and computing driving maps...'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. SUCCESS ACTION PANEL */}
        <AnimatePresence>
          {isSuccess && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#121212] border border-emerald-500/20 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden"
              id="planner-success-section"
            >
              <div className="absolute top-0 inset-x-0 h-[4px] bg-emerald-500/80" />
              
              <div className="text-center space-y-6">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-display font-light text-white tracking-wide">
                    Your PDF Itinerary is Saved!
                  </h2>
                  <p className="text-xs sm:text-sm text-white/50 max-w-lg mx-auto font-light leading-relaxed">
                    A beautiful, dual-page PDF guide has been downloaded directly to your device. Keep it handy on your phone to reference driving times, attraction summaries, and route maps.
                  </p>
                </div>

                {/* Grid summary parameters */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-white/5 py-5 text-left max-w-lg mx-auto font-mono text-[11px]">
                  <div>
                    <span className="text-white/30 block">SPAN</span>
                    <span className="text-white font-semibold">{arrivalDate} to {departureDate}</span>
                  </div>
                  <div>
                    <span className="text-white/30 block">PLAN TYPE</span>
                    <span className="text-white font-semibold">Relaxed Tour</span>
                  </div>
                  <div>
                    <span className="text-white/30 block">STAY HUB</span>
                    <span className="text-[#e2d7c5] font-semibold">Dreamy Vacations</span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      const timeline = generateItinerary({
                        arrivalDate,
                        arrivalTime,
                        departureDate,
                        departureTime,
                        adults,
                        children,
                        staying: true
                      });
                      executePDFGeneration(timeline);
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-mono tracking-wider uppercase border border-white/10 transition-colors cursor-pointer"
                    id="btn-redownload-pdf"
                  >
                    Download PDF Again
                  </button>

                  <Link
                    to="/rooms"
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#6b5b4b] hover:bg-[#85725f] text-white rounded-xl text-xs font-mono tracking-wider uppercase transition-colors text-center flex items-center justify-center gap-1.5 font-semibold"
                    id="btn-success-book"
                  >
                    Explore Rooms &amp; Rates <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="pt-2 border-t border-white/5 max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
                  <a
                    href="https://wa.me/919902960484"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Support: +91 99029 60484
                  </a>
                  <button
                    onClick={handleShareLink}
                    className="hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#e2d7c5]" /> Share Digital Planner Code
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
