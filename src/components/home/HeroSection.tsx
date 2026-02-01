import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Search, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SearchFilter = 'all' | 'quran' | 'hadith';

const HeroSection: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<SearchFilter>('quran');

  const filterLabels: Record<SearchFilter, { en: string; bn: string }> = {
    all: { en: 'All', bn: 'সব' },
    quran: { en: 'Quran', bn: 'কুরআন' },
    hadith: { en: 'Hadith', bn: 'হাদিস' },
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&filter=${searchFilter}`);
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Elegant warm background */}
      <div className="absolute inset-0 hero-elegant" />
      
      {/* Subtle mandala pattern overlay */}
      <div className="absolute inset-0 islamic-pattern-enhanced opacity-60" />
      
      {/* Content wrapper */}
      <div className="relative container py-6 sm:py-8 md:py-14 px-4 sm:px-6">
        {/* Decorative Islamic Arch Frame */}
        <div className="relative max-w-4xl mx-auto">
          {/* Ornate Arch Frame SVG */}
          <svg 
            viewBox="0 0 900 500" 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-auto pointer-events-none"
            preserveAspectRatio="xMidYMin meet"
          >
            <defs>
              {/* Gold gradient */}
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(38 92% 55%)" />
                <stop offset="50%" stopColor="hsl(38 85% 50%)" />
                <stop offset="100%" stopColor="hsl(38 80% 45%)" />
              </linearGradient>
              
              {/* Decorative pattern for arch */}
              <pattern id="archPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1.5" fill="hsl(38 85% 50%)" fillOpacity="0.3" />
              </pattern>
            </defs>
            
            {/* Outer decorative arch - main frame */}
            <path 
              d="M80 480 L80 200 Q80 60 450 60 Q820 60 820 200 L820 480" 
              fill="none" 
              stroke="url(#goldGradient)" 
              strokeWidth="3"
              className="opacity-70"
            />
            
            {/* Inner arch with dotted pattern */}
            <path 
              d="M120 480 L120 210 Q120 100 450 100 Q780 100 780 210 L780 480" 
              fill="none" 
              stroke="hsl(38 85% 55%)" 
              strokeWidth="1.5"
              strokeDasharray="8,4"
              className="opacity-40"
            />
            
            {/* Innermost elegant arch */}
            <path 
              d="M160 480 L160 220 Q160 130 450 130 Q740 130 740 220 L740 480" 
              fill="none" 
              stroke="hsl(38 80% 50%)" 
              strokeWidth="1"
              className="opacity-25"
            />
            
            {/* Top ornamental circle with star */}
            <g transform="translate(450, 60)">
              <circle cx="0" cy="0" r="20" fill="none" stroke="url(#goldGradient)" strokeWidth="2" className="opacity-60" />
              <circle cx="0" cy="0" r="12" fill="none" stroke="hsl(38 85% 55%)" strokeWidth="1" className="opacity-40" />
              <circle cx="0" cy="0" r="5" fill="hsl(38 92% 50%)" className="opacity-50" />
            </g>
            
            {/* Left corner ornament */}
            <g transform="translate(80, 480)">
              <circle cx="0" cy="0" r="15" fill="none" stroke="url(#goldGradient)" strokeWidth="2" className="opacity-50" />
              <circle cx="0" cy="0" r="8" fill="none" stroke="hsl(38 85% 55%)" strokeWidth="1" className="opacity-30" />
              <circle cx="0" cy="0" r="4" fill="hsl(38 92% 50%)" className="opacity-40" />
            </g>
            
            {/* Right corner ornament */}
            <g transform="translate(820, 480)">
              <circle cx="0" cy="0" r="15" fill="none" stroke="url(#goldGradient)" strokeWidth="2" className="opacity-50" />
              <circle cx="0" cy="0" r="8" fill="none" stroke="hsl(38 85% 55%)" strokeWidth="1" className="opacity-30" />
              <circle cx="0" cy="0" r="4" fill="hsl(38 92% 50%)" className="opacity-40" />
            </g>
            
            {/* Left side decorative elements */}
            <g className="opacity-40">
              <path d="M80 300 Q60 300 60 280 Q60 260 80 260" fill="none" stroke="hsl(38 85% 55%)" strokeWidth="1.5" />
              <path d="M80 350 Q50 350 50 320 Q50 290 80 290" fill="none" stroke="hsl(38 85% 55%)" strokeWidth="1" />
              <circle cx="50" cy="320" r="4" fill="hsl(38 92% 50%)" fillOpacity="0.5" />
            </g>
            
            {/* Right side decorative elements */}
            <g className="opacity-40">
              <path d="M820 300 Q840 300 840 280 Q840 260 820 260" fill="none" stroke="hsl(38 85% 55%)" strokeWidth="1.5" />
              <path d="M820 350 Q850 350 850 320 Q850 290 820 290" fill="none" stroke="hsl(38 85% 55%)" strokeWidth="1" />
              <circle cx="850" cy="320" r="4" fill="hsl(38 92% 50%)" fillOpacity="0.5" />
            </g>

            {/* Mandala-inspired top decoration */}
            <g transform="translate(450, 35)" className="opacity-30">
              <path d="M-40 0 L-20 -10 L0 0 L20 -10 L40 0" fill="none" stroke="hsl(38 85% 55%)" strokeWidth="1" />
              <path d="M-30 5 L0 -5 L30 5" fill="none" stroke="hsl(38 80% 50%)" strokeWidth="0.8" />
            </g>
          </svg>

          {/* Main content area */}
          <div className="relative flex flex-col items-center text-center pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6">
            {/* Decorative gold sparkle icon */}
            <div className="mb-4 sm:mb-6 animate-fade-in">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gold/25 to-gold-light/15 border-2 border-gold/40 shadow-lg shadow-gold/15">
                <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-gold" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 text-foreground animate-fade-in">
              {t('hero.title')}
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-xl text-muted-foreground mb-1.5 sm:mb-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {t('hero.subtitle')}
            </p>
            
            {/* AI Subtitle with gold accent */}
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-6 sm:mb-8 md:mb-10 max-w-lg animate-fade-in flex items-center gap-1.5 sm:gap-2" style={{ animationDelay: '0.15s' }}>
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-gold flex-shrink-0" />
              <span>{t('hero.aiSubtitle')}</span>
            </p>

            {/* Search Bar */}
            <form 
              onSubmit={handleSearch}
              className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="relative flex items-center">
                <div className="absolute left-4 sm:left-5 flex items-center text-muted-foreground">
                  <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('hero.search')}
                  className="w-full pl-12 sm:pl-14 pr-28 sm:pr-40 md:pr-44 py-6 sm:py-7 md:py-8 text-sm sm:text-base md:text-lg rounded-full bg-card text-foreground border-2 border-gold/20 shadow-xl shadow-gold/5 focus-visible:ring-2 focus-visible:ring-gold/30 focus-visible:border-gold/40"
                />
                <div className="absolute right-2 sm:right-3 flex items-center gap-1 sm:gap-2">
                  {/* Filter Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 sm:h-10 md:h-11 px-3 sm:px-4 rounded-full text-xs sm:text-sm md:text-base font-medium text-muted-foreground hover:text-gold hover:bg-gold/10 gap-1"
                      >
                        <span>
                          {language === 'bn' ? filterLabels[searchFilter].bn : filterLabels[searchFilter].en}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[120px] bg-popover border border-border shadow-lg z-50">
                      <DropdownMenuItem 
                        onClick={() => setSearchFilter('all')}
                        className={searchFilter === 'all' ? 'bg-accent' : ''}
                      >
                        {language === 'bn' ? 'সব' : 'All'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setSearchFilter('quran')}
                        className={searchFilter === 'quran' ? 'bg-accent' : ''}
                      >
                        {language === 'bn' ? 'কুরআন' : 'Quran'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setSearchFilter('hadith')}
                        className={searchFilter === 'hadith' ? 'bg-accent' : ''}
                      >
                        {language === 'bn' ? 'হাদিস' : 'Hadith'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button
                    type="submit"
                    size="icon"
                    className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                  >
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Decorative bottom transition with gold accent line */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            d="M0 50V25C360 8 720 0 720 0C720 0 1080 8 1440 25V50H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
