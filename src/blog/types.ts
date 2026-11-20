export type BlogCategory =
  | 'Complete Travel Guides'
  | 'Itineraries'
  | 'Kushalnagar & Tibetan Culture'
  | 'Madikeri & Western Coorg'
  | 'Where to Stay';

export interface BlogFAQ {
  q: string;
  a: string;
}

export interface BlogHighlight {
  label: string;
  value: string;
}

export interface BlogLink {
  label: string;
  to: string;
}

export interface BlogSubsection {
  id?: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface BlogTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface BlogAttraction {
  id: string;
  number?: number;
  name: string;
  tagline: string;
  summary: string;
  whyVisit?: string;
  image?: {
    src: string;
    alt: string;
    caption?: string;
  };
  details: {
    location: string;
    distance: string;
    duration: string;
    bestTime: string;
  };
  tip: string;
  layout?: 'split-left' | 'split-right' | 'wide' | 'editorial';
}

export interface BlogRouteGroup {
  region: string;
  title: string;
  stops: string[];
  note: string;
  distanceNote: string;
}

export interface BlogRoutePlanner {
  intro?: string;
  disclaimer: string;
  regions: BlogRouteGroup[];
}

export interface BlogTocGroup {
  region: string;
  subtitle?: string;
  sectionId: string;
  items: { id: string; label: string }[];
}

export interface BlogQuickSummary {
  heading?: string;
  subtitle?: string;
  items: { label: string; value: string }[];
}

export interface BlogSection {
  id: string;
  regionLabel?: string;
  heading: string;
  paragraphs?: string[];
  subsections?: BlogSubsection[];
  attractions?: BlogAttraction[];
  bullets?: string[];
  table?: BlogTable;
  routePlanner?: BlogRoutePlanner;
  pullQuote?: {
    text: string;
    note?: string;
  };
  sectionBanner?: {
    src: string;
    alt: string;
    caption?: string;
  };
  links?: BlogLink[];
  callout?: {
    title: string;
    text: string;
  };
  image?: {
    src: string;
    alt: string;
    caption?: string;
  };
}

export interface BlogPost {
  title: string;
  seoTitle: string;
  metaDesc: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  category: BlogCategory;
  heroImg: string;
  heroAlt: string;
  heroCaption?: string;
  publishedDate: string;
  updatedDate: string;
  readTime: string;
  featuredRank?: number;
  discoverPoints?: string[];
  quickSummary?: BlogQuickSummary;
  tocGroups?: BlogTocGroup[];
  intro: string[];
  sections: BlogSection[];
  highlights?: BlogHighlight[];
  relatedSlugs: string[];
  stayRecommendation?: {
    heading: string;
    text: string;
    links: BlogLink[];
  };
  conclusion: string;
  faqs: BlogFAQ[];
  structuredType: 'Article' | 'BlogPosting';
  canonicalSlug?: string;
}
