import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BLOG_POSTS } from '../blogData';
import { decodeTrip } from '../lib/tripHelper';
import { ROOMS } from '../data';

const PRIMARY_ORIGIN = 'https://dreamyvacations1.vercel.app';

export function getProductionOrigin(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('dreamyvacations.in')) {
      return 'https://dreamyvacations.in';
    }
    if (host.includes('dreamyvacations1.vercel.app')) {
      return 'https://dreamyvacations1.vercel.app';
    }
    if (window.location.origin && !window.location.origin.includes('localhost') && !window.location.origin.includes('127.0.0.1')) {
      return window.location.origin;
    }
  }
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
    const canonical = `${origin}${cleanPath || '/'}`;

    // Defaults
    let title = 'Dreamy Vacations | Family Resort in Kushalnagar, Coorg';
    let description = 'Dreamy Vacations offers comfortable family and group accommodation in Kushalnagar, Coorg with swimming pool, rain dance, spacious rooms, and serene surroundings.';
    let ogImage = `${origin}/images/logo/logo.png`;
    let ogType = 'website';
    let schemas: any[] = [];

    // Base Resort & Organization Schema
    const baseResortSchema = {
      '@context': 'https://schema.org',
      '@type': 'Resort',
      '@id': `${origin}/#resort`,
      'name': 'Dreamy Vacations',
      'url': origin,
      'logo': `${origin}/images/logo/logo.png`,
      'image': `${origin}/images/rooms/sf1/sf1.jpeg`,
      'description': description,
      'telephone': '+91 99029 60484',
      'priceRange': '₹4084 - ₹10449',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '#51/5, Behind Chikkathur Govt School, Chikkathur Village',
        'addressLocality': 'Kushalnagar, Kudumangalore',
        'addressRegion': 'Karnataka',
        'postalCode': '571232',
        'addressCountry': 'IN'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': 12.486260,
        'longitude': 75.940539
      },
      'amenityFeature': [
        { '@type': 'LocationFeatureSpecification', 'name': 'Swimming Pool', 'value': true },
        { '@type': 'LocationFeatureSpecification', 'name': 'Rain Dance', 'value': true },
        { '@type': 'LocationFeatureSpecification', 'name': 'Indoor Games', 'value': true },
        { '@type': 'LocationFeatureSpecification', 'name': 'Free Wi-Fi', 'value': true },
        { '@type': 'LocationFeatureSpecification', 'name': 'Free On-site Parking', 'value': true }
      ]
    };

    // Route-specific configurations
    if (path === '/') {
      title = 'Dreamy Vacations | Family Resort in Kushalnagar, Coorg';
      description = 'Dreamy Vacations offers comfortable family and group accommodation in Kushalnagar, Coorg with swimming pool, rain dance, spacious rooms, and serene surroundings.';
      ogImage = `${origin}/images/logo/logo.png`;

      const homeFaqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'What accommodations are available at Dreamy Vacations, Kushalnagar?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'We offer Standard Family Rooms, Deluxe Family Rooms with balconies, Superior Deluxe Double bedrooms, and Triple Bed Rooms suitable for families, couples, and corporate groups.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Does Dreamy Vacations have a swimming pool and campfire?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes, Dreamy Vacations features a clean outdoor swimming pool, high-tech rain dance arena with ambient sound, and evening campfire setups.'
            }
          },
          {
            '@type': 'Question',
            'name': 'How far is the resort from the Golden Temple and Dubare Camp?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Namdroling Golden Temple in Bylakuppe is approximately 12 minutes drive (6 km), and Dubare Elephant Camp is approximately 20 minutes drive (14 km).'
            }
          }
        ]
      };

      schemas = [baseResortSchema, homeFaqSchema];

    } else if (path === '/rooms') {
      title = 'Rooms & Rates | Accommodations in Kushalnagar, Coorg';
      description = 'Explore comfortable rooms and family accommodations at Dreamy Vacations, Kushalnagar. Standard family suites, deluxe rooms, and dormitory packages starting from ₹4,084.';
      ogImage = `${origin}/images/rooms/sf1/sf1.jpeg`;

      const roomsBreadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
          { '@type': 'ListItem', 'position': 2, 'name': 'Rooms', 'item': `${origin}/rooms` }
        ]
      };

      schemas = [baseResortSchema, roomsBreadcrumb];

    } else if (path.startsWith('/rooms/')) {
      const roomId = path.split('/rooms/')[1]?.toLowerCase();
      const matchedRoom = ROOMS.find(r => {
        const nId = r.id.toLowerCase();
        return nId === roomId || nId.replace('-room', '') === roomId || roomId.replace('-room', '') === nId;
      });

      if (matchedRoom) {
        title = `${matchedRoom.name} | Dreamy Vacations Kushalnagar Coorg`;
        description = `${matchedRoom.description} Capacity: ${matchedRoom.occupancy}. Starting at ₹${matchedRoom.price}/night at Dreamy Vacations in Kushalnagar.`;
        ogImage = matchedRoom.images[0]?.startsWith('http') ? matchedRoom.images[0] : `${origin}${matchedRoom.images[0]}`;

        const roomSchema = {
          '@context': 'https://schema.org',
          '@type': 'HotelRoom',
          'name': matchedRoom.name,
          'description': matchedRoom.longDescription,
          'image': ogImage,
          'occupancy': {
            '@type': 'QuantitativeValue',
            'value': matchedRoom.occupancy
          },
          'floorSize': {
            '@type': 'QuantitativeValue',
            'value': matchedRoom.size
          },
          'offers': {
            '@type': 'Offer',
            'price': matchedRoom.price,
            'priceCurrency': 'INR',
            'availability': 'https://schema.org/InStock',
            'url': canonical
          }
        };

        const breadcrumbs = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
            { '@type': 'ListItem', 'position': 2, 'name': 'Rooms', 'item': `${origin}/rooms` },
            { '@type': 'ListItem', 'position': 3, 'name': matchedRoom.name, 'item': canonical }
          ]
        };

        schemas = [roomSchema, breadcrumbs];
      }

    } else if (path === '/group-booking') {
      title = 'Corporate Retreats & Group Stays | Dreamy Vacations Coorg';
      description = 'Get custom group accommodation and corporate packages at Dreamy Vacations, Kushalnagar. Custom traditional meals, private bonfires, and rain dance access.';
      ogImage = `${origin}/images/rooms/sf1/sf1.jpeg`;

    } else if (path === '/gallery') {
      title = 'Resort Photo Gallery | Dreamy Vacations Kushalnagar';
      description = 'Browse photos of Dreamy Vacations in Kushalnagar, Coorg. View our swimming pool, family rooms, rain dance arena, green landscapes, and ambient night views.';
      ogImage = `${origin}/images/gallery/unnamed.webp`;

    } else if (path === '/about') {
      title = 'About Us | Heritage & Hospitality at Dreamy Vacations Coorg';
      description = 'Discover Dreamy Vacations in Chikkathur Village, Kushalnagar. Learn about our peaceful family accommodation, hospitality philosophy, and prime Coorg location.';
      ogImage = `${origin}/images/logo/logo.png`;
      schemas = [baseResortSchema];

    } else if (path === '/contact') {
      title = 'Contact & GPS Location | Dreamy Vacations Kushalnagar Coorg';
      description = 'Find Dreamy Vacations in Kushalnagar, Coorg. Get phone numbers (+91 99029 60484), WhatsApp support, Google Maps directions, and GPS coordinates.';
      ogImage = `${origin}/images/logo/logo.png`;
      schemas = [baseResortSchema];

    } else if (path === '/booking') {
      title = 'Direct Reservation & Availability | Dreamy Vacations Coorg';
      description = 'Check room availability and book your family or group stay at Dreamy Vacations, Kushalnagar, Coorg. Instant WhatsApp confirmation with zero booking fee.';
      ogImage = `${origin}/images/rooms/sf1/sf1.jpeg`;

    } else if (path === '/travel-guide' || path.startsWith('/travel-guide/')) {
      title = 'Coorg Travel Guide & Attractions | Dreamy Vacations';
      description = 'Complete travel guide to Kushalnagar and Coorg. Distances, timings, and travel tips for Golden Temple, Dubare Elephant Camp, Nisargadhama, and Harangi Dam.';
      ogImage = `${origin}/images/places/gold.jpeg`;

    } else if (path === '/trip-planner') {
      title = 'Custom Coorg Trip Planner & Itinerary Generator | Dreamy Vacations';
      description = 'Generate a customized Coorg travel itinerary based on your arrival dates and group size. Download printable PDF guides and plan your vacation effortlessly.';
      ogImage = `${origin}/images/places/dubare.jpeg`;

    } else if (path === '/blog') {
      title = 'Coorg Travel Guides & Itineraries | Dreamy Vacations Blog';
      description = 'Read expert travel guides, sightseeing itineraries, and local tips for Kushalnagar and Coorg. Authored by the local hospitality team at Dreamy Vacations.';
      ogImage = `${origin}/images/places/gold.jpeg`;

      const blogListSchema = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        'name': 'Dreamy Vacations Coorg Travel Publication',
        'url': `${origin}/blog`,
        'description': description,
        'publisher': {
          '@id': `${origin}/#resort`
        }
      };

      schemas = [blogListSchema];

    } else if (path.startsWith('/blog/')) {
      const slug = path.split('/blog/')[1];
      const post = BLOG_POSTS[slug];

      if (post) {
        title = `${post.title} | Coorg Travel Guide`;
        description = post.metaDesc;
        ogImage = post.heroImg;
        ogType = 'article';

        const articleSchema = {
          '@context': 'https://schema.org',
          '@type': 'Article',
          'headline': post.title,
          'description': post.metaDesc,
          'image': [post.heroImg],
          'datePublished': '2026-07-15T04:00:00+05:30',
          'dateModified': '2026-10-28T09:00:00+05:30',
          'author': {
            '@type': 'Organization',
            'name': 'Dreamy Vacations Coorg',
            'url': origin
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Dreamy Vacations',
            'logo': {
              '@type': 'ImageObject',
              'url': `${origin}/images/logo/logo.png`
            }
          },
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': canonical
          }
        };

        const breadcrumbs = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
            { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': `${origin}/blog` },
            { '@type': 'ListItem', 'position': 3, 'name': post.title, 'item': canonical }
          ]
        };

        schemas = [articleSchema, breadcrumbs];

        if (post.faqs && post.faqs.length > 0) {
          const faqSchema = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': post.faqs.map(f => ({
              '@type': 'Question',
              'name': f.q,
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': f.a
              }
            }))
          };
          schemas.push(faqSchema);
        }
      }

    } else if (path.startsWith('/trip/')) {
      const code = path.split('/trip/')[1];
      const params = decodeTrip(code);
      if (params) {
        title = `Coorg Trip Itinerary (#${code}) | Dreamy Vacations Planner`;
        description = `Custom Coorg travel itinerary for ${params.adults} Adults and ${params.children} Children, from ${params.arrivalDate} to ${params.departureDate}. Base hotel: Dreamy Vacations Kushalnagar.`;
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

    // Apply Structured Data (JSON-LD)
    const existingScript = document.getElementById('dynamic-seo-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    if (schemas.length > 0) {
      const script = document.createElement('script');
      script.id = 'dynamic-seo-jsonld';
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schemas.length === 1 ? schemas[0] : {
        '@context': 'https://schema.org',
        '@graph': schemas
      });
      document.head.appendChild(script);
    }

  }, [location]);

  return null;
}
