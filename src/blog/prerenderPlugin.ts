import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';
import { BLOG_CATEGORIES, BLOG_POSTS, CANONICAL_BLOG_POSTS } from '../blogData';
import type { BlogPost } from './types';

const SITE_ORIGIN = 'https://www.dreamyvacations.in';

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

  const assetMatches = distHtml.match(/<(?:script type="module"|link rel="(?:modulepreload|stylesheet)")[^>]*>(?:<\/script>)?/g) || [];
  return {
    gtmBlock,
    assetTags: assetMatches.join('\n    ')
  };
}

function renderSiteHeader(): string {
  return `<header class="py-4 px-6 border-b border-white/10 flex justify-between items-center" role="banner">
        <a href="/" aria-label="Dreamy Vacations Resort Homepage">
          <img src="/images/logo/logo.png" alt="Dreamy Vacations Resort Logo" width="160" height="42" class="h-9 w-auto object-contain" />
        </a>
        <nav aria-label="Main Navigation" class="flex flex-wrap gap-4 text-xs font-medium uppercase tracking-wider text-[#e2d7c5]">
          <a href="/rooms" class="hover:text-white">Rooms</a>
          <a href="/gallery" class="hover:text-white">Gallery</a>
          <a href="/about" class="hover:text-white">About</a>
          <a href="/travel-guide" class="hover:text-white">Travel Guide</a>
          <a href="/blog" class="hover:text-white font-semibold">Blog</a>
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
            <p class="leading-relaxed">Family and group resort in Chikkathur Village, Kushalnagar, Coorg with pool, rain dance, and tranquil grounds.</p>
          </div>
          <div>
            <h3 class="text-[#e2d7c5] font-semibold uppercase tracking-wider mb-3">Explore</h3>
            <ul class="space-y-2">
              <li><a href="/rooms" class="hover:text-white">Rooms</a></li>
              <li><a href="/gallery" class="hover:text-white">Gallery</a></li>
              <li><a href="/about" class="hover:text-white">About Us</a></li>
              <li><a href="/booking" class="hover:text-white">Booking Enquiry</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-[#e2d7c5] font-semibold uppercase tracking-wider mb-3">Popular Coorg Guides</h3>
            <ul class="space-y-2">
              <li><a href="/blog/complete-coorg-travel-guide" class="hover:text-white">Complete Coorg Guide</a></li>
              <li><a href="/blog/bylakuppe-tibetan-settlement-guide" class="hover:text-white">Bylakuppe &amp; Golden Temple</a></li>
              <li><a href="/blog/2-day-coorg-itinerary" class="hover:text-white">2-Day Coorg Itinerary</a></li>
              <li><a href="/blog/3-day-coorg-itinerary" class="hover:text-white">3-Day Coorg Itinerary</a></li>
              <li><a href="/blog/where-to-stay-in-coorg" class="hover:text-white">Where to Stay in Coorg</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-[#e2d7c5] font-semibold uppercase tracking-wider mb-3">Contact</h3>
            <p>Kushalnagar, Coorg, Karnataka 571232</p>
            <p class="mt-1"><a href="tel:+919902960484" class="text-[#e2d7c5]">+91 99029 60484</a></p>
          </div>
        </div>
      </footer>`;
}

function buildBlogIndexHtml(gtmBlock: string, assetTags: string): string {
  const title = 'Coorg Travel Guides, Tibetan Heritage & Itineraries | Dreamy Vacations';
  const description =
    'Discover the other side of Coorg with comprehensive travel guides covering Bylakuppe Tibetan culture, Kushalnagar attractions, Madikeri highlands, and realistic itineraries.';
  const canonical = `${SITE_ORIGIN}/blog`;
  const ogImage = `${SITE_ORIGIN}/images/places/gold.jpeg`;

  const postsArray = Object.entries(CANONICAL_BLOG_POSTS)
    .map(([slug, data]) => ({ slug, ...data }))
    .sort((a, b) => (a.featuredRank ?? 999) - (b.featuredRank ?? 999));

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Dreamy Vacations Coorg & Kushalnagar Travel Publication',
    url: canonical,
    description,
    publisher: { '@id': `${SITE_ORIGIN}/#resort` },
    blogPost: postsArray.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE_ORIGIN}/blog/${p.slug}`,
      datePublished: p.publishedDate,
      dateModified: p.updatedDate
    }))
  };

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

  return `<!doctype html>
<html lang="en">
  <head>
    ${gtmBlock}
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/png" href="/images/logo/logo.png" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Dreamy Vacations" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${ogImage}" />
    <script type="application/ld+json">${safeJsonLd(blogSchema)}</script>
    ${assetTags}
  </head>
  <body class="bg-[#0d0d0d] text-white">
    <div id="root">
      ${renderSiteHeader()}
      <main class="max-w-5xl mx-auto px-6 py-16 space-y-12">
        <header class="space-y-4 text-center">
          <h1 class="text-4xl font-display text-white">Coorg Travel Guides, Tibetan Heritage &amp; Itineraries</h1>
          <p class="text-sm text-white/75 max-w-2xl mx-auto">Discover the other side of Coorg. Explore Bylakuppe Tibetan culture, Kushalnagar river islands, Madikeri highlands, and realistic trip itineraries.</p>
        </header>
        ${categorySectionsHtml}
      </main>
      ${renderSiteFooter()}
    </div>
  </body>
