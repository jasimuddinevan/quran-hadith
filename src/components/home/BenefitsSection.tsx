import React from 'react';
import { Heart, Moon, Compass, Award, Shield, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

const BenefitsSection: React.FC = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Award,
      title: t('benefits.reward'),
      description: t('benefits.rewardDesc'),
      color: 'text-amber-500',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    },
    {
      icon: Heart,
      title: t('benefits.peace'),
      description: t('benefits.peaceDesc'),
      color: 'text-rose-500',
      bgColor: 'bg-rose-100 dark:bg-rose-900/30',
    },
    {
      icon: Compass,
      title: t('benefits.guidance'),
      description: t('benefits.guidanceDesc'),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Moon,
      title: t('benefits.spirituality'),
      description: t('benefits.spiritualityDesc'),
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    },
    {
      icon: Shield,
      title: t('benefits.protection'),
      description: t('benefits.protectionDesc'),
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      icon: Sparkles,
      title: t('benefits.blessings'),
      description: t('benefits.blessingsDesc'),
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  return (
    <section className="container py-10 md:py-14">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 text-foreground">
        {t('benefits.title')}
      </h2>
      <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
        {t('benefits.subtitle')}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {benefits.map((benefit, index) => (
          <Card 
            key={index} 
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <CardContent className="p-5 md:p-6 text-center">
              <div className={`${benefit.bgColor} p-4 rounded-2xl inline-block mb-4 group-hover:scale-110 transition-transform`}>
                <benefit.icon className={`h-7 w-7 md:h-8 md:w-8 ${benefit.color}`} />
              </div>
              <h3 className="font-semibold text-base md:text-lg text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
