import React from 'react';
import { Link } from 'react-router-dom';
import { Copy, Bookmark, ArrowRight, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const TodayContent: React.FC = () => {
  const { t, isEnglish } = useLanguage();
  const { addBookmark } = useBookmarks();

  // Exact content from reference website
  const verseOfDay = {
    arabic: 'ذٰلِكَ جَزَینٰهُم بِمَا كَفَرُوا ؕ وَ هَل نُجٰزِی اِلَّا الكَفُورَ',
    translation: 'By that We repaid them because they disbelieved. And do We thus repay except the ungrateful?',
    translationBn: 'এটা তাদের প্রতিফল যা আমি তাদের দিয়েছি তাদের অকৃতজ্ঞতার কারণে। আর আমি কি অকৃতজ্ঞ ছাড়া অন্য কাউকে শাস্তি দেই?',
    reference: 'Saba 34:17',
    referenceBn: 'সাবা ৩৪:১৭',
  };

  const duaOfDay = {
    category: 'Before Sleeping',
    categoryBn: 'ঘুমানোর আগে',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    translation: 'In Your name I die and live',
    translationBn: 'আপনার নামে আমি মৃত্যুবরণ করি এবং জীবিত হই',
  };

  const hadithOfDay = {
    source: 'Sahih Bukhari - Hadith 4',
    sourceBn: 'সহীহ বুখারী - হাদিস ৪',
    arabic: 'حَدَّثَنَا الْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ قَالَ حَدَّثَنَا سُفْيَانُ قَالَ حَدَّثَنَا يَحْيَى بْنُ سَعِيدٍ الأَنْصَارِيُّ قَالَ أَخْبَرَنِي مُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ أَنَّهُ سَمِعَ عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ يَقُولُ سَمِعْتُ عُمَرَ بْنَ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ عَلَى الْمِنْبَرِ',
    narration: "Narrated Jabir bin 'Abdullah Al-Ansari: While Allah's Messenger (ﷺ) was talking about the period of pause in revelation, he said in his narration, \"While I was walking I heard a voice from the sky. I looked up and saw the same angel who came to me at the Cave of Hira sitting on a chair between the sky and the earth...\"",
    narrationBn: "জাবির বিন আব্দুল্লাহ আল-আনসারী (রাঃ) থেকে বর্ণিত: আল্লাহর রাসূল (ﷺ) ওহী বিরতিকালীন সময় সম্পর্কে বলতে গিয়ে তাঁর বর্ণনায় বলেন, \"আমি হাঁটছিলাম তখন আকাশ থেকে একটি আওয়াজ শুনলাম। আমি উপরে তাকিয়ে দেখলাম সেই একই ফেরেশতা যিনি হেরা গুহায় আমার কাছে এসেছিলেন তিনি আকাশ ও পৃথিবীর মধ্যে একটি চেয়ারে বসে আছেন...\"",
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: isEnglish ? 'Copied!' : 'কপি হয়েছে!',
      description: isEnglish ? 'Text copied to clipboard' : 'টেক্সট ক্লিপবোর্ডে কপি হয়েছে',
    });
  };

  const handleBookmark = (type: string, content: any) => {
    addBookmark({
      type: type as 'verse' | 'hadith' | 'dua',
      title: type === 'verse' ? (isEnglish ? content.reference : content.referenceBn) : 
             type === 'dua' ? (isEnglish ? content.category : content.categoryBn) :
             (isEnglish ? content.source : content.sourceBn),
      arabic: content.arabic,
      translation: isEnglish ? (content.translation || content.narration) : (content.translationBn || content.narrationBn),
      reference: isEnglish ? (content.reference || content.source) : (content.referenceBn || content.sourceBn),
    });
    toast({
      title: isEnglish ? 'Bookmarked!' : 'বুকমার্ক হয়েছে!',
      description: isEnglish ? 'Added to your bookmarks' : 'আপনার বুকমার্কে যোগ হয়েছে',
    });
  };

  return (
    <section className="container py-8 pb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
        {t('today.title')}
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Verse of the Day */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <BookOpen className="h-5 w-5 text-primary" />
                {t('today.verseOfDay')}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleCopy(verseOfDay.arabic + '\n\n' + (isEnglish ? verseOfDay.translation : verseOfDay.translationBn))}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="arabic-text text-xl md:text-2xl text-center mb-4 text-foreground leading-loose">
              {verseOfDay.arabic}
            </p>
            <p className="text-muted-foreground text-sm mb-3">
              {isEnglish ? verseOfDay.translation : verseOfDay.translationBn}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-primary font-medium">
                {isEnglish ? verseOfDay.reference : verseOfDay.referenceBn}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => handleBookmark('verse', verseOfDay)}
              >
                <Bookmark className="h-3 w-3 mr-1" />
                {t('common.bookmark')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dua of the Day */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <span className="text-xl">🤲</span>
                {t('today.duaOfDay')}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleCopy(duaOfDay.arabic + '\n\n' + (isEnglish ? duaOfDay.translation : duaOfDay.translationBn))}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary hover:bg-primary/20">
              {isEnglish ? duaOfDay.category : duaOfDay.categoryBn}
            </Badge>
            <p className="arabic-text text-xl md:text-2xl text-center mb-4 text-foreground leading-loose">
              {duaOfDay.arabic}
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              {isEnglish ? duaOfDay.translation : duaOfDay.translationBn}
            </p>
            <Link to="/dua">
              <Button variant="outline" size="sm" className="w-full">
                {t('today.dailyLifeDuas')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Hadith of the Day */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <span className="text-xl">📚</span>
                {t('today.hadithOfDay')}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleCopy(hadithOfDay.arabic + '\n\n' + (isEnglish ? hadithOfDay.narration : hadithOfDay.narrationBn))}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Badge variant="secondary" className="mb-3 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200">
              {isEnglish ? hadithOfDay.source : hadithOfDay.sourceBn}
            </Badge>
            <p className="arabic-text text-lg text-center mb-4 text-foreground leading-loose line-clamp-2">
              {hadithOfDay.arabic}
            </p>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
              {isEnglish ? hadithOfDay.narration : hadithOfDay.narrationBn}
            </p>
            <Link to="/hadith">
              <Button variant="outline" size="sm" className="w-full">
                {t('today.viewAllHadith')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TodayContent;
