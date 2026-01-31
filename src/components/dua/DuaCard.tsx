import React, { useState } from 'react';
import { Copy, Bookmark, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { useToast } from '@/hooks/use-toast';
import { getCategoryColor, type DuaItem } from '@/lib/duaData';
import { cn } from '@/lib/utils';

interface DuaCardProps {
  dua: DuaItem;
}

const DuaCard: React.FC<DuaCardProps> = ({ dua }) => {
  const { isEnglish } = useLanguage();
  const { addBookmark } = useBookmarks();
  const { toast } = useToast();
  const [showFull, setShowFull] = useState(false);

  const isLongArabic = dua.arabic.length > 150;
  const Icon = dua.icon;
  const categoryColor = getCategoryColor(dua.category);

  const handleCopy = () => {
    const text = `${dua.arabic}\n\n${dua.transliteration}\n\n${isEnglish ? dua.translation : dua.translationBn}\n\n- ${dua.reference}`;
    navigator.clipboard.writeText(text);
    toast({
      title: isEnglish ? 'Copied!' : 'কপি হয়েছে!',
      description: isEnglish ? 'Dua copied to clipboard' : 'দোয়া ক্লিপবোর্ডে কপি হয়েছে',
    });
  };

  const handleBookmark = () => {
    addBookmark({
      type: 'dua',
      title: isEnglish ? dua.title : dua.titleBn,
      arabic: dua.arabic,
      translation: isEnglish ? dua.translation : dua.translationBn,
      reference: dua.reference,
    });
    toast({
      title: isEnglish ? 'Bookmarked!' : 'বুকমার্ক হয়েছে!',
      description: isEnglish ? 'Dua added to bookmarks' : 'দোয়া বুকমার্কে যোগ হয়েছে',
    });
  };

  const handleShare = async () => {
    const text = `${dua.arabic}\n\n${dua.transliteration}\n\n${isEnglish ? dua.translation : dua.translationBn}\n\n- ${dua.reference}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-start justify-between p-4 pb-3 border-b border-border/30 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${categoryColor}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {isEnglish ? dua.title : dua.titleBn}
              </h3>
              <Badge variant="secondary" className="text-xs mt-1">
                {isEnglish ? dua.category : dua.categoryBn}
              </Badge>
            </div>
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
          <div>
            <div 
              className={cn(
                "p-4 rounded-lg bg-gradient-to-br from-emerald-50/80 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30 relative",
                isLongArabic && !showFull && "max-h-28 overflow-hidden"
              )}
            >
              <p className="arabic-text text-2xl text-right leading-[2.2] text-foreground font-medium">
                {dua.arabic}
              </p>
              
              {isLongArabic && !showFull && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-emerald-100 dark:from-emerald-950 to-transparent pointer-events-none" />
              )}
            </div>
            
            {isLongArabic && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowFull(prev => !prev);
                }}
              >
                {showFull ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    {isEnglish ? 'Show less' : 'কম দেখুন'}
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    {isEnglish ? 'Show full' : 'সম্পূর্ণ দেখুন'}
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Transliteration */}
          <p className="text-sm text-primary italic leading-relaxed">
            {dua.transliteration}
          </p>

          {/* Translation */}
          <div>
            <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
              {isEnglish ? 'Translation' : 'অনুবাদ'}
            </p>
            <p className="text-foreground leading-relaxed">
              {isEnglish ? dua.translation : dua.translationBn}
            </p>
          </div>

          {/* Reference */}
          <p className="text-xs text-muted-foreground border-t border-border/30 pt-3">
            {isEnglish ? 'Source' : 'সূত্র'}: {dua.reference}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DuaCard;
