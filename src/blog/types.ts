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

export interface BlogSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  subsections?: BlogSubsection[];
  bullets?: string[];
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
