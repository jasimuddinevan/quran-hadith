import React from 'react';
import { Link } from 'react-router-dom';
import { Copy, Bookmark, ArrowRight, BookOpen, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

// Daily content arrays - rotates based on date
const versesData = [
  {
    arabic: 'ذٰلِكَ جَزَینٰهُم بِمَا كَفَرُوا ؕ وَ هَل نُجٰزِی اِلَّا الكَفُورَ',
    translation: 'By that We repaid them because they disbelieved. And do We thus repay except the ungrateful?',
    translationBn: 'এটা তাদের প্রতিফল যা আমি তাদের দিয়েছি তাদের অকৃতজ্ঞতার কারণে। আর আমি কি অকৃতজ্ঞ ছাড়া অন্য কাউকে শাস্তি দেই?',
    reference: 'Saba 34:17',
    referenceBn: 'সাবা ৩৪:১৭',
  },
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Indeed, with hardship comes ease.',
    translationBn: 'নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।',
    reference: 'Ash-Sharh 94:6',
    referenceBn: 'আশ-শারহ ৯৪:৬',
  },
  {
    arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    translation: 'And say: My Lord, increase me in knowledge.',
    translationBn: 'এবং বলুন: হে আমার রব, আমার জ্ঞান বৃদ্ধি করুন।',
    reference: 'Ta-Ha 20:114',
    referenceBn: 'ত্বা-হা ২০:১১৪',
  },
  {
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    translation: 'And whoever relies upon Allah - then He is sufficient for him.',
    translationBn: 'আর যে আল্লাহর উপর ভরসা করে, তার জন্য আল্লাহই যথেষ্ট।',
    reference: 'At-Talaq 65:3',
    referenceBn: 'আত-তালাক ৬৫:৩',
  },
  {
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
    translation: 'So remember Me; I will remember you.',
    translationBn: 'অতএব তোমরা আমাকে স্মরণ কর, আমি তোমাদের স্মরণ করব।',
    reference: 'Al-Baqarah 2:152',
    referenceBn: 'আল-বাকারা ২:১৫২',
  },
  {
    arabic: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ',
    translation: 'So do not weaken and do not grieve, and you will be superior.',
    translationBn: 'তোমরা দুর্বল হয়ো না এবং দুঃখিত হয়ো না, তোমরাই বিজয়ী।',
    reference: 'Al-Imran 3:139',
    referenceBn: 'আলে-ইমরান ৩:১৩৯',
  },
  {
    arabic: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ',
    translation: 'And I did not create the jinn and mankind except to worship Me.',
    translationBn: 'আমি জিন ও মানুষকে শুধু আমার ইবাদতের জন্য সৃষ্টি করেছি।',
    reference: 'Adh-Dhariyat 51:56',
    referenceBn: 'আয-যারিয়াত ৫১:৫৬',
  },
  {
    arabic: 'إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
    translation: 'Indeed, Allah does not let go to waste the reward of those who do good.',
    translationBn: 'নিশ্চয়ই আল্লাহ সৎকর্মশীলদের প্রতিদান নষ্ট করেন না।',
    reference: 'At-Tawbah 9:120',
    referenceBn: 'আত-তাওবাহ ৯:১২০',
  },
  {
    arabic: 'ادْعُونِي أَسْتَجِبْ لَكُمْ',
    translation: 'Call upon Me; I will respond to you.',
    translationBn: 'তোমরা আমাকে ডাক, আমি তোমাদের ডাকে সাড়া দেব।',
    reference: 'Ghafir 40:60',
    referenceBn: 'গাফির ৪০:৬০',
  },
  {
    arabic: 'وَاللَّهُ يُحِبُّ الصَّابِرِينَ',
    translation: 'And Allah loves the steadfast.',
    translationBn: 'আর আল্লাহ ধৈর্যশীলদের ভালোবাসেন।',
    reference: 'Al-Imran 3:146',
    referenceBn: 'আলে-ইমরান ৩:১৪৬',
  },
  {
    arabic: 'وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
    translation: 'And be patient, for indeed, Allah does not allow to be lost the reward of those who do good.',
    translationBn: 'ধৈর্য ধরুন, নিশ্চয়ই আল্লাহ সৎকর্মশীলদের পুরস্কার নষ্ট করেন না।',
    reference: 'Hud 11:115',
    referenceBn: 'হুদ ১১:১১৫',
  },
  {
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً',
    translation: 'Our Lord, give us in this world good and in the Hereafter good.',
    translationBn: 'হে আমাদের রব, আমাদেরকে দুনিয়ায় কল্যাণ দাও এবং আখেরাতেও কল্যাণ দাও।',
    reference: 'Al-Baqarah 2:201',
    referenceBn: 'আল-বাকারা ২:২০১',
  },
];

