import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    'hero.title': 'Quran Insight',
    'hero.subtitle': 'For Learning Quran Easily',
    'hero.search': 'Search anything about Islam, Quran, Hadith...',
    'hero.aiPowered': 'AI-powered search',
    
    // Quick Access
    'quick.namesOfAllah': '99 Names of Allah',
    'quick.namesDesc': 'Learn the beautiful names',
    'quick.prayer': 'Prayer & Calendar',
    'quick.prayerDesc': 'Prayer times & Islamic dates',
    'quick.duas': 'Daily Duas',
    'quick.duasDesc': 'Essential supplications',
    'quick.bookmarks': 'Bookmarks',
    'quick.bookmarksDesc': 'Your saved items',
    
    // Today's Content
    'today.title': "Today's Islamic Content",
    'today.verseOfDay': 'Verse of the Day',
    'today.duaOfDay': 'Dua of the Day',
    'today.hadithOfDay': 'Hadith of the Day',
    'today.viewFull': 'View Full',
    
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
    'footer.copyright': '© 2024 Quran Insight. All rights reserved.',
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
    'hero.title': 'কুরআন ইনসাইট',
    'hero.subtitle': 'সহজে কুরআন শেখার জন্য',
    'hero.search': 'ইসলাম, কুরআন, হাদিস সম্পর্কে যেকোনো কিছু খুঁজুন...',
    'hero.aiPowered': 'এআই-চালিত সার্চ',
    
    // Quick Access
    'quick.namesOfAllah': 'আল্লাহর ৯৯ নাম',
    'quick.namesDesc': 'সুন্দর নামগুলো শিখুন',
    'quick.prayer': 'নামাজ ও ক্যালেন্ডার',
    'quick.prayerDesc': 'নামাজের সময় ও ইসলামিক তারিখ',
    'quick.duas': 'দৈনিক দোয়া',
    'quick.duasDesc': 'প্রয়োজনীয় দোয়াসমূহ',
    'quick.bookmarks': 'বুকমার্ক',
    'quick.bookmarksDesc': 'আপনার সংরক্ষিত আইটেম',
    
    // Today's Content
    'today.title': 'আজকের ইসলামিক বিষয়বস্তু',
    'today.verseOfDay': 'আজকের আয়াত',
    'today.duaOfDay': 'আজকের দোয়া',
    'today.hadithOfDay': 'আজকের হাদিস',
    'today.viewFull': 'সম্পূর্ণ দেখুন',
    
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
    'footer.copyright': '© ২০২৪ কুরআন ইনসাইট। সর্বস্বত্ব সংরক্ষিত।',
    'footer.madeWith': 'উম্মাহর জন্য ভালোবাসায় তৈরি',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
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
