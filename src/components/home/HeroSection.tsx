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
    console.log('Searching:', searchQuery);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Elegant light background */}
      <div className="absolute inset-0 hero-elegant" />
      
      {/* Subtle Islamic geometric pattern overlay */}
      <div className="absolute inset-0 islamic-pattern-enhanced" />
      
      {/* Content wrapper with arch frame */}
      <div className="relative container py-12 md:py-20">
        {/* Decorative Arch Frame */}
        <div className="relative max-w-4xl mx-auto">
          {/* Outer arch border - gold */}
          <svg 
            viewBox="0 0 800 400" 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-auto pointer-events-none"
            preserveAspectRatio="xMidYMin meet"
          >
            {/* Gold outer arch */}
            <path 
              d="M50 400 L50 180 Q50 50 400 50 Q750 50 750 180 L750 400" 
              fill="none" 
              stroke="hsl(38 92% 50%)" 
              strokeWidth="2"
              className="opacity-60"
            />
            {/* Inner subtle arch */}
            <path 
              d="M80 400 L80 190 Q80 80 400 80 Q720 80 720 190 L720 400" 
              fill="none" 
              stroke="hsl(38 85% 60%)" 
              strokeWidth="1"
              className="opacity-30"
            />
            {/* Decorative corner elements */}
            <circle cx="50" cy="400" r="6" fill="hsl(38 92% 50%)" className="opacity-40" />
            <circle cx="750" cy="400" r="6" fill="hsl(38 92% 50%)" className="opacity-40" />
            <circle cx="400" cy="50" r="8" fill="hsl(38 92% 50%)" className="opacity-50" />
          </svg>

          {/* Main content area */}
          <div className="relative flex flex-col items-center text-center pt-16 pb-8 px-4">
            {/* Decorative gold sparkle icon */}
            <div className="mb-6 animate-fade-in">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-gold/20 to-gold-light/10 border border-gold/30 shadow-lg shadow-gold/10">
                <Sparkles className="h-7 w-7 text-gold" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 text-foreground animate-fade-in">
              {t('hero.title')}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground mb-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {t('hero.subtitle')}
            </p>
            
            {/* AI Subtitle with gold accent */}
            <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-lg animate-fade-in flex items-center gap-2" style={{ animationDelay: '0.15s' }}>
              <Sparkles className="h-4 w-4 text-gold" />
              <span>{t('hero.aiSubtitle')}</span>
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
                  className="w-full pl-12 pr-28 py-6 text-base rounded-full bg-card text-foreground border border-border/50 shadow-lg shadow-primary/5 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50"
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
                    className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Decorative bottom border with gold accent */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            d="M0 40V20C360 5 720 0 720 0C720 0 1080 5 1440 20V40H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
