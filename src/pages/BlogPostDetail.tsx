import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronDown,
  ArrowRight,
  Share2,
  Printer,
  MapPin,
  Clock,
  Calendar,
  Compass,
  Check,
  Navigation,
  BookOpen,
} from 'lucide-react';
import { BLOG_POSTS, CANONICAL_BLOG_POSTS, resolveCanonicalBlogSlug } from '../blogData';
import type { BlogAttraction, BlogPost } from '../blog/types';
import { getProductionOrigin } from '../components/SEOManager';

const WHATSAPP_ENQUIRY_URL =
  'https://wa.me/919902960484?text=Hello%20Dreamy%20Vacations%2C%20I%20would%20like%20to%20enquire%20about%20room%20availability.';

function formatEditorialDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getDerivedDiscoverPoints(post: BlogPost): string[] {
  if (post.discoverPoints && post.discoverPoints.length > 0) {
    return post.discoverPoints;
  }
  return post.sections.slice(0, 4).map((sec) => sec.heading);
}

function getDerivedQuickSummary(post: BlogPost) {
  if (post.quickSummary && post.quickSummary.items.length > 0) {
    return post.quickSummary;
  }
  if (post.highlights && post.highlights.length > 0) {
    return {
      heading: 'Planning Your Coorg Trip?',
      subtitle: 'Key practical details from this guide at a glance.',
      items: [
        ...post.highlights.slice(0, 4),
        {
          label: 'Important note',
          value: 'Distances and driving times vary with traffic, weather, and road conditions.',
        },
      ],
    };
  }
  return null;
}

