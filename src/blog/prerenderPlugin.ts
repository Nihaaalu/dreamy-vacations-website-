import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';
import { BLOG_CATEGORIES, BLOG_POSTS, CANONICAL_BLOG_POSTS } from '../blogData';
import { DEFAULT_GUIDE, GUIDES_DATA, type GuideData } from '../guidesData';
import type { BlogPost } from './types';

const SITE_ORIGIN = 'https://www.dreamyvacations.in';
const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/4BtwEt1ggcWm6x5v9';
const WHATSAPP_URL =
  'https://wa.me/919902960484?text=Hello%20Dreamy%20Vacations%2C%20I%20would%20like%20to%20enquire%20about%20room%20availability.';

const ORGANIZATION_SCHEMA = {
  '@type': 'Organization',
  '@id': `${SITE_ORIGIN}/#organization`,
  name: 'Dreamy Vacations',
  url: `${SITE_ORIGIN}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_ORIGIN}/images/logo/logo.png`,
  },
  telephone: '+91 99029 60484',
};

const LODGING_SCHEMA = {
  '@type': 'LodgingBusiness',
  '@id': `${SITE_ORIGIN}/#lodging`,
  name: 'Dreamy Vacations',
  url: `${SITE_ORIGIN}/`,
  logo: `${SITE_ORIGIN}/images/logo/logo.png`,
  image: [
    `${SITE_ORIGIN}/images/rooms/df1/df1.jpeg`,
    `${SITE_ORIGIN}/images/gallery/unnamed (1).webp`,
    `${SITE_ORIGIN}/images/gallery/unnamed (4).webp`,
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

interface StaticRoomMeta {
  id: string;
  name: string;
  occupancy: string;
  size: string;
  description: string;
  longDescription: string;
  image: string;
  amenities: string[];
  facilities: string[];
}

const STATIC_ROOMS: StaticRoomMeta[] = [
  {
    id: 'standard-family-room',
    name: 'Standard Family Room',
    occupancy: '2 Adults',
    size: '380 sq.ft.',
    description:
      'An exceptionally spacious room equipped with a comfortable double-bed, suitable for couples or small families seeking a quiet stay near Kushalnagar.',
    longDescription:
      'Our Standard Family Room provides a functional, comfortable staying option with one double bed, modern ensuite bathroom fittings, hot water, LED TV, and direct access to the swimming pool and recreation areas.',
    image: '/images/rooms/df1/df1.jpeg',
    amenities: ['1 Double Bed', 'Flat-screen LED TV', 'Attached modern bathroom', '24/7 hot water', 'Daily housekeeping'],
    facilities: ['Swimming Pool Access', 'Rain Dance', 'Indoor Games', 'Free Wi-Fi', 'On-site Parking'],
  },
  {
    id: 'deluxe-family-room',
    name: 'Deluxe Family Room',
    occupancy: '2 Adults',
    size: '420 sq.ft.',
    description:
      'Upgraded spaciousness featuring a private balcony overlooking the resort swimming pool and landscaped gardens.',
    longDescription:
      'The Deluxe Family Room combines warm wooden false ceilings, tray lighting, a comfortable double bed, in-room seating, tea and coffee maker, and a balcony overlooking the pool and courtyard gardens.',
    image: '/images/rooms/df1/df1.jpeg',
    amenities: [
      '1 Double Bed',
      'Balcony with pool & garden view',
      'Wooden false ceiling with tray lighting',
      'Tea & Coffee maker',
      'Attached modern bathroom',
    ],
    facilities: ['Swimming Pool Access', 'Rain Dance', 'Indoor Games', 'Free Wi-Fi', 'Balcony View'],
  },
  {
    id: 'superior-deluxe-double',
    name: 'Superior Deluxe Double',
    occupancy: '4 Adults',
    size: '320 sq.ft.',
    description:
      'Two-double-bed family room with custom wooden ceiling details, warm ambient lighting, and comfortable sleeping capacity for up to four guests.',
    longDescription:
      'Designed for families of three to four guests who prefer staying together in one room, the Superior Deluxe Double features two double beds, custom wood headboards, ambient lighting, seating area, and attached bathroom.',
    image: '/images/gallery/unnamed (1).webp',
    amenities: ['2 Double Beds', 'Custom wood ceiling & ambient lighting', 'Attached modern bathroom', 'Tea & Coffee maker', 'LED TV'],
    facilities: ['Swimming Pool Access', 'Rain Dance', 'Indoor Games', 'Free Wi-Fi', 'On-site Parking'],
  },
  {
    id: 'triple-room',
    name: 'Triple Room',
    occupancy: '6 Adults',
    size: '350 sq.ft.',
    description:
      'Three-double-bed multi-guest room ideal for larger joint families, friends traveling together, or group stays in Coorg.',
    longDescription:
      'Configured with three comfortable double beds and orthopaedic mattresses, the Triple Room accommodates up to six guests together with ensuite washroom, 24-hour hot water, seating space, and full access to resort facilities.',
    image: '/images/gallery/unnamed (3).webp',
    amenities: ['3 Double Beds', 'Orthopaedic mattresses', 'Modern ensuite washroom', '24-hour hot water', 'LED TV'],
    facilities: ['Swimming Pool Access', 'Rain Dance', 'Indoor Games', 'Free Wi-Fi', 'On-site Parking'],
  },
];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]+>/g, '');
}

function extractHeadParts(distHtml: string): { gtmBlock: string; assetTags: string } {
  const gtmMatch = distHtml.match(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->/);
  const gtmBlock = gtmMatch
    ? gtmMatch[0]
    : `<!-- Google Tag Manager -->
    <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-5QVCGLMJ"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    </script>
    <!-- End Google Tag Manager -->`;

  const assetMatches =
    distHtml.match(/<(?:script type="module"|link rel="(?:modulepreload|stylesheet)")[^>]*>(?:<\/script>)?/g) || [];
  return {
    gtmBlock,
    assetTags: assetMatches.join('\n    '),
  };
}

function renderSiteHeader(): string {
  return `<header class="py-4 px-6 border-b border-white/10 flex justify-between items-center" role="banner">
        <a href="/" aria-label="Dreamy Vacations Resort Homepage">
          <img src="/images/logo/logo.png" alt="Dreamy Vacations Resort Logo" width="160" height="42" class="h-9 w-auto object-contain" />
        </a>
        <nav aria-label="Main Navigation" class="flex flex-wrap gap-4 text-xs font-medium uppercase tracking-wider text-[#e2d7c5]">
          <a href="/rooms" class="hover:text-white">Rooms</a>
          <a href="/rooms/families" class="hover:text-white">Family Rooms</a>
          <a href="/gallery" class="hover:text-white">Gallery</a>
          <a href="/about" class="hover:text-white">About</a>
          <a href="/travel-guide" class="hover:text-white">Travel Guide</a>
          <a href="/blog" class="hover:text-white">Blog</a>
          <a href="/trip-planner" class="hover:text-white">Trip Planner</a>
          <a href="/booking" class="px-4 py-1.5 bg-[#6b5b4b] text-white rounded-full">Enquire Now</a>
        </nav>
      </header>`;
}

