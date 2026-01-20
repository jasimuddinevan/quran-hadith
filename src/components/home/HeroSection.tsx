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
      {/* Elegant warm background */}
      <div className="absolute inset-0 hero-elegant" />
      
      {/* Subtle mandala pattern overlay */}
      <div className="absolute inset-0 islamic-pattern-enhanced opacity-60" />
      
      {/* Content wrapper */}
      <div className="relative container py-8 md:py-14">
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
          <div className="relative flex flex-col items-center text-center pt-20 pb-12 px-6">
            {/* Decorative gold sparkle icon */}
            <div className="mb-6 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gold/25 to-gold-light/15 border-2 border-gold/40 shadow-lg shadow-gold/15">
                <Sparkles className="h-8 w-8 text-gold" />
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
            <p className="text-sm md:text-base text-muted-foreground mb-10 max-w-lg animate-fade-in flex items-center gap-2" style={{ animationDelay: '0.15s' }}>
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
                  className="w-full pl-12 pr-28 py-6 text-base rounded-full bg-card text-foreground border-2 border-gold/20 shadow-xl shadow-gold/5 focus-visible:ring-2 focus-visible:ring-gold/30 focus-visible:border-gold/40"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full text-muted-foreground hover:text-gold hover:bg-gold/10"
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
