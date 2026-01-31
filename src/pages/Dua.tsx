import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HandHeart, Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { duas, duaCategories, getDuasByCategory, type DuaItem } from '@/lib/duaData';
import DuaCard from '@/components/dua/DuaCard';

const Dua: React.FC = () => {
  const { t, isEnglish } = useLanguage();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Set category from URL param on mount
  useEffect(() => {
    if (categoryParam) {
      const matchingCategory = duaCategories.find(c => c.id === categoryParam);
      if (matchingCategory) {
        setSelectedCategory(matchingCategory.id);
      }
    }
  }, [categoryParam]);

  const categoryDuas = getDuasByCategory(selectedCategory);
  
  const filteredDuas = categoryDuas.filter((dua) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      dua.title.toLowerCase().includes(query) ||
      dua.titleBn.includes(query) ||
      dua.translation.toLowerCase().includes(query) ||
      dua.translationBn.includes(query) ||
      dua.arabic.includes(query)
    );
  });

  const selectedCategoryInfo = duaCategories.find(c => c.id === selectedCategory);

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 mb-4">
            <HandHeart className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('dua.title')}
          </h1>
          <p className="text-muted-foreground">
            {isEnglish ? 'Essential supplications for daily life' : 'দৈনন্দিন জীবনের জন্য প্রয়োজনীয় দোয়া'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {isEnglish ? `${duas.length} duas available` : `${duas.length}টি দোয়া রয়েছে`}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isEnglish ? 'Search duas...' : 'দোয়া খুঁজুন...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter - Horizontal Scroll */}
        <ScrollArea className="w-full whitespace-nowrap mb-8">
          <div className="flex gap-2 pb-2">
            {duaCategories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`gap-2 shrink-0 ${isSelected ? '' : 'hover:bg-muted'}`}
                >
                  <Icon className="h-4 w-4" />
                  {isEnglish ? category.label : category.labelBn}
                  {category.id !== 'all' && (
                    <span className="text-xs opacity-70">
                      ({getDuasByCategory(category.id).length})
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Category Header */}
        {selectedCategory !== 'all' && selectedCategoryInfo && (
          <div className="mb-6 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${selectedCategoryInfo.color}`}>
              <selectedCategoryInfo.icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {isEnglish ? selectedCategoryInfo.label : selectedCategoryInfo.labelBn}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isEnglish 
                  ? `${filteredDuas.length} duas in this category`
                  : `এই বিভাগে ${filteredDuas.length}টি দোয়া`
                }
              </p>
            </div>
          </div>
        )}

        {/* Duas List */}
        <div className="grid gap-4 max-w-3xl mx-auto">
          {filteredDuas.length > 0 ? (
            filteredDuas.map((dua) => (
              <DuaCard key={dua.id} dua={dua} />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <HandHeart className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>{isEnglish ? 'No duas found' : 'কোনো দোয়া পাওয়া যায়নি'}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dua;
