import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bookmark, Copy, Play, Pause, Loader2, Square } from 'lucide-react';
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
  audio?: string;
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
  const [searchParams] = useSearchParams();
  const highlightAyah = searchParams.get('ayah');
  const { t, isEnglish, isBengali } = useLanguage();
  const { addBookmark } = useBookmarks();
  const { toast } = useToast();
  const [surahArabic, setSurahArabic] = useState<SurahData | null>(null);
  const [surahTranslation, setSurahTranslation] = useState<SurahData | null>(null);
  const [audioUrls, setAudioUrls] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Audio state
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playAllRef = useRef<boolean>(false);
  const hasScrolledToAyah = useRef<boolean>(false);

  useEffect(() => {
    const fetchSurah = async () => {
      setLoading(true);
      setError(null);
      try {
        const translationEdition = isBengali ? 'bn.bengali' : 'en.sahih';
        const [arabicRes, translationRes, audioRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/${translationEdition}`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/ar.alafasy`),
        ]);

        const arabicData = await arabicRes.json();
        const translationData = await translationRes.json();
        const audioData = await audioRes.json();

        if (arabicData.code === 200) {
          setSurahArabic(arabicData.data);
        }
        if (translationData.code === 200) {
          setSurahTranslation(translationData.data);
        }
        if (audioData.code === 200 && audioData.data?.ayahs) {
          const urls: Record<number, string> = {};
          audioData.data.ayahs.forEach((ayah: { numberInSurah: number; audio: string }) => {
            urls[ayah.numberInSurah] = ayah.audio;
          });
          setAudioUrls(urls);
        }
      } catch (err) {
        setError('Failed to load surah');
      } finally {
        setLoading(false);
      }
    };

    if (surahId) {
      fetchSurah();
      hasScrolledToAyah.current = false;
    }
    
    // Cleanup audio on unmount or surah change
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      playAllRef.current = false;
      setCurrentlyPlaying(null);
      setIsPlaying(false);
      setIsPlayingAll(false);
    };
  }, [surahId, isBengali]);

  // Scroll to highlighted ayah after data loads
  useEffect(() => {
    if (highlightAyah && surahArabic && !loading && !hasScrolledToAyah.current) {
      const ayahNum = parseInt(highlightAyah);
      if (ayahNum > 0 && ayahNum <= surahArabic.numberOfAyahs) {
        setTimeout(() => {
          const element = document.getElementById(`verse-${ayahNum}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            hasScrolledToAyah.current = true;
          }
        }, 300);
      }
    }
  }, [highlightAyah, surahArabic, loading]);

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

  const playVerse = (ayahNumber: number, autoAdvance: boolean = false) => {
    const audioUrl = audioUrls[ayahNumber];
    if (!audioUrl) {
      if (autoAdvance) {
        // No more verses, stop play all
        playAllRef.current = false;
        setIsPlayingAll(false);
      }
      return;
    }

    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Create new audio and play
    setIsBuffering(true);
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setCurrentlyPlaying(ayahNumber);

    // Scroll the verse into view
    const verseElement = document.getElementById(`verse-${ayahNumber}`);
    if (verseElement) {
      verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    audio.oncanplay = () => {
      setIsBuffering(false);
    };

    audio.onplay = () => {
      setIsPlaying(true);
      setIsBuffering(false);
    };

    audio.onpause = () => {
      setIsPlaying(false);
    };

    audio.onended = () => {
      // Check if we should auto-advance to next verse
      if (playAllRef.current && surahArabic) {
        const nextAyah = ayahNumber + 1;
        if (nextAyah <= surahArabic.numberOfAyahs) {
          playVerse(nextAyah, true);
        } else {
          // Finished all verses
          playAllRef.current = false;
          setIsPlayingAll(false);
          setCurrentlyPlaying(null);
          setIsPlaying(false);
          toast({
            title: isEnglish ? 'Completed' : 'সম্পন্ন',
            description: isEnglish ? 'Finished playing all verses' : 'সব আয়াত বাজানো শেষ',
          });
        }
      } else {
        setCurrentlyPlaying(null);
        setIsPlaying(false);
      }
    };

    audio.onerror = () => {
      setIsBuffering(false);
      setCurrentlyPlaying(null);
      setIsPlaying(false);
      playAllRef.current = false;
      setIsPlayingAll(false);
      toast({
        title: isEnglish ? 'Audio Error' : 'অডিও ত্রুটি',
        description: isEnglish ? 'Failed to load audio' : 'অডিও লোড করতে ব্যর্থ',
        variant: 'destructive',
      });
    };

    audio.play().catch(() => {
      setIsBuffering(false);
      setCurrentlyPlaying(null);
      playAllRef.current = false;
      setIsPlayingAll(false);
    });
  };

  const handlePlayVerse = (ayahNumber: number) => {
    // If clicking on the same verse that's playing, toggle play/pause
    if (currentlyPlaying === ayahNumber && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    // Stop play all mode if manually playing a verse
    playAllRef.current = false;
    setIsPlayingAll(false);
    
    playVerse(ayahNumber);
  };

  const handlePlayAll = () => {
    if (isPlayingAll) {
      // Stop playing
      handleStopAll();
      return;
    }

    // Start playing from verse 1
    playAllRef.current = true;
    setIsPlayingAll(true);
    playVerse(1, true);
  };

  const handleStopAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    playAllRef.current = false;
    setIsPlayingAll(false);
    setCurrentlyPlaying(null);
    setIsPlaying(false);
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
                <p className="text-muted-foreground mb-4">
                  {surahArabic.englishNameTranslation} • {surahArabic.numberOfAyahs} {t('quran.verses')}
                </p>
                
                {/* Play All Button */}
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={handlePlayAll}
                    variant={isPlayingAll ? "destructive" : "default"}
                    className="gap-2"
                  >
                    {isPlayingAll ? (
                      <>
                        <Square className="h-4 w-4" />
                        {isEnglish ? 'Stop' : 'থামান'}
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        {isEnglish ? 'Play All' : 'সব বাজান'}
                      </>
                    )}
                  </Button>
                  {isPlayingAll && currentlyPlaying && (
                    <span className="text-sm text-muted-foreground flex items-center">
                      {isEnglish ? 'Playing verse' : 'বাজছে আয়াত'} {currentlyPlaying}/{surahArabic.numberOfAyahs}
                    </span>
                  )}
                </div>
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
                const isCurrentlyPlaying = currentlyPlaying === ayah.numberInSurah;
                const hasAudio = !!audioUrls[ayah.numberInSurah];
                const isHighlighted = highlightAyah && parseInt(highlightAyah) === ayah.numberInSurah;
                
                return (
                  <Card 
                    key={ayah.number}
                    id={`verse-${ayah.numberInSurah}`}
                    className={`overflow-hidden transition-all duration-500 ${
                      isCurrentlyPlaying ? 'ring-2 ring-primary shadow-lg' : ''
                    } ${isHighlighted ? 'ring-2 ring-amber-500 shadow-lg shadow-amber-500/20 bg-amber-50/50 dark:bg-amber-900/10' : ''}`}
                  >
                    <CardContent className="p-4 md:p-6">
                      {/* Verse Number Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {ayah.numberInSurah}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {hasAudio && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePlayVerse(ayah.numberInSurah)}
                              className={isCurrentlyPlaying ? 'text-primary' : ''}
                              title={isEnglish ? (isCurrentlyPlaying && isPlaying ? 'Pause' : 'Play') : (isCurrentlyPlaying && isPlaying ? 'বিরতি' : 'বাজান')}
                            >
                              {isCurrentlyPlaying && isBuffering ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : isCurrentlyPlaying && isPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(ayah.text, translation, ayah.numberInSurah)}
                            title={t('common.copy')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleBookmark(ayah, translation)}
                            title={t('common.bookmark')}
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