function renderSiteFooter(): string {
  return `<footer class="py-12 px-6 border-t border-white/10 bg-[#080808] text-white/60 text-xs">
        <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-[#e2d7c5] font-semibold uppercase tracking-wider mb-3">Dreamy Vacations</h3>
            <p class="leading-relaxed">Family and group accommodation property in Chikkathur Village near Kushalnagar, Coorg with outdoor swimming pool, rain dance, indoor games, Wi-Fi, and on-site parking.</p>
          </div>
          <div>
            <h3 class="text-[#e2d7c5] font-semibold uppercase tracking-wider mb-3">Accommodation</h3>
            <ul class="space-y-2">
              <li><a href="/rooms" class="hover:text-white">All Rooms &amp; Property Overview</a></li>
              <li><a href="/rooms/families" class="hover:text-white">Family Rooms in Coorg</a></li>
              <li><a href="/rooms/couples" class="hover:text-white">Rooms for Couples</a></li>
              <li><a href="/rooms/group-booking" class="hover:text-white">Group Booking</a></li>
              <li><a href="/gallery" class="hover:text-white">Gallery</a></li>
              <li><a href="/about" class="hover:text-white">About Us</a></li>
              <li><a href="/contact" class="hover:text-white">Contact &amp; Directions</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-[#e2d7c5] font-semibold uppercase tracking-wider mb-3">Coorg Travel Guides</h3>
            <ul class="space-y-2">
              <li><a href="/blog/places-to-visit-in-coorg" class="hover:text-white">Best Places to Visit in Coorg</a></li>
              <li><a href="/blog/coorg-trip-plan-2-days" class="hover:text-white">Coorg Trip Plan (2 Days)</a></li>
              <li><a href="/blog/best-time-to-visit-coorg" class="hover:text-white">Best Time to Visit Coorg</a></li>
              <li><a href="/blog/where-to-stay-in-coorg" class="hover:text-white">Where to Stay in Coorg</a></li>
              <li><a href="/blog/bylakuppe-tibetan-settlement-guide" class="hover:text-white">Bylakuppe &amp; Golden Temple</a></li>
              <li><a href="/blog/kushalnagar-tourist-places" class="hover:text-white">Kushalnagar Tourist Places</a></li>
              <li><a href="/trip-planner" class="hover:text-white">Coorg Trip Planner</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-[#e2d7c5] font-semibold uppercase tracking-wider mb-3">Location &amp; Contact</h3>
            <p>#51/5, Behind Chikkathur Govt School, Chikkathur Village, Kushalnagar, Kudumangalore, Karnataka 571232</p>
            <p class="mt-2"><a href="tel:+919902960484" class="text-[#e2d7c5]">+91 99029 60484</a></p>
            <p class="mt-1"><a href="${GOOGLE_MAPS_URL}" target="_blank" rel="noopener noreferrer" class="underline text-[#e2d7c5]">View on Google Maps</a></p>
          </div>
        </div>
      </footer>`;
}

interface PageShellOptions {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogType?: 'website' | 'article';
  schemas: Record<string, unknown>[];
  bodyHtml: string;
  gtmBlock: string;
  assetTags: string;
}

function renderHtmlDocument(opts: PageShellOptions): string {
  const ogType = opts.ogType || 'website';
  const jsonLdScript =
    opts.schemas.length > 0
      ? `<script id="dynamic-seo-jsonld" type="application/ld+json">${safeJsonLd({
          '@context': 'https://schema.org',
          '@graph': opts.schemas,
        })}</script>`
      : '';

  return `<!doctype html>
<html lang="en">
  <head>
    ${opts.gtmBlock}
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(opts.title)}</title>
    <meta name="description" content="${escapeHtml(opts.description)}" />
    <link rel="canonical" href="${escapeHtml(opts.canonical)}" />
    <link rel="icon" type="image/png" href="/images/logo/logo.png" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="Dreamy Vacations" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:title" content="${escapeHtml(opts.title)}" />
    <meta property="og:description" content="${escapeHtml(opts.description)}" />
    <meta property="og:url" content="${escapeHtml(opts.canonical)}" />
    <meta property="og:image" content="${escapeHtml(opts.ogImage)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(opts.title)}" />
    <meta name="twitter:description" content="${escapeHtml(opts.description)}" />
    <meta name="twitter:image" content="${escapeHtml(opts.ogImage)}" />
    ${jsonLdScript}
    ${opts.assetTags}
  </head>
  <body class="bg-[#0d0d0d] text-white">
    <div id="root">
      ${renderSiteHeader()}
      ${opts.bodyHtml}
      ${renderSiteFooter()}
    </div>
  </body>
</html>`;
}

function buildBlogIndexHtml(gtmBlock: string, assetTags: string): string {
  const title = 'Coorg Travel Guides, Itineraries & Local Research | Dreamy Vacations';
  const description =
    'In-depth Coorg travel guides from Kushalnagar: 2-day and 3-day Coorg trip plans, 25 best places to visit, best time to visit by month, where to stay, and Bylakuppe Tibetan culture.';
  const canonical = `${SITE_ORIGIN}/blog`;
  const ogImage = `${SITE_ORIGIN}/images/places/gold.jpeg`;

  const postsArray = Object.entries(CANONICAL_BLOG_POSTS)
    .map(([slug, data]) => ({ slug, ...data }))
    .sort((a, b) => (a.featuredRank ?? 999) - (b.featuredRank ?? 999));

  const blogSchema = {
    '@type': 'Blog',
    name: 'Dreamy Vacations Coorg & Kushalnagar Travel Publication',
    url: canonical,
    description,
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
  };

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog & Travel Guides', item: canonical },
    ],
  };

  const pillarPosts = postsArray.filter((p) => (p.featuredRank ?? 999) <= 4);
  const pillarHtml = pillarPosts
    .map(
      (p) => `<article class="bg-[#121212] border border-white/10 rounded-xl p-5 space-y-2">
              <span class="text-[10px] font-mono text-[#e2d7c5]">${escapeHtml(p.category)} • ${escapeHtml(p.readTime)}</span>
              <h3 class="text-lg font-display text-white">
                <a href="/blog/${escapeHtml(p.slug)}" class="hover:text-[#e2d7c5]">${escapeHtml(p.title)}</a>
              </h3>
              <p class="text-xs text-white/65 leading-relaxed">${escapeHtml(p.metaDesc)}</p>
            </article>`
    )
    .join('\n          ');

  const categorySectionsHtml = BLOG_CATEGORIES.map((category) => {
    const items = postsArray.filter((p) => p.category === category);
    const cardsHtml = items
      .map(
        (p) => `<article class="bg-[#121212] border border-white/10 rounded-xl p-5 space-y-2">
              <span class="text-[10px] font-mono text-[#e2d7c5]">${escapeHtml(p.readTime)}</span>
              <h3 class="text-lg font-display text-white">
                <a href="/blog/${escapeHtml(p.slug)}" class="hover:text-[#e2d7c5]">${escapeHtml(p.title)}</a>
              </h3>
              <p class="text-xs text-white/65 leading-relaxed">${escapeHtml(p.metaDesc)}</p>
            </article>`
      )
      .join('\n          ');

    return `<section class="space-y-4">
        <h2 class="text-2xl font-display text-[#e2d7c5] border-b border-white/10 pb-2">${escapeHtml(category)}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          ${cardsHtml}
        </div>
      </section>`;
  }).join('\n      ');

  const bodyHtml = `<main class="max-w-5xl mx-auto px-6 py-16 space-y-12">
        <header class="space-y-4 text-center">
          <h1 class="text-4xl font-display text-white">Coorg Travel Guides, Tibetan Heritage &amp; Itineraries</h1>
          <p class="text-sm text-white/75 max-w-2xl mx-auto">Research-backed Coorg trip plans, 25 places to visit, month-by-month weather analysis, Bylakuppe Tibetan culture, and honest stay comparisons from Kushalnagar.</p>
        </header>
        <section class="space-y-4">
          <h2 class="text-2xl font-display text-[#e2d7c5] border-b border-white/10 pb-2">Essential Coorg Planning Guides</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            ${pillarHtml}
          </div>
        </section>
        ${categorySectionsHtml}
      </main>`;

  return renderHtmlDocument({
    title,
    description,
    canonical,
    ogImage,
    ogType: 'website',
    schemas: [ORGANIZATION_SCHEMA, blogSchema, breadcrumbSchema],
    bodyHtml,
    gtmBlock,
    assetTags,
  });
}

