import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search as SearchIcon, Book, BookOpen, Clock, ArrowLeft, ChevronLeft, ChevronRight, Home, Filter } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { searchQuran, type QuranSearchResult } from '@/lib/quranApi';
import { searchHadiths, getCollectionName, type HadithResponse } from '@/lib/hadithApi';

type FilterType = 'all' | 'quran' | 'hadith';

interface CombinedResult {
  type: 'quran' | 'hadith';
  quranResult?: QuranSearchResult;
  hadithResult?: HadithResponse;
}

const SearchResultCard: React.FC<{ result: CombinedResult; query: string; language: 'en' | 'bn' }> = ({ 
  result, 
  query,
  language 
}) => {
  const navigate = useNavigate();
  
  const highlightText = (text: string) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-gold/30 text-foreground px-0.5 rounded">{part}</mark> : part
    );
  };

  if (result.type === 'quran' && result.quranResult) {
    const r = result.quranResult;
    return (
      <Card 
        className="hover:shadow-md transition-all duration-200 cursor-pointer border-border/50 hover:border-primary/30 group"
        onClick={() => navigate(`/quran/${r.surahNumber}?verse=${r.verseNumber}`)}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <Badge className="bg-primary/20 text-primary border-primary/30 shrink-0 w-fit">
              <BookOpen className="h-3 w-3 mr-1" />
              {language === 'bn' ? 'কুরআন' : 'Quran'}
            </Badge>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
                {language === 'bn' ? 'সূরা' : 'Surah'} {r.surahName} • {language === 'bn' ? 'আয়াত' : 'Verse'} {r.verseNumber}
              </p>
              {r.textArabic && (
                <p className="text-base sm:text-lg font-arabic text-right mb-2 leading-loose line-clamp-2" dir="rtl">
                  {r.textArabic}
                </p>
              )}
              <p className="text-xs sm:text-sm text-foreground leading-relaxed line-clamp-3 group-hover:text-primary/80 transition-colors">
                {highlightText(r.textTranslation)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (result.type === 'hadith' && result.hadithResult) {
    const h = result.hadithResult;
    const collectionName = getCollectionName(h.bookSlug, language);
    const displayText = language === 'bn' ? (h.hadithBengali || h.hadithEnglish) : h.hadithEnglish;
    
    return (
      <Card 
        className="hover:shadow-md transition-all duration-200 cursor-pointer border-border/50 hover:border-gold/30 group"
        onClick={() => navigate(`/hadith?collection=${h.bookSlug}&hadith=${h.hadithNumber}`)}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <Badge className="bg-gold/20 text-gold border-gold/30 shrink-0 w-fit">
              <Book className="h-3 w-3 mr-1" />
              {language === 'bn' ? 'হাদিস' : 'Hadith'}
            </Badge>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">
                {collectionName} #{h.hadithNumber}
              </p>
              {h.hadithArabic && (
                <p className="text-base sm:text-lg font-arabic text-right mb-2 leading-loose line-clamp-2" dir="rtl">
                  {h.hadithArabic}
                </p>
              )}
              <p className="text-xs sm:text-sm text-foreground leading-relaxed line-clamp-3 group-hover:text-gold/80 transition-colors">
                {highlightText(displayText)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

const SearchSkeleton: React.FC = () => (
  <div className="space-y-3 sm:space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <Card key={i} className="border-border/50">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <Skeleton className="h-5 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 sm:h-4 w-32 sm:w-48" />
              <Skeleton className="h-5 sm:h-6 w-full" />
              <Skeleton className="h-3 sm:h-4 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const SearchPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q') || '';
  const filter = (searchParams.get('filter') as FilterType) || 'all';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  
  const [searchInput, setSearchInput] = useState(query);
  const [activeTab, setActiveTab] = useState<FilterType>(filter);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  
  const [quranResults, setQuranResults] = useState<QuranSearchResult[]>([]);
  const [hadithResults, setHadithResults] = useState<HadithResponse[]>([]);
  const [quranTotal, setQuranTotal] = useState(0);
  const [hadithTotal, setHadithTotal] = useState(0);

  const pageSize = 20;

  useEffect(() => {
    if (!query) return;

    const performSearch = async () => {
      setIsLoading(true);
      const startTime = Date.now();

      try {
        const searchPromises: Promise<any>[] = [];

        if (activeTab === 'all' || activeTab === 'quran') {
          searchPromises.push(
            searchQuran(query, language, currentPage, pageSize)
              .then((res) => {
                setQuranResults(res.results);
                setQuranTotal(res.totalResults);
              })
          );
        } else {
          setQuranResults([]);
          setQuranTotal(0);
        }

        if (activeTab === 'all' || activeTab === 'hadith') {
          searchPromises.push(
            searchHadiths(query, 'all', language, currentPage, pageSize)
              .then((res) => {
                setHadithResults(res.hadiths);
                setHadithTotal(res.totalFound);
              })
          );
        } else {
          setHadithResults([]);
          setHadithTotal(0);
        }

        await Promise.all(searchPromises);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setSearchTime((Date.now() - startTime) / 1000);
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query, activeTab, currentPage, language]);

  const combinedResults = useMemo<CombinedResult[]>(() => {
    const results: CombinedResult[] = [];
    
    if (activeTab === 'all') {
      const maxLen = Math.max(quranResults.length, hadithResults.length);
      for (let i = 0; i < maxLen; i++) {
        if (i < quranResults.length) {
          results.push({ type: 'quran', quranResult: quranResults[i] });
        }
        if (i < hadithResults.length) {
          results.push({ type: 'hadith', hadithResult: hadithResults[i] });
        }
      }
    } else if (activeTab === 'quran') {
      quranResults.forEach(r => results.push({ type: 'quran', quranResult: r }));
    } else {
      hadithResults.forEach(r => results.push({ type: 'hadith', hadithResult: r }));
    }
    
    return results;
  }, [quranResults, hadithResults, activeTab]);

  const totalResults = activeTab === 'all' 
    ? quranTotal + hadithTotal 
    : activeTab === 'quran' ? quranTotal : hadithTotal;

  const totalPages = Math.ceil(totalResults / pageSize);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCurrentPage(1);
      setSearchParams({ q: searchInput.trim(), filter: activeTab, page: '1' });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as FilterType);
    setCurrentPage(1);
    setSearchParams({ q: query, filter: tab, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSearchParams({ q: query, filter: activeTab, page: String(newPage) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filterLabels: Record<FilterType, { en: string; bn: string }> = {
    all: { en: 'All', bn: 'সব' },
    quran: { en: 'Quran', bn: 'কুরআন' },
    hadith: { en: 'Hadith', bn: 'হাদিস' },
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <Layout>
      <div className="container py-4 sm:py-6 px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-4 sm:mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                  <Home className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{language === 'bn' ? 'হোম' : 'Home'}</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground font-medium">
                {language === 'bn' ? 'সার্চ' : 'Search'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Search Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
            className="shrink-0 w-fit gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{language === 'bn' ? 'ফিরে যান' : 'Back'}</span>
          </Button>
          
          <form onSubmit={handleSearch} className="flex-1 w-full">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t('hero.search')}
                className="pl-10 pr-24 sm:pr-28 py-2.5 text-sm sm:text-base"
              />
              {/* Mobile Filter Dropdown */}
              <div className="absolute right-2 flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm gap-1"
                    >
                      <Filter className="h-3.5 w-3.5 sm:hidden" />
                      <span className="hidden sm:inline">
                        {language === 'bn' ? filterLabels[activeTab].bn : filterLabels[activeTab].en}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleTabChange('all')}>
                      {language === 'bn' ? 'সব' : 'All'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTabChange('quran')}>
                      {language === 'bn' ? 'কুরআন' : 'Quran'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTabChange('hadith')}>
                      {language === 'bn' ? 'হাদিস' : 'Hadith'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  type="submit"
                  size="sm"
                  className="h-7 sm:h-8 px-2 sm:px-3"
                >
                  <SearchIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Results header */}
        {query && (
          <div className="mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 line-clamp-1">
              {t('search.resultsFor')} "<span className="text-primary">{query}</span>"
            </h1>
            {!isLoading && (
              <p className="text-xs sm:text-sm text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{t('search.found')} <strong>{totalResults.toLocaleString()}</strong> {t('search.results')}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {searchTime.toFixed(2)} {t('search.seconds')}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Filter tabs - Desktop */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-4 sm:mb-6">
          <TabsList className="bg-muted/50 hidden sm:inline-flex">
            <TabsTrigger value="all" className="gap-2">
              {t('search.all')}
              {!isLoading && query && (
                <Badge variant="secondary" className="text-xs">
                  {(quranTotal + hadithTotal).toLocaleString()}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="quran" className="gap-2">
              {t('search.quran')}
              {!isLoading && query && (
                <Badge variant="secondary" className="text-xs">
                  {quranTotal.toLocaleString()}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="hadith" className="gap-2">
              {t('search.hadith')}
              {!isLoading && query && (
                <Badge variant="secondary" className="text-xs">
                  {hadithTotal.toLocaleString()}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Mobile filter pills */}
          <div className="flex sm:hidden gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {(['all', 'quran', 'hadith'] as FilterType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {language === 'bn' ? filterLabels[tab].bn : filterLabels[tab].en}
                {!isLoading && query && (
                  <span className="ml-1.5 opacity-80">
                    {tab === 'all' 
                      ? (quranTotal + hadithTotal).toLocaleString() 
                      : tab === 'quran' 
                        ? quranTotal.toLocaleString() 
                        : hadithTotal.toLocaleString()
                    }
                  </span>
                )}
              </button>
            ))}
          </div>

          <TabsContent value={activeTab} className="mt-4 sm:mt-6">
            {isLoading ? (
              <SearchSkeleton />
            ) : combinedResults.length === 0 && query ? (
              <div className="text-center py-8 sm:py-12">
                <SearchIcon className="h-10 sm:h-12 w-10 sm:w-12 mx-auto text-muted-foreground/50 mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium mb-2">{t('search.noResults')}</h3>
                <p className="text-sm text-muted-foreground px-4">{t('search.tryDifferent')}</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {combinedResults.map((result, index) => (
                  <SearchResultCard 
                    key={`${result.type}-${index}`} 
                    result={result} 
                    query={query}
                    language={language}
                  />
                ))}
              </div>
            )}

            {/* Enhanced Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                {/* Mobile: Simple prev/next */}
                <div className="flex sm:hidden items-center gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="flex-1"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {language === 'bn' ? 'পূর্ব' : 'Prev'}
                  </Button>
                  <span className="text-sm text-muted-foreground whitespace-nowrap px-2">
                    {currentPage}/{totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="flex-1"
                  >
                    {language === 'bn' ? 'পরবর্তী' : 'Next'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {/* Desktop: Full pagination */}
                <div className="hidden sm:flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {language === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
                  </Button>
                  
                  <div className="flex items-center gap-1 mx-2">
                    {getPageNumbers().map((page, index) => (
                      page === 'ellipsis' ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">...</span>
                      ) : (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-9 h-9 p-0"
                        >
                          {page}
                        </Button>
                      )
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    {language === 'bn' ? 'পরবর্তী' : 'Next'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {/* Results info */}
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {language === 'bn' 
                    ? `${((currentPage - 1) * pageSize) + 1}-${Math.min(currentPage * pageSize, totalResults)} এর ${totalResults}`
                    : `${((currentPage - 1) * pageSize) + 1}-${Math.min(currentPage * pageSize, totalResults)} of ${totalResults}`
                  }
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Empty state when no query */}
        {!query && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <SearchIcon className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              {language === 'bn' ? 'কুরআন ও হাদিস খুঁজুন' : 'Search Quran & Hadith'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto px-4">
              {language === 'bn' 
                ? 'বাংলা বা ইংরেজিতে সার্চ করুন এবং কুরআন ও হাদিস থেকে আপনার প্রশ্নের উত্তর খুঁজুন'
                : 'Search in Bengali or English to find answers from the Quran and Hadith collections'
              }
            </p>
            
            {/* Quick search suggestions */}
            <div className="mt-6 flex flex-wrap justify-center gap-2 px-4">
              {[
                { en: 'prayer', bn: 'নামাজ' },
                { en: 'patience', bn: 'ধৈর্য' },
                { en: 'mercy', bn: 'রহমত' },
                { en: 'charity', bn: 'দান' },
              ].map((term) => (
                <Button
                  key={term.en}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const q = language === 'bn' ? term.bn : term.en;
                    setSearchInput(q);
                    setSearchParams({ q, filter: activeTab, page: '1' });
                  }}
                  className="rounded-full text-xs"
                >
                  {language === 'bn' ? term.bn : term.en}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
