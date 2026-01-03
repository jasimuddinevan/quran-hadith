import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bookmark, Copy, Share2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  translation?: string;
}

interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}

const SurahReader: React.FC = () => {
  const { surahId } = useParams<{ surahId: string }>();
  const { t, isEnglish } = useLanguage();
  const { addBookmark } = useBookmarks();
  const { toast } = useToast();
  const [surahArabic, setSurahArabic] = useState<SurahData | null>(null);
  const [surahTranslation, setSurahTranslation] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurah = async () => {
      setLoading(true);
      setError(null);
      try {
        const [arabicRes, translationRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/en.sahih`),
        ]);

        const arabicData = await arabicRes.json();
        const translationData = await translationRes.json();

        if (arabicData.code === 200) {
          setSurahArabic(arabicData.data);
        }
        if (translationData.code === 200) {
          setSurahTranslation(translationData.data);
        }
      } catch (err) {
        setError('Failed to load surah');
      } finally {
        setLoading(false);
      }
    };

    if (surahId) {
      fetchSurah();
    }
  }, [surahId]);

  const handleCopy = (arabic: string, translation: string, ayahNumber: number) => {
    const text = `${arabic}\n\n${translation}\n\n- ${surahArabic?.englishName} ${ayahNumber}`;
    navigator.clipboard.writeText(text);
    toast({
      title: isEnglish ? 'Copied!' : 'কপি হয়েছে!',
      description: isEnglish ? 'Verse copied to clipboard' : 'আয়াত ক্লিপবোর্ডে কপি হয়েছে',
    });
  };

  const handleBookmark = (ayah: Ayah, translation: string) => {
    addBookmark({
      type: 'verse',
      title: surahArabic?.englishName || '',
      arabic: ayah.text,
      translation,
      reference: `${surahArabic?.englishName}:${ayah.numberInSurah}`,
    });
    toast({
      title: isEnglish ? 'Bookmarked!' : 'বুকমার্ক হয়েছে!',
      description: isEnglish ? 'Verse added to bookmarks' : 'আয়াত বুকমার্কে যোগ হয়েছে',
    });
  };

  const surahNumber = parseInt(surahId || '1');

  return (
    <Layout>
      <div className="container py-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/quran">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              {isEnglish ? 'All Surahs' : 'সব সূরা'}
            </Button>
          </Link>
          <div className="flex gap-2">
            {surahNumber > 1 && (
              <Link to={`/quran/${surahNumber - 1}`}>
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {surahNumber < 114 && (
              <Link to={`/quran/${surahNumber + 1}`}>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
            <Link to="/quran">
              <Button variant="outline" className="mt-4">
                {isEnglish ? 'Go Back' : 'ফিরে যান'}
              </Button>
            </Link>
          </div>
        )}

        {/* Surah Content */}
        {!loading && !error && surahArabic && (
          <>
            {/* Surah Header */}
            <Card className="mb-6 overflow-hidden">
              <div className="bg-primary/10 p-6 text-center">
                <p className="arabic-text text-4xl text-primary mb-2">
                  {surahArabic.name}
                </p>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  {surahArabic.englishName}
                </h1>
                <p className="text-muted-foreground">
                  {surahArabic.englishNameTranslation} • {surahArabic.numberOfAyahs} {t('quran.verses')}
                </p>
              </div>
            </Card>

            {/* Bismillah (except for Surah 1 and 9) */}
            {surahNumber !== 1 && surahNumber !== 9 && (
              <div className="text-center mb-8">
                <p className="arabic-text text-3xl text-primary">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {isEnglish 
                    ? 'In the name of Allah, the Most Gracious, the Most Merciful'
                    : 'পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে'}
                </p>
              </div>
            )}

            {/* Verses */}
            <div className="space-y-4">
              {surahArabic.ayahs.map((ayah, index) => {
                const translation = surahTranslation?.ayahs[index]?.text || '';
                return (
                  <Card key={ayah.number} className="overflow-hidden">
                    <CardContent className="p-4 md:p-6">
                      {/* Verse Number Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {ayah.numberInSurah}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(ayah.text, translation, ayah.numberInSurah)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleBookmark(ayah, translation)}
                          >
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Arabic Text */}
                      <p className="arabic-text text-2xl md:text-3xl text-right leading-[2.5] text-foreground mb-4">
                        {ayah.text}
                      </p>

                      {/* Translation */}
                      <p className="text-muted-foreground leading-relaxed border-t border-border pt-4">
                        {translation}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default SurahReader;
