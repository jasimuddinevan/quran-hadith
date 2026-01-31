
# Hadith Search Functionality

## Overview
Add a comprehensive search feature to the Hadith page that allows users to find hadiths by keyword across all collections, with the ability to filter by specific collection.

## Features

### 1. Search UI Enhancement
- Add a new "Search" tab alongside "Collections" and "Browse" tabs
- Include a search input with a collection filter dropdown
- Display search results with highlighting of matched keywords
- Show loading state while searching large datasets

### 2. Search Functionality
- Search across English and Bengali translations
- Optional: Include Arabic text in search
- Minimum 3 characters required before searching
- Debounced search input (300ms delay) to avoid excessive processing
- Limit results to 50 hadiths for performance

### 3. Collection Filter
- "All Collections" option to search across Bukhari, Muslim, Tirmidhi, etc.
- Individual collection filter (e.g., search only in Sahih Bukhari)
- Display collection name badge on each search result

## User Flow

```text
User opens Hadith page
        |
        v
Sees 3 tabs: [Collections] [Search] [Browse]
        |
        v
Clicks "Search" tab
        |
        v
Enters keyword (e.g., "prayer" or "নামাজ")
        |
        v
Optionally selects a specific collection
        |
        v
Results load progressively as data fetches
        |
        v
Views matching hadiths with source info
```

## Technical Details

### API Changes (src/lib/hadithApi.ts)
1. Add new `searchHadiths()` function:
   - Accept parameters: query string, collection (optional), language
   - Load hadith data from specified collection(s)
   - Filter hadiths where text contains the search query
   - Return matching hadiths with Arabic text included
   - Limit to 50 results for performance

2. Modify caching strategy:
   - Leverage existing `hadithCache` for efficient repeat searches
   - Pre-load commonly searched collections (Bukhari, Muslim)

### Page Changes (src/pages/Hadith.tsx)
1. Add new state variables:
   - `searchQuery` for the search input value
   - `searchCollection` for the selected collection filter ("all" or collection ID)
   - `debouncedQuery` for the debounced search term

2. Add new React Query hook for search:
   - Key: `['hadithSearch', debouncedQuery, searchCollection, language]`
   - Enable only when query length >= 3 characters
   - Call new `searchHadiths()` API function

3. Update tabs structure:
   - Three tabs: Collections, Search, Browse
   - Search tab contains:
     - Search input with icon
     - Collection dropdown (Select component)
     - Results count indicator
     - Search results list or empty state

### UI Components
1. Search results will reuse existing `HadithCard` component
2. Add result count badge (e.g., "Found 23 hadiths")
3. Show helpful empty states:
   - Before search: "Enter at least 3 characters to search"
   - No results: "No hadiths found matching your search"

## Implementation Files

| File | Changes |
|------|---------|
| `src/lib/hadithApi.ts` | Add `searchHadiths()` function |
| `src/pages/Hadith.tsx` | Add Search tab, search UI, and query hook |

## Performance Considerations
- Use debouncing (300ms) to prevent excessive API calls while typing
- Limit search results to 50 hadiths
- Leverage existing cache to avoid re-fetching data
- Show skeleton loaders during search
