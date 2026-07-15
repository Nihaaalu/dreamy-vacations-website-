import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Compass, BookOpen, MapPin, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { BLOG_POSTS } from '../blogData';

export default function BlogList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Itineraries', 'Guides', 'Where to Stay'];

  const postsArray = Object.entries(BLOG_POSTS).map(([slug, data]) => ({
    slug,
    ...data,
  }));

  const filteredPosts = postsArray.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.metaDesc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // JSON-LD structured data for the blog list page (WebSite & SearchAction)
  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Dreamy Vacations Coorg Travel Guide Blog',
    'url': 'https://dreamyvacations.in/blog',
    'description': 'Discover expert itineraries, places to stay, and attraction guides for Kushalnagar & Coorg.',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://dreamyvacations.in/blog?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] font-sans text-white/90 pb-20 pt-28" id="blog-list-root">
      
      {/* Schema injection */}
      <script type="application/ld+json" id="ld-blog-list">
        {JSON.stringify(listSchema)}
      </script>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-4 mb-16">
        <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#e2d7c5] font-semibold block">
          Coorg Travel publication
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-light text-white tracking-tight leading-none max-w-3xl mx-auto">
          Coorg Travel Guides & Itineraries
        </h1>
        <p className="text-sm md:text-base text-white/60 font-light max-w-2xl mx-auto">
          Expert recommendations, factual trip planners, and side-by-side local comparisons to position Kushalnagar as your perfect Coorg base.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Sidebar: Categories and Search */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Search Box */}
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-display font-medium tracking-[0.1em] text-[#e2d7c5] uppercase">
              Search Guides
            </h3>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search keywords..."
                className="w-full bg-[#181818] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#6b5b4b]/60 transition-colors"
                id="blog-search-input"
              />
            </div>
          </div>

          {/* Categories Selector */}
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-display font-medium tracking-[0.1em] text-[#e2d7c5] uppercase">
              Categories
            </h3>
            <div className="flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left py-2 px-3 rounded-lg text-xs font-light tracking-wide transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#6b5b4b] text-white font-medium shadow-sm'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                  id={`btn-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Premium Base Promo */}
          <div className="bg-[#121212] border border-[#6b5b4b]/30 rounded-2xl p-5 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#6b5b4b]/10 rounded-full blur-xl" />
            <span className="text-[9px] uppercase font-mono tracking-wider text-[#e2d7c5] block">
              Strategic Base
            </span>
            <h4 className="text-sm font-display font-light text-white leading-tight">
              Stay in Kushalnagar
            </h4>
            <p className="text-[11px] text-white/50 leading-relaxed font-light">
              Bypass high mountain traffic bottlenecks. Check in immediately on arrival day and enjoy our deep outdoor swimming pool.
            </p>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#e2d7c5] hover:underline"
            >
              View Luxury Rooms <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* Right Content: Grid of Blog Posts */}
        <div className="lg:col-span-9 space-y-6">
          
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-xs text-white/40 font-mono">
              Showing {filteredPosts.length} travel guides
            </span>
            <span className="text-xs text-white/40 font-mono">
              Filter: {selectedCategory}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 bg-[#121212] rounded-2xl border border-white/5 space-y-4">
              <Compass className="w-8 h-8 text-[#e2d7c5]/40 mx-auto animate-pulse" />
              <p className="text-xs text-white/50 font-light">
                No articles matched your search filters. Please try another query.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post, idx) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                  className="bg-[#121212] border border-white/5 hover:border-[#6b5b4b]/30 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all group flex flex-col h-full"
                  id={`blog-card-${post.slug}`}
                >
                  <div className="h-44 overflow-hidden relative shrink-0">
                    <img
                      src={post.heroImg}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-[#e2d7c5] border border-white/10 px-2.5 py-1 rounded-full text-[9px] uppercase font-mono tracking-wider">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-display font-light text-white leading-tight group-hover:text-[#e2d7c5] transition-colors">
                        <Link to={`/blog/${post.slug}`} className="focus:outline-none">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-white/50 font-light leading-relaxed line-clamp-3">
                        {post.metaDesc}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-white/5 shrink-0">
                      <span className="text-[10px] font-mono text-white/30">
                        Kushalnagar • Coorg
                      </span>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-[#e2d7c5] hover:text-white transition-colors"
                      >
                        Read Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
