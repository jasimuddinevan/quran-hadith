import React from 'react';
import { ChevronRight, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import type { CollectionMetadata } from '@/lib/hadithApi';

interface SectionListProps {
  metadata: CollectionMetadata | null;
  isLoading: boolean;
  onSelectSection: (sectionNumber: number, sectionName: string) => void;
}

const SectionList: React.FC<SectionListProps> = ({ metadata, isLoading, onSelectSection }) => {
  const { isEnglish } = useLanguage();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {isEnglish ? 'No sections found' : 'কোনো অধ্যায় পাওয়া যায়নি'}
      </div>
    );
  }

  const sections = Object.entries(metadata.sections)
    .filter(([key, value]) => key !== '0' && value)
    .map(([key, value]) => ({
      number: parseInt(key),
      name: value,
      hadithCount: metadata.section_details[key] 
        ? metadata.section_details[key].hadithnumber_last - metadata.section_details[key].hadithnumber_first + 1
        : 0
    }));

  return (
    <div className="space-y-2">
      {sections.map((section) => (
        <Card
          key={section.number}
          className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group"
          onClick={() => onSelectSection(section.number, section.name)}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {section.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {isEnglish ? `Chapter ${section.number}` : `অধ্যায় ${section.number}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                {section.hadithCount} {isEnglish ? 'hadiths' : 'হাদিস'}
              </Badge>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SectionList;
