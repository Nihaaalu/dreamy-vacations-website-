// Premium trip compression helper to generate and parse short 6-8 character shareable tokens.
// Packed structure (up to 53 bits):
// arrDays (12 bits) | depDays (12 bits) | arrH (5 bits) | depH (5 bits) | adults (4 bits) | children (4 bits) | staying (1 bit)

export interface TripParams {
  arrivalDate: string; // YYYY-MM-DD
  arrivalTime: string; // "09:00 AM", "03:00 PM", etc.
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // "09:00 AM", "05:00 PM", etc.
  adults: number;
  children: number;
  staying: boolean;
  arrivalPreference?: 'rest' | 'explore';
}

export function encodeTrip(params: TripParams): string {
  try {
    const baseDate = new Date('2026-01-01').getTime();
    const arrTime = new Date(params.arrivalDate).getTime();
    const depTime = new Date(params.departureDate).getTime();
    
    const arrDays = Math.max(0, Math.floor((arrTime - baseDate) / (1000 * 60 * 60 * 24)));
    const depDays = Math.max(0, Math.floor((depTime - baseDate) / (1000 * 60 * 60 * 24)));

    // Extract hours
    const getHour = (tStr: string) => {
      const hourPart = parseInt(tStr.split(':')[0]);
      const isPM = tStr.toUpperCase().includes('PM');
      if (isPM && hourPart !== 12) return hourPart + 12;
      if (!isPM && hourPart === 12) return 0;
      return hourPart;
    };

    const arrH = getHour(params.arrivalTime);
    const depH = getHour(params.departureTime);

    // Combine using safe arithmetic (BigInt)
    const combined = 
      (BigInt(arrDays & 4095) << 33n) |
      (BigInt(depDays & 4095) << 21n) |
      (BigInt(arrH & 31) << 16n) |
      (BigInt(depH & 31) << 11n) |
      (BigInt(params.adults & 15) << 7n) |
      (BigInt(params.children & 15) << 3n) |
      (BigInt(params.arrivalPreference === 'explore' ? 1 : 0) << 1n) |
      (BigInt(params.staying ? 1 : 0) << 0n);

    return combined.toString(36).toUpperCase();
  } catch (e) {
    return 'AB42JK'; // Fallback seed
  }
}

export function decodeTrip(code: string): TripParams | null {
  try {
    const parsed = BigInt(parseInt(code, 36));
    if (isNaN(Number(parsed)) || parsed <= 0n) return null;

    const staying = (parsed & 1n) === 1n;
    const arrivalPreference = ((parsed >> 1n) & 1n) === 1n ? 'explore' : 'rest';
    const children = Number((parsed >> 3n) & 15n);
    const adults = Number((parsed >> 7n) & 15n);
    const depH = Number((parsed >> 11n) & 31n);
    const arrH = Number((parsed >> 16n) & 31n);
    const depDays = Number((parsed >> 21n) & 4095n);
    const arrDays = Number((parsed >> 33n) & 4095n);

    const baseDate = new Date('2026-01-01').getTime();
    const arrDateObj = new Date(baseDate + arrDays * 24 * 60 * 60 * 1000);
    const depDateObj = new Date(baseDate + depDays * 24 * 60 * 60 * 1000);

    const formatTime = (h: number) => {
      const suffix = h >= 12 ? 'PM' : 'AM';
      let hours = h % 12;
      if (hours === 0) hours = 12;
      return `${hours}:00 ${suffix}`;
    };

    const padZero = (n: number) => n.toString().padStart(2, '0');

    const formatDateStr = (d: Date) => {
      return `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`;
    };

    return {
      arrivalDate: formatDateStr(arrDateObj),
      arrivalTime: formatTime(arrH),
      departureDate: formatDateStr(depDateObj),
      departureTime: formatTime(depH),
      adults: Math.max(1, adults),
      children: Math.max(0, children),
      staying,
      arrivalPreference
    };
  } catch (e) {
    return null;
  }
}

// Generate premium, factual itinerary timeline days based on dates & times.
export interface ItineraryItem {
  time: string;
  title: string;
  desc: string;
  mapsUrl: string;
}

