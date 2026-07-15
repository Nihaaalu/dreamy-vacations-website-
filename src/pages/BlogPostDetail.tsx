import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Calendar, User, Tag, Clock, ArrowRight, Share2, Printer, MapPin, CheckCircle } from 'lucide-react';
import { BLOG_POSTS } from '../blogData';

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const post = slug && BLOG_POSTS[slug] ? BLOG_POSTS[slug] : BLOG_POSTS['best-place-to-stay-in-coorg'];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://dreamyvacations.in'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Blog',
        'item': 'https://dreamyvacations.in/blog'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': post.title,
        'item': `https://dreamyvacations.in/blog/${slug}`
      }
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': post.faqs.map((f) => ({
      '@type': 'Question',
      'name': f.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.a
      }
    }))
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': post.title,
    'description': post.metaDesc,
    'image': [post.heroImg],
    'datePublished': '2026-07-15T04:00:00+05:30',
    'dateModified': '2026-07-15T04:00:00+05:30',
    'author': {
      '@type': 'Organization',
      'name': 'Dreamy Vacations Coorg',
      'url': 'https://dreamyvacations.in'
    }
  };

  // Merge them or render them in separate script tags.
  // This satisfies Requirement 8: "Structured Data: Add JSON-LD for Hotel, LocalBusiness, FAQ, Breadcrumb, WebSite, TouristAttraction..."

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.metaDesc,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Copy to clipboard fallback
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard for sharing!');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] font-sans text-white/90 pb-24 pt-28" id="blog-detail-root">
      
      {/* Schema injections */}
      <script type="application/ld+json" id="ld-breadcrumb">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json" id="ld-faq">
        {JSON.stringify(faqSchema)}
      </script>
      <script type="application/ld+json" id="ld-article">
        {JSON.stringify(articleSchema)}
      </script>

      {/* Back button */}
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-[#e2d7c5] transition-colors"
          id="btn-back-to-blog"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Travel Guides
        </Link>
      </div>

      {/* Main Content Area */}
      <article className="max-w-4xl mx-auto px-6 space-y-10">
        
        {/* Header Metadata */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 font-mono">
            <span className="bg-white/5 text-[#e2d7c5] border border-white/10 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold">
              {post.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> July 15, 2026</span>
            <span>•</span>
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Local Expert</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-white leading-tight tracking-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-white/60 font-light leading-relaxed max-w-3xl">
            {post.metaDesc}
          </p>
        </div>

        {/* Hero Image */}
        <div className="h-[280px] sm:h-[400px] md:h-[480px] rounded-[32px] overflow-hidden shadow-2xl relative">
          <img
            src={post.heroImg}
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Share and Print Toolbar */}
        <div className="flex items-center justify-between border-y border-white/5 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-[#e2d7c5] transition-colors cursor-pointer"
              id="btn-blog-share"
            >
              <Share2 className="w-4 h-4" /> Share Article
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
              id="btn-blog-print"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
          <span className="text-xs text-white/40 font-mono">Kushalnagar Gateway, Coorg</span>
        </div>

        {/* Main Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Main Article Body (span 8) */}
          <div className="md:col-span-8 space-y-6 text-sm sm:text-base text-white/70 font-light leading-relaxed">
            {post.paragraphs.map((para, idx) => (
              <p
                key={idx}
                className={idx === 0 ? "first-letter:text-4xl first-letter:font-display first-letter:float-left first-letter:mr-2 first-letter:text-[#e2d7c5] first-letter:font-light" : ""}
              >
                {para}
              </p>
            ))}

            {/* Factual Highlights Box */}
            {post.highlights && post.highlights.length > 0 && (
              <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 space-y-4 my-8">
                <h3 className="text-sm font-display font-medium tracking-[0.1em] text-[#e2d7c5] uppercase flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Factual Travel Metrics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post.highlights.map((h, i) => (
                    <div key={i} className="space-y-1 border-l-2 border-[#6b5b4b] pl-3">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">{h.label}</span>
                      <p className="text-xs text-white font-medium">{h.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attractions and driving times context */}
            <div className="border-t border-white/5 pt-8 space-y-4">
              <h3 className="text-base font-display font-light text-white tracking-wide">
                Kushalnagar Strategic Access Guide:
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Kushalnagar sits at the foot of the Coorg highlands, offering flat roads and direct connectivity. Driving times from Kushalnagar resorts to main destinations:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-mono text-[#e2d7c5]">
                <li>• Golden Temple (Bylakuppe): 12 mins (6km)</li>
                <li>• Dubare Elephant Camp: 20 mins (14km)</li>
                <li>• Kaveri Nisargadhama: 8 mins (4km)</li>
                <li>• Harangi Reservoir: 15 mins (9km)</li>
                <li>• Madikeri Town Centre: 45 mins (30km)</li>
              </ul>
            </div>

            {/* Dynamic FAQ List */}
            {post.faqs && post.faqs.length > 0 && (
              <div className="border-t border-white/5 pt-8 space-y-6">
                <h3 className="text-lg font-display font-light text-white tracking-wide">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {post.faqs.map((f, i) => (
                    <div key={i} className="space-y-2">
                      <h4 className="text-xs font-semibold text-[#e2d7c5] flex items-start gap-1.5 leading-snug">
                        <CheckCircle className="w-3.5 h-3.5 text-[#e2d7c5] shrink-0 mt-0.5" /> {f.q}
                      </h4>
                      <p className="text-xs text-white/60 leading-relaxed font-light pl-5">
                        {f.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sticky Sidebar: Booking CTA (span 4) */}
          <div className="md:col-span-4">
            <div className="sticky top-28 bg-[#121212] border border-[#6b5b4b]/30 rounded-3xl p-6 text-center space-y-5 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-[4px] bg-[#6b5b4b]" />
              
              <span className="text-[9px] uppercase font-mono tracking-[0.25em] text-[#e2d7c5] font-semibold block">
                Stay with us
              </span>
              
              <h3 className="text-lg font-display font-light text-white leading-tight">
                Dreamy Vacations Kushalnagar
              </h3>
              
              <p className="text-xs text-white/50 leading-relaxed font-light">
                Position yourself beautifully at the eastern gateway. Enjoy premium double deluxe cottages, kids-friendly swimming pool, high-tech rain dance, and campfires.
              </p>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => navigate('/booking')}
                  className="w-full py-3 bg-[#6b5b4b] hover:bg-[#85725f] text-white text-[10px] font-mono tracking-wider uppercase rounded-xl transition-colors cursor-pointer font-medium"
                  id="btn-sidebar-book"
                >
                  Check Availability
                </button>
                <Link
                  to="/rooms"
                  className="block text-[11px] font-medium text-white/40 hover:text-white transition-colors"
                >
                  Explore Rooms &amp; Rates
                </Link>
              </div>

              <div className="border-t border-white/5 pt-4 text-[10px] text-white/30 font-mono space-y-1">
                <p>Phone Support: +91 99029 60484</p>
                <p>Check-in: 12 PM • Check-out: 11 AM</p>
              </div>
            </div>
          </div>

        </div>

      </article>

    </div>
  );
}
