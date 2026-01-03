import React from 'react';
import { BookOpen, FileText, ScrollText, HandHeart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const QuickStats: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: BookOpen,
      value: '114',
      label: t('stats.surahs'),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: FileText,
      value: '6,236',
      label: t('stats.verses'),
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      icon: ScrollText,
      value: '40+',
      label: t('stats.hadithBooks'),
      color: 'text-amber-500',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    },
    {
      icon: HandHeart,
      value: '100+',
      label: t('stats.duas'),
      color: 'text-rose-500',
      bgColor: 'bg-rose-100 dark:bg-rose-900/30',
    },
  ];

  return (
    <section className="py-10 md:py-14 bg-muted/30">
      <div className="container">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-10 text-foreground">
          {t('stats.title')}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-6 md:p-8 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`${stat.bgColor} p-4 rounded-xl inline-block mb-4`}>
                <stat.icon className={`h-7 w-7 md:h-8 md:w-8 ${stat.color}`} />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickStats;
