import React from 'react';
import { Book, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { type HadithCollection } from '@/lib/hadithApi';

interface CollectionCardProps {
  collection: HadithCollection;
  onClick: () => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onClick }) => {
  const { isEnglish } = useLanguage();

  return (
    <Card 
      className="hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 group-hover:from-amber-500/30 group-hover:to-amber-600/20 transition-colors">
              <Book className="h-6 w-6 text-amber-600" />
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
          
          <p className="arabic-text text-xl text-primary mb-2 leading-relaxed">
            {collection.nameAr}
          </p>
          
          <h3 className="font-semibold text-foreground text-lg mb-1">
            {isEnglish ? collection.name : collection.nameBn}
          </h3>
          
          <p className="text-sm text-muted-foreground">
            {collection.count.toLocaleString()} {isEnglish ? 'hadiths' : 'হাদিস'}
          </p>
        </div>
        
        {/* Bottom accent bar */}
        <div className="h-1 bg-gradient-to-r from-amber-500/50 via-primary/50 to-amber-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      </CardContent>
    </Card>
  );
};

export default CollectionCard;
