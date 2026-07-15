import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BLOG_POSTS } from '../blogData';
import { decodeTrip } from '../lib/tripHelper';

export default function SEOManager() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = 'Dreamy Vacations | Resort in Kushalnagar, Coorg';
    let description = 'Book family rooms, group stays, and double bedrooms at Dreamy Vacations, Kushalnagar, Coorg. Swimming pool, outdoor recreation, and peaceful atmosphere.';
    let canonical = `https://dreamyvacations.com${path}`;

    // Dynamic metadata setting based on pages
    if (path === '/') {
      title = 'Dreamy Vacations | Resort in Kushalnagar, Coorg';
      description = 'Dreamy Vacations is a resort located in Kushalnagar, Coorg, offering comfortable rooms for couples, families, and groups. Guests can enjoy our swimming pool, spacious accommodations, and a relaxing stay experience.';
    } else if (path === '/rooms') {
      title = 'Our Rooms & Rates | Comfortable Family Stays in Coorg';
      description = 'Explore Booking.com style room accommodations at Dreamy Vacations, Kushalnagar. Standard Family suites starting at ₹4084, deluxe rooms, and dormitory packages.';
    } else if (path === '/rooms/standard-family-room') {
      title = 'Standard Family Room Booking | Dreamy Vacations Coorg';
      description = 'Book our Standard Family Room in Kushalnagar, Coorg starting at ₹4084. Spacious double-bed setup accommodating 2 Adults with swimming pool access.';
    } else if (path === '/rooms/deluxe-family-room') {
      title = 'Deluxe Family Room with Balcony | Dreamy Vacations Coorg';
      description = 'Reserve our Deluxe Family Room in Coorg starting at ₹4749. Includes a double bed, wood false ceilings, cove lights, and pool views.';
    } else if (path === '/rooms/superior-deluxe-double') {
      title = 'Superior Deluxe Double Bedroom | Dreamy Vacations Coorg';
      description = 'Book our ambient Superior Deluxe Double Room starting at ₹4702. Equipped with 2 double beds, wood false ceilings, and premium bedding.';
    } else if (path === '/rooms/triple-room') {
      title = 'Triple Bed Room Accommodation | Dreamy Vacations Coorg';
      description = 'Reserve our Triple Bed Room in Kushalnagar starting at ₹5984. Equipped with 3 double beds, perfect for families, friends, and corporate travelers.';
    } else if (path === '/group-booking') {
      title = 'Corporate retreats & Group Booking | Dreamy Vacations Coorg';
      description = 'Get custom group booking and corporate packages at Dreamy Vacations, Kushalnagar. Custom meals, private bonfires, rain dance, and priority coordination.';
    } else if (path === '/about') {
      title = 'About Us | Dreamy Vacations Kushalnagar Coorg';
      description = 'Learn about Dreamy Vacations, located in Kudumangalore, Kushalnagar. We offer family lodging and group stays with recreation amenities.';
    } else if (path === '/contact') {
      title = 'Contact & GPS Coordinates | Find Us in Coorg';
      description = 'Get exact directions, address, and coordinates (12.486260, 75.940539) to Dreamy Vacations, Behind Chikkathur Govt School, Kushalnagar, Karnataka.';
    } else if (path === '/blog') {
      title = 'Coorg Travel Guides & Itineraries | Dreamy Vacations Publication';
      description = 'Read expert-verified travel guides, side-by-side local comparisons, and itineraries for Kushalnagar and Coorg. Start planning your vacation today.';
    } else if (path.startsWith('/blog/')) {
      const slug = path.split('/blog/')[1];
      const post = BLOG_POSTS[slug];
      if (post) {
        title = `${post.title} | Coorg Travel Guide`;
        description = post.metaDesc;
      }
    } else if (path === '/trip-planner') {
      title = 'Free Coorg Itinerary & Trip Planner | Dreamy Vacations';
      description = 'Input your dates and travel times to instantly generate a custom, high-end Coorg itinerary. Download PDF or share directly via WhatsApp.';
    } else if (path.startsWith('/trip/')) {
      const code = path.split('/trip/')[1];
      const params = decodeTrip(code);
      if (params) {
        title = `Coorg Trip Itinerary (#${code}) | Customized Coorg Planner`;
        description = `Custom Coorg travel itinerary for ${params.adults} Adults and ${params.children} Children, from ${params.arrivalDate} to ${params.departureDate}. Base hotel: Dreamy Vacations Kushalnagar.`;
      }
    }

    // Set page title and meta tags
    document.title = title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // OpenGraph Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description);

    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      document.head.appendChild(ogType);
    }
    ogType.setAttribute('content', 'website');

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', canonical);

    // Dynamic JSON-LD Schema injection
    const existingSchema = document.getElementById('resort-schema-jsonld');
    if (existingSchema) {
      existingSchema.remove();
    }

    // LocalBusiness & Resort Schema
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Resort',
      'name': 'Dreamy Vacations',
      'description': description,
      'image': '/images/rooms/sf1/sf1.jpeg',
      'telephone': '+91 99029 60484',
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
      'url': canonical,
      'priceRange': '₹4084 - ₹10449',
      'amenityFeature': [
        { '@type': 'LocationFeatureSpecification', 'name': 'Swimming Pool', 'value': true },
        { '@type': 'LocationFeatureSpecification', 'name': 'Rain Dance', 'value': true },
        { '@type': 'LocationFeatureSpecification', 'name': 'Indoor Games', 'value': true },
        { '@type': 'LocationFeatureSpecification', 'name': 'Family Rooms', 'value': true },
        { '@type': 'LocationFeatureSpecification', 'name': 'Free Parking', 'value': true },
        { '@type': 'LocationFeatureSpecification', 'name': 'Free High-speed Wi-Fi', 'value': true }
      ]
    };

    // FAQ Schema for SEO discovery
    const faqSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is the starting room price at Dreamy Vacations, Coorg?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'The room prices start at ₹4084 per night for the Standard Family Room, and scale up to ₹10449 per night for the full 10-person Mixed Dormitory.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Does the resort offer a swimming pool and rain dance?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, Dreamy Vacations provides a pristine outdoor swimming pool, rain dance arena, and indoor recreation games free of cost for all stay-in guests.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Is Dreamy Vacations family friendly?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Absolutely. We specialize in comfortable, standard accommodations designed specifically for families, corporate clusters, and groups in Coorg.'
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.id = 'resort-schema-jsonld';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify([schemaData, faqSchemaData]);
    document.head.appendChild(script);

  }, [location]);

  return null;
}
