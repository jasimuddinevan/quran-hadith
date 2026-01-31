

# Real-time Word-by-Word Highlighting for Quran Audio

## Overview
Implement real-time word-by-word highlighting synchronized with audio playback in the Surah Reader, similar to Quran.com. Each Arabic word will highlight as the reciter speaks it, and users can click on any word to see its translation.

## API Strategy

We'll use the **Quran Foundation API** (api.quran.com) which provides:
- Word-by-word data with Arabic text, English translations, and transliterations
- Word-level audio timing segments for synchronized highlighting
- The same Mishary Al-Afasy reciter (ID: 5) currently in use

| Feature | Current (AlQuran.cloud) | New (api.quran.com) |
|---------|-------------------------|---------------------|
| Arabic text | ✅ | ✅ with word-level |
| Translations | ✅ English/Bengali | ✅ English (word + verse) |
| Audio | ✅ Alafasy | ✅ Alafasy with timing |
| Word timing | ❌ | ✅ `[word_index, start_ms, end_ms]` |

## User Experience

**During Audio Playback:**
- Words highlight one-by-one in primary color (indigo/teal) with smooth transitions
- Currently playing verse maintains its ring highlight
- Auto-scrolls to keep active word visible

**Click Interaction:**
- Click any Arabic word to see a popover with:
  - The word in larger Arabic text
  - English transliteration (how to pronounce)
  - English translation (meaning)

## Technical Implementation

### New Data Structures

```text
interface Word {
  id: number;
  position: number;          // 1-based word index in verse
  text_uthmani: string;      // Arabic text
  char_type_name: 'word' | 'end';  // 'end' is verse end marker
  translation: { text: string };
  transliteration: { text: string };
}

interface VerseWithWords {
  verse_key: string;         // e.g., "23:1"
  verse_number: number;
  words: Word[];
  translations: { text: string }[];
}

interface AudioTimestamp {
  verse_key: string;
  timestamp_from: number;    // ms when verse starts
  timestamp_to: number;      // ms when verse ends
  segments: [number, number, number][];  // [word_position, start_ms, end_ms]
}
```

### Files to Modify

**1. src/pages/SurahReader.tsx (Major Refactor)**

API Changes:
- Replace AlQuran.cloud calls with Quran Foundation API
- Fetch verses with `words=true` for word-level data
- Fetch chapter audio with `segments=true` for timing data

New State:
```text
const [wordData, setWordData] = useState<VerseWithWords[]>([]);
const [audioTimings, setAudioTimings] = useState<Map<string, AudioTimestamp>>();
const [highlightedWord, setHighlightedWord] = useState<{verseKey: string, position: number} | null>(null);
```

Audio Synchronization:
```text
// On audio.ontimeupdate
const currentTimeMs = audio.currentTime * 1000;
// Find which word's segment contains currentTimeMs
// Set highlightedWord to that word's position
```

UI Changes:
- Render Arabic text as clickable word spans instead of a single text block
- Apply highlight class to the currently playing word

**2. src/components/quran/WordPopover.tsx (New Component)**

A simple popover component that displays when clicking a word:
```text
interface WordPopoverProps {
  word: Word;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}
```

Shows:
- Arabic word (large, centered)
- Transliteration (italicized)
- Translation (meaning)

**3. src/index.css (Add Styles)**

Add word highlighting styles:
```text
.quran-word {
  cursor: pointer;
  transition: all 150ms ease;
  padding: 0.1em 0.15em;
  border-radius: 0.25rem;
}

.quran-word:hover {
  background-color: hsl(var(--primary) / 0.1);
}

.quran-word.highlighted {
  background-color: hsl(var(--primary) / 0.25);
  color: hsl(var(--primary));
}
```

### API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v4/chapters/{id}` | Chapter metadata |
| `GET /api/v4/verses/by_chapter/{id}?words=true&translation=131&per_page=300` | Verses with word data |
| `GET /api/v4/chapter_recitations/5/{id}?segments=true` | Audio URL + word timing |

Note: Translation ID 131 is "Dr. Mustafa Khattab, the Clear Quran" (English). Bengali word-by-word isn't available in this API, so we'll use English for word translations but can still show Bengali verse translation.

### Audio Synchronization Flow

```text
1. User clicks Play (verse or Play All)
   ↓
2. Load full chapter audio file from API
   ↓  
3. Start playing, set up ontimeupdate handler
   ↓
4. Every ~50ms, check current playback time
   ↓
5. Find matching word segment:
   - Loop through verses → segments
   - Find segment where start_ms <= currentTime <= end_ms
   ↓
6. Update highlightedWord state
   ↓
7. Word span re-renders with .highlighted class
```

## Summary of Changes

| File | Type | Changes |
|------|------|---------|
| `src/pages/SurahReader.tsx` | Modify | Switch to Quran Foundation API, add word-level state, implement audio time tracking, render words as spans with click handling |
| `src/components/quran/WordPopover.tsx` | New | Component for displaying word translation on click |
| `src/index.css` | Modify | Add `.quran-word` and `.quran-word.highlighted` styles |

## Notes

- The chapter audio file is a single MP3 containing all verses, which works better for word synchronization than individual verse files
- Word position in segments is 1-based, matching the word data from the API
- Bengali verse translations will still work; only word-level translations are English
- Verse-level highlighting (ring around card) continues to work alongside word highlighting

