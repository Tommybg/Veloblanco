
import React from 'react';
import { TrendingUp, Clock, Users, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendCardProps {
  topic: {
    id: number;
    title: string;
    category: string;
    country: string;
    trend: string;
    neutralityScore: number;
    sources: number;
    timeAgo: string;
    description: string;
    keywords: string[];
    spectrum: { left: number; center: number; right: number };
  };
  rank: number;
}

const TrendCard = ({ topic, rank }: TrendCardProps) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      'Política': 'bg-red-100 text-red-800',
      'Economía': 'bg-green-100 text-green-800',
      'Tecnología': 'bg-blue-100 text-blue-800',
      'Sociedad': 'bg-purple-100 text-purple-800',
      'Internacional': 'bg-yellow-100 text-yellow-800',
      'Deportes': 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getNeutralityColor = (score: number) => {
    if (score >= 75) return 'text-neutrality-high';
    if (score >= 50) return 'text-neutrality-medium';
    return 'text-neutrality-low';
  };

  return (
    <div className="source-card group cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-primary font-bold text-sm">
            #{rank}
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-600">{topic.trend}</span>
          </div>
        </div>
        
        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getCategoryColor(topic.category))}>
          {topic.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
        {topic.title}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
        {topic.description}
      </p>

      {/* Spectrum Visualization */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Izquierda</span>
          <span>Centro</span>
          <span>Derecha</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden flex">
          <div className="bg-spectrum-left transition-all duration-300" style={{ width: `${topic.spectrum.left}%` }} />
          <div className="bg-spectrum-center transition-all duration-300" style={{ width: `${topic.spectrum.center}%` }} />
          <div className="bg-spectrum-right transition-all duration-300" style={{ width: `${topic.spectrum.right}%` }} />
        </div>
      </div>

      {/* Keywords */}
      <div className="flex flex-wrap gap-1 mb-4">
        {topic.keywords.slice(0, 3).map((keyword, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-accent/50 text-accent-foreground text-xs rounded-md"
          >
            {keyword}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{topic.sources} fuentes</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{topic.timeAgo}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Target className={cn("w-3 h-3", getNeutralityColor(topic.neutralityScore))} />
          <span className={cn("text-xs font-medium", getNeutralityColor(topic.neutralityScore))}>
            {topic.neutralityScore}% neutral
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrendCard;
