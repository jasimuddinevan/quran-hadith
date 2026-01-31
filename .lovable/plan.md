

# Change Bengali Font to Noto Serif Bengali

## Overview
Replace the current "Anek Bangla" font with "Noto Serif Bengali" from BanglaWebFonts for Bengali text throughout the website. The header logo text will remain with the current font but be slightly larger (1-2px).

## Current State
- **Primary font**: Anek Bangla (loaded from Google Fonts)
- **Arabic font**: Amiri (unchanged)
- **Header title**: Uses `text-lg` class (18px)
- Font is defined in `tailwind.config.ts` and loaded in `index.html`

## Proposed Changes

### 1. Update Font Loading (index.html)
- Replace Google Fonts Anek Bangla link with BanglaWebFonts Noto Serif Bengali link
- Keep Amiri font for Arabic text

### 2. Update Tailwind Configuration (tailwind.config.ts)
- Change `font-sans` from 'Anek Bangla' to 'Noto Serif Bengali'
- Fallback to system fonts

### 3. Increase Header Title Size (Header.tsx)
- Change logo title from `text-lg` (18px) to `text-xl` (20px) for a 2px increase

## Implementation Details

### File: index.html
Replace the font links in the `<head>`:
```text
<!-- Remove Anek Bangla, add Noto Serif Bengali -->
<link rel="preconnect" href="https://banglawebfonts.pages.dev">
<link href="https://banglawebfonts.pages.dev/css/noto-serif-bengali.css" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">
```

### File: tailwind.config.ts
Update the fontFamily configuration:
```text
fontFamily: {
  sans: ['Noto Serif Bengali', 'system-ui', 'sans-serif'],
  arabic: ['Amiri', 'serif'],
},
```

### File: src/components/layout/Header.tsx
Increase the header title font size:
```text
// Change from text-lg to text-xl
<span className="text-xl font-semibold leading-tight text-foreground">
```

## Summary

| File | Change |
|------|--------|
| `index.html` | Replace Anek Bangla with Noto Serif Bengali font link |
| `tailwind.config.ts` | Update `font-sans` to use 'Noto Serif Bengali' |
| `src/components/layout/Header.tsx` | Increase title from `text-lg` to `text-xl` (+2px) |

