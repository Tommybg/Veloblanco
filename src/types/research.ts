// Shared types for Deep Research workflow

export interface SearchResult {
  title: string | null;
  url: string;
  summary: string;
  favicon: string | null;
}

export interface DeepResearchRequest {
  query: string;
  clarification?: string;
}

export interface DeepResearchResponse {
  status: "completed" | "failed";
  data?: {
    answer: string; // Full analysis from answer.ts
    sources: SearchResult[]; // From search.ts
    neutralityScore: number; // 0-100
    ideologicalDistribution: {
      left: number;
      center: number;
      right: number;
    };
    transparency: {
      sourcesProcessed: number;
      analysisTime: number;
      sourceBreakdown: {
        newsOutlets: number;
        academic: number;
        government: number;
        other: number;
      };
    };
  };
  error?: string;
}

export interface ResearchResults {
  answer: string;
  sources: SearchResult[];
  neutralityScore: number;
  ideologicalDistribution: {
    left: number;
    center: number;
    right: number;
  };
  transparency: {
    sourcesProcessed: number;
    analysisTime: number;
    sourceBreakdown: {
      newsOutlets: number;
      academic: number;
      government: number;
      other: number;
    };
  };
  // New parsed fields
  parsedData?: {
    title: string;
    abstract: string;
    perspectives: {
      left: {
        title: string;
        summary: string;
        keywords: string[];
      };
      center: {
        title: string;
        summary: string;
        keywords: string[];
      };
      right: {
        title: string;
        summary: string;
        keywords: string[];
      };
    };
    parsedSources: Array<{
      name: string;
      url: string;
      category: string;
      stance?: string;
      rating?: number;
    }>;
  };
}


