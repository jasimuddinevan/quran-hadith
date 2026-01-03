// Hadith API Service
// Using fawazahmed0/hadith-api via jsDelivr CDN

export interface HadithResponse {
  id: number;
  hadithNumber: string;
  hadithArabic: string;
  hadithEnglish: string;
  hadithBengali?: string;
  bookSlug: string;
  chapterNumber: string;
  chapterTitle: string;
  narrator?: string;
}

export interface HadithCollection {
  id: string;
  name: string;
  nameAr: string;
  nameBn: string;
  count: number;
  apiId: string;
}

export const hadithCollections: HadithCollection[] = [
  { id: 'bukhari', name: 'Sahih Bukhari', nameAr: 'صحيح البخاري', nameBn: 'সহীহ বুখারী', count: 7563, apiId: 'bukhari' },
  { id: 'muslim', name: 'Sahih Muslim', nameAr: 'صحيح مسلم', nameBn: 'সহীহ মুসলিম', count: 3033, apiId: 'muslim' },
  { id: 'tirmidhi', name: 'Jami at-Tirmidhi', nameAr: 'جامع الترمذي', nameBn: 'জামে তিরমিযী', count: 3956, apiId: 'tirmidhi' },
  { id: 'abudawud', name: 'Sunan Abu Dawud', nameAr: 'سنن أبي داود', nameBn: 'সুনানে আবু দাউদ', count: 5274, apiId: 'abudawud' },
  { id: 'nasai', name: "Sunan an-Nasa'i", nameAr: 'سنن النسائي', nameBn: "সুনানে নাসাঈ", count: 5761, apiId: 'nasai' },
  { id: 'ibnmajah', name: 'Sunan Ibn Majah', nameAr: 'سنن ابن ماجه', nameBn: 'সুনানে ইবনে মাজাহ', count: 4341, apiId: 'ibnmajah' },
];

const API_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';

// Cache for loaded hadith data
const hadithCache: Map<string, any[]> = new Map();

