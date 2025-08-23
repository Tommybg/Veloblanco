
import React, { useState } from 'react';
import MediosHeader from '@/components/medios/MediosHeader';
import MediosFilters from '@/components/medios/MediosFilters';
import MediosGrid from '@/components/medios/MediosGrid';
import SourcePanel from '@/components/medios/SourcePanel';

const Medios = () => {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedBias, setSelectedBias] = useState('todos');
  const [selectedCredibility, setSelectedCredibility] = useState('todos');
  const [selectedCountry, setSelectedCountry] = useState('todos');

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
      
      <div className="relative z-10 space-y-6 py-8">
        <MediosHeader />
        
        <MediosFilters
          selectedBias={selectedBias}
          onBiasChange={setSelectedBias}
          selectedCredibility={selectedCredibility}
          onCredibilityChange={setSelectedCredibility}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
        />
        
        <div className={selectedSource ? "grid grid-cols-1 lg:grid-cols-3 gap-8 px-4" : "px-4"}>
          <div className={selectedSource ? "lg:col-span-2" : ""}>
            <MediosGrid
              selectedSource={selectedSource}
              onSourceSelect={setSelectedSource}
              bias={selectedBias}
              credibility={selectedCredibility}
              country={selectedCountry}
            />
          </div>
          
          {selectedSource && (
            <div className="lg:col-span-1">
              <SourcePanel
                selectedSource={selectedSource}
                bias={selectedBias}
                credibility={selectedCredibility}
                country={selectedCountry}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Medios;
