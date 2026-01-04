import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FeaturedSurah: React.FC = () => {
  const { t, isEnglish } = useLanguage();

  return (
    <section className="container py-10 md:py-14">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-10 text-foreground">
        {t('featured.title')}
      </h2>

      <Card className="overflow-hidden card-gradient-teal border-primary/20">
        <CardContent className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Icon */}
            <div className="bg-primary/10 p-6 rounded-2xl">
              <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-primary" />
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                {t('featured.surahName')}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t('featured.surahDesc')}
              </p>
              
              {/* Arabic Preview */}
              <p className="arabic-text text-2xl md:text-3xl text-foreground leading-loose mb-4">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-muted-foreground text-sm md:text-base mb-6">
                {isEnglish 
                  ? 'In the name of Allah, the Most Gracious, the Most Merciful'
                  : 'পরম করুণাময় অতি দয়ালু আল্লাহর নামে'}
              </p>

              <Link to="/quran">
                <Button size="lg" className="gap-2">
                  {t('featured.readNow')}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FeaturedSurah;
