
import React from 'react';
import { cn } from '@/lib/utils';

interface LatamMapProps {
  selectedCountry: string | null;
  onCountrySelect: (country: string | null) => void;
  category: string;
  period: string;
}

const LatamMap = ({ selectedCountry, onCountrySelect, category, period }: LatamMapProps) => {
  const countries = [
    { id: 'mexico', name: 'México', activity: 85, position: { top: '15%', left: '25%' } },
    { id: 'guatemala', name: 'Guatemala', activity: 45, position: { top: '25%', left: '28%' } },
    { id: 'colombia', name: 'Colombia', activity: 78, position: { top: '35%', left: '32%' } },
    { id: 'venezuela', name: 'Venezuela', activity: 92, position: { top: '30%', left: '38%' } },
    { id: 'brasil', name: 'Brasil', activity: 88, position: { top: '45%', left: '45%' } },
    { id: 'peru', name: 'Perú', activity: 72, position: { top: '50%', left: '35%' } },
    { id: 'bolivia', name: 'Bolivia', activity: 58, position: { top: '55%', left: '40%' } },
    { id: 'ecuador', name: 'Ecuador', activity: 65, position: { top: '42%', left: '32%' } },
    { id: 'chile', name: 'Chile', activity: 75, position: { top: '70%', left: '35%' } },
    { id: 'argentina', name: 'Argentina', activity: 82, position: { top: '75%', left: '40%' } },
    { id: 'uruguay', name: 'Uruguay', activity: 68, position: { top: '78%', left: '44%' } },
    { id: 'paraguay', name: 'Paraguay', activity: 52, position: { top: '65%', left: '42%' } },
  ];

  const getActivityColor = (activity: number) => {
    if (activity >= 80) return 'bg-red-500 border-red-600';
    if (activity >= 60) return 'bg-yellow-500 border-yellow-600';
    return 'bg-green-500 border-green-600';
  };

  const getActivitySize = (activity: number) => {
    if (activity >= 80) return 'w-6 h-6';
    if (activity >= 60) return 'w-5 h-5';
    return 'w-4 h-4';
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-8">
      <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden" 
           style={{ height: '600px', backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 20 0 L 0 0 0 20" fill="none" stroke="%23e2e8f0" stroke-width="1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23grid)" /%3E%3C/svg%3E")' }}>
        
        {/* Map Title */}
        <div className="absolute top-4 left-4 bg-white/90 rounded-lg p-3 backdrop-blur-sm">
          <h3 className="font-semibold text-foreground">América Latina</h3>
          <p className="text-sm text-muted-foreground">Actividad de noticias por país</p>
        </div>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-3 backdrop-blur-sm">
          <h4 className="font-medium text-foreground mb-2">Actividad</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Alta (80%+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Media (60-79%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Baja (0-59%)</span>
            </div>
          </div>
        </div>

        {/* Countries */}
        {countries.map((country) => (
          <button
            key={country.id}
            onClick={() => onCountrySelect(country.id === selectedCountry ? null : country.id)}
            className={cn(
              "absolute rounded-full border-2 transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              getActivityColor(country.activity),
              getActivitySize(country.activity),
              selectedCountry === country.id && "ring-2 ring-primary scale-125"
            )}
            style={country.position}
            title={`${country.name}: ${country.activity}% de actividad`}
          >
            <span className="sr-only">{country.name}</span>
          </button>
        ))}

        {/* Country Labels */}
        {countries.map((country) => (
          <div
            key={`label-${country.id}`}
            className={cn(
              "absolute text-xs font-medium text-gray-700 pointer-events-none transition-all duration-200",
              selectedCountry === country.id && "text-primary font-semibold"
            )}
            style={{
              top: `calc(${country.position.top} + 30px)`,
              left: country.position.left,
              transform: 'translateX(-50%)'
            }}
          >
            {country.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatamMap;
