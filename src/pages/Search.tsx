import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Book, BookOpen, Clock, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
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
        className="hover:shadow-md transition-shadow cursor-pointer border-border/50"
        onClick={() => navigate(`/quran/${r.surahNumber}?verse=${r.verseNumber}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Badge className="bg-primary/20 text-primary border-primary/30 shrink-0">
              <BookOpen className="h-3 w-3 mr-1" />
              {language === 'bn' ? 'কুরআন' : 'Quran'}
            </Badge>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {language === 'bn' ? 'সূরা' : 'Surah'} {r.surahName} • {language === 'bn' ? 'আয়াত' : 'Verse'} {r.verseNumber}
              </p>
              {r.textArabic && (
                <p className="text-lg font-arabic text-right mb-2 leading-loose" dir="rtl">
                  {r.textArabic}
                </p>
              )}
              <p className="text-sm text-foreground leading-relaxed">
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
        className="hover:shadow-md transition-shadow cursor-pointer border-border/50"
        onClick={() => navigate(`/hadith?collection=${h.bookSlug}&hadith=${h.hadithNumber}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Badge className="bg-gold/20 text-gold border-gold/30 shrink-0">
              <Book className="h-3 w-3 mr-1" />
              {language === 'bn' ? 'হাদিস' : 'Hadith'}
            </Badge>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {collectionName} #{h.hadithNumber}
              </p>
              {h.hadithArabic && (
                <p className="text-lg font-arabic text-right mb-2 leading-loose line-clamp-2" dir="rtl">
                  {h.hadithArabic}
                </p>
              )}
              <p className="text-sm text-foreground leading-relaxed line-clamp-3">
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
  <div className="space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <Card key={i} className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-6 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
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
      // Interleave quran and hadith results
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

  return (
    <Layout>
      <div className="container py-6">
        {/* Back button and search bar */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t('hero.search')}
                className="pl-10 pr-4"
              />
            </div>
          </form>
        </div>

        {/* Results header */}
        {query && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              {t('search.resultsFor')} "{query}"
            </h1>
            {!isLoading && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span>{t('search.found')} {totalResults} {t('search.results')}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {searchTime.toFixed(2)} {t('search.seconds')}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Filter tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all" className="gap-2">
              {t('search.all')}
              {!isLoading && query && (
                <Badge variant="secondary" className="text-xs">
                  {quranTotal + hadithTotal}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="quran" className="gap-2">
              {t('search.quran')}
              {!isLoading && query && (
                <Badge variant="secondary" className="text-xs">
                  {quranTotal}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="hadith" className="gap-2">
              {t('search.hadith')}
              {!isLoading && query && (
                <Badge variant="secondary" className="text-xs">
                  {hadithTotal}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <SearchSkeleton />
            ) : combinedResults.length === 0 && query ? (
              <div className="text-center py-12">
                <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('search.noResults')}</h3>
                <p className="text-muted-foreground">{t('search.tryDifferent')}</p>
              </div>
            ) : (
              <div className="space-y-4">
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

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {language === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  {language === 'bn' 
                    ? `পৃষ্ঠা ${currentPage} / ${totalPages}`
                    : `Page ${currentPage} of ${totalPages}`
                  }
                </span>
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
            )}
          </TabsContent>
        </Tabs>

        {/* Empty state when no query */}
        {!query && (
          <div className="text-center py-12">
            <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-medium mb-2">
              {language === 'bn' ? 'কুরআন ও হাদিস খুঁজুন' : 'Search Quran & Hadith'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {language === 'bn' 
                ? 'বাংলা বা ইংরেজিতে সার্চ করুন এবং কুরআন ও হাদিস থেকে আপনার প্রশ্নের উত্তর খুঁজুন'
                : 'Search in Bengali or English to find answers from the Quran and Hadith collections'
              }
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
