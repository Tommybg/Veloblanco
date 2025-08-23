import React from 'react';
import { MapPin, TrendingUp, Users, Clock } from 'lucide-react';
import { GeometricButton } from '@/components/ui/geometric-button';
interface CountryPanelProps {
  selectedCountry: string | null;
  category: string;
  period: string;
}
const CountryPanel = ({
  selectedCountry,
  category,
  period
}: CountryPanelProps) => {
  // Mock data for countries
  const countryData = {
    mexico: {
      name: 'México',
      flag: '🇲🇽',
      activity: 85,
      trending: [{
        title: 'Reforma electoral genera controversia',
        trend: '+156%'
      }, {
        title: 'Peso mexicano se fortalece',
        trend: '+89%'
      }, {
        title: 'Nueva ley de telecomunicaciones',
        trend: '+67%'
      }],
      stats: {
        sources: 45,
        articles: 234,
        neutrality: 72
      }
    },
    colombia: {
      name: 'Colombia',
      flag: '🇨🇴',
      activity: 78,
      trending: [{
        title: 'Acuerdo de paz avanza',
        trend: '+198%'
      }, {
        title: 'Reforma fiscal en debate',
        trend: '+145%'
      }, {
        title: 'Elecciones regionales 2024',
        trend: '+92%'
      }],
      stats: {
        sources: 38,
        articles: 189,
        neutrality: 68
      }
    },
    argentina: {
      name: 'Argentina',
      flag: '🇦🇷',
      activity: 82,
      trending: [{
        title: 'Inflación alcanza nuevo récord',
        trend: '+234%'
      }, {
        title: 'Negociaciones con FMI',
        trend: '+187%'
      }, {
        title: 'Crisis energética nacional',
        trend: '+134%'
      }],
      stats: {
        sources: 42,
        articles: 267,
        neutrality: 65
      }
    },
    brasil: {
      name: 'Brasil',
      flag: '🇧🇷',
      activity: 88,
      trending: [{
        title: 'Amazonía en agenda nacional',
        trend: '+289%'
      }, {
        title: 'Real brasileño se deprecia',
        trend: '+156%'
      }, {
        title: 'Reforma tributaria avanza',
        trend: '+134%'
      }],
      stats: {
        sources: 52,
        articles: 298,
        neutrality: 70
      }
    }
  };
  const data = selectedCountry ? countryData[selectedCountry as keyof typeof countryData] : null;
  if (!selectedCountry || !data) {
    return;
  }
  return <div className="space-y-6">
      {/* Country Header */}
      <div className="geometric-card animate-fade-in">
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-4xl filter drop-shadow-lg">{data.flag}</span>
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">{data.name}</h2>
            <p className="text-muted-foreground font-medium">Actividad: {data.activity}%</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center glass-geometric p-3 rounded-skewed">
            <div className="text-2xl font-black text-primary">{data.stats.sources}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Fuentes</div>
          </div>
          <div className="text-center glass-geometric p-3 rounded-skewed">
            <div className="text-2xl font-black text-primary">{data.stats.articles}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Artículos</div>
          </div>
          <div className="text-center glass-geometric p-3 rounded-skewed">
            <div className="text-2xl font-black text-primary">{data.stats.neutrality}%</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Neutralidad</div>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="geometric-card animate-fade-in">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center space-x-3 tracking-tight">
          <TrendingUp className="w-6 h-6 text-primary" />
          <span>Temas Trending</span>
        </h3>

        <div className="space-y-4">
          {data.trending.map((topic, index) => <div key={index} className="glass-geometric p-4 rounded-skewed border-l-4 border-primary/40">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-foreground text-sm leading-tight">{topic.title}</h4>
                <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-asymmetric">
                  {topic.trend}
                </span>
              </div>
            </div>)}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="geometric-card animate-fade-in">
        <h3 className="text-lg font-bold text-foreground mb-6 tracking-tight">Análisis Detallado</h3>
        <div className="space-y-3">
          <GeometricButton variant="outline" size="geometric" className="w-full justify-start">
            <Users className="w-4 h-4 text-primary" />
            <span>Ver todas las fuentes</span>
          </GeometricButton>
          <GeometricButton variant="outline" size="geometric" className="w-full justify-start">
            <Clock className="w-4 h-4 text-primary" />
            <span>Histórico de tendencias</span>
          </GeometricButton>
        </div>
      </div>
    </div>;
};
export default CountryPanel;