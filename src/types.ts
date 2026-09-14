export type ViewMode = 'spread' | 'single';

export type ReviewStatus = 'pending' | 'approved' | 'changes_requested' | 'reviewed';

export type ReviewCategory = 'general' | 'copy' | 'photo' | 'layout' | 'factual';

export interface PageFeedback {
  id: string;
  pageNumber: number;
  author: string;
  role: string;
  timestamp: string;
  status: ReviewStatus;
  category: ReviewCategory;
  comment: string;
  pinPosition?: { x: number; y: number }; // percentage 0-100% on the page
}

export interface PersonProfile {
  name: string;
  title: string;
  wing?: string;
  verified?: boolean;
}

export interface ImageSlot {
  caption: string;
  aspect: string;
  spec: string;
  imageUrl?: string;
}

export type PageLayoutType = 
  | 'cover'
  | 'contents'
  | 'editorial'
  | 'message'
  | 'grid-leadership'
  | 'focus-areas'
  | 'feature-split'
  | 'course-pathway'
  | 'photo-story'
  | 'timeline'
  | 'calendar'
  | 'membership'
  | 'media'
  | 'back-cover';

export interface PageData {
  pageNumber: number;
  title: string;
  category: string;
  headline: string;
  subtitle?: string;
  targetWords: string;
  leadParagraph?: string;
  paragraphs: string[];
  quote?: {
    text: string;
    author: string;
    role: string;
  };
  highlights?: string[];
  people?: PersonProfile[];
  images?: ImageSlot[];
  editorialChecks?: string[];
  layoutType: PageLayoutType;
  qrCode?: {
    label: string;
    url: string;
    fallbackText: string;
  };
  customDetails?: Record<string, unknown>;
}

export interface SearchResult {
  pageNumber: number;
  title: string;
  category: string;
  matchType: 'title' | 'person' | 'content' | 'editorial';
  snippet: string;
}
