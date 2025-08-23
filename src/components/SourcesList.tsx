
import { ExternalLink, Star, Info } from 'lucide-react';
import { useState } from 'react';

interface ParsedSource {
  name: string;
  url: string;
  category: string;
  stance?: string;
  rating?: number;
}

interface SourcesListProps {
  sources?: ParsedSource[];
}

const SourcesList = ({ sources }: SourcesListProps) => {
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const [showAllSources, setShowAllSources] = useState(false);

  const fallbackSources = [
    {
      id: '1',
      name: 'Semana',
      logo: '📰',
      bias: 'center',
      reliability: 4.1,
      ownership: 'Grupo Semana S.A.',
      funding: 'Suscripciones digitales y publicidad empresarial',
      url: 'https://www.semana.com/cambio-climatico-colombia',
      snippet: 'El cambio climático en Colombia requiere políticas integradas de adaptación...'
    },
    {
      id: '2',
      name: 'El Tiempo',
      logo: '🇨🇴',
      bias: 'center',
      reliability: 4.0,
      ownership: 'Casa Editorial El Tiempo (CEET)',
      funding: 'Suscripciones digitales y publicidad nacional',
      url: 'https://www.eltiempo.com/medio-ambiente',
      snippet: 'Los efectos del cambio climático se intensifican en el territorio nacional...'
    },
    {
      id: '3',
      name: 'El Espectador',
      logo: '📖',
      bias: 'left',
      reliability: 4.3,
      ownership: 'Fideicomiso El Espectador',
      funding: 'Suscripciones, publicidad y donaciones',
      url: 'https://www.elespectador.com/ambiente',
      snippet: 'La crisis climática exige transformaciones urgentes en Colombia...'
    },
    {
      id: '4',
      name: 'La República',
      logo: '💼',
      bias: 'center',
      reliability: 4.2,
      ownership: 'Grupo La República',
      funding: 'Suscripciones empresariales y publicidad financiera',
      url: 'https://www.larepublica.co/economia-verde',
      snippet: 'La transición energética representa oportunidades económicas para Colombia...'
    }
  ];

  const normalizeFromParsedSources = (items: ParsedSource[]) => {
    return items.map((item, index) => {
      const url = item.url;
      const name = item.name || new URL(url).hostname.replace('www.', '');
      const logo = '📰';
      const snippet = 'Análisis de fuente verificada';
      
      // Map category to bias
      let bias = 'center';
      switch (item.category.toLowerCase()) {
        case 'left':
          bias = 'left';
          break;
        case 'right':
          bias = 'right';
          break;
        default:
          bias = 'center';
      }
      
      return {
        id: String(index + 1),
        name,
        logo,
        bias,
        reliability: item.rating || 4.0,
        ownership: '',
        funding: '',
        url,
        snippet,
      };
    });
  };

  const displaySources = Array.isArray(sources) && sources.length > 0
    ? normalizeFromParsedSources(sources)
    : fallbackSources;

  // Show only first 7 sources initially, or all if expanded
  const visibleSources = showAllSources ? displaySources : displaySources.slice(0, 7);

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return 'text-spectrum-left bg-spectrum-left/10 border-spectrum-left/20';
      case 'center': return 'text-spectrum-center bg-spectrum-center/10 border-spectrum-center/20';
      case 'right': return 'text-spectrum-right bg-spectrum-right/10 border-spectrum-right/20';
      default: return 'text-foreground bg-muted border-border';
    }
  };

  const getBiasLabel = (bias: string) => {
    switch (bias) {
      case 'left': return 'Progresista';
      case 'center': return 'Neutral';
      case 'right': return 'Conservador';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="source-card animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Fuentes Analizadas</h3>
        <div className="text-sm text-muted-foreground">
          {displaySources.length} fuentes
        </div>
      </div>

      <div className="space-y-4">
        {visibleSources.map((source) => (
          <div key={source.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{source.logo}</div>
                <div>
                  <h4 className="font-semibold text-foreground">{source.name}</h4>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getBiasColor(source.bias)}`}>
                    {getBiasLabel(source.bias)}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setExpandedSource(expandedSource === source.id ? null : source.id)}
                  className="p-1 hover:bg-accent rounded transition-colors"
                >
                  <Info className="w-4 h-4 text-muted-foreground" />
                </button>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-accent rounded transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{source.reliability}/5</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {source.snippet}
            </p>

            {expandedSource === source.id && (
              <div className="pt-3 border-t border-border space-y-2 text-xs text-muted-foreground">
                {source.ownership && (
                  <div className="flex justify-between">
                    <span>Propiedad:</span>
                    <span className="font-medium">{source.ownership}</span>
                  </div>
                )}
                {source.funding && (
                  <div className="flex justify-between">
                    <span>Financiamiento:</span>
                    <span className="font-medium">{source.funding}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {/* Botón para mostrar más fuentes */}
        {displaySources.length > 7 && (
          <div className="pt-4 text-center">
            <button
              onClick={() => setShowAllSources(!showAllSources)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              {showAllSources ? 'Mostrar menos' : `Ver ${displaySources.length - 7} fuentes más`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SourcesList;
