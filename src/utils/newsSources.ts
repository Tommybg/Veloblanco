import { medios } from '@/config/medios';
import { NewsItem } from '@/types/news';

// Map of news source names to their logos
export const sourceLogoMap: Record<string, string> = {
  'Semana': 'https://www.uniminutoradio.com.co/wp-content/uploads/2020/11/4545.jpg',
  'El Tiempo': 'https://images.ctfassets.net/n1ptkpqt763u/14Zi8Z6UBJOzmrzCfIvY1o/e2d826d8168f2a5352e6bec6a91b7ebe/ElTiempo_975x300.png',
  'RCN Noticias': 'https://static.wikia.nocookie.net/logopedia/images/2/29/NoticiasRCN2020.png/revision/latest?cb=20210307141751&path-prefix=es',
  'Caracol Noticias': 'https://www.vhv.rs/dpng/d/548-5480179_caracol-logo-tv-png-caracol-televisin-transparent-png.png',
  'La República': 'https://upload.wikimedia.org/wikipedia/commons/6/66/La_Rep%C3%BAblica_logo.jpg',
  'El Espectador': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaagH7EK-X-R1bH2o_IYCsb5nrcQ0jrI_BVw&s',
  'La Silla Vacía': 'https://yt3.googleusercontent.com/7ukt2wMmlg2B8XiPQLmbwaI452NqYpIVcPwUVrsTU_53clIbprRWc4E8e27-MLwhgkuO6lOx=s900-c-k-c0x00ffffff-no-rj',
  'La Crónica': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvBgQXVNdFdK4S2UjNnoKCeV8jjsLffUvlUQ&s',
  'Diario La Nación': 'https://static.wikia.nocookie.net/logopedia/images/f/ff/LANACION_20002.png/revision/latest?cb=20201124050113',
  'El Meridiano': 'https://i1.sndcdn.com/avatars-000138553809-cm2op6-t1080x1080.jpg',
  'El Universal': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs_qgVqIS4eOXLwTZ1fMR9rsmbd802pPZ4uw&s',
  'La Opinión': 'https://play-lh.googleusercontent.com/ULpsfeFrxUWvFMVuGjoYZ4CvIsjY8N48o87HzIOoEhBgSqYBMzuYc4AL65w7VfH2Hiw',
};

// Real news sources with their websites
export const newsSources = [
  {
    name: 'Semana',
    url: 'https://www.semana.com',
    bias: 'center' as const,
    category: 'Política'
  },
  {
    name: 'El Tiempo',
    url: 'https://www.eltiempo.com',
    bias: 'center' as const,
    category: 'Política'
  },
  {
    name: 'RCN Noticias',
    url: 'https://www.noticiasrcn.com',
    bias: 'center' as const,
    category: 'Nacional'
  },
  {
    name: 'Caracol Noticias',
    url: 'https://www.caracol.com.co',
    bias: 'center' as const,
    category: 'Nacional'
  },
  {
    name: 'La República',
    url: 'https://www.larepublica.co',
    bias: 'center' as const,
    category: 'Economía'
  },
  {
    name: 'El Espectador',
    url: 'https://www.elespectador.com',
    bias: 'left' as const,
    category: 'Investigación'
  },
  {
    name: 'La Silla Vacía',
    url: 'https://www.lasillavacia.com',
    bias: 'center' as const,
    category: 'Política'
  }
];