function buildBlogPostHtml(slug: string, post: BlogPost, gtmBlock: string, assetTags: string): string {
  const canonicalSlug = post.canonicalSlug || slug;
  const canonical = `${SITE_ORIGIN}/blog/${canonicalSlug}`;
  const fullTitle = post.seoTitle;
  const ogImage = post.heroImg.startsWith('http') ? post.heroImg : `${SITE_ORIGIN}${post.heroImg}`;

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
      url: `${SITE_ORIGIN}/`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dreamy Vacations',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}/images/logo/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
  };

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Travel Guides', item: `${SITE_ORIGIN}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
    ],
  };

  const discoverHtml = post.discoverPoints?.length
    ? `<section class="space-y-3">
          <h2>What You&apos;ll Discover</h2>
          <ul>${post.discoverPoints.map((pt) => `<li>${escapeHtml(pt)}</li>`).join('')}</ul>
        </section>`
    : '';

  const quickSummaryHtml = post.quickSummary?.items?.length
    ? `<section class="space-y-3">
          <h2>${escapeHtml(post.quickSummary.heading || 'Planning Your Coorg Trip?')}</h2>
          <dl>${post.quickSummary.items
            .map((it) => `<dt>${escapeHtml(it.label)}</dt><dd>${escapeHtml(it.value)}</dd>`)
            .join('')}</dl>
        </section>`
    : '';

  const tocHtml = post.tocGroups?.length
    ? post.tocGroups
        .map(
          (g) => `<div><h3><a href="#${escapeHtml(g.sectionId)}">${escapeHtml(g.region)}</a></h3><ul>${g.items
            .map((item) => `<li><a href="#${escapeHtml(item.id)}">${escapeHtml(item.label)}</a></li>`)
            .join('')}</ul></div>`
        )
        .join('\n          ')
    : `<ol>${post.sections
        .map((s) => `<li><a href="#${escapeHtml(s.id)}">${escapeHtml(s.heading)}</a></li>`)
        .join('\n          ')}</ol>`;

  const sectionsHtml = post.sections
    .map((sec) => {
      const paras = (sec.paragraphs || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('\n          ');
      const pullQuote = sec.pullQuote
        ? `<blockquote><p>${escapeHtml(sec.pullQuote.text)}</p>${
            sec.pullQuote.note ? `<small>${escapeHtml(sec.pullQuote.note)}</small>` : ''
          }</blockquote>`
        : '';
      const attractions = (sec.attractions || [])
        .map((a) => {
          const imgHtml = a.image
            ? `<figure><img src="${escapeHtml(a.image.src)}" alt="${escapeHtml(a.image.alt)}" loading="lazy" />${
                a.image.caption ? `<figcaption>${escapeHtml(a.image.caption)}</figcaption>` : ''
              }</figure>`
            : '';
          return `<article id="${escapeHtml(a.id)}" class="space-y-3">
            ${imgHtml}
            <h3>${a.number ? `${a.number}. ` : ''}${escapeHtml(a.name)}</h3>
            <p><em>${escapeHtml(a.tagline)}</em></p>
            <p>${escapeHtml(a.summary)}</p>
            ${a.whyVisit ? `<p>${escapeHtml(a.whyVisit)}</p>` : ''}
            <dl>
              <dt>Location</dt><dd>${escapeHtml(a.details.location)}</dd>
              <dt>Distance</dt><dd>${escapeHtml(a.details.distance)}</dd>
              <dt>Suggested visit</dt><dd>${escapeHtml(a.details.duration)}</dd>
              <dt>Best time</dt><dd>${escapeHtml(a.details.bestTime)}</dd>
            </dl>
            <p><strong>Travel Tip:</strong> ${escapeHtml(a.tip)}</p>
          </article>`;
        })
        .join('\n          ');
      const routePlanner = sec.routePlanner
        ? `<div class="space-y-4">
            ${sec.routePlanner.intro ? `<p>${escapeHtml(sec.routePlanner.intro)}</p>` : ''}
            ${sec.routePlanner.regions
              .map(
                (r) => `<div><h3>${escapeHtml(r.region)}: ${escapeHtml(r.title)}</h3><p>${escapeHtml(
                  r.stops.join(' -> ')
                )}</p><p>${escapeHtml(r.note)}</p><p>${escapeHtml(r.distanceNote)}</p></div>`
              )
              .join('\n            ')}
            <p><em>${escapeHtml(sec.routePlanner.disclaimer)}</em></p>
          </div>`
        : '';
      const subs = (sec.subsections || [])
        .map((sub) => {
          const sp = (sub.paragraphs || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('\n            ');
          const sb = sub.bullets?.length
            ? `<ul>${sub.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`
            : '';
          return `<div class="space-y-2">
            <h3>${escapeHtml(sub.heading)}</h3>
            ${sp}
            ${sb}
          </div>`;
        })
        .join('\n          ');
      const bullets = sec.bullets?.length
        ? `<ul>${sec.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`
        : '';
      const table = sec.table
        ? `<table>${sec.table.caption ? `<caption>${escapeHtml(sec.table.caption)}</caption>` : ''}<thead><tr>${sec.table.headers
            .map((h) => `<th>${escapeHtml(h)}</th>`)
            .join('')}</tr></thead><tbody>${sec.table.rows
            .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
            .join('')}</tbody></table>`
        : '';
      const links = sec.links?.length
        ? `<ul>${sec.links.map((l) => `<li><a href="${escapeHtml(l.to)}">${escapeHtml(l.label)}</a></li>`).join('')}</ul>`
        : '';
      const callout = sec.callout
        ? `<aside><strong>${escapeHtml(sec.callout.title)}:</strong> ${escapeHtml(sec.callout.text)}</aside>`
        : '';
      const image = sec.image
        ? `<figure><img src="${escapeHtml(sec.image.src)}" alt="${escapeHtml(sec.image.alt)}" loading="lazy" />${
            sec.image.caption ? `<figcaption>${escapeHtml(sec.image.caption)}</figcaption>` : ''
          }</figure>`
        : '';

      return `<section id="${escapeHtml(sec.id)}" class="space-y-4">
          <h2>${escapeHtml(sec.heading)}</h2>
          ${paras}
          ${pullQuote}
          ${attractions}
          ${routePlanner}
          ${subs}
          ${bullets}
          ${table}
          ${links}
          ${callout}
          ${image}
        </section>`;
    })
    .join('\n        ');

  const highlightsHtml = post.highlights?.length
    ? `<section class="space-y-3">
          <h2>Quick Reference &amp; Travel Facts</h2>
          <dl>
            ${post.highlights.map((h) => `<dt>${escapeHtml(h.label)}</dt><dd>${escapeHtml(h.value)}</dd>`).join('')}
          </dl>
        </section>`
    : '';

  const stayHtml = post.stayRecommendation
    ? `<section class="space-y-3">
          <h2>${escapeHtml(post.stayRecommendation.heading)}</h2>
          <p>${escapeHtml(post.stayRecommendation.text)}</p>
          <ul>${post.stayRecommendation.links
            .map((l) => `<li><a href="${escapeHtml(l.to)}">${escapeHtml(l.label)}</a></li>`)
            .join('')}</ul>
        </section>`
    : '';

  const faqsHtml = post.faqs.length
    ? `<section id="article-faqs" class="space-y-4">
          <h2>Frequently Asked Questions</h2>
          ${post.faqs
            .map((f) => `<div><h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p></div>`)
            .join('\n          ')}
        </section>`
    : '';

  const relatedHtml = post.relatedSlugs
    .filter((rel) => Boolean(CANONICAL_BLOG_POSTS[rel]))
    .map((rel) => {
      const target = CANONICAL_BLOG_POSTS[rel];
      return `<li><a href="/blog/${escapeHtml(rel)}">${escapeHtml(target.title)}</a></li>`;
    })
    .join('\n            ');

  const bodyHtml = `<main class="max-w-4xl mx-auto px-6 py-14 space-y-8">
        <nav aria-label="Breadcrumb">
          <ol class="flex flex-wrap gap-2 text-xs text-white/60">
            <li><a href="/">Home</a> /</li>
            <li><a href="/blog">Travel Guides</a> /</li>
            <li>${escapeHtml(post.category)}</li>
          </ol>
        </nav>
        <article class="space-y-8">
          <header class="space-y-3">
            <span>${escapeHtml(post.category)} • ${escapeHtml(post.readTime)} • Updated ${escapeHtml(post.updatedDate)}</span>
            <h1 class="text-4xl font-display text-white">${escapeHtml(post.title)}</h1>
            <p class="text-white/75">${escapeHtml(post.metaDesc)}</p>
          </header>
          <figure>
            <img src="${escapeHtml(post.heroImg)}" alt="${escapeHtml(post.heroAlt)}" width="1200" height="638" />
            ${post.heroCaption ? `<figcaption>${escapeHtml(post.heroCaption)}</figcaption>` : ''}
          </figure>
          ${discoverHtml}
          ${quickSummaryHtml}
          ${post.intro.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n          ')}
          <nav aria-label="Article table of contents">
            <h2>In This Guide</h2>
            ${tocHtml}
          </nav>
          ${sectionsHtml}
          ${highlightsHtml}
          ${stayHtml}
          <section class="space-y-2">
            <h2>Before You Go</h2>
            <p>${escapeHtml(post.conclusion)}</p>
          </section>
          ${faqsHtml}
          <section class="space-y-2">
            <h2>Related Guides</h2>
            <ul>
              ${relatedHtml}
            </ul>
          </section>
        </article>
      </main>`;

  return renderHtmlDocument({
    title: fullTitle,
    description: post.metaDesc,
    canonical,
    ogImage,
    ogType: 'article',
    schemas: [articleSchema, breadcrumbSchema],
    bodyHtml,
    gtmBlock,
    assetTags,
  });
}

function buildRoomsHubHtml(gtmBlock: string, assetTags: string): string {
  const title = 'Coorg Resort & Accommodation Near Kushalnagar | Dreamy Vacations';
  const description =
    'Explore couples rooms, spacious family suites, and group accommodations at Dreamy Vacations near Kushalnagar, Coorg—with swimming pool, rain dance, indoor games, and easy access to Bylakuppe and Madikeri.';
  const canonical = `${SITE_ORIGIN}/rooms`;
  const ogImage = `${SITE_ORIGIN}/images/rooms/df1/df1.jpeg`;

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Rooms', item: canonical },
    ],
  };

  const bodyHtml = `<main class="max-w-5xl mx-auto px-6 py-16 space-y-12">
        <header class="space-y-3 text-center">
          <h1 class="text-4xl font-display text-white">Coorg Resort &amp; Accommodation Near Kushalnagar</h1>
          <p class="text-white/75 max-w-2xl mx-auto">Choose from private rooms for couples, multi-bed family rooms, and adjoining cottages for groups at Dreamy Vacations in Chikkathur Village near Kushalnagar, Coorg.</p>
        </header>
        <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article class="bg-[#121212] border border-white/10 rounded-xl p-6 space-y-3">
            <h2 class="text-xl font-display text-white"><a href="/rooms/couples">Rooms for Couples</a></h2>
            <p class="text-sm text-white/70">Private cottages with king-size double bedding, warm wood finishes, and serene garden surroundings tailored for two.</p>
            <a href="/rooms/couples" class="text-[#e2d7c5] text-xs uppercase tracking-wider">Explore Rooms &rarr;</a>
          </article>
          <article class="bg-[#121212] border border-white/10 rounded-xl p-6 space-y-3">
            <h2 class="text-xl font-display text-white"><a href="/rooms/families">Rooms for Families</a></h2>
            <p class="text-sm text-white/70">Spacious ground-level cottages and multi-bed family layouts steps away from our outdoor swimming pool and indoor games area.</p>
            <a href="/rooms/families" class="text-[#e2d7c5] text-xs uppercase tracking-wider">Explore Rooms &rarr;</a>
          </article>
          <article class="bg-[#121212] border border-white/10 rounded-xl p-6 space-y-3">
            <h2 class="text-xl font-display text-white"><a href="/rooms/group-booking">Group Booking</a></h2>
            <p class="text-sm text-white/70">Adjoining cottages and multi-bed units arranged around our private courtyard with custom Coorg dining, campfire, and coach parking.</p>
            <a href="/rooms/group-booking" class="text-[#e2d7c5] text-xs uppercase tracking-wider">Explore Rooms &rarr;</a>
          </article>
        </section>
        <section class="space-y-4">
          <h2 class="text-2xl font-display text-[#e2d7c5]">Verified On-Site Facilities</h2>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-white/75">
            <li>Outdoor Swimming Pool suitable for adults and children</li>
            <li>Rain Dance area with music for families and travel groups</li>
            <li>Indoor Games including carrom, chess, board games, and table tennis</li>
            <li>Evening Campfire area (subject to weather and availability)</li>
            <li>Complimentary Wi-Fi across rooms and common courtyard zones</li>
            <li>Free on-site parking for private cars, tempo travellers, and tourist buses</li>
          </ul>
        </section>
        <section class="space-y-4">
          <h2 class="text-2xl font-display text-[#e2d7c5]">Why Choose a Stay Near Kushalnagar, Coorg?</h2>
          <p class="text-sm text-white/75 leading-relaxed">Dreamy Vacations sits in Chikkathur Village near Kushalnagar in eastern Coorg, giving highway travellers from Bangalore and Mysore gentle plateau access without uphill hairpin driving on arrival day. Guests reach Kaveri Nisargadhama (~4 km), Namdroling Monastery / Golden Temple in Bylakuppe (~6 km), Harangi Dam (~9 km), Dubare Elephant Camp (~14 km), and Chiklihole Reservoir (~15 km) within short drives, while Madikeri attractions such as Abbey Falls and Raja's Seat remain comfortable 45-to-55-minute day trips west.</p>
          <p class="text-sm text-white/75">Address: #51/5, Behind Chikkathur Govt School, Chikkathur Village, Kushalnagar, Kudumangalore, Karnataka 571232. <a href="${GOOGLE_MAPS_URL}" class="underline text-[#e2d7c5]">Open in Google Maps</a> or <a href="${WHATSAPP_URL}" class="underline text-[#e2d7c5]">Enquire via WhatsApp (+91 99029 60484)</a>.</p>
        </section>
        <section class="space-y-3">
          <h2 class="text-2xl font-display text-[#e2d7c5]">Plan Your Coorg Stay &amp; Sightseeing</h2>
          <ul class="space-y-2 text-sm">
            <li><a href="/blog/where-to-stay-in-coorg" class="text-[#e2d7c5] underline">Where to Stay in Coorg: Best Areas for Families, Couples &amp; Groups</a></li>
            <li><a href="/blog/coorg-trip-plan-2-days" class="text-[#e2d7c5] underline">Coorg Trip Plan for 2 Days: Complete Itinerary &amp; Travel Guide</a></li>
            <li><a href="/blog/places-to-visit-in-coorg" class="text-[#e2d7c5] underline">Best Places to Visit in Coorg: 25 Attractions &amp; Travel Guide</a></li>
            <li><a href="/blog/best-time-to-visit-coorg" class="text-[#e2d7c5] underline">Best Time to Visit Coorg: Weather, Seasons &amp; Month-by-Month Guide</a></li>
          </ul>
        </section>
      </main>`;

  return renderHtmlDocument({
    title,
    description,
    canonical,
    ogImage,
    schemas: [LODGING_SCHEMA, breadcrumbSchema],
    bodyHtml,
    gtmBlock,
    assetTags,
  });
}

