import React, { useState } from 'react';
import { Copy, Bookmark, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { useToast } from '@/hooks/use-toast';
import { getCollectionName, type HadithResponse } from '@/lib/hadithApi';
import { cn } from '@/lib/utils';

interface HadithCardProps {
  hadith: HadithResponse;
  showCollection?: boolean;
}

const HadithCard: React.FC<HadithCardProps> = ({ hadith, showCollection = true }) => {
  const { isEnglish, isBengali } = useLanguage();
  const { addBookmark } = useBookmarks();
  const { toast } = useToast();
  const [showFullArabic, setShowFullArabic] = useState(false);

  const hasArabic = hadith.hadithArabic && hadith.hadithArabic.length > 0;
  const isLongArabic = hasArabic && hadith.hadithArabic.length > 300;

  const handleCopy = () => {
    const displayText = isBengali && hadith.hadithBengali ? hadith.hadithBengali : hadith.hadithEnglish;
    const arabicText = hasArabic ? `${hadith.hadithArabic}\n\n` : '';
    const text = `${arabicText}${displayText}\n\n- ${getCollectionName(hadith.bookSlug, isEnglish ? 'en' : 'bn')} #${hadith.hadithNumber}`;
    navigator.clipboard.writeText(text);
    toast({
      title: isEnglish ? 'Copied!' : 'কপি হয়েছে!',
      description: isEnglish ? 'Hadith copied to clipboard' : 'হাদিস ক্লিপবোর্ডে কপি হয়েছে',
    });
  };

  const handleBookmark = () => {
    addBookmark({
      type: 'hadith',
      title: getCollectionName(hadith.bookSlug, isEnglish ? 'en' : 'bn'),
      arabic: hadith.hadithArabic || '',
      translation: isBengali && hadith.hadithBengali ? hadith.hadithBengali : hadith.hadithEnglish,
      reference: `Hadith #${hadith.hadithNumber}`,
    });
    toast({
      title: isEnglish ? 'Bookmarked!' : 'বুকমার্ক হয়েছে!',
      description: isEnglish ? 'Hadith added to bookmarks' : 'হাদিস বুকমার্কে যোগ হয়েছে',
    });
  };

  const handleShare = async () => {
    const displayText = isBengali && hadith.hadithBengali ? hadith.hadithBengali : hadith.hadithEnglish;
    const arabicText = hasArabic ? `${hadith.hadithArabic}\n\n` : '';
    const text = `${arabicText}${displayText}\n\n- ${getCollectionName(hadith.bookSlug, isEnglish ? 'en' : 'bn')} #${hadith.hadithNumber}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-3 border-b border-border/30 bg-muted/30">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-medium bg-primary/10 text-primary border-0">
              #{hadith.hadithNumber}
            </Badge>
            {showCollection && (
              <span className="text-sm text-muted-foreground">
                {getCollectionName(hadith.bookSlug, isEnglish ? 'en' : 'bn')}
              </span>
            )}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleBookmark}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Arabic Text */}
          {hasArabic && (
            <div>
              <div 
                className={cn(
                  "p-4 rounded-lg bg-gradient-to-br from-amber-50/80 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/50 dark:border-amber-800/30 relative",
                  isLongArabic && !showFullArabic && "max-h-32 overflow-hidden"
                )}
              >
                <p className="arabic-text text-xl md:text-2xl text-right leading-[2.2] text-foreground font-medium">
                  {hadith.hadithArabic}
                </p>
                
                {/* Fade overlay for long text - inside the container */}
                {isLongArabic && !showFullArabic && (
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-100 dark:from-amber-950 to-transparent pointer-events-none" />
                )}
              </div>
              
              {/* Show more/less button */}
              {isLongArabic && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-amber-900/30"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowFullArabic(prev => !prev);
                  }}
                >
                  {showFullArabic ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      {isEnglish ? 'Show less' : 'কম দেখুন'}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      {isEnglish ? 'Show full Arabic' : 'সম্পূর্ণ আরবি দেখুন'}
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Translation */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
              {isBengali ? 'বাংলা অনুবাদ' : 'Translation'}
            </p>
            <p className="text-foreground leading-relaxed text-[15px]">
              {isBengali && hadith.hadithBengali ? hadith.hadithBengali : hadith.hadithEnglish}
            </p>
          </div>

          {/* Chapter Info */}
          {hadith.chapterTitle && (
            <div className="pt-3 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">{isEnglish ? 'Chapter' : 'অধ্যায়'}:</span> {hadith.chapterTitle}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HadithCard;
