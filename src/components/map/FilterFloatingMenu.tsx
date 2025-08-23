
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FloatingActionMenu from '@/components/ui/floating-action-menu';

interface FilterFloatingMenuProps {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedPeriod: string;
  onPeriodChange: (value: string) => void;
  className?: string;
}

const FilterFloatingMenu = ({
  selectedCategory,
  onCategoryChange,
  selectedPeriod,
  onPeriodChange,
  className,
}: FilterFloatingMenuProps) => {
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
    <FloatingActionMenu
      options={[]}
      className={className}
    >
      <div className="space-y-4 text-foreground">
        <div className="text-center mb-4">
          <h3 className="text-base font-bold text-foreground tracking-tight">
            Filtros
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground/90 mb-2 tracking-wide uppercase">
              Categoría
            </label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full border-border bg-background/90 backdrop-blur-sm text-foreground placeholder:text-muted-foreground hover:bg-background/95 focus:border-primary focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 border-border backdrop-blur-sm z-[200] shadow-geometric">
                {categories.map((category) => (
                  <SelectItem 
                    key={category.value} 
                    value={category.value}
                    className="text-sm text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer hover:bg-accent/80"
                  >
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/90 mb-2 tracking-wide uppercase">
              Período
            </label>
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger className="w-full border-border bg-background/90 backdrop-blur-sm text-foreground placeholder:text-muted-foreground hover:bg-background/95 focus:border-primary focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 border-border backdrop-blur-sm z-[200] shadow-geometric">
                {periods.map((period) => (
                  <SelectItem 
                    key={period.value} 
                    value={period.value}
                    className="text-sm text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer hover:bg-accent/80"
                  >
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </FloatingActionMenu>
  );
};

export default FilterFloatingMenu;
