
import React from 'react';
import TrendCard from './TrendCard';

interface TrendingGridProps {
  period: string;
  category: string;
  country: string;
}

const TrendingGrid = ({ period, category, country }: TrendingGridProps) => {
  // Simulated trending data
  const trendingTopics = [
    {
      id: 1,
      title: "Reforma fiscal en Colombia genera debate nacional",
      category: "Política",
      country: "Colombia",
      trend: "+245%",
      neutralityScore: 72,
      sources: 24,
      timeAgo: "2h",
      description: "Nueva propuesta tributaria del gobierno colombiano divide opiniones entre sectores económicos y sociales",
      keywords: ["reforma fiscal", "tributaria", "economía", "gobierno"],
      spectrum: { left: 35, center: 40, right: 25 }
    },
    {
      id: 2,
      title: "Elecciones presidenciales en Argentina: encuestas muestran empate técnico",
      category: "Política",
      country: "Argentina",
      trend: "+189%",
      neutralityScore: 68,
      sources: 31,
      timeAgo: "4h",
      description: "Últimas encuestas revelan competencia cerrada entre principales candidatos presidenciales",
      keywords: ["elecciones", "argentina", "encuestas", "presidencial"],
      spectrum: { left: 42, center: 28, right: 30 }
    },
    {
      id: 3,
      title: "Acuerdo comercial México-Brasil impulsa integración regional",
      category: "Economía",
      country: "México",
      trend: "+156%",
      neutralityScore: 78,
      sources: 18,
      timeAgo: "6h",
      description: "Nuevo tratado comercial bilateral busca fortalecer vínculos económicos entre ambas naciones",
      keywords: ["comercio", "méxico", "brasil", "integración"],
      spectrum: { left: 25, center: 55, right: 20 }
    },
    {
      id: 4,
      title: "Crisis energética en Venezuela afecta servicios básicos",
      category: "Sociedad",
      country: "Venezuela",
      trend: "+134%",
      neutralityScore: 65,
      sources: 22,
      timeAgo: "8h",
      description: "Cortes eléctricos prolongados impactan la vida cotidiana en principales ciudades venezolanas",
      keywords: ["energía", "venezuela", "servicios", "crisis"],
      spectrum: { left: 45, center: 30, right: 25 }
    },
    {
      id: 5,
      title: "Tecnológicas chilenas expanden operaciones en la región",
      category: "Tecnología",
      country: "Chile",
      trend: "+112%",
      neutralityScore: 82,
      sources: 15,
      timeAgo: "12h",
      description: "Startups chilenas del sector fintech lideran expansión hacia mercados latinoamericanos",
      keywords: ["tecnología", "chile", "fintech", "expansión"],
      spectrum: { left: 20, center: 60, right: 20 }
    },
    {
      id: 6,
      title: "Protestas estudiantiles en Perú demandan reforma educativa",
      category: "Sociedad",
      country: "Perú",
      trend: "+98%",
      neutralityScore: 70,
      sources: 19,
      timeAgo: "1d",
      description: "Estudiantes universitarios se movilizan exigiendo mejoras en el sistema educativo nacional",
      keywords: ["protestas", "educación", "perú", "estudiantes"],
      spectrum: { left: 50, center: 35, right: 15 }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trendingTopics.map((topic, index) => (
        <TrendCard
          key={topic.id}
          topic={topic}
          rank={index + 1}
        />
      ))}
    </div>
  );
};

export default TrendingGrid;
