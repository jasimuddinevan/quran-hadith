import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Juz {
  number: number;
  name: string;
  englishName: string;
  startSurah: number;
  startAyah: number;
}

// Juz (Para) data with starting positions
const juzData: Juz[] = [
  { number: 1, name: 'آلم', englishName: 'Alif Lam Meem', startSurah: 1, startAyah: 1 },
  { number: 2, name: 'سَيَقُولُ', englishName: 'Sayaqul', startSurah: 2, startAyah: 142 },
  { number: 3, name: 'تِلْكَ الرُّسُلُ', englishName: 'Tilkal Rusul', startSurah: 2, startAyah: 253 },
  { number: 4, name: 'لَنْ تَنَالُوا', englishName: 'Lan Tanaloo', startSurah: 3, startAyah: 92 },
  { number: 5, name: 'وَالْمُحْصَنَاتُ', englishName: 'Wal Muhsanat', startSurah: 4, startAyah: 24 },
  { number: 6, name: 'لَا يُحِبُّ اللَّهُ', englishName: 'La Yuhibbullah', startSurah: 4, startAyah: 148 },
  { number: 7, name: 'وَإِذَا سَمِعُوا', englishName: 'Wa Iza Samiu', startSurah: 5, startAyah: 82 },
  { number: 8, name: 'وَلَوْ أَنَّنَا', englishName: 'Wa Law Annana', startSurah: 6, startAyah: 111 },
  { number: 9, name: 'قَالَ الْمَلَأُ', englishName: 'Qalal Malau', startSurah: 7, startAyah: 88 },
  { number: 10, name: 'وَاعْلَمُوا', englishName: "Wa A'lamu", startSurah: 8, startAyah: 41 },
  { number: 11, name: 'يَعْتَذِرُونَ', englishName: "Ya'taziruna", startSurah: 9, startAyah: 93 },
  { number: 12, name: 'وَمَا مِنْ دَابَّةٍ', englishName: 'Wa Ma Min Dabbah', startSurah: 11, startAyah: 6 },
  { number: 13, name: 'وَمَا أُبَرِّئُ', englishName: 'Wa Ma Ubarriu', startSurah: 12, startAyah: 53 },
  { number: 14, name: 'رُبَمَا', englishName: 'Rubama', startSurah: 15, startAyah: 1 },
  { number: 15, name: 'سُبْحَانَ الَّذِي', englishName: 'Subhanallazi', startSurah: 17, startAyah: 1 },
  { number: 16, name: 'قَالَ أَلَمْ', englishName: 'Qal Alam', startSurah: 18, startAyah: 75 },
  { number: 17, name: 'اقْتَرَبَ لِلنَّاسِ', englishName: 'Iqtaraba', startSurah: 21, startAyah: 1 },
  { number: 18, name: 'قَدْ أَفْلَحَ', englishName: 'Qad Aflaha', startSurah: 23, startAyah: 1 },
  { number: 19, name: 'وَقَالَ الَّذِينَ', englishName: 'Wa Qalallazina', startSurah: 25, startAyah: 21 },
  { number: 20, name: 'أَمَّنْ خَلَقَ', englishName: 'Amman Khalaq', startSurah: 27, startAyah: 56 },
  { number: 21, name: 'اتْلُ مَا أُوحِيَ', englishName: 'Utlu Ma Uhiya', startSurah: 29, startAyah: 45 },
  { number: 22, name: 'وَمَنْ يَقْنُتْ', englishName: 'Wa Man Yaqnut', startSurah: 33, startAyah: 31 },
  { number: 23, name: 'وَمَا لِيَ', englishName: 'Wa Mali', startSurah: 36, startAyah: 22 },
  { number: 24, name: 'فَمَنْ أَظْلَمُ', englishName: 'Faman Azlam', startSurah: 39, startAyah: 32 },
  { number: 25, name: 'إِلَيْهِ يُرَدُّ', englishName: 'Ilaihi Yuraddu', startSurah: 41, startAyah: 47 },
  { number: 26, name: 'حم', englishName: 'Ha Meem', startSurah: 46, startAyah: 1 },
  { number: 27, name: 'قَالَ فَمَا خَطْبُكُمْ', englishName: 'Qala Fama Khatbukum', startSurah: 51, startAyah: 31 },
  { number: 28, name: 'قَدْ سَمِعَ اللَّهُ', englishName: 'Qad Sami Allah', startSurah: 58, startAyah: 1 },
  { number: 29, name: 'تَبَارَكَ الَّذِي', englishName: 'Tabarakallazi', startSurah: 67, startAyah: 1 },
  { number: 30, name: 'عَمَّ يَتَسَاءَلُونَ', englishName: 'Amma Yatasaalun', startSurah: 78, startAyah: 1 },
];

