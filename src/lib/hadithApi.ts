// Hadith API Service
// Using hadithapi.pages.dev

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
}

export const hadithCollections: HadithCollection[] = [
  { id: 'bukhari', name: 'Sahih Bukhari', nameAr: 'صحيح البخاري', nameBn: 'সহীহ বুখারী', count: 7563 },
  { id: 'muslim', name: 'Sahih Muslim', nameAr: 'صحيح مسلم', nameBn: 'সহীহ মুসলিম', count: 7470 },
  { id: 'tirmidhi', name: 'Jami at-Tirmidhi', nameAr: 'جامع الترمذي', nameBn: 'জামে তিরমিযী', count: 3956 },
  { id: 'abudawud', name: 'Sunan Abu Dawud', nameAr: 'سنن أبي داود', nameBn: 'সুনানে আবু দাউদ', count: 5274 },
  { id: 'nasai', name: "Sunan an-Nasa'i", nameAr: 'سنن النسائي', nameBn: "সুনানে নাসাঈ", count: 5761 },
  { id: 'ibnmajah', name: 'Sunan Ibn Majah', nameAr: 'سنن ابن ماجه', nameBn: 'সুনানে ইবনে মাজাহ', count: 4341 },
];

const BASE_URL = 'https://hadithapi.pages.dev/api';

export async function fetchHadithById(collection: string, id: number): Promise<HadithResponse | null> {
  try {
    const response = await fetch(`${BASE_URL}/${collection}/${id}.json`);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      id: data.id || id,
      hadithNumber: data.hadithNumber || String(id),
      hadithArabic: data.hadithArabic || '',
      hadithEnglish: data.hadithEnglish || '',
      hadithBengali: data.hadithBengali || '',
      bookSlug: collection,
      chapterNumber: data.chapterNumber || '',
      chapterTitle: data.chapterTitle || '',
      narrator: data.narrator || '',
    };
  } catch (error) {
    console.error('Error fetching hadith:', error);
    return null;
  }
}

export async function fetchHadithsByCollection(
  collection: string,
  page: number = 1,
  limit: number = 10
): Promise<{ hadiths: HadithResponse[]; hasMore: boolean }> {
  const hadiths: HadithResponse[] = [];
  const startId = (page - 1) * limit + 1;
  const endId = startId + limit;

  const collectionInfo = hadithCollections.find(c => c.id === collection);
  const maxCount = collectionInfo?.count || 100;

  const promises = [];
  for (let i = startId; i < endId && i <= maxCount; i++) {
    promises.push(fetchHadithById(collection, i));
  }

  const results = await Promise.all(promises);
  
  for (const result of results) {
    if (result) {
      hadiths.push(result);
    }
  }

  return {
    hadiths,
    hasMore: endId < maxCount,
  };
}

export async function fetchRandomHadiths(count: number = 5): Promise<HadithResponse[]> {
  const hadiths: HadithResponse[] = [];
  const collections = ['bukhari', 'muslim'];
  
  const promises = [];
  for (let i = 0; i < count; i++) {
    const collection = collections[i % collections.length];
    const collectionInfo = hadithCollections.find(c => c.id === collection);
    const maxId = Math.min(collectionInfo?.count || 100, 500); // Limit to first 500 for faster loading
    const randomId = Math.floor(Math.random() * maxId) + 1;
    promises.push(fetchHadithById(collection, randomId));
  }

  const results = await Promise.all(promises);
  
  for (const result of results) {
    if (result) {
      hadiths.push(result);
    }
  }

  return hadiths;
}

export function getCollectionName(id: string, language: 'en' | 'bn' = 'en'): string {
  const collection = hadithCollections.find(c => c.id === id);
  if (!collection) return id;
  return language === 'bn' ? collection.nameBn : collection.name;
}