function buildRoomCategoryHtml(
  category: 'couples' | 'families' | 'group-booking',
  gtmBlock: string,
  assetTags: string
): string {
  const configs = {
    couples: {
      title: 'Rooms for Couples in Coorg | Dreamy Vacations, Kushalnagar',
      description:
        'Peaceful double-bed cottages for couples near Kushalnagar, Coorg with private ensuite bathrooms, swimming pool access, and calm Chikkathur village surroundings.',
      h1: 'Rooms for Couples in Coorg',
      breadcrumbName: 'Rooms for Couples',
      ogImage: `${SITE_ORIGIN}/images/rooms/df1/df1.jpeg`,
      intro:
        'Designed for two guests looking for calm village greenery, private king-size double bedding, warm wooden ceilings, and quick drives to Bylakuppe, Dubare, and Madikeri.',
      roomSummaries: [
        'Deluxe Family Room (420 sq.ft., 1 Double Bed, private balcony overlooking pool and gardens)',
        'Standard Family Room (380 sq.ft., 1 Double Bed, quiet ground-level layout with modern ensuite bathroom)',
      ],
      extraSectionTitle: 'Couple-Friendly Stays Near Kushalnagar & Bylakuppe',
      extraSectionText:
        'Wake up to peaceful greenery in Chikkathur Village, explore Namdroling Monastery (Golden Temple) and Kaveri Nisargadhama in the morning, relax by the outdoor swimming pool in the afternoon, and drive west to Raja\'s Seat or Mandalpatti on your hill-sightseeing day.',
    },
    families: {
      title: 'Family Rooms in Coorg | Dreamy Vacations, Kushalnagar',
      description:
        'Explore family accommodation at Dreamy Vacations near Kushalnagar, Coorg, with spacious room options, pool access and family-friendly facilities.',
      h1: 'Family Rooms in Coorg',
      breadcrumbName: 'Family Rooms in Coorg',
      ogImage: `${SITE_ORIGIN}/images/gallery/unnamed (1).webp`,
      intro:
        'Spacious ground-level cottages and multi-bed rooms built for parents, children, and multi-generational families visiting Coorg. Enjoy flat grounds, an outdoor swimming pool, rain dance, indoor games, and easy highway access near Kushalnagar.',
      roomSummaries: [
        'Standard Family Room (380 sq.ft., 1 Double Bed — suited for parents with a young child or couples)',
        'Deluxe Family Room (420 sq.ft., 1 Double Bed with private balcony overlooking pool and gardens)',
        'Superior Deluxe Double (320 sq.ft., 2 Double Beds — suited for families of 3 to 4 staying together in one room)',
        'Triple Room (350 sq.ft., 3 Double Beds — suited for joint families or groups of up to 6 guests)',
      ],
      extraSectionTitle: 'Choosing the Right Family Room in Coorg',
      extraSectionText:
        'Small families of 2 to 3 guests typically pick our Standard or Deluxe Family Room, families of 4 prefer the two-double-bed Superior Deluxe Double so everyone sleeps comfortably in one room, and extended families of 5 to 6 guests choose our three-double-bed Triple Room or adjoining ground-level cottages close to the pool and dining courtyard.',
    },
    'group-booking': {
      title: 'Group Accommodation & Cottage Stays in Coorg | Dreamy Vacations',
      description:
        'Group accommodations near Kushalnagar, Coorg for friends, reunions, and corporate teams with multi-bed rooms, adjoining cottages, custom dining, campfire, and coach parking.',
      h1: 'Group Booking & Multi-Bed Stays in Coorg',
      breadcrumbName: 'Group Booking',
      ogImage: `${SITE_ORIGIN}/images/gallery/unnamed (3).webp`,
      intro:
        'Adjoining cottages and multi-bed rooms arranged around our private courtyard in Chikkathur Village near Kushalnagar, tailored for friends trips, family reunions, college groups, and corporate retreats.',
      roomSummaries: [
        'Triple Rooms (3 Double Beds, up to 6 guests per room) for shared group stays',
        'Superior Deluxe Double Rooms (2 Double Beds, up to 4 guests per room)',
        'Adjoining ground-level cottages with courtyard access, custom Coorg meals on request, rain dance, swimming pool, evening campfire, and bus/tempo-traveller parking',
      ],
      extraSectionTitle: 'Easy Highway Access for Group Vehicles',
      extraSectionText:
        'Because Dreamy Vacations sits on gentler eastern Coorg terrain near Kushalnagar, large tempo travellers and tourist coaches reach the property smoothly without navigating steep hill lanes, with ample free on-site parking inside the grounds.',
    },
  };

  const cfg = configs[category];
  const canonical = `${SITE_ORIGIN}/rooms/${category}`;
  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Rooms', item: `${SITE_ORIGIN}/rooms` },
      { '@type': 'ListItem', position: 3, name: cfg.breadcrumbName, item: canonical },
    ],
  };

  const bodyHtml = `<main class="max-w-4xl mx-auto px-6 py-16 space-y-10">
        <nav aria-label="Breadcrumb">
          <ol class="flex flex-wrap gap-2 text-xs text-white/60">
            <li><a href="/">Home</a> /</li>
            <li><a href="/rooms">Rooms</a> /</li>
            <li>${escapeHtml(cfg.breadcrumbName)}</li>
          </ol>
        </nav>
        <header class="space-y-4">
          <h1 class="text-4xl font-display text-white">${escapeHtml(cfg.h1)}</h1>
          <p class="text-white/75 leading-relaxed">${escapeHtml(cfg.intro)}</p>
        </header>
        <section class="space-y-3">
          <h2 class="text-2xl font-display text-[#e2d7c5]">Room Options &amp; Capacities</h2>
          <ul class="space-y-2 text-sm text-white/80">
            ${cfg.roomSummaries.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n            ')}
          </ul>
        </section>
        <section class="space-y-3">
          <h2 class="text-2xl font-display text-[#e2d7c5]">${escapeHtml(cfg.extraSectionTitle)}</h2>
          <p class="text-sm text-white/75 leading-relaxed">${escapeHtml(cfg.extraSectionText)}</p>
        </section>
        <section class="space-y-3">
          <h2 class="text-2xl font-display text-[#e2d7c5]">Property Facilities &amp; Location</h2>
          <p class="text-sm text-white/75">Guests enjoy our outdoor swimming pool, rain dance area, indoor games (carrom, chess, table tennis), evening campfire area (subject to weather), complimentary Wi-Fi, and free on-site parking at #51/5, Behind Chikkathur Govt School, Chikkathur Village, Kushalnagar, Kudumangalore, Karnataka 571232.</p>
          <p class="text-sm"><a href="${WHATSAPP_URL}" class="text-[#e2d7c5] underline">Enquire Now on WhatsApp (+91 99029 60484)</a> | <a href="${GOOGLE_MAPS_URL}" class="text-[#e2d7c5] underline">Google Maps Directions</a></p>
        </section>
        <section class="space-y-3">
          <h2 class="text-2xl font-display text-[#e2d7c5]">Nearby Attractions &amp; Coorg Travel Guides</h2>
          <ul class="space-y-2 text-sm">
            <li><a href="/blog/places-to-visit-in-coorg" class="text-[#e2d7c5] underline">Best Places to Visit in Coorg (25 Attractions)</a></li>
            <li><a href="/blog/coorg-trip-plan-2-days" class="text-[#e2d7c5] underline">Coorg Trip Plan for 2 Days</a></li>
            <li><a href="/blog/best-time-to-visit-coorg" class="text-[#e2d7c5] underline">Best Time to Visit Coorg (Month-by-Month Guide)</a></li>
            <li><a href="/blog/where-to-stay-in-coorg" class="text-[#e2d7c5] underline">Where to Stay in Coorg: Area Comparison</a></li>
            <li><a href="/blog/kushalnagar-tourist-places" class="text-[#e2d7c5] underline">Kushalnagar Tourist Places</a></li>
          </ul>
        </section>
      </main>`;

  return renderHtmlDocument({
    title: cfg.title,
    description: cfg.description,
    canonical,
    ogImage: cfg.ogImage,
    schemas: [LODGING_SCHEMA, breadcrumbSchema],
    bodyHtml,
    gtmBlock,
    assetTags,
  });
}

