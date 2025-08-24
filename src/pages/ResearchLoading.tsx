import { useLocation, useNavigate } from 'react-router-dom';
import NewsResearchLoading from '@/components/NewsResearchLoading';


/**
 * Research Loading Page - handles the deep research workflow execution
 * Gets query from route state and triggers the real API call
 */
const ResearchLoading = () => {
  const location = useLocation() as { state?: { query?: string } };
  const navigate = useNavigate();
  const query = location.state?.query ?? '';

  // Si no hay query en la ruta, redirigir al inicio
  if (!query) {
    navigate('/');
    return null;
  }

  return (
    <NewsResearchLoading
      query={query}
      onComplete={() => {
        // This is only used for the simulated animation fallback
        // Real navigation happens inside NewsResearchLoading after API response
        navigate('/');
      }}
    />
  );
};

export default ResearchLoading;
