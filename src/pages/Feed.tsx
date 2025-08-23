
import React, { useState, useEffect, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import FeedHeader from '@/components/feed/FeedHeader';
import { SocialCard } from '@/components/ui/social-card';
import LoadingSpinner from '@/components/feed/LoadingSpinner';
import { Link as LinkIcon } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  timestamp: string;
  category: string;
  image?: string;
  likes: number;
  shares: number;
  comments: number;
  bias: 'left' | 'center' | 'right';
}

const Feed = () => {
  const [hasScrolled, setHasScrolled] = useState(false);

  // Simulated API call for infinite scroll
  const fetchNews = async ({ pageParam = 0 }) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    const mockNews: NewsItem[] = Array.from({ length: 10 }, (_, index) => ({
      id: `${pageParam}-${index}`,
      title: generateMockTitle(pageParam * 10 + index),
      content: generateMockContent(pageParam * 10 + index),
      source: getMockSource(index),
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      category: getMockCategory(index),
      image: Math.random() > 0.6 ? `https://picsum.photos/400/200?random=${pageParam * 10 + index}` : undefined,
      likes: Math.floor(Math.random() * 500),
      shares: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 50),
      bias: getMockBias(index)
    }));

    return {
      news: mockNews,
      nextPage: pageParam < 5 ? pageParam + 1 : undefined, // Limit to 6 pages
      hasMore: pageParam < 5
    };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['news-feed'],
    queryFn: fetchNews,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0
  });

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!hasScrolled) setHasScrolled(true);
    
    if (
      window.innerHeight + document.documentElement.scrollTop + 1000 >=
      document.documentElement.offsetHeight &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, hasScrolled]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const allNews = data?.pages.flatMap(page => page.news) || [];

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays}d`;
  };

  const getBiasUsername = (bias: string) => {
    return bias === 'left' ? 'izquierda' : bias === 'center' ? 'centro' : 'derecha';
  };

  if (isLoading) {
    return (
      <div className="space-y-4 py-4 pt-16">
        <FeedHeader />
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4 pt-16">
      <FeedHeader />
      
      <div className="max-w-2xl mx-auto space-y-6">
        {allNews.map((news) => (
          <SocialCard
            key={news.id}
            author={{
              name: news.source,
              username: getBiasUsername(news.bias),
              avatar: `https://ui-avatars.com/api/?name=${news.source}&background=random`,
              timeAgo: formatTimeAgo(news.timestamp),
            }}
            content={{
              text: news.content,
              link: {
                title: news.title,
                description: `Categoría: ${news.category}`,
                icon: <LinkIcon className="w-5 h-5 text-blue-500" />,
              }
            }}
            engagement={{
              likes: news.likes,
              comments: news.comments,
              shares: news.shares,
              isLiked: false,
              isBookmarked: false,
            }}
            onLike={() => console.log('Liked:', news.id)}
            onComment={() => console.log('Commented:', news.id)}
            onShare={() => console.log('Shared:', news.id)}
            onBookmark={() => console.log('Bookmarked:', news.id)}
            onMore={() => console.log('More:', news.id)}
          />
        ))}
        
        {isFetchingNextPage && (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        )}
        
        {!hasNextPage && allNews.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No hay más noticias para mostrar
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions for mock data
const generateMockTitle = (index: number) => {
  const titles = [
    "Gobierno anuncia nueva reforma tributaria para 2024",
    "Crisis energética afecta el Valle del Cauca",
    "Elecciones regionales: candidatos presentan propuestas",
    "Acuerdo de paz: avances y desafíos en territorios",
    "Inflación disminuye pero sigue preocupando a los colombianos",
    "Protestas estudiantiles en universidades públicas",
    "Inversión extranjera aumenta 15% en el primer trimestre",
    "Deforestación en la Amazonía alcanza niveles críticos",
    "Nueva ley de telecomunicaciones genera debate",
    "Cultivos ilícitos: estrategias de sustitución muestran resultados"
  ];
  return titles[index % titles.length];
};

const generateMockContent = (index: number) => {
  const contents = [
    "El Ministerio de Hacienda presentó un proyecto de ley que busca aumentar la recaudación fiscal mediante nuevos impuestos a sectores específicos de la economía.",
    "Cortes programados de energía eléctrica afectan a más de 200,000 usuarios en el departamento debido a mantenimientos en la infraestructura.",
    "Los candidatos a alcaldías y gobernaciones exponen sus planes de gobierno centrados en seguridad, educación y desarrollo económico local.",
    "Organizaciones sociales reportan avances significativos en la implementación de programas de desarrollo rural en zonas antes conflictivas.",
    "Según el DANE, la inflación anual se ubicó en 9.8%, siendo los alimentos el grupo que más impacta el costo de vida de las familias.",
  ];
  return contents[index % contents.length];
};

const getMockSource = (index: number) => {
  const sources = ["Semana", "El Tiempo", "El Espectador", "La República", "La Silla Vacía", "RCN Noticias", "Caracol Noticias", "El Universal"];
  return sources[index % sources.length];
};

const getMockCategory = (index: number) => {
  const categories = ["Política", "Economía", "Sociedad", "Internacional", "Deportes", "Tecnología"];
  return categories[index % categories.length];
};

const getMockBias = (index: number): 'left' | 'center' | 'right' => {
  const biases: ('left' | 'center' | 'right')[] = ['left', 'center', 'right'];
  return biases[index % biases.length];
};

export default Feed;
