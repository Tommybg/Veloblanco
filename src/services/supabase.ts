import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos para la base de datos
export interface TrendingTopic {
  id: string;
  title: string;
  category: string;
  country: string;
  period: string;
  trend: string;
  sourceCount: number;
  uniqueSources: number;
  keywords: string[];
  timeAgo: string;
  createdAt: string;
}

export interface DeepResearchResult {
  id: string;
  topicId: string;
  topicTitle: string;
  category: string;
  country: string;
  period: string;
  researchDate: string;
  answer: string;
  sources: any[];
  biasStats: any;
  sourceCount: number;
  analysisTime: number;
  neutralityScore: number;
  ideologicalDistribution: {
    left: number;
    center: number;
    right: number;
  };
  createdAt: string;
}

// Funciones para guardar datos
export const saveTrendingTopic = async (topic: Omit<TrendingTopic, 'id' | 'createdAt'>) => {
  try {
    const { data, error } = await supabase
      .from('trending_topics')
      .insert([topic])
      .select()
      .single();

    if (error) throw error;
    
    console.log('Trending topic saved:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error saving trending topic:', error);
    return { success: false, error };
  }
};

export const saveDeepResearchResult = async (result: Omit<DeepResearchResult, 'id' | 'createdAt'>) => {
  try {
    const { data, error } = await supabase
      .from('deep_research_results')
      .insert([result])
      .select()
      .single();

    if (error) throw error;
    
    console.log('Deep research result saved:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error saving deep research result:', error);
    return { success: false, error };
  }
};

export const getTrendingTopics = async (period: string, category?: string, country?: string) => {
  try {
    let query = supabase
      .from('trending_topics')
      .select('*')
      .eq('period', period)
      .order('createdAt', { ascending: false });

    if (category && category !== 'todos') {
      query = query.eq('category', category);
    }

    if (country && country !== 'todos') {
      query = query.eq('country', country);
    }

    const { data, error } = await query.limit(20);

    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return { success: false, error, data: [] };
  }
};

export const getDeepResearchResult = async (topicId: string) => {
  try {
    const { data, error } = await supabase
      .from('deep_research_results')
      .select('*')
      .eq('topicId', topicId)
      .order('createdAt', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching deep research result:', error);
    return { success: false, error, data: null };
  }
};

// Nuevas interfaces para trending topics con análisis
export interface TrendingTopicWithAnalysis {
  id: string;
  title: string;
  category: string;
  country: string;
  period: string;
  trend: string;
  sourceCount: number;
  uniqueSources: number;
  keywords: string[];
  timeAgo: string;
  createdAt: string;
  
  // Campos del análisis pre-escrito
  analysisSummary: string;
  neutralityScore: number;
  ideologicalDistribution: {
    left: number;
    center: number;
    right: number;
  };
  perspectives: {
    left: { title: string; summary: string; keywords: string[] };
    center: { title: string; summary: string; keywords: string[] };
    right: { title: string; summary: string; keywords: string[] };
  };
  sources: Array<{
    name: string;
    url: string;
    category: 'left' | 'center' | 'right';
    rating: number;
  }>;
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
  slug: string;
  
  // Agregar estos campos para las perspectivas
  perspectiveLeftSummary?: string;
  perspectiveLeftKeywords?: string[];
  perspectiveCenterSummary?: string;
  perspectiveCenterKeywords?: string[];
  perspectiveRightSummary?: string;
  perspectiveRightKeywords?: string[];
}

// Función para obtener trending topics con análisis
export const getTrendingTopicsWithAnalysis = async (
  period: string, 
  category?: string, 
  country?: string
): Promise<{ success: boolean; data: TrendingTopicWithAnalysis[]; error?: any }> => {
  try {
    let query = supabase
      .from('trending_topics')
      .select(`
        *,
        trending_sources (
          title,
          url,
          bias_category,
          credibility_score
        )
      `)
      .eq('period', period)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (category && category !== 'todos') {
      query = query.eq('category', category);
    }

    if (country && country !== 'todos') {
      query = query.eq('country', country);
    }

    const { data, error } = await query.limit(20);

    if (error) throw error;
    
    // Transformar datos para incluir análisis
    const transformedData = data?.map(topic => ({
      ...topic,
      analysisSummary: topic.analysis_summary,
      neutralityScore: topic.neutrality_score,
      ideologicalDistribution: topic.ideological_distribution,
      perspectives: topic.perspectives,
      sources: topic.trending_sources?.map(source => ({
        name: source.title,
        url: source.url,
        category: source.bias_category,
        rating: source.credibility_score
      })) || [],
      transparency: topic.transparency,
      slug: topic.slug
    })) || [];
    
    return { success: true, data: transformedData };
  } catch (error) {
    console.error('Error fetching trending topics with analysis:', error);
    return { success: false, error, data: [] };
  }
};

// Función para obtener un trending topic específico por slug
export const getTrendingTopicBySlug = async (
  slug: string
): Promise<{ success: boolean; data: TrendingTopicWithAnalysis | null; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('trending_topics')
      .select(`
        *,
        trending_sources (
          title,
          url,
          bias_category,
          credibility_score
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    
    // Transformar datos
    const transformedData = {
      ...data,
      analysisSummary: data.analysis_summary,
      neutralityScore: data.neutrality_score,
      ideologicalDistribution: data.ideological_distribution,
      perspectives: data.perspectives,
      sources: data.trending_sources?.map(source => ({
        name: source.title,
        url: source.url,
        category: source.bias_category,
        rating: source.credibility_score
      })) || [],
      transparency: data.transparency,
      slug: data.slug,
      
      // Agregar mapeo de campos individuales de perspectivas
      perspectiveLeftSummary: data.perspective_left_summary,
      perspectiveLeftKeywords: data.perspective_left_keywords,
      perspectiveCenterSummary: data.perspective_center_summary,
      perspectiveCenterKeywords: data.perspective_center_keywords,
      perspectiveRightSummary: data.perspective_right_summary,
      perspectiveRightKeywords: data.perspective_right_keywords
    };
    
    return { success: true, data: transformedData };
  } catch (error) {
    console.error('Error fetching trending topic by slug:', error);
    return { success: false, error, data: null };
  }
};

// Función para crear las tablas si no existen (solo para desarrollo)
export const initializeDatabase = async () => {
  try {
    // Crear tabla de trending topics
    const { error: trendingError } = await supabase.rpc('create_trending_topics_table');
    if (trendingError) {
      console.log('Trending topics table might already exist:', trendingError.message);
    }

    // Crear tabla de deep research results
    const { error: researchError } = await supabase.rpc('create_deep_research_table');
    if (researchError) {
      console.log('Deep research table might already exist:', researchError.message);
    }

    console.log('Database initialization completed');
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error };
  }
};
