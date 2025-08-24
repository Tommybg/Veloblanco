import { useState, useMemo } from 'react';
import { Calendar, Shield, Users, ExternalLink, Info, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SpectrumVisualization from './SpectrumVisualization';
import PerspectiveTabs from './PerspectiveTabs';
import SourcesList from './SourcesList';
import type { SearchResult, ResearchResults } from '@/types/research';
import { parseDeepResearchResponse } from '@/utils/deepResearchParser';
import { Markdown } from '@/components/ui/markdown';
import { useNavigate } from 'react-router-dom';
import { startResearchRun } from '@/api/deep-research';


interface ResultsDashboardProps {
  query: string;
  onNewSearch: () => void;
  results: ResearchResults;
  selectedPerspective?: 'left' | 'center' | 'right';
  onPerspectiveChange?: (perspective: 'left' | 'center' | 'right') => void;
}

const ResultsDashboard = ({
  query,
  onNewSearch,
  results,
  selectedPerspective: externalSelectedPerspective,
  onPerspectiveChange: externalOnPerspectiveChange,
}: ResultsDashboardProps) => {
  // Usar props externas si están disponibles, sino usar estado interno
  const [internalSelectedPerspective, setInternalSelectedPerspective] = useState<'left' | 'center' | 'right'>('center');
  
  const selectedPerspective = externalSelectedPerspective || internalSelectedPerspective;
  const setSelectedPerspective = externalOnPerspectiveChange || setInternalSelectedPerspective;
  
  const [searchQuery, setSearchQuery] = useState(query);
  const navigate = useNavigate();


  // Parse the deep research response with error handling
  const parsedData = useMemo(() => {
    try {
      const parsed = parseDeepResearchResponse(results.answer);
      
      // If we have sources with bias analysis, use those instead of parsed sources
      if (results.sourcesWithBias && results.sourcesWithBias.length > 0) {
        parsed.sources = results.sourcesWithBias.map(s => ({
          name: s.title || 'Fuente',
          url: s.url,
          category: s.biasClassification ? s.biasClassification.fusedResult.category : 'center',
          rating: 4.0
        }));
      } else if ((!parsed.sources || parsed.sources.length === 0) && Array.isArray(results.sources) && results.sources.length > 0) {
        // Fallback: map plain search results when references parsing didn't yield sources
        parsed.sources = results.sources.map((s, index) => ({
          name: s.title || new URL(s.url).hostname.replace('www.', ''),
          url: s.url,
          category: 'center',
          rating: 4.0,
        }));
      }
      
      return parsed;
    } catch (error) {
      console.error('Error parsing deep research response:', error);
      // Return fallback data if parsing fails
      return {
        title: query,
        abstract: results.answer,
        neutralityScore: results.neutralityScore,
        ideologicalDistribution: results.ideologicalDistribution,
        sources: (results.sourcesWithBias || results.sources).map(s => {
          // Use bias classification if available
          let category = 'center';
          if (s.biasClassification) {
            category = s.biasClassification.fusedResult.category;
          }
          
          return {
            name: s.title || 'Fuente',
            url: s.url,
            category: category,
            rating: 4.0
          };
        }),
        perspectives: {
          left: {
            title: "Perspectiva Progresista",
            summary: "Análisis desde una perspectiva progresista.",
            keywords: ["progresista", "análisis"]
          },
          center: {
            title: "Perspectiva Neutral",
            summary: "Análisis neutral basado en evidencia.",
            keywords: ["neutral", "evidencia"]
          },
          right: {
            title: "Perspectiva Conservadora",
            summary: "Análisis desde una perspectiva conservadora.",
            keywords: ["conservador", "análisis"]
          }
        },
        transparency: {
          sourcesProcessed: results.transparency.sourcesProcessed,
          analysisTime: results.transparency.analysisTime,
          sourceBreakdown: results.transparency.sourceBreakdown
        }
      };
    }
  }, [results.answer, results.neutralityScore, results.ideologicalDistribution, results.sources, results.transparency, query]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      console.log('New search:', searchQuery);
      
      try {
        // Iniciar nueva búsqueda
        const started = await startResearchRun(searchQuery.trim());
        
        if (started.publicAccessToken) {
          // Navegar a la página de loading
          navigate('/research-loading', { 
            state: { query: searchQuery.trim() } 
          });
        } else {
          console.error('No public access token available');
        }
      } catch (error) {
        console.error('Error starting new search:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Use parsed data for analysis, fallback to original data if needed
  const analysisData = {
    summary: results.answer || parsedData.perspectives?.center?.summary || parsedData.abstract || "Sin análisis disponible",
    neutralityScore: parsedData.neutralityScore || results.neutralityScore,
    sourcesCount: parsedData.sources.length || results.sources?.length || 0,
    lastUpdated: new Date().toISOString().slice(0, 10),
    distribution: parsedData.ideologicalDistribution || results.ideologicalDistribution,
  };

  // Debug temporal
  console.log('Analysis data:', {
    resultsAnswer: results.answer,
    finalSummary: analysisData.summary
  });

  // Use parsed transparency data, fallback to original if needed
  const transparencyData = {
    sourcesProcessed: parsedData.transparency?.sourcesProcessed || results.transparency?.sourcesProcessed || 0,
    analysisTime: parsedData.transparency?.analysisTime || results.transparency?.analysisTime || 0,
    sourceBreakdown: {
      newsOutlets: parsedData.transparency?.sourceBreakdown?.newsOutlets || results.transparency?.sourceBreakdown?.newsOutlets || 0,
      academic: parsedData.transparency?.sourceBreakdown?.academic || results.transparency?.sourceBreakdown?.academic || 0,
      government: parsedData.transparency?.sourceBreakdown?.government || results.transparency?.sourceBreakdown?.government || 0,
      other: parsedData.transparency?.sourceBreakdown?.other || results.transparency?.sourceBreakdown?.other || 0,
    }
  };

  // Construir las perspectivas desde los campos de la base de datos
  const buildPerspectives = () => {
    // Primero intentar usar los datos de Supabase
    if (results.perspectiveLeftSummary || results.perspectiveCenterSummary || results.perspectiveRightSummary) {
      return {
        left: {
          title: "Perspectiva Izquierda",
          summary: results.perspectiveLeftSummary || "Sin análisis disponible",
          keywords: results.perspectiveLeftKeywords || []
        },
        center: {
          title: "Perspectiva Centro", 
          summary: results.perspectiveCenterSummary || "Sin análisis disponible",
          keywords: results.perspectiveCenterKeywords || []
        },
        right: {
          title: "Perspectiva Derecha",
          summary: results.perspectiveRightSummary || "Sin análisis disponible", 
          keywords: results.perspectiveRightKeywords || []
        }
      };
    }
    
    // Fallback a los datos parsedData si existen
    if (parsedData.perspectives) {
      return parsedData.perspectives;
    }
    
    // Fallback por defecto
    return {
      left: {
        title: "Perspectiva Izquierda",
        summary: "Sin análisis disponible para la perspectiva izquierda",
        keywords: []
      },
      center: {
        title: "Perspectiva Centro",
        summary: "Sin análisis disponible para la perspectiva centro", 
        keywords: []
      },
      right: {
        title: "Perspectiva Derecha",
        summary: "Sin análisis disponible para la perspectiva derecha",
        keywords: []
      }
    };
  };

  // Agregar esto antes del return para debug
  console.log('🔍 ResultsDashboard DEBUG:', {
    results: {
      hasPerspectiveLeft: !!results.perspectiveLeftSummary,
      hasPerspectiveCenter: !!results.perspectiveCenterSummary,
      hasPerspectiveRight: !!results.perspectiveRightSummary,
      perspectiveLeftPreview: results.perspectiveLeftSummary?.substring(0, 100),
      perspectiveCenterPreview: results.perspectiveCenterSummary?.substring(0, 100),
      perspectiveRightPreview: results.perspectiveRightSummary?.substring(0, 100)
    },
    buildPerspectivesResult: buildPerspectives()
  });

  // DEBUG COMPLETO - Agregar esto justo antes del return
  console.log('🔍 DEBUG COMPLETO ResultsDashboard:', {
    // Verificar que results tenga los campos de perspectivas
    results: {
      hasPerspectiveLeft: !!results.perspectiveLeftSummary,
      hasPerspectiveCenter: !!results.perspectiveCenterSummary,
      hasPerspectiveRight: !!results.perspectiveRightSummary,
      perspectiveLeftPreview: results.perspectiveLeftSummary?.substring(0, 100),
      perspectiveCenterPreview: results.perspectiveCenterSummary?.substring(0, 100),
      perspectiveRightPreview: results.perspectiveRightSummary?.substring(0, 100)
    },
    
    // Verificar que buildPerspectives funcione
    buildPerspectivesResult: buildPerspectives(),
    
    // Verificar que parsedData tenga perspectivas
    parsedData: {
      hasPerspectives: !!parsedData.perspectives,
      perspectivesKeys: parsedData.perspectives ? Object.keys(parsedData.perspectives) : [],
      leftSummary: parsedData.perspectives?.left?.summary?.substring(0, 100),
      centerSummary: parsedData.perspectives?.center?.summary?.substring(0, 100),
      rightSummary: parsedData.perspectives?.right?.summary?.substring(0, 100)
    },
    
    // Verificar que selectedPerspective esté definido
    selectedPerspective,
    
    // Verificar que onPerspectiveChange esté definido
    hasOnPerspectiveChange: !!externalOnPerspectiveChange
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/30">
      {/* Header compacto */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={onNewSearch} className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
              Velo<span className="text-primary">blanco</span>
            </button>
            
            {/* Centered search bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar nuevo tema..." 
                  className="w-full pl-4 pr-12 py-2 text-sm border border-border rounded-lg bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  onKeyPress={handleKeyPress} 
                />
                <Button onClick={handleSearch} className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0" size="sm">
                  <Search className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Eliminar o comentar estas líneas: */}
              {/* <span className="text-sm text-muted-foreground">
                Analizando: <span className="font-semibold text-foreground">"{parsedData.title}"</span>
              </span> */}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel principal de resumen */}
          <div className="lg:col-span-2 space-y-8">
            {/* Resumen neutral */}
            <div className="summary-card animate-fade-in">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Análisis Neutral</h2>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {analysisData.sourcesCount} fuentes
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(analysisData.lastUpdated).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-neutrality-high">
                    {analysisData.neutralityScore}%
                  </div>
                  <div className="text-sm text-muted-foreground">Neutralidad</div>
                </div>
              </div>
              
                              <div className="text-foreground leading-relaxed mb-6">
                  <Markdown content={analysisData.summary} />
                </div>

              <div className="bg-white/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Nivel de Neutralidad</span>
                  <span className="text-sm text-neutrality-high font-semibold">
                    {analysisData.neutralityScore >= 80 ? 'Alto' : 
                     analysisData.neutralityScore >= 60 ? 'Medio' : 'Bajo'}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-neutrality-high h-2 rounded-full transition-all duration-700 ease-out" 
                    style={{
                      width: `${analysisData.neutralityScore}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Espectro ideológico */}
            <SpectrumVisualization 
              distribution={analysisData.distribution} 
              neutralityScore={analysisData.neutralityScore}
              sources={parsedData.sources}
            />

            {/* Vista comparativa 360° */}
            <PerspectiveTabs 
              perspectives={buildPerspectives()} 
              selectedPerspective={selectedPerspective} 
              onPerspectiveChange={setSelectedPerspective} 
            />
          </div>

          {/* Sidebar con fuentes */}
          <div className="space-y-6">
            {/* Debug: Log data being passed to SourcesList */}
            {(() => {
              console.log('ResultsDashboard data:', {
                parsedSources: parsedData.sources?.length || 0,
                sourcesWithBias: results.sourcesWithBias?.length || 0,
                sourcesWithBiasData: results.sourcesWithBias
              });
              return null;
            })()}
            
            {/* Panel de transparencia - MOVIDO ARRIBA */}
            <div className="source-card">
              <div className="flex items-center mb-4">
                <Shield className="w-5 h-5 text-primary mr-2" />
                <h3 className="font-semibold text-foreground">Transparencia</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Artículos procesados:</span>
                  <span className="font-medium">{transparencyData.sourcesProcessed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tiempo de análisis:</span>
                  <span className="font-medium">{transparencyData.analysisTime}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Medios de comunicación:</span>
                  <span className="font-medium">{transparencyData.sourceBreakdown.newsOutlets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fuentes académicas:</span>
                  <span className="font-medium">{transparencyData.sourceBreakdown.academic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fuentes gubernamentales:</span>
                  <span className="font-medium">{transparencyData.sourceBreakdown.government}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Otras fuentes:</span>
                  <span className="font-medium">{transparencyData.sourceBreakdown.other}</span>
                </div>
              </div>
            </div>
            
            {/* Fuentes - MOVIDO ABAJO */}
            <SourcesList 
              sources={parsedData.sources} 
              searchResults={results.sourcesWithBias || undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;