function buildIndividualRoomHtml(room: StaticRoomMeta, gtmBlock: string, assetTags: string): string {
  const canonical = `${SITE_ORIGIN}/rooms/${room.id}`;
  const title = `${room.name} | Dreamy Vacations Kushalnagar, Coorg`;
  const description = `${room.description} Capacity: ${room.occupancy}. Enquire via WhatsApp for availability at Dreamy Vacations in Kushalnagar, Coorg.`;
  const ogImage = `${SITE_ORIGIN}${room.image}`;

  const roomSchema = {
    '@type': 'HotelRoom',
    name: room.name,
    description: room.longDescription,
    image: ogImage,
    occupancy: {
      '@type': 'QuantitativeValue',
      value: room.occupancy,
    },
    floorSize: {
      '@type': 'QuantitativeValue',
      value: room.size,
    },
    containedInPlace: {
      '@id': `${SITE_ORIGIN}/#lodging`,
    },
  };

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Rooms', item: `${SITE_ORIGIN}/rooms` },
      { '@type': 'ListItem', position: 3, name: room.name, item: canonical },
    ],
  };

  const bodyHtml = `<main class="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <nav aria-label="Breadcrumb">
          <ol class="flex flex-wrap gap-2 text-xs text-white/60">
            <li><a href="/">Home</a> /</li>
            <li><a href="/rooms">Rooms</a> /</li>
            <li>${escapeHtml(room.name)}</li>
          </ol>
        </nav>
        <header class="space-y-3">
          <h1 class="text-4xl font-display text-white">${escapeHtml(room.name)}</h1>
          <p class="text-xs text-[#e2d7c5]">Capacity: ${escapeHtml(room.occupancy)} • Room Size: ${escapeHtml(room.size)}</p>
          <p class="text-white/75 leading-relaxed">${escapeHtml(room.longDescription)}</p>
        </header>
        <section class="space-y-3">
          <h2 class="text-2xl font-display text-[#e2d7c5]">Room Amenities</h2>
          <ul class="space-y-1 text-sm text-white/80">
            ${room.amenities.map((a) => `<li>${escapeHtml(a)}</li>`).join('\n            ')}
          </ul>
        </section>
        <section class="space-y-3">
          <h2 class="text-2xl font-display text-[#e2d7c5]">Included Resort Facilities</h2>
          <ul class="space-y-1 text-sm text-white/80">
            ${room.facilities.map((f) => `<li>${escapeHtml(f)}</li>`).join('\n            ')}
          </ul>
          <p class="text-sm"><a href="${WHATSAPP_URL}" class="text-[#e2d7c5] underline">Enquire Now on WhatsApp (+91 99029 60484)</a></p>
        </section>
      </main>`;

  return renderHtmlDocument({
    title,
    description,
    canonical,
    ogImage,
    schemas: [roomSchema, breadcrumbSchema],
    bodyHtml,
    gtmBlock,
    assetTags,
  });
}

