
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MapFiltersProps {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedPeriod: string;
  onPeriodChange: (value: string) => void;
}

const MapFilters = ({
  selectedCategory,
  onCategoryChange,
  selectedPeriod,
  onPeriodChange,
}: MapFiltersProps) => {
  const categories = [
    { value: 'todos', label: 'Todas las categorías' },
    { value: 'politica', label: 'Política' },
    { value: 'economia', label: 'Economía' },
    { value: 'tecnologia', label: 'Tecnología' },
    { value: 'sociedad', label: 'Sociedad' },
    { value: 'internacional', label: 'Internacional' },
  ];

  const periods = [
    { value: '24h', label: 'Últimas 24 horas' },
    { value: '7d', label: 'Última semana' },
    { value: '30d', label: 'Último mes' },
    { value: '90d', label: 'Últimos 3 meses' },
  ];

  return (
    <div className="animate-fade-in w-full">
      <div className="glass-geometric rounded-asymmetric p-4 shadow-geometric border border-geometric-secondary/20">
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-base font-bold text-foreground tracking-tight">
              Filtros
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2 tracking-wide uppercase">
                Categoría
              </label>
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger className="w-full border-geometric-secondary/30 bg-background/90 backdrop-blur-sm rounded-skewed shadow-inner-geometric text-sm">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent className="bg-background/95 border-geometric-secondary/30 backdrop-blur-sm z-[100] shadow-lg">
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.value} 
                      value={category.value}
                      className="text-sm focus:bg-primary/10 cursor-pointer"
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-2 tracking-wide uppercase">
                Período
              </label>
              <Select value={selectedPeriod} onValueChange={onPeriodChange}>
                <SelectTrigger className="w-full border-geometric-secondary/30 bg-background/90 backdrop-blur-sm rounded-skewed shadow-inner-geometric text-sm">
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent className="bg-background/95 border-geometric-secondary/30 backdrop-blur-sm z-[100] shadow-lg">
                  {periods.map((period) => (
                    <SelectItem 
                      key={period.value} 
                      value={period.value}
                      className="text-sm focus:bg-primary/10 cursor-pointer"
                    >
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapFilters;