</html>`;
}

function buildBlogPostHtml(slug: string, post: BlogPost, gtmBlock: string, assetTags: string): string {
  const canonicalSlug = post.canonicalSlug || slug;
  const canonical = `${SITE_ORIGIN}/blog/${canonicalSlug}`;
  const fullTitle = `${post.seoTitle} | Dreamy Vacations`;
  const ogImage = `${SITE_ORIGIN}${post.heroImg}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
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
      url: SITE_ORIGIN
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dreamy Vacations',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}/images/logo/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Travel Guides', item: `${SITE_ORIGIN}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonical }
    ]
  };

  const faqSchema =
    post.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a }
          }))
        }
      : null;

  const tocHtml = post.sections
    .map((s) => `<li><a href="#${escapeHtml(s.id)}">${escapeHtml(s.heading)}</a></li>`)
    .join('\n          ');

  const sectionsHtml = post.sections
    .map((sec) => {
      const paras = (sec.paragraphs || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('\n          ');
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
      const callout = sec.callout
        ? `<aside><strong>${escapeHtml(sec.callout.title)}:</strong> ${escapeHtml(sec.callout.text)}</aside>`
        : '';
      const image = sec.image
        ? `<figure><img src="${escapeHtml(sec.image.src)}" alt="${escapeHtml(sec.image.alt)}" loading="lazy" />${sec.image.caption ? `<figcaption>${escapeHtml(sec.image.caption)}</figcaption>` : ''}</figure>`
        : '';

      return `<section id="${escapeHtml(sec.id)}" class="space-y-4">
          <h2>${escapeHtml(sec.heading)}</h2>
          ${paras}
          ${subs}
          ${bullets}
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
          <ul>${post.stayRecommendation.links.map((l) => `<li><a href="${escapeHtml(l.to)}">${escapeHtml(l.label)}</a></li>`).join('')}</ul>
        </section>`
    : '';

  const faqsHtml = post.faqs.length
    ? `<section id="article-faqs" class="space-y-4">
          <h2>Frequently Asked Questions</h2>
          ${post.faqs.map((f) => `<div><h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p></div>`).join('\n          ')}
        </section>`
    : '';

  const relatedHtml = post.relatedSlugs
    .filter((rel) => Boolean(CANONICAL_BLOG_POSTS[rel]))
    .map((rel) => {
      const target = CANONICAL_BLOG_POSTS[rel];
      return `<li><a href="/blog/${escapeHtml(rel)}">${escapeHtml(target.title)}</a></li>`;
    })
    .join('\n            ');

  return `<!doctype html>
<html lang="en">
  <head>
    ${gtmBlock}
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(fullTitle)}</title>
    <meta name="description" content="${escapeHtml(post.metaDesc)}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/png" href="/images/logo/logo.png" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Dreamy Vacations" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:title" content="${escapeHtml(fullTitle)}" />
    <meta property="og:description" content="${escapeHtml(post.metaDesc)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(post.metaDesc)}" />
    <meta name="twitter:image" content="${ogImage}" />
    <script type="application/ld+json">${safeJsonLd(articleSchema)}</script>
    <script type="application/ld+json">${safeJsonLd(breadcrumbSchema)}</script>
    ${faqSchema ? `<script type="application/ld+json">${safeJsonLd(faqSchema)}</script>` : ''}
    ${assetTags}
  </head>
  <body class="bg-[#0d0d0d] text-white">
    <div id="root">
      ${renderSiteHeader()}
      <main class="max-w-4xl mx-auto px-6 py-14 space-y-8">
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
            <img src="${escapeHtml(post.heroImg)}" alt="${escapeHtml(post.heroAlt)}" width="960" height="460" />
            ${post.heroCaption ? `<figcaption>${escapeHtml(post.heroCaption)}</figcaption>` : ''}
          </figure>
          ${post.intro.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n          ')}
          <nav aria-label="Article table of contents">
            <h2>In This Guide</h2>
            <ol>
              ${tocHtml}
            </ol>
          </nav>
          ${sectionsHtml}
          ${highlightsHtml}
          ${stayHtml}
          <section class="space-y-2">
            <h2>Summary Takeaway</h2>
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
      </main>
      ${renderSiteFooter()}
    </div>
  </body>
</html>`;
}

export function prerenderBlogPlugin(): Plugin {
  return {
    name: 'dreamy-vacations-prerender-blog',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const distIndexPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(distIndexPath)) {
        return;
      }

      const distHtml = fs.readFileSync(distIndexPath, 'utf-8');
      const { gtmBlock, assetTags } = extractHeadParts(distHtml);

      // Generate /blog/index.html
      const blogDir = path.join(distDir, 'blog');
      fs.mkdirSync(blogDir, { recursive: true });
      fs.writeFileSync(path.join(blogDir, 'index.html'), buildBlogIndexHtml(gtmBlock, assetTags), 'utf-8');

      // Generate /blog/<slug>/index.html for every article and alias
      for (const [slug, post] of Object.entries(BLOG_POSTS)) {
        const postDir = path.join(blogDir, slug);
        fs.mkdirSync(postDir, { recursive: true });
        fs.writeFileSync(path.join(postDir, 'index.html'), buildBlogPostHtml(slug, post, gtmBlock, assetTags), 'utf-8');
      }
    }
  };
}
