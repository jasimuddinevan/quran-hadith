import React, { useState } from 'react';
import { Book, Search, Copy, Bookmark, Loader2, ArrowLeft, ChevronRight, RefreshCw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { 
  hadithCollections, 
  fetchHadithsByCollection, 
  fetchRandomHadiths,
  getCollectionName,
  type HadithResponse 
} from '@/lib/hadithApi';

const Hadith: React.FC = () => {
  const { t, isEnglish, isBengali, language } = useLanguage();
  const { addBookmark } = useBookmarks();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Fetch random hadiths for browse tab - pass language for translation
  const { data: randomHadiths, isLoading: isLoadingRandom, refetch: refetchRandom } = useQuery({
    queryKey: ['randomHadiths', language],
    queryFn: () => fetchRandomHadiths(5, language),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch hadiths by collection - pass language for translation
  const { data: collectionData, isLoading: isLoadingCollection } = useQuery({
    queryKey: ['hadithsByCollection', selectedCollection, page, language],
    queryFn: () => fetchHadithsByCollection(selectedCollection!, page, 10, language),
    enabled: !!selectedCollection,
  });

  const handleCopy = (hadith: HadithResponse) => {
    const text = `${hadith.hadithArabic}\n\n${hadith.hadithEnglish}\n\n- ${getCollectionName(hadith.bookSlug)}`;
    navigator.clipboard.writeText(text);
    toast({
      title: isEnglish ? 'Copied!' : 'কপি হয়েছে!',
      description: isEnglish ? 'Hadith copied to clipboard' : 'হাদিস ক্লিপবোর্ডে কপি হয়েছে',
    });
  };

  const handleBookmark = (hadith: HadithResponse) => {
    addBookmark({
      type: 'hadith',
      title: getCollectionName(hadith.bookSlug, isEnglish ? 'en' : 'bn'),
      arabic: hadith.hadithArabic,
      translation: isBengali && hadith.hadithBengali ? hadith.hadithBengali : hadith.hadithEnglish,
      reference: `Hadith #${hadith.hadithNumber}`,
    });
    toast({
      title: isEnglish ? 'Bookmarked!' : 'বুকমার্ক হয়েছে!',
      description: isEnglish ? 'Hadith added to bookmarks' : 'হাদিস বুকমার্কে যোগ হয়েছে',
    });
  };

  const filteredHadiths = (randomHadiths || []).filter((hadith) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      hadith.hadithEnglish.toLowerCase().includes(query) ||
      hadith.hadithArabic.includes(query) ||
      (hadith.hadithBengali && hadith.hadithBengali.includes(query))
    );
  });

  const HadithSkeleton = () => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Skeleton className="h-5 w-24" />
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        <Skeleton className="h-16 w-full mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-4 w-48" />
      </CardContent>
    </Card>
  );

  const renderHadithCard = (hadith: HadithResponse) => (
    <Card key={`${hadith.bookSlug}-${hadith.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Badge variant="secondary" className="text-xs">
            {getCollectionName(hadith.bookSlug, isEnglish ? 'en' : 'bn')} #{hadith.hadithNumber}
          </Badge>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(hadith)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleBookmark(hadith)}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {hadith.hadithArabic && (
          <p className="arabic-text text-xl text-right leading-loose text-foreground mb-4">
            {hadith.hadithArabic}
          </p>
        )}

        <p className="text-muted-foreground leading-relaxed mb-4">
          {isBengali && hadith.hadithBengali ? hadith.hadithBengali : hadith.hadithEnglish}
        </p>

        {hadith.chapterTitle && (
          <div className="text-xs text-muted-foreground border-t border-border pt-4">
            <span>{hadith.chapterTitle}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-500/10 mb-4">
            <Book className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('hadith.title')}
          </h1>
          <p className="text-muted-foreground">
            {isEnglish ? 'Authentic sayings of Prophet Muhammad (ﷺ)' : 'নবী মুহাম্মদ (সা.) এর বিশ্বস্ত হাদিস'}
          </p>
        </div>

        {/* If collection is selected, show collection hadiths */}
        {selectedCollection ? (
          <div>
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => {
                setSelectedCollection(null);
                setPage(1);
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isEnglish ? 'Back to Collections' : 'সংকলনে ফিরুন'}
            </Button>

            <h2 className="text-2xl font-semibold mb-6">
              {getCollectionName(selectedCollection, isEnglish ? 'en' : 'bn')}
            </h2>

            {isLoadingCollection ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <HadithSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {collectionData?.hadiths.map(renderHadithCard)}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    {isEnglish ? 'Previous' : 'পূর্ববর্তী'}
                  </Button>
                  <span className="flex items-center text-muted-foreground">
                    {isEnglish ? `Page ${page}` : `পৃষ্ঠা ${page}`}
                  </span>
                  <Button
                    variant="outline"
                    disabled={!collectionData?.hasMore}
                    onClick={() => setPage(p => p + 1)}
                  >
                    {isEnglish ? 'Next' : 'পরবর্তী'}
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Tabs defaultValue="collections" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="collections">
                {isEnglish ? 'Collections' : 'সংকলন'}
              </TabsTrigger>
              <TabsTrigger value="browse">
                {isEnglish ? 'Browse' : 'ব্রাউজ'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="collections">
              {/* Hadith Collections Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {hadithCollections.map((collection) => (
                  <Card 
                    key={collection.id}
                    className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
                    onClick={() => setSelectedCollection(collection.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                          <Book className="h-5 w-5 text-amber-600" />
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="arabic-text text-lg text-primary mb-1">
                        {collection.nameAr}
                      </p>
                      <h3 className="font-semibold text-foreground mb-1">
                        {isEnglish ? collection.name : collection.nameBn}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {collection.count.toLocaleString()} {isEnglish ? 'hadiths' : 'হাদিস'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="browse">
              {/* Search and Refresh */}
              <div className="max-w-md mx-auto mb-8 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={isEnglish ? 'Search hadith...' : 'হাদিস খুঁজুন...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => refetchRandom()}
                  disabled={isLoadingRandom}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoadingRandom ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {/* Hadith List */}
              <div className="space-y-4">
                {isLoadingRandom ? (
                  [...Array(3)].map((_, i) => <HadithSkeleton key={i} />)
                ) : filteredHadiths.length > 0 ? (
                  filteredHadiths.map(renderHadithCard)
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {isEnglish ? 'No hadiths found' : 'কোনো হাদিস পাওয়া যায়নি'}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default Hadith;
