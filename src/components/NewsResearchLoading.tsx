
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import DisplayCards from '@/components/ui/display-cards';
import { Search, FileText, BarChart3, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeepResearchResponse } from '@/types/research';
import { triggerDeepResearch, healthCheck } from '@/api/deep-research';

interface LoadingStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  duration: number;
}

interface NewsResearchLoadingProps {
  onComplete?: () => void;
  autoStart?: boolean;
  query?: string;
}

const NewsResearchLoading: React.FC<NewsResearchLoadingProps> = ({
  onComplete = () => {},
  autoStart = true,
  query = "tu búsqueda"
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [researchResults, setResearchResults] = useState<DeepResearchResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActuallyLoading, setIsActuallyLoading] = useState(false);
  const navigate = useNavigate();

  const loadingSteps: LoadingStep[] = [
    {
      id: 'searching',
      label: 'Buscando fuentes de noticias...',
      icon: <Search className="w-4 h-4" />,
      duration: 2000
    },
    {
      id: 'analyzing',
      label: 'Analizando contenido...',
      icon: <FileText className="w-4 h-4" />,
      duration: 3000
    },
    {
      id: 'processing',
      label: 'Procesando información...',
      icon: <BarChart3 className="w-4 h-4" />,
      duration: 2500
    },
    {
      id: 'generating',
      label: 'Generando resultados...',
      icon: <CheckCircle className="w-4 h-4" />,
      duration: 1500
    }
  ];

  const startDeepResearch = async () => {
    setIsActuallyLoading(true);
    setError(null);
    try {
      console.log('Starting deep research for query:', query);
      const serverOk = await healthCheck();
      if (!serverOk) {
        throw new Error('API server is not running at /api/health');
      }
      const result: DeepResearchResponse = await triggerDeepResearch(String(query));
      
      if (result.status === 'completed' && result.data) {
        console.log('Deep research completed successfully');
        setResearchResults(result.data);
        setIsComplete(true);
        setProgress(100);
        setIsActuallyLoading(false);
        
        // Redirect to results dashboard
        setTimeout(() => {
          navigate('/results', { 
            state: { results: result.data, query } 
          });
        }, 1000);
      } else {
        console.error('Deep research failed:', result.error);
        setError(result.error || 'Unknown error occurred');
        setIsActuallyLoading(false);
      }
    } catch (err) {
      console.error('Deep research API error:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete research. Make sure the server is running on http://localhost:3001');
      setIsActuallyLoading(false);
    }
  };

  useEffect(() => {
    if (autoStart && query && query !== "tu búsqueda") {
      startDeepResearch();
    }
  }, [autoStart, query]);

  useEffect(() => {
    // Only run the simulated animation if we're not actually loading
    if (!autoStart || isActuallyLoading) return;

    let progressInterval: ReturnType<typeof setInterval>;
    let stepTimeout: ReturnType<typeof setTimeout>;

    const startStep = (stepIndex: number) => {
      if (stepIndex >= loadingSteps.length) {
        setIsComplete(true);
        setProgress(100);
        setTimeout(() => onComplete(), 500);
        return;
      }

      setCurrentStep(stepIndex);
      setVisibleCards(prev => [...prev, stepIndex]);
      
      const step = loadingSteps[stepIndex];
      const stepProgress = (stepIndex / loadingSteps.length) * 100;
      const nextStepProgress = ((stepIndex + 1) / loadingSteps.length) * 100;

      let currentProgress = stepProgress;
      setProgress(currentProgress);

      progressInterval = setInterval(() => {
        currentProgress += (nextStepProgress - stepProgress) / (step.duration / 50);
        if (currentProgress >= nextStepProgress) {
          currentProgress = nextStepProgress;
          clearInterval(progressInterval);
        }
        setProgress(currentProgress);
      }, 50);

      stepTimeout = setTimeout(() => {
        clearInterval(progressInterval);
        startStep(stepIndex + 1);
      }, step.duration);
    };

    startStep(0);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimeout);
    };
  }, [autoStart, onComplete, isActuallyLoading]);

  const getCardClassName = (index: number) => {
    const isVisible = visibleCards.includes(index);
    const isComplete = index < currentStep || (currentStep >= loadingSteps.length);
    const isCurrent = index === currentStep;
    
    if (!isVisible) {
      return "[grid-area:stack] opacity-0 translate-y-12 scale-95 transition-all duration-700 ease-out";
    }
    
    if (index === 0) {
      if (isComplete) {
        return "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-0 hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 transition-all duration-700";
      }
      if (isCurrent) {
        return "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-0 hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 animate-pulse transition-all duration-700";
      }
      return "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 transition-all duration-700";
    }
    
    if (index === 1) {
      if (isComplete) {
        return "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-0 hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 transition-all duration-700";
      }
      if (isCurrent) {
        return "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-0 hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 animate-pulse transition-all duration-700";
      }
      return "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 transition-all duration-700";
    }
    
    if (index === 2) {
      if (isComplete) {
        return "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10 grayscale-0 transition-all duration-700";
      }
      if (isCurrent) {
        return "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10 grayscale-0 animate-pulse transition-all duration-700";
      }
      return "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10 grayscale-[100%] transition-all duration-700";
    }
    
    if (index === 3) {
      if (isComplete) {
        return "[grid-area:stack] translate-x-48 translate-y-30 hover:translate-y-20 grayscale-0 transition-all duration-700";
      }
      if (isCurrent) {
        return "[grid-area:stack] translate-x-48 translate-y-30 hover:translate-y-20 grayscale-0 animate-pulse transition-all duration-700";
      }
      return "[grid-area:stack] translate-x-48 translate-y-30 hover:translate-y-20 grayscale-[100%] transition-all duration-700";
    }
    
    // Para índices adicionales (si los hay)
    const translateX = 48 + (index - 3) * 16;
    const translateY = 30 + (index - 3) * 10;
    
    if (isComplete) {
      return `[grid-area:stack] translate-x-[${translateX}px] translate-y-[${translateY}px] hover:translate-y-20 grayscale-0 transition-all duration-700`;
    }
    if (isCurrent) {
      return `[grid-area:stack] translate-x-[${translateX}px] translate-y-[${translateY}px] hover:translate-y-20 grayscale-0 animate-pulse transition-all duration-700`;
    }
    return `[grid-area:stack] translate-x-[${translateX}px] translate-y-[${translateY}px] hover:translate-y-20 grayscale-[100%] transition-all duration-700`;
  };

  const stackedCards = loadingSteps.map((step, index) => ({
    icon: step.icon,
    title: step.label.split(' ')[0],
    description: step.label,
    date: visibleCards.includes(index) ? (index < currentStep || isComplete ? "✓" : "•••") : "○",
    iconClassName: index < currentStep || isComplete ? "text-green-300" : index === currentStep ? "text-blue-300" : "text-muted-foreground",
    titleClassName: index < currentStep || isComplete ? "text-green-500" : index === currentStep ? "text-blue-500" : "text-muted-foreground",
    className: getCardClassName(index)
  }));

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-accent/30 p-4">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <div className="space-y-4">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h1 className="text-3xl font-bold text-foreground">
              Error en la investigación
            </h1>
            <p className="text-muted-foreground">
              {error}
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => {
                setError(null);
                startDeepResearch();
              }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Intentar de nuevo
            </button>
            <button
              onClick={() => navigate('/')}
              className="block mx-auto text-muted-foreground hover:text-foreground transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-accent/30 p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Analizando "{query}"
          </h1>
          <p className="text-muted-foreground">
            {isActuallyLoading 
              ? "Ejecutando investigación profunda con IA..." 
              : "Estamos procesando múltiples fuentes para darte una visión completa y balanceada"
            }
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <Progress 
            value={progress} 
            className="h-3 bg-muted"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{Math.round(progress)}% Completado</span>
            <span>
              {isComplete ? "Finalizado" : isActuallyLoading ? "Investigando..." : "Procesando..."}
            </span>
          </div>
        </div>

        {/* Stacked Cards Animation */}
        <div className="flex justify-center min-h-[400px] items-center">
          <DisplayCards cards={stackedCards} />
        </div>

        {/* Current Step Indicator */}
        <div className="text-center">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            {isActuallyLoading 
              ? "Ejecutando workflow de investigación..." 
              : currentStep < loadingSteps.length 
                ? loadingSteps[currentStep].label 
                : "Completado"
            }
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default NewsResearchLoading;