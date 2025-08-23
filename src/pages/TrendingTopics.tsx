
import React, { useState } from 'react';
import TrendingHeader from '@/components/trending/TrendingHeader';
import TrendingFilters from '@/components/trending/TrendingFilters';
import TrendingGrid from '@/components/trending/TrendingGrid';

const TrendingTopics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [selectedCategory, setSelectedCategory] = useState('todos');
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
      
      <div className="relative z-10 space-y-3 py-3 pt-14">
        <TrendingHeader />
        
        <TrendingFilters
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
        />
        
        <TrendingGrid
          period={selectedPeriod}
          category={selectedCategory}
          country={selectedCountry}
        />
      </div>
    </div>
  );
};

export default TrendingTopics;