async function loadHadithData(collection: string, language: 'en' | 'bn' = 'en'): Promise<any[]> {
  const cacheKey = `${language}-${collection}`;
  
  if (hadithCache.has(cacheKey)) {
    return hadithCache.get(cacheKey)!;
  }

  const langPrefix = language === 'bn' ? 'ben' : 'eng';
  const collectionInfo = hadithCollections.find(c => c.id === collection);
  const apiId = collectionInfo?.apiId || collection;

  try {
    // Try primary CDN
    const response = await fetch(`${API_BASE}/editions/${langPrefix}-${apiId}.json`);
    if (!response.ok) throw new Error('Primary API failed');
    
    const data = await response.json();
    const hadiths = data.hadiths || [];
    hadithCache.set(cacheKey, hadiths);
    return hadiths;
  } catch (error) {
    console.error('Error loading hadith data:', error);
    
    // Try fallback mirror
    try {
      const fallbackResponse = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${langPrefix}-${apiId}.min.json`);
      if (!fallbackResponse.ok) throw new Error('Fallback API failed');
      
      const data = await fallbackResponse.json();
      const hadiths = data.hadiths || [];
      hadithCache.set(cacheKey, hadiths);
      return hadiths;
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return [];
    }
  }
}

export async function fetchHadithById(
  collection: string, 
  id: number, 
  language: 'en' | 'bn' = 'en'
): Promise<HadithResponse | null> {
  try {
    const hadiths = await loadHadithData(collection, language);
    const hadith = hadiths.find((h: any) => h.hadithnumber === id) || hadiths[id - 1];
    
    if (!hadith) return null;

    // Also fetch the other language for bilingual display
    const otherLang = language === 'bn' ? 'en' : 'bn';
    const otherHadiths = await loadHadithData(collection, otherLang);
    const otherHadith = otherHadiths.find((h: any) => h.hadithnumber === hadith.hadithnumber) || otherHadiths[id - 1];

    return {
      id: hadith.hadithnumber || id,
      hadithNumber: String(hadith.hadithnumber || id),
      hadithArabic: hadith.arabicnumber ? `حديث رقم: ${hadith.arabicnumber}` : '',
      hadithEnglish: language === 'en' ? hadith.text : (otherHadith?.text || hadith.text),
      hadithBengali: language === 'bn' ? hadith.text : (otherHadith?.text || ''),
      bookSlug: collection,
      chapterNumber: hadith.reference?.book || '',
      chapterTitle: '',
      narrator: '',
    };
  } catch (error) {
    console.error('Error fetching hadith:', error);
    return null;
  }
}

export async function fetchHadithsByCollection(
  collection: string,
  page: number = 1,
  limit: number = 10,
  language: 'en' | 'bn' = 'en'
): Promise<{ hadiths: HadithResponse[]; hasMore: boolean }> {
  try {
    const allHadiths = await loadHadithData(collection, language);
    
    // Also load other language for bilingual display
    const otherLang = language === 'bn' ? 'en' : 'bn';
    const otherHadiths = await loadHadithData(collection, otherLang);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedHadiths = allHadiths.slice(startIndex, endIndex);
    
    const hadiths: HadithResponse[] = paginatedHadiths.map((hadith: any, index: number) => {
      const otherHadith = otherHadiths.find((h: any) => h.hadithnumber === hadith.hadithnumber) || otherHadiths[startIndex + index];
      
      return {
        id: hadith.hadithnumber || startIndex + index + 1,
        hadithNumber: String(hadith.hadithnumber || startIndex + index + 1),
        hadithArabic: '',
        hadithEnglish: language === 'en' ? hadith.text : (otherHadith?.text || hadith.text),
        hadithBengali: language === 'bn' ? hadith.text : (otherHadith?.text || ''),
        bookSlug: collection,
        chapterNumber: hadith.reference?.book || '',
        chapterTitle: '',
        narrator: '',
      };
    });

    return {
      hadiths,
      hasMore: endIndex < allHadiths.length,
    };
  } catch (error) {
    console.error('Error fetching hadiths:', error);
    return { hadiths: [], hasMore: false };
  }
}

export async function fetchRandomHadiths(count: number = 5, language: 'en' | 'bn' = 'en'): Promise<HadithResponse[]> {
  const hadiths: HadithResponse[] = [];
  const collections = ['bukhari', 'muslim'];
  
  for (let i = 0; i < count; i++) {
    const collection = collections[i % collections.length];
    
    try {
      const allHadiths = await loadHadithData(collection, language);
      const otherLang = language === 'bn' ? 'en' : 'bn';
      const otherHadiths = await loadHadithData(collection, otherLang);
      
      if (allHadiths.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(allHadiths.length, 500));
        const hadith = allHadiths[randomIndex];
        const otherHadith = otherHadiths.find((h: any) => h.hadithnumber === hadith.hadithnumber) || otherHadiths[randomIndex];
        
        hadiths.push({
          id: hadith.hadithnumber || randomIndex + 1,
          hadithNumber: String(hadith.hadithnumber || randomIndex + 1),
          hadithArabic: '',
          hadithEnglish: language === 'en' ? hadith.text : (otherHadith?.text || hadith.text),
          hadithBengali: language === 'bn' ? hadith.text : (otherHadith?.text || ''),
          bookSlug: collection,
          chapterNumber: hadith.reference?.book || '',
          chapterTitle: '',
          narrator: '',
        });
      }
    } catch (error) {
      console.error('Error fetching random hadith:', error);
    }
  }

  return hadiths;
}

export function getCollectionName(id: string, language: 'en' | 'bn' = 'en'): string {
  const collection = hadithCollections.find(c => c.id === id);
  if (!collection) return id;
  return language === 'bn' ? collection.nameBn : collection.name;
}
