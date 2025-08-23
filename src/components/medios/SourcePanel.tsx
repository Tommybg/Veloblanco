
import { TrendingUp, Eye, Calendar, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SourcePanelProps {
  selectedSource: string | null;
  bias: string;
  credibility: string;
  country: string;
}

const SourcePanel = ({
  selectedSource,
  bias,
  credibility,
  country
}: SourcePanelProps) => {
  if (!selectedSource) {
    return null; // Don't render anything when no source is selected
  }

  // Mock data for selected source analysis
  const sourceAnalysis = {
    recentArticles: 156,
    weeklyGrowth: 12,
    topicsThisWeek: [{
      name: 'Elecciones 2024',
      coverage: 85
    }, {
      name: 'Economía Global',
      coverage: 72
    }, {
      name: 'Clima',
      coverage: 58
    }, {
      name: 'Tecnología',
      coverage: 45
    }],
    biasDistribution: {
      progressive: 15,
      neutral: 70,
      conservative: 15
    },
    factCheck: {
      accurate: 92,
      mixed: 6,
      false: 2
    }
  };
  return <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Actividad Reciente</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Artículos esta semana</span>
            <span className="font-semibold">{sourceAnalysis.recentArticles}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Crecimiento semanal</span>
            <span className="font-semibold text-green-600">+{sourceAnalysis.weeklyGrowth}%</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Cobertura por Tema</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sourceAnalysis.topicsThisWeek.map(topic => <div key={topic.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{topic.name}</span>
                <span className="text-muted-foreground">{topic.coverage}%</span>
              </div>
              <Progress value={topic.coverage} className="h-2" />
            </div>)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Distribución Editorial</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Progresista</span>
              <span className="text-sm font-medium">{sourceAnalysis.biasDistribution.progressive}%</span>
            </div>
            <Progress value={sourceAnalysis.biasDistribution.progressive} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Neutral</span>
              <span className="text-sm font-medium">{sourceAnalysis.biasDistribution.neutral}%</span>
            </div>
            <Progress value={sourceAnalysis.biasDistribution.neutral} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Conservador</span>
              <span className="text-sm font-medium">{sourceAnalysis.biasDistribution.conservative}%</span>
            </div>
            <Progress value={sourceAnalysis.biasDistribution.conservative} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Verificación de Hechos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-700">Precisos</span>
              <span className="text-sm font-medium">{sourceAnalysis.factCheck.accurate}%</span>
            </div>
            <Progress value={sourceAnalysis.factCheck.accurate} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-yellow-700">Mixtos</span>
              <span className="text-sm font-medium">{sourceAnalysis.factCheck.mixed}%</span>
            </div>
            <Progress value={sourceAnalysis.factCheck.mixed} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-red-700">Falsos</span>
              <span className="text-sm font-medium">{sourceAnalysis.factCheck.false}%</span>
            </div>
            <Progress value={sourceAnalysis.factCheck.false} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>;
};

export default SourcePanel;
