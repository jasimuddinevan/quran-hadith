import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, HandHeart, Book, ExternalLink, Copy, Bookmark } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface VerseData {
  arabic: string;
  translation: string;
  surah: string;
  ayah: number;
}

interface DuaData {
  arabic: string;
  translation: string;
  category: string;
  reference: string;
}

interface HadithData {
  arabic: string;
  translation: string;
  narrator: string;
  source: string;
  book: string;
}

const TodayContent: React.FC = () => {
  const { t, isEnglish } = useLanguage();
  const { addBookmark, isBookmarked } = useBookmarks();
  const { toast } = useToast();

  // Sample data - will be replaced with API calls
  const [verseOfDay] = useState<VerseData>({
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: isEnglish 
      ? 'Indeed, with hardship comes ease.'
      : 'নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।',
    surah: isEnglish ? 'Surah Ash-Sharh' : 'সূরা আশ-শারহ',
    ayah: 6,
  });

  const [duaOfDay] = useState<DuaData>({
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    translation: isEnglish
      ? 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.'
      : 'হে আমাদের প্রতিপালক! আমাদের দুনিয়াতে কল্যাণ দাও এবং আখিরাতেও কল্যাণ দাও এবং আমাদের জাহান্নামের আগুন থেকে রক্ষা কর।',
    category: isEnglish ? 'General Supplication' : 'সাধারণ দোয়া',
    reference: 'Quran 2:201',
  });

  const [hadithOfDay] = useState<HadithData>({
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    translation: isEnglish
      ? 'Actions are judged by intentions, and everyone will be rewarded according to their intention.'
      : 'কাজের ফলাফল নিয়তের উপর নির্ভরশীল এবং প্রত্যেক ব্যক্তি তার নিয়ত অনুযায়ী প্রতিদান পাবে।',
    narrator: isEnglish ? 'Umar ibn Al-Khattab (RA)' : 'উমর ইবনে খাত্তাব (রা.)',
    source: 'Sahih Bukhari',
    book: 'Book 1, Hadith 1',
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: isEnglish ? 'Copied!' : 'কপি হয়েছে!',
      description: isEnglish ? 'Text copied to clipboard' : 'টেক্সট ক্লিপবোর্ডে কপি হয়েছে',
    });
  };

  const handleBookmark = (type: 'verse' | 'hadith' | 'dua', data: any) => {
    addBookmark({
      type,
      title: type === 'verse' ? data.surah : type === 'hadith' ? data.source : data.category,
      arabic: data.arabic,
      translation: data.translation,
      reference: type === 'verse' ? `${data.surah}:${data.ayah}` : data.reference || data.book,
    });
    toast({
      title: isEnglish ? 'Bookmarked!' : 'বুকমার্ক হয়েছে!',
      description: isEnglish ? 'Added to your bookmarks' : 'আপনার বুকমার্কে যোগ হয়েছে',
    });
  };

  return (
    <section className="container py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {t('today.title')}
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Verse of the Day */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/10 pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-lg bg-primary/20">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              {t('today.verseOfDay')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <p className="arabic-text text-2xl text-right leading-loose text-foreground">
              {verseOfDay.arabic}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {verseOfDay.translation}
            </p>
            <p className="text-xs text-primary font-medium">
              {verseOfDay.surah} : {verseOfDay.ayah}
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(`${verseOfDay.arabic}\n\n${verseOfDay.translation}`)}
              >
                <Copy className="h-4 w-4 mr-1" />
                {t('common.copy')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBookmark('verse', verseOfDay)}
              >
                <Bookmark className="h-4 w-4 mr-1" />
                {t('common.bookmark')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dua of the Day */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-green-500/10 pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-lg bg-green-500/20">
                <HandHeart className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              {t('today.duaOfDay')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <p className="arabic-text text-xl text-right leading-loose text-foreground">
              {duaOfDay.arabic}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {duaOfDay.translation}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              {duaOfDay.category} • {duaOfDay.reference}
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(`${duaOfDay.arabic}\n\n${duaOfDay.translation}`)}
              >
                <Copy className="h-4 w-4 mr-1" />
                {t('common.copy')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBookmark('dua', duaOfDay)}
              >
                <Bookmark className="h-4 w-4 mr-1" />
                {t('common.bookmark')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Hadith of the Day */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-amber-500/10 pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Book className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              {t('today.hadithOfDay')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <p className="arabic-text text-xl text-right leading-loose text-foreground">
              {hadithOfDay.arabic}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {hadithOfDay.translation}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              {hadithOfDay.source} • {hadithOfDay.book}
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(`${hadithOfDay.arabic}\n\n${hadithOfDay.translation}`)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  {t('common.copy')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBookmark('hadith', hadithOfDay)}
                >
                  <Bookmark className="h-4 w-4 mr-1" />
                  {t('common.bookmark')}
                </Button>
              </div>
              <Link to="/hadith">
                <Button variant="link" size="sm" className="text-primary">
                  {t('today.viewFull')}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TodayContent;
