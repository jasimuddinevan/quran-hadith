import React, { useState } from 'react';
import { Book, Search, ChevronRight, Copy, Bookmark } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface Hadith {
  id: number;
  arabic: string;
  translation: string;
  narrator: string;
  source: string;
  book: string;
  chapter: string;
}

const hadithCollections = [
  { id: 'bukhari', name: 'Sahih Bukhari', nameAr: 'صحيح البخاري', count: 7563 },
  { id: 'muslim', name: 'Sahih Muslim', nameAr: 'صحيح مسلم', count: 7470 },
  { id: 'tirmidhi', name: 'Jami at-Tirmidhi', nameAr: 'جامع الترمذي', count: 3956 },
  { id: 'abudawud', name: 'Sunan Abu Dawud', nameAr: 'سنن أبي داود', count: 5274 },
  { id: 'nasai', name: "Sunan an-Nasa'i", nameAr: 'سنن النسائي', count: 5761 },
  { id: 'ibnmajah', name: 'Sunan Ibn Majah', nameAr: 'سنن ابن ماجه', count: 4341 },
];

const sampleHadiths: Hadith[] = [
  {
    id: 1,
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    translation: 'Actions are judged by intentions, and everyone will be rewarded according to what he intended.',
    narrator: 'Umar ibn Al-Khattab (RA)',
    source: 'Sahih Bukhari',
    book: 'Book of Revelation',
    chapter: 'Chapter 1',
  },
  {
    id: 2,
    arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    translation: 'A Muslim is one from whose tongue and hand other Muslims are safe.',
    narrator: 'Abdullah ibn Amr (RA)',
    source: 'Sahih Bukhari',
    book: 'Book of Faith',
    chapter: 'Chapter 3',
  },
  {
    id: 3,
    arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    translation: 'None of you truly believes until he loves for his brother what he loves for himself.',
    narrator: 'Anas ibn Malik (RA)',
    source: 'Sahih Bukhari',
    book: 'Book of Faith',
    chapter: 'Chapter 7',
  },
  {
    id: 4,
    arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    translation: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
    narrator: 'Abu Hurairah (RA)',
    source: 'Sahih Bukhari',
    book: 'Book of Good Manners',
    chapter: 'Chapter 31',
  },
  {
    id: 5,
    arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ',
    translation: 'Cleanliness is half of faith.',
    narrator: 'Abu Malik al-Ashari (RA)',
    source: 'Sahih Muslim',
    book: 'Book of Purification',
    chapter: 'Chapter 1',
  },
];

const Hadith: React.FC = () => {
  const { t, isEnglish } = useLanguage();
  const { addBookmark } = useBookmarks();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const handleCopy = (hadith: Hadith) => {
    const text = `${hadith.arabic}\n\n${hadith.translation}\n\n- ${hadith.source}, ${hadith.book}`;
    navigator.clipboard.writeText(text);
    toast({
      title: isEnglish ? 'Copied!' : 'কপি হয়েছে!',
      description: isEnglish ? 'Hadith copied to clipboard' : 'হাদিস ক্লিপবোর্ডে কপি হয়েছে',
    });
  };

  const handleBookmark = (hadith: Hadith) => {
    addBookmark({
      type: 'hadith',
      title: hadith.source,
      arabic: hadith.arabic,
      translation: hadith.translation,
      reference: `${hadith.book}, ${hadith.chapter}`,
    });
    toast({
      title: isEnglish ? 'Bookmarked!' : 'বুকমার্ক হয়েছে!',
      description: isEnglish ? 'Hadith added to bookmarks' : 'হাদিস বুকমার্কে যোগ হয়েছে',
    });
  };

  const filteredHadiths = sampleHadiths.filter((hadith) => {
    const query = searchQuery.toLowerCase();
    return (
      hadith.translation.toLowerCase().includes(query) ||
      hadith.narrator.toLowerCase().includes(query) ||
      hadith.source.toLowerCase().includes(query)
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
                      <p className="arabic-text text-lg text-primary">
                        {collection.nameAr}
                      </p>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {collection.name}
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
            {/* Search */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={isEnglish ? 'Search hadith...' : 'হাদিস খুঁজুন...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Hadith List */}
            <div className="space-y-4">
              {filteredHadiths.map((hadith) => (
                <Card key={hadith.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {hadith.source}
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

                    <p className="arabic-text text-xl text-right leading-loose text-foreground mb-4">
                      {hadith.arabic}
                    </p>

                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {hadith.translation}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground border-t border-border pt-4">
                      <span>{t('hadith.narrator')}: {hadith.narrator}</span>
                      <span>•</span>
                      <span>{hadith.book}, {hadith.chapter}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Hadith;
