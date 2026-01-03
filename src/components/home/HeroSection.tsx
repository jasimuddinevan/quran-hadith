import React, { useState } from 'react';
import { Search, Mic, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // AI search placeholder - will be implemented later
    console.log('Searching:', searchQuery);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Enhanced background with multiple layers */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Islamic geometric pattern overlay */}
      <div className="absolute inset-0 islamic-pattern-enhanced" />
      
      {/* Decorative circles */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/3 rounded-full blur-xl" />
      
      {/* Content */}
      <div className="relative container py-16 md:py-24">
        <div className="flex flex-col items-center text-center text-primary-foreground">
          {/* Sparkle Icon */}
          <div className="mb-4 animate-fade-in">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 animate-fade-in">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {t('hero.subtitle')}
          </p>
          
          {/* AI Subtitle */}
          <p className="text-sm md:text-base opacity-80 mb-8 max-w-lg animate-fade-in flex items-center gap-2" style={{ animationDelay: '0.15s' }}>
            <Sparkles className="h-4 w-4" />
            {t('hero.aiSubtitle')}
          </p>

          {/* AI Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="w-full max-w-2xl animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center text-muted-foreground">
                <Search className="h-5 w-5" />
              </div>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('hero.search')}
                className="w-full pl-12 pr-28 py-6 text-base rounded-full bg-background text-foreground border-0 shadow-lg focus-visible:ring-2 focus-visible:ring-primary/50"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-muted-foreground hover:text-primary hover:bg-accent"
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            d="M0 60V30C240 10 480 0 720 0C960 0 1200 10 1440 30V60H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
