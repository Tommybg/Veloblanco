
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import DisplayCards from '@/components/ui/display-cards';
import { Search, FileText, BarChart3, CheckCircle, Clock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeepResearchResponse } from '@/types/research';
import { healthCheck, startResearchRun, fetchDeepResearchResult } from '@/api/deep-research';
import { useRealtimeRun } from '@trigger.dev/react-hooks';
import { parseDeepResearchResponse } from '@/utils/deepResearchParser';
import { Markdown } from '@/components/ui/markdown';

// Componente que usa SOLO el progreso real de Trigger.dev
function RealtimeRunSubscriber({
  runId,
  accessToken,
  onProgress,
}: {
  runId: string;
  accessToken: string;
  onProgress: (p: { percentage?: number; step?: number; message?: string }) => void;
}) {
  const { run, error } = useRealtimeRun(runId, { accessToken });
  
  useEffect(() => {
    if (!run) return;
    
    console.log('📈 RealtimeRun update:', run);
    
    // Extraer progreso del metadata
    const meta: any = (run as any).metadata;
    if (meta?.progress) {
      console.log('📊 Progress from metadata:', meta.progress);
      onProgress(meta.progress);
    }
    
    // Verificar el estado del run
    if (run.status === 'COMPLETED') {
      console.log('✅ Run completed successfully');
      onProgress({ percentage: 100, step: 4, message: 'Completado' });
    } else if (run.status === 'FAILED') {
      console.log('❌ Run failed');
      onProgress({ message: 'Error en la ejecución' });
    }
    
  }, [run, onProgress]);
  
  if (error) {
    console.error('❌ Realtime error:', error);
  }
  
  return null;
}

