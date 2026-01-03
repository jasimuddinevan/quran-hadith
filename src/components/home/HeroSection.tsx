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
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 hero-gradient islamic-pattern" />
      
      {/* Content */}
      <div className="relative container py-16 md:py-24">
        <div className="flex flex-col items-center text-center text-primary-foreground">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 animate-fade-in">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {t('hero.subtitle')}
          </p>

          {/* AI Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="w-full max-w-2xl animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-5 w-5 text-primary" />
                <Search className="h-5 w-5" />
              </div>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('hero.search')}
                className="w-full pl-16 pr-14 py-6 text-base rounded-full bg-background text-foreground border-0 shadow-lg focus-visible:ring-2 focus-visible:ring-primary/50"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 h-10 w-10 rounded-full text-muted-foreground hover:text-primary hover:bg-accent"
              >
                <Mic className="h-5 w-5" />
              </Button>
            </div>
            <p className="mt-3 text-sm opacity-75 flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3" />
              {t('hero.aiPowered')}
            </p>
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
