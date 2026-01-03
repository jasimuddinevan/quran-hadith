import React, { useState } from 'react';
import { HandHeart, Search, Copy, Bookmark, Sun, Moon, Utensils, Plane, Bed, Heart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DuaItem {
  id: number;
  category: string;
  categoryBn: string;
  title: string;
  titleBn: string;
  arabic: string;
  transliteration: string;
  translation: string;
  translationBn: string;
  reference: string;
  icon: React.ElementType;
}

const duas: DuaItem[] = [
  {
    id: 1,
    category: 'Morning',
    categoryBn: 'সকাল',
    title: 'Morning Supplication',
    titleBn: 'সকালের দোয়া',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: "Asbahna wa asbahal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah",
    translation: 'We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
    translationBn: 'আমরা সকালে উপনীত হয়েছি এবং এই সময়ে সকল সার্বভৌমত্ব আল্লাহর, সকল প্রশংসা আল্লাহর। আল্লাহ ছাড়া কোনো উপাস্য নেই, তিনি একক, তাঁর কোনো শরীক নেই।',
    reference: 'Abu Dawud',
    icon: Sun,
  },
  {
    id: 2,
    category: 'Evening',
    categoryBn: 'সন্ধ্যা',
    title: 'Evening Supplication',
    titleBn: 'সন্ধ্যার দোয়া',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: "Amsayna wa amsal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah",
    translation: 'We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
    translationBn: 'আমরা সন্ধ্যায় উপনীত হয়েছি এবং এই সময়ে সকল সার্বভৌমত্ব আল্লাহর, সকল প্রশংসা আল্লাহর। আল্লাহ ছাড়া কোনো উপাস্য নেই, তিনি একক, তাঁর কোনো শরীক নেই।',
    reference: 'Abu Dawud',
    icon: Moon,
  },
  {
    id: 3,
    category: 'Before Sleeping',
    categoryBn: 'ঘুমানোর আগে',
    title: 'Before Sleep',
    titleBn: 'ঘুমের আগে',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: "Bismika Allahumma amootu wa ahya",
    translation: 'In Your name, O Allah, I die and I live.',
    translationBn: 'হে আল্লাহ, তোমার নামে আমি মারা যাই এবং জীবিত হই।',
    reference: 'Sahih Bukhari',
    icon: Bed,
  },
  {
    id: 4,
    category: 'Eating',
    categoryBn: 'খাওয়ার সময়',
    title: 'Before Eating',
    titleBn: 'খাওয়ার আগে',
    arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
    transliteration: "Bismillahi wa ala barakatillah",
    translation: 'In the name of Allah and with the blessings of Allah.',
    translationBn: 'আল্লাহর নামে এবং আল্লাহর বরকতে।',
    reference: 'Abu Dawud',
    icon: Utensils,
  },
  {
    id: 5,
    category: 'Travel',
    categoryBn: 'ভ্রমণ',
    title: 'When Starting Travel',
    titleBn: 'ভ্রমণ শুরুর সময়',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ',
    transliteration: "Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinin",
    translation: 'Glory unto Him Who created this transportation for us though we were unable to create it on our own.',
    translationBn: 'পবিত্র সেই সত্তা যিনি এটি আমাদের অধীন করে দিয়েছেন, অথচ আমরা একে বশ করতে সক্ষম ছিলাম না।',
    reference: 'Surah Az-Zukhruf 43:13',
    icon: Plane,
  },
  {
    id: 6,
    category: 'General',
    categoryBn: 'সাধারণ',
    title: 'For Good in Both Worlds',
    titleBn: 'উভয় জগতের কল্যাণ',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar",
    translation: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
    translationBn: 'হে আমাদের প্রতিপালক! আমাদের দুনিয়াতে কল্যাণ দাও এবং আখিরাতেও কল্যাণ দাও এবং আমাদের জাহান্নামের আগুন থেকে রক্ষা কর।',
    reference: 'Quran 2:201',
    icon: Heart,
  },
];

const categories = [
  { id: 'all', label: 'All', labelBn: 'সব', icon: HandHeart },
  { id: 'Morning', label: 'Morning', labelBn: 'সকাল', icon: Sun },
  { id: 'Evening', label: 'Evening', labelBn: 'সন্ধ্যা', icon: Moon },
  { id: 'Before Sleeping', label: 'Sleeping', labelBn: 'ঘুম', icon: Bed },
  { id: 'Eating', label: 'Eating', labelBn: 'খাওয়া', icon: Utensils },
  { id: 'Travel', label: 'Travel', labelBn: 'ভ্রমণ', icon: Plane },
];

const Dua: React.FC = () => {
  const { t, isEnglish } = useLanguage();
  const { addBookmark } = useBookmarks();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCopy = (dua: DuaItem) => {
    const text = `${dua.arabic}\n\n${dua.transliteration}\n\n${isEnglish ? dua.translation : dua.translationBn}\n\n- ${dua.reference}`;
    navigator.clipboard.writeText(text);
    toast({
      title: isEnglish ? 'Copied!' : 'কপি হয়েছে!',
      description: isEnglish ? 'Dua copied to clipboard' : 'দোয়া ক্লিপবোর্ডে কপি হয়েছে',
    });
  };

  const handleBookmark = (dua: DuaItem) => {
    addBookmark({
      type: 'dua',
      title: isEnglish ? dua.title : dua.titleBn,
      arabic: dua.arabic,
      translation: isEnglish ? dua.translation : dua.translationBn,
      reference: dua.reference,
    });
    toast({
      title: isEnglish ? 'Bookmarked!' : 'বুকমার্ক হয়েছে!',
      description: isEnglish ? 'Dua added to bookmarks' : 'দোয়া বুকমার্কে যোগ হয়েছে',
    });
  };

  const filteredDuas = duas.filter((dua) => {
    const matchesCategory = selectedCategory === 'all' || dua.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.translation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-500/10 mb-4">
            <HandHeart className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('dua.title')}
          </h1>
          <p className="text-muted-foreground">
            {isEnglish ? 'Essential supplications for daily life' : 'দৈনন্দিন জীবনের জন্য প্রয়োজনীয় দোয়া'}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isEnglish ? 'Search duas...' : 'দোয়া খুঁজুন...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="gap-2"
            >
              <category.icon className="h-4 w-4" />
              {isEnglish ? category.label : category.labelBn}
            </Button>
          ))}
        </div>

        {/* Duas List */}
        <div className="grid gap-4 max-w-3xl mx-auto">
          {filteredDuas.map((dua) => (
            <Card key={dua.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <dua.icon className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {isEnglish ? dua.title : dua.titleBn}
                      </h3>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {isEnglish ? dua.category : dua.categoryBn}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(dua)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleBookmark(dua)}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="arabic-text text-2xl text-right leading-loose text-foreground mb-4">
                  {dua.arabic}
                </p>

                <p className="text-sm text-primary italic mb-3">
                  {dua.transliteration}
                </p>

                <p className="text-muted-foreground leading-relaxed mb-3">
                  {isEnglish ? dua.translation : dua.translationBn}
                </p>

                <p className="text-xs text-muted-foreground border-t border-border pt-3">
                  {t('hadith.source')}: {dua.reference}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dua;
