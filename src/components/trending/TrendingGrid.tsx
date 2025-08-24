
import React, { useEffect, useState } from 'react';
import TrendCard from './TrendCard';
import { getTrendingTopicsWithAnalysis } from '@/services/supabase';
import type { TrendingTopicWithAnalysis } from '@/services/supabase';
import LoadingSpinner from '@/components/feed/LoadingSpinner';

interface TrendingGridProps {
  period: string;
  category: string;
  country: string;
}

const TrendingGrid = ({ period, category, country }: TrendingGridProps) => {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopicWithAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      try {
        setLoading(true);
        const result = await getTrendingTopicsWithAnalysis(period, category, country);
        
        if (result.success) {
          setTrendingTopics(result.data);
        } else {
          setError('Error al cargar trending topics');
        }
      } catch (err) {
        setError('Error al cargar trending topics');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTopics();
  }, [period, category, country]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (trendingTopics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron trending topics para los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trendingTopics.map((topic, index) => (
        <TrendCard
          key={topic.id}
          topic={{
            ...topic,
            id: parseInt(topic.id) || index + 1,
            description: topic.analysisSummary.substring(0, 150) + '...',
            spectrum: topic.ideologicalDistribution,
            sources: topic.sourceCount,
            neutralityScore: topic.neutralityScore
          }}
          rank={index + 1}
        />
      ))}
    </div>
  );
};

export default TrendingGrid;
