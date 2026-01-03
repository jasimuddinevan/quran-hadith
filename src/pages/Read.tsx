import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Read: React.FC = () => {
  const { t, isEnglish } = useLanguage();

  const readingOptions = [
    {
      title: isEnglish ? 'Continue Reading' : 'পড়া চালিয়ে যান',
      description: isEnglish ? 'Resume from where you left off' : 'যেখান থেকে থেমেছিলেন সেখান থেকে শুরু করুন',
      path: '/quran/1',
      icon: '📖',
    },
    {
      title: isEnglish ? 'Read by Surah' : 'সূরা অনুযায়ী পড়ুন',
      description: isEnglish ? 'Browse and select any Surah' : 'যেকোনো সূরা ব্রাউজ করুন ও নির্বাচন করুন',
      path: '/quran',
      icon: '📚',
    },
    {
      title: isEnglish ? 'Read by Juz' : 'পারা অনুযায়ী পড়ুন',
      description: isEnglish ? 'Read by Juz (Para)' : 'পারা অনুযায়ী পড়ুন',
      path: '/quran',
      icon: '📕',
    },
    {
      title: isEnglish ? 'Bookmarked Verses' : 'সংরক্ষিত আয়াত',
      description: isEnglish ? 'View your saved verses' : 'আপনার সংরক্ষিত আয়াত দেখুন',
      path: '/bookmarks',
      icon: '🔖',
    },
  ];

  return (
    <Layout>
      <div className="container py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {isEnglish ? 'Read Quran' : 'কুরআন পড়ুন'}
          </h1>
          <p className="text-muted-foreground">
            {isEnglish ? 'Choose how you want to read' : 'আপনি কিভাবে পড়তে চান নির্বাচন করুন'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {readingOptions.map((option) => (
            <Link key={option.title} to={option.path}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 flex items-start gap-4">
                  <span className="text-3xl">{option.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {option.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/quran">
            <Button size="lg" className="gap-2">
              {isEnglish ? 'Browse All Surahs' : 'সব সূরা দেখুন'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Read;