function buildTravelGuideHtml(slug: string | null, guide: GuideData, gtmBlock: string, assetTags: string): string {
  const canonical = slug ? `${SITE_ORIGIN}/travel-guide/${slug}` : `${SITE_ORIGIN}/travel-guide`;
  const title = slug
    ? `${guide.title} | Dreamy Vacations Coorg`
    : 'Coorg Attractions & Travel Guide | Dreamy Vacations, Kushalnagar';
  const description = slug
    ? guide.subtitle
    : 'Explore Kushalnagar and Coorg attractions with practical distances, best visiting hours, and travel tips for Golden Temple, Dubare Elephant Camp, Nisargadhama, Harangi Dam, and Madikeri.';
  const ogImage = `${SITE_ORIGIN}/images/places/gold.jpeg`;

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: slug
      ? [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: 'Travel Guide', item: `${SITE_ORIGIN}/travel-guide` },
          { '@type': 'ListItem', position: 3, name: guide.title, item: canonical },
        ]
      : [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: 'Travel Guide', item: canonical },
        ],
  };

  const timelineHtml = guide.timeline
    .map(
      (block) => `<section class="space-y-3">
          <h2 class="text-2xl font-display text-[#e2d7c5]">${escapeHtml(block.day)}</h2>
          <p class="text-sm text-white/70">${escapeHtml(block.title)}</p>
          <ol class="space-y-3">
            ${block.activities
              .map(
                (act) => `<li><strong>${escapeHtml(act.time)} — ${escapeHtml(act.title)}:</strong> ${escapeHtml(
                  stripHtmlTags(act.desc)
                )}</li>`
              )
              .join('\n            ')}
          </ol>
        </section>`
    )
    .join('\n        ');

  const bodyHtml = `<main class="max-w-4xl mx-auto px-6 py-16 space-y-10">
        <header class="space-y-3">
          <h1 class="text-4xl font-display text-white">${escapeHtml(guide.title)}</h1>
          <p class="text-white/75">${escapeHtml(guide.subtitle)}</p>
        </header>
        <section class="space-y-3">
          ${guide.introParagraphs.map((p) => `<p class="text-sm text-white/80 leading-relaxed">${escapeHtml(stripHtmlTags(p))}</p>`).join('\n          ')}
        </section>
        ${timelineHtml}
        <section class="space-y-3">
          <h2 class="text-2xl font-display text-[#e2d7c5]">In-Depth Coorg Blog Guides</h2>
          <ul class="space-y-2 text-sm">
            <li><a href="/blog/places-to-visit-in-coorg" class="text-[#e2d7c5] underline">Best Places to Visit in Coorg: 25 Attractions &amp; Travel Guide</a></li>
            <li><a href="/blog/coorg-trip-plan-2-days" class="text-[#e2d7c5] underline">Coorg Trip Plan for 2 Days: Complete Itinerary &amp; Travel Guide</a></li>
            <li><a href="/blog/best-time-to-visit-coorg" class="text-[#e2d7c5] underline">Best Time to Visit Coorg: Weather, Seasons &amp; Month-by-Month Guide</a></li>
            <li><a href="/blog/where-to-stay-in-coorg" class="text-[#e2d7c5] underline">Where to Stay in Coorg: Best Areas for Families, Couples &amp; Groups</a></li>
          </ul>
        </section>
      </main>`;

  return renderHtmlDocument({
    title,
    description,
    canonical,
    ogImage,
    schemas: [breadcrumbSchema],
    bodyHtml,
    gtmBlock,
    assetTags,
  });
}

