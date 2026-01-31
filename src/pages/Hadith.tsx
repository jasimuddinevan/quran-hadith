import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Book, Search, ArrowLeft, RefreshCw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { 
  hadithCollections, 
  fetchHadithsByCollection, 
  fetchRandomHadiths,
  fetchCollectionMetadata,
  fetchHadithsBySection,
  getCollectionName,
  searchHadiths,
} from '@/lib/hadithApi';
import HadithCard from '@/components/hadith/HadithCard';
import CollectionCard from '@/components/hadith/CollectionCard';
import SectionList from '@/components/hadith/SectionList';
import HadithSkeleton from '@/components/hadith/HadithSkeleton';

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Hadith: React.FC = () => {
  const { t, isEnglish, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const collectionParam = searchParams.get('collection');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<{ number: number; name: string } | null>(null);
  const [page, setPage] = useState(1);
  
  // Search-specific state
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchCollectionFilter, setSearchCollectionFilter] = useState<string>('all');
  const debouncedSearchQuery = useDebounce(searchInputValue, 300);

  // Set collection from URL param on mount
  useEffect(() => {
    if (collectionParam) {
      const matchingCollection = hadithCollections.find(c => c.id === collectionParam);
      if (matchingCollection) {
        setSelectedCollection(matchingCollection.id);
      }
    }
  }, [collectionParam]);

  // Fetch random hadiths for browse tab
  const { data: randomHadiths, isLoading: isLoadingRandom, refetch: refetchRandom } = useQuery({
    queryKey: ['randomHadiths', language],
    queryFn: () => fetchRandomHadiths(5, language),
    staleTime: 1000 * 60 * 5,
  });

  // Search hadiths query
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['hadithSearch', debouncedSearchQuery, searchCollectionFilter, language],
    queryFn: () => searchHadiths(debouncedSearchQuery, searchCollectionFilter, language),
    enabled: debouncedSearchQuery.length >= 3,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch collection metadata (sections/chapters)
  const { data: collectionMetadata, isLoading: isLoadingMetadata } = useQuery({
    queryKey: ['collectionMetadata', selectedCollection],
    queryFn: () => fetchCollectionMetadata(selectedCollection!),
    enabled: !!selectedCollection && !selectedSection,
  });

  // Fetch hadiths by section
  const { data: sectionHadiths, isLoading: isLoadingSectionHadiths } = useQuery({
    queryKey: ['sectionHadiths', selectedCollection, selectedSection?.number, language],
    queryFn: () => fetchHadithsBySection(selectedCollection!, selectedSection!.number, language),
    enabled: !!selectedCollection && !!selectedSection,
  });

  // Fetch hadiths by collection (paginated, for "All Hadiths" view)
  const { data: collectionData, isLoading: isLoadingCollection } = useQuery({
    queryKey: ['hadithsByCollection', selectedCollection, page, language],
    queryFn: () => fetchHadithsByCollection(selectedCollection!, page, 10, language),
    enabled: !!selectedCollection && !selectedSection,
  });

  const handleBack = () => {
    if (selectedSection) {
      setSelectedSection(null);
    } else {
      setSelectedCollection(null);
      setPage(1);
    }
  };

  const filteredHadiths = (randomHadiths || []).filter((hadith) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      hadith.hadithEnglish.toLowerCase().includes(query) ||
      (hadith.hadithBengali && hadith.hadithBengali.includes(query))
    );
  });

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

        {/* If collection is selected */}
        {selectedCollection ? (
          <div>
            <Button
              variant="ghost"
              className="mb-6"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {selectedSection 
                ? (isEnglish ? 'Back to Chapters' : 'অধ্যায়ে ফিরুন')
                : (isEnglish ? 'Back to Collections' : 'সংকলনে ফিরুন')
              }
            </Button>

            <h2 className="text-2xl font-semibold mb-2">
              {getCollectionName(selectedCollection, isEnglish ? 'en' : 'bn')}
            </h2>
            
            {selectedSection && (
              <p className="text-muted-foreground mb-6">
                {isEnglish ? 'Chapter' : 'অধ্যায়'} {selectedSection.number}: {selectedSection.name}
              </p>
            )}

            {/* Show section hadiths if section is selected */}
            {selectedSection ? (
              isLoadingSectionHadiths ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <HadithSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sectionHadiths?.map((hadith) => (
                    <HadithCard key={hadith.id} hadith={hadith} showCollection={false} />
                  ))}
                  {sectionHadiths?.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {isEnglish ? 'No hadiths found in this chapter' : 'এই অধ্যায়ে কোনো হাদিস পাওয়া যায়নি'}
                    </div>
                  )}
                </div>
              )
            ) : (
              /* Show chapters/sections */
              <Tabs defaultValue="chapters" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                  <TabsTrigger value="chapters">
                    {isEnglish ? 'Chapters' : 'অধ্যায়সমূহ'}
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    {isEnglish ? 'All Hadiths' : 'সকল হাদিস'}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chapters">
                  <SectionList 
                    metadata={collectionMetadata || null} 
                    isLoading={isLoadingMetadata}
                    onSelectSection={(number, name) => setSelectedSection({ number, name })}
                  />
                </TabsContent>

                <TabsContent value="all">
                  {isLoadingCollection ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <HadithSkeleton key={i} />
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {collectionData?.hadiths.map((hadith) => (
                          <HadithCard key={hadith.id} hadith={hadith} showCollection={false} />
                        ))}
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
                </TabsContent>
              </Tabs>
            )}
          </div>
        ) : (
          <Tabs defaultValue="collections" className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="collections">
                {isEnglish ? 'Collections' : 'সংকলন'}
              </TabsTrigger>
              <TabsTrigger value="search">
                {isEnglish ? 'Search' : 'অনুসন্ধান'}
              </TabsTrigger>
              <TabsTrigger value="browse">
                {isEnglish ? 'Browse' : 'ব্রাউজ'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="collections">
              {/* Hadith Collections Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {hadithCollections.map((collection) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    onClick={() => setSelectedCollection(collection.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="search">
              {/* Search Input and Filter */}
              <div className="max-w-2xl mx-auto mb-6 space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={isEnglish ? 'Search hadiths by keyword...' : 'কীওয়ার্ড দিয়ে হাদিস খুঁজুন...'}
                      value={searchInputValue}
                      onChange={(e) => setSearchInputValue(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={searchCollectionFilter} onValueChange={setSearchCollectionFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={isEnglish ? 'All Collections' : 'সকল সংকলন'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{isEnglish ? 'All Collections' : 'সকল সংকলন'}</SelectItem>
                      {hadithCollections.map((collection) => (
                        <SelectItem key={collection.id} value={collection.id}>
                          {isEnglish ? collection.name : collection.nameBn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Search info/status */}
                {debouncedSearchQuery.length > 0 && debouncedSearchQuery.length < 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    {isEnglish ? 'Enter at least 3 characters to search' : 'অনুসন্ধানের জন্য কমপক্ষে ৩টি অক্ষর লিখুন'}
                  </p>
                )}
                {searchResults && debouncedSearchQuery.length >= 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    {isEnglish 
                      ? `Found ${searchResults.totalFound} hadith${searchResults.totalFound !== 1 ? 's' : ''}${searchResults.totalFound > 50 ? ' (showing first 50)' : ''}`
                      : `${searchResults.totalFound}টি হাদিস পাওয়া গেছে${searchResults.totalFound > 50 ? ' (প্রথম ৫০টি দেখানো হচ্ছে)' : ''}`
                    }
                  </p>
                )}
              </div>

              {/* Search Results */}
              <div className="space-y-4">
                {isSearching ? (
                  [...Array(3)].map((_, i) => <HadithSkeleton key={i} />)
                ) : debouncedSearchQuery.length >= 3 && searchResults ? (
                  searchResults.hadiths.length > 0 ? (
                    searchResults.hadiths.map((hadith) => (
                      <HadithCard key={`${hadith.bookSlug}-${hadith.id}`} hadith={hadith} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      {isEnglish ? 'No hadiths found matching your search' : 'আপনার অনুসন্ধানের সাথে মিলে যায় এমন কোনো হাদিস পাওয়া যায়নি'}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{isEnglish ? 'Search for hadiths by entering keywords' : 'কীওয়ার্ড লিখে হাদিস অনুসন্ধান করুন'}</p>
                    <p className="text-sm mt-2">
                      {isEnglish ? 'Search works in English, Bengali, and Arabic' : 'ইংরেজি, বাংলা এবং আরবিতে অনুসন্ধান করা যায়'}
                    </p>
                  </div>
                )}
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
                  filteredHadiths.map((hadith) => (
                    <HadithCard key={`${hadith.bookSlug}-${hadith.id}`} hadith={hadith} />
                  ))
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
