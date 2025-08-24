
import React from 'react';
import { cn } from '@/lib/utils';
import { Markdown } from '@/components/ui/markdown';

interface Perspective {
  title: string;
  summary: string;
  keywords: string[];
}

interface PerspectiveTabsProps {
  perspectives: {
    left: Perspective;
    center: Perspective;
    right: Perspective;
  };
  selectedPerspective: 'left' | 'center' | 'right';
  onPerspectiveChange: (perspective: 'left' | 'center' | 'right') => void;
}



const PerspectiveTabs = ({ 
  perspectives, 
  selectedPerspective, 
  onPerspectiveChange 
}: PerspectiveTabsProps) => {
  const tabs = [
    { key: 'left' as const, label: 'Perspectiva Izquierda', color: 'spectrum-left' },
    { key: 'center' as const, label: 'Perspectiva Centro', color: 'spectrum-center' },
    { key: 'right' as const, label: 'Perspectiva Derecha', color: 'spectrum-right' },
  ];

  const currentPerspective = perspectives[selectedPerspective];
  
  // DEBUG COMPLETO
  console.log('🎯 PerspectiveTabs DEBUG COMPLETO:', {
    receivedPerspectives: perspectives,
    selectedPerspective,
    hasOnPerspectiveChange: !!onPerspectiveChange,
    perspectivesKeys: perspectives ? Object.keys(perspectives) : [],
    leftData: perspectives?.left,
    centerData: perspectives?.center,
    rightData: perspectives?.right
  });

  // Debug logging for perspective content
  console.log('🎯 PerspectiveTabs DEBUG:', {
    selectedPerspective,
    currentPerspective: currentPerspective ? {
      title: currentPerspective.title,
      summaryLength: currentPerspective.summary?.length || 0,
      summaryPreview: currentPerspective.summary?.substring(0, 100) + '...',
      hasKeywords: !!currentPerspective.keywords?.length
    } : 'NULL',
    allPerspectives: {
      left: perspectives.left ? `${perspectives.left.summary?.length || 0} chars` : 'NULL',
      center: perspectives.center ? `${perspectives.center.summary?.length || 0} chars` : 'NULL',
      right: perspectives.right ? `${perspectives.right.summary?.length || 0} chars` : 'NULL'
    }
  });

  return (
    <div className="source-card animate-fade-in">
      <h3 className="text-xl font-bold text-foreground mb-6">Vista Comparativa 360°</h3>
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onPerspectiveChange(tab.key)}
            className={`perspective-tab ${
              selectedPerspective === tab.key ? 'active' : 'inactive'
            }`}
            style={{
              backgroundColor: selectedPerspective === tab.key 
                ? `hsl(var(--spectrum-${tab.color.split('-')[1]}))` 
                : 'transparent',
              color: selectedPerspective === tab.key 
                ? 'white' 
                : `hsl(var(--spectrum-${tab.color.split('-')[1]}))`
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de la perspectiva seleccionada */}
      <div className="animate-fade-in">
        {currentPerspective ? (
          <>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              {currentPerspective.title}
            </h4>
            
            {/* Renderizado de markdown mejorado */}
            <div className="text-foreground leading-relaxed mb-6">
              <Markdown 
                content={currentPerspective.summary} 
                className="prose prose-sm max-w-none"
              />
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No se encontró información para la perspectiva {selectedPerspective}.
            </p>
          </div>
        )}

        {/* Keywords destacadas */}
        {currentPerspective && currentPerspective.keywords && currentPerspective.keywords.length > 0 && (
          <div>
            <h5 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Palabras clave características
            </h5>
            <div className="flex flex-wrap gap-2">
              {currentPerspective.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                    selectedPerspective === 'left' 
                      ? 'bg-spectrum-left/10 text-spectrum-left border-spectrum-left/20'
                      : selectedPerspective === 'center'
                      ? 'bg-spectrum-center/10 text-spectrum-center border-spectrum-center/20'
                      : 'bg-spectrum-right/10 text-spectrum-right border-spectrum-right/20'
                  }`}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerspectiveTabs;
