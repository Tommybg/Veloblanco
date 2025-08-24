import { useLocation, useNavigate } from 'react-router-dom';
import ResultsDashboard from '@/components/ResultsDashboard';
import type { ResearchResults } from '@/types/research';


/**
 * Results Page - displays the research results dashboard
 * Gets results data from route state and renders the dashboard
 */
const Results = () => {
  const location = useLocation() as { state?: { results?: ResearchResults; query?: string } };
  const navigate = useNavigate();
  const results = location.state?.results;
  const query = location.state?.query ?? '';

  // Si no hay resultados en la ruta, redirigir al inicio
  if (!results) {
    console.warn('No results data found, redirecting to home');
    navigate('/');
    return null;
  }

  return (
    <ResultsDashboard
      query={query}
      onNewSearch={() => navigate('/')}
      results={results}
    />
  );
};

export default Results;
