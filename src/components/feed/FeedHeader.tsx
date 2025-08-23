
import React from 'react';
import { Rss, Filter, TrendingUp } from 'lucide-react';

const FeedHeader = () => {
  return (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="space-y-6">
        <div className="flex items-center justify-center space-x-4">
          <div className="geometric-logo w-12 h-12 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-geometric-primary to-primary/80 animate-geometric-float rounded"></div>
            <div className="absolute inset-3 bg-white rounded-sm shadow-geometric flex items-center justify-center">
              <Rss className="w-5 h-5 text-primary animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-foreground tracking-tight">
            <span className="bg-gradient-to-r from-primary via-geometric-primary to-primary bg-clip-text text-transparent">
              Feed de Noticias
            </span>
          </h1>
        </div>
      </div>

      <div className="flex justify-center space-x-12 text-sm text-muted-foreground">
        <div className="flex items-center space-x-3 glass-geometric px-4 py-3 rounded-asymmetric">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span className="font-medium">Tiempo real</span>
        </div>
        <div className="flex items-center space-x-3 glass-geometric px-4 py-3 rounded-asymmetric">
          <Filter className="w-5 h-5 text-primary" />
          <span className="font-medium">Múltiples fuentes</span>
        </div>
        <div className="flex items-center space-x-3 glass-geometric px-4 py-3 rounded-asymmetric">
          <Rss className="w-5 h-5 text-primary" />
          <span className="font-medium">Feed personalizado</span>
        </div>
      </div>
    </div>
  );
};

export default FeedHeader;
