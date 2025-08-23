
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TrendingFiltersProps {
  selectedPeriod: string;
  onPeriodChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedCountry: string;
  onCountryChange: (value: string) => void;
}

const TrendingFilters = ({
  selectedPeriod,
  onPeriodChange,
  selectedCategory,
  onCategoryChange,
  selectedCountry,
  onCountryChange,
}: TrendingFiltersProps) => {
  const periods = [
    { value: '1h', label: 'Última hora' },
    { value: '24h', label: 'Últimas 24 horas' },
    { value: '7d', label: 'Última semana' },
    { value: '30d', label: 'Último mes' },
  ];

  const categories = [
    { value: 'todos', label: 'Todas las categorías' },
    { value: 'politica', label: 'Política' },
    { value: 'economia', label: 'Economía' },
    { value: 'tecnologia', label: 'Tecnología' },
    { value: 'sociedad', label: 'Sociedad' },
    { value: 'internacional', label: 'Internacional' },
    { value: 'deportes', label: 'Deportes' },
  ];

  const countries = [
    { value: 'todos', label: 'Todos los países' },
    { value: 'mexico', label: 'México' },
    { value: 'colombia', label: 'Colombia' },
    { value: 'argentina', label: 'Argentina' },
    { value: 'chile', label: 'Chile' },
    { value: 'peru', label: 'Perú' },
    { value: 'brasil', label: 'Brasil' },
    { value: 'venezuela', label: 'Venezuela' },
  ];

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-background/95 backdrop-blur-sm rounded-lg border border-foreground/20 shadow-lg">
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs font-semibold text-foreground/90 mb-1.5 uppercase tracking-wider">
          Período
        </label>
        <Select value={selectedPeriod} onValueChange={onPeriodChange}>
          <SelectTrigger className="h-9 border-foreground/30 bg-background text-foreground shadow-sm hover:border-foreground/50 transition-colors">
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent className="bg-background border-foreground/30 shadow-xl z-50">
            {periods.map((period) => (
              <SelectItem 
                key={period.value} 
                value={period.value}
                className="text-foreground hover:bg-foreground/10 focus:bg-foreground/10 cursor-pointer"
              >
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs font-semibold text-foreground/90 mb-1.5 uppercase tracking-wider">
          Categoría
        </label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="h-9 border-foreground/30 bg-background text-foreground shadow-sm hover:border-foreground/50 transition-colors">
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>
          <SelectContent className="bg-background border-foreground/30 shadow-xl z-50">
            {categories.map((category) => (
              <SelectItem 
                key={category.value} 
                value={category.value}
                className="text-foreground hover:bg-foreground/10 focus:bg-foreground/10 cursor-pointer"
              >
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs font-semibold text-foreground/90 mb-1.5 uppercase tracking-wider">
          País
        </label>
        <Select value={selectedCountry} onValueChange={onCountryChange}>
          <SelectTrigger className="h-9 border-foreground/30 bg-background text-foreground shadow-sm hover:border-foreground/50 transition-colors">
            <SelectValue placeholder="Seleccionar país" />
          </SelectTrigger>
          <SelectContent className="bg-background border-foreground/30 shadow-xl z-50">
            {countries.map((country) => (
              <SelectItem 
                key={country.value} 
                value={country.value}
                className="text-foreground hover:bg-foreground/10 focus:bg-foreground/10 cursor-pointer"
              >
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TrendingFilters;
