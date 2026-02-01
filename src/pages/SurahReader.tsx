import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bookmark, Copy, Play, Pause, Loader2, Square } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import WordPopover, { Word } from '@/components/quran/WordPopover';

// Types for Quran Foundation API
interface VerseWord extends Word {
  verse_key: string;
}

interface VerseWithWords {
  id: number;
  verse_key: string;
  verse_number: number;
  text_uthmani: string;
  words: Word[];
  translations: { text: string; resource_id: number }[];
}

interface AudioTimestamp {
  verse_key: string;
  timestamp_from: number;
  timestamp_to: number;
  segments: [number, number, number][]; // [word_position, start_ms, end_ms]
}

interface ChapterInfo {
  id: number;
  name_arabic: string;
  name_simple: string;
  translated_name: { name: string };
  verses_count: number;
  revelation_place: string;
}

interface HighlightedWord {
  verseKey: string;
  position: number;
}

const SurahReader: React.FC = () => {
  const { surahId } = useParams<{ surahId: string }>();
  const [searchParams] = useSearchParams();
  const highlightAyah = searchParams.get('ayah');
  const { t, isEnglish, isBengali } = useLanguage();
  const { addBookmark } = useBookmarks();
  const { toast } = useToast();
  
  // Data state
  const [chapterInfo, setChapterInfo] = useState<ChapterInfo | null>(null);
  const [verses, setVerses] = useState<VerseWithWords[]>([]);
  const [audioTimings, setAudioTimings] = useState<Map<string, AudioTimestamp>>(new Map());
  const [chapterAudioUrl, setChapterAudioUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Audio state
  const [currentlyPlayingVerse, setCurrentlyPlayingVerse] = useState<number | null>(null);
  const [highlightedWord, setHighlightedWord] = useState<HighlightedWord | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playAllRef = useRef<boolean>(false);
  const hasScrolledToAyah = useRef<boolean>(false);

  // Fetch data from Quran Foundation API
  useEffect(() => {
    const fetchSurahData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Determine translation ID: 131 = English (Clear Quran), 161 = Bengali
        const translationId = isBengali ? '161' : '131';
        
        const [chapterRes, versesRes, audioRes] = await Promise.all([
          fetch(`https://api.quran.com/api/v4/chapters/${surahId}`),
          fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surahId}?words=true&translations=${translationId}&word_fields=text_uthmani&per_page=300`),
          fetch(`https://api.quran.com/api/v4/chapter_recitations/7/${surahId}?segments=true`),
        ]);

        const chapterData = await chapterRes.json();
        const versesData = await versesRes.json();
        const audioData = await audioRes.json();

        if (chapterData.chapter) {
          setChapterInfo(chapterData.chapter);
        }

        if (versesData.verses) {
          setVerses(versesData.verses);
        }

        if (audioData.audio_file) {
          setChapterAudioUrl(audioData.audio_file.audio_url);
          
          // Build timing map from timestamps
          const timingMap = new Map<string, AudioTimestamp>();
          if (audioData.audio_file.verse_timings) {
            audioData.audio_file.verse_timings.forEach((timing: AudioTimestamp) => {
              timingMap.set(timing.verse_key, timing);
            });
          }
          setAudioTimings(timingMap);
        }
      } catch (err) {
        console.error('Failed to fetch surah data:', err);
        setError('Failed to load surah');
      } finally {
        setLoading(false);
      }
    };

    if (surahId) {
      fetchSurahData();
      hasScrolledToAyah.current = false;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      playAllRef.current = false;
      setCurrentlyPlayingVerse(null);
      setHighlightedWord(null);
      setIsPlaying(false);
      setIsPlayingAll(false);
    };
  }, [surahId, isBengali]);

  // Scroll to highlighted ayah
  useEffect(() => {
    if (highlightAyah && verses.length > 0 && !loading && !hasScrolledToAyah.current) {
      const ayahNum = parseInt(highlightAyah);
      if (ayahNum > 0) {
        setTimeout(() => {
          const element = document.getElementById(`verse-${ayahNum}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            hasScrolledToAyah.current = true;
          }
        }, 300);
      }
    }
  }, [highlightAyah, verses, loading]);

  // Audio time update handler for word highlighting
  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current) return;
    
    const currentTimeMs = audioRef.current.currentTime * 1000;
    
    // Find which verse and word is currently playing
    for (const [verseKey, timing] of audioTimings) {
      if (currentTimeMs >= timing.timestamp_from && currentTimeMs <= timing.timestamp_to) {
        // Update currently playing verse
        const verseNum = parseInt(verseKey.split(':')[1]);
        setCurrentlyPlayingVerse(prev => {
          if (prev !== verseNum) {
            // Scroll verse into view
            setTimeout(() => {
              const element = document.getElementById(`verse-${verseNum}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 50);
          }
          return verseNum;
        });
        
        // Find the current word within segments
        if (timing.segments && timing.segments.length > 0) {
          for (const segment of timing.segments) {
            const [wordPosition, startMs, endMs] = segment;
            if (currentTimeMs >= startMs && currentTimeMs <= endMs) {
              setHighlightedWord({ verseKey, position: wordPosition });
              return;
            }
          }
          // If no exact match, find closest segment
          const lastSegment = timing.segments[timing.segments.length - 1];
          if (currentTimeMs > lastSegment[2]) {
            setHighlightedWord({ verseKey, position: lastSegment[0] });
          }
        }
        return;
      }
    }
    
    // Clear highlight if no match
    setHighlightedWord(null);
  }, [audioTimings]);

  const handleCopy = (verse: VerseWithWords) => {
    const arabicText = verse.words
      .filter(w => w.char_type_name === 'word')
      .map(w => w.text_uthmani)
      .join(' ');
    const translation = verse.translations[0]?.text || '';
    const text = `${arabicText}\n\n${translation}\n\n- ${chapterInfo?.name_simple} ${verse.verse_number}`;
    navigator.clipboard.writeText(text);
    toast({
      title: isEnglish ? 'Copied!' : 'কপি হয়েছে!',
      description: isEnglish ? 'Verse copied to clipboard' : 'আয়াত ক্লিপবোর্ডে কপি হয়েছে',
    });
  };

  const handleBookmark = (verse: VerseWithWords) => {
    const arabicText = verse.words
      .filter(w => w.char_type_name === 'word')
      .map(w => w.text_uthmani)
      .join(' ');
    addBookmark({
      type: 'verse',
      title: chapterInfo?.name_simple || '',
      arabic: arabicText,
      translation: verse.translations[0]?.text || '',
      reference: `${chapterInfo?.name_simple}:${verse.verse_number}`,
    });
    toast({
      title: isEnglish ? 'Bookmarked!' : 'বুকমার্ক হয়েছে!',
      description: isEnglish ? 'Verse added to bookmarks' : 'আয়াত বুকমার্কে যোগ হয়েছে',
    });
  };

  const playFromVerse = (verseNumber: number) => {
    if (!chapterAudioUrl) return;
    
    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
    }

    setIsBuffering(true);
    const audio = new Audio(chapterAudioUrl);
    audioRef.current = audio;
    
    // Get the start time for the verse
    const verseKey = `${surahId}:${verseNumber}`;
    const timing = audioTimings.get(verseKey);
    if (timing) {
      audio.currentTime = timing.timestamp_from / 1000;
    }

    setCurrentlyPlayingVerse(verseNumber);

    audio.addEventListener('timeupdate', handleTimeUpdate);

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
      playAllRef.current = false;
      setIsPlayingAll(false);
      setCurrentlyPlayingVerse(null);
      setHighlightedWord(null);
      setIsPlaying(false);
      if (isPlayingAll) {
        toast({
          title: isEnglish ? 'Completed' : 'সম্পন্ন',
          description: isEnglish ? 'Finished playing all verses' : 'সব আয়াত বাজানো শেষ',
        });
      }
    };

    audio.onerror = () => {
      setIsBuffering(false);
      setCurrentlyPlayingVerse(null);
      setHighlightedWord(null);
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
      setCurrentlyPlayingVerse(null);
      setHighlightedWord(null);
      playAllRef.current = false;
      setIsPlayingAll(false);
    });
  };

  const handlePlayVerse = (verseNumber: number) => {
    // If clicking on the same verse that's playing, toggle play/pause
    if (currentlyPlayingVerse === verseNumber && audioRef.current) {
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
    
    playFromVerse(verseNumber);
  };

  const handlePlayAll = () => {
    if (isPlayingAll) {
      handleStopAll();
      return;
    }

    playAllRef.current = true;
    setIsPlayingAll(true);
    playFromVerse(1);
  };

  const handleStopAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current = null;
    }
    playAllRef.current = false;
    setIsPlayingAll(false);
    setCurrentlyPlayingVerse(null);
    setHighlightedWord(null);
    setIsPlaying(false);
  };

  const surahNumber = parseInt(surahId || '1');

  // Helper to check if a word is highlighted
  const isWordHighlighted = (verseKey: string, wordPosition: number): boolean => {
    return highlightedWord?.verseKey === verseKey && highlightedWord?.position === wordPosition;
  };

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
        {!loading && !error && chapterInfo && (
          <>
            {/* Surah Header */}
            <Card className="mb-6 overflow-hidden">
              <div className="bg-primary/10 p-6 text-center">
                <p className="arabic-text text-4xl text-primary mb-2">
                  {chapterInfo.name_arabic}
                </p>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  {chapterInfo.name_simple}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {chapterInfo.translated_name.name} • {chapterInfo.verses_count} {t('quran.verses')}
                </p>
                
                {/* Play All Button */}
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={handlePlayAll}
                    variant={isPlayingAll ? "destructive" : "default"}
                    className="gap-2"
                    disabled={!chapterAudioUrl}
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
                  {isPlayingAll && currentlyPlayingVerse && (
                    <span className="text-sm text-muted-foreground flex items-center">
                      {isEnglish ? 'Playing verse' : 'বাজছে আয়াত'} {currentlyPlayingVerse}/{chapterInfo.verses_count}
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
              {verses.map((verse) => {
                const isCurrentlyPlaying = currentlyPlayingVerse === verse.verse_number;
                const isHighlighted = highlightAyah && parseInt(highlightAyah) === verse.verse_number;
                
                return (
                  <Card 
                    key={verse.id}
                    id={`verse-${verse.verse_number}`}
                    className={`overflow-hidden transition-all duration-500 ${
                      isCurrentlyPlaying ? 'ring-2 ring-primary shadow-lg' : ''
                    } ${isHighlighted ? 'ring-2 ring-amber-500 shadow-lg shadow-amber-500/20 bg-amber-50/50 dark:bg-amber-900/10' : ''}`}
                  >
                    <CardContent className="p-4 md:p-6">
                      {/* Verse Number Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {verse.verse_number}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {chapterAudioUrl && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePlayVerse(verse.verse_number)}
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
                            onClick={() => handleCopy(verse)}
                            title={t('common.copy')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleBookmark(verse)}
                            title={t('common.bookmark')}
                          >
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Arabic Text - Word by Word */}
                      <div className="arabic-text text-2xl md:text-3xl text-right leading-[2.5] text-foreground mb-4 flex flex-wrap justify-end gap-1" dir="rtl">
                        {verse.words.map((word, idx) => (
                          <WordPopover
                            key={`${verse.verse_key}-${word.position}-${idx}`}
                            word={word}
                            isHighlighted={isWordHighlighted(verse.verse_key, word.position)}
                          >
                            {word.text_uthmani}
                          </WordPopover>
                        ))}
                      </div>

                      {/* Translation */}
                      <p 
                        className="text-muted-foreground leading-relaxed border-t border-border pt-4"
                        dangerouslySetInnerHTML={{ __html: verse.translations[0]?.text || '' }}
                      />
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
