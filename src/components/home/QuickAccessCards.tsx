import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, HandHeart, Bookmark } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

const QuickAccessCards: React.FC = () => {
  const { t } = useLanguage();

  const cards = [
    {
      icon: Star,
      title: t('quick.namesOfAllah'),
      description: t('quick.namesDesc'),
      path: '/names-of-allah',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      icon: Clock,
      title: t('quick.prayer'),
      description: t('quick.prayerDesc'),
      path: '/prayer',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: HandHeart,
      title: t('quick.duas'),
      description: t('quick.duasDesc'),
      path: '/dua',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      icon: Bookmark,
      title: t('quick.bookmarks'),
      description: t('quick.bookmarksDesc'),
      path: '/bookmarks',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <section className="container py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Link key={card.path} to={card.path}>
            <Card 
              className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                <div className={`${card.iconBg} p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform`}>
                  <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
                <h3 className="font-semibold text-sm md:text-base text-card-foreground mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-muted-foreground hidden md:block">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickAccessCards;
