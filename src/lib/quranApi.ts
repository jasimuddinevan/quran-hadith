// Quran Search API Service
// Using Quran.com API v4

export interface QuranSearchResult {
  verseKey: string;
  surahNumber: number;
  verseNumber: number;
  surahName: string;
  surahNameArabic: string;
  textArabic: string;
  textTranslation: string;
  highlightedText?: string;
}

export interface QuranSearchResponse {
  results: QuranSearchResult[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
}

// Cache for search results
const quranSearchCache: Map<string, QuranSearchResponse> = new Map();

// Surah names for reference
const surahNames: Record<number, { en: string; ar: string; bn: string }> = {
  1: { en: 'Al-Fatiha', ar: 'الفاتحة', bn: 'আল-ফাতিহা' },
  2: { en: 'Al-Baqarah', ar: 'البقرة', bn: 'আল-বাকারা' },
  3: { en: 'Ali Imran', ar: 'آل عمران', bn: 'আলে ইমরান' },
  4: { en: 'An-Nisa', ar: 'النساء', bn: 'আন-নিসা' },
  5: { en: 'Al-Maidah', ar: 'المائدة', bn: 'আল-মায়িদাহ' },
  // Add more as needed - the API will provide names
};

export async function searchQuran(
  query: string,
  language: 'en' | 'bn' = 'en',
  page: number = 1,
  size: number = 20
): Promise<QuranSearchResponse> {
  if (query.length < 2) {
    return { results: [], totalResults: 0, currentPage: 1, totalPages: 0 };
  }

  const cacheKey = `${query.toLowerCase()}-${language}-${page}-${size}`;
  
  if (quranSearchCache.has(cacheKey)) {
    return quranSearchCache.get(cacheKey)!;
  }

  try {
    // Use Quran.com API v4 search endpoint
    const langCode = language === 'bn' ? 'bn' : 'en';
    const translationId = language === 'bn' ? 161 : 131; // Bengali: Muhiuddin Khan, English: Sahih International
    
    const response = await fetch(
      `https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}&size=${size}&page=${page}&language=${langCode}`
    );

    if (!response.ok) {
      throw new Error('Quran search API failed');
    }

    const data = await response.json();
    
    const results: QuranSearchResult[] = (data.search?.results || []).map((result: any) => {
      const verseKey = result.verse_key || '';
      const [surahNum, verseNum] = verseKey.split(':').map(Number);
      
      return {
        verseKey,
        surahNumber: surahNum,
        verseNumber: verseNum,
        surahName: result.translations?.[0]?.resource_name || surahNames[surahNum]?.en || `Surah ${surahNum}`,
        surahNameArabic: surahNames[surahNum]?.ar || '',
        textArabic: result.text || '',
        textTranslation: result.translations?.[0]?.text || '',
        highlightedText: result.highlighted || result.text,
      };
    });

    const searchResponse: QuranSearchResponse = {
      results,
      totalResults: data.search?.total_results || results.length,
      currentPage: page,
      totalPages: Math.ceil((data.search?.total_results || results.length) / size),
    };

    quranSearchCache.set(cacheKey, searchResponse);
    return searchResponse;
  } catch (error) {
    console.error('Error searching Quran:', error);
    return { results: [], totalResults: 0, currentPage: page, totalPages: 0 };
  }
}

// Clear search cache (useful for testing)
export function clearQuranSearchCache(): void {
  quranSearchCache.clear();
}
