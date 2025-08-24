// Shared types for Deep Research workflow

export interface SearchResult {
  title: string | null;
  url: string;
  summary: string;
  favicon: string | null;
  biasClassification?: BiasClassification;
}

export interface BiasClassification {
  bertPrediction: {
    category: 'left' | 'center' | 'right';
    confidence: number;
  };
  openaiVerification: {
    category: 'left' | 'center' | 'right';
    confidence: number;
    reasoning: string;
  };
  fusedResult: {
    category: 'left' | 'center' | 'right';
    position: number; // 0-100 where 0=left, 50=center, 100=right
    certainty: number; // 0-100 where 100=both agree, lower=disagreement
    visualPosition: number; // For bias bar visualization
  };
  processingTime: number;
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
    sourcesWithBias?: SearchResult[]; // Sources with BERT bias analysis
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
  sourcesWithBias?: SearchResult[];
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
  
  // Nuevos campos para perspectivas individuales desde Supabase
  perspectiveLeftSummary?: string;
  perspectiveLeftKeywords?: string[];
  perspectiveCenterSummary?: string;
  perspectiveCenterKeywords?: string[];
  perspectiveRightSummary?: string;
  perspectiveRightKeywords?: string[];
  
  // Campo parsedData existente
  parsedData?: {
    title: string;
    abstract: string;
    perspectives: {
      left: { title: string; summary: string; keywords: string[] };
      center: { title: string; summary: string; keywords: string[] };
      right: { title: string; summary: string; keywords: string[] };
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


