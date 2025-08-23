
import React from 'react';
import { Heart, MessageCircle, Share2, Clock, Dot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    content: string;
    source: string;
    timestamp: string;
    category: string;
    image?: string;
    likes: number;
    shares: number;
    comments: number;
    bias: 'left' | 'center' | 'right';
  };
}

const NewsCard = ({ news }: NewsCardProps) => {
  const getBiasColor = (bias: string) => {
    const colors = {
      'left': 'bg-blue-100 text-blue-800',
      'center': 'bg-gray-100 text-gray-800',
      'right': 'bg-red-100 text-red-800',
    };
    return colors[bias as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

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

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays}d`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {news.source.charAt(0)}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{news.source}</h4>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              <span>{formatTimeAgo(news.timestamp)}</span>
              <Dot className="w-3 h-3" />
              <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getCategoryColor(news.category))}>
                {news.category}
              </span>
            </div>
          </div>
        </div>
        
        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getBiasColor(news.bias))}>
          {news.bias === 'left' ? 'Izquierda' : news.bias === 'center' ? 'Centro' : 'Derecha'}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-foreground line-clamp-2 hover:text-primary transition-colors">
          {news.title}
        </h2>
        
        <p className="text-muted-foreground line-clamp-3">
          {news.content}
        </p>
        
        {news.image && (
          <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
            <img 
              src={news.image} 
              alt="Imagen de la noticia"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-muted-foreground hover:text-red-500 transition-colors group">
            <Heart className="w-4 h-4 group-hover:fill-current" />
            <span className="text-sm">{news.likes}</span>
          </button>
          
          <button className="flex items-center space-x-2 text-muted-foreground hover:text-blue-500 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{news.comments}</span>
          </button>
          
          <button className="flex items-center space-x-2 text-muted-foreground hover:text-green-500 transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="text-sm">{news.shares}</span>
          </button>
        </div>
        
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          Leer más
        </button>
      </div>
    </div>
  );
};

export default NewsCard;
