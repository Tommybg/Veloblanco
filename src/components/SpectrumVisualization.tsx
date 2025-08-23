
import { useState } from 'react';

interface ParsedSource {
  name: string;
  url: string;
  category: string;
  stance?: string;
  rating?: number;
}

interface SpectrumVisualizationProps {
  distribution: {
    left: number;
    center: number;
    right: number;
  };
  neutralityScore: number;
  sources: ParsedSource[];
}

const SpectrumVisualization = ({ distribution, neutralityScore, sources }: SpectrumVisualizationProps) => {
  const [hoveredSource, setHoveredSource] = useState<string | null>(null);

  // Map parsed sources to spectrum positions
  const mappedSources = sources.map((source, index) => {
    let position = 50; // Default center
    let bias = 'center';
    
    // Map category to position
    switch (source.category.toLowerCase()) {
      case 'left':
        // Distribute left sources between 15-35%
        position = 15 + ((index % 5) * 4); // 15, 19, 23, 27, 31, 35, etc.
        bias = 'left';
        break;
      case 'center':
        // Distribute center sources between 40-60%
        position = 40 + ((index % 6) * 3.33); // 40, 43.33, 46.66, 50, 53.33, 56.66, 60
        bias = 'center';
        break;
      case 'right':
        // Distribute right sources between 65-85%
        position = 65 + ((index % 5) * 4); // 65, 69, 73, 77, 81, 85, etc.
        bias = 'right';
        break;
      default:
        position = 50;
        bias = 'center';
    }
    
    return {
      id: String(index + 1),
      name: source.name,
      position,
      bias,
      reliability: source.rating || 4.0,
    };
  });

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return 'text-spectrum-left';
      case 'center': return 'text-spectrum-center';
      case 'right': return 'text-spectrum-right';
      default: return 'text-foreground';
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
        <h3 className="text-xl font-bold text-foreground">Espectro Ideológico</h3>
        <div className="text-sm text-muted-foreground">
          Distribución de {sources.length} fuentes
        </div>
      </div>

      {/* Neutrality Score */}
      <div className="mb-6 p-4 bg-white/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Puntuación de Neutralidad</span>
          <span className="text-lg font-bold text-neutrality-high">{neutralityScore}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-neutrality-high h-3 rounded-full transition-all duration-700 ease-out" 
            style={{ width: `${neutralityScore}%` }}
          ></div>
        </div>
      </div>

      {/* Gráfico de barras de distribución */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className="text-spectrum-left">Progresista</span>
          <span className="text-spectrum-center">Neutral</span>
          <span className="text-spectrum-right">Conservador</span>
        </div>
        <div className="grid grid-cols-3 gap-1 h-6 rounded-lg overflow-hidden">
          <div 
            className="bg-spectrum-left transition-all duration-700 ease-out flex items-center justify-center"
            style={{ height: `${Math.max(distribution.left / 50 * 100, 20)}%` }}
          >
            <span className="text-white text-xs font-semibold">{distribution.left}%</span>
          </div>
          <div 
            className="bg-spectrum-center transition-all duration-700 ease-out flex items-center justify-center"
            style={{ height: `${Math.max(distribution.center / 50 * 100, 20)}%` }}
          >
            <span className="text-white text-xs font-semibold">{distribution.center}%</span>
          </div>
          <div 
            className="bg-spectrum-right transition-all duration-700 ease-out flex items-center justify-center"
            style={{ height: `${Math.max(distribution.right / 50 * 100, 20)}%` }}
          >
            <span className="text-white text-xs font-semibold">{distribution.right}%</span>
          </div>
        </div>
      </div>

      {/* Visualización del espectro */}
      <div className="relative">
        <div className="spectrum-bar mb-4">
          {mappedSources.map((source) => (
            <div
              key={source.id}
              className="absolute top-0 w-3 h-3 bg-white border-2 border-foreground rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-all duration-200 shadow-lg"
              style={{ left: `${source.position}%`, top: '50%' }}
              onMouseEnter={() => setHoveredSource(source.id)}
              onMouseLeave={() => setHoveredSource(null)}
            />
          ))}
        </div>

        {/* Labels del espectro */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Izquierda</span>
          <span>Centro</span>
          <span>Derecha</span>
        </div>
        
        {/* Contador de fuentes por sección */}
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{mappedSources.filter(s => s.bias === 'left').length} fuentes</span>
          <span>{mappedSources.filter(s => s.bias === 'center').length} fuentes</span>
          <span>{mappedSources.filter(s => s.bias === 'right').length} fuentes</span>
        </div>

        {/* Tooltip para fuentes */}
        {hoveredSource && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
            {mappedSources.find(s => s.id === hoveredSource)?.name}
          </div>
        )}
      </div>


    </div>
  );
};

export default SpectrumVisualization;
