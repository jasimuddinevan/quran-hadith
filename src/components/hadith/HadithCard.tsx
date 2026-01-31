import React from 'react';
import { Copy, Bookmark, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { useToast } from '@/hooks/use-toast';
import { getCollectionName, type HadithResponse } from '@/lib/hadithApi';

interface HadithCardProps {
  hadith: HadithResponse;
  showCollection?: boolean;
}

const HadithCard: React.FC<HadithCardProps> = ({ hadith, showCollection = true }) => {
  const { isEnglish, isBengali } = useLanguage();
  const { addBookmark } = useBookmarks();
  const { toast } = useToast();

  const handleCopy = () => {
    const displayText = isBengali && hadith.hadithBengali ? hadith.hadithBengali : hadith.hadithEnglish;
    const text = `${displayText}\n\n- ${getCollectionName(hadith.bookSlug, isEnglish ? 'en' : 'bn')} #${hadith.hadithNumber}`;
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
      arabic: '',
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
    const text = `${displayText}\n\n- ${getCollectionName(hadith.bookSlug, isEnglish ? 'en' : 'bn')} #${hadith.hadithNumber}`;
    
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
          {/* Main Text */}
          <p className="text-foreground leading-relaxed text-[15px]">
            {isBengali && hadith.hadithBengali ? hadith.hadithBengali : hadith.hadithEnglish}
          </p>

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