function buildStaticMarketingPages(gtmBlock: string, assetTags: string): Array<{ route: string; html: string }> {
  const pages: Array<{
    route: string;
    title: string;
    description: string;
    ogImage: string;
    h1: string;
    breadcrumbName: string;
    schemas: Record<string, unknown>[];
    sectionsHtml: string;
  }> = [
    {
      route: 'about',
      title: 'About Dreamy Vacations | Kushalnagar, Coorg Stay',
      description:
        'Learn about Dreamy Vacations in Chikkathur Village near Kushalnagar, Coorg—our family-friendly accommodation, on-site facilities, and location near Bylakuppe and Madikeri.',
      ogImage: `${SITE_ORIGIN}/images/gallery/unnamed (1).webp`,
      h1: 'About Dreamy Vacations in Kushalnagar, Coorg',
      breadcrumbName: 'About',
      schemas: [ORGANIZATION_SCHEMA, LODGING_SCHEMA],
      sectionsHtml: `<p class="text-white/75 leading-relaxed">Dreamy Vacations is a quiet family and group accommodation property located in Chikkathur Village near Kushalnagar, Coorg, Karnataka. Designed around ground-level cottages, multi-bed family rooms, an outdoor swimming pool, rain dance area, indoor games, and open courtyard space, our property gives travellers a calm eastern-Coorg base close to Bylakuppe, Kaveri Nisargadhama, Harangi Dam, and Dubare Elephant Camp, with smooth day-trip access to Madikeri.</p>
        <ul class="space-y-2 text-sm">
          <li><a href="/rooms" class="text-[#e2d7c5] underline">Explore Our Accommodation Categories</a></li>
          <li><a href="/rooms/families" class="text-[#e2d7c5] underline">Family Rooms in Coorg</a></li>
          <li><a href="/blog/places-to-visit-in-coorg" class="text-[#e2d7c5] underline">Best Places to Visit in Coorg</a></li>
          <li><a href="/blog/coorg-trip-plan-2-days" class="text-[#e2d7c5] underline">Coorg Trip Plan for 2 Days</a></li>
        </ul>`,
    },
    {
      route: 'contact',
      title: 'Contact & Directions | Dreamy Vacations Kushalnagar, Coorg',
      description:
        'Contact Dreamy Vacations in Chikkathur Village, Kushalnagar, Coorg. Phone and WhatsApp (+91 99029 60484), full address, GPS coordinates, and Google Maps directions.',
      ogImage: `${SITE_ORIGIN}/images/logo/logo.png`,
      h1: 'Contact Dreamy Vacations & Driving Directions',
      breadcrumbName: 'Contact',
      schemas: [LODGING_SCHEMA],
      sectionsHtml: `<p class="text-white/75">Address: #51/5, Behind Chikkathur Govt School, Chikkathur Village, Kushalnagar, Kudumangalore, Karnataka 571232, India.</p>
        <p class="text-white/75">GPS Coordinates: 12.486260, 75.940539 | Phone &amp; WhatsApp: <a href="tel:+919902960484" class="text-[#e2d7c5] underline">+91 99029 60484</a></p>
        <p class="text-sm"><a href="${GOOGLE_MAPS_URL}" class="text-[#e2d7c5] underline">Open Dreamy Vacations on Google Maps</a> | <a href="${WHATSAPP_URL}" class="text-[#e2d7c5] underline">Message on WhatsApp</a></p>`,
    },
    {
      route: 'gallery',
      title: 'Photo Gallery | Dreamy Vacations Kushalnagar, Coorg',
      description:
        'Browse real photographs of Dreamy Vacations in Chikkathur Village near Kushalnagar, Coorg—including guest rooms, cottages, outdoor swimming pool, indoor games, and evening courtyard views.',
      ogImage: `${SITE_ORIGIN}/images/gallery/unnamed.webp`,
      h1: 'Dreamy Vacations Property & Room Photo Gallery',
      breadcrumbName: 'Gallery',
      schemas: [],
      sectionsHtml: `<p class="text-white/75 leading-relaxed">Browse photographs of our guest rooms, wooden-ceiling interiors, ground-level cottages, outdoor swimming pool, rain dance area, indoor games room, and Chikkathur Village greenery in Kushalnagar, Coorg.</p>
        <p class="text-sm"><a href="/rooms/families" class="text-[#e2d7c5] underline">View Family Rooms</a> | <a href="/rooms/couples" class="text-[#e2d7c5] underline">View Couples Rooms</a> | <a href="/rooms/group-booking" class="text-[#e2d7c5] underline">View Group Stays</a></p>`,
    },
    {
      route: 'booking',
      title: 'Room Availability & Stay Enquiry | Dreamy Vacations Coorg',
      description:
        'Send a direct room availability enquiry for Dreamy Vacations in Kushalnagar, Coorg via WhatsApp or phone (+91 99029 60484) for couples, families, and groups.',
      ogImage: `${SITE_ORIGIN}/images/rooms/df1/df1.jpeg`,
      h1: 'Check Room Availability at Dreamy Vacations, Coorg',
      breadcrumbName: 'Stay Enquiry',
      schemas: [LODGING_SCHEMA],
      sectionsHtml: `<p class="text-white/75 leading-relaxed">Enquire directly with our Kushalnagar desk for couples rooms, multi-bed family rooms, or group stays. Share your check-in date, check-out date, and guest count on WhatsApp or by phone for prompt availability confirmation.</p>
        <p class="text-sm"><a href="${WHATSAPP_URL}" class="text-[#e2d7c5] underline">Enquire Now via WhatsApp (+91 99029 60484)</a> | <a href="tel:+919902960484" class="text-[#e2d7c5] underline">Call +91 99029 60484</a></p>`,
    },
    {
      route: 'group-booking',
      title: 'Group Booking & Corporate Retreats in Coorg | Dreamy Vacations',
      description:
        'Enquire for group stays, family reunions, and corporate retreats at Dreamy Vacations near Kushalnagar, Coorg—with multi-bed rooms, custom dining, campfire, and coach parking.',
      ogImage: `${SITE_ORIGIN}/images/gallery/unnamed (3).webp`,
      h1: 'Group Booking & Corporate Retreats in Kushalnagar, Coorg',
      breadcrumbName: 'Group Booking',
      schemas: [LODGING_SCHEMA],
      sectionsHtml: `<p class="text-white/75 leading-relaxed">Host family reunions, friends getaways, or corporate offsites at Dreamy Vacations near Kushalnagar, Coorg. Enjoy adjoining cottages, 2-bed and 3-bed group rooms, swimming pool, rain dance, indoor games, custom meal plans, campfire setups, and free parking for tourist coaches and tempo travellers.</p>
        <p class="text-sm"><a href="/rooms/group-booking" class="text-[#e2d7c5] underline">Explore Group Room Configurations</a> | <a href="${WHATSAPP_URL}" class="text-[#e2d7c5] underline">Enquire for Group Availability</a></p>`,
    },
    {
      route: 'trip-planner',
      title: 'Coorg Trip Planner & Custom Itinerary Builder | Dreamy Vacations',
      description:
        'Build a customized Coorg travel itinerary based on your dates and group size, covering Kushalnagar, Bylakuppe, Dubare, and Madikeri with printable PDF export.',
      ogImage: `${SITE_ORIGIN}/images/places/dubare.jpeg`,
      h1: 'Interactive Coorg Trip Planner & PDF Itinerary Builder',
      breadcrumbName: 'Trip Planner',
      schemas: [],
      sectionsHtml: `<p class="text-white/75 leading-relaxed">Select your arrival and departure dates, number of adults and children, and generate a day-by-day Coorg itinerary structured around Kushalnagar, Bylakuppe Tibetan Monastery, Dubare Elephant Camp, Harangi Dam, Abbey Falls, Mandalpatti Peak, and Raja's Seat—with shareable link and printable PDF export.</p>
        <ul class="space-y-2 text-sm">
          <li><a href="/blog/coorg-trip-plan-2-days" class="text-[#e2d7c5] underline">Read Our 2-Day Coorg Trip Plan</a></li>
          <li><a href="/blog/3-day-coorg-itinerary" class="text-[#e2d7c5] underline">Read Our 3-Day Coorg Itinerary</a></li>
          <li><a href="/blog/places-to-visit-in-coorg" class="text-[#e2d7c5] underline">Browse 25 Best Places to Visit in Coorg</a></li>
        </ul>`,
    },
  ];

  return pages.map((page) => {
    const canonical = `${SITE_ORIGIN}/${page.route}`;
    const breadcrumbSchema = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: page.breadcrumbName, item: canonical },
      ],
    };

    const bodyHtml = `<main class="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <nav aria-label="Breadcrumb">
          <ol class="flex flex-wrap gap-2 text-xs text-white/60">
            <li><a href="/">Home</a> /</li>
            <li>${escapeHtml(page.breadcrumbName)}</li>
          </ol>
        </nav>
        <h1 class="text-4xl font-display text-white">${escapeHtml(page.h1)}</h1>
        <div class="space-y-6">${page.sectionsHtml}</div>
      </main>`;

    return {
      route: page.route,
      html: renderHtmlDocument({
        title: page.title,
        description: page.description,
        canonical,
        ogImage: page.ogImage,
        schemas: [...page.schemas, breadcrumbSchema],
        bodyHtml,
        gtmBlock,
        assetTags,
      }),
    };
  });
}

