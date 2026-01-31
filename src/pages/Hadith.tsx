import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Book, Search, ArrowLeft, RefreshCw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { 
  hadithCollections, 
  fetchHadithsByCollection, 
  fetchRandomHadiths,
  fetchCollectionMetadata,
  fetchHadithsBySection,
  getCollectionName,
} from '@/lib/hadithApi';
import HadithCard from '@/components/hadith/HadithCard';
import CollectionCard from '@/components/hadith/CollectionCard';
import SectionList from '@/components/hadith/SectionList';
import HadithSkeleton from '@/components/hadith/HadithSkeleton';

const Hadith: React.FC = () => {
  const { t, isEnglish, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const collectionParam = searchParams.get('collection');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<{ number: number; name: string } | null>(null);
  const [page, setPage] = useState(1);

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
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    onClick={() => setSelectedCollection(collection.id)}
                  />
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