function AttractionCard({ attraction, index }: { attraction: BlogAttraction; index: number }) {
  const numLabel = attraction.number
    ? String(attraction.number).padStart(2, '0')
    : String(index + 1).padStart(2, '0');
  const hasPhoto = Boolean(attraction.image?.src);
  const layout = hasPhoto ? attraction.layout || (index % 2 === 0 ? 'split-left' : 'split-right') : 'editorial';

  const detailsBlock = (
    <div className="pt-5 border-t border-white/10 space-y-4">
      <div className="text-[11px] font-sub font-semibold tracking-[0.18em] uppercase text-[#e2d7c5]/85">
        Quick Details
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-sm">
        <div className="space-y-0.5">
          <dt className="text-xs text-white/45 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#e2d7c5]/75 shrink-0" aria-hidden="true" />
            <span>Location</span>
          </dt>
          <dd className="text-white/90 font-normal leading-snug">{attraction.details.location}</dd>
        </div>
        <div className="space-y-0.5">
          <dt className="text-xs text-white/45 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#e2d7c5]/75 shrink-0" aria-hidden="true" />
            <span>Distance</span>
          </dt>
          <dd className="text-white/90 font-normal leading-snug tabular-nums">{attraction.details.distance}</dd>
        </div>
        <div className="space-y-0.5">
          <dt className="text-xs text-white/45 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#e2d7c5]/75 shrink-0" aria-hidden="true" />
            <span>Suggested visit</span>
          </dt>
          <dd className="text-white/90 font-normal leading-snug tabular-nums">{attraction.details.duration}</dd>
        </div>
        <div className="space-y-0.5">
          <dt className="text-xs text-white/45 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#e2d7c5]/75 shrink-0" aria-hidden="true" />
            <span>Best time</span>
          </dt>
          <dd className="text-white/90 font-normal leading-snug">{attraction.details.bestTime}</dd>
        </div>
      </dl>

      <div className="bg-[#191714] border border-[#6b5b4b]/35 rounded-xl px-4 py-3.5 space-y-1">
        <span className="text-[11px] font-sub font-semibold tracking-[0.16em] uppercase text-[#e2d7c5] block">
          Travel Tip
        </span>
        <p className="text-sm sm:text-[15px] text-white/80 leading-[1.65] font-light">{attraction.tip}</p>
      </div>
    </div>
  );

  // Wide photo magazine spread
  if (hasPhoto && layout === 'wide' && attraction.image) {
    return (
      <article
        id={attraction.id}
        className="scroll-mt-28 bg-[#121110] border border-white/10 rounded-2xl overflow-hidden"
      >
        <figure>
          <div className="aspect-[16/9] w-full overflow-hidden bg-[#181614] relative">
            <img
              src={attraction.image.src}
              alt={attraction.image.alt}
              width={1200}
              height={675}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
          {attraction.image.caption && (
            <figcaption className="px-6 sm:px-8 pt-3 text-xs text-white/50 italic font-light">
              {attraction.image.caption}
            </figcaption>
          )}
        </figure>

        <div className="p-6 sm:p-8 space-y-5">
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl sm:text-3xl text-[#e2d7c5]/70 font-light tabular-nums">
                {numLabel}
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-normal text-white leading-tight">
                {attraction.name}
              </h3>
            </div>
            <p className="font-display italic text-lg sm:text-xl text-[#e2d7c5] font-light leading-snug">
              {attraction.tagline}
            </p>
          </div>

          <div className="space-y-3.5 text-base sm:text-[17px] text-white/80 font-light leading-[1.75] max-w-[68ch]">
            <p>{attraction.summary}</p>
            {attraction.whyVisit && <p>{attraction.whyVisit}</p>}
          </div>

          {detailsBlock}
        </div>
      </article>
    );
  }

  // Alternating split image + text magazine layout
  if (hasPhoto && (layout === 'split-left' || layout === 'split-right') && attraction.image) {
    const isImageRight = layout === 'split-right';
    return (
      <article
        id={attraction.id}
        className="scroll-mt-28 bg-[#121110] border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
          <figure
            className={`md:col-span-5 flex flex-col bg-[#161412] ${
              isImageRight ? 'md:order-2' : 'md:order-1'
            }`}
          >
            <div className="aspect-[4/3] md:aspect-auto md:flex-1 w-full overflow-hidden relative">
              <img
                src={attraction.image.src}
                alt={attraction.image.alt}
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            {attraction.image.caption && (
              <figcaption className="px-5 py-3 text-xs text-white/50 italic font-light border-t border-white/5">
                {attraction.image.caption}
              </figcaption>
            )}
          </figure>

          <div
            className={`md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5 ${
              isImageRight ? 'md:order-1' : 'md:order-2'
            }`}
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="font-mono text-xs text-[#e2d7c5]/75 tabular-nums block">
                  {numLabel} · {attraction.details.location}
                </span>
                <h3 className="text-2xl sm:text-[28px] font-display font-normal text-white leading-tight">
                  {attraction.name}
                </h3>
                <p className="font-display italic text-lg text-[#e2d7c5] font-light leading-snug">
                  {attraction.tagline}
                </p>
              </div>

              <div className="space-y-3 text-base sm:text-[17px] text-white/80 font-light leading-[1.75]">
                <p>{attraction.summary}</p>
                {attraction.whyVisit && <p>{attraction.whyVisit}</p>}
              </div>
            </div>

            {detailsBlock}
          </div>
        </div>
      </article>
    );
  }

  // Clean text-based editorial card (used when no dedicated verified photo exists)
  return (
    <article
      id={attraction.id}
      className="scroll-mt-28 bg-[#121110] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5"
    >
      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-2xl sm:text-3xl text-[#e2d7c5]/70 font-light tabular-nums">
              {numLabel}
            </span>
            <h3 className="text-2xl sm:text-[26px] font-display font-normal text-white leading-tight">
              {attraction.name}
            </h3>
          </div>
          <span className="text-xs text-white/50 font-sans">{attraction.details.location}</span>
        </div>
        <p className="font-display italic text-lg text-[#e2d7c5] font-light leading-snug">
          {attraction.tagline}
        </p>
      </div>

      <div className="space-y-3.5 text-base sm:text-[17px] text-white/80 font-light leading-[1.75] max-w-[68ch]">
        <p>{attraction.summary}</p>
        {attraction.whyVisit && <p>{attraction.whyVisit}</p>}
      </div>

      {detailsBlock}
    </article>
  );
}

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);
  const [tocOpenMobile, setTocOpenMobile] = useState(false);

  const resolvedCanonicalSlug = resolveCanonicalBlogSlug(slug);
  const post =
    (slug && BLOG_POSTS[slug]) ||
    CANONICAL_BLOG_POSTS[resolvedCanonicalSlug] ||
    CANONICAL_BLOG_POSTS['complete-coorg-travel-guide'];

  const canonicalSlug = post.canonicalSlug || resolvedCanonicalSlug;
  const origin = getProductionOrigin();
  const canonicalUrl = `${origin}/blog/${canonicalSlug}`;

  const discoverPoints = getDerivedDiscoverPoints(post);
  const quickSummary = getDerivedQuickSummary(post);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setTocOpenMobile(false);
  }, [slug]);

  const relatedArticles = (post.relatedSlugs || [])
    .map((relSlug) => ({ slug: relSlug, data: CANONICAL_BLOG_POSTS[relSlug] }))
    .filter((item) => Boolean(item.data));

  const handleShare = async () => {
    const shareUrl = canonicalUrl;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.metaDesc,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard below
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0d0d0d] font-sans text-white/90 pt-24 sm:pt-28 pb-36 sm:pb-28 overflow-x-clip"
      id="blog-detail-root"
    >
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-5 sm:px-8 mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ol className="flex flex-wrap items-center gap-2 text-xs sm:text-[13px] text-white/55">
            <li>
              <Link to="/" className="hover:text-[#e2d7c5] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/blog" className="hover:text-[#e2d7c5] transition-colors">
                Travel Guides
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[#e2d7c5] truncate max-w-[240px] sm:max-w-md" aria-current="page">
              {post.category}
            </li>
          </ol>

          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] text-white/65 hover:text-[#e2d7c5] transition-colors py-1"
            id="btn-back-to-blog"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span>All Travel Guides</span>
          </Link>
        </div>
      </nav>

      {/* Main Article Container */}
      <article className="max-w-6xl mx-auto px-5 sm:px-8 space-y-10 sm:space-y-12">
        {/* 1. Editorial Article Header */}
        <header className="max-w-4xl space-y-4 sm:space-y-5">
          <p className="text-xs font-sub font-medium tracking-[0.2em] uppercase text-[#e2d7c5]">
            {post.category}
          </p>

          <h1
            className="text-3xl sm:text-5xl lg:text-[54px] font-display font-light text-white leading-[1.1] tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            {post.title}
          </h1>

          <p className="text-base sm:text-xl text-white/75 font-light leading-[1.65] max-w-3xl">
            {post.metaDesc}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-[13px] text-white/60">
              <span>Updated {formatEditorialDate(post.updatedDate)}</span>
              <span aria-hidden="true">·</span>
              <span>{post.readTime}</span>
            </div>

            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] text-white/65 hover:text-[#e2d7c5] transition-colors cursor-pointer py-1"
                id="btn-blog-share"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#e2d7c5]" aria-hidden="true" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" aria-hidden="true" />
                    <span>Share</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] text-white/65 hover:text-white transition-colors cursor-pointer py-1"
                id="btn-blog-print"
              >
                <Printer className="w-4 h-4" aria-hidden="true" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </header>

        {/* 2. Large Hero Destination Photograph + Caption */}
        <figure className="space-y-3">
          <div className="aspect-[16/10] sm:aspect-[16/8.5] w-full rounded-2xl sm:rounded-[26px] overflow-hidden border border-white/10 bg-[#141311] relative">
            <img
              src={post.heroImg}
              alt={post.heroAlt}
              width={1200}
              height={638}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          </div>
          {post.heroCaption && (
            <figcaption className="text-xs sm:text-sm text-white/55 font-light italic px-1 max-w-3xl leading-relaxed">
              {post.heroCaption}
            </figcaption>
          )}
        </figure>

        {/* 3. Compact "What you'll discover" Strip */}
        {discoverPoints.length > 0 && (
          <section
            aria-label="What you will discover in this guide"
            className="bg-[#121110] border border-white/10 rounded-2xl p-6 sm:p-7 space-y-4"
          >
            <div className="flex items-center gap-2 text-xs font-sub font-semibold tracking-[0.18em] uppercase text-[#e2d7c5]">
              <Compass className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>What You&apos;ll Discover</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-[15px] sm:text-base text-white/80 font-light leading-relaxed">
              {discoverPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#e2d7c5] font-mono text-xs mt-1.5 shrink-0 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 4. Quick Travel Summary ("Planning Your Coorg Trip?") */}
        {quickSummary && (
          <section
            aria-labelledby="quick-travel-summary-heading"
            className="space-y-5 pt-1"
          >
            <div className="space-y-1">
              <h2
                id="quick-travel-summary-heading"
                className="text-2xl sm:text-3xl font-display font-light text-white tracking-tight"
              >
                {quickSummary.heading || 'Planning Your Coorg Trip?'}
              </h2>
              {quickSummary.subtitle && (
                <p className="text-sm sm:text-base text-white/60 font-light">{quickSummary.subtitle}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickSummary.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#121110] border border-white/10 rounded-xl p-5 space-y-1.5"
                >
                  <span className="text-[11px] font-sub font-semibold uppercase tracking-[0.16em] text-[#e2d7c5] block">
                    {item.label}
                  </span>
                  <p className="text-sm sm:text-[15px] text-white/85 font-light leading-relaxed">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Main Reading Canvas + Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pt-2">
          {/* Primary Editorial Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Conversational Intro */}
            <div className="space-y-5 text-base sm:text-[18px] text-white/85 font-light leading-[1.8] max-w-[68ch]">
              {post.intro.map((para, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? 'first-letter:text-5xl first-letter:font-display first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.85] first-letter:text-[#e2d7c5] first-letter:font-normal'
                      : undefined
                  }
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Interactive Regional or Chapter Table of Contents */}
            {(post.tocGroups && post.tocGroups.length > 0) || post.sections.length > 1 ? (
              <nav
                aria-label="Guide navigation"
                className="bg-[#121110] border border-white/10 rounded-2xl overflow-hidden"
              >
                {/* Header / Mobile Toggle */}
                <button
                  type="button"
                  onClick={() => setTocOpenMobile((prev) => !prev)}
                  aria-expanded={tocOpenMobile}
                  className="w-full flex items-center justify-between gap-3 px-6 py-4 text-left md:cursor-default"
                >
                  <div>
                    <span className="text-xs font-sub font-semibold tracking-[0.18em] uppercase text-[#e2d7c5] block">
                      {post.tocGroups ? 'Jump by Region & Attraction' : 'In This Guide'}
                    </span>
                    <span className="text-xs text-white/50 font-light block mt-0.5 md:hidden">
                      {tocOpenMobile ? 'Tap to hide sections' : 'Tap to jump directly to a section'}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#e2d7c5] transition-transform duration-200 md:hidden ${
                      tocOpenMobile ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <div
                  className={`${
                    tocOpenMobile ? 'block' : 'hidden'
                  } md:block px-6 pb-6 pt-2 border-t border-white/10`}
                >
                  {post.tocGroups && post.tocGroups.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      {post.tocGroups.map((group) => (
                        <div key={group.sectionId} className="space-y-2.5">
                          <a
                            href={`#${group.sectionId}`}
                            onClick={() => setTocOpenMobile(false)}
                            className="block group"
                          >
                            <span className="text-sm font-display font-medium text-[#e2d7c5] group-hover:text-white transition-colors block">
                              {group.region}
                            </span>
                            {group.subtitle && (
                              <span className="text-xs text-white/50 font-light block">
                                {group.subtitle}
                              </span>
                            )}
                          </a>
                          <ul className="space-y-1.5 border-t border-white/10 pt-2.5">
                            {group.items.map((item) => (
                              <li key={item.id}>
                                <a
                                  href={`#${item.id}`}
                                  onClick={() => setTocOpenMobile(false)}
                                  className="text-sm text-white/75 hover:text-[#e2d7c5] transition-colors inline-flex items-baseline gap-2 py-0.5"
                                >
                                  <span className="text-[#e2d7c5]/50 text-xs" aria-hidden="true">
                                    &rarr;
                                  </span>
                                  <span>{item.label}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 pt-2 text-sm">
                      {post.sections.map((sec, idx) => (
                        <li key={sec.id}>
                          <a
                            href={`#${sec.id}`}
                            onClick={() => setTocOpenMobile(false)}
                            className="text-white/75 hover:text-[#e2d7c5] transition-colors inline-flex items-start gap-2.5 py-0.5"
                          >
                            <span className="text-[#e2d7c5]/65 font-mono text-xs mt-0.5 shrink-0 tabular-nums">
                              {String(idx + 1).padStart(2, '0')}.
                            </span>
                            <span>{sec.heading}</span>
                          </a>
                        </li>
                      ))}
                      {post.faqs.length > 0 && (
                        <li>
                          <a
                            href="#article-faqs"
                            onClick={() => setTocOpenMobile(false)}
                            className="text-white/75 hover:text-[#e2d7c5] transition-colors inline-flex items-start gap-2.5 py-0.5"
                          >
                            <span className="text-[#e2d7c5]/65 font-mono text-xs mt-0.5 shrink-0 tabular-nums">
                              {String(post.sections.length + 1).padStart(2, '0')}.
                            </span>
                            <span>Frequently Asked Questions</span>
                          </a>
                        </li>
                      )}
                    </ol>
                  )}
                </div>
              </nav>
            ) : null}

            {/* Structured Magazine Sections */}
            {post.sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-28 space-y-6 pt-4">
                {/* Optional Full-Width Scenic Divider Before Region */}
                {sec.sectionBanner && (
                  <figure className="space-y-2.5 pb-2">
                    <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#141311] relative">
                      <img
                        src={sec.sectionBanner.src}
                        alt={sec.sectionBanner.alt}
                        width={1200}
                        height={514}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    </div>
                    {sec.sectionBanner.caption && (
                      <figcaption className="text-xs text-white/50 italic font-light px-1">
                        {sec.sectionBanner.caption}
                      </figcaption>
                    )}
                  </figure>
                )}

                {/* Region Kicker + Section H2 */}
                <div className="space-y-2 border-b border-white/10 pb-4">
                  {sec.regionLabel && (
                    <span className="text-xs font-sub font-semibold tracking-[0.2em] uppercase text-[#e2d7c5] block">
                      {sec.regionLabel}
                    </span>
                  )}
                  <h2
                    className="text-2xl sm:text-3xl lg:text-[34px] font-display font-light text-white tracking-tight leading-[1.18]"
                    style={{ textWrap: 'balance' }}
                  >
                    {sec.heading}
                  </h2>
                </div>

                {/* Narrative Paragraphs */}
                {sec.paragraphs && sec.paragraphs.length > 0 && (
                  <div className="space-y-4 text-base sm:text-[17px] text-white/80 font-light leading-[1.78] max-w-[68ch]">
                    {sec.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                )}

                {/* Editorial Pull Quote */}
                {sec.pullQuote && (
                  <blockquote className="my-8 py-7 border-y border-[#e2d7c5]/20 text-center sm:text-left space-y-2">
                    <p className="font-display italic text-2xl sm:text-[28px] text-[#e2d7c5] font-light leading-[1.4]">
                      &ldquo;{sec.pullQuote.text}&rdquo;
                    </p>
                    {sec.pullQuote.note && (
                      <footer className="text-xs sm:text-sm text-white/55 font-sans">
                        {sec.pullQuote.note}
                      </footer>
                    )}
                  </blockquote>
                )}

                {/* Magazine Attraction Cards */}
                {sec.attractions && sec.attractions.length > 0 && (
                  <div className="space-y-7 pt-2">
                    {sec.attractions.map((attraction, idx) => (
                      <AttractionCard key={attraction.id} attraction={attraction} index={idx} />
                    ))}
                  </div>
                )}

                {/* Geographical Travel Planner */}
                {sec.routePlanner && (
                  <div className="space-y-5 pt-1">
                    {sec.routePlanner.intro && (
                      <p className="text-base sm:text-[17px] text-white/80 font-light leading-[1.75] max-w-[68ch]">
                        {sec.routePlanner.intro}
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {sec.routePlanner.regions.map((group, gIdx) => (
                        <div
                          key={gIdx}
                          className="bg-[#121110] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-3">
                            <span className="text-[11px] font-sub font-semibold tracking-[0.18em] uppercase text-[#e2d7c5] block">
                              {group.region}
                            </span>
                            <h3 className="text-xl font-display font-normal text-white leading-snug">
                              {group.title}
                            </h3>

                            {/* Route Chain */}
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-1 text-sm sm:text-[15px] text-white font-medium leading-relaxed">
                              {group.stops.map((stop, sIdx) => (
                                <span key={sIdx} className="inline-flex items-center gap-2">
                                  <span>{stop}</span>
                                  {sIdx < group.stops.length - 1 && (
                                    <span className="text-[#e2d7c5]/70" aria-hidden="true">
                                      &rarr;
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>

                            <p className="text-sm sm:text-[15px] text-white/75 font-light leading-[1.68]">
                              {group.note}
                            </p>
                          </div>

                          <p className="text-xs text-[#e2d7c5]/80 border-t border-white/10 pt-3 tabular-nums">
                            {group.distanceNote}
                          </p>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-white/55 font-light italic leading-relaxed">
                      {sec.routePlanner.disclaimer}
                    </p>
                  </div>
                )}

                {/* Upgraded Subsections (used across itineraries, weather & stay guides) */}
                {sec.subsections && sec.subsections.length > 0 && (
                  <div className="space-y-5 pt-1">
                    {sec.subsections.map((sub, subIdx) => (
                      <div
                        key={subIdx}
                        id={sub.id}
                        className="scroll-mt-28 bg-[#121110] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-3.5"
                      >
                        <h3 className="text-xl sm:text-[22px] font-display font-normal text-[#e2d7c5] leading-snug">
                          {sub.heading}
                        </h3>
                        {sub.paragraphs &&
                          sub.paragraphs.map((sp, spIdx) => (
                            <p
                              key={spIdx}
                              className="text-base sm:text-[17px] text-white/80 font-light leading-[1.75] max-w-[66ch]"
                            >
                              {sp}
                            </p>
                          ))}
                        {sub.bullets && sub.bullets.length > 0 && (
                          <ul className="space-y-2.5 pt-2 border-t border-white/10 text-[15px] sm:text-base text-white/75 font-light leading-[1.7]">
                            {sub.bullets.map((b, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-3">
                                <span
                                  className="text-[#e2d7c5] mt-1.5 text-xs shrink-0"
                                  aria-hidden="true"
                                >
                                  —
                                </span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Section Bullet List */}
                {sec.bullets && sec.bullets.length > 0 && (
                  <ul className="space-y-3 bg-[#121110] border border-white/10 rounded-2xl p-6 text-[15px] sm:text-base text-white/80 font-light leading-[1.72]">
                    {sec.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3">
                        <span className="text-[#e2d7c5] font-mono text-xs mt-1.5 shrink-0 tabular-nums">
                          {String(bIdx + 1).padStart(2, '0')}
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Responsive Table (Desktop Table + Mobile Stacked Cards — zero horizontal overflow) */}
                {sec.table && sec.table.rows.length > 0 && (
                  <div className="my-5 space-y-3">
                    {sec.table.caption && (
                      <p className="text-xs font-sub font-semibold uppercase tracking-[0.16em] text-[#e2d7c5]">
                        {sec.table.caption}
                      </p>
                    )}

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10 bg-[#121110]">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/[0.03]">
                            {sec.table.headers.map((header, hIdx) => (
                              <th
                                key={hIdx}
                                scope="col"
                                className="px-4 py-3.5 text-xs font-sub uppercase tracking-wider text-[#e2d7c5] font-semibold"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {sec.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`px-4 py-3.5 align-top leading-relaxed tabular-nums ${
                                    cIdx === 0
                                      ? 'font-medium text-white whitespace-nowrap'
                                      : 'text-white/75 font-light'
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Stacked Cards Alternative */}
                    <div className="md:hidden space-y-3">
                      {sec.table.rows.map((row, rIdx) => (
                        <div
                          key={rIdx}
                          className="bg-[#121110] border border-white/10 rounded-xl p-4 space-y-2.5"
                        >
                          <div className="text-base font-display font-medium text-white border-b border-white/10 pb-2">
                            {row[0]}
                          </div>
                          <dl className="space-y-2 text-sm">
                            {row.slice(1).map((cell, cIdx) => (
                              <div key={cIdx} className="space-y-0.5">
                                <dt className="text-[11px] font-sub uppercase tracking-wider text-[#e2d7c5]/80">
                                  {sec.table?.headers[cIdx + 1] || ''}
                                </dt>
                                <dd className="text-white/80 font-light leading-relaxed tabular-nums">
                                  {cell}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Editorial Callout Note */}
                {sec.callout && (
                  <aside className="bg-[#171512] border border-[#6b5b4b]/40 rounded-2xl p-6 space-y-2">
                    <span className="text-xs font-sub font-semibold uppercase tracking-[0.16em] text-[#e2d7c5] block">
                      {sec.callout.title}
                    </span>
                    <p className="text-[15px] sm:text-base text-white/85 font-light leading-[1.72]">
                      {sec.callout.text}
                    </p>
                  </aside>
                )}

                {/* Section Photo (for articles using sec.image) */}
                {sec.image && (
                  <figure className="space-y-2.5 pt-2">
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 bg-[#141311]">
                      <img
                        src={sec.image.src}
                        alt={sec.image.alt}
                        width={960}
                        height={540}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {sec.image.caption && (
                      <figcaption className="text-xs sm:text-sm text-white/55 font-light italic px-1 leading-relaxed">
                        {sec.image.caption}
                      </figcaption>
                    )}
                  </figure>
                )}

                {/* Contextual Internal Links */}
                {sec.links && sec.links.length > 0 && (
                  <div className="pt-2 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-2.5">
                    {sec.links.map((lnk) => (
                      <Link
                        key={lnk.to}
                        to={lnk.to}
                        className="inline-flex items-center gap-1.5 text-sm text-[#e2d7c5] hover:text-white underline underline-offset-4 decoration-[#6b5b4b] hover:decoration-[#e2d7c5] transition-colors py-1"
                      >
                        <span>{lnk.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            ))}

            {/* Practical Facts Snapshot (shown when article has highlights and also custom quickSummary) */}
            {post.highlights && post.highlights.length > 0 && post.quickSummary && (
              <section className="bg-[#121110] border border-white/10 rounded-2xl p-6 sm:p-7 space-y-4">
                <h2 className="text-lg font-display font-normal text-[#e2d7c5]">
                  Quick Distance &amp; Regional Reference
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {post.highlights.map((h, i) => (
                    <div key={i} className="space-y-1 border-t border-white/10 pt-3">
                      <dt className="text-xs font-sub uppercase tracking-wider text-white/50">
                        {h.label}
                      </dt>
                      <dd className="text-sm sm:text-[15px] text-white/90 font-light leading-relaxed">
                        {h.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {/* Stay Recommendation */}
            {post.stayRecommendation && (
              <section className="bg-[#151310] border border-[#6b5b4b]/40 rounded-2xl p-6 sm:p-8 space-y-4">
                <span className="text-xs font-sub font-semibold uppercase tracking-[0.18em] text-[#e2d7c5] block">
                  Where to Stay in Eastern Coorg
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-light text-white leading-snug">
                  {post.stayRecommendation.heading}
                </h2>
                <p className="text-base sm:text-[17px] text-white/80 font-light leading-[1.75] max-w-[65ch]">
                  {post.stayRecommendation.text}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  {post.stayRecommendation.links.map((lnk) => (
                    <Link
                      key={lnk.to}
                      to={lnk.to}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#6b5b4b] hover:bg-[#85725f] text-white text-xs sm:text-sm font-sub tracking-wide transition-colors"
                    >
                      <span>{lnk.label}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Conclusion */}
            <section className="border-t border-white/10 pt-8 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-display font-light text-white">
                Before You Go
              </h2>
              <p className="text-base sm:text-[17px] text-white/80 font-light leading-[1.78] max-w-[68ch]">
                {post.conclusion}
              </p>
            </section>

            {/* FAQs */}
            {post.faqs && post.faqs.length > 0 && (
              <section id="article-faqs" className="scroll-mt-28 border-t border-white/10 pt-10 space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-light text-white tracking-tight">
                  Frequently Asked Questions
                </h2>
                <div className="divide-y divide-white/10 border-y border-white/10">
                  {post.faqs.map((f, i) => (
                    <div key={i} className="py-5 space-y-2">
                      <h3 className="text-lg sm:text-xl font-display font-normal text-[#e2d7c5] leading-snug">
                        {f.q}
                      </h3>
                      <p className="text-base text-white/75 font-light leading-[1.72] max-w-[66ch]">
                        {f.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Guides */}
            {relatedArticles.length > 0 && (
              <section className="border-t border-white/10 pt-10 space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-light text-white">
                  Continue Reading
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.slug}
                      to={`/blog/${rel.slug}`}
                      className="group bg-[#121110] border border-white/10 hover:border-[#e2d7c5]/40 rounded-2xl p-5 flex flex-col justify-between space-y-3 transition-colors"
                    >
                      <div className="space-y-2">
                        <span className="text-xs text-white/50 block">
                          {rel.data.category} · {rel.data.readTime}
                        </span>
                        <h3 className="text-lg sm:text-xl font-display font-normal text-white group-hover:text-[#e2d7c5] transition-colors leading-snug">
                          {rel.data.title}
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#e2d7c5]">
                        <span>Read guide</span>
                        <ArrowRight
                          className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Editorial Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-28 space-y-6">
              {/* Resort Stay Card */}
              <div className="bg-[#121110] border border-[#6b5b4b]/40 rounded-2xl p-6 sm:p-7 space-y-5">
                <div className="space-y-2">
                  <span className="text-[11px] font-sub font-semibold tracking-[0.18em] uppercase text-[#e2d7c5] block">
                    Stay Near Kushalnagar
                  </span>
                  <h2 className="text-2xl font-display font-light text-white leading-tight">
                    Dreamy Vacations, Coorg
                  </h2>
                </div>

                <p className="text-sm sm:text-[15px] text-white/75 leading-[1.7] font-light">
                  Set in quiet Chikkathur Village near Kushalnagar—an easy drive from the Golden
                  Temple, Nisargadhama, and Dubare, with family rooms, pool, rain dance, and indoor
                  games.
                </p>

                <div className="space-y-2.5">
                  <a
                    href={WHATSAPP_ENQUIRY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 px-4 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-xs font-sub font-semibold tracking-[0.16em] uppercase rounded-lg transition-colors text-center"
                    id="btn-sidebar-book"
                  >
                    Enquire Now
                  </a>
                  <Link
                    to="/rooms/families"
                    className="block w-full py-2.5 px-4 border border-white/15 hover:border-[#e2d7c5]/45 text-sm text-white/85 hover:text-white rounded-lg transition-colors text-center"
                  >
                    Explore Family Rooms
                  </Link>
                </div>

                <div className="border-t border-white/10 pt-4 text-xs text-white/55 space-y-1 tabular-nums">
                  <p>
                    Phone / WhatsApp:{' '}
                    <a href="tel:+919902960484" className="text-[#e2d7c5] hover:underline">
                      +91 99029 60484
                    </a>
                  </p>
                  <p>Check-in 12:00 PM · Check-out 11:00 AM</p>
                </div>
              </div>

              {/* Reference Distances Card */}
              <div className="bg-[#121110] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-sub uppercase tracking-[0.18em] text-[#e2d7c5] font-semibold">
                    Approximate Distances From Kushalnagar
                  </h3>
                  <p className="text-xs text-white/50 font-light">
                    Driving times depend on traffic and weather.
                  </p>
                </div>
                <ul className="space-y-2.5 text-sm text-white/75">
                  <li className="flex justify-between gap-3 border-b border-white/5 pb-2">
                    <span>Kaveri Nisargadhama</span>
                    <span className="text-[#e2d7c5] tabular-nums shrink-0">~4 km</span>
                  </li>
                  <li className="flex justify-between gap-3 border-b border-white/5 pb-2">
                    <span>Golden Temple (Bylakuppe)</span>
                    <span className="text-[#e2d7c5] tabular-nums shrink-0">~6 km</span>
                  </li>
                  <li className="flex justify-between gap-3 border-b border-white/5 pb-2">
                    <span>Harangi Dam</span>
                    <span className="text-[#e2d7c5] tabular-nums shrink-0">~9 km</span>
                  </li>
                  <li className="flex justify-between gap-3 border-b border-white/5 pb-2">
                    <span>Dubare Elephant Camp</span>
                    <span className="text-[#e2d7c5] tabular-nums shrink-0">~14 km</span>
                  </li>
                  <li className="flex justify-between gap-3 border-b border-white/5 pb-2">
                    <span>Chiklihole Reservoir</span>
                    <span className="text-[#e2d7c5] tabular-nums shrink-0">~15 km</span>
                  </li>
                  <li className="flex justify-between gap-3">
                    <span>Madikeri Town</span>
                    <span className="text-[#e2d7c5] tabular-nums shrink-0">~30 km</span>
                  </li>
                </ul>

                <div className="pt-3 border-t border-white/10 flex flex-col gap-2 text-sm">
                  <Link
                    to="/trip-planner"
                    className="inline-flex items-center gap-2 text-[#e2d7c5] hover:text-white transition-colors"
                  >
                    <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Open Coorg Trip Planner</span>
                  </Link>
                  <Link
                    to="/rooms"
                    className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>All Accommodation Categories</span>
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
