
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { startResearchRun } from '@/api/deep-research';

interface SearchHeaderProps {
  onSearch?: (query: string) => void;
}

const SearchHeader = ({ onSearch }: SearchHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const popularSearches = ["Elecciones Argentina 2024", "Inflación México", "Reforma tributaria Colombia", "Crisis energética Venezuela"];

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      
      try {
        // Iniciar la búsqueda automáticamente
        const started = await startResearchRun(searchQuery.trim());
        
        if (started.publicAccessToken) {
          // Navegar a la página de loading
          navigate('/research-loading', { 
            state: { query: searchQuery.trim() } 
          });
        } else {
          console.error('No public access token available');
        }
      } catch (error) {
        console.error('Error starting research:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePopularSearch = async (search: string) => {
    setSearchQuery(search);
    
    try {
      // Iniciar la búsqueda automáticamente
      const started = await startResearchRun(search);
      
      if (started.publicAccessToken) {
        // Navegar a la página de loading
        navigate('/research-loading', { 
          state: { query: search } 
        });
      } else {
        console.error('No public access token available');
      }
    } catch (error) {
      console.error('Error starting research:', error);
    }
  };

  return (
    <div className="relative min-h-screen geometric-bg overflow-hidden">
      {/* Parallax background */}
      <div className="parallax-bg"></div>
      
      {/* Floating geometric elements */}
      <div className="floating-geometric"></div>
      <div className="floating-geometric"></div>
      <div className="floating-geometric"></div>
      <div className="floating-geometric"></div>

      {/* Main Content - Enhanced geometric layout */}
      <div className="flex items-center justify-center min-h-screen -mt-16">
        <div className="text-center space-y-12 max-w-5xl mx-auto px-4 relative">
          {/* Enhanced Hero Section */}
          <div className="space-y-8 relative">
            <h1 className="text-6xl font-black text-foreground mb-8 relative">
              <span className="bg-gradient-to-r from-foreground via-geometric-accent to-foreground bg-clip-text text-transparent">
                Velo
              </span>
              <span className="bg-gradient-to-r from-primary via-geometric-primary to-primary bg-clip-text text-transparent">
                blanco
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-geometric-primary rounded-full opacity-60"></div>
            </h1>
            
            <p className="text-xl font-light text-muted-foreground max-w-4xl mx-auto leading-relaxed tracking-wide">
              Te ayudamos a combatir la <span className="font-semibold text-geometric-accent">desinformación</span> y <span className="font-semibold text-geometric-accent">polarización</span>. 
              <br />
              Busca y obtén una visión <span className="font-semibold text-primary">completa y balanceada</span> de cualquier tema de actualidad.
            </p>
          </div>

          {/* Enhanced Search Section */}
          <div className="search-container relative">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-geometric-primary to-primary rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Busca cualquier tema para obtener un análisis neutral..." 
                  className="search-input glass-geometric hover:bg-white/90 focus:bg-white/95" 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  onKeyPress={handleKeyPress} 
                />
                <Button onClick={handleSearch} className="search-button group-hover:animate-pulse" size="lg">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Popular Searches */}
          <div className="space-y-6 relative">
            <p className="text-sm text-muted-foreground font-medium tracking-wide">
              Búsquedas populares:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {popularSearches.map((search, index) => (
                <button 
                  key={index} 
                  onClick={() => handlePopularSearch(search)} 
                  className="px-5 py-3 bg-geometric-surface/80 backdrop-blur-sm hover:bg-geometric-surface border border-geometric-secondary text-geometric-accent rounded-asymmetric text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-geometric hover:animate-skew-hover group"
                >
                  <span className="group-hover:font-semibold transition-all duration-200">
                    {search}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Geometric accent elements */}
          <div className="absolute top-8 left-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl animate-geometric-float"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-geometric-accent/5 to-transparent rounded-full blur-3xl animate-geometric-float" style={{ animationDelay: '3s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
