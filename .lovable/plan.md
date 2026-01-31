

# Hadith Search Pagination

## Overview
Modify the search functionality to find all matching hadiths and add pagination controls, allowing users to navigate through large result sets efficiently.

## Current State
- Search is limited to 50 results with no pagination
- All matching is done server-side with early termination at 50 results
- No way to see results beyond the first 50

## Proposed Changes

### 1. Update Search API Function
Modify `searchHadiths()` in `src/lib/hadithApi.ts`:
- Remove the 50-result limit during search
- Find ALL matching hadiths across selected collections
- Add `page` and `pageSize` parameters
- Return paginated slice with total count and pagination info

### 2. Update Search UI with Pagination
Modify `src/pages/Hadith.tsx`:
- Add `searchPage` state variable (starting at 1)
- Reset page to 1 when search query or collection filter changes
- Add pagination controls (Previous/Next buttons with page indicator)
- Show total results count and current page range

## Technical Details

### API Changes (src/lib/hadithApi.ts)

Update the `SearchResult` interface:
```text
interface SearchResult {
  hadiths: HadithResponse[];
  totalFound: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

Update `searchHadiths()` function:
- Add parameters: `page: number = 1`, `pageSize: number = 20`
- Remove the `limit` parameter
- Search ALL hadiths without early termination
- Store all matches in memory
- Return the correct slice based on page/pageSize
- Calculate and return `totalPages`

### Page Changes (src/pages/Hadith.tsx)

1. Add state: `searchPage` (number, default 1)
2. Reset `searchPage` to 1 when `debouncedSearchQuery` or `searchCollectionFilter` changes
3. Update React Query key to include `searchPage`
4. Add pagination UI below search results:
   - Previous/Next buttons
   - Current page indicator (e.g., "Page 1 of 5")
   - Results range (e.g., "Showing 1-20 of 100")

## User Experience

```text
User searches "prayer"
        |
        v
"Found 247 hadiths - Showing 1-20"
        |
        v
[Hadith results 1-20]
        |
        v
[Previous] Page 1 of 13 [Next]
```

## Implementation Files

| File | Changes |
|------|---------|
| `src/lib/hadithApi.ts` | Update `searchHadiths()` to support pagination |
| `src/pages/Hadith.tsx` | Add pagination state and UI controls |

## Performance Considerations
- Use existing cache to avoid re-fetching data on page changes
- Keep page size reasonable (20 items per page)
- React Query will cache results per page for quick navigation