export interface ItineraryDay {
  dayNum: number;
  dayName: string;
  activities: ItineraryItem[];
}

export function generateItinerary(params: TripParams): ItineraryDay[] {
  const arr = new Date(params.arrivalDate);
  const dep = new Date(params.departureDate);
  const diffTime = Math.abs(dep.getTime() - arr.getTime());
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) + 1; // inclusive days

  const parseTimeToHour = (timeStr: string): number => {
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
      return 12; // Fallback to noon
    }
  };

  const arrHour = parseTimeToHour(params.arrivalTime);
  const depHour = parseTimeToHour(params.departureTime);

  const itinerary: ItineraryDay[] = [];
  const isLateArrival = arrHour >= 15; // Arrival after 3:00 PM

  for (let d = 1; d <= diffDays; d++) {
    const currentDayDate = new Date(arr.getTime() + (d - 1) * 24 * 60 * 60 * 1000);
    const dayStr = currentDayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    const activities: ItineraryItem[] = [];

    const isFirstDay = d === 1;
    const isLastDay = d === diffDays;

    if (isFirstDay && arrHour >= 13) {
      const preference = params.arrivalPreference || 'rest';

      if (arrHour > 17) {
        // Arrive after 5:00 PM: Don't offer sightseeing. Automatically generate:
        // Arrival, Dinner, Relax, Start sightseeing tomorrow
        activities.push({
          time: params.arrivalTime || '06:00 PM',
          title: 'Arrival & Check-in at Dreamy Vacations',
          desc: 'Arrive in Kushalnagar and check-in to your luxury cottage at Dreamy Vacations. Settle in, unpack, and relax.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '07:30 PM',
          title: 'Luxury Multi-Cuisine Dinner Buffet',
          desc: 'Savor a delicious dinner buffet featuring premium local Coorg and continental dishes.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '09:00 PM',
          title: 'Relax & Unwind',
          desc: 'Unwind at the resort with a soothing walk around our lush manicured gardens under the starry skies.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: 'Next Morning',
          title: 'Start Sightseeing Tomorrow',
          desc: 'Rest up tonight and get ready to start your exciting sightseeing tomorrow morning.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
      } else if (preference === 'rest') {
        // Rest at Resort (Recommended)
        // Generate: Arrival, Check-in, Swimming Pool, Freshen Up, Dinner, Campfire, Good Night, Start sightseeing next morning
        activities.push({
          time: params.arrivalTime || '03:00 PM',
          title: 'Arrival & Warm Welcome',
          desc: 'Receive a traditional welcome at Dreamy Vacations resort, nestled in the green landscape of Kushalnagar.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '03:30 PM',
          title: 'Check-in & Settle in Luxury Cottages',
          desc: 'Check in to your luxury base cottage at Dreamy Vacations. Unpack and get comfortable.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '04:30 PM',
          title: 'Refreshing Swimming Pool Session',
          desc: 'Plunge into our sparkling, deep outdoor swimming pool to wash off travel exhaustion and refresh.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '05:30 PM',
          title: 'Freshen Up & Robusta Brew',
          desc: 'Freshen up in your premium cottage and enjoy a freshly brewed cup of local Robusta coffee.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '07:30 PM',
          title: 'Luxury Multi-Cuisine Dinner Buffet',
          desc: 'Savor a delicious multi-cuisine dinner buffet featuring local specialties and global delicacies.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '08:30 PM',
          title: 'Cozy Starry-Sky Campfire Gathering',
          desc: 'Gather around a cozy campfire under a starry sky at Dreamy Vacations, listening to sweet music.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '10:00 PM',
          title: 'Good Night',
          desc: 'Enjoy a restful and deep sleep in your luxury room amidst the peaceful forest surroundings.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: 'Next Morning',
          title: 'Start Sightseeing Next Morning',
          desc: 'Settle in for a wonderful morning of sightseeing and adventure tomorrow.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
      } else {
        // Explore Nearby (Visit One Nearby Attraction)
        if (arrHour < 15) {
          // Arrive 2:00 PM case:
          // Check-in, Golden Temple, Return, Dinner, Campfire
          activities.push({
            time: params.arrivalTime || '02:00 PM',
            title: 'Arrival & Check-in',
            desc: 'Check in to your luxury cottage at Dreamy Vacations, Kushalnagar. Drop your bags, refresh quickly, and head out.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '03:30 PM',
            title: 'Tibetan Golden Temple & Bylakuppe',
            desc: 'Visit Bylakuppe to see the massive 40-foot golden Buddha statues. Experience the peaceful, meditative environment of the second largest Tibetan settlement in the world.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '06:00 PM',
            title: 'Return & Relax',
            desc: 'Return to Dreamy Vacations. Take a refreshing walk around our lush resort or enjoy a hot cup of Robusta coffee.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '07:30 PM',
            title: 'Luxury Multi-Cuisine Dinner Buffet',
            desc: 'Enjoy a delicious dinner buffet at our open-air diner beside the lawns.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '08:30 PM',
            title: 'Cozy Starry-Sky Campfire',
            desc: 'Gather around a cozy campfire at Dreamy Vacations, sharing stories under the sky.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        } else {
          // Arrive 3:30 PM case (arrHour is between 15 and 17, e.g. 3:00 PM to 5:00 PM):
          // Harangi Dam, Return, Dinner, Campfire
          activities.push({
            time: params.arrivalTime || '03:30 PM',
            title: 'Check-in at Dreamy Vacations',
            desc: 'Check in to your spacious luxury cottage, drop your bags, and get ready for a scenic evening excursion.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '04:30 PM',
            title: 'Lakeside Bliss at Harangi Dam',
            desc: 'Take a quick 15-minute drive to walk along the masonry reservoir wall and watch the peaceful cascades at the neighboring tree park.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '06:00 PM',
            title: 'Return & Pool Session',
            desc: 'Return to the resort. Enjoy a fresh cup of tea and wash off travel exhaustion with a dip in the deep pool.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '07:30 PM',
            title: 'Luxury Multi-Cuisine Dinner Buffet',
            desc: 'Enjoy a delicious multi-cuisine dinner buffet featuring local specialties.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '08:30 PM',
            title: 'Cozy Starry-Sky Campfire',
            desc: 'Unwind around a warm campfire under Coorg\'s starry night sky.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        }
      }
    } else if (diffDays === 1) {
      // =========================================================================
      // 1-DAY STAY LOGIC: Generate only Kushalnagar attractions. Never Madikeri.
      // =========================================================================
      if (arrHour < 10) {
        // Full sightseeing day
        activities.push({
          time: '09:00 AM',
          title: 'Majestic Elephants at Dubare Camp',
          desc: 'Witness elephants bathing and being groomed in their natural riverside habitat. Cross the Kaveri river by boat.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '11:30 AM',
          title: 'Kaveri Nisargadhama Forest Island',
          desc: 'Explore the 64-acre bamboo-covered river island. Walk across the suspension bridge, feed the deer, and take scenic photos.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '01:00 PM',
          title: 'Traditional Coorg Lunch',
          desc: 'Savor traditional Pandi Curry, Akki Roti, or delicious local vegetarian meals in Kushalnagar town.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '02:30 PM',
          title: 'Lakeside Bliss at Harangi Dam',
          desc: 'Relax by the masonry reservoir wall and walk through the neighboring leafy tree park.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '04:30 PM',
          title: 'Tibetan Golden Temple & Bylakuppe',
          desc: 'Admire the stunning 40-foot golden Buddha statues and experience the serenity of the second largest Tibetan settlement in the world.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
      } else if (arrHour >= 10 && arrHour < 13) {
        // Half-day itinerary (Lunch, Harangi, Golden Temple)
        activities.push({
          time: '01:00 PM',
          title: 'Traditional Coorg Lunch',
          desc: 'Enjoy authentic local cuisine at a premier diner in Kushalnagar town.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '02:30 PM',
          title: 'Lakeside Bliss at Harangi Dam',
          desc: 'Relax by the masonry reservoir wall and walk through the neighboring leafy tree park.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '04:30 PM',
          title: 'Tibetan Golden Temple & Bylakuppe',
          desc: 'Visit Bylakuppe Tibetan Settlement to see the massive golden Buddha statues and enjoy serene manicured gardens.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
      } else if (arrHour >= 13 && arrHour < 15) {
        // Nearby only (Golden Temple, Harangi Dam, Resort campfire)
        activities.push({
          time: '03:00 PM',
          title: 'Lakeside Bliss at Harangi Dam',
          desc: 'Walk around the tranquil reservoir surrounded by pristine forest land.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '04:30 PM',
          title: 'Tibetan Golden Temple & Bylakuppe',
          desc: 'Experience the serene, calm environment of the Golden Temple in Bylakuppe.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
      } else {
        // Late Arrival (after 3 PM)
        activities.push({
          time: '03:30 PM',
          title: 'Check-in & Settle at Dreamy Vacations',
          desc: 'Check in to your luxury base cottage at Dreamy Vacations, Kushalnagar. Settle in, enjoy a fresh cup of coffee, and relax.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '05:00 PM',
          title: 'Sunset Walk at Harangi Dam',
          desc: 'A quick scenic 15-minute drive to watch the peaceful sunset by the masonry reservoir before dark.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
      }

      // 1-Day Stay Evening experience
      activities.push({
        time: '06:30 PM',
        title: 'Return to Dreamy Vacations',
        desc: 'Plunge into our deep, sparkling outdoor swimming pool to wash off travel exhaustion and refresh.',
        mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
      });
      activities.push({
        time: '07:30 PM',
        title: 'Cozy Starry-Sky Campfire & Dinner',
        desc: 'Gather around a cozy campfire at Dreamy Vacations, followed by a delicious multi-cuisine dinner buffet.',
        mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
      });

    } else if (diffDays === 2) {
      // =========================================================================
      // 2-DAY STAY LOGIC: Day 1 Kushalnagar circuit, Day 2 Madikeri circuit
      // =========================================================================
      if (isFirstDay) {
        // Day 1: Kushalnagar circuit depending on arrival time
        if (arrHour < 10) {
          activities.push({
            time: '09:00 AM',
            title: 'Majestic Elephants at Dubare Camp',
            desc: 'Cross the Cauvery river by motorboat to see elephants being bathed and groomed in their natural habitat.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '11:30 AM',
            title: 'Kaveri Nisargadhama Forest Island',
            desc: 'Cross the wooden hanging suspension bridge to explore a pristine bamboo river island.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '01:00 PM',
            title: 'Traditional Coorg Lunch',
            desc: 'Enjoy authentic local Coorg specialties in Kushalnagar town.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '02:30 PM',
            title: 'Lakeside Bliss at Harangi Dam',
            desc: 'Stroll around the peaceful reservoir masonry dam and neighboring tree parks.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '04:30 PM',
            title: 'Tibetan Golden Temple & Bylakuppe',
            desc: 'Visit the magnificent golden Buddha statues and enjoy serene meditative vibes.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        } else if (arrHour >= 10 && arrHour < 13) {
          activities.push({
            time: '01:00 PM',
            title: 'Traditional Coorg Lunch',
            desc: 'Dine on authentic local specialties in Kushalnagar town.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '02:30 PM',
            title: 'Lakeside Bliss at Harangi Dam',
            desc: 'Relax by the masonry reservoir wall and tree parks.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '04:30 PM',
            title: 'Tibetan Golden Temple & Bylakuppe',
            desc: 'Visit Bylakuppe to see the majestic golden Buddha statues.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        } else if (arrHour >= 13 && arrHour < 15) {
          activities.push({
            time: '03:00 PM',
            title: 'Lakeside Bliss at Harangi Dam',
            desc: 'Visit the serene masonry dam surrounded by forest land.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '04:30 PM',
            title: 'Tibetan Golden Temple & Bylakuppe',
            desc: 'Explore the golden monasteries of Bylakuppe Tibetan settlement.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        } else {
          // Late arrival (after 3 PM)
          activities.push({
            time: '03:30 PM',
            title: 'Check-in & Settle at Dreamy Vacations',
            desc: 'Smooth check-in at your base, Dreamy Vacations Kushalnagar. Settle into your spacious premium cottage, sip on fresh Robusta brew, and enjoy the refreshing lakeside breeze.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '05:00 PM',
            title: 'Sunset Walk at Namdroling Golden Temple',
            desc: 'A quick scenic 12-minute drive to visit the Bylakuppe Tibetan Settlement before evening chants end.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        }

        // Evening Resort Experience
        activities.push({
          time: '06:30 PM',
          title: 'Return to Dreamy Vacations',
          desc: 'Unwind at the resort. Plunge into our deep, sparkling outdoor swimming pool to wash off travel exhaustion.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '07:30 PM',
          title: 'Cozy Starry-Sky Campfire & Dinner',
          desc: 'Gather around a warm campfire under a starry sky at Dreamy Vacations, followed by a multi-cuisine dinner.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });

      } else if (isLastDay) {
        // Day 2: Madikeri circuit / Departure
        if (depHour < 10) {
          activities.push({
            time: '08:30 AM',
            title: 'Hearty Breakfast & Robusta Brew',
            desc: 'Enjoy a rich breakfast with freshly brewed local Robusta coffee at Dreamy Vacations before checking out.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '10:00 AM',
            title: 'Checkout & Road Trip Departure',
            desc: 'Check out of your resort and embark on your return road trip directly from the Kushalnagar highway.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        } else if (depHour >= 10 && depHour < 15) {
          // Half day before departure - one nearby attraction (Kushalnagar)
          activities.push({
            time: '08:30 AM',
            title: 'Hearty Breakfast & Checkout',
            desc: 'Enjoy breakfast at Dreamy Vacations and complete checkout procedures.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '10:00 AM',
            title: 'Quiet Detour to Chiklihole Reservoir',
            desc: 'Visit this offbeat semi-circular dam surrounded by forest range before leaving.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '11:30 AM',
            title: 'Spices & Coffee Shopping in Kushalnagar',
            desc: 'Purchase organic local spices, cardamom, and premium Robusta coffee powder directly from local growers.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '01:00 PM',
            title: 'Pristine Lunch & Final Departure',
            desc: 'Enjoy a delicious lunch in town before departing on the highway home.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        } else {
          // Full day of sightseeing on Day 2: Madikeri Highlands Adventure!
          activities.push({
            time: '07:30 AM',
            title: 'Mandalpatti Peak 4x4 Off-Road Jeep Safari',
            desc: 'Start early from Kushalnagar towards Madikeri. Climb up the misty Mandalpatti Peak in an off-road jeep to enjoy breathtaking mountain ridge views above the clouds.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '11:30 AM',
            title: 'Abbey Falls Coffee Estate Walk',
            desc: 'Walk down concrete steps through dense cardamom and coffee plantations to see Abbey Falls roaring down 70 feet. Spectacular mist-sprayed views.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '01:00 PM',
            title: 'Traditional Coorg Lunch near Madikeri',
            desc: 'Dine at a premium local Coorg restaurant to experience local culinary delights.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '02:30 PM',
            title: 'Shopping & Scenic Views at Raja’s Seat',
            desc: 'Watch spectacular views of the rolling mist-covered Coorg valleys, once enjoyed by the Kings of Coorg.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '04:00 PM',
            title: 'Return & Checkout Departure',
            desc: 'Return to Dreamy Vacations, collect your luggage, and commence your journey home with delightful memories.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        }
      }

    } else {
      // =========================================================================
      // 3 OR MORE DAYS STAY LOGIC: Day 1 Kushalnagar circuit, Day 2 complete Madikeri, Day 3 relaxed Kushalnagar / shopping
      // =========================================================================
      if (isFirstDay) {
        // Day 1: Half/Full Kushalnagar depending on arrival time
        if (arrHour < 10) {
          activities.push({
            time: '09:00 AM',
            title: 'Majestic Elephants at Dubare Camp',
            desc: 'Cross the river by boat to see elephants bathing and feeding in their natural habitat.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '11:30 AM',
            title: 'Kaveri Nisargadhama Forest Island',
            desc: 'Stroll on a scenic 64-acre island across a wooden hanging bridge.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '01:00 PM',
            title: 'Traditional Coorg Lunch',
            desc: 'Enjoy authentic lunch dishes in Kushalnagar.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '02:30 PM',
            title: 'Lakeside Bliss at Harangi Dam',
            desc: 'Relax by the masonry reservoir wall and enjoy peaceful gardens.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '04:30 PM',
            title: 'Tibetan Golden Temple & Bylakuppe',
            desc: 'Experience peaceful vibes at the second largest Tibetan settlement in the world.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        } else if (arrHour >= 10 && arrHour < 13) {
          // Half day
          activities.push({
            time: '01:00 PM',
            title: 'Traditional Coorg Lunch',
            desc: 'Savor traditional Coorg specialties in town.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '02:30 PM',
            title: 'Lakeside Bliss at Harangi Dam',
            desc: 'Enjoy peaceful walks by the masonry reservoir wall.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '04:30 PM',
            title: 'Tibetan Golden Temple & Bylakuppe',
            desc: 'Witness magnificent giant golden Buddha statues.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        } else if (arrHour >= 13 && arrHour < 15) {
          // Nearby only
          activities.push({
            time: '03:00 PM',
            title: 'Lakeside Bliss at Harangi Dam',
            desc: 'Relax by the tranquil masonry dam.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '04:30 PM',
            title: 'Tibetan Golden Temple & Bylakuppe',
            desc: 'Visit Bylakuppe to see beautiful golden monasteries.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        } else {
          // Late arrival (after 3 PM)
          activities.push({
            time: '03:30 PM',
            title: 'Check-in & Settle at Dreamy Vacations',
            desc: 'Smooth check-in at your base, Dreamy Vacations Kushalnagar. Settle into your spacious premium cottage, sip on fresh Robusta brew, and enjoy the refreshing lakeside breeze.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '05:00 PM',
            title: 'Sunset Walk at Harangi Dam',
            desc: 'A quick scenic 15-minute drive to relax and enjoy the serene view of the masonry reservoir at sunset.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        }

        // Evening Resort Experience
        activities.push({
          time: '06:30 PM',
          title: 'Return to Dreamy Vacations',
          desc: 'Unwind at the resort. Plunge into our deep, sparkling outdoor swimming pool to wash off travel exhaustion.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });
        activities.push({
          time: '07:30 PM',
          title: 'Cozy Starry-Sky Campfire & Dinner',
          desc: 'Enjoy a rich buffet dinner at Dreamy Vacations beside a warm evening campfire under the stars.',
          mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
        });

      } else if (isLastDay) {
        // Day D: Departure Day depending on departure time
        if (depHour < 10) {
          activities.push({
            time: '08:30 AM',
            title: 'Hearty Breakfast & Robusta Brew',
            desc: 'Enjoy breakfast at Dreamy Vacations and complete checkout procedures.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '10:00 AM',
            title: 'Checkout & Road Trip Departure',
            desc: 'Check out of your resort and embark on your return road trip directly from the Kushalnagar highway.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        } else if (depHour >= 10 && depHour < 15) {
          activities.push({
            time: '08:30 AM',
            title: 'Hearty Breakfast & Checkout',
            desc: 'Enjoy breakfast at Dreamy Vacations and complete checkout.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '10:00 AM',
            title: 'Quiet Detour to Chiklihole Reservoir',
            desc: 'Visit this offbeat semi-circular reservoir surrounded by beautiful Dubare forest.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '11:30 AM',
            title: 'Spices & Coffee Shopping in Kushalnagar',
            desc: 'Purchase organic local spices, cardamom, and premium Robusta coffee powder directly from local growers.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '01:00 PM',
            title: 'Pristine Lunch & Final Departure',
            desc: 'Enjoy a delicious lunch in town before departing on the highway home.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        } else {
          // Late departure (after 3 PM)
          activities.push({
            time: '08:30 AM',
            title: 'Breakfast & Morning Leisure',
            desc: 'Enjoy breakfast and a quiet morning poolside or walking on resort grounds.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '10:30 AM',
            title: 'Quiet Detour to Chiklihole Reservoir',
            desc: 'Relax at this offbeat semi-circular reservoir surrounded by the beautiful Dubare forest range.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '12:00 PM',
            title: 'Kaveri River Walk & Scenic Photos',
            desc: 'Take a quiet walk along the Cauvery river banks under giant deciduous trees.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '01:30 PM',
            title: 'Coorg Traditional Lunch & Shopping',
            desc: 'Have a delicious lunch in town and pick up some high-quality Robusta coffee and spices before checking out.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '03:30 PM',
            title: 'Final Checkout & Departure',
            desc: 'Checkout of Dreamy Vacations and begin your return road trip.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        }
      } else {
        // Mid Days (e.g. Day 2, Day 3)
        if (d === 2) {
          // Day 2 is ALWAYS the complete Madikeri Highlands Circuit!
          activities.push({
            time: '07:30 AM',
            title: 'Mandalpatti Peak 4x4 Off-Road Jeep Safari',
            desc: 'Start early from Kushalnagar towards Madikeri. Climb up the misty Mandalpatti Peak in an off-road jeep to enjoy breathtaking mountain ridge views above the clouds.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '11:30 AM',
            title: 'Abbey Falls Coffee Estate Walk',
            desc: 'Walk down concrete steps through dense cardamom and coffee plantations to see Abbey Falls roaring down 70 feet. Spectacular mist-sprayed views.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '01:00 PM',
            title: 'Traditional Coorg Lunch near Madikeri',
            desc: 'Dine at a premium local Coorg restaurant to experience local culinary delights.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '02:30 PM',
            title: 'Organic Coffee Estate Walk',
            desc: 'Walk through leafy cardamom and coffee plantation nurseries to learn how fine coffee is curated.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '05:00 PM',
            title: 'Sunset View at Raja’s Seat',
            desc: 'Watch the beautiful sunset as mist engulfs the valleys, offering royal views once enjoyed by the Kings of Coorg.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '06:30 PM',
            title: 'Return to Dreamy Vacations Base',
            desc: 'Head back to Kushalnagar. Plunge into our outdoor pool to refresh.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '07:30 PM',
            title: 'Campfire & Dinner at Resort',
            desc: 'Gather around a cozy campfire under a starry sky at Dreamy Vacations, followed by a hot dinner.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        } else if (d === 3) {
          // Day 3: Relaxed Kushalnagar circuit (if trip has 3+ days, this is our shopping & relax day)
          activities.push({
            time: '08:30 AM',
            title: 'Breakfast & Resort Relaxation',
            desc: 'Have breakfast and spend the morning enjoying the resort amenities.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '10:00 AM',
            title: 'Quiet Detour to Chiklihole Reservoir',
            desc: 'Explore this offbeat semi-circular reservoir surrounded by beautiful Dubare forest. Quiet, secluded, and serene.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '11:30 AM',
            title: 'Spices & Coffee Shopping in Kushalnagar',
            desc: 'Purchase organic local spices, cardamom, and premium Robusta coffee powder directly from local growers.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '01:00 PM',
            title: 'Local Handicrafts Shopping & Lunch',
            desc: 'Explore local Tibetan singing bowl, incense, carpet stalls, and enjoy a traditional lunch.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '03:00 PM',
            title: 'High-Tech Rain Dance & Swimming Pool Session',
            desc: 'Relax inside Dreamy Vacations. Plunge into the outdoor pool and dance to custom tunes in our rain dance arena.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '07:30 PM',
            title: 'Cozy Campfire & Dinner',
            desc: 'A delightful campfire night with music and hot multi-cuisine dinner buffet at the resort.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        } else {
          // Other mid days (if 4+ days)
          activities.push({
            time: '09:00 AM',
            title: 'Kaveri River Walk & Nature Walk',
            desc: 'Enjoy a serene morning walking along the river bank.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '01:00 PM',
            title: 'Lunch & Resort Activities',
            desc: 'Feast on a local buffet and spend a lazy afternoon at the resort.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
          activities.push({
            time: '07:30 PM',
            title: 'Buffet Dinner & Rest',
            desc: 'Wrap up your day with a comforting dinner and sound sleep.',
            mapsUrl: 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9'
          });
        }
      }
    }

    itinerary.push({
      dayNum: d,
      dayName: dayStr,
      activities
    });
  }

  return itinerary;
}
