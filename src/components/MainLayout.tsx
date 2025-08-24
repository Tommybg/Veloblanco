
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Map, Building2, Rss } from 'lucide-react';
import { NavBar } from '@/components/ui/tubelight-navbar';
import GlobalSearchIndicator from './GlobalSearchIndicator';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const navItems = [
    {
      name: 'Búsqueda',
      url: '/',
      icon: Search,
    },
    {
      name: 'Trending Topics',
      url: '/trending',
      icon: TrendingUp,
    },
    {
      name: 'Mapa LATAM',
      url: '/mapa-latam',
      icon: Map,
    },
    {
      name: 'Medios',
      url: '/medios',
      icon: Building2,
    },
    {
      name: 'Feed',
      url: '/feed',
      icon: Rss,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background">
      {/* Logo Section - Fixed position */}
      <div className="fixed top-6 left-6 z-50">
        <Link to="/">
          <div className="geometric-logo w-12 h-12 cursor-pointer group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-geometric-primary to-primary/80 opacity-90 rounded-lg group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-sm transform -translate-x-1/2 -translate-y-1/2 shadow-sm group-hover:animate-geometric-float"></div>
            <div className="absolute top-1 right-1 w-2 h-2 bg-white/60 rounded-full"></div>
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-white/40 rounded-full"></div>
          </div>
        </Link>
      </div>

      {/* Tubelight Navigation */}
      <NavBar items={navItems} />

      {/* Main Content */}
      <main className="w-full max-w-none mx-auto px-0 pt-24 pb-8">
        {children}
      </main>
      
      {/* Global Search Indicator */}
      <GlobalSearchIndicator />
    </div>
  );
};

export default MainLayout;
