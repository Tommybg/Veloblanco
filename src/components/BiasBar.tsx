import React from 'react';

interface BiasClassification {
  category: 'left' | 'center' | 'right';
  confidence: number;
  probabilities: {
    left: number;
    center: number;
    right: number;
  };
}

interface BiasBarProps {
  biasClassification: BiasClassification;
  compact?: boolean;
  className?: string;
}

interface CompactBiasBarProps {
  bias: 'left' | 'center' | 'right';
  confidence?: number;
  className?: string;
}

export const BiasBar: React.FC<BiasBarProps> = ({ 
  biasClassification, 
  compact = false, 
  className = "" 
}) => {
  const { category, confidence, probabilities } = biasClassification;

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return 'bg-spectrum-left';
      case 'center': return 'bg-spectrum-center';
      case 'right': return 'bg-spectrum-right';
      default: return 'bg-gray-400';
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

  if (compact) {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <div className={`w-3 h-3 rounded-full ${getBiasColor(category)}`} />
        <span className="text-xs font-medium text-gray-600">
          {getBiasLabel(category)} ({Math.round(confidence * 100)}%)
        </span>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Category and confidence */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {getBiasLabel(category)}
        </span>
        <span className="text-xs text-gray-500">
          {Math.round(confidence * 100)}% confianza
        </span>
      </div>

      {/* Probability distribution */}
      <div className="grid grid-cols-3 gap-1 h-4 rounded overflow-hidden bg-gray-100">
        <div 
          className="bg-spectrum-left transition-all duration-300"
          style={{ opacity: probabilities.left }}
          title={`Progresista: ${Math.round(probabilities.left * 100)}%`}
        />
        <div 
          className="bg-spectrum-center transition-all duration-300"
          style={{ opacity: probabilities.center }}
          title={`Neutral: ${Math.round(probabilities.center * 100)}%`}
        />
        <div 
          className="bg-spectrum-right transition-all duration-300"
          style={{ opacity: probabilities.right }}
          title={`Conservador: ${Math.round(probabilities.right * 100)}%`}
        />
      </div>

      {/* Labels */}
      <div className="grid grid-cols-3 gap-1 text-xs text-gray-500">
        <span className="text-center">{Math.round(probabilities.left * 100)}%</span>
        <span className="text-center">{Math.round(probabilities.center * 100)}%</span>
        <span className="text-center">{Math.round(probabilities.right * 100)}%</span>
      </div>
    </div>
  );
};

export const CompactBiasBar: React.FC<CompactBiasBarProps> = ({ 
  bias, 
  confidence = 0.5, 
  className = "" 
}) => {
  const getBiasColor = (biasType: string) => {
    switch (biasType) {
      case 'left': return 'bg-spectrum-left text-white';
      case 'center': return 'bg-spectrum-center text-white';
      case 'right': return 'bg-spectrum-right text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getBiasLabel = (biasType: string) => {
    switch (biasType) {
      case 'left': return 'P';  // Progresista
      case 'center': return 'N'; // Neutral
      case 'right': return 'C';  // Conservador
      default: return '?';
    }
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div 
        className={`
          w-6 h-6 rounded-full flex items-center justify-center 
          text-xs font-bold ${getBiasColor(bias)}
        `}
        title={`${bias === 'left' ? 'Progresista' : bias === 'center' ? 'Neutral' : 'Conservador'}: ${Math.round(confidence * 100)}%`}
      >
        {getBiasLabel(bias)}
      </div>
    </div>
  );
};
