import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Share2, Bookmark, ExternalLink, X, BookOpen, Book } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCollectionName } from '@/lib/hadithApi';
import type { QuranSearchResult } from '@/lib/quranApi';
import type { HadithResponse } from '@/lib/hadithApi';

interface SearchResultFullViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'quran' | 'hadith';
  quranResult?: QuranSearchResult;
  hadithResult?: HadithResponse;
}

const SearchResultFullView: React.FC<SearchResultFullViewProps> = ({
  open,
  onOpenChange,
  type,
  quranResult,
  hadithResult,
}) => {
  const { t, language } = useLanguage();
  const { addBookmark, isBookmarked, removeBookmark } = useBookmarks();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const getReference = () => {
    if (type === 'quran' && quranResult) {
      return `${language === 'bn' ? 'সূরা' : 'Surah'} ${quranResult.surahName} • ${language === 'bn' ? 'আয়াত' : 'Verse'} ${quranResult.verseNumber}`;
    }
    if (type === 'hadith' && hadithResult) {
      const collectionName = getCollectionName(hadithResult.bookSlug, language);
      return `${collectionName} #${hadithResult.hadithNumber}`;
    }
    return '';
  };

  const getArabicText = () => {
    if (type === 'quran' && quranResult) return quranResult.textArabic;
    if (type === 'hadith' && hadithResult) return hadithResult.hadithArabic;
    return '';
  };

  const getTranslation = () => {
    if (type === 'quran' && quranResult) return quranResult.textTranslation;
    if (type === 'hadith' && hadithResult) {
      return language === 'bn' 
        ? (hadithResult.hadithBengali || hadithResult.hadithEnglish) 
        : hadithResult.hadithEnglish;
    }
    return '';
  };

  const getBookmarkId = () => {
    if (type === 'quran' && quranResult) {
      return `verse-${quranResult.surahNumber}-${quranResult.verseNumber}`;
    }
    if (type === 'hadith' && hadithResult) {
      return `hadith-${hadithResult.bookSlug}-${hadithResult.hadithNumber}`;
    }
    return '';
  };

  const handleCopy = async () => {
    const arabic = getArabicText();
    const translation = getTranslation();
    const reference = getReference();
    
    const textToCopy = `${arabic}\n\n${translation}\n\n— ${reference}`;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: t('search.copied'),
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    const arabic = getArabicText();
    const translation = getTranslation();
    const reference = getReference();
    
    const shareData = {
      title: reference,
      text: `${arabic}\n\n${translation}\n\n— ${reference}`,
    };

    if (navigator.share && isMobile) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const handleBookmark = () => {
    const id = getBookmarkId();
    
    if (isBookmarked(id)) {
      removeBookmark(id);
      return;
    }

    if (type === 'quran' && quranResult) {
      addBookmark({
        type: 'verse',
        title: `${quranResult.surahName} ${quranResult.verseNumber}`,
        arabic: quranResult.textArabic,
        translation: quranResult.textTranslation,
        reference: `Surah ${quranResult.surahNumber}:${quranResult.verseNumber}`,
      });
    } else if (type === 'hadith' && hadithResult) {
      addBookmark({
        type: 'hadith',
        title: `${getCollectionName(hadithResult.bookSlug, 'en')} #${hadithResult.hadithNumber}`,
        arabic: hadithResult.hadithArabic,
        translation: hadithResult.hadithEnglish,
        reference: `${hadithResult.bookSlug}:${hadithResult.hadithNumber}`,
      });
    }

    toast({
      title: t('search.bookmarked'),
      duration: 2000,
    });
  };

  const handleGoToSource = () => {
    onOpenChange(false);
    
    if (type === 'quran' && quranResult) {
      navigate(`/quran/${quranResult.surahNumber}?verse=${quranResult.verseNumber}`);
    } else if (type === 'hadith' && hadithResult) {
      navigate(`/hadith?collection=${hadithResult.bookSlug}&hadith=${hadithResult.hadithNumber}`);
    }
  };

  const bookmarkId = getBookmarkId();
  const isAlreadyBookmarked = isBookmarked(bookmarkId);

  const content = (
    <div className="flex flex-col h-full">
      {/* Arabic Text */}
      <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-gold/5 rounded-lg p-4 sm:p-6 mb-4">
        <p 
          className="text-xl sm:text-2xl font-arabic text-right leading-[2.2] text-foreground"
          dir="rtl"
        >
          {getArabicText()}
        </p>
      </div>

      {/* Translation */}
      <div className="mb-6 flex-1">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          {language === 'bn' ? 'অনুবাদ' : 'Translation'}
        </h4>
        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          {getTranslation()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
          <Copy className="h-4 w-4" />
          {t('common.copy')}
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
          <Share2 className="h-4 w-4" />
          {t('common.share')}
        </Button>
        <Button 
          variant={isAlreadyBookmarked ? "secondary" : "outline"} 
          size="sm" 
          onClick={handleBookmark} 
          className="gap-2"
        >
          <Bookmark className={`h-4 w-4 ${isAlreadyBookmarked ? 'fill-current' : ''}`} />
          {isAlreadyBookmarked ? t('common.bookmarked') : t('common.bookmark')}
        </Button>
      </div>

      {/* Go to Source Button */}
      <Button onClick={handleGoToSource} className="w-full gap-2">
        <ExternalLink className="h-4 w-4" />
        {t('search.goToSource')}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left pb-2">
            <div className="flex items-center justify-between">
              <Badge 
                className={type === 'quran' 
                  ? 'bg-primary/20 text-primary border-primary/30' 
                  : 'bg-gold/20 text-gold border-gold/30'
                }
              >
                {type === 'quran' ? (
                  <>
                    <BookOpen className="h-3 w-3 mr-1" />
                    {language === 'bn' ? 'কুরআন' : 'Quran'}
                  </>
                ) : (
                  <>
                    <Book className="h-3 w-3 mr-1" />
                    {language === 'bn' ? 'হাদিস' : 'Hadith'}
                  </>
                )}
              </Badge>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
            <DrawerTitle className="text-base mt-2">{getReference()}</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 px-4 pb-6 max-h-[60vh]">
            {content}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Badge 
              className={type === 'quran' 
                ? 'bg-primary/20 text-primary border-primary/30' 
                : 'bg-gold/20 text-gold border-gold/30'
              }
            >
              {type === 'quran' ? (
                <>
                  <BookOpen className="h-3 w-3 mr-1" />
                  {language === 'bn' ? 'কুরআন' : 'Quran'}
                </>
              ) : (
                <>
                  <Book className="h-3 w-3 mr-1" />
                  {language === 'bn' ? 'হাদিস' : 'Hadith'}
                </>
              )}
            </Badge>
            <DialogTitle className="text-lg">{getReference()}</DialogTitle>
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          {content}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SearchResultFullView;
