
import React from 'react';
import { Map, Globe, BarChart } from 'lucide-react';

const MapHeader = () => {
  return (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="space-y-6">
        <div className="flex items-center justify-center space-x-4">
          <div className="geometric-logo w-14 h-14 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-geometric-primary to-primary/80 rounded-asymmetric animate-geometric-float"></div>
            <div className="absolute inset-3 bg-white rounded-sm shadow-geometric flex items-center justify-center">
              <Map className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-foreground tracking-tight">
            <span className="bg-gradient-to-r from-primary via-geometric-primary to-primary bg-clip-text text-transparent">
              Mapa Interactivo
            </span>
          </h1>
        </div>
      </div>

      <div className="flex justify-center space-x-12 text-sm text-muted-foreground">
        <div className="flex items-center space-x-3 glass-geometric px-4 py-3 rounded-asymmetric">
          <Globe className="w-5 h-5 text-primary" />
          <span className="font-medium">19 países incluidos</span>
        </div>
        <div className="flex items-center space-x-3 glass-geometric px-4 py-3 rounded-asymmetric">
          <BarChart className="w-5 h-5 text-primary" />
          <span className="font-medium">Datos en tiempo real</span>
        </div>
      </div>
    </div>
  );
};

export default MapHeader;
