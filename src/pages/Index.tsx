import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import QuickAccessCards from '@/components/home/QuickAccessCards';
import TodayContent from '@/components/home/TodayContent';
import FeaturedSurah from '@/components/home/FeaturedSurah';
import BenefitsSection from '@/components/home/BenefitsSection';
import QuickStats from '@/components/home/QuickStats';
import ExploreMore from '@/components/home/ExploreMore';

const Index: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <QuickAccessCards />
      <TodayContent />
      <FeaturedSurah />
      <BenefitsSection />
      <QuickStats />
      <ExploreMore />
    </Layout>
  );
};

export default Index;
