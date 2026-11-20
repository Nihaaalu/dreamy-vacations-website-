import { GUIDES_POSTS } from './blog/guidesPosts';
import { ITINERARY_POSTS } from './blog/itineraryPosts';
import { KUSHALNAGAR_TIBETAN_POSTS } from './blog/kushalnagarTibetanPosts';
import { MADIKERI_WESTERN_POSTS } from './blog/madikeriWesternPosts';
import { PLACES_TO_VISIT_POST } from './blog/placesToVisitPost';
import { STAY_POSTS } from './blog/stayPosts';
import type {
  BlogCategory,
  BlogFAQ,
  BlogHighlight,
  BlogLink,
  BlogPost,
  BlogSection,
  BlogTable,
} from './blog/types';

export type {
  BlogCategory,
  BlogFAQ,
  BlogHighlight,
  BlogLink,
  BlogPost,
  BlogSection,
  BlogTable,
};

export const BLOG_CATEGORIES: BlogCategory[] = [
  'Complete Travel Guides',
  'Itineraries',
  'Kushalnagar & Tibetan Culture',
  'Madikeri & Western Coorg',
  'Where to Stay',
];

export const CANONICAL_BLOG_POSTS: Record<string, BlogPost> = {
  ...PLACES_TO_VISIT_POST,
  ...GUIDES_POSTS,
  ...ITINERARY_POSTS,
  ...KUSHALNAGAR_TIBETAN_POSTS,
  ...MADIKERI_WESTERN_POSTS,
  ...STAY_POSTS,
};

export const BLOG_ALIASES: Record<string, string> = {
  '2-day-coorg-itinerary': 'coorg-trip-plan-2-days',
  'coorg-trip-plan-3-days': '3-day-coorg-itinerary',
};

export const BLOG_POSTS: Record<string, BlogPost> = {
  ...CANONICAL_BLOG_POSTS,
  '2-day-coorg-itinerary': {
    ...CANONICAL_BLOG_POSTS['coorg-trip-plan-2-days'],
    canonicalSlug: 'coorg-trip-plan-2-days',
  },
  'coorg-trip-plan-3-days': {
    ...CANONICAL_BLOG_POSTS['3-day-coorg-itinerary'],
    canonicalSlug: '3-day-coorg-itinerary',
  },
};

export function resolveCanonicalBlogSlug(slug?: string): string {
  if (!slug) return 'complete-coorg-travel-guide';
  if (BLOG_ALIASES[slug]) return BLOG_ALIASES[slug];
  if (CANONICAL_BLOG_POSTS[slug]) return slug;
  return 'complete-coorg-travel-guide';
}