const Quran: React.FC = () => {
  const { t, isEnglish } = useLanguage();
  const [searchParams] = useSearchParams();
  const defaultView = searchParams.get('view') === 'juz' ? 'juz' : 'surah';
  
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(defaultView);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        if (data.code === 200) {
          setSurahs(data.data);
        } else {
          setError('Failed to load Quran data');
        }
      } catch (err) {
        setError('Failed to fetch Quran data');
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter((surah) => {
    const query = searchQuery.toLowerCase();
    return (
      surah.englishName.toLowerCase().includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(query) ||
      surah.number.toString().includes(query)
    );
  });

  const filteredJuz = juzData.filter((juz) => {
    const query = searchQuery.toLowerCase();
    return (
      juz.englishName.toLowerCase().includes(query) ||
      juz.number.toString().includes(query)
    );
  });

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('quran.title')}
          </h1>
          <p className="text-muted-foreground">
            114 {t('quran.surahs')} • 30 {isEnglish ? 'Juz' : 'পারা'}
          </p>
        </div>

        {/* Tabs for Surah / Juz */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="surah">
              {isEnglish ? 'By Surah' : 'সূরা অনুযায়ী'}
            </TabsTrigger>
            <TabsTrigger value="juz">
              {isEnglish ? 'By Juz (Para)' : 'পারা অনুযায়ী'}
            </TabsTrigger>
          </TabsList>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={activeTab === 'surah' ? t('quran.searchSurah') : (isEnglish ? 'Search Juz...' : 'পারা খুঁজুন...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid gap-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          )}

          {/* Surah List */}
          <TabsContent value="surah">
            {!loading && !error && (
              <div className="grid gap-3">
                {filteredSurahs.map((surah) => (
                  <Link key={surah.number} to={`/quran/${surah.number}`}>
                    <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
                      <CardContent className="p-4 flex items-center gap-4">
                        {/* Surah Number */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-bold">{surah.number}</span>
                        </div>

                        {/* Surah Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {surah.englishName}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {surah.revelationType === 'Meccan' 
                                ? t('quran.meccan') 
                                : t('quran.medinan')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {surah.englishNameTranslation} • {surah.numberOfAyahs} {t('quran.verses')}
                          </p>
                        </div>

                        {/* Arabic Name */}
                        <div className="flex-shrink-0 text-right">
                          <p className="arabic-text text-xl text-primary">
                            {surah.name}
                          </p>
                        </div>

                        {/* Arrow */}
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && !error && filteredSurahs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {isEnglish ? 'No surahs found' : 'কোনো সূরা পাওয়া যায়নি'}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Juz List */}
          <TabsContent value="juz">
            <div className="grid gap-3">
              {filteredJuz.map((juz) => (
                <Link key={juz.number} to={`/quran/${juz.startSurah}?ayah=${juz.startAyah}`}>
                  <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
                    <CardContent className="p-4 flex items-center gap-4">
                      {/* Juz Number */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                        <span className="text-accent-foreground font-bold">{juz.number}</span>
                      </div>

                      {/* Juz Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {isEnglish ? `Juz ${juz.number}` : `পারা ${juz.number}`}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {isEnglish ? `Surah ${juz.startSurah}:${juz.startAyah}` : `সূরা ${juz.startSurah}:${juz.startAyah}`}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {juz.englishName}
                        </p>
                      </div>

                      {/* Arabic Name */}
                      <div className="flex-shrink-0 text-right">
                        <p className="arabic-text text-xl text-primary">
                          {juz.name}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* No Results */}
            {filteredJuz.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {isEnglish ? 'No juz found' : 'কোনো পারা পাওয়া যায়নি'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Quran;
