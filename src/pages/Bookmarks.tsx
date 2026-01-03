import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookOpen, Book, HandHeart, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBookmarks, Bookmark as BookmarkType } from '@/contexts/BookmarkContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Bookmarks: React.FC = () => {
  const { isEnglish } = useLanguage();
  const { bookmarks, removeBookmark, getBookmarksByType } = useBookmarks();
  const { toast } = useToast();

  const verses = getBookmarksByType('verse');
  const hadiths = getBookmarksByType('hadith');
  const duas = getBookmarksByType('dua');

  const handleRemove = (id: string) => {
    removeBookmark(id);
    toast({
      title: isEnglish ? 'Removed' : 'মুছে ফেলা হয়েছে',
      description: isEnglish ? 'Bookmark removed' : 'বুকমার্ক মুছে ফেলা হয়েছে',
    });
  };

  const getIcon = (type: BookmarkType['type']) => {
    switch (type) {
      case 'verse':
        return BookOpen;
      case 'hadith':
        return Book;
      case 'dua':
        return HandHeart;
      default:
        return Bookmark;
    }
  };

  const getColor = (type: BookmarkType['type']) => {
    switch (type) {
      case 'verse':
        return 'text-primary bg-primary/10';
      case 'hadith':
        return 'text-amber-600 bg-amber-500/10';
      case 'dua':
        return 'text-green-600 bg-green-500/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const renderBookmarkCard = (bookmark: BookmarkType) => {
    const Icon = getIcon(bookmark.type);
    const colorClass = getColor(bookmark.type);

    return (
      <Card key={bookmark.id}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{bookmark.title}</h3>
                <Badge variant="secondary" className="text-xs mt-1">
                  {bookmark.type === 'verse' 
                    ? (isEnglish ? 'Verse' : 'আয়াত')
                    : bookmark.type === 'hadith'
                    ? (isEnglish ? 'Hadith' : 'হাদিস')
                    : (isEnglish ? 'Dua' : 'দোয়া')}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(bookmark.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {bookmark.arabic && (
            <p className="arabic-text text-xl text-right leading-loose text-foreground mb-3">
              {bookmark.arabic}
            </p>
          )}

          {bookmark.translation && (
            <p className="text-sm text-muted-foreground mb-2">
              {bookmark.translation}
            </p>
          )}

          <p className="text-xs text-muted-foreground border-t border-border pt-2">
            {bookmark.reference}
          </p>
        </CardContent>
      </Card>
    );
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12">
      <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-purple-500/10 mb-4">
            <Bookmark className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isEnglish ? 'Bookmarks' : 'বুকমার্ক'}
          </h1>
          <p className="text-muted-foreground">
            {isEnglish ? 'Your saved items' : 'আপনার সংরক্ষিত আইটেম'}
            {bookmarks.length > 0 && ` (${bookmarks.length})`}
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="max-w-md mx-auto">
            <EmptyState 
              message={isEnglish 
                ? 'No bookmarks yet. Start saving verses, hadith, and duas!' 
                : 'এখনও কোনো বুকমার্ক নেই। আয়াত, হাদিস এবং দোয়া সংরক্ষণ শুরু করুন!'} 
            />
            <div className="flex flex-col gap-3 mt-6">
              <Link to="/quran">
                <Button variant="outline" className="w-full gap-2">
                  <BookOpen className="h-4 w-4" />
                  {isEnglish ? 'Explore Quran' : 'কুরআন দেখুন'}
                </Button>
              </Link>
              <Link to="/hadith">
                <Button variant="outline" className="w-full gap-2">
                  <Book className="h-4 w-4" />
                  {isEnglish ? 'Browse Hadith' : 'হাদিস দেখুন'}
                </Button>
              </Link>
              <Link to="/dua">
                <Button variant="outline" className="w-full gap-2">
                  <HandHeart className="h-4 w-4" />
                  {isEnglish ? 'View Duas' : 'দোয়া দেখুন'}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">
                  {isEnglish ? 'All' : 'সব'} ({bookmarks.length})
                </TabsTrigger>
                <TabsTrigger value="verses">
                  {isEnglish ? 'Verses' : 'আয়াত'} ({verses.length})
                </TabsTrigger>
                <TabsTrigger value="hadith">
                  {isEnglish ? 'Hadith' : 'হাদিস'} ({hadiths.length})
                </TabsTrigger>
                <TabsTrigger value="duas">
                  {isEnglish ? 'Duas' : 'দোয়া'} ({duas.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {bookmarks.map(renderBookmarkCard)}
              </TabsContent>

              <TabsContent value="verses" className="space-y-4">
                {verses.length > 0 ? (
                  verses.map(renderBookmarkCard)
                ) : (
                  <EmptyState 
                    message={isEnglish ? 'No saved verses' : 'কোনো সংরক্ষিত আয়াত নেই'} 
                  />
                )}
              </TabsContent>

              <TabsContent value="hadith" className="space-y-4">
                {hadiths.length > 0 ? (
                  hadiths.map(renderBookmarkCard)
                ) : (
                  <EmptyState 
                    message={isEnglish ? 'No saved hadith' : 'কোনো সংরক্ষিত হাদিস নেই'} 
                  />
                )}
              </TabsContent>

              <TabsContent value="duas" className="space-y-4">
                {duas.length > 0 ? (
                  duas.map(renderBookmarkCard)
                ) : (
                  <EmptyState 
                    message={isEnglish ? 'No saved duas' : 'কোনো সংরক্ষিত দোয়া নেই'} 
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Bookmarks;
