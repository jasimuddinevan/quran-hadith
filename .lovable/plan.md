
# Hero Search Feature Implementation

## Overview
Implement a functional search feature in the hero section that allows users to search across Quran and Hadith content. The search bar will include a dropdown filter (All/Quran/Hadith) and navigate to a dedicated search results page showing matched content with highlighted search terms.

## User Experience

**Search Flow:**
1. User types a search query in the hero search bar
2. User can optionally select a filter: All (default), Quran, or Hadith
3. Clicking search (or pressing Enter) navigates to `/search?q=query&filter=all`
4. Search results page displays matching content with:
   - Filter tabs for quick switching (All/Quran/Hadith)
   - Result count and search time
   - Highlighted search terms in results
   - Pagination for large result sets

**Filter Options:**
- **All**: Search both Quran and Hadith (default)
- **Quran**: Search only in Quran verses (Arabic, English, Bengali translations)
- **Hadith**: Search only in Hadith collections

## Technical Implementation

### 1. New Files to Create

**src/pages/Search.tsx**
A dedicated search results page that:
- Reads query parameters (`q` for query, `filter` for content type)
- Displays tabbed interface similar to hadithbd.com (All/Hadith/Quran)
- Shows result count and search timing
- Renders results with source badges (Quran/Hadith)
- Supports pagination (20 results per page)
- Highlights matched keywords in results

**src/lib/quranApi.ts**
A new API module for Quran search functionality:
- `searchQuran(query, language)` - Search across all verses
- Uses the existing Quran.com API v4 for search
- Caches results for performance
- Returns structured results with surah info, verse numbers, and translations

### 2. Files to Modify

**src/components/home/HeroSection.tsx**
- Add a filter dropdown (Select component) integrated into the search bar design
- Add state for `searchFilter` ('all' | 'quran' | 'hadith')
- Update `handleSearch` to navigate to `/search?q=${query}&filter=${filter}`
- Style the dropdown to match the elegant gold-themed design

**src/App.tsx**
- Add new route: `<Route path="/search" element={<Search />} />`

**src/contexts/LanguageContext.tsx**
- Add search-related translations for both English and Bengali

### 3. Component Structure for Search Results Page

```text
+------------------------------------------+
|  Search Results for "prayer"              |
|  Found 245 results (0.5s)                 |
+------------------------------------------+
|  [ All ] [ Hadith ] [ Quran ]  <- Tabs   |
+------------------------------------------+
|                                          |
|  +------------------------------------+  |
|  | Quran  |  Surah 2, Verse 45        |  |
|  | Arabic text with highlighting...   |  |
|  | Translation with **prayer**...     |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  | Hadith | Sahih Bukhari #982        |  |
|  | Arabic text...                      |  |
|  | "...about **prayer** times..."      |  |
|  +------------------------------------+  |
|                                          |
|  [ Previous ] Page 1 of 13 [ Next ]      |
+------------------------------------------+
```

### 4. Hero Section Search Bar Layout

```text
+--------------------------------------------------+
|  🔍 | Search placeholder text...    | All ▾ | 🎤 |🔎|
+--------------------------------------------------+
        ^                               ^
        Search icon                     Filter dropdown
```

The filter dropdown will appear as a compact button showing the current selection, opening to reveal All/Quran/Hadith options.

### 5. Quran Search API Implementation

Using Quran.com API v4 search endpoint:
```text
GET https://api.quran.com/api/v4/search?q={query}&size=20&page={page}&language={lang}
```

Returns: verse key, Arabic text, translations, surah name, verse number

### 6. Changes Summary

| File | Changes |
|------|---------|
| `src/pages/Search.tsx` | NEW - Search results page with tabs, results list, pagination |
| `src/lib/quranApi.ts` | NEW - Quran search API functions |
| `src/components/home/HeroSection.tsx` | Add filter dropdown, navigation logic |
| `src/App.tsx` | Add `/search` route |
| `src/contexts/LanguageContext.tsx` | Add search-related translations |

### 7. New Translations to Add

**English:**
- `search.title`: 'Search Results'
- `search.resultsFor`: 'Results for'
- `search.found`: 'Found'
- `search.results`: 'results'
- `search.all`: 'All'
- `search.quran`: 'Quran'
- `search.hadith`: 'Hadith'
- `search.noResults`: 'No results found'
- `search.tryDifferent`: 'Try different keywords'
- `search.searchTime`: 'Search completed in'
- `search.seconds`: 'seconds'

**Bengali:**
- `search.title`: 'অনুসন্ধান ফলাফল'
- `search.resultsFor`: 'ফলাফল'
- `search.found`: 'পাওয়া গেছে'
- `search.results`: 'টি ফলাফল'
- `search.all`: 'সব'
- `search.quran`: 'কুরআন'
- `search.hadith`: 'হাদিস'
- `search.noResults`: 'কোনো ফলাফল পাওয়া যায়নি'
- `search.tryDifferent`: 'অন্য কীওয়ার্ড চেষ্টা করুন'
- `search.searchTime`: 'অনুসন্ধান সম্পন্ন হয়েছে'
- `search.seconds`: 'সেকেন্ডে'

### 8. Search Result Card Design

Each result card will display:
- Source badge (Quran/Hadith) with appropriate color
- Reference info (Surah X:Y for Quran, Collection #Number for Hadith)
- Arabic text
- Translation text (Bengali/English based on language setting)
- Highlighted search terms using `<mark>` tags

### 9. Performance Considerations

- Debounce search input (already implemented in hadith search)
- Cache search results to avoid repeated API calls
- Limit results per page to 20
- Show loading skeleton while searching
- Progressive loading for better UX
