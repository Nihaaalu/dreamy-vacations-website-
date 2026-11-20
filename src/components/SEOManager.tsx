import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BLOG_POSTS, CANONICAL_BLOG_POSTS, resolveCanonicalBlogSlug } from '../blogData';
import { GUIDES_DATA } from '../guidesData';
import { decodeTrip } from '../lib/tripHelper';
import { ROOMS } from '../data';

const PRIMARY_ORIGIN = 'https://www.dreamyvacations.in';
const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9';

export function getProductionOrigin(): string {
  return PRIMARY_ORIGIN;
}

function updateOrCreateMeta(attribute: 'name' | 'property', attrValue: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateOrCreateCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export default function SEOManager() {
  const location = useLocation();

  useEffect(() => {
    const origin = getProductionOrigin();
    const path = location.pathname;
    const cleanPath = path === '/' ? '' : path.replace(/\/$/, '');
    let canonical = `${origin}${cleanPath || '/'}`;

    // Defaults
    let title = 'Dreamy Vacations | Family & Group Resort in Kushalnagar, Coorg';
    let description =
      'Dreamy Vacations is a quiet family and group accommodation property in Chikkathur Village near Kushalnagar, Coorg with swimming pool, rain dance, indoor games, and spacious rooms.';
    let ogImage = `${origin}/images/rooms/df1/df1.jpeg`;
    let ogType = 'website';
    let schemas: Record<string, unknown>[] = [];

    const organizationSchema = {
      '@type': 'Organization',
      '@id': `${origin}/#organization`,
      name: 'Dreamy Vacations',
      url: `${origin}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${origin}/images/logo/logo.png`,
      },
      telephone: '+91 99029 60484',
    };

    const websiteSchema = {
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      url: `${origin}/`,
      name: 'Dreamy Vacations',
      publisher: { '@id': `${origin}/#organization` },
      inLanguage: 'en-IN',
    };

    const lodgingBusinessSchema = {
      '@type': 'LodgingBusiness',
      '@id': `${origin}/#lodging`,
      name: 'Dreamy Vacations',
      url: `${origin}/`,
      logo: `${origin}/images/logo/logo.png`,
      image: [
        `${origin}/images/rooms/df1/df1.jpeg`,
        `${origin}/images/gallery/unnamed (1).webp`,
        `${origin}/images/gallery/unnamed (4).webp`,
      ],
      description:
        'Family and group accommodation property in Chikkathur Village near Kushalnagar, Coorg with couples rooms, multi-bed family rooms, group stays, outdoor swimming pool, rain dance, indoor games, Wi-Fi, and on-site parking.',
      telephone: '+91 99029 60484',
      hasMap: GOOGLE_MAPS_URL,
      checkinTime: '12:00',
      checkoutTime: '11:00',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '#51/5, Behind Chikkathur Govt School, Chikkathur Village',
        addressLocality: 'Kushalnagar, Kudumangalore',
        addressRegion: 'Karnataka',
        postalCode: '571232',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 12.48626,
        longitude: 75.940539,
      },
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Outdoor Swimming Pool', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Rain Dance Area', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Indoor Games', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Campfire Area (Subject to Weather & Availability)', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Free Wi-Fi', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Free On-site Parking', value: true },
      ],
    };

    // Route-specific configurations
    if (path === '/') {
      title = 'Dreamy Vacations | Family & Group Resort in Kushalnagar, Coorg';
      description =
        'Stay at Dreamy Vacations in Chikkathur Village near Kushalnagar, Coorg. Explore rooms for couples, families, and groups with swimming pool, rain dance, and access to Bylakuppe, Dubare, and Madikeri.';
      ogImage = `${origin}/images/rooms/df1/df1.jpeg`;
      schemas = [organizationSchema, websiteSchema, lodgingBusinessSchema];
    } else if (path === '/rooms') {
      title = 'Coorg Resort & Accommodation Near Kushalnagar | Dreamy Vacations';
      description =
        'Explore couples rooms, spacious family suites, and group accommodations at Dreamy Vacations near Kushalnagar, Coorg—with swimming pool, rain dance, indoor games, and easy access to Bylakuppe and Madikeri.';
      ogImage = `${origin}/images/rooms/df1/df1.jpeg`;

      const roomsBreadcrumb = {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Rooms', item: `${origin}/rooms` },
        ],
      };

      schemas = [lodgingBusinessSchema, roomsBreadcrumb];
    } else if (path === '/rooms/couples' || path === '/rooms/families' || path === '/rooms/group-booking') {
      const categoryMetaMap: Record<string, { title: string; desc: string; name: string; img: string }> = {
        '/rooms/couples': {
          title: 'Rooms for Couples in Coorg | Dreamy Vacations, Kushalnagar',
          desc: 'Peaceful double-bed cottages for couples near Kushalnagar, Coorg with private ensuite bathrooms, swimming pool access, and calm Chikkathur village surroundings.',
          name: 'Rooms for Couples',
          img: `${origin}/images/rooms/df1/df1.jpeg`,
        },
        '/rooms/families': {
          title: 'Family Rooms in Coorg | Dreamy Vacations, Kushalnagar',
          desc: 'Explore family accommodation at Dreamy Vacations near Kushalnagar, Coorg, with spacious room options, pool access and family-friendly facilities.',
          name: 'Family Rooms in Coorg',
          img: `${origin}/images/gallery/unnamed (1).webp`,
        },
        '/rooms/group-booking': {
          title: 'Group Accommodation & Cottage Stays in Coorg | Dreamy Vacations',
          desc: 'Group accommodations near Kushalnagar, Coorg for friends, reunions, and corporate teams with multi-bed rooms, adjoining cottages, custom dining, campfire, and coach parking.',
          name: 'Group Booking',
          img: `${origin}/images/gallery/unnamed (3).webp`,
        },
      };
      const catMeta = categoryMetaMap[path];
      title = catMeta.title;
      description = catMeta.desc;
      ogImage = catMeta.img;

      const catBreadcrumbs = {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Rooms', item: `${origin}/rooms` },
          { '@type': 'ListItem', position: 3, name: catMeta.name, item: canonical },
        ],
      };

      schemas = [lodgingBusinessSchema, catBreadcrumbs];
    } else if (path.startsWith('/rooms/')) {
      const roomId = path.split('/rooms/')[1]?.toLowerCase();
      const matchedRoom = ROOMS.find((r) => {
        const nId = r.id.toLowerCase();
        return nId === roomId || nId.replace('-room', '') === roomId || roomId.replace('-room', '') === nId;
      });

      if (matchedRoom) {
        title = `${matchedRoom.name} | Dreamy Vacations Kushalnagar, Coorg`;
        description = `${matchedRoom.description} Capacity: ${matchedRoom.occupancy}. Enquire via WhatsApp for availability at Dreamy Vacations in Kushalnagar, Coorg.`;
        ogImage = matchedRoom.images[0]?.startsWith('http')
          ? matchedRoom.images[0]
          : `${origin}${matchedRoom.images[0]}`;

        const roomSchema = {
          '@type': 'HotelRoom',
          name: matchedRoom.name,
          description: matchedRoom.longDescription,
          image: ogImage,
          occupancy: {
            '@type': 'QuantitativeValue',
            value: matchedRoom.occupancy,
          },
          floorSize: {
            '@type': 'QuantitativeValue',
            value: matchedRoom.size,
          },
          containedInPlace: {
            '@id': `${origin}/#lodging`,
          },
        };

        const breadcrumbs = {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: 'Rooms', item: `${origin}/rooms` },
            { '@type': 'ListItem', position: 3, name: matchedRoom.name, item: canonical },
          ],
        };

        schemas = [roomSchema, breadcrumbs];
      }
    } else if (path === '/group-booking') {
      title = 'Group Booking & Corporate Retreats in Coorg | Dreamy Vacations';
      description =
        'Enquire for group stays, family reunions, and corporate retreats at Dreamy Vacations near Kushalnagar, Coorg—with multi-bed rooms, custom dining, campfire, and coach parking.';
      ogImage = `${origin}/images/gallery/unnamed (3).webp`;
      schemas = [
        lodgingBusinessSchema,
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: 'Group Booking', item: `${origin}/group-booking` },
          ],
        },
      ];
    } else if (path === '/gallery') {
      title = 'Photo Gallery | Dreamy Vacations Kushalnagar, Coorg';
      description =
        'Browse real photographs of Dreamy Vacations in Chikkathur Village near Kushalnagar, Coorg—including guest rooms, cottages, outdoor swimming pool, indoor games, and evening courtyard views.';
      ogImage = `${origin}/images/gallery/unnamed.webp`;
      schemas = [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: 'Gallery', item: `${origin}/gallery` },
          ],
        },
      ];
    } else if (path === '/about') {
      title = 'About Dreamy Vacations | Kushalnagar, Coorg Stay';
      description =
        'Learn about Dreamy Vacations in Chikkathur Village near Kushalnagar, Coorg—our family-friendly accommodation, on-site facilities, and location near Bylakuppe and Madikeri.';
      ogImage = `${origin}/images/gallery/unnamed (1).webp`;
      schemas = [
        organizationSchema,
        lodgingBusinessSchema,
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: 'About', item: `${origin}/about` },
          ],
        },
      ];
    } else if (path === '/contact') {
      title = 'Contact & Directions | Dreamy Vacations Kushalnagar, Coorg';
      description =
        'Contact Dreamy Vacations in Chikkathur Village, Kushalnagar, Coorg. Phone and WhatsApp (+91 99029 60484), full address, GPS coordinates, and Google Maps directions.';
      ogImage = `${origin}/images/logo/logo.png`;
      schemas = [
        lodgingBusinessSchema,
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: 'Contact', item: `${origin}/contact` },
          ],
        },
      ];
    } else if (path === '/booking') {
      title = 'Room Availability & Stay Enquiry | Dreamy Vacations Coorg';
      description =
        'Send a direct room availability enquiry for Dreamy Vacations in Kushalnagar, Coorg via WhatsApp or phone (+91 99029 60484) for couples, families, and groups.';
      ogImage = `${origin}/images/rooms/df1/df1.jpeg`;
      schemas = [
        lodgingBusinessSchema,
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: 'Stay Enquiry', item: `${origin}/booking` },
          ],
        },
      ];
    } else if (path === '/travel-guide' || path.startsWith('/travel-guide/')) {
      const guideSlug = path.startsWith('/travel-guide/')
        ? path.split('/travel-guide/')[1]?.replace(/\/$/, '')
        : '';
      const matchedGuide = guideSlug && GUIDES_DATA[guideSlug] ? GUIDES_DATA[guideSlug] : null;
      title = matchedGuide
        ? `${matchedGuide.title} | Dreamy Vacations Coorg`
        : 'Coorg Attractions & Travel Guide | Dreamy Vacations, Kushalnagar';
      description = matchedGuide
        ? matchedGuide.subtitle
        : 'Explore Kushalnagar and Coorg attractions with practical distances, best visiting hours, and travel tips for Golden Temple, Dubare Elephant Camp, Nisargadhama, Harangi Dam, and Madikeri.';
      ogImage = `${origin}/images/places/gold.jpeg`;
      schemas = [
        {
          '@type': 'BreadcrumbList',
          itemListElement: matchedGuide
            ? [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
                { '@type': 'ListItem', position: 2, name: 'Travel Guide', item: `${origin}/travel-guide` },
                { '@type': 'ListItem', position: 3, name: matchedGuide.title, item: canonical },
              ]
            : [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
                { '@type': 'ListItem', position: 2, name: 'Travel Guide', item: `${origin}/travel-guide` },
              ],
        },
      ];
    } else if (path === '/trip-planner') {
      title = 'Coorg Trip Planner & Custom Itinerary Builder | Dreamy Vacations';
      description =
        'Build a customized Coorg travel itinerary based on your dates and group size, covering Kushalnagar, Bylakuppe, Dubare, and Madikeri with printable PDF export.';
      ogImage = `${origin}/images/places/dubare.jpeg`;
      schemas = [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: 'Trip Planner', item: `${origin}/trip-planner` },
          ],
        },
      ];
    } else if (path === '/blog') {
      title = 'Coorg Travel Guides, Itineraries & Local Research | Dreamy Vacations';
      description =
        'In-depth Coorg travel guides from Kushalnagar: 2-day and 3-day Coorg trip plans, 25 best places to visit, best time to visit by month, where to stay, and Bylakuppe Tibetan culture.';
      ogImage = `${origin}/images/places/gold.jpeg`;

      const blogListSchema = {
        '@type': 'Blog',
        name: 'Dreamy Vacations Coorg & Kushalnagar Travel Publication',
        url: `${origin}/blog`,
        description,
        publisher: {
          '@id': `${origin}/#organization`,
        },
      };

      const blogBreadcrumb = {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog & Travel Guides', item: `${origin}/blog` },
        ],
      };

      schemas = [organizationSchema, blogListSchema, blogBreadcrumb];
    } else if (path.startsWith('/blog/')) {
      const slug = path.split('/blog/')[1]?.replace(/\/$/, '');
      const resolvedSlug = resolveCanonicalBlogSlug(slug);
      const post = (slug && BLOG_POSTS[slug]) || CANONICAL_BLOG_POSTS[resolvedSlug];

      if (post) {
        const canonicalSlug = post.canonicalSlug || resolvedSlug;
        canonical = `${origin}/blog/${canonicalSlug}`;
        title = post.seoTitle;
        description = post.metaDesc;
        ogImage = post.heroImg.startsWith('http') ? post.heroImg : `${origin}${post.heroImg}`;
        ogType = 'article';

        const articleSchema = {
          '@type': post.structuredType === 'Article' ? 'Article' : 'BlogPosting',
          headline: post.title,
          description: post.metaDesc,
          image: [ogImage],
          datePublished: `${post.publishedDate}T08:00:00+05:30`,
          dateModified: `${post.updatedDate}T09:00:00+05:30`,
          articleSection: post.category,
          keywords: [post.primaryKeyword, ...post.secondaryKeywords].join(', '),
          author: {
            '@type': 'Organization',
            name: 'Dreamy Vacations Editorial Team',
            url: `${origin}/`,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Dreamy Vacations',
            logo: {
              '@type': 'ImageObject',
              url: `${origin}/images/logo/logo.png`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonical,
          },
        };

        const breadcrumbs = {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: 'Travel Guides', item: `${origin}/blog` },
            { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
          ],
        };

        schemas = [articleSchema, breadcrumbs];
      }
    } else if (path.startsWith('/trip/')) {
      const code = path.split('/trip/')[1];
      const params = decodeTrip(code);
      if (params) {
        title = `Coorg Trip Itinerary (#${code}) | Dreamy Vacations Planner`;
        description = `Custom Coorg travel itinerary for ${params.adults} Adults and ${params.children} Children, from ${params.arrivalDate} to ${params.departureDate}. Base stay: Dreamy Vacations Kushalnagar.`;
      }
    }

    // Apply Document Title
    document.title = title;

    // Apply Meta Tags
    updateOrCreateMeta('name', 'description', description);
    updateOrCreateCanonical(canonical);

    // Apply OpenGraph Tags
    updateOrCreateMeta('property', 'og:title', title);
    updateOrCreateMeta('property', 'og:description', description);
    updateOrCreateMeta('property', 'og:type', ogType);
    updateOrCreateMeta('property', 'og:url', canonical);
    updateOrCreateMeta('property', 'og:image', ogImage);
    updateOrCreateMeta('property', 'og:site_name', 'Dreamy Vacations');
    updateOrCreateMeta('property', 'og:locale', 'en_IN');

    // Apply Twitter Tags
    updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMeta('name', 'twitter:title', title);
    updateOrCreateMeta('name', 'twitter:description', description);
    updateOrCreateMeta('name', 'twitter:image', ogImage);

    // Apply Structured Data (JSON-LD) — single clean graph, no FAQPage markup
    const existingScript = document.getElementById('dynamic-seo-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    if (schemas.length > 0) {
      const script = document.createElement('script');
      script.id = 'dynamic-seo-jsonld';
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': schemas,
      });
      document.head.appendChild(script);
    }
  }, [location]);

  return null;
}
