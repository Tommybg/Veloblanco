export interface Medio {
  id: string;
  name: string;
  logo: string;
  bias: 'left' | 'center' | 'right';
  credibility: number;
  country: string;
  description: string;
  audience: string;
  founded: string;
  website: string;
  topics: string[];
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  url: string;
}
