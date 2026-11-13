import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Compass, Search, ArrowRight, Clock, BookOpen, MapPin } from 'lucide-react';
import { BLOG_CATEGORIES, CANONICAL_BLOG_POSTS } from '../blogData';
import { getProductionOrigin } from '../components/SEOManager';

export default function BlogList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const origin = getProductionOrigin();

  const categories = ['All', ...BLOG_CATEGORIES];

  const postsArray = useMemo(
    () =>
      Object.entries(CANONICAL_BLOG_POSTS)
        .map(([slug, data]) => ({ slug, ...data }))
        .sort((a, b) => (a.featuredRank ?? 999) - (b.featuredRank ?? 999)),
    []
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: postsArray.length };
    for (const cat of BLOG_CATEGORIES) {
      counts[cat] = postsArray.filter((p) => p.category === cat).length;
    }
    return counts;
  }, [postsArray]);

  const featuredPosts = useMemo(
    () => postsArray.filter((p) => (p.featuredRank ?? 999) <= 3),
    [postsArray]
  );

  const filteredPosts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return postsArray.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.metaDesc.toLowerCase().includes(q) ||
        post.primaryKeyword.toLowerCase().includes(q) ||
        post.secondaryKeywords.some((k) => k.toLowerCase().includes(q)) ||
        post.category.toLowerCase().includes(q)
      );
    });
  }, [postsArray, searchTerm, selectedCategory]);

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'Dreamy Vacations Coorg & Kushalnagar Travel Publication',
    'url': `${origin}/blog`,
    'description':
      'Comprehensive travel guides to Coorg (Kodagu), Bylakuppe Tibetan culture, Kushalnagar attractions, Madikeri highlands, and realistic trip itineraries.',
    'blogPost': postsArray.slice(0, 12).map((p) => ({
      '@type': 'BlogPosting',
      'headline': p.title,
      'url': `${origin}/blog/${p.slug}`,
      'datePublished': p.publishedDate,
      'dateModified': p.updatedDate
    }))
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] font-sans text-white/90 pb-24 pt-28" id="blog-list-root">
      <script type="application/ld+json" id="ld-blog-list">
        {JSON.stringify(listSchema)}
      </script>

      {/* Editorial Publication Header */}
      <header className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-5 mb-14">
        <span className="text-[11px] uppercase font-sub tracking-[0.25em] text-[#e2d7c5] font-semibold block">
          Kodagu &amp; Eastern Coorg Publication
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-light text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Coorg Travel Guides, Tibetan Heritage &amp; Itineraries
        </h1>
        <p className="text-sm sm:text-base text-white/65 font-light max-w-2xl mx-auto leading-relaxed">
          Discover the other side of Coorg. Explore Bylakuppe’s Tibetan monasteries, Kushalnagar river islands and coffee country alongside practical Madikeri mountain guides and realistic trip blueprints.
        </p>

        {/* Quick Anchor Strip to Planning Tools */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] font-sub tracking-[0.14em] uppercase">
          <Link
            to="/travel-guide"
            className="px-4 py-2 rounded-full border border-white/10 bg-[#121212] text-white/75 hover:text-[#e2d7c5] hover:border-[#e2d7c5]/40 transition-colors inline-flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-[#e2d7c5]" /> Attraction Hub
          </Link>
          <Link
            to="/trip-planner"
            className="px-4 py-2 rounded-full border border-[#6b5b4b]/40 bg-[#6b5b4b]/15 text-[#e2d7c5] hover:bg-[#6b5b4b]/25 transition-colors inline-flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" /> Interactive Trip Planner
          </Link>
        </div>
      </header>

      {/* Featured Pillar Strip when browsing All without search */}
      {selectedCategory === 'All' && !searchTerm.trim() && featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-14" aria-labelledby="featured-pillars-heading">
          <div className="flex items-center justify-between mb-5">
            <h2 id="featured-pillars-heading" className="text-xs font-sub uppercase tracking-[0.22em] text-[#e2d7c5] font-semibold">
              Essential Starting Guides
            </h2>
            <span className="text-[11px] font-mono text-white/40 hidden sm:inline">
              Recommended reading for first-time planners
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group bg-[#121212] border border-[#6b5b4b]/30 hover:border-[#e2d7c5]/50 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 shadow-lg"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={post.heroImg}
                    alt={post.heroAlt}
                    width={480}
                    height={176}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 text-[10px] font-mono uppercase tracking-wider text-[#e2d7c5]">
                    {post.category} • {post.readTime}
                  </span>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                  <h3 className="text-lg font-display font-light text-white group-hover:text-[#e2d7c5] transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-white/55 font-light leading-relaxed line-clamp-2">
                    {post.metaDesc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Search Box */}
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-sub font-semibold tracking-[0.16em] text-[#e2d7c5] uppercase">
              Search Guides
            </h2>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" aria-hidden="true" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Bylakuppe, 3 days, Abbey Falls..."
                aria-label="Search Coorg travel guides"
                className="w-full bg-[#181818] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-[#6b5b4b]/60 transition-colors"
                id="blog-search-input"
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-sub font-semibold tracking-[0.16em] text-[#e2d7c5] uppercase">
              Editorial Categories
            </h2>
            <div className="flex flex-col gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left py-2.5 px-3 rounded-lg text-xs font-light tracking-wide transition-all flex items-center justify-between cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#6b5b4b] text-white font-medium shadow-sm'
                      : 'text-white/65 hover:bg-white/5 hover:text-white'
                  }`}
                  id={`btn-cat-${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                >
                  <span className="pr-2">{cat}</span>
                  <span className={`text-[10px] font-mono ${selectedCategory === cat ? 'text-white/90' : 'text-white/35'}`}>
                    {categoryCounts[cat] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Eastern Gateway Stay Context */}
          <div className="bg-[#121212] border border-[#6b5b4b]/30 rounded-2xl p-5 space-y-3.5 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[3px] bg-[#6b5b4b]" />
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#e2d7c5] block">
              Kushalnagar Base
            </span>
            <h2 className="text-base font-display font-light text-white leading-snug">
              Stay at Dreamy Vacations
            </h2>
            <p className="text-xs text-white/55 leading-relaxed font-light">
              Set in Chikkathur Village near Kushalnagar—12 minutes from Bylakuppe and convenient for Madikeri day trips, with pool, rain dance and family rooms.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/rooms"
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#e2d7c5] hover:underline"
              >
                View Room Categories <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/booking"
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/60 hover:text-white transition-colors"
              >
                Send Stay Enquiry <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Articles Grid */}
        <section className="lg:col-span-9 space-y-6" aria-label="Travel Articles">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-4">
            <span className="text-xs text-white/50 font-mono">
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'guide' : 'guides'}
            </span>
            <span className="text-xs text-[#e2d7c5]/80 font-mono">
              {selectedCategory}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 bg-[#121212] rounded-2xl border border-white/5 space-y-4">
              <Compass className="w-8 h-8 text-[#e2d7c5]/40 mx-auto" />
              <p className="text-xs text-white/60 font-light">
                No guides matched "{searchTerm}". Try searching Bylakuppe, Dubare, 2-day, or Mandalpatti.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 text-xs text-[#e2d7c5] border border-[#e2d7c5]/30 rounded-full hover:bg-[#e2d7c5]/10 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post, idx) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.25) }}
                  className="bg-[#121212] border border-white/5 hover:border-[#6b5b4b]/40 rounded-2xl overflow-hidden shadow-xl transition-all group flex flex-col h-full"
                  id={`blog-card-${post.slug}`}
                >
                  <Link to={`/blog/${post.slug}`} className="h-44 overflow-hidden relative shrink-0 block">
                    <img
                      src={post.heroImg}
                      alt={post.heroAlt}
                      width={440}
                      height={176}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3.5 left-3.5 bg-black/80 backdrop-blur-md text-[#e2d7c5] border border-white/10 px-2.5 py-1 rounded-full text-[9px] uppercase font-mono tracking-wider">
                      {post.category}
                    </span>
                  </Link>

                  <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-lg font-display font-light text-white leading-snug group-hover:text-[#e2d7c5] transition-colors">
                        <Link to={`/blog/${post.slug}`} className="focus:outline-none">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-xs text-white/55 font-light leading-relaxed line-clamp-3">
                        {post.metaDesc}
                      </p>
                    </div>

                    <div className="pt-3 flex items-center justify-between border-t border-white/5 shrink-0">
                      <span className="text-[10px] font-mono text-white/40 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#e2d7c5]/70" /> {post.readTime}
                      </span>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-[#e2d7c5] hover:text-white transition-colors"
                      >
                        Read Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