const duasData = [
  {
    category: 'Before Sleeping',
    categoryBn: 'ঘুমানোর আগে',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    translation: 'In Your name I die and live',
    translationBn: 'আপনার নামে আমি মৃত্যুবরণ করি এবং জীবিত হই',
  },
  {
    category: 'Upon Waking',
    categoryBn: 'ঘুম থেকে উঠে',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    translation: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.',
    translationBn: 'সমস্ত প্রশংসা আল্লাহর যিনি আমাদের মৃত্যুর পর জীবিত করেছেন এবং তাঁরই কাছে পুনরুত্থান।',
  },
  {
    category: 'Before Eating',
    categoryBn: 'খাওয়ার আগে',
    arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
    translation: 'In the name of Allah and with the blessings of Allah.',
    translationBn: 'আল্লাহর নামে এবং আল্লাহর বরকতে।',
  },
  {
    category: 'After Eating',
    categoryBn: 'খাওয়ার পরে',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    translation: 'All praise is for Allah who fed us and gave us drink and made us Muslims.',
    translationBn: 'সমস্ত প্রশংসা আল্লাহর যিনি আমাদের খাওয়ালেন, পান করালেন এবং মুসলিম বানালেন।',
  },
  {
    category: 'Entering Mosque',
    categoryBn: 'মসজিদে প্রবেশ',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    translation: 'O Allah, open for me the doors of Your mercy.',
    translationBn: 'হে আল্লাহ, আমার জন্য আপনার রহমতের দরজা খুলে দিন।',
  },
  {
    category: 'Leaving Home',
    categoryBn: 'বাড়ি থেকে বের হওয়া',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    translation: 'In the name of Allah, I place my trust in Allah, there is no might nor power except with Allah.',
    translationBn: 'আল্লাহর নামে, আমি আল্লাহর উপর ভরসা করি, আল্লাহ ছাড়া কোনো শক্তি ও ক্ষমতা নেই।',
  },
  {
    category: 'For Parents',
    categoryBn: 'পিতামাতার জন্য',
    arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    translation: 'My Lord, have mercy upon them as they brought me up when I was small.',
    translationBn: 'হে আমার রব, তাদের প্রতি রহম করুন যেমন তারা আমাকে ছোটবেলায় লালন-পালন করেছেন।',
  },
];

const hadithsData = [
  {
    source: 'Sahih Bukhari',
    sourceBn: 'সহীহ বুখারী',
    arabic: 'حَدَّثَنَا الْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ قَالَ حَدَّثَنَا سُفْيَانُ',
    narration: "The Prophet (ﷺ) said: 'Actions are judged by intentions, so each man will have what he intended.'",
    narrationBn: "নবী (সাঃ) বলেছেন: 'কাজের বিচার নিয়তের উপর নির্ভর করে, প্রত্যেক ব্যক্তি তার নিয়ত অনুযায়ী ফল পাবে।'",
  },
  {
    source: 'Sahih Muslim',
    sourceBn: 'সহীহ মুসলিম',
    arabic: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    narration: "The Prophet (ﷺ) said: 'The strong believer is better and more beloved to Allah than the weak believer.'",
    narrationBn: "নবী (সাঃ) বলেছেন: 'শক্তিশালী মুমিন দুর্বল মুমিনের চেয়ে আল্লাহর কাছে উত্তম ও অধিক প্রিয়।'",
  },
  {
    source: 'Jami at-Tirmidhi',
    sourceBn: 'জামে তিরমিযী',
    arabic: 'عَنْ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللَّهُ عَنْهُ',
    narration: "The Prophet (ﷺ) said: 'Seeking knowledge is an obligation upon every Muslim.'",
    narrationBn: "নবী (সাঃ) বলেছেন: 'জ্ঞান অর্জন করা প্রতিটি মুসলিমের উপর ফরজ।'",
  },
  {
    source: 'Sahih Bukhari',
    sourceBn: 'সহীহ বুখারী',
    arabic: 'عَنْ عَبْدِ اللَّهِ بْنِ عُمَرَ رَضِيَ اللَّهُ عَنْهُمَا',
    narration: "The Prophet (ﷺ) said: 'The best of you are those who are best to their families.'",
    narrationBn: "নবী (সাঃ) বলেছেন: 'তোমাদের মধ্যে সেই সর্বোত্তম যে তার পরিবারের কাছে সর্বোত্তম।'",
  },
  {
    source: 'Sahih Muslim',
    sourceBn: 'সহীহ মুসলিম',
    arabic: 'عَنْ أَبِي ذَرٍّ الْغِفَارِيِّ رَضِيَ اللَّهُ عَنْهُ',
    narration: "The Prophet (ﷺ) said: 'Smiling at your brother is charity.'",
    narrationBn: "নবী (সাঃ) বলেছেন: 'তোমার ভাইয়ের সাথে হাসিমুখে সাক্ষাৎ করা সদকা।'",
  },
  {
    source: 'Sunan Abu Dawud',
    sourceBn: 'সুনানে আবু দাউদ',
    arabic: 'عَنْ عَائِشَةَ رَضِيَ اللَّهُ عَنْهَا',
    narration: "The Prophet (ﷺ) said: 'Allah is gentle and loves gentleness in all matters.'",
    narrationBn: "নবী (সাঃ) বলেছেন: 'আল্লাহ কোমল এবং তিনি সব বিষয়ে কোমলতা পছন্দ করেন।'",
  },
  {
    source: 'Sahih Bukhari',
    sourceBn: 'সহীহ বুখারী',
    arabic: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ',
    narration: "The Prophet (ﷺ) said: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.'",
    narrationBn: "নবী (সাঃ) বলেছেন: 'যে আল্লাহ ও শেষ দিনে বিশ্বাস করে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।'",
  },
];

