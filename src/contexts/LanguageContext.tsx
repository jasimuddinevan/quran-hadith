import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isEnglish: boolean;
  isBengali: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.quran': 'Quran',
    'nav.read': 'Read',
    'nav.hadith': 'Hadith',
    'nav.dua': 'Dua',
    'nav.settings': 'Settings',
    
    // Hero
    'hero.title': 'IlmPath',
    'hero.subtitle': 'Quran & Hadith • Complete Guidance',
    'hero.search': 'Example: What does Quran say about prayer?',
    'hero.aiSubtitle': 'Search in Bengali or English. Get accurate information through AI.',
    
    // Quick Access
    'quick.namesOfAllah': '99 Names of Allah',
    'quick.namesDesc': 'Beautiful names with meanings',
    'quick.prayer': 'Prayer & Calendar',
    'quick.prayerDesc': 'Prayer times & Islamic events',
    'quick.duas': 'Daily Duas',
    'quick.duasDesc': "Daily Dua's and Supplications",
    'quick.bookmarks': 'Bookmarks',
    'quick.bookmarksDesc': 'Your saved verses & duas',
    
    // Today's Content
    'today.title': "Today's Verse, Dua & Hadith",
    'today.verseOfDay': 'Verse of the Day',
    'today.duaOfDay': 'Dua of the Day',
    'today.hadithOfDay': 'Hadith of the Day',
    'today.viewFull': 'View Full',
    'today.viewAllHadith': 'View all Hadith',
    'today.dailyLifeDuas': 'Daily Life Duas',
    'today.beforeSleeping': 'Before Sleeping',
    
    // Featured Surah
    'featured.title': 'Featured Surah',
    'featured.surahName': 'Surah Al-Fatiha',
    'featured.surahDesc': 'The Opening - The most recited surah in the Quran',
    'featured.readNow': 'Read Now',
    
    // Benefits
    'benefits.title': 'Benefits of Reciting Quran',
    'benefits.subtitle': 'Discover the countless blessings and rewards of connecting with the Holy Quran daily',
    'benefits.reward': 'Daily Rewards',
    'benefits.rewardDesc': 'Earn immense rewards for every letter recited',
    'benefits.peace': 'Peace of Mind',
    'benefits.peaceDesc': 'Find tranquility and calm in daily recitation',
    'benefits.guidance': 'Life Guidance',
    'benefits.guidanceDesc': 'Receive guidance for all aspects of life',
    'benefits.spirituality': 'Spiritual Growth',
    'benefits.spiritualityDesc': 'Strengthen your connection with Allah',
    'benefits.protection': 'Divine Protection',
    'benefits.protectionDesc': 'Shield yourself with sacred verses',
    'benefits.blessings': 'Abundant Blessings',
    'benefits.blessingsDesc': 'Invite barakah into your daily life',
    
    // Stats
    'stats.title': 'Explore Our Collection',
    'stats.surahs': 'Surahs Available',
    'stats.verses': 'Holy Verses',
    'stats.hadithBooks': 'Hadith Books',
    'stats.duas': 'Daily Duas',
    
    // Explore
    'explore.title': 'Explore More Features',
    'explore.subtitle': 'Discover all the tools and resources to enhance your Islamic learning journey',
    'explore.namesOfAllah': '99 Names of Allah',
    'explore.namesOfAllahDesc': 'Learn the beautiful names of Allah with meanings and benefits',
    'explore.prayerTimes': 'Prayer Times',
    'explore.prayerTimesDesc': 'Never miss a prayer with accurate prayer times for your location',
    'explore.bookmarks': 'Your Bookmarks',
    'explore.bookmarksDesc': 'Access all your saved verses, duas, and hadiths in one place',
    'explore.learnMore': 'Learn More',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Try Again',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.search': 'Search',
    'common.viewAll': 'View All',
    'common.share': 'Share',
    'common.copy': 'Copy',
    'common.bookmark': 'Bookmark',
    'common.bookmarked': 'Bookmarked',
    
    // Quran
    'quran.title': 'The Holy Quran',
    'quran.surahs': 'Surahs',
    'quran.verses': 'verses',
    'quran.meccan': 'Meccan',
    'quran.medinan': 'Medinan',
    'quran.play': 'Play',
    'quran.pause': 'Pause',
    'quran.searchSurah': 'Search Surah...',
    
    // Hadith
    'hadith.title': 'Hadith Collections',
    'hadith.narrator': 'Narrator',
    'hadith.source': 'Source',
    
    // Dua
    'dua.title': 'Daily Duas',
    'dua.categories': 'Categories',
    'dua.morning': 'Morning',
    'dua.evening': 'Evening',
    'dua.sleeping': 'Before Sleeping',
    'dua.eating': 'Eating',
    'dua.travel': 'Travel',
    
    // Prayer
    'prayer.title': 'Prayer Times',
    'prayer.fajr': 'Fajr',
    'prayer.sunrise': 'Sunrise',
    'prayer.dhuhr': 'Dhuhr',
    'prayer.asr': 'Asr',
    'prayer.maghrib': 'Maghrib',
    'prayer.isha': 'Isha',
    'prayer.location': 'Location',
    'prayer.islamicDate': 'Islamic Date',
    
    // Names of Allah
    'names.title': '99 Names of Allah',
    'names.subtitle': 'Al-Asma ul-Husna',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'settings.prayerReminders': 'Prayer Reminders',
    'settings.location': 'Location Settings',
    
    // Footer
    'footer.copyright': '© 2024 IlmPath. All rights reserved.',
    'footer.madeWith': 'Made with love for the Ummah',
  },
  bn: {
    // Navigation
    'nav.home': 'হোম',
    'nav.quran': 'কুরআন',
    'nav.read': 'পড়ুন',
    'nav.hadith': 'হাদিস',
    'nav.dua': 'দোয়া',
    'nav.settings': 'সেটিংস',
    
    // Hero
    'hero.title': 'ইলমপাথ',
    'hero.subtitle': 'কুরআন ও হাদিস • সম্পূর্ণ গাইডেন্স',
    'hero.search': 'উদাহরণ: নামাজ সম্পর্কে কুরআন কি বলে?',
    'hero.aiSubtitle': 'বাংলা বা ইংরেজিতে সার্চ করুন। এআই এর মাধ্যমে সঠিক তথ্য পান।',
    
    // Quick Access
    'quick.namesOfAllah': 'আল্লাহর ৯৯ নাম',
    'quick.namesDesc': 'অর্থসহ সুন্দর নামগুলো',
    'quick.prayer': 'নামাজ ও ক্যালেন্ডার',
    'quick.prayerDesc': 'নামাজের সময় ও ইসলামিক ইভেন্ট',
    'quick.duas': 'দৈনিক দোয়া',
    'quick.duasDesc': 'দৈনন্দিন দোয়া ও মুনাজাত',
    'quick.bookmarks': 'বুকমার্ক',
    'quick.bookmarksDesc': 'আপনার সংরক্ষিত আয়াত ও দোয়া',
    
    // Today's Content
    'today.title': 'আজকের আয়াত, দোয়া ও হাদিস',
    'today.verseOfDay': 'আজকের আয়াত',
    'today.duaOfDay': 'আজকের দোয়া',
    'today.hadithOfDay': 'আজকের হাদিস',
    'today.viewFull': 'সম্পূর্ণ দেখুন',
    'today.viewAllHadith': 'সব হাদিস দেখুন',
    'today.dailyLifeDuas': 'দৈনন্দিন দোয়া',
    'today.beforeSleeping': 'ঘুমানোর আগে',
    
    // Featured Surah
    'featured.title': 'বিশেষ সূরা',
    'featured.surahName': 'সূরা আল-ফাতিহা',
    'featured.surahDesc': 'প্রারম্ভিকা - কুরআনের সবচেয়ে বেশি পঠিত সূরা',
    'featured.readNow': 'এখনই পড়ুন',
    
    // Benefits
    'benefits.title': 'কুরআন তেলাওয়াতের উপকারিতা',
    'benefits.subtitle': 'প্রতিদিন পবিত্র কুরআনের সাথে সংযুক্ত থাকার অগণিত বরকত ও পুরস্কার আবিষ্কার করুন',
    'benefits.reward': 'দৈনিক পুরস্কার',
    'benefits.rewardDesc': 'প্রতিটি অক্ষর পাঠে অপরিসীম সওয়াব অর্জন করুন',
    'benefits.peace': 'মনের শান্তি',
    'benefits.peaceDesc': 'দৈনিক তেলাওয়াতে প্রশান্তি খুঁজুন',
    'benefits.guidance': 'জীবনের দিকনির্দেশনা',
    'benefits.guidanceDesc': 'জীবনের সকল ক্ষেত্রে হেদায়েত পান',
    'benefits.spirituality': 'আধ্যাত্মিক উন্নতি',
    'benefits.spiritualityDesc': 'আল্লাহর সাথে সম্পর্ক মজবুত করুন',
    'benefits.protection': 'ঐশ্বরিক সুরক্ষা',
    'benefits.protectionDesc': 'পবিত্র আয়াত দিয়ে নিজেকে রক্ষা করুন',
    'benefits.blessings': 'প্রচুর বরকত',
    'benefits.blessingsDesc': 'দৈনন্দিন জীবনে বরকত আনুন',
    
    // Stats
    'stats.title': 'আমাদের সংকলন অন্বেষণ করুন',
    'stats.surahs': 'সূরা উপলব্ধ',
    'stats.verses': 'পবিত্র আয়াত',
    'stats.hadithBooks': 'হাদিস গ্রন্থ',
    'stats.duas': 'দৈনিক দোয়া',
    
    // Explore
    'explore.title': 'আরও বৈশিষ্ট্য অন্বেষণ করুন',
    'explore.subtitle': 'আপনার ইসলামিক শিক্ষার যাত্রাকে উন্নত করতে সকল সরঞ্জাম ও সম্পদ আবিষ্কার করুন',
    'explore.namesOfAllah': 'আল্লাহর ৯৯ নাম',
    'explore.namesOfAllahDesc': 'অর্থ ও ফজিলতসহ আল্লাহর সুন্দর নামগুলো শিখুন',
    'explore.prayerTimes': 'নামাজের সময়',
    'explore.prayerTimesDesc': 'আপনার অবস্থানের সঠিক নামাজের সময় দিয়ে কোনো নামাজ মিস করবেন না',
    'explore.bookmarks': 'আপনার বুকমার্ক',
    'explore.bookmarksDesc': 'আপনার সংরক্ষিত আয়াত, দোয়া ও হাদিস এক জায়গায় অ্যাক্সেস করুন',
    'explore.learnMore': 'আরও জানুন',
    
    // Common
    'common.loading': 'লোড হচ্ছে...',
    'common.error': 'কিছু ভুল হয়েছে',
    'common.retry': 'আবার চেষ্টা করুন',
    'common.save': 'সংরক্ষণ',
    'common.cancel': 'বাতিল',
    'common.search': 'খুঁজুন',
    'common.viewAll': 'সব দেখুন',
    'common.share': 'শেয়ার',
    'common.copy': 'কপি',
    'common.bookmark': 'বুকমার্ক',
    'common.bookmarked': 'বুকমার্ক করা হয়েছে',
    
    // Quran
    'quran.title': 'পবিত্র কুরআন',
    'quran.surahs': 'সূরাসমূহ',
    'quran.verses': 'আয়াত',
    'quran.meccan': 'মক্কী',
    'quran.medinan': 'মাদানী',
    'quran.searchSurah': 'সূরা খুঁজুন...',
    'quran.play': 'বাজান',
    'quran.pause': 'বিরতি',
    
    // Hadith
    'hadith.title': 'হাদিস সংকলন',
    'hadith.narrator': 'বর্ণনাকারী',
    'hadith.source': 'সূত্র',
    
    // Dua
    'dua.title': 'দৈনিক দোয়া',
    'dua.categories': 'বিভাগসমূহ',
    'dua.morning': 'সকাল',
    'dua.evening': 'সন্ধ্যা',
    'dua.sleeping': 'ঘুমানোর আগে',
    'dua.eating': 'খাওয়ার সময়',
    'dua.travel': 'ভ্রমণ',
    
    // Prayer
    'prayer.title': 'নামাজের সময়সূচি',
    'prayer.fajr': 'ফজর',
    'prayer.sunrise': 'সূর্যোদয়',
    'prayer.dhuhr': 'যোহর',
    'prayer.asr': 'আসর',
    'prayer.maghrib': 'মাগরিব',
    'prayer.isha': 'ইশা',
    'prayer.location': 'অবস্থান',
    'prayer.islamicDate': 'ইসলামি তারিখ',
    
    // Names of Allah
    'names.title': 'আল্লাহর ৯৯ নাম',
    'names.subtitle': 'আল-আসমাউল হুসনা',
    
    // Settings
    'settings.title': 'সেটিংস',
    'settings.language': 'ভাষা',
    'settings.notifications': 'নোটিফিকেশন',
    'settings.prayerReminders': 'নামাজের রিমাইন্ডার',
    'settings.location': 'অবস্থান সেটিংস',
    
    // Footer
    'footer.copyright': '© ২০২৪ ইলমপাথ। সর্বস্বত্ব সংরক্ষিত।',
    'footer.madeWith': 'উম্মাহর জন্য ভালোবাসায় তৈরি',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isEnglish: language === 'en',
        isBengali: language === 'bn',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
