import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, BookMarked, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ExploreMore: React.FC = () => {
  const { t } = useLanguage();

  const exploreItems = [
    {
      icon: Star,
      title: t('explore.namesOfAllah'),
      description: t('explore.namesOfAllahDesc'),
      path: '/names-of-allah',
      color: 'text-amber-500',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    },
    {
      icon: Calendar,
      title: t('explore.prayerTimes'),
      description: t('explore.prayerTimesDesc'),
      path: '/prayer',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: BookMarked,
      title: t('explore.bookmarks'),
      description: t('explore.bookmarksDesc'),
      path: '/bookmarks',
      color: 'text-rose-500',
      bgColor: 'bg-rose-100 dark:bg-rose-900/30',
    },
  ];

  return (
    <section className="container py-10 md:py-14">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 text-foreground">
        {t('explore.title')}
      </h2>
      <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
        {t('explore.subtitle')}
      </p>

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {exploreItems.map((item, index) => (
          <Link key={index} to={item.path}>
            <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-6 md:p-8">
                <div className={`${item.bgColor} p-4 rounded-2xl inline-block mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                </div>
                <h3 className="font-semibold text-lg md:text-xl text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {item.description}
                </p>
                <Button variant="ghost" className="p-0 h-auto text-primary group-hover:gap-3 transition-all">
                  {t('explore.learnMore')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ExploreMore;
