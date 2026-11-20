import { BlogPost } from './types';

export const PLACES_TO_VISIT_POST: Record<string, BlogPost> = {
  'places-to-visit-in-coorg': {
    title: 'Best Places to Visit in Coorg: 25 Attractions & Geographical Travel Guide',
    seoTitle: 'Best Places to Visit in Coorg: 25 Attractions & Travel Guide',
    metaDesc:
      'Explore 25 of the best places to visit in Coorg—grouped region by region from Kushalnagar and Bylakuppe to Madikeri, Somwarpet, and South Coorg.',
    primaryKeyword: 'Best places to visit in Coorg',
    secondaryKeywords: [
      'places to visit in Coorg',
      'Coorg tourist places',
      'Kushalnagar attractions',
      'Madikeri sightseeing',
      'Coorg sightseeing by region',
    ],
    category: 'Complete Travel Guides',
    heroImg: '/images/places/md.jpeg',
    heroAlt: 'Misty green hills and sweeping valleys of Coorg in the Western Ghats, Karnataka',
    heroCaption:
      'Morning clouds drift across Coorg’s green hills—just one side of a district that also holds quiet Tibetan monasteries, river islands, and coffee lanes.',
    publishedDate: '2026-11-20',
    updatedDate: '2026-11-20',
    readTime: '16 min read',
    featuredRank: 1,
    discoverPoints: [
      '25 of the best places to visit in Coorg, organized by region so you avoid backtracking.',
      'Real distances from Kushalnagar or Madikeri, suggested visit times, and honest travel tips.',
      'Which spots work smoothly for families, kids, and seniors—and which ones involve steep climbs.',
      'Ready-to-use regional day groupings for Eastern, Central, Northern, and Southern Coorg.',
    ],
    quickSummary: {
      heading: 'Planning Your Coorg Trip?',
      subtitle: 'What helps most before you map out your sightseeing days.',
      items: [
        {
          label: 'Best for',
          value: 'Families, couples, road trippers, and nature lovers.',
        },
        {
          label: 'Recommended duration',
          value: '2 to 3 days for Kushalnagar & Madikeri; 4+ days if adding North or South Coorg.',
        },
        {
          label: 'Main starting point',
          value: 'Kushalnagar (easy arrival from Bengaluru and Mysuru on gentle roads).',
        },
        {
          label: 'Best travel approach',
          value: 'Explore Coorg region by region rather than chasing scattered spots across the map.',
        },
        {
          label: 'Important note',
          value: 'Distances and driving times vary with weekend traffic, weather, and estate road conditions.',
        },
      ],
    },
    tocGroups: [
      {
        region: 'Eastern Coorg',
        subtitle: 'Kushalnagar & Bylakuppe (1–8)',
        sectionId: 'eastern-coorg-kushalnagar',
        items: [
          { id: 'namdroling-monastery-golden-temple', label: '1. Namdroling Monastery (Golden Temple)' },
          { id: 'bylakuppe-tibetan-settlement', label: '2. Bylakuppe Tibetan Settlement' },
          { id: 'kaveri-nisargadhama', label: '3. Kaveri Nisargadhama' },
          { id: 'dubare-elephant-camp', label: '4. Dubare Elephant Camp' },
          { id: 'harangi-dam-tree-park', label: '5. Harangi Dam & Tree Park' },
          { id: 'chiklihole-reservoir', label: '6. Chiklihole Reservoir' },
          { id: 'kushalnagar-coffee-estates', label: '7. Eastern Coorg Coffee Estates' },
          { id: 'tibetan-handicraft-markets', label: '8. Bylakuppe Crafts & Spice Markets' },
        ],
      },
      {
        region: 'Central & Western Coorg',
        subtitle: 'Madikeri & Hills (9–18)',
        sectionId: 'central-western-coorg-madikeri',
        items: [
          { id: 'madikeri-town', label: '9. Madikeri Town & Markets' },
          { id: 'abbey-falls', label: '10. Abbey Falls' },
          { id: 'rajas-seat', label: '11. Raja’s Seat' },
          { id: 'madikeri-fort', label: '12. Madikeri Fort' },
          { id: 'omkareshwara-temple', label: '13. Omkareshwara Temple' },
          { id: 'mandalpatti-peak', label: '14. Mandalpatti Peak' },
          { id: 'talacauvery', label: '15. Talacauvery' },
          { id: 'bhagamandala', label: '16. Bhagamandala' },
          { id: 'rajas-tomb-gaddige', label: '17. Raja’s Tomb (Gaddige)' },
          { id: 'chelavara-falls', label: '18. Chelavara Falls' },
        ],
      },
      {
        region: 'Northern Coorg',
        subtitle: 'Somwarpet & Pushpagiri (19–22)',
        sectionId: 'northern-coorg-somwarpet',
        items: [
          { id: 'mallalli-falls', label: '19. Mallalli Falls' },
          { id: 'honnamana-kere-lake', label: '20. Honnamana Kere Lake' },
          { id: 'somwarpet-kotebetta', label: '21. Somwarpet & Kotebetta Peak' },
          { id: 'pushpagiri-wildlife-sanctuary', label: '22. Pushpagiri Wildlife Sanctuary' },
        ],
      },
      {
        region: 'Southern Coorg',
        subtitle: 'Virajpet, Kakkabe & Kutta (23–25)',
        sectionId: 'southern-coorg-virajpet',
        items: [
          { id: 'iruppu-falls', label: '23. Iruppu Falls' },
          { id: 'nagarhole-tiger-reserve', label: '24. Nagarhole Tiger Reserve' },
          { id: 'tadiandamol-peak', label: '25. Tadiandamol Peak' },
        ],
      },
    ],
    intro: [
      'Planning a trip to Coorg? The first thing to know is that its best sights are spread across four very different parts of the district. Kushalnagar in the east is an easy starting point for the Golden Temple, Dubare Elephant Camp, and Nisargadhama. Madikeri, about 30 km further west in the hills, is where you will find Abbey Falls, Raja’s Seat, and Mandalpatti.',
      'Many online lists toss twenty waterfalls and viewpoints together as if they sit right next to one another. In reality, Coorg’s winding country roads take time, so grouping your stops by region is the simplest way to see more and enjoy the journey instead of spending your holiday stuck in the car.',
    ],
    sections: [
      {
        id: 'coorg-region-snapshot',
        regionLabel: 'Before You Set Off',
        heading: 'How Coorg’s Four Regions Fit Together',
        paragraphs: [
          'Think of Coorg like four distinct neighbourhoods connected by scenic two-lane roads. If you have two or three days, pairing Eastern Coorg (around Kushalnagar) with Central Coorg (around Madikeri) gives you monasteries, rivers, coffee estates, waterfalls, and hill views with very little backtracking.',
          'Northern Coorg (Somwarpet) and Southern Coorg (Virajpet and Kutta) are wonderfully lush and quieter, though they sit further out. Keep those for a 3- to 4-day trip so your days feel unhurried.',
        ],
        table: {
          caption: 'At a Glance: Coorg’s Four Sightseeing Regions',
          headers: ['Region', 'Main Town', 'What It’s Known For', 'Approximate Distance Reference'],
          rows: [
            [
              'Eastern Coorg',
              'Kushalnagar & Bylakuppe',
              'Golden Temple, Tibetan cafés, Nisargadhama, Dubare, Harangi, Chiklihole',
              '4–16 km around Kushalnagar on gentle roads',
            ],
            [
              'Central & Western Coorg',
              'Madikeri & Bhagamandala',
              'Abbey Falls, Raja’s Seat, Madikeri Fort, Mandalpatti, Talacauvery',
              '~30 km west of Kushalnagar to Madikeri; Talacauvery is ~44 km past Madikeri',
            ],
            [
              'Northern Coorg',
              'Somwarpet',
              'Mallalli Falls, Honnamana Kere Lake, Kotebetta, Pushpagiri foothills',
              '~45–65 km north of Kushalnagar / ~40–55 km north of Madikeri',
            ],
            [
              'Southern Coorg',
              'Virajpet, Kakkabe & Kutta',
              'Iruppu Falls, Nagarhole Tiger Reserve, Tadiandamol Peak',
              '~55–85 km south of Kushalnagar / ~45–80 km south of Madikeri',
            ],
          ],
        },
        links: [
          { label: 'Read the 2-Day Coorg Trip Plan', to: '/blog/coorg-trip-plan-2-days' },
          { label: 'See the 3-Day Coorg Itinerary', to: '/blog/3-day-coorg-itinerary' },
          { label: 'Check the Best Time to Visit Coorg', to: '/blog/best-time-to-visit-coorg' },
          { label: 'Where to Stay in Coorg', to: '/blog/where-to-stay-in-coorg' },
        ],
      },
      {
        id: 'eastern-coorg-kushalnagar',
        regionLabel: 'Region 01 · Eastern Coorg',
        heading: 'Kushalnagar & Bylakuppe: Monasteries, Rivers & Gentle Drives (1–8)',
        paragraphs: [
          'If you are driving in from Bengaluru or Mysuru, Kushalnagar is the first part of Coorg you reach. The roads here are wider and gentler than the steep hills further west, which makes Day 1 feel effortless—especially if you are travelling with kids or older parents.',
          'Within 10 to 25 minutes of Kushalnagar, you can step into a peaceful Tibetan monastery, cross a bamboo footbridge over the River Cauvery, watch elephants at Dubare, and finish the afternoon beside a quiet forest reservoir.',
        ],
        pullQuote: {
          text: 'Start your Coorg trip in Kushalnagar and your first day feels like a holiday right away—short drives, flat paths, and no uphill fatigue after the highway.',
          note: 'Eastern Coorg clusters eight rewarding stops within 4–16 km of Kushalnagar.',
        },
        attractions: [
          {
            id: 'namdroling-monastery-golden-temple',
            number: 1,
            name: 'Namdroling Monastery (Golden Temple)',
            tagline: 'A peaceful pocket of Tibetan culture right beside Coorg.',
            summary:
              'Step through the gates in Bylakuppe and Coorg suddenly feels a world away. Founded in 1963, Namdroling Monastery is famous for its golden roofs, painted prayer halls, and towering gilded statues of Buddha Shakyamuni (60 ft), Guru Padmasambhava (58 ft), and Buddha Amitayus (58 ft).',
            whyVisit:
              'Even if you have visited dozens of temples across India, the colour, quiet chanting, and calm lawns here create a genuinely memorable atmosphere. Wide, level walkways also make it effortless for families and seniors.',
            image: {
              src: '/images/places/gold.jpeg',
              alt: 'Ornate golden roof and red-and-gold courtyard of Namdroling Monastery in Bylakuppe near Kushalnagar',
              caption: 'Morning light on the gilded rooftops of Namdroling Monastery in Bylakuppe.',
            },
            details: {
              location: 'Bylakuppe (near Kushalnagar)',
              distance: 'Approx. 6 km from Kushalnagar',
              duration: '1.5 to 2 hours',
              bestTime: 'Morning (8:30–10:30 AM) or late afternoon (4:00–5:30 PM)',
            },
            tip: 'Dress modestly with shoulders and knees covered, remove footwear before entering prayer halls, and keep phones silent inside.',
            layout: 'wide',
          },
          {
            id: 'bylakuppe-tibetan-settlement',
            number: 2,
            name: 'Bylakuppe Tibetan Settlement & Monasteries',
            tagline: 'Quiet country lanes, prayer flags, and steaming bowls of thukpa.',
            summary:
              'Most travellers visit the Golden Temple and leave right away, missing the wider Tibetan settlement around it. Established in the 1960s, Bylakuppe’s villages are lined with fluttering prayer flags, community bakeries, and historic monastic colleges like Sera Jey and Sera Mey.',
            whyVisit:
              'Taking an extra hour to stroll the lanes and sit down for freshly steamed momos, hand-pulled thenthuk noodle soup, or butter tea adds a warm cultural layer you will not find anywhere else in Karnataka.',
            details: {
              location: 'Bylakuppe settlement camps',
              distance: 'Approx. 5–8 km east of Kushalnagar',
              duration: '1.5 to 2 hours (including lunch)',
              bestTime: 'Late morning through lunch, year-round',
            },
            tip: 'Ask politely before photographing monks or monastic courtyards, and try a local Tibetan café around Camp 1 for lunch.',
            layout: 'editorial',
          },
          {
            id: 'kaveri-nisargadhama',
            number: 3,
            name: 'Kaveri Nisargadhama',
            tagline: 'A shaded bamboo river island reached across a swaying footbridge.',
            summary:
              'Formed by two curving arms of the River Cauvery, Kaveri Nisargadhama is a 64-acre forest island carpeted with tall bamboo groves and teak trees. You enter across a wooden hanging bridge and follow level, shaded trails past deer enclosures and riverside viewpoints.',
            whyVisit:
              'Because the bamboo canopy blocks the midday sun, Nisargadhama is one of the best places to visit right after lunch—especially for families with young children or grandparents who prefer easy flat walks.',
            image: {
              src: '/images/places/nisa.jpeg',
              alt: 'Shaded bamboo forest path and hanging bridge crossing into Kaveri Nisargadhama near Kushalnagar',
              caption: 'Towering bamboo groves keep Kaveri Nisargadhama cool even on warm afternoons.',
            },
            details: {
              location: 'NH 275, near Kushalnagar',
              distance: 'Approx. 4 km west of Kushalnagar',
              duration: '1 to 1.5 hours',
              bestTime: 'Late morning to mid-afternoon (11:30 AM – 3:30 PM)',
            },
            tip: 'Keep snacks tucked inside zipped bags around monkeys, and avoid stepping into deep river currents where bathing is restricted.',
            layout: 'split-left',
          },
          {
            id: 'dubare-elephant-camp',
            number: 4,
            name: 'Dubare Elephant Camp',
            tagline: 'Watch Asian elephants along the forested banks of the Cauvery.',
            summary:
              'Run by the Karnataka Forest Department on a quiet bend of the River Cauvery, Dubare is a dedicated camp where elephants spend their mornings bathing, getting scrubbed by their mahouts, and having their morning meal.',
            whyVisit:
              'Children and adults alike remember watching elephants splash in the shallow river water up close. In calmer post-monsoon and winter months, gentle still-water rafting also operates along this forest stretch.',
            image: {
              src: '/images/places/dubare.jpeg',
              alt: 'Elephants resting along the forested Cauvery riverbank at Dubare Elephant Camp in Coorg',
              caption: 'Arrive early at Dubare to watch the morning river care routine before crowds build.',
            },
            details: {
              location: 'Nanjarayapatna / Dubare forest belt',
              distance: 'Approx. 14 km from Kushalnagar',
              duration: '2 to 2.5 hours',
              bestTime: 'Arrive by 8:15–8:30 AM (October to May is smoothest)',
            },
            tip: 'Wear sandals that can handle water and river stones. During peak July–August monsoon floods, boat crossings and rafting may pause for safety.',
            layout: 'split-right',
          },
          {
            id: 'harangi-dam-tree-park',
            number: 5,
            name: 'Harangi Dam & Tree Park',
            tagline: 'Wide reservoir breezes, green lawns, and seasonal spillway views.',
            summary:
              'Built across a tributary of the Cauvery, Harangi Dam stretches between wooded hills with terraced gardens and a leafy Tree Park right alongside. In monsoon and post-monsoon months, open crest gates send dramatic curtains of white water crashing down the masonry wall.',
            whyVisit:
              'Harangi feels open, breezy, and unhurried. It is an easy late-afternoon stop where children have space to walk around and elders can sit and enjoy the cool breeze off the water.',
            image: {
              src: '/images/places/harangi.jpeg',
              alt: 'Expansive backwaters and green hills surrounding Harangi Dam near Kushalnagar in Coorg',
              caption: 'Calm reservoir views and cool evening breezes at Harangi Dam.',
            },
            details: {
              location: 'Hudgur village area, near Kushalnagar',
              distance: 'Approx. 9 km northwest of Kushalnagar',
              duration: '1 to 1.5 hours',
              bestTime: 'Early morning or 4:00–5:30 PM (July to December for peak water flow)',
            },
            tip: 'Pair Harangi with Nisargadhama or the Golden Temple on the same day—both sit within 15 minutes of Kushalnagar.',
            layout: 'split-left',
          },
          {
            id: 'chiklihole-reservoir',
            number: 6,
            name: 'Chiklihole Reservoir',
            tagline: 'A quiet, crowd-free forest reservoir with a curved spillway.',
            summary:
              'Tucked along the peaceful edge of Dubare forest between Kushalnagar and Siddapur, Chiklihole is one of eastern Coorg’s loveliest quiet corners. Its semi-circular stone weir overflows in a smooth sheet of water during and after the rains.',
            whyVisit:
              'Unlike busier tourist spots, there are no noisy stalls or long queues here—just birdsong, woodland reflections, and soft late-afternoon light across the water.',
            image: {
              src: '/images/places/chick.jpeg',
              alt: 'Peaceful waters and semi-circular spillway of Chiklihole Reservoir bordered by Coorg forest',
              caption: 'Chiklihole Reservoir stays remarkably quiet in the late afternoon.',
            },
            details: {
              location: 'Between Kushalnagar and Siddapur',
              distance: 'Approx. 14–16 km from Kushalnagar',
              duration: '45 to 60 minutes',
              bestTime: 'Late afternoon (4:00–5:30 PM); July to November for spillway overflow',
            },
            tip: 'There are no shops or restrooms on-site—carry water, stay back from slippery wet edges, and head out before dusk.',
            layout: 'split-right',
          },
          {
            id: 'kushalnagar-coffee-estates',
            number: 7,
            name: 'Eastern Coorg Coffee Estates & Countryside Walks',
            tagline: 'Shaded Robusta coffee, black pepper vines, and fragrant spring blooms.',
            summary:
              'Head down the country lanes around Chikkathur, Kudumangalore, Suntikoppa, or Siddapur and you are immediately surrounded by working coffee plantations. Silver oak trees shade Robusta coffee bushes, while black pepper vines curl up every trunk.',
            whyVisit:
              'A guided estate walk shows how Coorg’s coffee goes from crimson berry to roasted bean. Visit right after the first March or April rain showers and the entire countryside smells of white coffee blossoms.',
            details: {
              location: 'Chikkathur, Suntikoppa & Siddapur lanes',
              distance: 'Approx. 2–15 km from Kushalnagar',
              duration: '1 to 2 hours',
              bestTime: 'Morning walks; March–April for blossoms, Dec–Feb for harvest',
            },
            tip: 'Always book a participating plantation tour rather than stepping uninvited into private estates.',
            layout: 'editorial',
          },
          {
            id: 'tibetan-handicraft-markets',
            number: 8,
            name: 'Bylakuppe Craft Shops & Kushalnagar Spice Markets',
            tagline: 'Bring home freshly roasted coffee, spices, and Tibetan handicrafts.',
            summary:
              'Skip generic highway souvenir stalls and browse two genuine local shopping pockets instead: the Tibetan cooperative arcades near Namdroling Monastery for woven rugs, singing bowls, and incense, and Kushalnagar’s roasteries for freshly ground filter coffee and spices.',
            whyVisit:
              'Everything is on flat ground, easy to browse in under an hour, and gives you authentic Coorg black pepper, green cardamom, forest honey, and dark-roast coffee straight from local merchants.',
            details: {
              location: 'Bylakuppe monastery arcade & Kushalnagar town',
              distance: 'Approx. 3–6 km from Kushalnagar / Chikkathur',
              duration: '45 to 60 minutes',
              bestTime: 'Late morning or late afternoon',
            },
            tip: 'When buying filter coffee powder, ask the roaster whether you want 100% pure coffee or a traditional coffee-and-chicory blend.',
            layout: 'editorial',
          },
        ],
        links: [
          { label: 'Kushalnagar Tourist Places Guide', to: '/blog/kushalnagar-tourist-places' },
          { label: 'Bylakuppe Tibetan Settlement Guide', to: '/blog/bylakuppe-tibetan-settlement-guide' },
          { label: 'Dubare Elephant Camp Guide', to: '/blog/dubare-elephant-camp-guide' },
          { label: 'Kaveri Nisargadhama Guide', to: '/blog/nisargadhama-guide' },
        ],
      },
      {
        id: 'central-western-coorg-madikeri',
        regionLabel: 'Region 02 · Central & Western Coorg',
        heading: 'Madikeri & Western Hills: Waterfalls, Peaks & Heritage (9–18)',
        paragraphs: [
          'Drive about 30 km west from Kushalnagar along NH 275 and the road gently climbs into the cooler hills around Madikeri. At roughly 1,150 metres elevation, the air turns crisper, mist curls over the valleys, and coffee estates hug every curve.',
          'This is where you will find Coorg’s famous hill landmarks—Abbey Falls, Raja’s Seat, Madikeri Fort, and the jeep trail up to Mandalpatti Peak—plus the sacred river source at Talacauvery further southwest.',
        ],
        pullQuote: {
          text: 'Give Madikeri an early morning start. You beat weekend hill traffic, catch clear skies at Mandalpatti, and still have time for a relaxed Kodava lunch.',
          note: 'Madikeri sits roughly 30 km west of Kushalnagar along NH 275.',
        },
        attractions: [
          {
            id: 'madikeri-town',
            number: 9,
            name: 'Madikeri Town & Heritage Streets',
            tagline: 'Coorg’s lively hilltop capital with local bakeries and Kodava eateries.',
            summary:
              'Perched along tiered mountain ridges, Madikeri is the historic heart of Kodagu. Its winding streets mix colonial-era stone buildings, bustling spice markets, and cosy family-run restaurants serving traditional Kodava lunches.',
            whyVisit:
              'It makes a natural midday anchor on your Madikeri day loop—park once near the centre, enjoy steamed rice dumplings (kadambuttu) or rice flatbreads (akki otti), and walk to the fort and temple nearby.',
            details: {
              location: 'Central Coorg',
              distance: 'Approx. 30 km west of Kushalnagar',
              duration: '1 to 1.5 hours (including lunch)',
              bestTime: 'Late morning or lunchtime; quieter on weekdays',
            },
            tip: 'Weekend parking gets tight between 12:30 PM and 5:00 PM. Park once near the main town square and explore nearby sights on foot.',
            layout: 'editorial',
          },
          {
            id: 'abbey-falls',
            number: 10,
            name: 'Abbey Falls',
            tagline: 'A 70-foot waterfall tumbling through private coffee and cardamom estates.',
            summary:
              'Tucked inside lush spice plantations just outside Madikeri, Abbey Falls drops roughly 70 feet over dark granite boulders into a misty gorge. A sturdy hanging footbridge faces the cascade directly so you can feel the cool spray safely.',
            whyVisit:
              'Even the walk in is lovely—you descend a shaded staircase lined with coffee bushes and pepper vines before the roar of the water opens up ahead of you.',
            image: {
              src: '/images/places/ab.jpeg',
              alt: 'Abbey Falls cascading down dark rocks surrounded by green coffee plantations near Madikeri',
              caption: 'Abbey Falls surges strongest between July and December after the monsoon rains.',
            },
            details: {
              location: 'Near Madikeri',
              distance: 'Approx. 8 km from Madikeri (~37 km from Kushalnagar)',
              duration: '45 to 60 minutes',
              bestTime: 'Morning or early afternoon; July to December for full flow',
            },
            tip: 'Expect roughly 150–200 concrete steps down and back up—take it slow with seniors, wear grip footwear, and note that swimming is strictly prohibited.',
            layout: 'wide',
          },
          {
            id: 'rajas-seat',
            number: 11,
            name: 'Raja’s Seat',
            tagline: 'Coorg’s classic sunset garden looking out over layered green valleys.',
            summary:
              'Once the favourite evening spot of Kodagu’s kings, Raja’s Seat is a cliffside terraced garden with seasonal flowers, a stone pavilion, and sweeping views across mist-filled western valleys.',
            whyVisit:
              'On clear evenings the sky shifts from gold to violet above rolling hills, while early mornings often reveal a thick white sea of fog drifting below the ridge. Paved paths make it comfortable for every age group.',
            image: {
              src: '/images/places/raja.jpeg',
              alt: 'Terraced hillside garden and stone pavilion overlooking misty valleys at Raja’s Seat in Madikeri',
              caption: 'Early morning mist or golden-hour light makes Raja’s Seat worth the visit.',
            },
            details: {
              location: 'Central Madikeri',
              distance: 'Approx. 1 km from Madikeri centre (~31 km from Kushalnagar)',
              duration: '45 to 75 minutes',
              bestTime: 'Sunrise (6:00–7:30 AM) or sunset (4:45–6:15 PM)',
            },
            tip: 'Arrive at least 45 minutes before sunset on weekends so you can settle into a good viewing spot without rushing.',
            layout: 'split-left',
          },
          {
            id: 'madikeri-fort',
            number: 12,
            name: 'Madikeri Fort & Palace Museum',
            tagline: 'Granite ramparts, life-size stone elephants, and centuries of Kodagu history.',
            summary:
              'Originally built in the late 1600s and later fortified in stone, Madikeri Fort stands right in town with massive granite walls, two life-size stone elephants guarding the courtyard, a clock tower, and a small museum housed inside St. Mark’s Church.',
            whyVisit:
              'It offers a quick, rewarding glimpse into Kodagu’s royal history without any strenuous walking—and sits less than a kilometre from Omkareshwara Temple.',
            details: {
              location: 'Central Madikeri',
              distance: 'Approx. 30 km west of Kushalnagar',
              duration: '45 to 60 minutes',
              bestTime: 'Morning or early afternoon',
            },
            tip: 'Check locally for the inner museum’s weekly closing day (historically Monday or Tuesday); the outer fort courtyard stays pleasant to walk around.',
            layout: 'editorial',
          },
          {
            id: 'omkareshwara-temple',
            number: 13,
            name: 'Omkareshwara Temple',
            tagline: 'A tranquil 1820 Shiva shrine blending tiled Kerala roofs with domes.',
            summary:
              'Built in 1820 by King Lingarajendra II, Omkareshwara Temple looks unlike almost any other shrine in Karnataka. Its tiled Kodava-Kerala rooflines meet a central dome and four corner minarets overlooking a calm stone water tank.',
            whyVisit:
              'Step inside from busy Madikeri streets and the courtyard instantly slows down. The reflection of the temple in the fish-filled pond makes it a serene stop for all ages.',
            details: {
              location: 'Central Madikeri (under 1 km from Madikeri Fort)',
              distance: 'Approx. 30 km west of Kushalnagar',
              duration: '30 to 45 minutes',
              bestTime: 'Morning (6:30 AM – 12:00 PM) or evening (5:00–8:00 PM)',
            },
            tip: 'Dress conservatively and plan around the midday temple closure between noon and 5:00 PM.',
            layout: 'editorial',
          },
          {
            id: 'mandalpatti-peak',
            number: 14,
            name: 'Mandalpatti Peak',
            tagline: 'A thrilling 4x4 jeep climb into open cloud-swept mountain grasslands.',
            summary:
              'Rising roughly 1,600 metres along the Pushpagiri Reserve Forest border, Mandalpatti opens onto dramatic 360-degree mountain ridges where fast-moving clouds sweep straight across emerald slopes.',
            whyVisit:
              'If you want that iconic "standing above the clouds" Coorg photograph, this is the place. Personal cars park at the lower checkpost and registered local 4x4 jeeps tackle the steep, rocky hillside track.',
            image: {
              src: '/images/places/md.jpeg',
              alt: 'Rolling green mountain ridges and drifting morning clouds at Mandalpatti Peak in Coorg',
              caption: 'Early mornings bring the clearest ridge views at Mandalpatti before afternoon mist rolls in.',
            },
            details: {
              location: 'North of Madikeri (Pushpagiri border)',
              distance: 'Approx. 18–20 km from Madikeri (~48–50 km from Kushalnagar)',
              duration: '2.5 to 3 hours round-trip from the jeep stand',
              bestTime: 'Early morning (6:30–10:30 AM), October to March',
            },
            tip: 'The jeep track is bumpy and steep—skip it during heavy July–August monsoon rain alerts, or if travelling with infants, expectant mothers, or anyone with back trouble.',
            layout: 'split-right',
          },
          {
            id: 'talacauvery',
            number: 15,
            name: 'Talacauvery',
            tagline: 'The sacred hillside origin of the River Cauvery on Brahmagiri Hill.',
            summary:
              'High in the Brahmagiri hills southwest of Madikeri sits Talacauvery, revered as the traditional source of the River Cauvery. Pilgrims gather beside the small sacred Brahmakundike spring, while a stepped path climbs up to a sweeping hilltop viewpoint.',
            whyVisit:
              'The drive itself—winding through green valleys and quiet estates—is half the magic. On clear winter mornings, views from the upper Brahmagiri steps stretch all the way across misty Western Ghats ridges.',
            details: {
              location: 'Brahmagiri Hill, western Coorg',
              distance: 'Approx. 44 km southwest of Madikeri (~74 km from Kushalnagar)',
              duration: '1.5 hours',
              bestTime: 'Morning hours; October to March for clear hill views',
            },
            tip: 'Because Talacauvery sits further west, save it for a 3- or 4-day trip and pair it naturally with Bhagamandala on the same drive.',
            layout: 'editorial',
          },
          {
            id: 'bhagamandala',
            number: 16,
            name: 'Bhagamandala (Triveni Sangam)',
            tagline: 'A peaceful riverside temple where three sacred streams meet.',
            summary:
              'Set at the quiet foothills 8 km below Talacauvery, Bhagamandala marks the confluence (Triveni Sangam) of the Cauvery, Kannike, and mythical Sujyoti rivers, right next to the graceful, copper-roofed Sri Bhagandeshwara Temple.',
            whyVisit:
              'Its calm, flat riverside ghats and traditional Kerala-style temple woodwork feel unhurried and deeply atmospheric, making it an easy stop before or after climbing to Talacauvery.',
            details: {
              location: 'Foothills below Talacauvery',
              distance: 'Approx. 36 km southwest of Madikeri (~66 km from Kushalnagar)',
              duration: '45 to 60 minutes',
              bestTime: 'Morning, paired with Talacauvery',
            },
            tip: 'Follow modest temple dress guidelines and check local darshan timings if planning a midday stop.',
            layout: 'editorial',
          },
          {
            id: 'rajas-tomb-gaddige',
            number: 17,
            name: 'Raja’s Tomb (Gaddige)',
            tagline: 'Quiet domed royal mausoleums set on a peaceful Madikeri hillock.',
            summary:
              'Just north of Madikeri town, Gaddige preserves the Indo-Saracenic domed tombs of Kodagu’s Haleri dynasty kings, surrounded by carved stone Nandi figures and manicured lawns.',
            whyVisit:
              'While Raja’s Seat gets busy every evening, Gaddige remains calm and uncrowded—ideal for a peaceful 30-minute stop with lovely architecture and gentle views over town.',
            details: {
              location: 'North edge of Madikeri town',
              distance: 'Approx. 1.5 km from Madikeri centre (~31 km from Kushalnagar)',
              duration: '30 to 45 minutes',
              bestTime: 'Morning or late afternoon',
            },
            tip: 'Easy to slot in right after visiting Madikeri Fort or on your way back from Abbey Falls.',
            layout: 'editorial',
          },
          {
            id: 'chelavara-falls',
            number: 18,
            name: 'Chelavara Falls',
            tagline: 'A wild, secluded 150-foot cascade hidden deep inside coffee country.',
            summary:
              'Tumbling roughly 150 feet over a tortoise-shaped rock face near Cheyyandane village, Chelavara feels far rawer and quieter than Abbey Falls, framed entirely by thick forest and coffee estates.',
            whyVisit:
              'If you love off-the-beaten-track waterfalls and do not mind a steep, muddy forest path, Chelavara rewards you with peaceful scenery and very few crowds.',
            details: {
              location: 'Near Cheyyandane, south of Madikeri',
              distance: 'Approx. 36–40 km south of Madikeri (~65 km from Kushalnagar)',
              duration: '1 hour',
              bestTime: 'September to January when stream flow is steady',
            },
            tip: 'Wear sturdy grip shoes for the steep descent and never step into the deep pool at the base—the undercurrents are dangerous.',
            layout: 'editorial',
          },
        ],
        links: [
          { label: 'Mandalpatti Peak 4x4 Jeep Guide', to: '/blog/mandalpatti-guide' },
          { label: 'Abbey Falls Practical Guide', to: '/blog/abbey-falls-guide' },
          { label: 'Raja’s Seat Sunset Guide', to: '/blog/rajas-seat-madikeri-guide' },
          { label: 'Talacauvery & Bhagamandala Guide', to: '/blog/talacauvery-and-bhagamandala-travel-guide' },
        ],
      },
      {
        id: 'northern-coorg-somwarpet',
        regionLabel: 'Region 03 · Northern Coorg',
        heading: 'Somwarpet & Pushpagiri: Big Waterfalls, Quiet Lakes & Peaks (19–22)',
        paragraphs: [
          'Head north from Kushalnagar or Madikeri into Somwarpet taluk and Coorg slows down noticeably. Fewer tour buses travel up here, leaving behind misty estate roads, towering waterfalls, and some of Karnataka’s finest mountain ridges.',
          'Because these spots sit roughly 40 to 65 km north of Kushalnagar or Madikeri, plan them as a dedicated half-day or full-day drive on a 3- or 4-day holiday.',
        ],
        attractions: [
          {
            id: 'mallalli-falls',
            number: 19,
            name: 'Mallalli Falls',
            tagline: 'One of Coorg’s grandest waterfalls plunging over 200 feet.',
            summary:
              'Where the Kumaradhara River drops off the Pushpagiri foothills in two dramatic tiers, Mallalli Falls puts on a breathtaking show—surrounded by steep green valley walls and thick mist during wet months.',
            whyVisit:
              'For sheer scale, Mallalli easily rivals Abbey Falls and draws far fewer crowds on weekdays.',
            details: {
              location: 'Bettadahalli, near Somwarpet',
              distance: 'Approx. 53 km north of Kushalnagar (~55 km north of Madikeri)',
              duration: '1.5 to 2 hours',
              bestTime: 'July to December for dramatic water flow',
            },
            tip: 'Reaching the lower viewpoints involves climbing several hundred concrete steps—great for active travellers, but tough on sore knees.',
            layout: 'editorial',
          },
          {
            id: 'honnamana-kere-lake',
            number: 20,
            name: 'Honnamana Kere Lake',
            tagline: 'Coorg’s largest natural lake tucked inside a peaceful green valley.',
            summary:
              'Resting quietly beside Daddamalthe village near Somwarpet, Honnamana Kere is framed by coffee estates, rocky cliffs, and a small lakeside shrine dedicated to Goddess Honnamma.',
            whyVisit:
              'It is calm, flat, and easy to enjoy for all ages—making it a lovely, unhurried partner stop on the same northern drive as Mallalli Falls.',
            details: {
              location: 'Daddamalthe village, near Somwarpet',
              distance: 'Approx. 45 km north of Kushalnagar (~46 km from Madikeri)',
              duration: '45 to 60 minutes',
              bestTime: 'Early morning or late afternoon',
            },
            tip: 'Pair Honnamana Kere with Mallalli Falls on one relaxed North Coorg outing rather than making two separate trips.',
            layout: 'editorial',
          },
          {
            id: 'somwarpet-kotebetta',
            number: 21,
            name: 'Somwarpet Coffee Country & Kotebetta Peak',
            tagline: 'Quiet Arabica estates and Kodagu’s third-highest hiking peak.',
            summary:
              'Somwarpet is beloved by travellers who want Coorg’s greenery without weekend town buzz. Nearby rises Kotebetta (~1,620 m), whose fort-shaped ridge rewards hikers with sweeping 360-degree views across forest valleys.',
            whyVisit:
              'Hikers get a memorable half-day mountain trail, while non-trekkers can simply enjoy slow, scenic drives through some of Coorg’s quietest coffee estates.',
            details: {
              location: 'Somwarpet & Hattihole trailhead',
              distance: 'Somwarpet is ~40 km north of Kushalnagar; Kotebetta trailhead is ~22 km from Madikeri',
              duration: '3 to 4 hours for the Kotebetta hike',
              bestTime: 'Dry mornings from October to March',
            },
            tip: 'Hire a registered local guide for the Kotebetta trail and carry sufficient water—there are no shops along the ridge.',
            layout: 'editorial',
          },
          {
            id: 'pushpagiri-wildlife-sanctuary',
            number: 22,
            name: 'Pushpagiri Wildlife Sanctuary',
            tagline: 'Wild evergreen forests, mountain birds, and dramatic foothills.',
            summary:
              'Stretching across northern Kodagu’s high ridges, Pushpagiri protects thick Western Ghats evergreen forest, rare highland birds, and the challenging approach ridges of Kumara Parvatha—one of South India’s toughest treks.',
            whyVisit:
              'Even if you are not attempting the full mountain trek, the scenic outer forest roads around the Pushpagiri foothills feel wonderfully wild and untouched.',
            details: {
              location: 'Northern Coorg near Somwarpet / Beedahalli',
              distance: 'Approx. 55–65 km north of Kushalnagar',
              duration: 'Half-day scenic drive or full-day permitted trek',
              bestTime: 'October to February (dry season essential for trekking)',
            },
            tip: 'Forest trekking trails require official Karnataka Forest Department permits and strong fitness; families can enjoy Mallalli’s viewpoints instead.',
            layout: 'editorial',
          },
        ],
      },
      {
        id: 'southern-coorg-virajpet',
        regionLabel: 'Region 04 · Southern Coorg',
        heading: 'Virajpet, Kakkabe & Kutta: Safaris, High Peaks & Forest Falls (23–25)',
        paragraphs: [
          'Southern Coorg opens into broad rural valleys, dense wildlife forests along the Nagarhole border, and Kodagu’s highest trekking summit. Because these destinations lie 55 to 85 km south of Kushalnagar or Madikeri, they fit best into a 4-day itinerary or a dedicated wildlife-and-trekking trip.',
        ],
        attractions: [
          {
            id: 'iruppu-falls',
            number: 23,
            name: 'Iruppu Falls (Lakshmana Tirtha Falls)',
            tagline: 'A 170-foot forested cascade along a shaded Brahmagiri trail.',
            summary:
              'Pouring roughly 170 feet down tiered rock ledges in southern Coorg, Iruppu Falls begins past the historic Rameshwara Shiva Temple and leads you along a lush, leafy forest path right up to the spray.',
            whyVisit:
              'Between August and January the waterfall feels powerful and refreshing, and the wooded path makes the short walk genuinely scenic.',
            details: {
              location: 'Near Kutta, South Coorg',
              distance: 'Approx. 48 km from Virajpet (~80 km from Madikeri; ~85 km from Kushalnagar)',
              duration: '1.5 to 2 hours',
              bestTime: 'August to January',
            },
            tip: 'Monsoon paths can be slippery and attract leeches—wear sturdy footwear and pair Iruppu Falls with Nagarhole on a full South Coorg day.',
            layout: 'editorial',
          },
          {
            id: 'nagarhole-tiger-reserve',
            number: 24,
            name: 'Nagarhole Tiger Reserve (Rajiv Gandhi National Park)',
            tagline: 'Teak forests home to wild elephants, gaur, deer, leopards, and tigers.',
            summary:
              'Straddling the border of Kodagu and Mysuru as part of the Nilgiri Biosphere Reserve, Nagarhole is one of South India’s premier protected wildlife sanctuaries. Official forest department safaris take visitors deep into teak and bamboo forest trails.',
            whyVisit:
              'Even when big cats stay elusive, herds of wild elephants, towering Indian gaur, spotted deer, and forest birds make morning and afternoon safaris unforgettable for families with older kids.',
            details: {
              location: 'Nanachi Gate (near Kutta) or Veeranahosahalli Gate (near Hunsur)',
              distance: 'Veeranahosahalli Gate is ~50 km east of Kushalnagar; Nanachi Gate is ~80 km south',
              duration: 'Approx. 3 hours per safari slot',
              bestTime: 'October to May (dry months offer clearer sightings)',
            },
            tip: 'Book official Karnataka Forest Department safari slots well in advance—walk-in seats fill fast on weekends and holidays.',
            layout: 'editorial',
          },
          {
            id: 'tadiandamol-peak',
            number: 25,
            name: 'Tadiandamol Peak',
            tagline: 'Kodagu’s highest summit with sweeping green grassland ridges.',
            summary:
              'Standing at roughly 1,748 metres above Kakkabe village, Tadiandamol is Coorg’s highest peak. The well-marked trail winds up from Nalknad Palace through shaded shola forest before opening onto vast rolling grasslands.',
            whyVisit:
              'For active travellers who enjoy a rewarding day hike, the view from the summit over wave after wave of Western Ghats hills is hard to beat.',
            details: {
              location: 'Kakkabe, central-south Coorg',
              distance: 'Approx. 35–40 km south of Madikeri (~65 km from Kushalnagar)',
              duration: '4 to 5 hours round-trip hike',
              bestTime: 'Dry mornings from October to March',
            },
            tip: 'Start early before midday clouds roll in, register at the forest checkpost, wear proper trail shoes, and carry plenty of water.',
            layout: 'editorial',
          },
        ],
        links: [
          { label: 'See Our 4-Day Coorg Itinerary', to: '/blog/4-day-coorg-itinerary' },
          { label: 'Coffee Estates & Scenic Drives in Coorg', to: '/blog/coffee-estates-and-scenic-drives-coorg' },
          { label: 'Planning a Coorg Family Trip', to: '/blog/coorg-family-trip' },
        ],
      },
      {
        id: 'geographical-travel-planner',
        regionLabel: 'Geographical Travel Planner',
        heading: 'Which Coorg Places Can You Visit Together?',
        routePlanner: {
          intro:
            'Instead of bouncing back and forth across Coorg, group attractions that sit along the same road. Here are practical regional combinations you can mix and match depending on how many days you have.',
          disclaimer:
            'Note: These are suggested geographical groupings—not rigid or guaranteed schedules. Always allow extra time for meals, photo stops, weekend traffic, and monsoon road conditions.',
          regions: [
            {
              region: 'Eastern Coorg',
              title: 'A Relaxed Sightseeing Day Around Kushalnagar',
              stops: [
                'Golden Temple (Bylakuppe)',
                'Kaveri Nisargadhama',
                'Dubare Elephant Camp',
                'Chiklihole Reservoir',
              ],
              note: 'Start with Dubare first if you want the 9:00 AM elephant session, then loop through Bylakuppe for lunch, shaded Nisargadhama after lunch, and Chiklihole or Harangi Dam before dusk.',
              distanceNote: 'All stops sit roughly 4–16 km from Kushalnagar on gentle plateau roads.',
            },
            {
              region: 'Central Coorg',
              title: 'A Classic Madikeri Sightseeing Day',
              stops: ['Mandalpatti Peak (early)', 'Abbey Falls', 'Madikeri Fort', 'Raja’s Seat'],
              note: 'If you are travelling with toddlers or seniors and prefer skipping the bumpy 4x4 jeep ride to Mandalpatti, start calmly with Omkareshwara Temple and Madikeri Fort instead.',
              distanceNote: 'Madikeri town is ~30 km west of Kushalnagar; Abbey Falls is ~8 km from Madikeri.',
            },
            {
              region: 'Northern Coorg',
              title: 'A Quiet Somwarpet Waterfall & Lake Drive',
              stops: ['Honnamana Kere Lake', 'Mallalli Falls', 'Somwarpet Estate Lanes'],
              note: 'Best saved for Day 3 or Day 4, especially between July and December when Mallalli Falls is flowing strongly and northern hills are lush green.',
              distanceNote: 'Stops lie roughly 45–55 km north of Kushalnagar or Madikeri.',
            },
            {
              region: 'Southern Coorg',
              title: 'A Wildlife & Forest Waterfall Excursion',
              stops: ['Nagarhole Tiger Reserve Safari', 'Iruppu Falls'],
              note: 'Ideal for nature lovers on a 4-day trip. Book your morning or afternoon forest safari slot first and time Iruppu Falls around it.',
              distanceNote: 'Kutta / Iruppu sits ~80–85 km south of Madikeri and Kushalnagar.',
            },
          ],
        },
        links: [
          { label: '2-Day Coorg Trip Plan', to: '/blog/coorg-trip-plan-2-days' },
          { label: 'Open Interactive Coorg Trip Planner', to: '/trip-planner' },
          { label: 'Where to Stay in Coorg', to: '/blog/where-to-stay-in-coorg' },
        ],
      },
    ],
    highlights: [
      {
        label: 'Eastern Coorg (from Kushalnagar)',
        value: 'Golden Temple (6 km), Nisargadhama (4 km), Harangi (9 km), Dubare (14 km), Chiklihole (14–16 km)',
      },
      {
        label: 'Central & West (from Madikeri)',
        value: 'Fort & Omkareshwara (in town), Raja’s Seat (1 km), Abbey Falls (8 km), Mandalpatti (~18 km), Talacauvery (44 km)',
      },
      {
        label: 'Easiest for Kids & Seniors',
        value: 'Golden Temple, Nisargadhama, Harangi Dam, Madikeri Fort, Omkareshwara Temple, and Raja’s Seat',
      },
      {
        label: 'Best Base for 1–3 Day Trips',
        value: 'Stay near Kushalnagar for flat eastern drives and take a focused day trip west to Madikeri',
      },
    ],
    relatedSlugs: [
      'coorg-trip-plan-2-days',
      '3-day-coorg-itinerary',
      'kushalnagar-tourist-places',
      'best-time-to-visit-coorg',
      'where-to-stay-in-coorg',
      'bylakuppe-tibetan-settlement-guide',
    ],
    stayRecommendation: {
      heading: 'A Calm Base Near Kushalnagar for Eastern Coorg & Madikeri',
      text: 'Dreamy Vacations sits in quiet Chikkathur Village near Kushalnagar—just minutes from Kaveri Nisargadhama, Bylakuppe’s Golden Temple, Harangi Dam, and Dubare Elephant Camp, with a straightforward drive west to Madikeri when you are ready for the hills.',
      links: [
        { label: 'Explore Rooms & Cottages', to: '/rooms' },
        { label: 'Family Rooms in Coorg', to: '/rooms/families' },
        { label: 'Build Your Custom Itinerary', to: '/trip-planner' },
      ],
    },
    conclusion:
      'Coorg feels much richer when you stop trying to tick off every pin on the map in one rush. Spend an unhurried day soaking in eastern Coorg’s Tibetan monasteries and Cauvery riverbanks around Kushalnagar, dedicate a clear day to Madikeri’s waterfalls and misty viewpoints, and keep the northern and southern corners for when you have extra days to linger.',
    faqs: [
      {
        q: 'Which Coorg attractions are closest to Kushalnagar?',
        a: 'Kaveri Nisargadhama (~4 km), Namdroling Monastery / Golden Temple in Bylakuppe (~6 km), Harangi Dam (~9 km), Dubare Elephant Camp (~14 km), and Chiklihole Reservoir (~14–16 km) are all right around Kushalnagar.',
      },
      {
        q: 'Are Iruppu Falls and Mallalli Falls close to Madikeri or Kushalnagar?',
        a: 'No—Mallalli Falls is roughly 53–55 km north near Somwarpet, and Iruppu Falls is roughly 80–85 km south near Kutta. Save either one for a 3- or 4-day itinerary instead of squeezing them into a 2-day weekend.',
      },
      {
        q: 'How many places can you comfortably visit in one day in Coorg?',
        a: 'Three to four stops in the same region is the sweet spot. That gives you time to enjoy each place, sit down for a proper local lunch, and get back before dark without rushing.',
      },
      {
        q: 'Which places in Coorg are easiest for young kids and senior citizens?',
        a: 'Namdroling Monastery, Kaveri Nisargadhama, Harangi Dam gardens, Madikeri Fort, Omkareshwara Temple, and Raja’s Seat all have level or paved paths—unlike Abbey Falls, Mallalli Falls, or Mandalpatti’s bumpy jeep ride.',
      },
    ],
    structuredType: 'Article',
  },
};