function writeRouteHtml(distDir: string, routePath: string, html: string): void {
  const cleanRoute = routePath.replace(/^\/+|\/+$/g, '');
  if (!cleanRoute) return;

  // 1. Write flat clean-URL HTML file (e.g. dist/blog.html, dist/rooms/families.html)
  // so Vercel cleanUrls serves route-specific HTML directly without SPA homepage fallback.
  const flatFilePath = path.join(distDir, `${cleanRoute}.html`);
  fs.mkdirSync(path.dirname(flatFilePath), { recursive: true });
  fs.writeFileSync(flatFilePath, html, 'utf-8');

  // 2. Also write directory index HTML (e.g. dist/blog/index.html, dist/rooms/families/index.html)
  // so directory-style static servers and preview hosts serve the exact same static HTML.
  const dirIndexPath = path.join(distDir, cleanRoute, 'index.html');
  fs.mkdirSync(path.dirname(dirIndexPath), { recursive: true });
  fs.writeFileSync(dirIndexPath, html, 'utf-8');
}

export function prerenderBlogPlugin(): Plugin {
  return {
    name: 'dreamy-vacations-prerender-routes',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const distIndexPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(distIndexPath)) {
        return;
      }

      const distHtml = fs.readFileSync(distIndexPath, 'utf-8');
      const { gtmBlock, assetTags } = extractHeadParts(distHtml);

      // 1. Blog index & every blog post (including alias routes with canonical tags)
      writeRouteHtml(distDir, 'blog', buildBlogIndexHtml(gtmBlock, assetTags));
      for (const [slug, post] of Object.entries(BLOG_POSTS)) {
        writeRouteHtml(distDir, `blog/${slug}`, buildBlogPostHtml(slug, post, gtmBlock, assetTags));
      }

      // 2. Rooms hub, category pages, and individual room detail pages
      writeRouteHtml(distDir, 'rooms', buildRoomsHubHtml(gtmBlock, assetTags));
      writeRouteHtml(distDir, 'rooms/couples', buildRoomCategoryHtml('couples', gtmBlock, assetTags));
      writeRouteHtml(distDir, 'rooms/families', buildRoomCategoryHtml('families', gtmBlock, assetTags));
      writeRouteHtml(distDir, 'rooms/group-booking', buildRoomCategoryHtml('group-booking', gtmBlock, assetTags));
      for (const room of STATIC_ROOMS) {
        writeRouteHtml(distDir, `rooms/${room.id}`, buildIndividualRoomHtml(room, gtmBlock, assetTags));
      }

      // 3. Travel Guide hub & sub-guides
      writeRouteHtml(distDir, 'travel-guide', buildTravelGuideHtml(null, DEFAULT_GUIDE, gtmBlock, assetTags));
      for (const [slug, guide] of Object.entries(GUIDES_DATA)) {
        writeRouteHtml(distDir, `travel-guide/${slug}`, buildTravelGuideHtml(slug, guide, gtmBlock, assetTags));
      }

      // 4. Core marketing & planning routes
      for (const page of buildStaticMarketingPages(gtmBlock, assetTags)) {
        writeRouteHtml(distDir, page.route, page.html);
      }
    },
  };
}
