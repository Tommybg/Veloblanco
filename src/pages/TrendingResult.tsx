import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ResultsDashboard from '@/components/ResultsDashboard';
import { getTrendingTopicBySlug } from '@/services/supabase';
import type { TrendingTopicWithAnalysis } from '@/services/supabase';
import LoadingSpinner from '@/components/feed/LoadingSpinner';

const TrendingResult = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [trendingTopic, setTrendingTopic] = useState<TrendingTopicWithAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Agregar estado para selectedPerspective
  const [selectedPerspective, setSelectedPerspective] = useState<'left' | 'center' | 'right'>('center');

  useEffect(() => {
    const fetchTrendingTopic = async () => {
      if (!slug) {
        setError('Slug no válido');
        setLoading(false);
        return;
      }

      try {
        const result = await getTrendingTopicBySlug(slug);
        
        if (result.success && result.data) {
          setTrendingTopic(result.data);
        } else {
          setError('No se pudo cargar el trending topic');
        }
      } catch (err) {
        setError('Error al cargar el trending topic');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTopic();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !trendingTopic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-muted-foreground mb-4">{error || 'No se encontró el trending topic'}</p>
          <button
            onClick={() => navigate('/trending')}
            className="btn-primary"
          >
            Volver a Trending Topics
          </button>
        </div>
      </div>
    );
  }

  // Convertir TrendingTopicWithAnalysis a ResearchResults para ResultsDashboard
  const researchResults = {
    answer: trendingTopic.analysisSummary,
    sources: trendingTopic.sources.map(source => ({
      title: source.name,
      url: source.url,
      summary: `Fuente ${source.category} con rating ${source.rating}`,
      biasClassification: {
        fusedResult: { category: source.category }
      }
    })),
    neutralityScore: trendingTopic.neutralityScore,
    ideologicalDistribution: trendingTopic.ideologicalDistribution,
    transparency: trendingTopic.transparency,
    sourcesWithBias: trendingTopic.sources.map(source => ({
      title: source.name,
      url: source.url,
      biasClassification: {
        fusedResult: { category: source.category }
      }
    })),
    
    // Agregar los campos de perspectivas desde Supabase
    perspectiveLeftSummary: trendingTopic.perspectiveLeftSummary,
    perspectiveLeftKeywords: trendingTopic.perspectiveLeftKeywords,
    perspectiveCenterSummary: trendingTopic.perspectiveCenterSummary,
    perspectiveCenterKeywords: trendingTopic.perspectiveCenterKeywords,
    perspectiveRightSummary: trendingTopic.perspectiveRightSummary,
    perspectiveRightKeywords: trendingTopic.perspectiveRightKeywords
  };

  return (
    <ResultsDashboard
      query={trendingTopic.title}
      onNewSearch={() => navigate('/trending')}
      results={researchResults}
      selectedPerspective={selectedPerspective}
      onPerspectiveChange={setSelectedPerspective}
    />
  );
};

export default TrendingResult;
