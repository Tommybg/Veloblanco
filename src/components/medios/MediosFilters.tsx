import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MediosFiltersProps {
  selectedBias: string;
  onBiasChange: (value: string) => void;
  selectedCredibility: string;
  onCredibilityChange: (value: string) => void;
  selectedCountry: string;
  onCountryChange: (value: string) => void;
}

const MediosFilters = ({
  selectedBias,
  onBiasChange,
  selectedCredibility,
  onCredibilityChange,
  selectedCountry,
  onCountryChange,
}: MediosFiltersProps) => {
  return (
    <div className="flex justify-center animate-fade-in">
      <div className="glass-geometric rounded-asymmetric p-4 shadow-geometric border border-geometric-secondary/20">
        <div className="flex flex-wrap gap-4 justify-center">
          <Select value={selectedBias} onValueChange={onBiasChange}>
            <SelectTrigger className="w-48 border-geometric-secondary/30 bg-background/80 backdrop-blur-sm rounded-skewed shadow-inner-geometric">
              <SelectValue placeholder="Sesgo Editorial" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los sesgos</SelectItem>
              <SelectItem value="left">Progresista</SelectItem>
              <SelectItem value="center">Neutral</SelectItem>
              <SelectItem value="right">Conservador</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCredibility} onValueChange={onCredibilityChange}>
            <SelectTrigger className="w-48 border-geometric-secondary/30 bg-background/80 backdrop-blur-sm rounded-skewed shadow-inner-geometric">
              <SelectValue placeholder="Credibilidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Toda credibilidad</SelectItem>
              <SelectItem value="alta">Alta (4.5+)</SelectItem>
              <SelectItem value="media">Media (3.5-4.4)</SelectItem>
              <SelectItem value="baja">Baja (&lt;3.5)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCountry} onValueChange={onCountryChange}>
            <SelectTrigger className="w-48 border-geometric-secondary/30 bg-background/80 backdrop-blur-sm rounded-skewed shadow-inner-geometric">
              <SelectValue placeholder="País" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los países</SelectItem>
              <SelectItem value="mexico">México</SelectItem>
              <SelectItem value="colombia">Colombia</SelectItem>
              <SelectItem value="argentina">Argentina</SelectItem>
              <SelectItem value="chile">Chile</SelectItem>
              <SelectItem value="peru">Perú</SelectItem>
              <SelectItem value="espana">España</SelectItem>
              <SelectItem value="usa">Estados Unidos</SelectItem>
              <SelectItem value="uk">Reino Unido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default MediosFilters;
