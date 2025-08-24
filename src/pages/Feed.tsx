
import React, { useState, useEffect, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import FeedHeader from '@/components/feed/FeedHeader';
import NewsCard from '@/components/feed/NewsCard';
import LoadingSpinner from '@/components/feed/LoadingSpinner';
import { NewsItem } from '@/types/news';
import { realNewsData, getSourceLogo, getSourceUrl, getSourceBias } from '@/utils/newsSources';

const Feed = () => {
  const [hasScrolled, setHasScrolled] = useState(false);

  // Simulated API call for infinite scroll with real news data
  const fetchNews = async ({ pageParam = 0 }) => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    
    // Use real news data and rotate through it for infinite scroll
    const startIndex = (pageParam * 8) % realNewsData.length;
    const endIndex = Math.min(startIndex + 8, realNewsData.length);
    const pageNews = realNewsData.slice(startIndex, endIndex);
    
    // If we need more items than available, wrap around to the beginning
    let additionalItems: typeof realNewsData = [];
    if (endIndex - startIndex < 8) {
      const remaining = 8 - (endIndex - startIndex);
      additionalItems = realNewsData.slice(0, remaining);
    }
    
    const mockNews: NewsItem[] = [...pageNews, ...additionalItems].map((news, index) => ({
      id: `${pageParam}-${startIndex + index}`,
      title: news.title,
      content: news.content,
      excerpt: news.excerpt,
      source: getNewsSource(pageParam * 8 + index),
      sourceUrl: getSourceUrl(getNewsSource(pageParam * 8 + index)),
      sourceLogo: getSourceLogo(getNewsSource(pageParam * 8 + index)),
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      category: getMockCategory(pageParam * 8 + index),
      image: news.image,
      imageAlt: news.imageAlt,
      url: news.url,
      likes: Math.floor(Math.random() * 500) + 50,
      shares: Math.floor(Math.random() * 100) + 10,
      comments: Math.floor(Math.random() * 50) + 5,
      bias: getSourceBias(getNewsSource(pageParam * 8 + index)),
      tags: news.tags,
      readTime: news.readTime
    }));

    return {
      news: mockNews,
      nextPage: pageParam < 8 ? pageParam + 1 : undefined, // Limit to 9 pages
      hasMore: pageParam < 8
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

  // Event handlers for interactive features
  const handleLike = (newsId: string) => {
    console.log('Liked news:', newsId);
    // Here you could implement actual like functionality
  };

  const handleComment = (newsId: string) => {
    console.log('Commented on news:', newsId);
    // Here you could implement actual comment functionality
  };

  const handleShare = (newsId: string) => {
    console.log('Shared news:', newsId);
    // Here you could implement actual share functionality
  };

  const handleBookmark = (newsId: string) => {
    console.log('Bookmarked news:', newsId);
    // Here you could implement actual bookmark functionality
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
      
      <div className="max-w-4xl mx-auto space-y-6 px-4">
        {allNews.map((news) => (
          <NewsCard
            key={news.id}
            news={news}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onBookmark={handleBookmark}
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

// Helper functions
const getNewsSource = (index: number) => {
  const sources = [
    "Semana", "El Tiempo", "RCN Noticias", "Caracol Noticias", 
    "La República", "El Espectador", "La Silla Vacía", "La Crónica",
    "Diario La Nación", "El Meridiano", "El Universal", "La Opinión"
  ];
  return sources[index % sources.length];
};

const getMockCategory = (index: number) => {
  const categories = ["Política", "Economía", "Sociedad", "Internacional", "Deportes", "Tecnología", "Medio Ambiente", "Educación"];
  return categories[index % categories.length];
};

export default Feed;