interface LoadingStep {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface NewsResearchLoadingProps {
  onComplete?: () => void;
  query?: string;
}

const NewsResearchLoading: React.FC<NewsResearchLoadingProps> = ({
  onComplete = () => {},
  query = "tu búsqueda"
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [researchResults, setResearchResults] = useState<DeepResearchResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActuallyLoading, setIsActuallyLoading] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [showContent, setShowContent] = useState(false);
  const [parsedContent, setParsedContent] = useState<any>(null);
  const navigate = useNavigate();

  const loadingSteps: LoadingStep[] = [
    {
      id: 'searching',
      label: 'Buscando fuentes de noticias...',
      icon: <Search className="w-4 h-4" />
    },
    {
      id: 'analyzing',
      label: 'Analizando contenido...',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'processing',
      label: 'Procesando información...',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'generating',
      label: 'Generando resultados...',
      icon: <CheckCircle className="w-4 h-4" />
    }
  ];

  // Función principal que SOLO usa Trigger.dev real
  const startDeepResearch = async () => {
    setIsActuallyLoading(true);
    setError(null);
    setProgress(0);
    setCurrentStep(0);
    setVisibleCards([0]);
    setShowContent(false);
    setParsedContent(null);
    
    try {
      console.log('🚀 Starting deep research for query:', query);
      
      // Verificar que el servidor esté funcionando
      const serverOk = await healthCheck();
      if (!serverOk) {
        throw new Error('API server is not running at /api/health');
      }
      
      // Iniciar el run de Trigger.dev
      const started = await startResearchRun(String(query));
      setRunId(started.runId);
      
      if (started.publicAccessToken) {
        setPublicToken(started.publicAccessToken);
        console.log('✅ Using realtime progress with token:', started.publicAccessToken);
        
        // Mostrar progreso inicial
        setProgress(10);
        setCurrentMessage("Iniciando investigación...");
      } else {
        throw new Error('No public access token available for realtime progress');
      }
      
      // Polling mejorado para obtener resultados y contenido
      let result: any;
      const pollStart = Date.now();
      const timeoutMs = 10 * 60 * 1000; // 10 minutos
      const intervalMs = 3000; // Polling cada 3 segundos
      
      while (Date.now() - pollStart < timeoutMs) {
        try {
          result = await fetchDeepResearchResult(started.runId);
          
          if (result?.status === 'completed' && result?.data) {
            console.log('✅ Deep research completed successfully');
            
            // Intentar parsear el contenido para mostrar perspectivas
            try {
              if (result.data.answer) {
                const parsed = parseDeepResearchResponse(result.data.answer);
                setParsedContent(parsed);
                setShowContent(true);
                console.log('📝 Content parsed successfully:', parsed);
              }
            } catch (parseError) {
              console.warn('⚠️ Could not parse content:', parseError);
            }
            
            break;
          }
          
          if (result?.status === 'FAILED' || result?.error) {
            throw new Error(result?.error || 'Run failed');
          }
          
          // Esperar antes del siguiente poll
          await new Promise((r) => setTimeout(r, intervalMs));
        } catch (pollError) {
          console.error('Polling error:', pollError);
          if (pollError.message.includes('Run failed')) {
            throw pollError;
          }
        }
      }
      
      if (Date.now() - pollStart >= timeoutMs) {
        throw new Error('Research timed out after 10 minutes');
      }

      if (result?.data) {
        setResearchResults(result.data as DeepResearchResponse['data']);
        setIsComplete(true);
        setProgress(100);
        setCurrentStep(loadingSteps.length);
        setIsActuallyLoading(false);
        setVisibleCards([0, 1, 2, 3]);
        
        // Redirigir a resultados después de un delay para que se vea el contenido
        setTimeout(() => {
          navigate('/results', {
            state: { results: result.data, query }
          });
        }, 3000); // 3 segundos para ver el contenido
      } else {
        throw new Error('No data received from research');
      }
      
    } catch (err) {
      console.error('❌ Deep research error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete research';
      setError(errorMessage);
      setIsActuallyLoading(false);
    }
  };

  // Iniciar búsqueda cuando el componente se monta
  useEffect(() => {
    if (query && query.trim() !== "" && query !== "tu búsqueda") {
      startDeepResearch();
    }
  }, [query]);

  // Función para manejar el progreso REAL de Trigger.dev
  const handleRealtimeProgress = ({ percentage, step, message }: { 
    percentage?: number; 
    step?: number; 
    message?: string 
  }) => {
    console.log('📈 Real progress update:', { percentage, step, message });
    
    if (typeof percentage === 'number') {
      setProgress(percentage);
    }
    
    if (typeof step === 'number') {
      setCurrentStep(step);
      setVisibleCards((prev) => {
        const newVisible = Array.from(new Set([...prev, step]));
        return newVisible.sort((a, b) => a - b);
      });
    }
    
    if (message) {
      setCurrentMessage(message);
    }
  };

  // Lógica de las tarjetas basada en el progreso REAL
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
        return "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-0 hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 transition-all duration-700 animate-pulse transition-all duration-700";
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
    
    return "[grid-area:stack] opacity-0";
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

  // Manejo de errores
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
      <div className="w-full max-w-6xl space-y-8">
        {/* Realtime subscriber SOLO cuando hay runId y token */}
        {runId && publicToken && (
          <RealtimeRunSubscriber
            runId={runId}
            accessToken={publicToken}
            onProgress={handleRealtimeProgress}
          />
        )}
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Analizando "{query}"
          </h1>
          <p className="text-muted-foreground">
            {isActuallyLoading 
              ? "Ejecutando investigación profunda con IA..."
               : "Iniciando investigación..."
            }
          </p>
        </div>

        {/* Progress Bar - SOLO progreso real */}
        <div className="w-full space-y-2">
          <Progress
            value={progress}
            className="h-3 bg-muted"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{Math.round(progress)}% Completado</span>
            <span>
              {isComplete ? "Finalizado" : isActuallyLoading ? "Investigando..." : "Esperando..."}
            </span>
          </div>
        </div>

        {/* Stacked Cards Animation - basado en progreso real */}
        <div className="flex justify-center min-h-[400px] items-center">
          <DisplayCards cards={stackedCards} />
        </div>

        {/* Current Step Indicator - basado en progreso real */}
        <div className="text-center">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            {isActuallyLoading
              ? (currentMessage || (currentStep < loadingSteps.length ? loadingSteps[currentStep].label : "Ejecutando workflow de Trigger.dev..."))
              : currentStep < loadingSteps.length
                ? loadingSteps[currentStep].label
                : "Completado"
            }
          </Badge>
        </div>

        {/* CONTENIDO PARSEADO - RESTAURADO */}
        {showContent && parsedContent && (
          <div className="space-y-6">
            {/* Botón para mostrar/ocultar contenido */}
            <div className="text-center">
              <button
                onClick={() => setShowContent(!showContent)}
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                {showContent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showContent ? "Ocultar Análisis" : "Mostrar Análisis"}
              </button>
            </div>

            {/* Análisis Principal */}
            <div className="source-card">
              <h3 className="text-xl font-bold text-foreground mb-4">Análisis Principal</h3>
              <div className="text-foreground leading-relaxed">
                <Markdown content={parsedContent.abstract || "Análisis en progreso..."} />
              </div>
            </div>

            {/* Perspectivas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Perspectiva Izquierda */}
              <div className="source-card">
                <h4 className="text-lg font-semibold text-foreground mb-3 text-blue-600">
                  {parsedContent.perspectives?.left?.title || "Perspectiva Progresista"}
                </h4>
                <div className="text-foreground text-sm leading-relaxed">
                  <Markdown content={parsedContent.perspectives?.left?.summary || "Análisis en progreso..."} />
                </div>
                {parsedContent.perspectives?.left?.keywords && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {parsedContent.perspectives.left.keywords.map((keyword: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Perspectiva Centro */}
              <div className="source-card">
                <h4 className="text-lg font-semibold text-foreground mb-3 text-gray-600">
                  {parsedContent.perspectives?.center?.title || "Perspectiva Neutral"}
                </h4>
                <div className="text-foreground text-sm leading-relaxed">
                  <Markdown content={parsedContent.perspectives?.center?.summary || "Análisis en progreso..."} />
                </div>
                {parsedContent.perspectives?.center?.keywords && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {parsedContent.perspectives.center.keywords.map((keyword: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Perspectiva Derecha */}
              <div className="source-card">
                <h4 className="text-lg font-semibold text-foreground mb-3 text-red-600">
                  {parsedContent.perspectives?.right?.title || "Perspectiva Conservadora"}
                </h4>
                <div className="text-foreground text-sm leading-relaxed">
                  <Markdown content={parsedContent.perspectives?.right?.summary || "Análisis en progreso..."} />
                </div>
                {parsedContent.perspectives?.right?.keywords && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {parsedContent.perspectives.right.keywords.map((keyword: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fuentes */}
            {parsedContent.sources && parsedContent.sources.length > 0 && (
              <div className="source-card">
                <h4 className="text-lg font-semibold text-foreground mb-4">Fuentes Analizadas</h4>
                <div className="space-y-3">
                  {parsedContent.sources.map((source: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium text-foreground">{source.name}</h5>
                        <p className="text-sm text-muted-foreground">{source.url}</p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {source.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default NewsResearchLoading;