// Get daily index based on current date
const getDailyIndex = (arrayLength: number): number => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return seed % arrayLength;
};

const TodayContent: React.FC = () => {
  const { t, isEnglish } = useLanguage();
  const { addBookmark } = useBookmarks();

  // Get today's content
  const verseOfDay = versesData[getDailyIndex(versesData.length)];
  const duaOfDay = duasData[getDailyIndex(duasData.length)];
  const hadithOfDay = hadithsData[getDailyIndex(hadithsData.length)];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: isEnglish ? 'Copied!' : 'কপি হয়েছে!',
      description: isEnglish ? 'Text copied to clipboard' : 'টেক্সট ক্লিপবোর্ডে কপি হয়েছে',
    });
  };

  const handleShare = async (content: { arabic: string; translation?: string; translationBn?: string; narration?: string; narrationBn?: string; reference?: string; referenceBn?: string; source?: string; sourceBn?: string; category?: string; categoryBn?: string }) => {
    const text = content.arabic;
    const translation = isEnglish 
      ? (content.translation || content.narration || '') 
      : (content.translationBn || content.narrationBn || '');
    const ref = isEnglish 
      ? (content.reference || content.source || content.category || '') 
      : (content.referenceBn || content.sourceBn || content.categoryBn || '');
    
    const shareText = `${text}\n\n${translation}\n\n- ${ref}\n\nShared from Quran Insight`;

    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
          title: 'Quran Insight',
        });
      } catch (err) {
        // User cancelled or error
        navigator.clipboard.writeText(shareText);
        toast({
          title: isEnglish ? 'Copied for sharing!' : 'শেয়ার করার জন্য কপি হয়েছে!',
        });
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: isEnglish ? 'Copied for sharing!' : 'শেয়ার করার জন্য কপি হয়েছে!',
      });
    }
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
    <section className="container py-10 md:py-14 pb-16">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-10 text-foreground">
        {t('today.title')}
      </h2>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        {/* Verse of the Day */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl flex items-center gap-3 text-foreground">
                <BookOpen className="h-6 w-6 text-primary" />
                {t('today.verseOfDay')}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleShare(verseOfDay)}
                  title={t('common.share')}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleCopy(verseOfDay.arabic + '\n\n' + (isEnglish ? verseOfDay.translation : verseOfDay.translationBn))}
                  title={t('common.copy')}
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <p className="arabic-text text-2xl md:text-3xl text-center mb-5 text-foreground leading-loose">
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
          <CardHeader className="bg-primary/5 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl flex items-center gap-3 text-foreground">
                <span className="text-2xl">🤲</span>
                {t('today.duaOfDay')}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleShare(duaOfDay)}
                  title={t('common.share')}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleCopy(duaOfDay.arabic + '\n\n' + (isEnglish ? duaOfDay.translation : duaOfDay.translationBn))}
                  title={t('common.copy')}
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <Badge variant="secondary" className="mb-4 text-sm bg-primary/10 text-primary hover:bg-primary/20">
              {isEnglish ? duaOfDay.category : duaOfDay.categoryBn}
            </Badge>
            <p className="arabic-text text-2xl md:text-3xl text-center mb-5 text-foreground leading-loose">
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
          <CardHeader className="bg-primary/5 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl flex items-center gap-3 text-foreground">
                <span className="text-2xl">📚</span>
                {t('today.hadithOfDay')}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleShare(hadithOfDay)}
                  title={t('common.share')}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleCopy(hadithOfDay.arabic + '\n\n' + (isEnglish ? hadithOfDay.narration : hadithOfDay.narrationBn))}
                  title={t('common.copy')}
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <Badge variant="secondary" className="mb-4 text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200">
              {isEnglish ? hadithOfDay.source : hadithOfDay.sourceBn}
            </Badge>
            <p className="arabic-text text-xl md:text-2xl text-center mb-5 text-foreground leading-loose line-clamp-2">
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
