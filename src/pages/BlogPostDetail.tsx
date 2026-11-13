import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Calendar,
  User,
  Clock,
  ArrowRight,
  Share2,
  Printer,
  MapPin,
  CheckCircle,
  BookOpen,
  Check,
  ListTree
} from 'lucide-react';
import { BLOG_POSTS, CANONICAL_BLOG_POSTS, resolveCanonicalBlogSlug } from '../blogData';
import { getProductionOrigin } from '../components/SEOManager';

const WHATSAPP_ENQUIRY_URL =
  'https://wa.me/919902960484?text=Hello%20Dreamy%20Vacations%2C%20I%20would%20like%20to%20enquire%20about%20room%20availability.';

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);

  const resolvedCanonicalSlug = resolveCanonicalBlogSlug(slug);
  const post =
    (slug && BLOG_POSTS[slug]) ||
    CANONICAL_BLOG_POSTS[resolvedCanonicalSlug] ||
    CANONICAL_BLOG_POSTS['complete-coorg-travel-guide'];

  const canonicalSlug = post.canonicalSlug || resolvedCanonicalSlug;
  const origin = getProductionOrigin();
  const canonicalUrl = `${origin}/blog/${canonicalSlug}`;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  const relatedArticles = (post.relatedSlugs || [])
    .map((relSlug) => ({ slug: relSlug, data: CANONICAL_BLOG_POSTS[relSlug] }))
    .filter((item) => Boolean(item.data));

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${origin}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Travel Guides',
        item: `${origin}/blog`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: canonicalUrl
      }
    ]
  };

  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.a
            }
          }))
        }
      : null;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDesc,
    image: [`${origin}${post.heroImg}`],
    datePublished: `${post.publishedDate}T08:00:00+05:30`,
    dateModified: `${post.updatedDate}T09:00:00+05:30`,
    articleSection: post.category,
    keywords: [post.primaryKeyword, ...post.secondaryKeywords].join(', '),
    author: {
      '@type': 'Organization',
      name: 'Dreamy Vacations Editorial Team',
      url: origin
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dreamy Vacations',
      logo: {
        '@type': 'ImageObject',
        url: `${origin}/images/logo/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl
    }
  };

  const handleShare = async () => {
    const shareUrl = canonicalUrl;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.metaDesc,
          url: shareUrl
        });
        return;
      } catch {
        // Fallback to clipboard below if share sheet dismissed or unsupported
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
    <div className="min-h-screen bg-[#0d0d0d] font-sans text-white/90 pb-24 pt-28" id="blog-detail-root">
      {/* Structured Data */}
      <script type="application/ld+json" id="ld-breadcrumb">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      {faqSchema && (
        <script type="application/ld+json" id="ld-faq">
          {JSON.stringify(faqSchema)}
        </script>
      )}
      <script type="application/ld+json" id="ld-article">
        {JSON.stringify(articleSchema)}
      </script>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-white/50 font-mono">
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
            <li className="text-[#e2d7c5] truncate max-w-[260px] sm:max-w-md" aria-current="page">
              {post.category}
            </li>
          </ol>

          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-[#e2d7c5] transition-colors"
            id="btn-back-to-blog"
          >
            <ChevronLeft className="w-4 h-4" /> All Guides
          </Link>
        </div>
      </nav>

      {/* Main Article Container */}
      <article className="max-w-5xl mx-auto px-6 space-y-10">
        {/* Article Header */}
        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 font-mono">
            <span className="bg-white/5 text-[#e2d7c5] border border-white/10 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold">
              {post.category}
            </span>
            <span aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#e2d7c5]/70" /> Updated {post.updatedDate}
            </span>
            <span aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#e2d7c5]/70" /> {post.readTime}
            </span>
            <span aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#e2d7c5]/70" /> Kushalnagar Editorial Desk
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-white leading-[1.12] tracking-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed max-w-3xl">
            {post.metaDesc}
          </p>
        </header>

        {/* Hero Photo + Caption */}
        <figure className="space-y-3">
          <div className="h-[260px] sm:h-[400px] md:h-[460px] rounded-[28px] overflow-hidden shadow-2xl relative border border-white/10">
            <img
              src={post.heroImg}
              alt={post.heroAlt}
              width={960}
              height={460}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          </div>
          {post.heroCaption && (
            <figcaption className="text-xs text-white/50 font-light italic px-1">
              {post.heroCaption}
            </figcaption>
          )}
        </figure>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-4">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs text-white/65 hover:text-[#e2d7c5] transition-colors cursor-pointer"
              id="btn-blog-share"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#e2d7c5]" /> Link Copied
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" /> Share Guide
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs text-white/65 hover:text-white transition-colors cursor-pointer"
              id="btn-blog-print"
            >
              <Printer className="w-4 h-4" /> Print Guide
            </button>
          </div>
          <span className="text-xs text-white/45 font-mono">
            Kodagu &amp; Eastern Coorg Destination Research
          </span>
        </div>

        {/* Content + Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-10 text-sm sm:text-base text-white/75 font-light leading-relaxed">
            {/* Introduction */}
            <div className="space-y-5">
              {post.intro.map((para, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? 'first-letter:text-4xl first-letter:font-display first-letter:float-left first-letter:mr-2.5 first-letter:text-[#e2d7c5] first-letter:font-light leading-relaxed'
                      : 'leading-relaxed'
                  }
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Table of Contents */}
            {post.sections.length > 1 && (
              <nav
                aria-label="Article table of contents"
                className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-3"
              >
                <div className="flex items-center gap-2 text-xs font-sub font-semibold tracking-[0.18em] uppercase text-[#e2d7c5]">
                  <ListTree className="w-4 h-4" /> In This Guide
                </div>
                <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  {post.sections.map((sec, idx) => (
                    <li key={sec.id}>
                      <a
                        href={`#${sec.id}`}
                        className="text-white/70 hover:text-[#e2d7c5] transition-colors inline-flex items-start gap-2"
                      >
                        <span className="text-[#e2d7c5]/60 font-mono shrink-0">
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
                        className="text-white/70 hover:text-[#e2d7c5] transition-colors inline-flex items-start gap-2"
                      >
                        <span className="text-[#e2d7c5]/60 font-mono shrink-0">
                          {String(post.sections.length + 1).padStart(2, '0')}.
                        </span>
                        <span>Frequently Asked Questions</span>
                      </a>
                    </li>
                  )}
                </ol>
              </nav>
            )}

            {/* Structured Sections */}
            {post.sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-28 space-y-5 pt-2">
                <h2 className="text-2xl sm:text-[26px] font-display font-light text-white tracking-tight leading-snug border-b border-white/5 pb-3">
                  {sec.heading}
                </h2>

                {sec.paragraphs &&
                  sec.paragraphs.map((p, idx) => (
                    <p key={idx} className="text-white/75 leading-relaxed">
                      {p}
                    </p>
                  ))}

                {sec.subsections &&
                  sec.subsections.map((sub, subIdx) => (
                    <div key={subIdx} id={sub.id} className="space-y-3 pl-4 border-l border-[#6b5b4b]/50 my-4">
                      <h3 className="text-lg font-display font-normal text-[#e2d7c5] leading-snug">
                        {sub.heading}
                      </h3>
                      {sub.paragraphs &&
                        sub.paragraphs.map((sp, spIdx) => (
                          <p key={spIdx} className="text-white/70 text-sm sm:text-[15px] leading-relaxed">
                            {sp}
                          </p>
                        ))}
                      {sub.bullets && sub.bullets.length > 0 && (
                        <ul className="space-y-2 text-sm text-white/70 pt-1">
                          {sub.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#e2d7c5]/70 mt-2 shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                {sec.bullets && sec.bullets.length > 0 && (
                  <ul className="space-y-2.5 bg-[#121212]/70 border border-white/5 rounded-2xl p-5 text-sm text-white/75">
                    {sec.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-[#e2d7c5] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {sec.callout && (
                  <aside className="bg-[#6b5b4b]/15 border border-[#6b5b4b]/40 rounded-2xl p-5 space-y-1.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#e2d7c5] font-semibold block">
                      {sec.callout.title}
                    </span>
                    <p className="text-sm text-white/80 leading-relaxed">{sec.callout.text}</p>
                  </aside>
                )}

                {sec.image && (
                  <figure className="space-y-2.5 pt-2">
                    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                      <img
                        src={sec.image.src}
                        alt={sec.image.alt}
                        width={800}
                        height={450}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-[240px] sm:h-[340px] object-cover"
                      />
                    </div>
                    {sec.image.caption && (
                      <figcaption className="text-xs text-white/50 font-light italic px-1">
                        {sec.image.caption}
                      </figcaption>
                    )}
                  </figure>
                )}
              </section>
            ))}

            {/* Practical Facts Box */}
            {post.highlights && post.highlights.length > 0 && (
              <section className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-sub font-semibold tracking-[0.16em] text-[#e2d7c5] uppercase flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Quick Reference &amp; Travel Facts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post.highlights.map((h, i) => (
                    <div key={i} className="space-y-1 border-l-2 border-[#6b5b4b] pl-3">
                      <span className="text-[10px] font-mono text-white/45 uppercase tracking-wider block">
                        {h.label}
                      </span>
                      <p className="text-xs sm:text-sm text-white font-medium">{h.value}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Stay Recommendation Card */}
            {post.stayRecommendation && (
              <section className="bg-gradient-to-br from-[#161412] to-[#111111] border border-[#6b5b4b]/40 rounded-2xl p-6 space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#e2d7c5] block">
                  Where to Base Yourself
                </span>
                <h2 className="text-xl font-display font-light text-white">
                  {post.stayRecommendation.heading}
                </h2>
                <p className="text-sm text-white/70 leading-relaxed">
                  {post.stayRecommendation.text}
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  {post.stayRecommendation.links.map((lnk) => (
                    <Link
                      key={lnk.to}
                      to={lnk.to}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#6b5b4b] hover:bg-[#85725f] text-white text-xs font-sub tracking-wider uppercase transition-colors"
                    >
                      {lnk.label} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Conclusion */}
            <section className="border-t border-white/10 pt-7 space-y-3">
              <h2 className="text-xl font-display font-light text-white">Summary Takeaway</h2>
              <p className="text-white/75 leading-relaxed">{post.conclusion}</p>
            </section>

            {/* FAQs */}
            {post.faqs && post.faqs.length > 0 && (
              <section id="article-faqs" className="scroll-mt-28 border-t border-white/10 pt-8 space-y-6">
                <h2 className="text-2xl font-display font-light text-white tracking-tight">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {post.faqs.map((f, i) => (
                    <div
                      key={i}
                      className="bg-[#121212] border border-white/5 rounded-2xl p-5 space-y-2"
                    >
                      <h3 className="text-sm font-medium text-[#e2d7c5] flex items-start gap-2 leading-snug">
                        <CheckCircle className="w-4 h-4 text-[#e2d7c5] shrink-0 mt-0.5" />
                        <span>{f.q}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-white/65 leading-relaxed pl-6">
                        {f.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Guides */}
            {relatedArticles.length > 0 && (
              <section className="border-t border-white/10 pt-8 space-y-5">
                <h2 className="text-xl font-display font-light text-white">
                  Continue Exploring Coorg
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.slug}
                      to={`/blog/${rel.slug}`}
                      className="group bg-[#121212] border border-white/5 hover:border-[#6b5b4b]/50 rounded-2xl p-4 space-y-2 transition-colors"
                    >
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#e2d7c5]/80 block">
                        {rel.data.category} • {rel.data.readTime}
                      </span>
                      <h3 className="text-sm font-display font-light text-white group-hover:text-[#e2d7c5] transition-colors leading-snug">
                        {rel.data.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#e2d7c5] pt-1">
                        Read Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-[#121212] border border-[#6b5b4b]/35 rounded-3xl p-6 text-center space-y-5 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-[4px] bg-[#6b5b4b]" />

                <span className="text-[10px] uppercase font-mono tracking-[0.22em] text-[#e2d7c5] font-semibold block">
                  Stay at Eastern Gateway
                </span>

                <h2 className="text-xl font-display font-light text-white leading-tight">
                  Dreamy Vacations, Kushalnagar
                </h2>

                <p className="text-xs text-white/60 leading-relaxed font-light">
                  Discover the other side of Coorg from Chikkathur Village—12 minutes from Namdroling Golden Temple, with spacious family suites, pool, rain dance, and evening campfires.
                </p>

                <div className="space-y-2.5 pt-1">
                  <a
                    href={WHATSAPP_ENQUIRY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-[11px] font-sub tracking-[0.16em] uppercase rounded-xl transition-colors cursor-pointer font-medium text-center"
                    id="btn-sidebar-book"
                  >
                    ENQUIRE NOW
                  </a>
                  <Link
                    to="/rooms"
                    className="block w-full py-2.5 border border-white/10 hover:border-[#e2d7c5]/40 text-xs font-medium text-white/75 hover:text-white rounded-xl transition-colors"
                  >
                    Explore Rooms
                  </Link>
                </div>

                <div className="border-t border-white/5 pt-4 text-[11px] text-white/45 font-mono space-y-1">
                  <p>Direct Enquiry: +91 99029 60484</p>
                  <p>Check-in: 12 PM • Check-out: 11 AM</p>
                </div>
              </div>

              {/* Distance Snapshot Card */}
              <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-sub uppercase tracking-[0.16em] text-[#e2d7c5] font-semibold">
                  Drives From Kushalnagar
                </h3>
                <ul className="space-y-2 text-xs text-white/65 font-mono">
                  <li className="flex justify-between gap-2">
                    <span>Kaveri Nisargadhama</span>
                    <span className="text-[#e2d7c5]">4 km • 8 min</span>
                  </li>
                  <li className="flex justify-between gap-2">
                    <span>Golden Temple (Bylakuppe)</span>
                    <span className="text-[#e2d7c5]">6 km • 12 min</span>
                  </li>
                  <li className="flex justify-between gap-2">
                    <span>Harangi Dam</span>
                    <span className="text-[#e2d7c5]">9 km • 15 min</span>
                  </li>
                  <li className="flex justify-between gap-2">
                    <span>Dubare Elephant Camp</span>
                    <span className="text-[#e2d7c5]">14 km • 20 min</span>
                  </li>
                  <li className="flex justify-between gap-2">
                    <span>Madikeri Town</span>
                    <span className="text-[#e2d7c5]">30 km • 45 min</span>
                  </li>
                </ul>
                <div className="pt-2 border-t border-white/5 flex flex-col gap-1.5 text-xs">
                  <Link
                    to="/trip-planner"
                    className="inline-flex items-center gap-1.5 text-[#e2d7c5] hover:underline"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Interactive Trip Planner
                  </Link>
                  <Link
                    to="/travel-guide"
                    className="inline-flex items-center gap-1.5 text-white/60 hover:text-white"
                  >
                    <MapPin className="w-3.5 h-3.5" /> All Coorg Attractions
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
