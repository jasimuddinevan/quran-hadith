import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

const Quran: React.FC = () => {
  const { t, isEnglish } = useLanguage();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

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
            114 {t('quran.surahs')}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('quran.searchSurah')}
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
      </div>
    </Layout>
  );
};

export default Quran;
