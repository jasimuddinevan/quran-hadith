
# Search Results - Full View Modal Implementation

## Overview
Add a "View Full" button to each search result card that opens a modal/drawer showing the complete content of the Quran verse or Hadith. The implementation will use a responsive pattern: a bottom drawer on mobile and a centered dialog on desktop.

## Changes Required

### 1. Create Full View Modal Component
**New file: `src/components/search/SearchResultFullView.tsx`**

A responsive component that:
- Uses `Drawer` (bottom sheet) on mobile screens
- Uses `Dialog` (centered modal) on desktop screens
- Displays full Arabic text (no truncation)
- Shows complete translation
- Includes action buttons: Copy, Share, Bookmark, Navigate to source

**Content Structure:**
- Header with type badge (Quran/Hadith) and reference
- Full Arabic text in styled container
- Complete translation text
- Action buttons row
- "Go to source" navigation button

### 2. Update Search Result Card
**File: `src/pages/Search.tsx`**

Modify `SearchResultCard` to:
- Add state for modal open/close
- Add "View Full" button (visible on hover for desktop, always visible on mobile)
- Pass result data to the new modal component
- Prevent card click from navigating when clicking "View Full"

### 3. Add Translation Keys
**File: `src/contexts/LanguageContext.tsx`**

Add new translations:
- `search.viewFull` - "View Full" / "সম্পূর্ণ দেখুন"
- `search.goToSource` - "Go to Source" / "মূল দেখুন"
- `search.copied` - "Copied!" / "কপি হয়েছে!"
- `search.bookmarked` - "Bookmarked!" / "বুকমার্ক হয়েছে!"

## Implementation Details

### Mobile Experience (< 768px)
- Bottom drawer slides up from bottom
- Drag handle at top for dismissal
- Full-width content
- Large touch targets for action buttons
- Swipe down to close

### Desktop Experience (>= 768px)
- Centered dialog with backdrop
- Maximum width of 600px
- Close button in corner
- Keyboard accessible (Escape to close)

### Full View Content Layout

```text
+----------------------------------+
|  [Badge: Quran/Hadith]     [X]  |
|  Surah Al-Baqarah - Verse 255   |
+----------------------------------+
|                                  |
|  [Arabic Text Container]         |
|  Full Arabic text with proper    |
|  right-to-left formatting        |
|  (styled with amber gradient)    |
|                                  |
+----------------------------------+
|  Translation                     |
|                                  |
|  Full translation text with      |
|  no line clamping                |
|                                  |
+----------------------------------+
|  [Copy] [Share] [Bookmark]       |
|                                  |
|  [Go to Source Button]           |
+----------------------------------+
```

### Action Handlers
- **Copy**: Copies Arabic + Translation + Reference to clipboard
- **Share**: Uses Web Share API on mobile, falls back to copy
- **Bookmark**: Adds to bookmark context with proper type
- **Go to Source**: Navigates to `/quran/{surah}?verse={verse}` or `/hadith?collection={slug}&hadith={number}`

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/search/SearchResultFullView.tsx` | Create |
| `src/pages/Search.tsx` | Modify |
| `src/contexts/LanguageContext.tsx` | Modify |

## Technical Notes

- Uses existing `useIsMobile()` hook for responsive behavior
- Leverages existing UI components: `Drawer`, `Dialog`, `Button`, `Badge`
- Uses existing `useBookmarks()` and `useToast()` hooks
- Follows existing styling patterns from `HadithCard.tsx` for Arabic text container
