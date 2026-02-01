import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, ChevronDown, BookOpen, ScrollText, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { searchQuran, QuranSearchResult } from '@/lib/quranApi';
import { searchHadiths, HadithResponse, hadithCollections } from '@/lib/hadithApi';
import { cn } from '@/lib/utils';

type SearchFilter = 'all' | 'quran' | 'hadith';

interface SearchSuggestion {
  type: 'quran' | 'hadith';
  id: string;
  title: string;
  subtitle: string;
  preview: string;
  link: string;
}

const SearchAutocomplete: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<SearchFilter>('all');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const filterLabels: Record<SearchFilter, { en: string; bn: string }> = {
    all: { en: 'All', bn: 'সব' },
    quran: { en: 'Quran', bn: 'কুরআন' },
    hadith: { en: 'Hadith', bn: 'হাদিস' },
  };

  // Fetch suggestions as user types
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results: SearchSuggestion[] = [];

        // Fetch based on filter
        if (searchFilter === 'all' || searchFilter === 'quran') {
          const quranResults = await searchQuran(searchQuery, language, 1, 5);
          quranResults.results.forEach((result: QuranSearchResult) => {
            results.push({
              type: 'quran',
              id: result.verseKey,
              title: `${result.surahName} ${result.verseKey}`,
              subtitle: result.surahNameArabic,
              preview: result.textTranslation.substring(0, 100) + '...',
              link: `/surah/${result.surahNumber}?verse=${result.verseNumber}`,
            });
          });
        }

        if (searchFilter === 'all' || searchFilter === 'hadith') {
          const hadithResults = await searchHadiths(searchQuery, 'all', language, 1, 5);
          hadithResults.hadiths.forEach((result: HadithResponse) => {
            const collection = hadithCollections.find(c => c.id === result.bookSlug);
            const collectionName = language === 'bn' ? collection?.nameBn : collection?.name;
            const text = language === 'bn' ? result.hadithBengali : result.hadithEnglish;
            results.push({
              type: 'hadith',
              id: `${result.bookSlug}-${result.hadithNumber}`,
              title: `${collectionName || result.bookSlug} #${result.hadithNumber}`,
              subtitle: '',
              preview: (text || '').substring(0, 100) + '...',
              link: `/hadith?collection=${result.bookSlug}&hadith=${result.hadithNumber}`,
            });
          });
        }

        // Interleave results for 'all' filter
        if (searchFilter === 'all') {
          const quranItems = results.filter(r => r.type === 'quran');
          const hadithItems = results.filter(r => r.type === 'hadith');
          const interleaved: SearchSuggestion[] = [];
          const maxLen = Math.max(quranItems.length, hadithItems.length);
          for (let i = 0; i < maxLen; i++) {
            if (quranItems[i]) interleaved.push(quranItems[i]);
            if (hadithItems[i]) interleaved.push(hadithItems[i]);
          }
          setSuggestions(interleaved.slice(0, 6));
        } else {
          setSuggestions(results.slice(0, 6));
        }

        setIsOpen(results.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, searchFilter, language]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&filter=${searchFilter}`);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setIsOpen(false);
    setSearchQuery('');
    navigate(suggestion.link);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative flex items-center">
            <div className="absolute left-3 sm:left-4 flex items-center text-muted-foreground">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <Input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder={t('hero.search')}
              className="w-full pl-10 sm:pl-12 pr-28 sm:pr-44 py-5 sm:py-6 text-sm sm:text-base rounded-full bg-card text-foreground border-2 border-gold/20 shadow-xl shadow-gold/5 focus-visible:ring-2 focus-visible:ring-gold/30 focus-visible:border-gold/40"
              autoComplete="off"
            />
            <div className="absolute right-1 sm:right-2 flex items-center gap-0.5 sm:gap-1">
              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 sm:h-9 px-2 sm:px-3 rounded-full text-xs sm:text-sm font-medium text-muted-foreground hover:text-gold hover:bg-gold/10 gap-0.5 sm:gap-1"
                  >
                    <span className="hidden xs:inline">
                      {language === 'bn' ? filterLabels[searchFilter].bn : filterLabels[searchFilter].en}
                    </span>
                    <span className="xs:hidden">
                      {searchFilter === 'all' ? '∀' : searchFilter === 'quran' ? 'Q' : 'H'}
                    </span>
                    <ChevronDown className="h-3 w-3" />
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
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full text-muted-foreground hover:text-gold hover:bg-gold/10"
              >
                <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                type="submit"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
              >
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0 border border-border shadow-xl bg-popover/95 backdrop-blur-sm"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <ScrollArea className="max-h-[300px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="py-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.id}-${index}`}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      "w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors flex items-start gap-3",
                      index !== suggestions.length - 1 && "border-b border-border/50"
                    )}
                  >
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5",
                      suggestion.type === 'quran' 
                        ? "bg-primary/10 text-primary" 
                        : "bg-gold/10 text-gold"
                    )}>
                      {suggestion.type === 'quran' ? (
                        <BookOpen className="h-4 w-4" />
                      ) : (
                        <ScrollText className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground truncate">
                          {suggestion.title}
                        </span>
                        {suggestion.subtitle && (
                          <span className="text-xs text-muted-foreground truncate">
                            {suggestion.subtitle}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {suggestion.preview}
                      </p>
                    </div>
                  </button>
                ))}
                
                {/* View all results link */}
                {suggestions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&filter=${searchFilter}`);
                    }}
                    className="w-full px-4 py-3 text-center text-sm font-medium text-primary hover:bg-accent/50 transition-colors border-t border-border"
                  >
                    {language === 'bn' ? 'সব ফলাফল দেখুন' : 'View all results'} →
                  </button>
                )}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </form>
  );
};

export default SearchAutocomplete;
