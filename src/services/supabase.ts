import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

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