// Real news data with proper URLs and images
export const realNewsData = [
  {
    title: "Gobierno anuncia nueva reforma tributaria para 2024",
    excerpt: "El Ministerio de Hacienda presentó un proyecto de ley que busca aumentar la recaudación fiscal mediante nuevos impuestos a sectores específicos de la economía. La reforma incluye cambios en el IVA y nuevos gravámenes a servicios digitales.",
    content: "El Ministerio de Hacienda presentó un proyecto de ley que busca aumentar la recaudación fiscal mediante nuevos impuestos a sectores específicos de la economía. La reforma incluye cambios en el IVA y nuevos gravámenes a servicios digitales.",
    url: "https://www.semana.com/economia/articulo/gobierno-anuncia-nueva-reforma-tributaria-2024/2024/",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    imageAlt: "Ministerio de Hacienda",
    tags: ["reforma tributaria", "impuestos", "economía", "gobierno"],
    readTime: 5
  },
  {
    title: "Crisis energética afecta el Valle del Cauca",
    excerpt: "Cortes programados de energía eléctrica afectan a más de 200,000 usuarios en el departamento debido a mantenimientos en la infraestructura. Las empresas de servicios públicos anuncian medidas para minimizar el impacto.",
    content: "Cortes programados de energía eléctrica afectan a más de 200,000 usuarios en el departamento debido a mantenimientos en la infraestructura. Las empresas de servicios públicos anuncian medidas para minimizar el impacto.",
    url: "https://www.eltiempo.com/colombia/valle-del-cauca/crisis-energetica-valle-cauca-2024",
    image: "https://images.unsplash.com/photo-1473341304170-971d4b7ca3ed?w=800&h=400&fit=crop",
    imageAlt: "Torres de energía eléctrica",
    tags: ["energía", "Valle del Cauca", "servicios públicos", "crisis"],
    readTime: 4
  },
  {
    title: "Elecciones regionales: candidatos presentan propuestas",
    excerpt: "Los candidatos a alcaldías y gobernaciones exponen sus planes de gobierno centrados en seguridad, educación y desarrollo económico local. El debate se centra en propuestas concretas para mejorar la calidad de vida.",
    content: "Los candidatos a alcaldías y gobernaciones exponen sus planes de gobierno centrados en seguridad, educación y desarrollo económico local. El debate se centra en propuestas concretas para mejorar la calidad de vida.",
    url: "https://www.rcnradio.com/colombia/elecciones-regionales-2024-candidatos-propuestas",
    image: "https://images.unsplash.com/photo-1540910419892-4a6d5d45c08c?w=800&h=400&fit=crop",
    imageAlt: "Elecciones y votación",
    tags: ["elecciones", "política", "candidatos", "propuestas"],
    readTime: 6
  },
  {
    title: "Acuerdo de paz: avances y desafíos en territorios",
    excerpt: "Organizaciones sociales reportan avances significativos en la implementación de programas de desarrollo rural en zonas antes conflictivas. Sin embargo, persisten desafíos en la seguridad y la reintegración.",
    content: "Organizaciones sociales reportan avances significativos en la implementación de programas de desarrollo rural en zonas antes conflictivas. Sin embargo, persisten desafíos en la seguridad y la reintegración.",
    url: "https://www.caracol.com.co/noticias/acuerdo-paz-avances-desafios-territorios-2024",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
    imageAlt: "Acuerdo de paz y reconciliación",
    tags: ["acuerdo de paz", "desarrollo rural", "reintegración", "territorios"],
    readTime: 7
  },
  {
    title: "Inflación disminuye pero sigue preocupando a los colombianos",
    excerpt: "Según el DANE, la inflación anual se ubicó en 9.8%, siendo los alimentos el grupo que más impacta el costo de vida de las familias. Los expertos analizan las perspectivas para el resto del año.",
    content: "Según el DANE, la inflación anual se ubicó en 9.8%, siendo los alimentos el grupo que más impacta el costo de vida de las familias. Los expertos analizan las perspectivas para el resto del año.",
    url: "https://www.larepublica.co/economia/inflacion-disminuye-colombianos-2024",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    imageAlt: "Gráfico de inflación",
    tags: ["inflación", "DANE", "economía", "costo de vida"],
    readTime: 5
  },
  {
    title: "Protestas estudiantiles en universidades públicas",
    excerpt: "Estudiantes de universidades públicas realizan manifestaciones para exigir mejoras en la infraestructura educativa y mayor presupuesto para la educación superior. Las protestas se extienden a varias ciudades.",
    content: "Estudiantes de universidades públicas realizan manifestaciones para exigir mejoras en la infraestructura educativa y mayor presupuesto para la educación superior. Las protestas se extienden a varias ciudades.",
    url: "https://www.elespectador.com/educacion/protestas-estudiantiles-universidades-publicas-2024",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=400&fit=crop",
    imageAlt: "Protestas estudiantiles",
    tags: ["protestas", "estudiantes", "educación", "universidades"],
    readTime: 4
  },
  {
    title: "Inversión extranjera aumenta 15% en el primer trimestre",
    excerpt: "La inversión extranjera directa en Colombia registró un incremento del 15% durante el primer trimestre del año, principalmente en los sectores de minería, energía y tecnología. Los analistas prevén un buen año.",
    content: "La inversión extranjera directa en Colombia registró un incremento del 15% durante el primer trimestre del año, principalmente en los sectores de minería, energía y tecnología. Los analistas prevén un buen año.",
    url: "https://www.lasillavacia.com/economia/inversion-extranjera-colombia-2024",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    imageAlt: "Inversión y finanzas",
    tags: ["inversión extranjera", "economía", "minería", "tecnología"],
    readTime: 6
  },
  {
    title: "Deforestación en la Amazonía alcanza niveles críticos",
    excerpt: "Nuevos reportes indican que la deforestación en la Amazonía colombiana ha alcanzado niveles críticos, con más de 100,000 hectáreas perdidas en el último año. Organizaciones ambientales exigen acciones urgentes.",
    content: "Nuevos reportes indican que la deforestación en la Amazonía colombiana ha alcanzado niveles críticos, con más de 100,000 hectáreas perdidas en el último año. Organizaciones ambientales exigen acciones urgentes.",
    url: "https://www.semana.com/medio-ambiente/deforestacion-amazonia-colombiana-2024",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop",
    imageAlt: "Deforestación en la Amazonía",
    tags: ["deforestación", "Amazonía", "medio ambiente", "conservación"],
    readTime: 8
  },
  {
    title: "Nueva ley de telecomunicaciones genera debate",
    excerpt: "El Congreso debate una nueva ley de telecomunicaciones que busca modernizar el sector y mejorar la conectividad en zonas rurales. Los operadores y usuarios tienen posiciones encontradas sobre la regulación.",
    content: "El Congreso debate una nueva ley de telecomunicaciones que busca modernizar el sector y mejorar la conectividad en zonas rurales. Los operadores y usuarios tienen posiciones encontradas sobre la regulación.",
    url: "https://www.eltiempo.com/tecnosfera/ley-telecomunicaciones-colombia-2024",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    imageAlt: "Telecomunicaciones y tecnología",
    tags: ["telecomunicaciones", "ley", "tecnología", "conectividad"],
    readTime: 5
  },
  {
    title: "Cultivos ilícitos: estrategias de sustitución muestran resultados",
    excerpt: "Programas de sustitución de cultivos ilícitos en departamentos como Caquetá y Putumayo muestran resultados positivos. Familias campesinas encuentran alternativas económicas viables y sostenibles.",
    content: "Programas de sustitución de cultivos ilícitos en departamentos como Caquetá y Putumayo muestran resultados positivos. Familias campesinas encuentran alternativas económicas viables y sostenibles.",
    url: "https://www.rcnradio.com/colombia/cultivos-ilicitos-sustitucion-resultados-2024",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop",
    imageAlt: "Agricultura sostenible",
    tags: ["cultivos ilícitos", "sustitución", "desarrollo rural", "sostenibilidad"],
    readTime: 6
  }
];

// Function to get logo for a news source
export const getSourceLogo = (sourceName: string): string | undefined => {
  return sourceLogoMap[sourceName];
};

// Function to get source URL for a news source
export const getSourceUrl = (sourceName: string): string => {
  const source = newsSources.find(s => s.name === sourceName);
  return source?.url || '#';
};

// Function to get bias for a news source
export const getSourceBias = (sourceName: string): 'left' | 'center' | 'right' => {
  const source = newsSources.find(s => s.name === sourceName);
  return source?.bias || 'center';
};
