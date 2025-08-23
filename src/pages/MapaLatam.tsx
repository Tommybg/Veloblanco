
import React, { useState } from 'react';
import MapHeader from '@/components/map/MapHeader';
import InteractiveMap3D from '@/components/map/InteractiveMap3D';
import CountryPanel from '@/components/map/CountryPanel';
import FilterFloatingMenu from '@/components/map/FilterFloatingMenu';

const MapaLatam = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  return (
    <div className="min-h-screen geometric-bg">
      {/* Floating geometric elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-geometric"></div>
        <div className="floating-geometric"></div>
        <div className="floating-geometric"></div>
        <div className="floating-geometric"></div>
      </div>
      
      {/* Parallax background */}
      <div className="parallax-bg"></div>
      
      <div className="relative z-10 py-4 pt-16">
        <div className="space-y-4">
          <MapHeader />
          
          {/* Full width map with floating filters */}
          <div className="px-4">
            <div className="relative">
              {/* Map takes full width */}
              <InteractiveMap3D 
                selectedCountry={selectedCountry} 
                onCountrySelect={setSelectedCountry} 
                category={selectedCategory} 
                period={selectedPeriod} 
              />
              
              {/* Floating filters positioned over the map */}
              <FilterFloatingMenu
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                className="absolute top-4 right-4 z-20"
              />
              
              {/* Country panel positioned as overlay when a country is selected */}
              {selectedCountry && (
                <div className="absolute top-4 left-4 z-20 max-w-sm">
                  <CountryPanel 
                    selectedCountry={selectedCountry} 
                    category={selectedCategory} 
                    period={selectedPeriod} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaLatam;
