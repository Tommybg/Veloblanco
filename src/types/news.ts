export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  source: string;
  sourceUrl: string;
  sourceLogo?: string;
  timestamp: string;
  category: string;
  image?: string;
  imageAlt?: string;
  url: string;
  likes: number;
  shares: number;
  comments: number;
  bias: 'left' | 'center' | 'right';
  tags: string[];
  readTime?: number; // in minutes
}

export interface NewsComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface NewsEngagement {
  isLiked: boolean;
  isBookmarked: boolean;
  isShared: boolean;
  userLikes: number;
  userComments: number;
  userShares: number;
}

export interface NewsSource {
  name: string;
  url: string;
  logo?: string;
  category: 'news' | 'blog' | 'government' | 'academic' | 'social';
  reliability: number; // 0-100
  bias: 'left' | 'center' | 'right';
}
