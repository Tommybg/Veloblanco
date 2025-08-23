import { useState } from 'react';
import { Star, ExternalLink, Users, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Article {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  url: string;
}

interface MediosGridProps {
  selectedSource: string | null;
  onSourceSelect: (source: string | null) => void;
  bias: string;
  credibility: string;
  country: string;
}

const MediosGrid = ({
  selectedSource,
  onSourceSelect,
  bias,
  credibility,
  country
}: MediosGridProps) => {
  const sources = [{
    id: 'semana',
    name: 'Semana',
    logo: '📰',
    bias: 'center',
    credibility: 4.1,
    country: 'colombia',
    description: 'Revista semanal de noticias y análisis político',
    audience: '8M',
    founded: '1982',
    website: 'semana.com',
    topics: ['Política', 'Economía', 'Internacional', 'Cultura']
  }, {
    id: 'eltiempo',
    name: 'El Tiempo',
    logo: '🇨🇴',
    bias: 'center',
    credibility: 4.0,
    country: 'colombia',
    description: 'Principal periódico de Colombia',
    audience: '15M',
    founded: '1911',
    website: 'eltiempo.com',
    topics: ['Colombia', 'LATAM', 'Política', 'Deportes']
  }, {
    id: 'rcn',
    name: 'RCN Noticias',
    logo: '📺',
    bias: 'center',
    credibility: 3.9,
    country: 'colombia',
    description: 'Canal de televisión y noticias',
    audience: '12M',
    founded: '1967',
    website: 'noticias.rcn.com.co',
    topics: ['Breaking News', 'Deportes', 'Entretenimiento', 'Nacional']
  }, {
    id: 'caracol',
    name: 'Caracol Noticias',
    logo: '📻',
    bias: 'center',
    credibility: 3.8,
    country: 'colombia',
    description: 'Cadena radial y televisiva de noticias',
    audience: '10M',
    founded: '1948',
    website: 'caracol.com.co',
    topics: ['Nacional', 'Internacional', 'Deportes', 'Economía']
  }, {
    id: 'larepublica',
    name: 'La República',
    logo: '💼',
    bias: 'center',
    credibility: 4.2,
    country: 'colombia',
    description: 'Periódico especializado en economía y negocios',
    audience: '3M',
    founded: '1954',
    website: 'larepublica.co',
    topics: ['Economía', 'Negocios', 'Finanzas', 'Empresas']
  }, {
    id: 'elespectador',
    name: 'El Espectador',
    logo: '📖',
    bias: 'left',
    credibility: 4.3,
    country: 'colombia',
    description: 'Periódico con enfoque investigativo y análisis',
    audience: '5M',
    founded: '1887',
    website: 'elespectador.com',
    topics: ['Investigación', 'Política', 'Justicia', 'Sociedad']
  }, {
    id: 'lasillavacia',
    name: 'La Silla Vacía',
    logo: '🔍',
    bias: 'center',
    credibility: 4.5,
    country: 'colombia',
    description: 'Medio digital especializado en política y poder',
    audience: '2M',
    founded: '2009',
    website: 'lasillavacia.com',
    topics: ['Política', 'Poder', 'Investigación', 'Análisis']
  }, {
    id: 'lacronica',
    name: 'La Crónica',
    logo: '📄',
    bias: 'center',
    credibility: 3.7,
    country: 'colombia',
    description: 'Periódico regional con cobertura nacional',
    audience: '1.5M',
    founded: '1990',
    website: 'lacronica.com',
    topics: ['Regional', 'Nacional', 'Deportes', 'Cultura']
  }, {
    id: 'diarionacion',
    name: 'Diario La Nación',
    logo: '🗞️',
    bias: 'center',
    credibility: 3.6,
    country: 'colombia',
    description: 'Diario de circulación nacional',
    audience: '1.2M',
    founded: '1985',
    website: 'lanacion.com.co',
    topics: ['Nacional', 'Regional', 'Deportes', 'Sociedad']
  }, {
    id: 'elmeridiano',
    name: 'El Meridiano',
    logo: '⚽',
    bias: 'center',
    credibility: 3.5,
    country: 'colombia',
    description: 'Periódico especializado en deportes',
    audience: '2.5M',
    founded: '1974',
    website: 'elmeridiano.com.co',
    topics: ['Deportes', 'Fútbol', 'Nacional', 'Internacional']
  }, {
    id: 'eluniversal',
    name: 'El Universal',
    logo: '🌊',
    bias: 'center',
    credibility: 3.8,
    country: 'colombia',
    description: 'Periódico de la Costa Atlántica',
    audience: '1.8M',
    founded: '1948',
    website: 'eluniversal.com.co',
    topics: ['Caribe', 'Nacional', 'Economía', 'Deportes']
  }, {
    id: 'laopinion',
    name: 'La Opinión',
    logo: '📰',
    bias: 'center',
    credibility: 3.7,
    country: 'colombia',
    description: 'Periódico de Norte de Santander',
    audience: '800K',
    founded: '1960',
    website: 'laopinion.com.co',
    topics: ['Regional', 'Frontera', 'Nacional', 'Sociedad']
  }];

  const mockArticles: {
    [key: string]: Article[];
  } = {
    semana: [{
      id: '1',
      title: 'Análisis de las reformas del Gobierno Petro',
      summary: 'Un análisis profundo sobre el impacto de las reformas propuestas...',
      publishedAt: '2024-01-15',
      url: 'https://semana.com/analisis-reformas'
    }, {
      id: '2',
      title: 'Situación económica actual de Colombia',
      summary: 'Revisión de los indicadores económicos más importantes...',
      publishedAt: '2024-01-14',
      url: 'https://semana.com/economia-colombia'
    }],
    eltiempo: [{
      id: '3',
      title: 'Últimas noticias del Congreso de la República',
      summary: 'Cobertura de los debates más importantes en el Legislativo...',
      publishedAt: '2024-01-15',
      url: 'https://eltiempo.com/congreso'
    }, {
      id: '4',
      title: 'Situación de seguridad en las principales ciudades',
      summary: 'Análisis de los índices de criminalidad en Colombia...',
      publishedAt: '2024-01-14',
      url: 'https://eltiempo.com/seguridad'
    }]
  };

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'center':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'right':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getBiasLabel = (bias: string) => {
    switch (bias) {
      case 'left':
        return 'Progresista';
      case 'center':
        return 'Neutral';
      case 'right':
        return 'Conservador';
      default:
        return 'Desconocido';
    }
  };

  const filteredSources = sources.filter(source => {
    if (bias !== 'todos' && source.bias !== bias) return false;
    if (credibility === 'alta' && source.credibility < 4.5) return false;
    if (credibility === 'media' && (source.credibility < 3.5 || source.credibility >= 4.5)) return false;
    if (credibility === 'baja' && source.credibility >= 3.5) return false;
    return true;
  });

  const handleArticleClick = (article: Article) => {
    // Here you would navigate to analysis page or trigger analysis
    console.log('Analyzing article:', article.title);
    // You could add navigation logic here like:
    // navigate(`/analysis?url=${encodeURIComponent(article.url)}&title=${encodeURIComponent(article.title)}`);
  };

  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        
        <span className="text-sm text-muted-foreground">
          {filteredSources.length} fuentes encontradas
        </span>
      </div>

      {!selectedSource ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSources.map(source => <Card key={source.id} className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:scale-105 group" onClick={() => onSourceSelect(source.id)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{source.logo}</span>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{source.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getBiasColor(source.bias)}>
                          {getBiasLabel(source.bias)}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 mr-1" />
                          <span className="text-sm text-muted-foreground">
                            {source.credibility}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {source.description}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span>{source.audience}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span>{source.founded}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {source.topics.slice(0, 3).map(topic => <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>)}
                </div>
              </CardContent>
            </Card>)}
        </div> : <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => onSourceSelect(null)} className="text-sm text-muted-foreground hover:text-foreground">
              ← Volver a medios
            </button>
            <h3 className="text-xl font-semibold">
              Últimas noticias de {filteredSources.find(s => s.id === selectedSource)?.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(mockArticles[selectedSource] || []).map(article => <Card key={article.id} className="cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 group" onClick={() => handleArticleClick(article)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{article.title}</h4>
                      <p className="text-muted-foreground text-sm mb-3">{article.summary}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                        </div>
                        <span className="group-hover:text-primary transition-colors">Clic para analizar →</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>}
    </div>;
};

export default MediosGrid;
