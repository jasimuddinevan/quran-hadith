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
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      icon: Clock,
      title: t('quick.prayer'),
      description: t('quick.prayerDesc'),
      path: '/prayer',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-500 dark:text-orange-400',
    },
    {
      icon: HandHeart,
      title: t('quick.duas'),
      description: t('quick.duasDesc'),
      path: '/dua',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      icon: Bookmark,
      title: t('quick.bookmarks'),
      description: t('quick.bookmarksDesc'),
      path: '/bookmarks',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
  ];

  return (
    <section className="container py-8 md:py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, index) => (
          <Link key={card.path} to={card.path}>
            <Card 
              className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group card-gradient-teal border-primary/10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-5 md:p-8 flex flex-col items-center text-center">
                <div className={`${card.iconBg} p-4 md:p-5 rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  <card.icon className={`h-8 w-8 md:h-10 md:w-10 ${card.iconColor}`} />
                </div>
                <h3 className="font-semibold text-base md:text-lg text-card-foreground mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground hidden md:block">
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
